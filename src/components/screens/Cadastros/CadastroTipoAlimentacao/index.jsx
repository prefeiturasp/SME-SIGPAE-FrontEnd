import React, { Component, Fragment } from "react";
import HTTP_STATUS from "http-status-codes";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadTipoAlimentacao } from "../../../../reducers/tipoAlimentacaoReducer";
import { Select } from "../../../Shareable/Select";
import Wizard from "../../../Shareable/Wizard";
import {
  getVinculosTipoAlimentacaoPorUnidadeEscolar,
  getTiposDeAlimentacao,
  createVinculoTipoAlimentacaoPeriodoEscolar,
  createVinculoSubstituicaoPeriodoEscolar,
  deleteVinculoTipoAlimentacaoPeriodoEscolar,
  deleteSubstituicaoTipoAlimentacaoPeriodoEscolar
} from "../../../../services/cadastroTipoAlimentacao.service";
import {
  montaTipoUnidadeEscolar,
  montaLabelCombo,
  podeAdicionarElemento,
  // modificacoes
  estruturarDadosTiposDeAlimentacao,
  verificaSeFormularioOuRelatorioEhApresentado
} from "./helper";
import "./style.scss";
import { toastError } from "../../../Shareable/Toast/dialogs";
import Botao from "../../../Shareable/Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "../../../Shareable/Botao/constants";
import ModalExcluirComboTipoAlimentacao from "./components/ModalExcluirComboTipoAlimentacao";

