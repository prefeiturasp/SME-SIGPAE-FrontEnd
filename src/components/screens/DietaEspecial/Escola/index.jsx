import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Field, FormSection, formValueSelector, reduxForm } from "redux-form";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CardMatriculados from "src/components/Shareable/CardMatriculados";
import CheckboxField from "src/components/Shareable/Checkbox/Field";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import withNavigationType from "src/components/Shareable/withNavigationType";
import { DIETA_ESPECIAL, ESCOLA, RELATORIO } from "src/configs/constants";
import {
  length,
  minLength,
  required,
  validaCPF,
} from "src/helpers/fieldValidators";
import { cpfMask, dateDelta, deepCopy, getError } from "src/helpers/utilities";
import { loadSolicitacoesVigentes } from "src/reducers/incluirDietaEspecialReducer";
import {
  deleteFotoAluno,
  getAlunoPertenceAEscola,
  getFotoAluno,
  updateFotoAluno,
} from "src/services/aluno.service";
import {
  criaDietaEspecial,
  getDietasEspeciaisVigentesDeUmAluno,
} from "src/services/dietaEspecial.service";
import { meusDados, obtemDadosAlunoPeloEOL } from "src/services/perfil.service";
import Laudo from "./componentes/Laudo";
import Prescritor from "./componentes/Prescritor";
import SolicitacaoVigente from "./componentes/SolicitacaoVigente";
import { formatarSolicitacoesVigentes, podeAtualizarFoto } from "./helper";
import "./style.scss";

const minLength6 = minLength(6);
const length7 = length(7);

class solicitacaoDietaEspecial extends Component {
  constructor(props) {
    super(props);
    window.changeForm = props.change;
    window.momentjs = moment;
    this.state = {
      quantidadeAlunos: "...",
      codigo_eol_escola: null,
      files: null,
      submitted: false,
      resumo: null,
      aluno_nao_matriculado: false,
      pertence_a_escola: null,
      fotoAlunoSrc: null,
      criadoRf: null,
      deletandoImagem: false,
      atualizandoImagem: false,
      nome_escola: "",
    };
    this.resetForm = this.resetForm.bind(this);
    this.onEolBlur = this.onEolBlur.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    meusDados().then((meusDados) => {
      this.setState({
        quantidadeAlunos: meusDados.vinculo_atual.instituicao.quantidade_alunos,
        codigo_eol_escola: meusDados.vinculo_atual.instituicao.codigo_eol,
        nome_escola: meusDados.vinculo_atual.instituicao.nome,
      });
    });
    const { navigationType, loadSolicitacoesVigentes, reset } = this.props;
    if (navigationType === "PUSH") {
      loadSolicitacoesVigentes(null);
      reset();
    }
  }

