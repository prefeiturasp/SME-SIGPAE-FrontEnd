import MultiSelect from "components/Shareable/FinalForm/MultiSelect";
import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import CKEditorField from "components/Shareable/CKEditorField";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import { maxValue, naoPodeSerZero, required } from "helpers/fieldValidators";
import {
  deepCopy,
  escolaEhCEMEI,
  fimDoCalendario,
  geradorUUID,
  getError,
  usuarioEhEscolaCeuGestao,
  usuarioEhEscolaCMCT,
} from "helpers/utilities";
import { loadFoodSuspension } from "reducers/suspensaoDeAlimentacaoReducer";
import { Field, FormSection, formValueSelector, reduxForm } from "redux-form";
import { getQuantidadeAlunosCEMEIporPeriodoCEIEMEI } from "services/aluno.service";
import {
  createSuspensaoDeAlimentacao,
  deleteSuspensaoDeAlimentacao,
  enviarSuspensaoDeAlimentacao,
  getSuspensoesDeAlimentacaoSalvas,
  updateSuspensaoDeAlimentacao,
} from "services/suspensaoDeAlimentacao.service";
import { STATUS_DRE_A_VALIDAR } from "../../configs/constants";
import { getVinculosTipoAlimentacaoPorEscola } from "../../services/cadastroTipoAlimentacao.service";
import { getQuantidaDeAlunosPorPeriodoEEscola } from "../../services/escola.service";
import Botao from "../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../Shareable/Botao/constants";
import CardMatriculados from "../Shareable/CardMatriculados";
import { InputComData } from "../Shareable/DatePicker";
import { InputText } from "../Shareable/Input/InputText";
import { Select } from "../Shareable/Select";
import { toastError, toastSuccess } from "../Shareable/Toast/dialogs";
import { Rascunhos } from "./Rascunhos";
import "./style.scss";
import { validateSubmit } from "./validacao";

