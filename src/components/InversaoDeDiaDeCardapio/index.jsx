import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { Component } from "react";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Field, reduxForm, change } from "redux-form";
import {
  required,
  peloMenosUmCaractere,
  textAreaRequired,
} from "../../helpers/fieldValidators";
import {
  checaSeDataEstaEntre2e5DiasUteis,
  dateDelta,
  escolaEhCEMEI,
  fimDoCalendario,
  formatarParaMultiselect,
  getError,
} from "../../helpers/utilities";
import { loadInversaoDeDiaDeCardapio } from "../../reducers/inversaoDeDiaDeCardapio.reducer";
import {
  atualizarInversaoDeDiaDeCardapio,
  criarInversaoDeDiaDeCardapio,
  getInversoesDeDiaDeCardapio,
  inicioPedido,
  removerInversaoDeDiaDeCardapio,
} from "../../services/inversaoDeDiaDeCardapio.service";
import CardMatriculados from "../Shareable/CardMatriculados";
import { toastError, toastSuccess } from "../Shareable/Toast/dialogs";
import ModalDataPrioritaria from "../Shareable/ModalDataPrioritaria";
import { Rascunhos } from "./Rascunhos";
import "./style.scss";
import { STATUS_DRE_A_VALIDAR } from "../../configs/constants";
import { InputComData } from "../Shareable/DatePicker";
import CKEditorField from "src/components/Shareable/CKEditorField";
import Botao from "../Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON,
} from "../Shareable/Botao/constants";
import { JS_DATE_NOVEMBRO } from "src/constants/shared";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";
import { getDiasUteis } from "src/services/diasUteis.service";