class CadastroTipoAlimentacao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periodoEscolar: 0,
      unidadesEscolares: null,
      uuidUnidadeEscolar: null,
      vinculosTiposAlimentacao: null,
      exibirRelatorio: null,
      tiposAlimentacao: null,
      tipoAlimentacaoAtual: 0,
      exibeFormularioInicial: true,
      vinculoCombo: null,
      // excluir Combo Tipo Alimentacao
      showModalExcluirTipoAlimentacao: false,
      comboParaExcluir: null,
      indiceParaExcluir: null
    };
    this.closeModalExcluirTipoAlimentacao = this.closeModalExcluirTipoAlimentacao.bind(
      this
    );
    this.deletaComboTipoAlimentacao = this.deletaComboTipoAlimentacao.bind(
      this
    );
  }

  componentDidMount() {
    let tiposAlimentacao = this.state.tiposAlimentacao;
    if (!tiposAlimentacao) {
      getTiposDeAlimentacao().then(response => {
        this.setState({ tiposAlimentacao: response.results });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let unidadesEscolares = this.state.unidadesEscolares;
    let uuidUnidadeEscolar = this.state.uuidUnidadeEscolar;
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;

    // busca todas as unidades escolares no banco
    if (unidadesEscolares === null && this.props.tiposUnidadesEscolar) {
      unidadesEscolares = montaTipoUnidadeEscolar(
        this.props.tiposUnidadesEscolar
      );
      this.setState({ unidadesEscolares });
    }

    //  ao selecionar a unidade escolar, faz o filtro das alimentacoes no banco
    if (
      uuidUnidadeEscolar !== prevState.uuidUnidadeEscolar &&
      vinculosTiposAlimentacao === prevState.vinculosTiposAlimentacao
    ) {
      getVinculosTipoAlimentacaoPorUnidadeEscolar(uuidUnidadeEscolar).then(
        response => {
          if (response.results.length === 0) {
            this.setState({ uuidUnidadeEscolar: null });
            toastError("Nenhum registro associado ao tipo de unidade escolar");
          } else {
            vinculosTiposAlimentacao = estruturarDadosTiposDeAlimentacao(
              response.results
            );
            const exibirRelatorio = verificaSeFormularioOuRelatorioEhApresentado(
              vinculosTiposAlimentacao
            );
            this.setState({
              vinculosTiposAlimentacao,
              exibirRelatorio
            });
          }
        }
      );
    }
  }

  showModalExcluirTipoAlimentacao(combo, indice) {
    this.setState({
      comboParaExcluir: combo,
      indiceParaExcluir: indice,
      showModalExcluirTipoAlimentacao: true
    });
  }

  closeModalExcluirTipoAlimentacao() {
    this.setState({ showModalExcluirTipoAlimentacao: false });
  }

  acrescentaCompoVazioASubstituicoes = substituicaoAtual => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    let periodoEscolar = this.state.periodoEscolar;
    let tipoAlimentacaoAtual = this.state.tipoAlimentacaoAtual;

    if (substituicaoAtual.uuid) {
      vinculosTiposAlimentacao[periodoEscolar].combos[
        tipoAlimentacaoAtual
      ].substituicoes.push({
        uuid: null,
        tipos_alimentacao: [],
        combo: substituicaoAtual.combo,
        label: "",
        adicionar: true
      });
      this.setState({ vinculosTiposAlimentacao });
    } else {
      this.enviarComboSubstituicao(substituicaoAtual);
    }
  };

  enviarComboSubstituicao = substituicaoAtual => {
    const periodoEscolar = this.state.periodoEscolar;
    const tipoAlimentacaoAtual = this.state.tipoAlimentacaoAtual;
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    const request = {
      tipos_alimentacao: substituicaoAtual.tipos_alimentacao,
      combo: substituicaoAtual.combo
    };
    createVinculoSubstituicaoPeriodoEscolar(request).then(response => {
      if (response.status === HTTP_STATUS.BAD_REQUEST) {
        toastError(response.data.tipos_alimentacao[0]);
      } else {
        substituicaoAtual.adicionar = false;
        substituicaoAtual.uuid = response.data.uuid;
        vinculosTiposAlimentacao[periodoEscolar].combos[
          tipoAlimentacaoAtual
        ].substituicoes.push({
          label: "",
          tipos_alimentacao: [],
          combo: response.data.combo,
          adicionar: true
        });
        this.setState({ vinculosTiposAlimentacao });
      }
    });
  };

  adicionaSubstituicaoAoCombo = tipoAlimentacao => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    let periodoEscolar = this.state.periodoEscolar;
    let tipoAlimentacaoAtual = this.state.tipoAlimentacaoAtual;
    vinculosTiposAlimentacao[periodoEscolar].combos[
      tipoAlimentacaoAtual
    ].substituicoes.forEach(substituicao => {
      if (
        substituicao.adicionar &&
        podeAdicionarElemento(substituicao, tipoAlimentacao)
      ) {
        substituicao.tipos_alimentacao.push(tipoAlimentacao.uuid);
        montaLabelCombo(substituicao, tipoAlimentacao.nome);
      }
    });
    this.setState({ vinculosTiposAlimentacao });
  };

  adicionaTipoAlimentacaoAoCombo = tipoAlimentacao => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    const periodoEscolar = this.state.periodoEscolar;
    vinculosTiposAlimentacao[periodoEscolar].combos.forEach(combo => {
      if (combo.adicionar && podeAdicionarElemento(combo, tipoAlimentacao)) {
        combo.tipos_alimentacao.push(tipoAlimentacao.uuid);
        montaLabelCombo(combo, tipoAlimentacao.nome);
      }
    });
    this.setState({ vinculosTiposAlimentacao });
  };

  enviarComboTipoAlimentacao = (comboAtual, indice) => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    const periodoEscolar = this.state.periodoEscolar;
    const request = {
      tipos_alimentacao: comboAtual.tipos_alimentacao,
      vinculo: comboAtual.vinculo
    };
    createVinculoTipoAlimentacaoPeriodoEscolar(request).then(response => {
      if (response.status === HTTP_STATUS.BAD_REQUEST) {
        toastError(response.data.tipos_alimentacao[0]);
      } else {
        vinculosTiposAlimentacao[periodoEscolar].combos.forEach(combo => {
          combo.substituicoes.forEach(substituicao => {
            substituicao.combo = response.data.uuid;
          });
        });
        this.setState({
          vinculoCombo: response.data.uuid,
          vinculosTiposAlimentacao
        });
        vinculosTiposAlimentacao[periodoEscolar].combos[
          indice
        ].adicionar = false;
        vinculosTiposAlimentacao[periodoEscolar].combos[indice].uuid =
          response.data.uuid;
        vinculosTiposAlimentacao[periodoEscolar].combos.push({
          uuid: null,
          tipos_alimentacao: [],
          vinculo: comboAtual.vinculo,
          substituicoes: [
            {
              uuid: null,
              tipos_alimentacao: [],
              combo: comboAtual.vinculo,
              label: "",
              adicionar: true
            }
          ],
          label: "",
          adicionar: true
        });
        this.setState({ vinculosTiposAlimentacao });
      }
    });
  };

  validaESalvaOUltimoElemento = vinculoTipoAlimentacao => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    const periodoEscolar = this.state.periodoEscolar;
    const request = {
      tipos_alimentacao: vinculoTipoAlimentacao.tipos_alimentacao,
      vinculo: vinculoTipoAlimentacao.vinculo
    };
    if (vinculoTipoAlimentacao.uuid === null) {
      createVinculoTipoAlimentacaoPeriodoEscolar(request).then(response => {
        if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(response.data.tipos_alimentacao[0]);
        } else {
          this.setState({ vinculoCombo: response.data.uuid });
          vinculosTiposAlimentacao[periodoEscolar].combos[
            vinculosTiposAlimentacao[periodoEscolar].combos.length - 1
          ].adicionar = false;
          vinculosTiposAlimentacao[periodoEscolar].combos[
            vinculosTiposAlimentacao[periodoEscolar].combos.length - 1
          ].uuid = response.data.uuid;
          vinculosTiposAlimentacao[periodoEscolar].combos[
            vinculosTiposAlimentacao[periodoEscolar].combos.length - 1
          ].substituicoes.forEach(substituicao => {
            substituicao.combo = response.data.uuid;
          });
          this.setState({
            vinculosTiposAlimentacao,
            exibeFormularioInicial: false
          });
        }
      });
    } else {
      this.setState({
        exibeFormularioInicial: false,
        vinculosTiposAlimentacao
      });
      vinculosTiposAlimentacao[periodoEscolar].combos.forEach(combo => {
        combo.substituicoes.forEach(substituicao => {
          substituicao.combo = combo.uuid;
        });
      });
      this.setState({ vinculosTiposAlimentacao });
    }
  };

  acrescentaCampoVazio = comboAtual => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    const periodoEscolar = this.state.periodoEscolar;
    vinculosTiposAlimentacao[periodoEscolar].combos.push({
      uuid: null,
      tipos_alimentacao: [],
      vinculo: comboAtual.vinculo,
      substituicoes: [
        {
          uuid: null,
          tipos_alimentacao: [],
          combo: comboAtual.vinculo,
          label: "",
          adicionar: true
        }
      ],
      label: "",
      adicionar: true
    });
    this.setState({ vinculosTiposAlimentacao });
  };

  apagarCampoComboTipoAlimentacao = (indice, combo) => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    const periodoEscolar = this.state.periodoEscolar;
    if (vinculosTiposAlimentacao[periodoEscolar].combos.length === 1) {
      combo.tipos_alimentacao = [];
      combo.label = "";
      vinculosTiposAlimentacao[periodoEscolar].combos.push(combo);
      vinculosTiposAlimentacao[periodoEscolar].combos.splice(indice, 1);
    } else {
      vinculosTiposAlimentacao[periodoEscolar].combos.splice(indice, 1);
    }
    this.setState({ vinculosTiposAlimentacao });
  };

  deletarCombo = (combo, indice) => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    const periodoEscolar = this.state.periodoEscolar;
    if (vinculosTiposAlimentacao[periodoEscolar].combos.length === 1) {
      combo.tipos_alimentacao = [];
      combo.label = "";
      combo.uuid = null;
      combo.adicionar = true;
      vinculosTiposAlimentacao[periodoEscolar].combos.push(combo);
      vinculosTiposAlimentacao[periodoEscolar].combos.splice(indice, 1);
    } else {
      vinculosTiposAlimentacao[periodoEscolar].combos.splice(indice, 1);
    }
    this.setState({ vinculosTiposAlimentacao });
  };

  deletaComboTipoAlimentacao = (combo, indice) => {
    if (!combo.uuid) {
      this.deletarCombo(combo, indice);
    } else {
      deleteVinculoTipoAlimentacaoPeriodoEscolar(combo.uuid).then(response => {
        if (
          response === HTTP_STATUS.BAD_REQUEST ||
          response === HTTP_STATUS.FORBIDDEN
        ) {
          toastError("Tipo de alimentação já está vinculado a um registro");
        } else {
          this.deletarCombo(combo, indice);
        }
      });
    }
  };

  apagaUnicaSubstituicao = substituicao => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    const tipoAlimentacaoAtual = this.state.tipoAlimentacaoAtual;
    const periodoEscolar = this.state.periodoEscolar;
    deleteSubstituicaoTipoAlimentacaoPeriodoEscolar(substituicao.uuid).then(
      response => {
        if (
          response === HTTP_STATUS.BAD_REQUEST ||
          response === HTTP_STATUS.FORBIDDEN
        ) {
          toastError("Não foi possivel deletar registro do sistema!");
        } else {
          vinculosTiposAlimentacao[periodoEscolar].combos[
            tipoAlimentacaoAtual
          ].substituicoes.splice(0, 1);
          vinculosTiposAlimentacao[periodoEscolar].combos[
            tipoAlimentacaoAtual
          ].substituicoes.push({
            uuid: null,
            tipos_alimentacao: [],
            combo: null,
            label: ""
          });
          this.setState({ vinculosTiposAlimentacao });
        }
      }
    );
  };

  apagaSubstituicao = (substituicao, indice) => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    const tipoAlimentacaoAtual = this.state.tipoAlimentacaoAtual;
    const periodoEscolar = this.state.periodoEscolar;
    deleteSubstituicaoTipoAlimentacaoPeriodoEscolar(substituicao.uuid).then(
      response => {
        if (
          response === HTTP_STATUS.BAD_REQUEST ||
          response === HTTP_STATUS.FORBIDDEN
        ) {
          toastError("Não foi possivel deletar registro do sistema!");
        } else {
          vinculosTiposAlimentacao[periodoEscolar].combos[
            tipoAlimentacaoAtual
          ].substituicoes.splice(indice, 1);
          this.setState({ vinculosTiposAlimentacao });
        }
      }
    );
  };

  setaColapsoRelatorio = indice => {
    let vinculosTiposAlimentacao = this.state.vinculosTiposAlimentacao;
    vinculosTiposAlimentacao.forEach((vinculo, indiceVinculo) => {
      if (indiceVinculo !== indice) {
        vinculo.periodo_escolar.ativo = false;
      } else {
        vinculo.periodo_escolar.ativo = !vinculo.periodo_escolar.ativo;
      }
    });
    this.setState({ vinculosTiposAlimentacao });
  };

  render() {
    const {
      unidadesEscolares,
      uuidUnidadeEscolar,
      vinculosTiposAlimentacao,
      exibirRelatorio,
      periodoEscolar,
      tiposAlimentacao,
      exibeFormularioInicial,
      tipoAlimentacaoAtual,
      showModalExcluirTipoAlimentacao,
      comboParaExcluir,
      indiceParaExcluir
    } = this.state;
    const { handleSubmit } = this.props;
    return (
      <Fragment>
        <ModalExcluirComboTipoAlimentacao
          closeModal={this.closeModalExcluirTipoAlimentacao}
          showModal={showModalExcluirTipoAlimentacao}
          deletaComboTipoAlimentacao={this.deletaComboTipoAlimentacao}
          combo={comboParaExcluir && comboParaExcluir}
          indice={indiceParaExcluir && indiceParaExcluir}
        />
        <div className="card mt-3">
          <div className="card-body formulario-tipo-alimentacao">
            <form onSubmit={handleSubmit}>
              {!exibirRelatorio && (
                <Fragment>
                  <section className="header">
                    Cruzamento das possibilidades
                  </section>
                  <section className="tipos-de-unidade">
                    <header>Tipos de Unidades</header>
                    <article>
                      <Field
                        component={Select}
                        name="tipos_unidades"
                        options={unidadesEscolares ? unidadesEscolares : []}
                        onChange={event => {
                          this.setState({
                            uuidUnidadeEscolar: event.target.value
                          });
                        }}
                        disabled={uuidUnidadeEscolar}
                      />
                    </article>
                  </section>
                </Fragment>
              )}
              <section>
                {uuidUnidadeEscolar !== null &&
                  vinculosTiposAlimentacao !== null &&
                  (exibirRelatorio !== null ? (
                    exibirRelatorio ? (
                      <section className="relatorio-tipos-alimentacoes">
                        <header>Resumo do cadastro</header>
                        <article>
                          <header>Tipos de períodos</header>
                          {vinculosTiposAlimentacao.map((vinculo, indice) => {
                            return (
                              <div key={indice} className="periodo-fechado">
                                <header
                                  className={`titulo-periodo-tipo-ue ${vinculo
                                    .periodo_escolar.ativo && "titulo-ativo"}`}
                                >
                                  <div className="descricao-periodo-tipo-ue">
                                    {vinculo.periodo_escolar.nome}
                                  </div>{" "}
                                  <nav>
                                    {vinculo.periodo_escolar.ativo ? (
                                      <div
                                        onClick={() => {
                                          this.setState({
                                            periodoEscolar: indice,
                                            exibirRelatorio: false
                                          });
                                        }}
                                      >
                                        <i className="fas fa-pen editar" />
                                      </div>
                                    ) : (
                                      <div />
                                    )}
                                    <div
                                      onClick={() =>
                                        this.setaColapsoRelatorio(indice)
                                      }
                                    >
                                      {vinculo.periodo_escolar.ativo ? (
                                        <i className="fas fa-angle-up" />
                                      ) : (
                                        <i className="fas fa-angle-down" />
                                      )}
                                    </div>
                                  </nav>
                                </header>
                                {vinculo.periodo_escolar.ativo && (
                                  <section className="detalhamento-vinculo-periodo-escolar">
                                    <div className="titulo-tipo-alimentacao">
                                      Tipos de alimentação
                                    </div>
                                    <div className="tipos-alimentacoes-periodo">
                                      {vinculo.combos.map(combo => {
                                        return (
                                          <Fragment key={indice}>
                                            <nav>De:</nav>
                                            <nav>Para:</nav>
                                            <div className="dado-tipo-alimentacao mb-2">
                                              {combo.label}
                                            </div>
                                            <div className="dado-tipo-alimentacao mb-2">
                                              {combo.substituicoes.map(
                                                substituicao => {
                                                  return (
                                                    <div key={substituicao}>
                                                      {substituicao.label}
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </Fragment>
                                        );
                                      })}
                                    </div>
                                  </section>
                                )}
                              </div>
                            );
                          })}
                        </article>
                      </section>
                    ) : (
                      <Fragment>
                        <Wizard
                          arrayOfObjects={vinculosTiposAlimentacao}
                          currentStep={periodoEscolar}
                          nameItem="nome"
                        />
                        {exibeFormularioInicial ? (
                          <section className="conteudo-wizard">
                            <div className="titulo-combo">Todos Alimentos</div>
                            <div className="titulo-combo">Combinacoes</div>
                            <div className="conteudo-tipo-alimentacao">
                              <ul>
                                {tiposAlimentacao &&
                                  tiposAlimentacao.map((tipo, indice) => {
                                    return (
                                      <li
                                        key={indice}
                                        onClick={() =>
                                          this.adicionaTipoAlimentacaoAoCombo(
                                            tipo
                                          )
                                        }
                                      >
                                        {tipo.nome}
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                            <div className="combo-tipo-alimentacao">
                              {vinculosTiposAlimentacao &&
                                vinculosTiposAlimentacao[
                                  periodoEscolar
                                ].combos.map((combo, indice) => {
                                  let ultimoCombo =
                                    vinculosTiposAlimentacao[periodoEscolar]
                                      .combos[
                                      vinculosTiposAlimentacao[periodoEscolar]
                                        .combos.length - 1
                                    ];
                                  return (
                                    <div key={indice} className="item-combo">
                                      <div
                                        className={
                                          ultimoCombo === combo
                                            ? "descricao"
                                            : "descricao-desabilitado"
                                        }
                                      >
                                        <nav>{combo.label}</nav>
                                      </div>
                                      <div
                                        className={`acao ${
                                          ultimoCombo === combo
                                            ? ""
                                            : "impedir-adicionar"
                                        }`}
                                      >
                                        <i
                                          className="fas fa-plus-circle"
                                          onClick={() => {
                                            ultimoCombo === combo &&
                                              (combo.adicionar
                                                ? this.enviarComboTipoAlimentacao(
                                                    combo,
                                                    indice
                                                  )
                                                : this.acrescentaCampoVazio(
                                                    combo
                                                  ));
                                          }}
                                        />
                                        <i
                                          className="fas fa-trash-alt"
                                          onClick={() => {
                                            combo.adicionar
                                              ? this.apagarCampoComboTipoAlimentacao(
                                                  indice,
                                                  combo
                                                )
                                              : this.showModalExcluirTipoAlimentacao(
                                                  combo,
                                                  indice
                                                );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </section>
                        ) : (
                          <section className="conteudo-wizard-substituicoes">
                            <div className="titulo-combo-substituicoes">
                              Combos
                            </div>
                            <div className="titulo-combo-substituicoes">
                              Tipos de Alimentação
                            </div>
                            <div className="titulo-combo-substituicoes">
                              Substituições
                            </div>
                            <ul className="lista-combo-alimentacoes">
                              {vinculosTiposAlimentacao &&
                                vinculosTiposAlimentacao[
                                  periodoEscolar
                                ].combos.map((combo, indice) => {
                                  return indice === tipoAlimentacaoAtual ? (
                                    vinculosTiposAlimentacao[periodoEscolar]
                                      .combos[tipoAlimentacaoAtual]
                                      .substituicoes.length > 0 &&
                                    vinculosTiposAlimentacao[periodoEscolar]
                                      .combos[tipoAlimentacaoAtual]
                                      .substituicoes[
                                      vinculosTiposAlimentacao[periodoEscolar]
                                        .combos[tipoAlimentacaoAtual]
                                        .substituicoes.length - 1
                                    ].tipos_alimentacao.length > 0 ? (
                                      <li className="passou_atual" key={indice}>
                                        <nav>{combo.label}</nav>{" "}
                                        <div>
                                          <i className="fas fa-check" />
                                        </div>
                                      </li>
                                    ) : (
                                      <li
                                        className="nao_passou_atual"
                                        key={indice}
                                      >
                                        <nav>{combo.label}</nav> <div> </div>
                                      </li>
                                    )
                                  ) : indice < tipoAlimentacaoAtual ? (
                                    <li
                                      className="passou_anterior"
                                      key={indice}
                                      onClick={() => {
                                        this.setState({
                                          tipoAlimentacaoAtual: indice
                                        });
                                      }}
                                    >
                                      <nav>{combo.label}</nav>{" "}
                                      <div>
                                        <i className="fas fa-check" />
                                      </div>
                                    </li>
                                  ) : indice - 1 === tipoAlimentacaoAtual ? (
                                    vinculosTiposAlimentacao[periodoEscolar]
                                      .combos[tipoAlimentacaoAtual]
                                      .substituicoes.length > 0 &&
                                    vinculosTiposAlimentacao[periodoEscolar]
                                      .combos[tipoAlimentacaoAtual]
                                      .substituicoes[
                                      vinculosTiposAlimentacao[periodoEscolar]
                                        .combos[tipoAlimentacaoAtual]
                                        .substituicoes.length - 1
                                    ].tipos_alimentacao.length > 0 ? (
                                      vinculosTiposAlimentacao[periodoEscolar]
                                        .combos[indice].substituicoes.length >
                                        0 &&
                                      vinculosTiposAlimentacao[periodoEscolar]
                                        .combos[indice].substituicoes[
                                        vinculosTiposAlimentacao[periodoEscolar]
                                          .combos[indice].substituicoes.length -
                                          1
                                      ].tipos_alimentacao.length > 0 ? (
                                        <li
                                          className="passou_anterior"
                                          key={indice}
                                          onClick={() => {
                                            this.setState({
                                              tipoAlimentacaoAtual: indice
                                            });
                                          }}
                                        >
                                          <nav>{combo.label}</nav>{" "}
                                          <div>
                                            <i className="fas fa-check" />
                                          </div>
                                        </li>
                                      ) : (
                                        <li
                                          className="nao_passou_proximo"
                                          key={indice}
                                          onClick={() => {
                                            this.setState({
                                              tipoAlimentacaoAtual: indice
                                            });
                                          }}
                                        >
                                          <nav>{combo.label}</nav> <div />
                                        </li>
                                      )
                                    ) : (
                                      <li
                                        className="proximos_itens"
                                        key={indice}
                                      >
                                        <nav>{combo.label}</nav> <div> </div>
                                      </li>
                                    )
                                  ) : vinculosTiposAlimentacao[periodoEscolar]
                                      .combos[indice].substituicoes.length >
                                      0 &&
                                    vinculosTiposAlimentacao[periodoEscolar]
                                      .combos[indice].substituicoes[
                                      vinculosTiposAlimentacao[periodoEscolar]
                                        .combos[indice].substituicoes.length - 1
                                    ].tipos_alimentacao.length > 0 ? (
                                    <li
                                      className="passou_anterior"
                                      key={indice}
                                      onClick={() => {
                                        this.setState({
                                          tipoAlimentacaoAtual: indice
                                        });
                                      }}
                                    >
                                      <nav>{combo.label}</nav>{" "}
                                      <div>
                                        <i className="fas fa-check" />
                                      </div>
                                    </li>
                                  ) : (
                                    <li className="proximos_itens" key={indice}>
                                      <nav>{combo.label}</nav> <div> </div>
                                    </li>
                                  );
                                })}
                            </ul>
                            <ul className="tipos-alimentacao-substituicoes">
                              {tiposAlimentacao &&
                                tiposAlimentacao.map(
                                  (tipoAlimentacao, indice) => {
                                    return (
                                      <li
                                        key={indice}
                                        onClick={() =>
                                          this.adicionaSubstituicaoAoCombo(
                                            tipoAlimentacao
                                          )
                                        }
                                      >
                                        {tipoAlimentacao.nome}
                                      </li>
                                    );
                                  }
                                )}
                            </ul>
                            <div className="combo-tipo-alimentacao">
                              {vinculosTiposAlimentacao &&
                                vinculosTiposAlimentacao[periodoEscolar].combos[
                                  tipoAlimentacaoAtual
                                ].substituicoes.map((substituicao, indice) => {
                                  return vinculosTiposAlimentacao[
                                    periodoEscolar
                                  ].combos[tipoAlimentacaoAtual].substituicoes
                                    .length === 1 ? (
                                    <div className="item-combo" key={indice}>
                                      <div className="descricao">
                                        <nav>{substituicao.label}</nav>
                                      </div>
                                      <div className="acao">
                                        <i
                                          className="fas fa-plus-circle"
                                          onClick={() => {
                                            substituicao.tipos_alimentacao
                                              .length > 0 &&
                                              this.acrescentaCompoVazioASubstituicoes(
                                                substituicao
                                              );
                                          }}
                                        />
                                        <i
                                          className="fas fa-trash-alt"
                                          onClick={() =>
                                            this.apagaUnicaSubstituicao(
                                              substituicao
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="item-combo" key={indice}>
                                      <div className="descricao">
                                        <nav>{substituicao.label}</nav>
                                      </div>
                                      <div className="acao">
                                        <i
                                          className="fas fa-plus-circle"
                                          onClick={() => {
                                            substituicao.tipos_alimentacao
                                              .length > 0 &&
                                              this.acrescentaCompoVazioASubstituicoes(
                                                substituicao
                                              );
                                          }}
                                        />
                                        <i
                                          className="fas fa-trash-alt"
                                          onClick={() =>
                                            this.apagaSubstituicao(
                                              substituicao,
                                              indice
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </section>
                        )}
                      </Fragment>
                    )
                  ) : (
                    <div>Carregando ...</div>
                  ))}
              </section>

              <section className="rodape-botoes">
                {exibeFormularioInicial
                  ? vinculosTiposAlimentacao &&
                    (vinculosTiposAlimentacao[periodoEscolar].combos[
                      vinculosTiposAlimentacao[periodoEscolar].combos.length - 1
                    ].tipos_alimentacao.length > 0 ? (
                      !exibirRelatorio && (
                        <Botao
                          texto={"Formar Combos"}
                          onClick={() => {
                            this.validaESalvaOUltimoElemento(
                              vinculosTiposAlimentacao[periodoEscolar].combos[
                                vinculosTiposAlimentacao[periodoEscolar].combos
                                  .length - 1
                              ]
                            );
                          }}
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                      )
                    ) : (
                      <Botao
                        texto={"Formar Combos"}
                        className="botao-desabilitado"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                    ))
                  : !exibirRelatorio && (
                      <Fragment>
                        <Botao
                          texto={"Voltar"}
                          onClick={() =>
                            this.setState({ exibeFormularioInicial: true })
                          }
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="mr-2"
                        />
                        {vinculosTiposAlimentacao[periodoEscolar].combos[
                          vinculosTiposAlimentacao[periodoEscolar].combos
                            .length - 1
                        ].substituicoes[
                          vinculosTiposAlimentacao[periodoEscolar].combos[
                            vinculosTiposAlimentacao[periodoEscolar].combos
                              .length - 1
                          ].substituicoes.length - 1
                        ].tipos_alimentacao.length > 0 ? (
                          <Botao
                            texto={"Confirmar"}
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN}
                            onClick={() => {
                              vinculosTiposAlimentacao.length ===
                              periodoEscolar + 1
                                ? this.setState({
                                    exibirRelatorio: true,
                                    periodoEscolar: 0,
                                    exibeFormularioInicial: true,
                                    tipoAlimentacaoAtual: 0
                                  })
                                : this.setState({
                                    periodoEscolar: periodoEscolar + 1,
                                    exibeFormularioInicial: true,
                                    tipoAlimentacaoAtual: 0
                                  });
                            }}
                          />
                        ) : (
                          <Botao
                            texto={"Confirmar"}
                            className="botao-desabilitado"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN}
                          />
                        )}
                      </Fragment>
                    )}
              </section>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

const TipoDeAlimentacaoForm = reduxForm({
  form: "TipoDeAlimentacaoForm",
  enableReinitialize: true
})(CadastroTipoAlimentacao);
const selector = formValueSelector("TipoDeAlimentacaoForm");
const mapStateToProps = state => {
  return {
    initialValues: state.TipoDeAlimentacaoForm.data,
    tipos_unidades: selector(state, "tipos_unidades")
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadTipoAlimentacao
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TipoDeAlimentacaoForm);