const ENTER = 13;
class FoodSuspensionEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      suspensoesDeAlimentacaoList: [],
      alunosCEIouEMEI: [],
      status: "SEM STATUS",
      title: "Nova Solicitação",
      salvarAtualizarLbl: "Salvar Rascunho",
      vinculos: undefined,
      dias_razoes: [
        {
          id: geradorUUID(),
          data: null,
          motivo: null,
          outroMotivo: false,
        },
      ],
      acimaDoLimite: [],
      options: {
        MANHA: [],
        TARDE: [],
        NOITE: [],
        INTEGRAL: [],
        VESPERTINO: [],
        INTERMEDIARIO: [],
      },
    };
    this.OnEditButtonClicked = this.OnEditButtonClicked.bind(this);
    this.OnDeleteButtonClicked = this.OnDeleteButtonClicked.bind(this);
    this.addDay = this.addDay.bind(this);
    this.refresh = this.refresh.bind(this);
    this.titleRef = React.createRef();
  }

  handleField(field, value, key) {
    let dias_razoes = this.state.dias_razoes;
    let acimaDoLimite = this.state.acimaDoLimite;
    dias_razoes[key][field] = value;
    if (field === `motivo${key}`) {
      const indiceMotivo = this.props.motivos.findIndex(
        (motivo) => motivo.uuid === value
      );
      dias_razoes[key]["outroMotivo"] =
        this.props.motivos[indiceMotivo].nome.includes("Outro");
    }
    if (field === "outro_motivo" + key) {
      if (value.length > 500) {
        const index = acimaDoLimite.indexOf(key);
        if (index === -1) {
          acimaDoLimite.push(key);
        }
      } else {
        const index = acimaDoLimite.indexOf(key);
        if (index > -1) {
          acimaDoLimite.splice(index, 1);
        }
      }
    }
    this.setState({ dias_razoes });
  }

  addDay() {
    this.setState({
      dias_razoes: this.state.dias_razoes.concat([
        {
          id: geradorUUID(),
          data: null,
          motivo: null,
          outroMotivo: false,
        },
      ]),
    });
  }

  handleSelectedChanged = (selectedOptions, period) => {
    let options = this.state.options;
    options[period.nome] = selectedOptions;
    this.setState({
      ...this.state,
      options: options,
    });
    this.props.change(
      `suspensoes_${period.nome}.tipo_de_refeicao`,
      selectedOptions
    );
  };

  handleSelectedChangedAlunos = (selectedOptions, period) => {
    const { alunosCEIouEMEI } = this.state;
    alunosCEIouEMEI[period.nome] = selectedOptions;
    this.setState({ alunosCEIouEMEI });
    let periodos = this.props.periodos;
    let indice = periodos.findIndex((periodo) => periodo.nome === period.nome);
    let qnt_alunos = 0;
    selectedOptions.forEach((opt) => {
      qnt_alunos += periodos[indice].alunos.filter(
        (obj) => obj.value === opt
      )[0].quantidade_alunos;
    });
    periodos[indice].validador = [
      naoPodeSerZero,
      maxValue(qnt_alunos),
      required,
    ];
  };

  OnDeleteButtonClicked(id_externo, uuid) {
    if (window.confirm("Deseja remover este rascunho?")) {
      deleteSuspensaoDeAlimentacao(uuid).then(
        (statusCode) => {
          if (statusCode === HTTP_STATUS.NO_CONTENT) {
            toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
            this.refresh();
          } else {
            toastError("Houve um erro ao excluir o rascunho");
          }
        },
        function () {
          toastError("Houve um erro ao excluir o rascunho");
        }
      );
    }
  }

  resetForm() {
    this.props.reset("foodSuspension");
    this.props.loadFoodSuspension(null);
    this.setState({
      status: "SEM STATUS",
      title: "Nova Solicitação",
      salvarAtualizarLbl: "Salvar Rascunho",
      dias_razoes: [
        {
          id: geradorUUID(),
          data: null,
          motivo: null,
        },
      ],
      options: {
        MANHA: [],
        TARDE: [],
        NOITE: [],
        INTEGRAL: [],
        VESPERTINO: [],
        INTERMEDIARIO: [],
      },
      observacao: null,
    });
    this.props.change("observacao", null);
  }

  diasRazoesFromSuspensoesAlimentacao(suspensoesAlimentacao) {
    let novoDiasRazoes = [];
    suspensoesAlimentacao.forEach(function (suspensaoAlimentacao) {
      const idx = suspensoesAlimentacao.findIndex(
        (value2) => value2.data === suspensaoAlimentacao.data
      );
      let novoDia = {
        id: geradorUUID(),
        data: suspensaoAlimentacao.data,
        motivo: suspensaoAlimentacao.motivo.uuid,
        outroMotivo:
          suspensaoAlimentacao.outro_motivo !== null &&
          suspensaoAlimentacao.outro_motivo !== "",
      };
      novoDia[`data${idx}`] = suspensaoAlimentacao.data;
      novoDia[`motivo${idx}`] = suspensaoAlimentacao.motivo.uuid;
      novoDiasRazoes.push(novoDia);
    });
    return novoDiasRazoes;
  }

  OnEditButtonClicked(param) {
    let observacao = this.state.observacao;
    observacao = param.suspensaoDeAlimentacao.observacao;
    this.props.reset("foodSuspension");
    this.props.loadFoodSuspension(param.suspensaoDeAlimentacao);
    this.setState({
      status: param.suspensaoDeAlimentacao.status,
      title: `Suspensão de Alimentação # ${param.suspensaoDeAlimentacao.id_externo}`,
      salvarAtualizarLbl: "Atualizar",
      dias_razoes: this.diasRazoesFromSuspensoesAlimentacao(
        param.suspensaoDeAlimentacao.suspensoes_alimentacao
      ),
      options: {
        MANHA:
          param.suspensaoDeAlimentacao.suspensoes_MANHA !== undefined
            ? param.suspensaoDeAlimentacao.suspensoes_MANHA.tipo_de_refeicao
            : [],
        TARDE:
          param.suspensaoDeAlimentacao.suspensoes_TARDE !== undefined
            ? param.suspensaoDeAlimentacao.suspensoes_TARDE.tipo_de_refeicao
            : [],
        NOITE:
          param.suspensaoDeAlimentacao.suspensoes_NOITE !== undefined
            ? param.suspensaoDeAlimentacao.suspensoes_NOITE.tipo_de_refeicao
            : [],
        INTEGRAL:
          param.suspensaoDeAlimentacao.suspensoes_INTEGRAL !== undefined
            ? param.suspensaoDeAlimentacao.suspensoes_INTEGRAL.tipo_de_refeicao
            : [],
        VESPERTINO:
          param.suspensaoDeAlimentacao.suspensoes_VESPERTINO !== undefined
            ? param.suspensaoDeAlimentacao.suspensoes_VESPERTINO
                .tipo_de_refeicao
            : [],
        INTERMEDIARIO:
          param.suspensaoDeAlimentacao.suspensoes_INTERMEDIARIO !== undefined
            ? param.suspensaoDeAlimentacao.suspensoes_INTERMEDIARIO
                .tipo_de_refeicao
            : [],
      },
      observacao,
    });
    window.scrollTo(0, this.titleRef.current.offsetTop - 90);
  }

  componentDidMount() {
    this.refresh();
  }

  retornaPeriodosComCombos = (periodosResponse, periodosProps) => {
    periodosProps.forEach((periodoProps) => {
      periodosResponse.forEach((periodoResp) => {
        if (periodoProps.nome === periodoResp.periodo_escolar.nome) {
          periodoProps.validador = [];
          periodoProps.checked = false;
          periodoProps.tipos_alimentacao = periodoResp.tipos_alimentacao.map(
            (tipo_alimentacao) => {
              return {
                uuid: tipo_alimentacao.uuid,
                nome: tipo_alimentacao.nome,
              };
            }
          );
        }
      });
    });
  };

  vinculaQuantidadeAlunosPorPeriodo = (
    periodosEQuantidadeAlunos,
    periodoProps
  ) => {
    periodoProps.forEach((periodo) => {
      periodosEQuantidadeAlunos.forEach((quantidade) => {
        if (periodo.nome === quantidade.periodo_escolar.nome) {
          periodo.quantidade_alunos = quantidade.quantidade_alunos;
        }
      });
    });
  };

  vinculaQuantidadeAlunosPorPeriodoCeiEmei = (
    periodosEQuantidadeAlunosCeiEmei,
    periodoProps
  ) => {
    periodoProps.forEach((periodo) => {
      periodosEQuantidadeAlunosCeiEmei.forEach((quantidadeCeiEmei) => {
        if (periodo.nome === quantidadeCeiEmei.nome) {
          periodo.alunos = [];
          if (quantidadeCeiEmei.CEI > 0) {
            periodo.alunos.push({
              value: "CEI",
              label: "CEI",
              quantidade_alunos: quantidadeCeiEmei.CEI,
            });
          }
          if (quantidadeCeiEmei.EMEI > 0) {
            periodo.alunos.push({
              value: "EMEI",
              label: "EMEI",
              quantidade_alunos: quantidadeCeiEmei.EMEI,
            });
          }
        }
      });
    });
  };

  filtrarLancheEmergencial(tipos) {
    return tipos.filter((tipo) => tipo.nome !== "Lanche Emergencial");
  }

  periodosOptions(period) {
    const { alunosCEIouEMEI, vinculos } = this.state;
    let periodos = vinculos
      ? this.filtrarLancheEmergencial(
          vinculos.find((v) => v.periodo_escolar.nome === period.nome)
            .tipos_alimentacao
        )
      : [];
    if (escolaEhCEMEI()) {
      periodos = period.tipos_alimentacao;
    }
    if (alunosCEIouEMEI[period.nome]) {
      if (alunosCEIouEMEI[period.nome].length === 2) {
        periodos = this.filtrarLancheEmergencial(
          vinculos
            .find(
              (v) =>
                v.tipo_unidade_escolar.iniciais.includes("CEI") &&
                v.periodo_escolar.nome === period.nome
            )
            .tipos_alimentacao.concat(
              vinculos.find(
                (v) =>
                  v.tipo_unidade_escolar.iniciais.includes("EMEI") &&
                  v.periodo_escolar.nome === period.nome
              ).tipos_alimentacao
            )
        );
      } else if (alunosCEIouEMEI[period.nome].includes("CEI")) {
        periodos = vinculos.find(
          (v) =>
            v.tipo_unidade_escolar.iniciais.includes("CEI") &&
            v.periodo_escolar.nome === period.nome
        ).tipos_alimentacao;
      } else if (alunosCEIouEMEI[period.nome].includes("EMEI")) {
        periodos = this.filtrarLancheEmergencial(
          vinculos.find(
            (v) =>
              v.tipo_unidade_escolar.iniciais.includes("EMEI") &&
              v.periodo_escolar.nome === period.nome
          ).tipos_alimentacao
        );
      }
    }
    return periodos.map((p) => ({
      label: p.nome,
      value: p.uuid,
    }));
  }

  componentDidUpdate(prevProps) {
    const fields = [
      "suspensoes_MANHA",
      "suspensoes_TARDE",
      "suspensoes_NOITE",
      "suspensoes_INTEGRAL",
      "suspensoes_VESPERTINO",
      "suspensoes_INTERMEDIARIO",
    ];
    fields.forEach(
      function (field) {
        if (
          prevProps[field] &&
          prevProps[field].check &&
          this.props[field] &&
          !this.props[field].check
        ) {
          let options = this.state.options;
          const value = field.split("suspensoes_")[1];
          options[value] = [];
          this.setState({
            ...this.state,
            options: options,
          });
          escolaEhCEMEI() &&
            this.props.change(field + ".alunos_cei_ou_emei", "");
          this.props.change(field + ".tipo_de_refeicao", []);
          this.props.change(field + ".numero_de_alunos", "");
        }
      }.bind(this)
    );
    if (prevProps.periodos.length === 0 && this.props.periodos.length > 0) {
      const vinculo = this.props.meusDados.vinculo_atual.instituicao.uuid;
      const escola = this.props.meusDados.vinculo_atual.instituicao;
      getVinculosTipoAlimentacaoPorEscola(vinculo).then((response) => {
        this.setState({ vinculos: response.data.results });
        this.retornaPeriodosComCombos(
          response.data.results,
          this.props.periodos
        );
      });
      getQuantidaDeAlunosPorPeriodoEEscola(escola.uuid).then((response) => {
        this.vinculaQuantidadeAlunosPorPeriodo(
          response.data.results,
          this.props.periodos
        );
      });
      escolaEhCEMEI() &&
        getQuantidadeAlunosCEMEIporPeriodoCEIEMEI(escola.codigo_eol).then(
          (response) => {
            this.vinculaQuantidadeAlunosPorPeriodoCeiEmei(
              response.data,
              this.props.periodos
            );
          }
        );
    }
    const { motivos, periodos, meusDados, proximos_dois_dias_uteis } =
      this.props;
    const { loading } = this.state;
    if (
      motivos?.length > 0 &&
      periodos?.length > 0 &&
      meusDados &&
      proximos_dois_dias_uteis &&
      loading
    ) {
      this.setState({
        loading: false,
      });
    }
  }

  refresh() {
    getSuspensoesDeAlimentacaoSalvas().then(
      (res) => {
        this.setState({
          suspensoesDeAlimentacaoList: res.results,
        });
      },
      function () {
        toastError("Erro ao carregar as suspensões salvas");
      }
    );
    this.resetForm("foodSuspension");
  }

  enviaSuspensaoDeAlimentacao(uuid) {
    enviarSuspensaoDeAlimentacao(uuid).then(
      (res) => {
        if (res.status === HTTP_STATUS.OK) {
          this.refresh();
          toastSuccess("Suspensão de alimentação enviada com sucesso");
        } else {
          toastError(
            `Erro ao enviar suspensão de alimentação: ${getError(res.data)}`
          );
        }
      },
      function () {
        toastError("Houve um erro ao enviar a suspensão de alimentação");
      }
    );
  }

  onSubmit(values) {
    // Refatorar aqui.
    values.dias_razoes = deepCopy(this.state.dias_razoes);
    values.dias_razoes.forEach((value) => {
      const idx = values.dias_razoes.findIndex(
        (value2) => value2.id === value.id
      );
      values.dias_razoes[idx]["data"] = values.dias_razoes[idx][`data${idx}`];
      values.dias_razoes[idx]["motivo"] =
        values.dias_razoes[idx][`motivo${idx}`];
      values.dias_razoes[idx]["outro_motivo"] =
        values.dias_razoes[idx][`outro_motivo${idx}`];
    });
    values.escola = this.props.meusDados.vinculo_atual.instituicao.uuid;
    const error = validateSubmit(values, this.props.meusDados);
    values.quantidades_por_periodo = values.suspensoes;
    values.suspensoes_alimentacao = values.dias_razoes;
    if (values.observacao === null) {
      values.observacao = "<p></p>\n";
    }
    const status = values.status;
    delete values.status;
    if (!error) {
      if (!values.uuid) {
        createSuspensaoDeAlimentacao(JSON.stringify(values)).then(
          async (res) => {
            if (res.status === HTTP_STATUS.CREATED) {
              this.refresh();
              if (status === STATUS_DRE_A_VALIDAR) {
                await this.enviaSuspensaoDeAlimentacao(res.data.uuid);
                this.refresh();
              } else {
                toastSuccess("Suspensão de Alimentação salva com sucesso");
              }
            } else {
              toastError(
                `Erro ao enviar suspensão de alimentação: ${getError(res.data)}`
              );
            }
          },
          function () {
            toastError("Houve um erro ao salvar a suspensão de alimentação");
          }
        );
      } else {
        updateSuspensaoDeAlimentacao(values.uuid, JSON.stringify(values)).then(
          async (res) => {
            if (res.status === HTTP_STATUS.OK) {
              this.refresh();
              if (status === STATUS_DRE_A_VALIDAR) {
                await this.enviaSuspensaoDeAlimentacao(res.data.uuid);
                this.refresh();
              } else {
                toastSuccess("Suspensão de alimentação atualizada com sucesso");
              }
            } else {
              toastError(
                `Erro ao atualizar a suspensão de alimentação: ${getError(
                  res.data
                )}`
              );
            }
          },
          function () {
            toastError("Houve um erro ao atualizar a suspensão de alimentação");
          }
        );
      }
    } else {
      toastError(error);
    }
  }

  onCheckInput = (indice) => {
    let periodos = this.props.periodos;
    let maxValueToValidate = periodos[indice].quantidade_alunos;
    periodos[indice].checked = !periodos[indice].checked;

    if (escolaEhCEMEI()) {
      let qntAlunos = 0;
      periodos[indice].alunos.forEach((obj) => {
        qntAlunos += obj.quantidade_alunos;
      });
      maxValueToValidate = qntAlunos;
    }

    periodos[indice].validador = periodos[indice].checked
      ? [naoPodeSerZero, maxValue(maxValueToValidate), required]
      : [];
    this.props.change(
      `suspensoes_${periodos[indice].nome}.check`,
      periodos[indice].checked
    );
  };

  onKeyPress(event) {
    if (event.which === ENTER) {
      event.preventDefault();
    }
  }

  render() {
    const {
      handleSubmit,
      meusDados,
      periodos,
      motivos,
      proximos_dois_dias_uteis,
      suspensoes_MANHA,
      suspensoes_TARDE,
      suspensoes_NOITE,
      suspensoes_INTEGRAL,
      suspensoes_VESPERTINO,
      suspensoes_INTERMEDIARIO,
    } = this.props;
    const {
      loading,
      title,
      options,
      suspensoesDeAlimentacaoList,
      dias_razoes,
      alunosCEIouEMEI,
    } = this.state;
    let checkMap = {
      MANHA: suspensoes_MANHA && suspensoes_MANHA.check,
      TARDE: suspensoes_TARDE && suspensoes_TARDE.check,
      NOITE: suspensoes_NOITE && suspensoes_NOITE.check,
      INTEGRAL: suspensoes_INTEGRAL && suspensoes_INTEGRAL.check,
      VESPERTINO: suspensoes_VESPERTINO && suspensoes_VESPERTINO.check,
      INTERMEDIARIO: suspensoes_INTERMEDIARIO && suspensoes_INTERMEDIARIO.check,
    };
    return (
      <div>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            onKeyPress={this.onKeyPress}
          >
            <Field component={"input"} type="hidden" name="uuid" />
            <CardMatriculados
              meusDados={meusDados}
              numeroAlunos={
                meusDados.vinculo_atual.instituicao.quantidade_alunos
              }
            />
            {suspensoesDeAlimentacaoList.length > 0 && (
              <div className="mt-3">
                <span ref={this.titleRef} className="page-title">
                  Rascunhos
                </span>
                <Rascunhos
                  suspensoesDeAlimentacaoList={suspensoesDeAlimentacaoList}
                  OnDeleteButtonClicked={this.OnDeleteButtonClicked}
                  resetForm={(event) => this.resetForm(event)}
                  OnEditButtonClicked={(params) =>
                    this.OnEditButtonClicked(params)
                  }
                />
              </div>
            )}
            <div className="mt-2 page-title">{title}</div>
            <div className="card solicitation mt-3">
              <div className="card-body">
                <div className="card-title fw-bold">Descrição da Suspensão</div>
                {dias_razoes.map((dia_motivo, key) => {
                  return (
                    <FormSection
                      key={key}
                      name={`dias_razoes_${dia_motivo.data}`}
                    >
                      <div className="form-row">
                        <div className="form-group col-sm-3">
                          <Field
                            component={InputComData}
                            name={`data${key}`}
                            minDate={proximos_dois_dias_uteis}
                            maxDate={fimDoCalendario()}
                            onChange={(value) =>
                              this.handleField(`data${key}`, value, key)
                            }
                            label="Dia"
                            required
                            validate={required}
                          />
                        </div>
                        <div className="form-group col-sm-8">
                          <Field
                            component={Select}
                            name={`motivo${key}`}
                            label="Motivo"
                            options={motivos}
                            onChange={(event) =>
                              this.handleField(
                                `motivo${key}`,
                                event.target.value,
                                key
                              )
                            }
                            required
                            validate={required}
                          />
                        </div>
                      </div>
                      {dia_motivo.outroMotivo && (
                        <div className="form-row">
                          <div className="form-group col-sm-12">
                            <Field
                              component={TextArea}
                              label="Qual o motivo?"
                              onChange={(event) =>
                                this.handleField(
                                  `outro_motivo${key}`,
                                  event.target.value,
                                  key
                                )
                              }
                              required
                              name={`outro_motivo${key}`}
                              className="form-control"
                              validate={required}
                            />
                            {this.state.acimaDoLimite.includes(key) && (
                              <div className="error-msg">
                                Limite máximo de 500 caracteres
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </FormSection>
                  );
                })}
                <Botao
                  texto="Adicionar dia"
                  titulo="Adicionar dia"
                  className="col-3"
                  onClick={() => this.addDay()}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  type={BUTTON_TYPE.BUTTON}
                />
                <div className="row labels mt-3 mb-2">
                  <div className={`col-${escolaEhCEMEI() ? "3" : "4"}`}>
                    Período
                  </div>
                  {escolaEhCEMEI() && <div className="col-3">Alunos</div>}
                  <div className={`col-${escolaEhCEMEI() ? "3" : "4"}`}>
                    Tipo de Alimentação
                  </div>
                  <div className={`col-${escolaEhCEMEI() ? "3" : "4"}`}>
                    Nº de Alunos
                  </div>
                </div>
                {periodos.map((period, key) => {
                  this.props.change(
                    `suspensoes_${period.nome}.periodo`,
                    period.uuid
                  );
                  return (
                    <FormSection key={key} name={`suspensoes_${period.nome}`}>
                      <div className="row">
                        <Field component={"input"} type="hidden" name="value" />
                        <div className={`col-${escolaEhCEMEI() ? "3" : "4"}`}>
                          <div
                            className={`period-quantity number-${key} ps-5 pt-2 pb-2`}
                          >
                            <label htmlFor="check" className="checkbox-label">
                              <Field
                                component={"input"}
                                type="checkbox"
                                name="check"
                              />
                              <span
                                onClick={() => this.onCheckInput(key)}
                                className="checkbox-custom"
                              />{" "}
                              {period.nome}
                            </label>
                          </div>
                        </div>
                        {escolaEhCEMEI() && (
                          <div className="col-3">
                            <div
                              className={
                                checkMap[period.nome]
                                  ? "multiselect-wrapper-enabled"
                                  : "multiselect-wrapper-disabled"
                              }
                            >
                              <Field
                                component={MultiSelect}
                                name="alunos_cei_ou_emei"
                                options={period.alunos || []}
                                onChange={(values) =>
                                  this.handleSelectedChangedAlunos(
                                    values,
                                    period
                                  )
                                }
                                disableSearch={true}
                                overrideStrings={{
                                  selectSomeItems: "Selecione",
                                  allItemsAreSelected:
                                    period.alunos && period.alunos.length === 1
                                      ? `${period.alunos[0].value}`
                                      : "Todos os Alunos selecionados",
                                  selectAll: "Todos",
                                }}
                                hasSelectAll={
                                  period.alunos && period.alunos.length !== 1
                                }
                                nomeDoItemNoPlural="Alunos"
                                required
                                validate={period.validador}
                              />
                            </div>
                          </div>
                        )}
                        <div className={`col-${escolaEhCEMEI() ? "3" : "4"}`}>
                          <div
                            className={
                              checkMap[period.nome]
                                ? "multiselect-wrapper-enabled"
                                : "multiselect-wrapper-disabled"
                            }
                          >
                            <Field
                              component={MultiSelect}
                              name="tipo_de_refeicao"
                              selected={options[period.nome] || []}
                              options={this.periodosOptions(period)}
                              onSelectedChanged={(values) =>
                                this.handleSelectedChanged(values, period)
                              }
                              disableSearch={true}
                              overrideStrings={{
                                selectSomeItems: "Selecione",
                                allItemsAreSelected:
                                  "Todos os itens estão selecionados",
                                selectAll: "Todos",
                              }}
                              nomeDoItemNoPlural="Tipos"
                              required={checkMap[period.nome]}
                              validate={period.validador}
                              disabled={
                                escolaEhCEMEI() && !alunosCEIouEMEI[period.nome]
                              }
                            />
                          </div>
                        </div>
                        <div className={`col-${escolaEhCEMEI() ? "3" : "4"}`}>
                          <Field
                            component={InputText}
                            disabled={!checkMap[period.nome]}
                            type="number"
                            name="numero_de_alunos"
                            min="0"
                            className="form-control"
                            required={checkMap[period.nome]}
                            validate={
                              !usuarioEhEscolaCeuGestao() &&
                              !usuarioEhEscolaCMCT()
                                ? period.validador
                                : checkMap[period.nome] && [
                                    naoPodeSerZero,
                                    required,
                                  ]
                            }
                          />
                        </div>
                      </div>
                    </FormSection>
                  );
                })}
                <hr className="w-100" />
                <div className="form-group pb-5">
                  <Field
                    component={CKEditorField}
                    label="Observações"
                    name="observacao"
                  />
                </div>
                <div className="form-group row float-end mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Cancelar"
                      onClick={(event) => this.resetForm(event)}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                    <Botao
                      texto={this.state.salvarAtualizarLbl}
                      onClick={handleSubmit((values) =>
                        this.onSubmit({
                          ...values,
                        })
                      )}
                      className="ms-3"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                    <Botao
                      texto="Enviar"
                      type={BUTTON_TYPE.SUBMIT}
                      onClick={handleSubmit((values) =>
                        this.onSubmit({
                          ...values,
                          status: STATUS_DRE_A_VALIDAR,
                        })
                      )}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}

const FoodSuspensionEditorForm = reduxForm({
  form: "foodSuspension",
  enableReinitialize: true,
})(FoodSuspensionEditor);
const selector = formValueSelector("foodSuspension");
const mapStateToProps = (state) => {
  return {
    initialValues: state.suspensaoDeAlimentacao.data,
    observacao: selector(state, "observacao"),
    suspensoes_MANHA: selector(state, "suspensoes_MANHA"),
    suspensoes_TARDE: selector(state, "suspensoes_TARDE"),
    suspensoes_NOITE: selector(state, "suspensoes_NOITE"),
    suspensoes_INTEGRAL: selector(state, "suspensoes_INTEGRAL"),
    suspensoes_VESPERTINO: selector(state, "suspensoes_VESPERTINO"),
    suspensoes_INTERMEDIARIO: selector(state, "suspensoes_INTERMEDIARIO"),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadFoodSuspension,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoodSuspensionEditorForm);
