import { Spin, Tooltip } from "antd";
import CKEditorField from "src/components/Shareable/CKEditorField";
import HTTP_STATUS from "http-status-codes";
import { isEqual } from "lodash";
import React, { Component, Fragment } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { getSomatorioFaixas } from "src/services/alteracaoDeCardapio";
import {
  getSolicitacoesKitLanche,
  inicioPedido,
  registroAtualizaKitLanche,
  removeKitLanche,
  solicitarKitLanche,
} from "src/services/kitLanche";
import { STATUS_DRE_A_VALIDAR } from "../../../configs/constants";
import { TIPO_SOLICITACAO } from "../../../constants/shared";
import {
  maxLength,
  maxValue,
  naoPodeSerZero,
  required,
} from "../../../helpers/fieldValidators";
import {
  checaSeDataEstaEntre2e5DiasUteis,
  converterDDMMYYYYparaYYYYMMDD,
  escolaEhCei,
  fimDoCalendario,
  getError,
  usuarioEhEscolaCeuGestao,
  usuarioEhEscolaCMCT,
} from "../../../helpers/utilities";
import { getDietasAtivasInativasPorAluno } from "../../../services/dietaEspecial.service";
import { Botao } from "../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../Shareable/Botao/constants";
import CardMatriculados from "../../Shareable/CardMatriculados";
import { InputComData } from "../../Shareable/DatePicker";
import { InputText } from "../../Shareable/Input/InputText";
import ModalDataPrioritaria from "../../Shareable/ModalDataPrioritaria";
import { PedidoKitLanche } from "../../Shareable/PedidoKitLanche";
import TabelaQuantidadePorFaixaEtaria from "../../Shareable/TabelaQuantidadePorFaixaEtaria";
import { toastError, toastSuccess } from "../../Shareable/Toast/dialogs";
import { extrairKitsLanche } from "../../SolicitacaoUnificada/helper";
import SeletorAlunosDietaEspecial from "../components/SeletorAlunosDietaEspecial";
import { Rascunhos } from "../Rascunhos";
import { montaObjetoRequisicao } from "./helper";
import "./style.scss";
import {
  validateFormKitLanchePasseio,
  validateFormKitLanchePasseioCei,
} from "./validators";

const { SOLICITACAO_CEI, SOLICITACAO_NORMAL } = TIPO_SOLICITACAO;

