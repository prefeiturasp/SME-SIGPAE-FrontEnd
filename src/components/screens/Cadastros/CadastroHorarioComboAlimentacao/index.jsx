import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { Component, Fragment } from "react";
import { Field, reduxForm } from "redux-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputHorario } from "src/components/Shareable/Input/InputHorario";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import Wizard from "src/components/Shareable/Wizard";
import { getError } from "src/helpers/utilities";
import {
  postHorariosCombosPorEscola,
  putHorariosCombosPorEscola,
} from "src/services/cadastroTipoAlimentacao.service";
import {
  todosOsCamposValidos,
  ultimoHorarioDisponivel,
  ultimoPeriodoDaEscola,
} from "./helper";
import "./style.scss";

class CadastroHorarioComboAlimentacao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vinculosDeHorarios: null,
      periodoEscolar: 0,
      horarioAlimentacaoAtual: 0,
      meusDados: null,
      exibirRelatorio: null,
      quantidadeAlunos: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { periodoEscolar } = this.state;
    const { vinculosDeHorarios, meusDados, horarioDosAlimentos } = this.props;
    if (prevProps.vinculosDeHorarios !== this.props.vinculosDeHorarios) {
      if (meusDados) {
        let todosOsCombos = [];
        vinculosDeHorarios.forEach((vinculo) => {
          vinculo.horarios_alimentacao.forEach((horario) => {
            todosOsCombos.push(horario);
          });
        });
        if (todosOsCombos.length === horarioDosAlimentos.length) {
          this.setState({ exibirRelatorio: true });
        } else {
          this.setState({ exibirRelatorio: false });
        }
      }
      this.setState({ vinculosDeHorarios, meusDados });
    }
    if (vinculosDeHorarios) {
      let qtdAlunos = null;
      let { quantidadeAlunos } = this.state;
      if (
        vinculosDeHorarios[periodoEscolar].quantidade_alunos
          .quantidade_alunos_anterior
      ) {
        qtdAlunos =
          vinculosDeHorarios[periodoEscolar].quantidade_alunos
            .quantidade_alunos_anterior;
      } else {
        qtdAlunos =
          vinculosDeHorarios[periodoEscolar].quantidade_alunos
            .quantidade_alunos_atual;
      }
      if (
        quantidadeAlunos === prevState.quantidadeAlunos &&
        quantidadeAlunos !== qtdAlunos
      ) {
        this.setState({ quantidadeAlunos: qtdAlunos });
      }
    }
  }

  obterHoraInicio = (hora) => {
    let { vinculosDeHorarios, periodoEscolar, horarioAlimentacaoAtual } =
      this.state;
    const horario = moment(hora).format("HH:mm");
    vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
      horarioAlimentacaoAtual
    ].hora_inicial = horario;
    this.setState({ vinculosDeHorarios });
  };

  obterHoraFim = (hora) => {
    let { vinculosDeHorarios, periodoEscolar, horarioAlimentacaoAtual } =
      this.state;
    const horario = moment(hora).format("HH:mm");
    vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
      horarioAlimentacaoAtual
    ].hora_final = horario;
    this.setState({ vinculosDeHorarios });
  };

  enviarETrocaDePeriodo = () => {
    let { vinculosDeHorarios, periodoEscolar, horarioAlimentacaoAtual } =
      this.state;
    const horario =
      vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
        horarioAlimentacaoAtual
      ];
    const request = {
      tipo_alimentacao: horario.tipo_alimentacao,
      periodo_escolar: horario.periodo_escolar,
      escola: horario.escola,
      hora_inicial: horario.hora_inicial,
      hora_final: horario.hora_final,
    };
    if (!horario.uuid) {
      postHorariosCombosPorEscola(request).then((response) => {
        if (response.status === HTTP_STATUS.CREATED) {
          vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
            horarioAlimentacaoAtual
          ].uuid = response.data.uuid;
          this.setState({
            vinculosDeHorarios,
            horarioAlimentacaoAtual: 0,
            periodoEscolar: periodoEscolar + 1,
          });
        } else {
          toastError(
            `Erro ao salvar horário do tipo de alimentação ${getError(
              response.data,
            )}`,
          );
        }
      });
    } else {
      putHorariosCombosPorEscola(request, horario.uuid).then((response) => {
        if (response.status === HTTP_STATUS.OK) {
          this.setState({
            vinculosDeHorarios,
            horarioAlimentacaoAtual: 0,
            periodoEscolar: periodoEscolar + 1,
          });
        } else {
          toastError(
            `Erro ao alterar horário do tipo de alimentação ${getError(
              response.data,
            )}`,
          );
        }
      });
    }
  };

  enviarEFinalizar = () => {
    let { vinculosDeHorarios, periodoEscolar, horarioAlimentacaoAtual } =
      this.state;
    const horario =
      vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
        horarioAlimentacaoAtual
      ];
    const request = {
      tipo_alimentacao: horario.tipo_alimentacao,
      periodo_escolar: horario.periodo_escolar,
      escola: horario.escola,
      hora_inicial: horario.hora_inicial,
      hora_final: horario.hora_final,
    };
    if (!horario.uuid) {
      postHorariosCombosPorEscola(request).then((response) => {
        if (response.status === HTTP_STATUS.CREATED) {
          vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
            horarioAlimentacaoAtual
          ].uuid = response.data.uuid;
          this.setState({
            exibirRelatorio: true,
            vinculosDeHorarios,
            horarioAlimentacaoAtual: 0,
            periodoEscolar: 0,
          });
          toastSuccess("Cadastrado efetuado com sucesso");
        } else {
          toastError(
            `Erro ao salvar horário do tipo de alimentação ${getError(
              response.data,
            )}`,
          );
        }
      });
    } else {
      putHorariosCombosPorEscola(request, horario.uuid).then((response) => {
        if (response.status === HTTP_STATUS.OK) {
          this.setState({
            exibirRelatorio: true,
            vinculosDeHorarios,
            horarioAlimentacaoAtual: 0,
            periodoEscolar: 0,
          });
          toastSuccess("Cadastrado efetuado com sucesso");
        } else {
          toastError(
            `Erro ao alterar horário do tipo de alimentação ${getError(
              response.data,
            )}`,
          );
        }
      });
    }
  };

  enviarComboDeHorarios = () => {
    let { vinculosDeHorarios, periodoEscolar, horarioAlimentacaoAtual } =
      this.state;
    const horario =
      vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
        horarioAlimentacaoAtual
      ];
    const request = {
      tipo_alimentacao: horario.tipo_alimentacao,
      periodo_escolar: horario.periodo_escolar,
      escola: horario.escola,
      hora_inicial: horario.hora_inicial,
      hora_final: horario.hora_final,
    };
    if (!horario.uuid) {
      postHorariosCombosPorEscola(request).then((response) => {
        if (response.status === HTTP_STATUS.CREATED) {
          vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
            horarioAlimentacaoAtual
          ].uuid = response.data.uuid;
          this.setState({
            vinculosDeHorarios,
            horarioAlimentacaoAtual: horarioAlimentacaoAtual + 1,
          });
        } else {
          toastError(
            `Erro ao salvar horário do tipo de alimentação ${getError(
              response.data,
            )}`,
          );
        }
      });
    } else {
      putHorariosCombosPorEscola(request, horario.uuid).then((response) => {
        if (response.status === HTTP_STATUS.OK) {
          this.setState({
            vinculosDeHorarios,
            horarioAlimentacaoAtual: horarioAlimentacaoAtual + 1,
          });
        } else {
          toastError(
            `Erro ao alterar horário do tipo de alimentação ${getError(
              response.data,
            )}`,
          );
        }
      });
    }
  };

  salvaComboEHorarios = (
    vinculosDeHorarios,
    periodoEscolar,
    horarioAlimentacaoAtual,
  ) => {
    const comboHorario =
      vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
        horarioAlimentacaoAtual
      ];
    const request = {
      combo_tipos_alimentacao: comboHorario.combo_tipos_alimentacao,
      escola: comboHorario.escola,
      hora_inicial: comboHorario.hora_inicial,
      hora_final: comboHorario.hora_final,
    };
    postHorariosCombosPorEscola(request).then((resp) => {
      return resp;
    });
  };

  detalhesPeriodo = (index, ativo) => {
    let { vinculosDeHorarios } = this.state;
    vinculosDeHorarios.forEach((vinculo, indice) => {
      if (index === indice) {
        vinculo.ativo = !ativo;
      } else {
        vinculo.ativo = false;
      }
    });
    this.setState({ vinculosDeHorarios });
  };

  getPeriodoHorario = (index) => {
    let { vinculosDeHorarios } = this.state;
    vinculosDeHorarios.forEach((vinculo) => {
      vinculo.ativo = false;
    });
    this.setState({
      periodoEscolar: index,
      exibirRelatorio: false,
      vinculosDeHorarios,
    });
  };

  render() {
    const {
      vinculosDeHorarios,
      periodoEscolar,
      horarioAlimentacaoAtual,
      meusDados,
      exibirRelatorio,
      quantidadeAlunos,
    } = this.state;
    vinculosDeHorarios &&
      ultimoHorarioDisponivel(
        vinculosDeHorarios,
        periodoEscolar,
        horarioAlimentacaoAtual,
      );
    const { naoPermitido } = this.props;
    return !vinculosDeHorarios ? (
      !naoPermitido && !meusDados ? (
        <div>Carregando...</div>
      ) : (
        <div>Voce não tem permissão</div>
      )
    ) : exibirRelatorio ? (
      <section className="card mt-3">
        <main className="grid-relatorio">
          <header>Resumo do cadastro</header>

          <article>
            <nav className="tipo-periodos">Tipos de períodos</nav>
            <section>
              {vinculosDeHorarios.map((element, index) => {
                return (
                  <Fragment key={index}>
                    <div className={`teste ${element.ativo && "ativo"}`}>
                      <div className="periodo-escolar">
                        {element.periodo_escolar.nome}
                      </div>
                      <div className="icons-action">
                        {element.ativo ? (
                          <Fragment>
                            <i
                              className="fas fa-pen"
                              onClick={() => this.getPeriodoHorario(index)}
                            />
                            <i
                              className="fas fa-angle-up"
                              onClick={() =>
                                this.detalhesPeriodo(index, element.ativo)
                              }
                            />
                          </Fragment>
                        ) : (
                          <Fragment>
                            <i />
                            <i
                              className="fas fa-angle-down"
                              onClick={() =>
                                this.detalhesPeriodo(index, element.ativo)
                              }
                            />
                          </Fragment>
                        )}
                      </div>
                    </div>
                    {element.ativo && (
                      <main
                        className={`grid-conteudo-periodo ${
                          element.ativo && "ativo-conteudo"
                        }`}
                      >
                        <nav>Tipos de alimentos atuais</nav>
                        <nav>Horário Inicio</nav>
                        <nav>Horário Término</nav>
                        {element.horarios_alimentacao.map((horario, index) => {
                          return (
                            <Fragment key={index}>
                              <div>{horario.label}</div>
                              <div>{horario.hora_inicial.substring(0, 5)}</div>
                              <div>{horario.hora_final.substring(0, 5)}</div>
                            </Fragment>
                          );
                        })}
                      </main>
                    )}
                  </Fragment>
                );
              })}
            </section>
          </article>
        </main>
      </section>
    ) : (
      <form className="card mt-3" onSubmit={this.props.handleSubmit}>
        <article className="grid-box">
          <header>Cruzamento das possibilidades</header>
          <Wizard
            arrayOfObjects={vinculosDeHorarios}
            currentStep={periodoEscolar}
            nameItem="nome"
            outerParam="periodo_escolar"
          />
          <section className="conteudo-wizard">
            <article className="numero-alunos">
              <section className="form-qtd-alunos">
                <header className="mb-2">N° de alunos</header>
                <article className="grid-form-alunos">
                  <div className="quantidade-alunos-box">
                    {quantidadeAlunos}
                  </div>
                </article>
              </section>
            </article>
            <div className="borda" />
            <article className="horarios-alimentacao">
              <nav className="mb-2">Tipo de alimentação</nav>
              <nav className="mb-2">Horário Início</nav>
              <nav className="mb-2">Horário de Término </nav>
              {vinculosDeHorarios[periodoEscolar].horarios_alimentacao.map(
                (horario, index) => {
                  return (
                    <Fragment key={index}>
                      <div
                        className={`combo-tipo-alimentacao mb-3
                        ${
                          horarioAlimentacaoAtual === index
                            ? "combo-atual"
                            : horarioAlimentacaoAtual > index
                              ? "combo-passado"
                              : "proximo-combo"
                        }`}
                      >
                        <nav>{horario.label}</nav>{" "}
                        <div
                          className={
                            horarioAlimentacaoAtual > index
                              ? "checado-item-ok"
                              : ""
                          }
                        >
                          {horarioAlimentacaoAtual > index && (
                            <i className="fas fa-check" />
                          )}
                        </div>
                      </div>
                      <Field
                        name={`hora_inicial_${index}`}
                        className={`${
                          horarioAlimentacaoAtual === index
                            ? "combo-ativo"
                            : horarioAlimentacaoAtual > index
                              ? "combo-inativo horario-confirmado"
                              : "combo-inativo"
                        }`}
                        placeholder={"Hora Inicial"}
                        horaAtual={horario.hora_inicial}
                        component={InputHorario}
                        onChange={(date) => this.obterHoraInicio(date)}
                        disabled={
                          horarioAlimentacaoAtual !== index ? true : false
                        }
                      />
                      <Field
                        name={`hora_final_${index}`}
                        className={`${
                          horarioAlimentacaoAtual === index
                            ? "combo-ativo"
                            : horarioAlimentacaoAtual > index
                              ? "combo-inativo horario-confirmado"
                              : "combo-inativo"
                        }`}
                        placeholder={"Hora Término"}
                        horaAtual={horario.hora_final}
                        component={InputHorario}
                        onChange={(date) => this.obterHoraFim(date)}
                        disabled={
                          horarioAlimentacaoAtual !== index ? true : false
                        }
                      />
                    </Fragment>
                  );
                },
              )}
            </article>
          </section>
          <section className="mt-5 footer-botoes">
            {todosOsCamposValidos(
              vinculosDeHorarios,
              periodoEscolar,
              horarioAlimentacaoAtual,
            ) ? (
              ultimoHorarioDisponivel(
                vinculosDeHorarios,
                periodoEscolar,
                horarioAlimentacaoAtual,
              ) ? (
                ultimoPeriodoDaEscola(vinculosDeHorarios, periodoEscolar) ? (
                  <Botao
                    texto={"Finalizar"}
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() => this.enviarEFinalizar()}
                  />
                ) : (
                  <Botao
                    texto={"Próximo"}
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() => this.enviarETrocaDePeriodo()}
                  />
                )
              ) : (
                <Botao
                  texto={"Confirmar"}
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={() => this.enviarComboDeHorarios()}
                />
              )
            ) : (
              <Botao
                texto={"Confirmar"}
                disabled={true}
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
              />
            )}
          </section>
        </article>
      </form>
    );
  }
}

CadastroHorarioComboAlimentacao = reduxForm({
  form: "cadastroHorarioCombosAlimentacao",
})(CadastroHorarioComboAlimentacao);

export default CadastroHorarioComboAlimentacao;
