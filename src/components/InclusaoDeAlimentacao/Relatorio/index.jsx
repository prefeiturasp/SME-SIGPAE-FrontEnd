import { Botao } from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import ModalAutorizarAposQuestionamento from "components/Shareable/ModalAutorizarAposQuestionamento";
import ModalMarcarConferencia from "components/Shareable/ModalMarcarConferencia";
import RelatorioHistoricoJustificativaEscola from "components/Shareable/RelatorioHistoricoJustificativaEscola";
import RelatorioHistoricoQuestionamento from "components/Shareable/RelatorioHistoricoQuestionamento";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { CODAE, DRE, TERCEIRIZADA } from "configs/constants";
import { statusEnum, TIPO_PERFIL, TIPO_SOLICITACAO } from "constants/shared";
import {
  prazoDoPedidoMensagem,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
  visualizaBotoesDoFluxo,
} from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import { meusDados } from "services/perfil.service";
import { CorpoRelatorio } from "./componentes/CorpoRelatorio";

// services
import { obterSolicitacaoDeInclusaoDeAlimentacao } from "services/inclusaoDeAlimentacao";
import { ModalCancelarInclusaoContinua } from "./componentes/ModalCancelarInclusaoContinua";

class Relatorio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: null,
      showNaoAprovaModal: false,
      tipoSolicitacao: null,
      showAutorizarModal: false,
      showModalCodaeAutorizar: false,
      showModal: false,
      meusDados: null,
      inclusaoDeAlimentacao: null,
      prazoDoPedidoMensagem: null,
      resposta_sim_nao: null,
      showModalMarcarConferencia: false,
      submitting: false,
      carregando: false,
    };

    //FIXME: migrar para padrao sem binding
    this.setSubmitting = this.setSubmitting.bind(this);
    this.setCarregando = this.setCarregando.bind(this);
    this.closeQuestionamentoModal = this.closeQuestionamentoModal.bind(this);
    this.closeNaoAprovaModal = this.closeNaoAprovaModal.bind(this);
    this.closeAutorizarModal = this.closeAutorizarModal.bind(this);
    this.closeModalCodaeAutorizar = this.closeModalCodaeAutorizar.bind(this);
    this.loadSolicitacao = this.loadSolicitacao.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModalMarcarConferencia =
      this.closeModalMarcarConferencia.bind(this);
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const tipoSolicitacao = urlParams.get("tipoSolicitacao");
    meusDados().then((response) => {
      if (response) {
        this.setState({ meusDados: response });
      } else {
        this.setState({ erro: true });
        toastError("Erro ao carregar dados do usuário");
      }
    });
    if (uuid) {
      obterSolicitacaoDeInclusaoDeAlimentacao(uuid, tipoSolicitacao).then(
        (response) => {
          this.setState({
            uuid,
            inclusaoDeAlimentacao: response,
            tipoSolicitacao,
            prazoDoPedidoMensagem: prazoDoPedidoMensagem(response.prioridade),
          });
        }
      );
    }
  }

  setSubmitting(valor) {
    this.setState({ submitting: valor });
  }

  setCarregando(valor) {
    this.setState({ carregando: valor });
  }

  showQuestionamentoModal(resposta_sim_nao) {
    this.setState({ resposta_sim_nao, showQuestionamentoModal: true });
  }

  closeQuestionamentoModal() {
    this.setState({ showQuestionamentoModal: false });
  }

  showNaoAprovaModal(resposta_sim_nao) {
    this.setState({ resposta_sim_nao, showNaoAprovaModal: true });
  }

  closeNaoAprovaModal() {
    this.setState({ showNaoAprovaModal: false });
  }

  showAutorizarModal() {
    this.setState({ showAutorizarModal: true });
  }

  closeAutorizarModal() {
    this.setState({ showAutorizarModal: false });
  }

  showModalCodaeAutorizar() {
    this.setState({ showModalCodaeAutorizar: true });
  }

  closeModalCodaeAutorizar() {
    this.setState({ showModalCodaeAutorizar: false });
  }

  showModalMarcarConferencia() {
    this.setState({ showModalMarcarConferencia: true });
  }

  closeModalMarcarConferencia() {
    this.setState({ showModalMarcarConferencia: false });
  }

  loadSolicitacao(uuid, tipoSolicitacao) {
    this.setCarregando(true);
    obterSolicitacaoDeInclusaoDeAlimentacao(uuid, tipoSolicitacao).then(
      (response) => {
        this.setState({
          inclusaoDeAlimentacao: response,
        });
        this.setCarregando(false);
      }
    );
  }

  handleSubmit() {
    this.setSubmitting(true);
    const { toastAprovaMensagem, toastAprovaMensagemErro } = this.props;
    this.props
      .endpointAprovaSolicitacao(
        this.state.uuid,
        this.props.justificativa,
        this.state.tipoSolicitacao
      )
      .then(
        (response) => {
          if (response.status === HTTP_STATUS.OK) {
            toastSuccess(toastAprovaMensagem);
            this.loadSolicitacao(this.state.uuid, this.state.tipoSolicitacao);
          } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
            toastError(toastAprovaMensagemErro);
          }
        },
        function () {
          toastError(toastAprovaMensagemErro);
        }
      )
      .finally(() => {
        this.setSubmitting(false);
      });
  }

  render() {
    const {
      resposta_sim_nao,
      showNaoAprovaModal,
      inclusaoDeAlimentacao,
      prazoDoPedidoMensagem,
      tipoSolicitacao,
      showQuestionamentoModal,
      uuid,
      showAutorizarModal,
      showModalCodaeAutorizar,
      meusDados,
      showModalMarcarConferencia,
      submitting,
      carregando,
    } = this.state;
    const {
      endpointAprovaSolicitacao,
      justificativa,
      motivo_cancelamento,
      visao,
      textoBotaoNaoAprova,
      textoBotaoAprova,
      endpointNaoAprovaSolicitacao,
      endpointQuestionamento,
      ModalNaoAprova,
      ModalQuestionamento,
      motivosDREnaoValida,
      ModalCodaeAutoriza,
    } = this.props;
    const tipoPerfil = localStorage.getItem("tipo_perfil");
    const EXIBIR_BOTAO_NAO_APROVAR =
      tipoPerfil !== TIPO_PERFIL.TERCEIRIZADA ||
      (inclusaoDeAlimentacao &&
        inclusaoDeAlimentacao.prioridade !== "REGULAR" &&
        inclusaoDeAlimentacao.status === statusEnum.CODAE_QUESTIONADO &&
        textoBotaoNaoAprova);
    const EXIBIR_BOTAO_APROVAR =
      (![
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.TERCEIRIZADA,
      ].includes(tipoPerfil) &&
        textoBotaoAprova) ||
      (inclusaoDeAlimentacao &&
        (inclusaoDeAlimentacao.prioridade === "REGULAR" ||
          [
            statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
            statusEnum.CODAE_AUTORIZADO,
          ].includes(inclusaoDeAlimentacao.status)) &&
        textoBotaoAprova);
    const EXIBIR_BOTAO_QUESTIONAMENTO =
      [
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.TERCEIRIZADA,
      ].includes(tipoPerfil) &&
      inclusaoDeAlimentacao &&
      (inclusaoDeAlimentacao.prioridade !== "REGULAR" ||
        (visao === CODAE && inclusaoDeAlimentacao.prioridade !== "REGULAR")) &&
      [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
        inclusaoDeAlimentacao.status
      );
    const EXIBIR_MODAL_AUTORIZACAO_APOS_QUESTIONAMENTO =
      visao === CODAE &&
      inclusaoDeAlimentacao &&
      inclusaoDeAlimentacao.prioridade !== "REGULAR" &&
      !inclusaoDeAlimentacao.logs[inclusaoDeAlimentacao.logs.length - 1]
        .resposta_sim_nao;
    const EXIBIR_BOTAO_MARCAR_CONFERENCIA =
      visao === TERCEIRIZADA &&
      inclusaoDeAlimentacao &&
      [statusEnum.CODAE_AUTORIZADO, statusEnum.ESCOLA_CANCELOU].includes(
        inclusaoDeAlimentacao.status
      );

    const BotaoMarcarConferencia = () => {
      return (
        <Botao
          texto="Marcar Conferência"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
          onClick={() => {
            this.showModalMarcarConferencia();
          }}
          disabled={carregando}
        />
      );
    };

    const renderModalCancelamentoContinuo = () => {
      return (
        usuarioEhEscolaTerceirizadaQualquerPerfil() &&
        tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
      );
    };

    const ComponenteModalNaoAprova = renderModalCancelamentoContinuo(
      inclusaoDeAlimentacao
    )
      ? ModalCancelarInclusaoContinua
      : ModalNaoAprova;

    return (
      <div className="report">
        {ModalNaoAprova && (
          <ComponenteModalNaoAprova
            showModal={showNaoAprovaModal}
            closeModal={this.closeNaoAprovaModal}
            endpoint={endpointNaoAprovaSolicitacao}
            solicitacao={inclusaoDeAlimentacao}
            loadSolicitacao={this.loadSolicitacao}
            justificativa={justificativa}
            motivoCancelamento={motivo_cancelamento}
            resposta_sim_nao={resposta_sim_nao}
            uuid={uuid}
            tipoSolicitacao={this.state.tipoSolicitacao}
            motivosDREnaoValida={motivosDREnaoValida}
          />
        )}
        {ModalQuestionamento && (
          <ModalQuestionamento
            closeModal={this.closeQuestionamentoModal}
            showModal={showQuestionamentoModal}
            justificativa={justificativa}
            uuid={uuid}
            loadSolicitacao={this.loadSolicitacao}
            resposta_sim_nao={resposta_sim_nao}
            endpoint={endpointQuestionamento}
            tipoSolicitacao={this.state.tipoSolicitacao}
          />
        )}
        {inclusaoDeAlimentacao && (
          <ModalMarcarConferencia
            showModal={showModalMarcarConferencia}
            closeModal={() => this.closeModalMarcarConferencia()}
            onMarcarConferencia={() => {
              this.loadSolicitacao(uuid, this.state.tipoSolicitacao);
            }}
            uuid={inclusaoDeAlimentacao.uuid}
            endpoint={
              tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI
                ? "inclusoes-alimentacao-da-cei"
                : tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL
                ? "grupos-inclusao-alimentacao-normal"
                : "inclusoes-alimentacao-continua"
            }
          />
        )}
        {ModalCodaeAutoriza && (
          <ModalCodaeAutoriza
            showModal={showModalCodaeAutorizar}
            loadSolicitacao={this.loadSolicitacao}
            closeModal={this.closeModalCodaeAutorizar}
            endpoint={endpointAprovaSolicitacao}
            uuid={uuid}
            ehInclusao={true}
            tipoSolicitacao={this.state.tipoSolicitacao}
          />
        )}
        {!inclusaoDeAlimentacao ? (
          <div>Carregando...</div>
        ) : (
          <form onSubmit={() => {}}>
            {endpointAprovaSolicitacao && (
              <ModalAutorizarAposQuestionamento
                showModal={showAutorizarModal}
                loadSolicitacao={this.loadSolicitacao}
                justificativa={justificativa}
                closeModal={this.closeAutorizarModal}
                endpoint={endpointAprovaSolicitacao}
                uuid={uuid}
                tipoSolicitacao={this.state.tipoSolicitacao}
              />
            )}
            <span className="page-title">{`Inclusão de Alimentação - Solicitação # ${inclusaoDeAlimentacao.id_externo}`}</span>
            <div className="card mt-3">
              <div className="card-body">
                <CorpoRelatorio
                  inclusaoDeAlimentacao={inclusaoDeAlimentacao}
                  solicitacoesSimilares={
                    inclusaoDeAlimentacao.solicitacoes_similares
                  }
                  prazoDoPedidoMensagem={prazoDoPedidoMensagem}
                  tipoSolicitacao={tipoSolicitacao}
                  meusDados={meusDados}
                />
                {(
                  inclusaoDeAlimentacao.inclusoes ||
                  inclusaoDeAlimentacao.dias_motivos_da_inclusao_cei ||
                  inclusaoDeAlimentacao.quantidades_periodo
                ).find((inclusao) => inclusao.cancelado_justificativa) && (
                  <>
                    <hr />
                    <p>
                      <strong>Histórico de cancelamento</strong>
                      {(
                        inclusaoDeAlimentacao.inclusoes ||
                        inclusaoDeAlimentacao.dias_motivos_da_inclusao_cei ||
                        inclusaoDeAlimentacao.quantidades_periodo
                      )
                        .filter((inclusao) => inclusao.cancelado_justificativa)
                        .map((inclusao, key) => {
                          return (
                            <div key={key}>
                              {inclusao.data ||
                                `${
                                  inclusao.periodo_escolar.nome
                                } - ${inclusao.tipos_alimentacao
                                  .map((ta) => ta.nome)
                                  .join(", ")} - ${inclusao.numero_alunos}`}
                              {" - "}
                              justificativa: {inclusao.cancelado_justificativa}
                            </div>
                          );
                        })}
                    </p>
                  </>
                )}
                {inclusaoDeAlimentacao.status !== "ESCOLA_CANCELOU" && (
                  <RelatorioHistoricoJustificativaEscola
                    solicitacao={inclusaoDeAlimentacao}
                  />
                )}
                <RelatorioHistoricoQuestionamento
                  solicitacao={inclusaoDeAlimentacao}
                />
                {visualizaBotoesDoFluxo(inclusaoDeAlimentacao) && (
                  <div className="row mt-4 me-3">
                    <div className="col-12 text-end">
                      {EXIBIR_BOTAO_NAO_APROVAR && (
                        <Botao
                          texto={textoBotaoNaoAprova}
                          className="ms-3"
                          onClick={() => this.showNaoAprovaModal("Não")}
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                      )}
                      {EXIBIR_BOTAO_APROVAR &&
                        textoBotaoAprova !== "Ciente" &&
                        (visao === CODAE &&
                        inclusaoDeAlimentacao.logs.filter(
                          (log) =>
                            log.status_evento_explicacao ===
                              "Terceirizada respondeu questionamento" &&
                            !log.resposta_sim_nao
                        ).length > 0 ? null : (
                          <Botao
                            texto={textoBotaoAprova}
                            type={BUTTON_TYPE.BUTTON}
                            onClick={() =>
                              visao === DRE
                                ? this.handleSubmit()
                                : EXIBIR_MODAL_AUTORIZACAO_APOS_QUESTIONAMENTO
                                ? this.showAutorizarModal()
                                : this.showModalCodaeAutorizar()
                            }
                            disabled={submitting}
                            style={BUTTON_STYLE.GREEN}
                            className="ms-3"
                          />
                        ))}
                      {EXIBIR_BOTAO_QUESTIONAMENTO && (
                        <>
                          {inclusaoDeAlimentacao.status ===
                            statusEnum.CODAE_QUESTIONADO &&
                          tipoPerfil === TIPO_PERFIL.TERCEIRIZADA ? (
                            <Botao
                              key="1"
                              texto="Não"
                              type={BUTTON_TYPE.BUTTON}
                              onClick={() =>
                                this.showQuestionamentoModal("Não")
                              }
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                              className="ms-3"
                            />
                          ) : (
                            <></>
                          )}
                          <Botao
                            key="2"
                            texto={
                              tipoPerfil ===
                              TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
                                ? "Questionar"
                                : "Sim"
                            }
                            type={BUTTON_TYPE.BUTTON}
                            onClick={() => this.showQuestionamentoModal("Sim")}
                            style={BUTTON_STYLE.GREEN}
                            className="ms-3"
                          />
                        </>
                      )}
                      {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
                        <div className="form-group float-end mt-4">
                          {inclusaoDeAlimentacao.terceirizada_conferiu_gestao ? (
                            <label className="ms-3 conferido">
                              <i className="fas fa-check me-2" />
                              Solicitação Conferida
                            </label>
                          ) : (
                            <BotaoMarcarConferencia
                              uuid={inclusaoDeAlimentacao.uuid}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}

const formName = "relatorioInclusaoDeAlimentacao";
const RelatorioForm = reduxForm({
  form: formName,
  enableReinitialize: true,
})(Relatorio);

const selector = formValueSelector(formName);

const mapStateToProps = (state) => {
  return {
    justificativa: selector(state, "justificativa"),
    motivo_cancelamento: selector(state, "motivo_cancelamento"),
  };
};

export default connect(mapStateToProps)(RelatorioForm);