const ENTER = 13;
export class SolicitacaoDeKitLanche extends Component {
  constructor(props) {
    super(props);
    const ehCei = escolaEhCei();
    this.state = {
      ehCei,
      tipoSolicitacao: ehCei ? SOLICITACAO_CEI : SOLICITACAO_NORMAL,
      loading: true,
      qtd_kit_lanche: 0,
      kitsChecked: [],
      initialValues: false,
      radioChanged: false,
      rascunhosSolicitacoesKitLanche: [],
      status: "SEM STATUS",
      title: "Nova solicitação",
      salvarAtualizarLbl: "Salvar Rascunho",
      showModal: false,
      modalConfirmation: false,
      modalMessage: "",
      botaoConfirma: true,
      alunosComDietaEspecial: [],
      carregandoRascunhos: false,
      erro: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.refresh = this.refresh.bind(this);
    this.validaDiasUteis = this.validaDiasUteis.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setInitialValues = this.setInitialValues.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.updateKitsChecked = this.updateKitsChecked.bind(this);
    this.getNumeroTotalDeKits = this.getNumeroTotalDeKits.bind(this);

    this.validatorsLocalPasseio = [required, maxLength(160)];
  }

  validarQuantidadeAlunos = (value) => {
    const { meusDados } = this.props;
    if (!usuarioEhEscolaCeuGestao() && !usuarioEhEscolaCMCT()) {
      const maximo = meusDados.vinculo_atual.instituicao.quantidade_alunos;
      if (value > maximo) {
        this.setState({
          erro: `O número de alunos não pode ser maior que ${maximo}`,
        });
      } else if (value < 1) {
        this.setState({ erro: `Deve  haver pelo menos um aluno` });
      } else {
        this.setState({ erro: "" });
      }
    }
  };

  OnDeleteButtonClicked(id_externo, uuid) {
    if (window.confirm("Deseja remover este rascunho?")) {
      removeKitLanche(uuid, this.state.tipoSolicitacao).then(
        (res) => {
          if (res.status === HTTP_STATUS.NO_CONTENT) {
            toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
            this.refresh();
          } else {
            toastError(getError(res.data));
          }
        },
        function () {
          toastError("Houve um erro ao excluir o rascunho");
        },
      );
      this.resetForm();
    }
  }

  OnEditButtonClicked(solicitacaoKitLanche) {
    this.props.reset();
    this.props.change("uuid", solicitacaoKitLanche.uuid);
    this.props.change(
      "observacao",
      solicitacaoKitLanche.solicitacao_kit_lanche.descricao + "\n",
    );
    this.props.change(
      "evento_data",
      solicitacaoKitLanche.solicitacao_kit_lanche.data,
    );
    this.props.change("local", solicitacaoKitLanche.local);
    this.props.change("evento", solicitacaoKitLanche.evento);
    this.props.change(
      "quantidade_alunos",
      solicitacaoKitLanche.quantidade_alunos,
    );
    this.props.change(
      "tempo_passeio",
      solicitacaoKitLanche.solicitacao_kit_lanche.tempo_passeio.toString(),
    );
    if (this.state.ehCei) {
      solicitacaoKitLanche.faixas_etarias.forEach((faixa) =>
        this.props.change(
          `faixas_etarias.${faixa.faixa_etaria.uuid}`,
          faixa.quantidade,
        ),
      );
      // TODO: caso tenha alunos no rascunho, expandir o seletor
      //       tem que passar state.collapsed do componente SeletorAlunosDietaEspecial pra prop
      //       e guardar no state desse componente
    }
    solicitacaoKitLanche.alunos_com_dieta_especial_participantes.forEach(
      (aluno) =>
        this.props.change(
          `alunos_com_dieta_especial_participantes.${aluno.uuid}`,
          true,
        ),
    );
    this.setState({
      status: solicitacaoKitLanche.status,
      title: `Solicitação de Kit Lanche Passeio #${solicitacaoKitLanche.id_externo}`,
      salvarAtualizarLbl: "Atualizar",
      kitsChecked: extrairKitsLanche(
        solicitacaoKitLanche.solicitacao_kit_lanche.kits,
      ),
    });
  }

  resetForm() {
    this.props.reset();
    this.props.change("obs", "");
    this.setState({
      status: "SEM STATUS",
      title: "Nova solicitação",
      salvarAtualizarLbl: "Salvar Rascunho",
      qtd_kit_lanche: 0,
      initialValues: true,
      kitsChecked: [],
    });
    this.props.dispatch({
      type: "LOAD_ALUNOS_POR_FAIXA_ETARIA",
      data: undefined,
    });
    this.props.dispatch({ type: "SET_TOTAL_ALUNOS_SELECIONADOS", data: 0 });
    this.refresh();
  }

  setInitialValues() {
    this.setState({ initialValues: false });
  }

  componentDidMount() {
    this.refresh();
    this.carregarDietas();
  }

  async carregarDietas() {
    const resposta = await getDietasAtivasInativasPorAluno({
      incluir_alteracao_ue: true,
    });

    if (resposta.status === 200) {
      this.setState({
        alunosComDietaEspecial: resposta.data.solicitacoes.filter(
          (s) => s.ativas > 0,
        ),
      });
    }
  }

  componentDidUpdate() {
    const { meusDados, proximos_dois_dias_uteis } = this.props;
    const { loading } = this.state;
    const dadosDaAPItotalmenteCarregados =
      meusDados !== null && proximos_dois_dias_uteis !== null && loading;
    if (dadosDaAPItotalmenteCarregados) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillUnmount() {
    this.resetForm();
    this.props.reset();
  }

  validaDiasUteis = (value) => {
    if (
      value &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        this.props.proximos_dois_dias_uteis,
        this.props.proximos_cinco_dias_uteis,
      )
    ) {
      this.showModal();
    }
  };

  onSubmit(values) {
    const _alunosPorFaixaEtaria = this.props.alunosPorFaixaEtaria;
    values.kit_lanche = this.state.kitsChecked;
    const { ehCei } = this.state;
    if (!ehCei) {
      values.quantidade_alunos = parseInt(values.quantidade_alunos);
    }
    values.escola = this.props.meusDados.vinculo_atual.instituicao.uuid;
    let solicitacao_kit_lanche = montaObjetoRequisicao(
      values,
      _alunosPorFaixaEtaria,
    );
    if (values.confirmar) {
      solicitacao_kit_lanche.confirmar = values.confirmar;
    }
    if (
      solicitacao_kit_lanche.quantidade_alunos <
      solicitacao_kit_lanche.alunos_com_dieta_especial_participantes.length
    ) {
      toastError(
        "O número de alunos selecionados com Dieta Especial é maior que a quantidade de alunos prevista para o evento.",
      );
      return;
    }
    try {
      validateFormKitLanchePasseio(values);
      if (ehCei) {
        validateFormKitLanchePasseioCei(values);
      }
      return new Promise((resolve) => {
        this.salvarOuEnviar(
          solicitacao_kit_lanche,
          values,
          ehCei
            ? TIPO_SOLICITACAO.SOLICITACAO_CEI
            : TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
        );
        this.handleConfirmation();
        resolve();
      });
    } catch (SubmissionError) {
      toastError(SubmissionError.errors.kit_lanche);
    }
  }

  iniciarPedido(uuid) {
    inicioPedido(uuid, this.state.tipoSolicitacao).then(
      (res) => {
        if (res.status === HTTP_STATUS.OK) {
          toastSuccess(
            "Solicitação de Kit Lanche Passeio enviada com sucesso!",
          );
          this.resetForm();
        } else if (res.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(
            `Houve um erro ao enviar a Solicitação de Kit Lanche Passeio: ${getError(
              res.data.detail,
            )}`,
          );
        }
      },
      function () {
        toastError(
          "Houve um erro ao enviar a Solicitação de Kit Lanche Passeio",
        );
      },
    );
  }

  validaTipoMensagemError = (response) => {
    const tipoError = response.tipo_error[0];
    const messageModal = response.details[0];
    if (tipoError === "2") {
      this.setState({
        modalConfirmation: true,
        modalMessage: messageModal,
      });
    } else if (tipoError === "1") {
      toastError(messageModal);
    }
  };

  salvarOuEnviar(solicitacao_kit_lanche, values, tipoSolicitacao) {
    if (values.status) {
      solicitacao_kit_lanche.status = values.status;
    }
    if (!values.uuid) {
      solicitarKitLanche(solicitacao_kit_lanche, tipoSolicitacao).then(
        (resp) => {
          if (resp.status === HTTP_STATUS.CREATED) {
            if (values.status === STATUS_DRE_A_VALIDAR) {
              this.iniciarPedido(resp.data.uuid);
            } else {
              toastSuccess(
                "Solicitação de Kit Lanche Passeio salva com sucesso!",
              );
              this.resetForm();
            }
          } else if (resp.data.tipo_error) {
            this.validaTipoMensagemError(resp.data);
          } else {
            toastError(getError(resp.data));
          }
        },
      );
    } else {
      registroAtualizaKitLanche(
        solicitacao_kit_lanche,
        values.uuid,
        tipoSolicitacao,
      )
        .then((resp) => {
          if (resp.status === HTTP_STATUS.OK) {
            if (values.status === STATUS_DRE_A_VALIDAR) {
              this.iniciarPedido(values.uuid);
            } else {
              toastSuccess(
                "Solicitação de Kit Lanche Passeio atualizada com sucesso!",
              );
              this.setState({ carregandoRascunhos: true });
              this.resetForm();
            }
          } else if (resp.data.tipo_error) {
            this.validaTipoMensagemError(resp.data);
          } else {
            toastError(
              `Erro ao atualizar a solicitação: ${getError(resp.data)}`,
            );
          }
        })
        .catch(() => {
          toastError("erro ao atualizar a solicitação");
        });
    }
  }

  salvarOuEnviarCei(solicitacao_kit_lanche, values) {
    if (values.status) {
      solicitacao_kit_lanche.status = values.status;
    }
    if (!values.uuid) {
      solicitarKitLanche(
        solicitacao_kit_lanche,
        this.state.tipoSolicitacao,
      ).then((resp) => {
        if (resp.status === HTTP_STATUS.CREATED) {
          if (values.status === STATUS_DRE_A_VALIDAR) {
            this.iniciarPedido(resp.data.uuid);
          } else {
            toastSuccess(
              "Solicitação de Kit Lanche Passeio salva com sucesso!",
            );
            this.resetForm();
          }
        } else if (resp.data.tipo_error) {
          this.validaTipoMensagemError(resp.data);
        } else {
          toastError(
            `Erro ao salvar Solicitação de Kit Lanche Passeio ${resp.data}`,
          );
        }
      });
    } else {
      registroAtualizaKitLanche(
        solicitacao_kit_lanche,
        values.uuid,
        this.state.tipoSolicitacao,
      )
        .then((resp) => {
          if (resp.status === HTTP_STATUS.OK) {
            if (values.status === STATUS_DRE_A_VALIDAR) {
              this.iniciarPedido(values.uuid);
            } else {
              toastSuccess(
                "Solicitação de Kit Lanche Passeio atualizada com sucesso!",
              );
              this.resetForm();
            }
          } else if (resp.data.tipo_error) {
            this.validaTipoMensagemError(resp.data);
          } else {
            toastError(
              `Erro ao atualizar a solicitação: ${getError(resp.data)}`,
            );
          }
        })
        .catch(() => {
          toastError("erro ao atualizar a solicitação");
        });
    }
  }

  refresh() {
    if (this.state.ehCei) {
      // FIXME: remove duplicated code
      getSolicitacoesKitLanche(SOLICITACAO_CEI).then((resp) => {
        this.setState({
          rascunhosSolicitacoesKitLanche: resp.data.results,
          carregandoRascunhos: false,
        });
      });
    } else {
      getSolicitacoesKitLanche(SOLICITACAO_NORMAL).then((resp) => {
        this.setState({
          rascunhosSolicitacoesKitLanche: resp.results,
          carregandoRascunhos: false,
        });
      });
    }
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  showModal() {
    this.setState({ showModal: true });
  }

  handleConfirmation() {
    this.setState({ modalConfirmation: false });
  }

  updateKitsChecked(kitsChecked) {
    this.setState({ kitsChecked });
  }

  onKeyPress(event) {
    if (event.which === ENTER) {
      event.preventDefault();
    }
  }

  getNumeroTotalDeKits() {
    const qtdeAlunos = this.state.ehCei
      ? this.props.totalAlunosSelecionadosCei || 0
      : this.props.quantidade_alunos !== undefined
        ? parseInt(this.props.quantidade_alunos)
        : 0;
    return qtdeAlunos * this.state.kitsChecked.length;
  }

  validationRules = [
    required,
    maxValue(this.props.meusDados.vinculo_atual.instituicao.quantidade_alunos),
    naoPodeSerZero,
    this.validarQuantidadeAlunos,
  ];

  render() {
    const {
      alunosPorFaixaEtaria,
      handleSubmit,
      pristine,
      submitting,
      proximos_dois_dias_uteis,
      meusDados,
      totalAlunosSelecionadosCei,
    } = this.props;
    const {
      ehCei,
      rascunhosSolicitacoesKitLanche,
      showModal,
      modalMessage,
      modalConfirmation,
      botaoConfirma,
      loading,
      kitsChecked,
      alunosComDietaEspecial,
      carregandoRascunhos,
      erro,
    } = this.state;
    return (
      <div>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <form onKeyPress={this.onKeyPress} className="solicitacao-kit-lanche">
            <Field component={"input"} type="hidden" name="uuid" />
            <div className="mt-3" />
            <CardMatriculados
              meusDados={meusDados}
              numeroAlunos={
                meusDados.vinculo_atual.instituicao.quantidade_alunos
              }
            />
            <Spin tip="Carregando Rascunhos..." spinning={carregandoRascunhos}>
              {rascunhosSolicitacoesKitLanche.length > 0 && (
                <div className="mt-3">
                  <span className="page-title">Rascunhos</span>
                  <Rascunhos
                    rascunhosSolicitacoesKitLanche={
                      rascunhosSolicitacoesKitLanche
                    }
                    OnDeleteButtonClicked={(id_externo, uuid) =>
                      this.OnDeleteButtonClicked(id_externo, uuid)
                    }
                    resetForm={(event) => this.resetForm(event)}
                    refreshComponent={this.refresh.bind(this)}
                    OnEditButtonClicked={(params) =>
                      this.OnEditButtonClicked(params)
                    }
                  />
                </div>
              )}
            </Spin>
            <br />
            <h3 className="page-title mt-0">{this.state.title}</h3>
            <div className="card mt-3 p-4" data-testid="card-solicitacao">
              {ehCei && (
                <div className="form-group row">
                  <p className="dre-name">
                    Descrição da Solicitação Kit Lanche
                  </p>
                </div>
              )}
              <div className="form-group row">
                <div className="col-3">
                  <Field
                    component={InputComData}
                    label="Data do passeio"
                    name="evento_data"
                    onBlur={(event) => this.validaDiasUteis(event.target.value)}
                    minDate={proximos_dois_dias_uteis}
                    maxDate={fimDoCalendario()}
                    required
                    validate={required}
                    onChange={(value) => this.validaDiasUteis(value)}
                    dataTestId="data-passeio"
                  />
                </div>
                <div className="col-9">
                  <Field
                    component={InputText}
                    label="Local do passeio"
                    name="local"
                    required
                    validate={this.validatorsLocalPasseio}
                    dataTestId="local-passeio"
                  />
                </div>
              </div>
              {!ehCei && meusDados ? (
                <div className="form-group row">
                  <div className="field-values-input col-3">
                    <Field
                      component={InputText}
                      name="quantidade_alunos"
                      type="number"
                      label="Número de alunos"
                      required
                      validate={(value) => {
                        if (
                          usuarioEhEscolaCeuGestao() ||
                          usuarioEhEscolaCMCT()
                        ) {
                          return undefined;
                        }
                        const errors = this.validationRules
                          .map((validate) => validate(value))
                          .filter((error) => error !== undefined);

                        return errors.length > 0 ? errors : undefined;
                      }}
                      dataTestId="numero-alunos"
                    />
                    {erro && (
                      <Tooltip title={erro}>
                        <i
                          className="fas fa-info icone-info-error"
                          data-testId="erro-numero-alunos"
                        />
                      </Tooltip>
                    )}
                  </div>
                  <div className="col-9">
                    <Field
                      component={InputText}
                      label="Evento/Atividade"
                      name="evento"
                      required
                      validate={this.validatorsLocalPasseio}
                      dataTestId="nome-evento-atividade"
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group row">
                  <div className="col-12">
                    <Field
                      component={InputText}
                      label="Evento/Atividade"
                      name="evento"
                      required
                      validate={this.validatorsLocalPasseio}
                    />
                  </div>
                </div>
              )}
              <PedidoKitLanche
                nameTempoPasseio="tempo_passeio"
                nomeKitsLanche="kit_lanche"
                updateKitsChecked={this.updateKitsChecked}
                kitsChecked={kitsChecked}
                mostrarExplicacao
                validate={required}
              />
              {ehCei && alunosPorFaixaEtaria && (
                <TabelaQuantidadePorFaixaEtaria
                  alunosPorFaixaEtaria={alunosPorFaixaEtaria}
                  totalSelecionados={totalAlunosSelecionadosCei}
                />
              )}
              <div className="kits-total form-group row mt-2 pt-3">
                <div className="col-12">
                  <label>{"Número total de kits:"}</label>
                  <span className="fw-bold ps-2">
                    {this.getNumeroTotalDeKits()}
                  </span>
                </div>
              </div>
              {!usuarioEhEscolaCeuGestao() && !usuarioEhEscolaCMCT() && (
                <Fragment>
                  <div className="form-group row sub-title">
                    <p className="dre-name">
                      Selecionar alunos com dieta especial
                    </p>
                  </div>
                  <SeletorAlunosDietaEspecial
                    alunosComDietaEspecial={alunosComDietaEspecial}
                  />
                </Fragment>
              )}
              <div className="form-group">
                <Field
                  component={CKEditorField}
                  label="Observações"
                  name="observacao"
                  placeholder="Campo opcional"
                  dataTestId="observacao-solicitacao"
                />
              </div>
              <div className="row mt-5">
                <div className="col-12 text-end">
                  <Botao
                    texto="Cancelar"
                    onClick={(e) => this.resetForm(e)}
                    disabled={pristine || submitting}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    type={BUTTON_TYPE.BUTTON}
                  />
                  <Botao
                    texto={this.state.salvarAtualizarLbl}
                    disabled={pristine || submitting}
                    onClick={handleSubmit((values) =>
                      this.onSubmit({
                        ...values,
                        status: "RASCUNHO",
                      }),
                    )}
                    className="ms-3"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                  />
                  <Botao
                    texto="Enviar"
                    disabled={pristine || submitting}
                    type={BUTTON_TYPE.SUBMIT}
                    onClick={handleSubmit((values) =>
                      this.onSubmit({
                        ...values,
                        status: STATUS_DRE_A_VALIDAR,
                      }),
                    )}
                    style={BUTTON_STYLE.GREEN}
                    className="ms-3"
                  />
                </div>
              </div>
              <Modal show={modalConfirmation} onHide={this.handleConfirmation}>
                <Modal.Header closeButton>
                  <Modal.Title>Atenção</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <strong>{modalMessage}</strong>
                </Modal.Body>
                <Modal.Footer>
                  {botaoConfirma && (
                    <Botao
                      texto="CONFIRMAR MESMO ASSIM"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={handleSubmit((values) =>
                        this.onSubmit({
                          ...values,
                          status: STATUS_DRE_A_VALIDAR,
                          salvo_em: new Date(),
                          confirmar: true,
                        }),
                      )}
                      style={BUTTON_STYLE.BLUE}
                      className="ms-3"
                    />
                  )}
                  <Botao
                    texto="CANCELAR"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={this.handleConfirmation}
                    style={BUTTON_STYLE.BLUE_OUTLINE}
                    className="ms-3"
                  />
                </Modal.Footer>
              </Modal>
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

SolicitacaoDeKitLanche = reduxForm({
  form: "formKitLanche",
  destroyOnUnmount: false,
  onChange: async (values, dispatch, props, previousValues) => {
    if (
      escolaEhCei() &&
      values.evento_data &&
      (previousValues.evento_data === undefined ||
        previousValues.evento_data !== values.evento_data)
    ) {
      const response = await getSomatorioFaixas(
        props.meusDados.vinculo_atual.instituicao.uuid,
        converterDDMMYYYYparaYYYYMMDD(values.evento_data),
      );
      if (response.status === 200) {
        dispatch({
          type: "LOAD_ALUNOS_POR_FAIXA_ETARIA",
          data: response.data.results
            .filter((info) => info.faixa_etaria.inicio >= 12)
            .sort((a, b) => a.faixa_etaria.inicio - b.faixa_etaria.inicio),
        });
      } else {
        toastError(getError(response.data));
      }
    }
    if (
      values.faixas_etarias &&
      !isEqual(values.faixas_etarias, previousValues.faixas_etarias)
    ) {
      let totalAlunos = 0;
      Object.values(values.faixas_etarias).forEach(
        (v) => (totalAlunos += parseInt(v)),
      );
      dispatch({ type: "SET_TOTAL_ALUNOS_SELECIONADOS", data: totalAlunos });
    }
  },
})(SolicitacaoDeKitLanche);

const selector = formValueSelector("formKitLanche");
const mapStateToProps = (state) => {
  return {
    tempo_passeio: selector(state, "tempo_passeio"),
    quantidade_alunos: selector(state, "quantidade_alunos"),
    alunosPorFaixaEtaria: state.kitLanche.alunosPorFaixaEtaria,
    totalAlunosSelecionadosCei: state.kitLanche.totalAlunosSelecionadosCei,
  };
};
export default connect(mapStateToProps)(SolicitacaoDeKitLanche);