  atualizarFoto = async (codigo_eol, files) => {
    if (files.length > 0) {
      this.setState({ atualizandoImagem: true });
      const response = await updateFotoAluno(codigo_eol, files);
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Foto atualizada com sucesso");
        const responseFoto = await getFotoAluno(codigo_eol);
        if (responseFoto) {
          if (responseFoto.status === HTTP_STATUS.OK) {
            this.setState({
              fotoAlunoSrc: `data:${responseFoto.data.data.download.item2};base64,${responseFoto.data.data.download.item1}`,
              criadoRf: responseFoto.data.data.criadoRf,
            });
          } else {
            this.setState({ fotoAlunoSrc: null, criadoRf: null });
          }
          this.setState({ atualizandoImagem: false });
        }
      } else {
        toastError(getError(response.data));
      }
    }
  };

  deletarFoto = async (codigo_eol) => {
    if (window.confirm("Deseja realmente excluir a foto deste aluno?")) {
      this.setState({ deletandoImagem: true });
      const response = await deleteFotoAluno(codigo_eol);
      if (response) {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess("Foto deletada com sucesso");
          this.setState({ fotoAlunoSrc: null, criadoRf: null });
          this.inputRef.value = "";
        } else {
          toastError(getError(response.data));
        }
        this.setState({ deletandoImagem: false });
      }
    }
  };

  onEolBlur = async (event) => {
    const { change } = this.props;
    const { codigo_eol_escola } = this.state;
    this.setState({ fotoAlunoSrc: undefined, criadoRf: null });
    change("codigo_eol", event.target.value);
    change("aluno_json.nome", "");
    change("aluno_json.data_nascimento", "");

    if (event.target.value.length !== 7) return;

    const resposta = await obtemDadosAlunoPeloEOL(event.target.value);
    if (!resposta) return;
    if (resposta.status === 400) {
      this.setState({ pertence_a_escola: null });
      toastError("Aluno não encontrado no EOL.");
      return;
    }

    getDietasEspeciaisVigentesDeUmAluno(
      event.target.value.padStart(6, "0"),
    ).then((response) => {
      this.props.loadSolicitacoesVigentes(
        formatarSolicitacoesVigentes(
          response.data.results
            .filter((dieta) => dieta.tipo_solicitacao === "COMUM")
            .splice(0, 1),
        ),
      );
    });

    getAlunoPertenceAEscola(event.target.value, codigo_eol_escola).then(
      (response) => {
        if (response.status === 200) {
          this.setState({
            pertence_a_escola: response.data.pertence_a_escola,
            fotoAlunoSrc: undefined,
            criadoRf: null,
          });
          if (response.data.pertence_a_escola) {
            change("aluno_json.nome", resposta.data.detail.nm_aluno);
            change(
              "aluno_json.data_nascimento",
              moment(resposta.data.detail.dt_nascimento_aluno).format(
                "DD/MM/YYYY",
              ),
            );
            getFotoAluno(event.target.value).then((responseFoto) => {
              if (responseFoto.status === HTTP_STATUS.OK) {
                this.setState({
                  fotoAlunoSrc: `data:${responseFoto.data.data.download.item2};base64,${responseFoto.data.data.download.item1}`,
                  criadoRf: responseFoto.data.data.criadoRf,
                });
              } else {
                this.setState({ fotoAlunoSrc: null, criadoRf: null });
              }
            });
          } else {
            change("aluno_json.nome", "");
            change("aluno_json.data_nascimento", "");
            change("nome_completo_pescritor", "");
            change("registro_funcional_pescritor", "");
          }
        } else {
          this.setState({
            pertence_a_escola: null,
            fotoAlunoSrc: null,
            criadoRf: null,
          });
        }
      },
    );
  };

  async onSubmit(payload) {
    const payload_ = deepCopy(payload);
    payload_.anexos = payload_.anexos.map((anexo) => {
      return {
        nome: anexo.nome,
        arquivo: anexo.base64,
      };
    });
    if (
      payload_.aluno_nao_matriculado_data &&
      payload_.aluno_nao_matriculado_data.data_nascimento.includes("T")
    ) {
      payload_.aluno_nao_matriculado_data.data_nascimento =
        payload_.aluno_nao_matriculado_data.data_nascimento.split("T")[0];
    }
    const response = await criaDietaEspecial(payload_);
    if (response.status === HTTP_STATUS.CREATED) {
      toastSuccess("Solicitação realizada com sucesso.");
      this.setState({
        submitted: !this.state.submitted,
        resumo: `/${ESCOLA}/${DIETA_ESPECIAL}/${RELATORIO}?uuid=${response.data.uuid}`,
      });
      this.props.loadSolicitacoesVigentes(null);
      this.setState({
        aluno_nao_matriculado: false,
        fotoAlunoSrc: undefined,
        criadoRf: null,
      });
      this.resetForm();
    } else {
      toastError(getError(response.data));
    }
  }

  resetForm() {
    this.props.reset("solicitacaoDietaEspecial");
  }

  atualizaCamposAlunoNaoMatriculado() {
    const { change } = this.props;
    const { codigo_eol_escola, nome_escola } = this.state;
    change("aluno_nao_matriculado_data.codigo_eol_escola", codigo_eol_escola);
    change("aluno_nao_matriculado_data.nome_escola", nome_escola);
  }

  render() {
    const {
      quantidadeAlunos,
      fotoAlunoSrc,
      deletandoImagem,
      atualizandoImagem,
      pertence_a_escola,
      criadoRf,
    } = this.state;
    const {
      handleSubmit,
      pristine,
      submitting,
      solicitacoesVigentes,
      codigo_eol,
    } = this.props;

    return (
      <form className="special-diet mt-3" onSubmit={handleSubmit}>
        <CardMatriculados numeroAlunos={quantidadeAlunos} />
        <div className="card mt-2 p-4">
          <div className="row">
            <div className="col d-flex flex-row text-gray">
              <Field
                className="check-tipo-produto"
                component={CheckboxField}
                name="aluno_nao_matriculado"
                dataTestId="checkbox-aluno-nao-matriculado"
                type="checkbox"
                onChange={(ehAlunoNaoMatriculado) => {
                  this.props.loadSolicitacoesVigentes(null);
                  this.props.reset();
                  this.setState({
                    aluno_nao_matriculado: ehAlunoNaoMatriculado,
                  });
                  if (ehAlunoNaoMatriculado) {
                    this.atualizaCamposAlunoNaoMatriculado();
                  }
                }}
              />
              <div className="ms-3">
                Dieta Especial destina-se à aluno não matriculado na Rede
                Municipal de Ensino
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="ms-3 card-title fw-bold cinza-escuro">
              Descrição da Solicitação
            </span>
            {this.state.aluno_nao_matriculado && (
              <div className="d-flex flex-row text-gray align-items-center">
                <Field
                  className="check-tipo-produto"
                  component={CheckboxField}
                  dataTestId="checkbox-dieta-para-recreio-nas-ferias"
                  name="dieta_para_recreio_ferias"
                  type="checkbox"
                  onChange={(event, newValue) => {
                    if (!newValue) {
                      this.props.change("data_inicio", null);
                      this.props.change("data_termino", null);
                    }
                  }}
                />
                <span className="ms-3">Dieta para Recreio nas Férias</span>
              </div>
            )}
          </div>
          {!this.state.aluno_nao_matriculado && (
            <>
              <FormSection name="aluno_json">
                <div className="row">
                  <div className="col-sm-2 col-12">
                    <Field
                      component={InputText}
                      name="codigo_eol"
                      dataTestId="input-codigo-eol-aluno"
                      label="Cód. EOL do Aluno"
                      placeholder="Insira o Código"
                      className="form-control"
                      type="number"
                      required
                      tabindex="1"
                      validate={[required, length7]}
                      onChange={this.onEolBlur}
                    />
                  </div>
                </div>
                <div className="row mt-3 mb-3">
                  <div className="col-lg-2 col-xl-1 my-auto">
                    {fotoAlunoSrc && (
                      <img height="88" src={fotoAlunoSrc} alt="foto-aluno" />
                    )}
                    {!fotoAlunoSrc && (
                      <>
                        <img
                          height="88"
                          src="/assets/image/no-avatar.png"
                          alt="foto-anonymous"
                        />
                        {codigo_eol &&
                          codigo_eol.length >= 7 &&
                          pertence_a_escola &&
                          fotoAlunoSrc === undefined && (
                            <div className="foto-legenda">
                              Carregando imagem...
                              <div className="text-center">
                                <img
                                  src="/assets/image/ajax-loader.gif"
                                  alt="ajax-loader"
                                />
                              </div>
                            </div>
                          )}
                        {codigo_eol &&
                          codigo_eol.length >= 7 &&
                          fotoAlunoSrc === null && (
                            <>
                              <div className="foto-legenda">
                                Foto não encontrada
                              </div>
                            </>
                          )}
                      </>
                    )}
                  </div>
                  <div className={`col-lg-10 col-xl-11 bloco-nome-data`}>
                    <div className="row">
                      <div className={`col-9`}>
                        <Field
                          component={InputText}
                          name="nome"
                          label="Nome completo do Aluno"
                          className="form-control"
                          disabled
                          tabindex="-1"
                          validate={[required, minLength6]}
                        />
                      </div>
                      <div className="col-sm-3 col-12">
                        <Field
                          component={InputComData}
                          label="Data de Nascimento"
                          name="data_nascimento"
                          className="form-control color-disabled"
                          minDate={dateDelta(-360 * 99)}
                          maxDate={dateDelta(-1)}
                          showMonthDropdown
                          showYearDropdown
                          disabled
                          tabindex="-1"
                          required
                          validate={required}
                        />
                      </div>
                    </div>
                    <span className="input-file">
                      <input
                        className="inputfile"
                        data-testid="input-file-foto-aluno"
                        name="foto_aluno"
                        ref={(i) => (this.inputRef = i)}
                        accept=".png, .jpeg, .jpg"
                        type="file"
                        onChange={(e) =>
                          this.atualizarFoto(codigo_eol, e.target.files)
                        }
                      />
                    </span>
                    <Botao
                      texto={
                        !atualizandoImagem ? "Atualizar imagem" : "Aguarde..."
                      }
                      className="me-3"
                      onClick={() => this.inputRef.click()}
                      disabled={
                        fotoAlunoSrc ||
                        !codigo_eol ||
                        codigo_eol.length < 7 ||
                        atualizandoImagem
                      }
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                    <Botao
                      disabled={
                        !podeAtualizarFoto(criadoRf) ||
                        !fotoAlunoSrc ||
                        deletandoImagem
                      }
                      texto={!deletandoImagem ? "Deletar imagem" : "Aguarde..."}
                      onClick={() => this.deletarFoto(codigo_eol)}
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.RED}
                    />
                  </div>
                </div>
              </FormSection>
              {pertence_a_escola === false && (
                <div className="current-diets">
                  <div className="pt-2 no-diets">
                    Aluno não pertence a unidade educacional.
                  </div>
                </div>
              )}
              {pertence_a_escola === true && solicitacoesVigentes && (
                <SolicitacaoVigente
                  solicitacoesVigentes={solicitacoesVigentes}
                />
              )}

              <Prescritor pertence_a_escola={this.state.pertence_a_escola} />

              <hr />

              <Laudo pertence_a_escola={this.state.pertence_a_escola} />
            </>
          )}
          {this.state.aluno_nao_matriculado && (
            <>
              <FormSection name="aluno_nao_matriculado_data">
                <div className="row">
                  <div className="col-md-3">
                    <Field
                      component={InputText}
                      name="codigo_eol_escola"
                      label="Cód. EOL da Escola"
                      placeholder="Insira o Código"
                      className="form-control"
                      type="number"
                      required
                      disabled
                      validate={[required, length(6)]}
                    />
                  </div>
                  <div className="col-md-9">
                    <Field
                      component={InputText}
                      name="nome_escola"
                      label="Nome da Escola"
                      className="form-control"
                      disabled
                      validate={required}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <Field
                      {...cpfMask}
                      component={InputText}
                      dataTestId="input-cpf-aluno"
                      name="cpf"
                      label="CPF do Aluno"
                      className="form-control"
                      validate={validaCPF}
                    />
                  </div>
                  <div className="col-md-6">
                    <Field
                      component={InputText}
                      name="nome"
                      label="Nome completo do Aluno"
                      dataTestId="input-nome-completo-aluno"
                      className="form-control"
                      required
                      validate={[required, minLength6]}
                    />
                  </div>
                  <div className="col-md-3">
                    <Field
                      component={InputComData}
                      dataTestId="div-data-nascimento-aluno"
                      name="data_nascimento"
                      label="Data de Nascimento"
                      className="form-control"
                      minDate={dateDelta(-360 * 99)}
                      maxDate={dateDelta(-1)}
                      validate={required}
                      visitedError={true}
                      showMonthDropdown
                      showYearDropdown
                      writable
                    />
                  </div>
                </div>
                <FormSection name="responsavel">
                  <div className="row">
                    <div className="col-md-3">
                      <Field
                        {...cpfMask}
                        component={InputText}
                        name="cpf"
                        dataTestId="input-cpf-responsavel"
                        label="CPF do Responsável"
                        className="form-control"
                        required
                        validate={[required, validaCPF]}
                      />
                    </div>
                    <div className="col-md-9">
                      <Field
                        component={InputText}
                        name="nome"
                        dataTestId="input-nome-completo-responsavel"
                        label="Nome completo do Responsável"
                        className="form-control"
                        required
                        validate={required}
                      />
                    </div>
                  </div>
                  {this.props.dieta_para_recreio_ferias && (
                    <div className="row mt-2 align-items-end">
                      <div className="col-md-3">
                        <Field
                          component={InputComData}
                          name="data_inicio"
                          dataTestId="div-data-inicio"
                          label="Alteração válida pelo período:"
                          placeholder="De"
                          className="form-control"
                          minDate={dateDelta(-360 * 99)}
                          maxDate={
                            this.props.data_termino
                              ? moment(this.props.data_termino, "DD/MM/YYYY")._d
                              : dateDelta(365)
                          }
                          validate={[required]}
                          required
                          inputOnChange={(value) => {
                            this.props.change("data_inicio", value);
                          }}
                          showMonthDropdown
                          showYearDropdown
                        />
                      </div>
                      <div className="col-md-3">
                        <Field
                          component={InputComData}
                          name="data_termino"
                          dataTestId="div-data-termino"
                          label=""
                          placeholder="Até"
                          className="form-control"
                          minDate={
                            this.props.data_inicio
                              ? moment(
                                  this.props.data_inicio,
                                  "DD/MM/YYYY",
                                ).toDate()
                              : dateDelta(-360 * 99)
                          }
                          maxDate={dateDelta(365)}
                          validate={[required]}
                          inputOnChange={(value) => {
                            this.props.change("data_termino", value);
                          }}
                          required
                          showMonthDropdown
                          showYearDropdown
                        />
                      </div>
                    </div>
                  )}
                </FormSection>
              </FormSection>
              <hr />

              <Prescritor pertence_a_escola={!this.state.pertence_a_escola} />

              <hr />

              <Laudo pertence_a_escola={!this.state.pertence_a_escola} />
            </>
          )}

          <div className="row">
            <div className="col-12 text-end">
              <Botao
                texto="Limpar campos"
                className="me-4"
                onClick={() => {
                  this.props.reset();
                  this.props.loadSolicitacoesVigentes(null);
                  this.setState({ aluno_nao_matriculado: false });
                  this.setState({ pertence_a_escola: null });
                }}
                disabled={pristine || submitting}
                style={BUTTON_STYLE.GREEN_OUTLINE}
              />
              <Botao
                texto="Enviar"
                type={BUTTON_TYPE.SUBMIT}
                onClick={handleSubmit((values) =>
                  this.onSubmit({
                    ...values,
                  }),
                )}
                style={BUTTON_STYLE.GREEN}
                disabled={
                  this.state.pertence_a_escola !== true &&
                  this.state.aluno_nao_matriculado !== true
                }
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const componentNameForm = reduxForm({
  form: "solicitacaoDietaEspecial",
  keepDirtyOnReinitialize: true,
  destroyOnUnmount: false,
})(withNavigationType(solicitacaoDietaEspecial));

const selector = formValueSelector("solicitacaoDietaEspecial");
const mapStateToProps = (state) => {
  return {
    files: selector(state, "files"),
    codigo_eol: selector(state, "codigo_eol"),
    aluno_nao_matriculado: selector(state, "aluno_nao_matriculado_data"),
    solicitacoesVigentes: state.incluirDietaEspecial.solicitacoesVigentes,
    dieta_para_recreio_ferias: selector(state, "dieta_para_recreio_ferias"),
    data_inicio: selector(state, "data_inicio"),
    data_termino: selector(state, "data_termino"),
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadSolicitacoesVigentes,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(componentNameForm);
