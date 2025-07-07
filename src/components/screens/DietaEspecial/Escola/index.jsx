import CheckboxField from "src/components/Shareable/Checkbox/Field";
import { getStatusSolicitacoesVigentes } from "src/helpers/dietaEspecial";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import withNavigationType from "src/components/Shareable/withNavigationType";
import { bindActionCreators } from "redux";
import { Field, FormSection, formValueSelector, reduxForm } from "redux-form";
import {
  DIETA_ESPECIAL,
  ESCOLA,
  RELATORIO,
} from "../../../../configs/constants";
import {
  length,
  minLength,
  required,
  validaCPF,
} from "../../../../helpers/fieldValidators";
import {
  cpfMask,
  dateDelta,
  deepCopy,
  gerarParametrosConsulta,
  getError,
} from "../../../../helpers/utilities";
import {
  updateFotoAluno,
  getAlunoPertenceAEscola,
  getFotoAluno,
  deleteFotoAluno,
} from "../../../../services/aluno.service";
import {
  criaDietaEspecial,
  getDietasEspeciaisVigentesDeUmAluno,
  getSolicitacoesDietaEspecial,
} from "../../../../services/dietaEspecial.service";
import { getEscolasSimplissima } from "../../../../services/escola.service";
import {
  meusDados,
  obtemDadosAlunoPeloEOL,
} from "../../../../services/perfil.service";
import { Botao } from "../../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../../Shareable/Botao/constants";
import CardMatriculados from "../../../Shareable/CardMatriculados";
import { InputComData } from "../../../Shareable/DatePicker";
import InputText from "../../../Shareable/Input/InputText";
import { toastError, toastSuccess } from "../../../Shareable/Toast/dialogs";
import Laudo from "./componentes/Laudo";
import Prescritor from "./componentes/Prescritor";
import SolicitacaoVigente from "./componentes/SolicitacaoVigente";
import { formatarSolicitacoesVigentes, podeAtualizarFoto } from "./helper";
import { ENVIRONMENT } from "src/constants/config";
import { loadSolicitacoesVigentes } from "src/reducers/incluirDietaEspecialReducer";

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
    this.setFiles = this.setFiles.bind(this);
    this.removeFile = this.removeFile.bind(this);
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

  removeFile(index) {
    let files = this.state.files;
    files.splice(index, 1);
    this.setState({ files });
  }

  setFiles(files) {
    this.setState({ files });
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
      event.target.value.padStart(6, "0")
    ).then((response) => {
      this.props.loadSolicitacoesVigentes(
        formatarSolicitacoesVigentes(response.data.results.slice(0, 1))
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
                "DD/MM/YYYY"
              )
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
      }
    );
  };

  getEscolaPorEOL = async () => {
    const { change, aluno_nao_matriculado } = this.props;

    if (!aluno_nao_matriculado) {
      change("aluno_nao_matriculado_data.nome_escola", "");
      return;
    }

    if (!aluno_nao_matriculado.codigo_eol_escola) {
      change("aluno_nao_matriculado_data.nome_escola", "");
      return;
    }

    const codigo_eol_escola = aluno_nao_matriculado.codigo_eol_escola;

    if (!codigo_eol_escola || codigo_eol_escola.length !== 6) {
      change("aluno_nao_matriculado_data.nome_escola", "");
      return;
    }

    const params = { codigo_eol: codigo_eol_escola };
    const resposta = await getEscolasSimplissima(params);

    if (!resposta) return;

    if (resposta && resposta.results.length) {
      const escola = resposta.results[0];
      change("aluno_nao_matriculado_data.nome_escola", escola.nome);
    } else {
      change("aluno_nao_matriculado_data.nome_escola", "");
      toastError("Código EOL informado inválido");
    }
  };

  getSolicitacoesVigentesResponsavel = async () => {
    const { aluno_nao_matriculado } = this.props;
    if (!aluno_nao_matriculado) {
      this.props.loadSolicitacoesVigentes(null);
      return;
    }

    if (!aluno_nao_matriculado.responsavel) {
      this.props.loadSolicitacoesVigentes(null);
      return;
    }

    if (!aluno_nao_matriculado.responsavel.cpf || !aluno_nao_matriculado.nome) {
      this.props.loadSolicitacoesVigentes(null);
      return;
    }

    const { cpf } = aluno_nao_matriculado.responsavel;
    const { nome } = aluno_nao_matriculado;

    if (validaCPF(cpf)) return;

    const params = gerarParametrosConsulta({
      cpf_responsavel: cpf,
      nome_completo_aluno: nome,
      status: getStatusSolicitacoesVigentes(),
    });
    const resposta = await getSolicitacoesDietaEspecial(params);
    this.props.loadSolicitacoesVigentes(
      formatarSolicitacoesVigentes(resposta.data.results)
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
    } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
      toastError(response.data);
    } else {
      toastError(`Erro ao solicitar dieta especial: ${response.data}`);
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
      <form className="special-diet" onSubmit={handleSubmit}>
        <CardMatriculados numeroAlunos={quantidadeAlunos} />
        <div className="card mt-2 p-4">
          <div className="row">
            <div className="col d-flex flex-row text-gray">
              <Field
                className="check-tipo-produto"
                component={CheckboxField}
                name="aluno_nao_matriculado"
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
                Dieta Especial Destina-se à Aluno Não Matriculado na Rede
                Municipal de Ensino
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="card-title fw-bold cinza-escuro">
              Descrição da Solicitação
            </span>
            {!ENVIRONMENT.includes("production") &&
              this.state.aluno_nao_matriculado && (
                <div className="d-flex flex-row text-gray align-items-center">
                  <Field
                    className="check-tipo-produto"
                    component={CheckboxField}
                    name="dieta_para_recreio_ferias"
                    type="checkbox"
                    onChange={(event, newValue) => {
                      if (!newValue) {
                        this.props.change("periodo_recreio_inicio", null);
                        this.props.change("periodo_recreio_fim", null);
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
                      onBlur={this.getEscolaPorEOL}
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
                      className="form-control"
                      required
                      validate={[required, minLength6]}
                      onBlur={this.getSolicitacoesVigentesResponsavel}
                    />
                  </div>
                  <div className="col-md-3">
                    <Field
                      component={InputComData}
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
                        label="CPF do Responsável"
                        className="form-control"
                        required
                        onBlur={this.getSolicitacoesVigentesResponsavel}
                        validate={[required, validaCPF]}
                      />
                    </div>
                    <div className="col-md-9">
                      <Field
                        component={InputText}
                        name="nome"
                        label="Nome completo do Responsável"
                        className="form-control"
                        required
                        validate={required}
                      />
                    </div>
                  </div>
                  {!ENVIRONMENT.includes("production") &&
                    this.props.dieta_para_recreio_ferias && (
                      <div className="row mt-2 align-items-end">
                        <div className="col-md-3">
                          <Field
                            component={InputComData}
                            name="periodo_recreio_inicio"
                            label="Alteração válida pelo período:"
                            placeholder="De"
                            className="form-control"
                            minDate={dateDelta(-360 * 99)}
                            maxDate={dateDelta(365)}
                            validate={[required]}
                            required
                            inputOnChange={(value) => {
                              this.props.change(
                                "periodo_recreio_inicio",
                                value
                              );
                            }}
                            showMonthDropdown
                            showYearDropdown
                          />
                        </div>
                        <div className="col-md-3">
                          <Field
                            component={InputComData}
                            name="periodo_recreio_fim"
                            label=""
                            placeholder="Até"
                            className="form-control"
                            minDate={
                              this.props.periodo_recreio_inicio
                                ? moment(
                                    this.props.periodo_recreio_inicio,
                                    "DD/MM/YYYY"
                                  ).toDate()
                                : dateDelta(-360 * 99)
                            }
                            maxDate={dateDelta(365)}
                            validate={[
                              required,
                              (value, allValues) => {
                                if (
                                  value &&
                                  allValues.periodo_recreio_inicio &&
                                  moment(value, "YYYY-MM-DD").isBefore(
                                    moment(
                                      allValues.periodo_recreio_inicio,
                                      "YYYY-MM-DD"
                                    )
                                  )
                                ) {
                                  return "A data final não pode ser menor que a inicial.";
                                }
                                return undefined;
                              },
                            ]}
                            inputOnChange={(value) => {
                              this.props.change("periodo_recreio_fim", value);
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

          <hr />

          <article className="card-body footer-button">
            <Botao
              texto="Limpar campos"
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
                })
              )}
              style={BUTTON_STYLE.GREEN}
              disabled={
                this.state.pertence_a_escola !== true &&
                this.state.aluno_nao_matriculado !== true
              }
            />
          </article>
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
    periodo_recreio_inicio: selector(state, "periodo_recreio_inicio"),
    periodo_recreio_fim: selector(state, "periodo_recreio_fim"),
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadSolicitacoesVigentes,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(componentNameForm);
