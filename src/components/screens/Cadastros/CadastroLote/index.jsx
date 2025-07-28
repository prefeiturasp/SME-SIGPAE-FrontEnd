import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { toastError, toastSuccess } from "../../../Shareable/Toast/dialogs";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadLote } from "../../../../reducers/lote.reducer";
import { Select } from "../../../Shareable/Select";
import { InputText } from "../../../Shareable/Input/InputText";
import { Link, Navigate } from "react-router-dom";
import { Field, formValueSelector, reduxForm } from "redux-form";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { ModalCadastroLote } from "./components/ModalCadastroLote";
import {
  getLote,
  criarLote,
  atualizarLote,
  excluirLote,
} from "../../../../services/lote.service";
import { renderizarLabelEscola, renderizarLabelSubprefeitura } from "./helper";
import { extrairUUIDs, getError } from "../../../../helpers/utilities";
import { required } from "../../../../helpers/fieldValidators";
import "../style.scss";
import Botao from "../../../Shareable/Botao";
import { BUTTON_STYLE } from "../../../Shareable/Botao/constants";
import {
  CONFIGURACOES,
  CADASTROS,
  LOTES_CADASTRADOS,
} from "../../../../configs/constants";

class CadastroLote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diretoria_regional: null,
      tipo_gestao: null,
      subprefeiturasSelecionadas: [],
      subprefeiturasSelecionadasNomes: [],
      escolasSelecionadasNomes: [],
      escolasSelecionadas: [],
      loading: true,
      uuid: null,
      redirect: false,
      deactivate: true,
      escolasParaEdicaoCarregadas: false,
    };
    this.exibirModal = this.exibirModal.bind(this);
    this.fecharModal = this.fecharModal.bind(this);
    this.excluirLote = this.excluirLote.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate() {
    const { loading, loteCarregado, escolasParaEdicaoCarregadas } = this.state;
    const {
      meusDados,
      lotes,
      diretoriasRegionais,
      tiposGestao,
      subprefeituras,
      location,
      diretoria_regional,
      getEscolasPorDre,
    } = this.props;
    if (
      !!lotes &&
      !!diretoriasRegionais &&
      !!tiposGestao &&
      !!subprefeituras &&
      meusDados !== null &&
      loading
    ) {
      this.setState({
        loading: false,
      });
      if (
        meusDados.vinculo_atual.perfil.nome ===
          "COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA" ||
        meusDados.vinculo_atual.perfil.nome ===
          "ADMINISTRADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA"
      ) {
        this.setState({
          deactivate: false,
        });
      } else {
        this.setState({
          deactivate: true,
        });
      }
    }
    const urlParams = new URLSearchParams(window.location.search);

    const uuid =
      this.props.location && this.props.location.state
        ? this.props.location.state.uuid
        : urlParams.get("uuid");
    if (uuid && !loading && !loteCarregado) {
      getLote(uuid).then((response) => {
        if (response.status !== HTTP_STATUS.NOT_FOUND) {
          this.props.reset("loteForm");
          let subprefeiturasSelecionadasNomes = [];
          response.data.subprefeituras.forEach((subprefeitura) => {
            subprefeiturasSelecionadasNomes.push(subprefeitura.nome);
          });
          let escolasSelecionadasNomes = [];
          response.data.escolas.forEach((escola) => {
            escolasSelecionadasNomes.push(
              `${escola.codigo_eol} - ${escola.nome} - ${escola.lote.nome}`
            );
          });
          this.setState({
            diretoria_regional: response.data.diretoria_regional.nome,
            tipo_gestao: response.data.tipo_gestao.nome,
            subprefeiturasSelecionadas: extrairUUIDs(
              response.data.subprefeituras
            ),
            subprefeiturasSelecionadasNomes,
            escolasSelecionadasNomes,
            escolasSelecionadas: extrairUUIDs(response.data.escolas),
            loteCarregado: true,
            uuid,
          });
          this.props.loadLote(response.data);
        } else {
          toastError("Lote não encontrado");
          this.setState({ loteCarregado: true });
        }
      });
    }

    if (
      ((location && location.state) || uuid) &&
      diretoria_regional &&
      !escolasParaEdicaoCarregadas
    ) {
      getEscolasPorDre(diretoria_regional);
      this.setState({ escolasParaEdicaoCarregadas: true });
    }
  }

  setRedirect() {
    this.setState({
      redirect: true,
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Navigate to={`/${CONFIGURACOES}/${CADASTROS}/${LOTES_CADASTRADOS}`} />
      );
    }
  };

  exibirModal() {
    this.setState({ exibirModal: true });
  }

  fecharModal() {
    this.setState({ exibirModal: false });
  }

  excluirLote() {
    if (window.confirm("Tem certeza que deseja excluir o lote?")) {
      excluirLote(this.state.uuid).then(
        (res) => {
          if (res.status === HTTP_STATUS.NO_CONTENT) {
            toastSuccess("Lote excluído com sucesso");
            this.setRedirect();
            this.resetForm();
          } else if (res.status === HTTP_STATUS.UNAUTHORIZED) {
            toastError(res.data.detail);
          } else {
            toastError(`Houve um erro ao excluir o lote: ${res.data}`);
          }
        },
        function () {
          toastError("Houve um erro ao excluir o lote");
        }
      );
    }
  }

  onDiretoriaRegionalSelected = async (value) => {
    let { diretoriasRegionais, getEscolasPorDre } = this.props;
    const indice = diretoriasRegionais.findIndex(
      (diretoria_regional) => diretoria_regional.uuid === value
    );
    this.setState({
      diretoria_regional: diretoriasRegionais[indice].nome,
      carregandoEscolas: true,
    });
    await getEscolasPorDre(value);
    this.setState({ escolasSelecionadas: [], escolasSelecionadasNomes: [] });
  };

  onSubprefeiturasSelected(values) {
    let subprefeituras = this.props.subprefeituras;
    let subprefeiturasSelecionadasNomes = [];
    values.forEach((value) => {
      const indice = subprefeituras.findIndex(
        (subprefeitura) => subprefeitura.value === value
      );
      subprefeiturasSelecionadasNomes.push(subprefeituras[indice].label);
    });
    this.setState({
      subprefeiturasSelecionadas: values,
      subprefeiturasSelecionadasNomes,
    });
  }

  onTipoGestaoSelected(value) {
    let tiposGestao = this.props.tiposGestao;
    const indice = tiposGestao.findIndex(
      (tipo_gestao) => tipo_gestao.uuid === value
    );
    this.setState({ tipo_gestao: tiposGestao[indice].nome });
  }

  onEscolasSelected(values) {
    const escolas = this.props.escolas;
    let escolasSelecionadasNomes = [];
    values.forEach((value) => {
      const indice = escolas.findIndex((escola) => escola.value === value);
      escolasSelecionadasNomes.push(escolas[indice].label);
    });
    this.setState({ escolasSelecionadas: values, escolasSelecionadasNomes });
  }

  resetForm() {
    ["nome", "iniciais", "diretoria_regional", "tipo_gestao"].forEach(
      (element) => {
        this.props.change(element, "");
      }
    );
    this.setState({
      subprefeiturasSelecionadas: [],
      subprefeiturasSelecionadasNomes: [],
      escolasSelecionadas: [],
      escolasSelecionadasNomes: [],
    });
  }

  onSubmit(values) {
    values.escolas = this.state.escolasSelecionadas;
    values.subprefeituras = this.state.subprefeiturasSelecionadas;
    values.diretoria_regional = this.props.diretoria_regional;
    values.tipo_gestao = this.props.tipo_gestao;
    if (!this.state.uuid) {
      criarLote(JSON.stringify(values)).then(
        (res) => {
          if (res.status === HTTP_STATUS.CREATED) {
            toastSuccess("Lote salvo com sucesso");
            this.setRedirect();
            this.resetForm();
          } else {
            toastError(`Houve um erro ao salvar o lote: ${getError(res.data)}`);
          }
        },
        function () {
          toastError("Houve um erro ao salvar o lote");
        }
      );
      this.fecharModal();
    } else {
      atualizarLote(JSON.stringify(values), this.state.uuid).then(
        (res) => {
          if (res.status === HTTP_STATUS.OK) {
            toastSuccess("Lote atualizado com sucesso");
            this.setRedirect();
            this.resetForm();
          } else {
            toastError(
              `Houve um erro ao atualizar o lote ${getError(res.data)}`
            );
          }
        },
        function () {
          toastError("Houve um erro ao atualizar o lote");
        }
      );
      this.fecharModal();
    }
  }

  render() {
    const {
      handleSubmit,
      diretoriasRegionais,
      escolas,
      tiposGestao,
      subprefeituras,
      nome,
      iniciais,
    } = this.props;
    const {
      escolasSelecionadas,
      subprefeiturasSelecionadas,
      escolasSelecionadasNomes,
      subprefeiturasSelecionadasNomes,
      exibirModal,
      diretoria_regional,
      tipo_gestao,
      uuid,
      deactivate,
    } = this.state;
    return (
      <div className="cadastro pt-3">
        {this.renderRedirect()}
        <ModalCadastroLote
          closeModal={this.fecharModal}
          showModal={exibirModal}
          diretoria_regional={diretoria_regional}
          subprefeituras={subprefeiturasSelecionadasNomes}
          nome={nome}
          atualizando={uuid !== null}
          iniciais={iniciais}
          tipo_gestao={tipo_gestao}
          escolasSelecionadas={escolasSelecionadasNomes}
          onSubmit={this.onSubmit}
        />
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-body">
              <div className="card-title fw-bold">Dados do Lote</div>
              <div className="row pt-3">
                {!deactivate && (
                  <div className="col-12">
                    <Link
                      to={`/${CONFIGURACOES}/${CADASTROS}/${LOTES_CADASTRADOS}`}
                    >
                      <Botao
                        texto="Consulta de lotes cadastrados"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                    </Link>
                  </div>
                )}
              </div>
              <div className="row pt-3">
                <div className="col-8">
                  <Field
                    dataTestId="diretoria-regional-select"
                    label="DRE"
                    component={Select}
                    name="diretoria_regional"
                    onChange={(event) =>
                      this.onDiretoriaRegionalSelected(event.target.value)
                    }
                    disabled={deactivate}
                    options={diretoriasRegionais}
                    required
                    validate={required}
                  />
                </div>
              </div>
              <div className="row pt-3">
                {!deactivate && (
                  <div className="col-8">
                    <label className="label fw-normal pb-3">
                      Subprefeitura
                    </label>
                    {subprefeituras.length ? (
                      <Field
                        component={StatefulMultiSelect}
                        name="subprefeituras"
                        selected={subprefeiturasSelecionadas}
                        options={subprefeituras}
                        valueRenderer={(selected, options) =>
                          renderizarLabelSubprefeitura(selected, options)
                        }
                        onSelectedChanged={(value) =>
                          this.onSubprefeiturasSelected(value)
                        }
                        overrideStrings={{
                          search: "Busca",
                          selectSomeItems: "Selecione",
                          allItemsAreSelected:
                            "Todos os itens estão selecionados",
                          selectAll: "Todos",
                        }}
                      />
                    ) : (
                      <div className="col-12">Carregando subprefeituras..</div>
                    )}
                  </div>
                )}
              </div>
              <div className="row pt-3">
                <div className="col-4">
                  <Field
                    dataTestId="iniciais-dre-input"
                    component={InputText}
                    label="Nome do Lote (Iniciais da DRE)"
                    className="form-control"
                    name="iniciais"
                    required
                    validate={required}
                    disabled={deactivate}
                    maxlength={"10"}
                  />
                </div>
                <div className="col-4">
                  <Field
                    dataTestId="numero-lote-input"
                    component={InputText}
                    label="Nº do Lote"
                    className="form-control"
                    name="nome"
                    required
                    disabled={deactivate}
                    validate={required}
                  />
                </div>
                <div className="col-4">
                  <Field
                    dataTestId="tipo-gestao-select"
                    component={Select}
                    label="Tipo de Gestão"
                    name="tipo_gestao"
                    onChange={(event) =>
                      this.onTipoGestaoSelected(event.target.value)
                    }
                    disabled={deactivate}
                    options={tiposGestao}
                    required
                    validate={required}
                  />
                </div>
              </div>
              <div className="row pt-3">
                {!deactivate && (
                  <div className="col-12">
                    <label className="label fw-normal pb-3">
                      Unidades Específicas do Lote
                    </label>
                    <Field
                      component={StatefulMultiSelect}
                      name="escolas"
                      selected={escolasSelecionadas}
                      options={escolas}
                      valueRenderer={(selected, options) =>
                        renderizarLabelEscola(selected, options)
                      }
                      onSelectedChanged={(value) =>
                        this.onEscolasSelected(value)
                      }
                      overrideStrings={{
                        search: "Busca",
                        selectSomeItems: "Selecione",
                        allItemsAreSelected:
                          "Todos os itens estão selecionados",
                        selectAll: "Todos",
                      }}
                      disabled={escolas.length ? false : true}
                    />
                  </div>
                )}
              </div>
              {escolasSelecionadasNomes.length > 0 && (
                <div className="row pt-3">
                  <div className="col-12">
                    <label className="label-selected-unities">
                      Unidades Específicas do Lote Selecionadas
                    </label>
                    {escolasSelecionadasNomes.map((escola, indice) => {
                      return (
                        <div className="value-selected-unities" key={indice}>
                          {escola}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="row mt-5">
                {!deactivate && (
                  <div className="col-12 text-end">
                    {!uuid && (
                      <Botao
                        texto="Limpar Campos"
                        onClick={() => {
                          this.resetForm();
                          this.props.reset();
                        }}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        type={BUTTON_STYLE.BUTTON}
                      />
                    )}
                    {uuid && (
                      <Botao
                        texto="Excluir"
                        onClick={this.excluirLote}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        type={BUTTON_STYLE.BUTTON}
                      />
                    )}
                    <Botao
                      texto={"Salvar"}
                      onClick={handleSubmit(() => this.exibirModal())}
                      className="ms-3"
                      type={BUTTON_STYLE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const loteForm = reduxForm({
  form: "loteForm",
  enableReinitialize: true,
})(CadastroLote);
const selector = formValueSelector("loteForm");
const mapStateToProps = (state) => {
  return {
    initialValues: state.loteForm.data,
    diretoria_regional: selector(state, "diretoria_regional"),
    nome: selector(state, "nome"),
    iniciais: selector(state, "iniciais"),
    tipo_gestao: selector(state, "tipo_gestao"),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadLote,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(loteForm);