export class InversaoDeDiaDeCardapio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rascunhosInversoes: [],
      status: "SEM STATUS",
      title: "Nova Solicitação",
      salvarAtualizarLbl: "Salvar Rascunho",
      segundoDiaUtil: "",
      showModal: false,
      loading: true,
      adicionarOutroDia: false,
      tiposAlimentacao: [],
      dataInicial: null,
      dataInicial_2: null,
      tiposAlimentacaoSelecionados: [],
    };
    this.carregarRascunho = this.carregarRascunho.bind(this);
    this.removerRascunho = this.removerRascunho.bind(this);
    this.refresh = this.refresh.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  removerRascunho(id_externo, uuid) {
    if (window.confirm("Deseja remover este rascunho?")) {
      removerInversaoDeDiaDeCardapio(uuid).then(
        (res) => {
          if (res.status === HTTP_STATUS.NO_CONTENT) {
            toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
            this.refresh();
          } else {
            toastError(`Erro ao remover rascunho: ${getError(res.data)}`);
          }
        },
        function () {
          toastError("Houve um erro ao excluir o rascunho");
        }
      );
      this.resetForm();
    }
  }

  resetForm() {
    this.props.reset("inversaoDeDiaDeCardapioForm");
    this.props.loadInversaoDeDiaDeCardapio(null);
    this.setState({
      status: "SEM STATUS",
      title: "Nova Solicitação",
      salvarAtualizarLbl: "Salvar Rascunho",
    });
    this.refresh();
  }

  carregarRascunho(param) {
    const inversaoDeDiaDeCardapio = param.inversaoDeDiaDeCardapio;
    this.props.reset("inversaoDeDiaDeCardapioForm");
    this.props.loadInversaoDeDiaDeCardapio(inversaoDeDiaDeCardapio);
    this.setState({
      status: inversaoDeDiaDeCardapio.status,
      title: `Inversão de dia de Cardápio # ${inversaoDeDiaDeCardapio.id_externo}`,
      salvarAtualizarLbl: "Atualizar",
      adicionarOutroDia: inversaoDeDiaDeCardapio.data_de_inversao_2
        ? true
        : false,
      tiposAlimentacaoSelecionados: formatarParaMultiselect(
        inversaoDeDiaDeCardapio.tipos_alimentacao
      ),
    });
  }

  retornaTiposAlimentacaoSemRepeticao(vinculos) {
    let tiposAlimentacao = [];
    for (let periodo in vinculos) {
      let listaTiposAlimentacao = vinculos[periodo].tipos_alimentacao;
      for (let tipoAlimentacao of listaTiposAlimentacao) {
        if (
          tipoAlimentacao.nome !== "Lanche Emergencial" &&
          !tiposAlimentacao.some((t) => t.nome === tipoAlimentacao.nome)
        ) {
          tiposAlimentacao.push(tipoAlimentacao);
        }
      }
    }
    this.setState({
      tiposAlimentacao: formatarParaMultiselect(tiposAlimentacao),
    });
  }

  componentDidMount() {
    this.refresh();
  }

  async componentDidUpdate() {
    const { meusDados, proximos_dois_dias_uteis } = this.props;
    const { loading } = this.state;
    const dadosDaAPItotalmenteCarregados =
      meusDados !== null && proximos_dois_dias_uteis !== null && loading;
    if (dadosDaAPItotalmenteCarregados) {
      this.setState({
        loading: false,
      });
      const escola_uuid = meusDados.vinculo_atual.instituicao.uuid;
      const response = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
      if (response.status === HTTP_STATUS.OK) {
        this.retornaTiposAlimentacaoSemRepeticao(response.data.results);
      } else {
        toastError("Erro ao carregar vínculos de tipo de alimentação.");
      }
    }
  }

  refresh() {
    getInversoesDeDiaDeCardapio().then((response) => {
      const rascunhosInversoes = response.data.results;
      this.setState({ rascunhosInversoes });
    });
  }

  showModal() {
    this.setState({ ...this.state, showModal: true });
  }

  closeModal() {
    this.setState({ ...this.state, showModal: false });
  }

  validaDiasUteis = (value) => {
    if (
      value &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        this.props.proximos_dois_dias_uteis,
        this.props.proximos_cinco_dias_uteis
      )
    ) {
      this.showModal();
    }
  };

  removerDiaAdicional() {
    this.props.dispatch(
      change("inversaoDeDiaDeCardapioForm", "data_de_2", null)
    );
    this.props.dispatch(
      change("inversaoDeDiaDeCardapioForm", "data_para_2", null)
    );
    this.props.dispatch(
      change("inversaoDeDiaDeCardapioForm", "alunos_da_cemei_2", "")
    );
    this.setState({ ...this.state, adicionarOutroDia: false });
  }

  iniciarPedido(uuid) {
    inicioPedido(uuid).then(
      (res) => {
        if (res.status === HTTP_STATUS.OK) {
          toastSuccess("Inversão de dia de Cardápio enviada com sucesso!");
          this.resetForm();
          this.removerDiaAdicional();
        } else if (res.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(
            `Houve um erro ao enviar a Inversão de dia de Cardápio: ${getError(
              res.data
            )}`
          );
        }
      },
      function () {
        toastError("Houve um erro ao enviar a Inversão de dia de Cardápio");
      }
    );
  }

  prepararAlunosCemei(alunos_da_cemei) {
    if (alunos_da_cemei) {
      if (alunos_da_cemei.length === 2) {
        return "Todos";
      } else if (alunos_da_cemei.includes("CEI")) {
        return "CEI";
      } else {
        return "EMEI";
      }
    }
    return "";
  }

  onSubmit(values) {
    values["alunos_da_cemei"] = this.prepararAlunosCemei(
      values["alunos_da_cemei"]
    );
    values["alunos_da_cemei_2"] = this.prepararAlunosCemei(
      values["alunos_da_cemei_2"]
    );
    values.escola = this.props.meusDados.vinculo_atual.instituicao.uuid;
    if (!values.uuid) {
      criarInversaoDeDiaDeCardapio(values).then((response) => {
        if (response.status === HTTP_STATUS.CREATED) {
          if (values.status === STATUS_DRE_A_VALIDAR) {
            this.iniciarPedido(response.data.uuid);
          } else {
            toastSuccess("Inversão de dia de Cardápio salvo com sucesso!");
            this.resetForm();
          }
        } else {
          toastError(
            `Erro ao enviar Inversão de dia de Cardápio: ${getError(
              response.data
            )}`
          );
        }
      });
    } else {
      atualizarInversaoDeDiaDeCardapio(values.uuid, values).then((response) => {
        if (response.status === HTTP_STATUS.OK) {
          if (values.status === STATUS_DRE_A_VALIDAR) {
            this.iniciarPedido(response.data.uuid);
          } else {
            toastSuccess("Inversão de dia de Cardápio atualizado com sucesso!");
            this.resetForm();
          }
        } else {
          let keys = Object.keys(response.data);
          keys.forEach(function () {
            toastError(
              `Erro ao enviar Inversão de dia de Cardápio: ${getError(
                response.data
              )}`
            );
          });
        }
      });
    }
  }

  obtemDataInicial = (field, value) => {
    let dataInicial = this.state.dataInicial;
    dataInicial = moment(value, "DD/MM/YYYY").add(1, "days")["_d"];
    this.setState({ [field]: dataInicial });
    const dataDe = {
      data: value,
    };
    getDiasUteis(dataDe).then((response) => {
      const limiteDataFinal = moment(
        response.data.data_apos_quatro_dias_uteis,
        "YYYY-MM-DD"
      )._d;
      this.setState({ limiteDataFinal });
    });
  };

  render() {
    const {
      showModal,
      loading,
      rascunhosInversoes,
      adicionarOutroDia,
      tiposAlimentacao,
    } = this.state;
    const { handleSubmit, pristine, proximos_dois_dias_uteis, meusDados } =
      this.props;
    const linha_adicionar_dia = (
      data_de,
      data_para,
      alunos,
      pode_remover = false,
      fieldDataInicial = "dataInicial"
    ) => (
      <div className="row w-100 pt-3">
        <div
          className={`inversao-datepicker col-md-12 col-lg-${
            escolaEhCEMEI() ? "3" : "4"
          }`}
        >
          <Field
            component={InputComData}
            name={data_de}
            label="Referência"
            placeholder="Cardápio dia"
            required
            validate={required}
            onBlur={(event) => this.validaDiasUteis(event.target.value)}
            onChange={(value) => {
              this.validaDiasUteis(value);
              this.obtemDataInicial(fieldDataInicial, value);
              this.props.dispatch(
                change("inversaoDeDiaDeCardapioForm", data_para, null)
              );
            }}
            minDate={proximos_dois_dias_uteis}
            maxDate={
              new Date().getMonth() === JS_DATE_NOVEMBRO
                ? fimDoCalendario()
                : dateDelta(60)
            }
          />
        </div>
        <div className={`col-md-12 col-lg-1 for-span`}>
          <i className="fas fa-arrow-left" />
          <span className="ps-1 pe-1">para</span>
          <i className="fas fa-arrow-right" />
        </div>
        <div
          className={`inversao-datepicker col-md-12 col-lg-${
            escolaEhCEMEI() ? "3" : "4"
          }`}
        >
          <Field
            component={InputComData}
            name={data_para}
            disabled={this.state[fieldDataInicial] === null}
            label="Aplicar em"
            placeholder="Cardápio dia"
            required
            validate={required}
            onBlur={(event) => this.validaDiasUteis(event.target.value)}
            onChange={(value) => this.validaDiasUteis(value)}
            minDate={proximos_dois_dias_uteis}
            excludeDates={[
              moment(this.state[fieldDataInicial]).add(-1, "days")["_d"],
            ]}
            maxDate={
              new Date().getMonth() === JS_DATE_NOVEMBRO
                ? fimDoCalendario()
                : dateDelta(60)
            }
          />
        </div>
        {escolaEhCEMEI() && (
          <div className="inversao-datepicker col-md-12 col-lg-3">
            <Field
              component={MultiSelect}
              disableSearch
              label="Alunos"
              name={alunos}
              multiple
              options={[
                { value: "CEI", label: "CEI" },
                { value: "EMEI", label: "EMEI" },
              ]}
              nomeDoItemNoPlural="Alunos"
              validate={required}
            />
          </div>
        )}
        {pode_remover && (
          <div className="col-md-12 col-lg-2">
            <Botao
              texto="Remover dia"
              titulo="remover_dia"
              icon={BUTTON_ICON.TRASH}
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.BLUE_OUTLINE}
              className="w-100 py-0 btn-remover"
              onClick={() => this.removerDiaAdicional()}
            />
          </div>
        )}
      </div>
    );
    return (
      <div>
        {loading && !meusDados ? (
          <div>Carregando...</div>
        ) : (
          <form className="mt-2">
            <Field component={"input"} type="hidden" name="uuid" />
            <CardMatriculados
              numeroAlunos={
                meusDados.vinculo_atual.instituicao.quantidade_alunos || 0
              }
              meusDados={meusDados}
            />
            {rascunhosInversoes.length > 0 && (
              <div className="mt-3">
                <span className="page-title">Rascunhos</span>
                <Rascunhos
                  rascunhosInversoes={rascunhosInversoes}
                  removerRascunho={this.removerRascunho}
                  resetForm={() => this.resetForm()}
                  carregarRascunho={(params) => this.carregarRascunho(params)}
                />
              </div>
            )}
            <div className="mt-2 page-title">{this.state.title}</div>
            <div className="card inversao-dia-cardapio border rounded mt-2">
              <div className="card-body">
                <label className="card-title fw-bold">
                  Descrição da Inversão
                </label>
                <div className="row">
                  <div className="col-8">
                    <Field
                      component={MultiSelect}
                      disableSearch
                      label="Tipo de Alimentação"
                      name="tipos_alimentacao"
                      required
                      multiple
                      options={tiposAlimentacao}
                      nomeDoItemNoPlural="Tipos de Alimentação"
                      validate={required}
                    />
                  </div>
                </div>
                {linha_adicionar_dia("data_de", "data_para", "alunos_da_cemei")}
                {adicionarOutroDia ? (
                  linha_adicionar_dia(
                    "data_de_2",
                    "data_para_2",
                    "alunos_da_cemei_2",
                    true,
                    "dataInicial_2"
                  )
                ) : (
                  <div className="row">
                    <div className="col-5">
                      <Botao
                        texto="Adicionar Dia"
                        titulo="adicionar_dia"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        className="mt-3 mb-3"
                        onClick={() =>
                          this.setState({
                            ...this.state,
                            adicionarOutroDia: true,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-12">
                    <Field
                      component={CKEditorField}
                      label="Motivo"
                      name="motivo"
                      required
                      validate={[textAreaRequired, peloMenosUmCaractere]}
                    />
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-12 mt-2 pb-5">
                    <Field
                      component={CKEditorField}
                      label="Observação"
                      name="observacao"
                    />
                  </div>
                </div>
                <div className="row text-end mt-4">
                  <div className="col-12 mt-2">
                    <Botao
                      texto="Cancelar"
                      onClick={(event) => this.resetForm(event)}
                      disabled={pristine}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      type={BUTTON_TYPE.SUBMIT}
                    />
                    <Botao
                      texto={this.state.salvarAtualizarLbl}
                      onClick={handleSubmit((values) => this.onSubmit(values))}
                      className="ms-3"
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      type={BUTTON_TYPE.SUBMIT}
                    />
                    <Botao
                      texto="Enviar"
                      onClick={handleSubmit((values) =>
                        this.onSubmit({
                          ...values,
                          status: STATUS_DRE_A_VALIDAR,
                        })
                      )}
                      style={BUTTON_STYLE.GREEN}
                      type={BUTTON_TYPE.SUBMIT}
                      className="ms-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
        <ModalDataPrioritaria
          showModal={showModal}
          closeModal={this.closeModal}
        />
      </div>
    );
  }
}

InversaoDeDiaDeCardapio = reduxForm({
  form: "inversaoDeDiaDeCardapioForm",
  enableReinitialize: true,
})(InversaoDeDiaDeCardapio);

const mapStateToProps = (state) => {
  return {
    initialValues: state.inversaoDeDiaDeCardapioForm.data,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadInversaoDeDiaDeCardapio,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InversaoDeDiaDeCardapio);
