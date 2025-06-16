import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { formValueSelector, reduxForm } from "redux-form";
import {
  INVERSAO_CARDAPIO,
  CODAE,
  TERCEIRIZADA,
} from "../../../configs/constants";
import { TIPO_PERFIL } from "../../../constants/shared";
import { statusEnum } from "../../../constants/shared";
import {
  visualizaBotoesDoFluxo,
  prazoDoPedidoMensagem,
  getError,
  ehUsuarioEmpresa,
} from "src/helpers/utilities";
import { getInversaoDeDiaDeCardapio } from "../../../services/inversaoDeDiaDeCardapio.service";
import Botao from "../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../Shareable/Botao/constants";
import { toastError, toastSuccess } from "../../Shareable/Toast/dialogs";
import RelatorioHistoricoQuestionamento from "../../Shareable/RelatorioHistoricoQuestionamento";
import RelatorioHistoricoJustificativaEscola from "../../Shareable/RelatorioHistoricoJustificativaEscola";
import ModalAutorizarAposQuestionamento from "../../Shareable/ModalAutorizarAposQuestionamento";
import CorpoRelatorio from "./componentes/CorpoRelatorio";
import ModalMarcarConferencia from "src/components/Shareable/ModalMarcarConferencia";

class Relatorio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unifiedSolicitationList: [],
      uuid: null,
      redirect: false,
      showNaoAprovaModal: false,
      showModal: false,
      showAutorizarModal: false,
      showModalCodaeAutorizar: false,
      inversaoDiaCardapio: null,
      escolaDaInversao: null,
      prazoDoPedidoMensagem: null,
      erro: false,
      showModalMarcarConferencia: false,
    };
    this.closeQuestionamentoModal = this.closeQuestionamentoModal.bind(this);
    this.closeNaoAprovaModal = this.closeNaoAprovaModal.bind(this);
    this.closeAutorizarModal = this.closeAutorizarModal.bind(this);
    this.closeModalCodaeAutorizar = this.closeModalCodaeAutorizar.bind(this);
    this.loadSolicitacao = this.loadSolicitacao.bind(this);
    this.closeModalMarcarConferencia =
      this.closeModalMarcarConferencia.bind(this);
  }

  setRedirect() {
    this.setState({
      redirect: true,
    });
  }

  renderizarRedirecionamentoParaInversoesDeCardapio = () => {
    if (this.state.redirect) {
      return <Navigate to={`/${this.props.VISAO}/${INVERSAO_CARDAPIO}`} />;
    }
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      getInversaoDeDiaDeCardapio(uuid).then((response) => {
        if (response.status === HTTP_STATUS.OK) {
          const inversaoDiaCardapio = response.data;
          this.setState({
            inversaoDiaCardapio,
            uuid,
            escolaDaInversao: inversaoDiaCardapio.escola,
            prazoDoPedidoMensagem: prazoDoPedidoMensagem(
              inversaoDiaCardapio.prioridade
            ),
          });
        } else if (response.data.detail) {
          this.setState({ erro: true });
          toastError(getError(response.data));
        } else {
          this.setState({ erro: true });
          toastError(
            `Erro ao carregar relatório de Inversão de dia de Cardápio ${getError(
              response.data
            )}`
          );
        }
      });
    }
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

  loadSolicitacao(uuid) {
    getInversaoDeDiaDeCardapio(uuid).then((response) => {
      this.setState({
        inversaoDiaCardapio: response.data,
      });
    });
  }

  handleSubmit() {
    const { toastAprovaMensagem, toastAprovaMensagemErro } = this.props;
    const uuid = this.state.uuid;
    this.props.endpointAprovaSolicitacao(uuid).then(
      (response) => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess(toastAprovaMensagem);
          this.loadSolicitacao(uuid);
        } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(toastAprovaMensagemErro);
        }
      },
      function () {
        toastError(toastAprovaMensagemErro);
      }
    );
  }

  render() {
    const {
      inversaoDiaCardapio,
      prazoDoPedidoMensagem,
      escolaDaInversao,
      uuid,
      resposta_sim_nao,
      showNaoAprovaModal,
      showQuestionamentoModal,
      showAutorizarModal,
      showModalCodaeAutorizar,
      erro,
      showModalMarcarConferencia,
    } = this.state;
    const {
      visao,
      motivo_cancelamento,
      justificativa,
      motivosDREnaoValida,
      textoBotaoNaoAprova,
      textoBotaoAprova,
      endpointAprovaSolicitacao,
      endpointNaoAprovaSolicitacao,
      endpointQuestionamento,
      ModalNaoAprova,
      ModalQuestionamento,
      ModalCodaeAutoriza,
    } = this.props;
    const tipoPerfil = localStorage.getItem("tipo_perfil");
    const EXIBIR_BOTAO_NAO_APROVAR =
      tipoPerfil !== TIPO_PERFIL.TERCEIRIZADA ||
      (inversaoDiaCardapio &&
        inversaoDiaCardapio.prioridade !== "REGULAR" &&
        inversaoDiaCardapio.status === statusEnum.CODAE_QUESTIONADO &&
        textoBotaoNaoAprova);
    const EXIBIR_BOTAO_APROVAR =
      (![
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.TERCEIRIZADA,
      ].includes(tipoPerfil) &&
        textoBotaoAprova) ||
      (inversaoDiaCardapio &&
        (inversaoDiaCardapio.prioridade === "REGULAR" ||
          [
            statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
            statusEnum.CODAE_AUTORIZADO,
          ].includes(inversaoDiaCardapio.status)) &&
        textoBotaoAprova);
    const EXIBIR_BOTAO_QUESTIONAMENTO =
      [
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.TERCEIRIZADA,
      ].includes(tipoPerfil) &&
      inversaoDiaCardapio &&
      (inversaoDiaCardapio.prioridade !== "REGULAR" ||
        (visao === CODAE && inversaoDiaCardapio.prioridade !== "REGULAR")) &&
      [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
        inversaoDiaCardapio.status
      );
    const EXIBIR_MODAL_AUTORIZACAO =
      visao === CODAE &&
      inversaoDiaCardapio &&
      inversaoDiaCardapio.prioridade !== "REGULAR" &&
      !inversaoDiaCardapio.logs[inversaoDiaCardapio.logs.length - 1]
        .resposta_sim_nao;
    const EXIBIR_BOTAO_MARCAR_CONFERENCIA =
      !ehUsuarioEmpresa() &&
      visao === TERCEIRIZADA &&
      inversaoDiaCardapio &&
      [statusEnum.CODAE_AUTORIZADO, statusEnum.ESCOLA_CANCELOU].includes(
        inversaoDiaCardapio.status
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
        />
      );
    };

    const handleClickBotaoAprova = () => {
      if (EXIBIR_MODAL_AUTORIZACAO) {
        this.showAutorizarModal();
      } else if (visao === CODAE && inversaoDiaCardapio) {
        this.showModalCodaeAutorizar();
      } else {
        this.handleSubmit();
      }
    };

    return (
      <div className="report">
        {ModalCodaeAutoriza && (
          <ModalCodaeAutoriza
            showModal={showModalCodaeAutorizar}
            loadSolicitacao={this.loadSolicitacao}
            closeModal={this.closeModalCodaeAutorizar}
            endpoint={endpointAprovaSolicitacao}
            uuid={uuid}
          />
        )}
        {ModalNaoAprova && (
          <ModalNaoAprova
            showModal={showNaoAprovaModal}
            motivoCancelamento={motivo_cancelamento}
            closeModal={this.closeNaoAprovaModal}
            endpoint={endpointNaoAprovaSolicitacao}
            solicitacao={inversaoDiaCardapio}
            loadSolicitacao={this.loadSolicitacao}
            justificativa={justificativa}
            resposta_sim_nao={resposta_sim_nao}
            motivosDREnaoValida={motivosDREnaoValida}
            uuid={uuid}
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
          />
        )}
        {inversaoDiaCardapio && (
          <ModalMarcarConferencia
            showModal={showModalMarcarConferencia}
            closeModal={() => this.closeModalMarcarConferencia()}
            onMarcarConferencia={() => {
              this.loadSolicitacao(uuid, this.state.tipoSolicitacao);
            }}
            uuid={inversaoDiaCardapio.uuid}
            endpoint="inversoes-dia-cardapio"
          />
        )}
        {erro && (
          <div>Opss... parece que ocorreu um erro ao carregar a página.</div>
        )}
        {!inversaoDiaCardapio && !erro && <div>Carregando...</div>}
        {inversaoDiaCardapio && (
          <form onSubmit={() => this.handleSubmit()}>
            {EXIBIR_MODAL_AUTORIZACAO && (
              <ModalAutorizarAposQuestionamento
                showModal={showAutorizarModal}
                loadSolicitacao={this.loadSolicitacao}
                justificativa={justificativa}
                closeModal={this.closeAutorizarModal}
                endpoint={endpointAprovaSolicitacao}
                uuid={uuid}
              />
            )}
            <span className="page-title">{`Inversão de dia de Cardápio - Solicitação # ${inversaoDiaCardapio.id_externo}`}</span>
            <div className="card mt-3">
              <div className="card-body">
                <CorpoRelatorio
                  inversaoDiaCardapio={inversaoDiaCardapio}
                  escolaDaInversao={escolaDaInversao}
                  prazoDoPedidoMensagem={prazoDoPedidoMensagem}
                />
                <RelatorioHistoricoJustificativaEscola
                  solicitacao={inversaoDiaCardapio}
                />
                <RelatorioHistoricoQuestionamento
                  solicitacao={inversaoDiaCardapio}
                />
                {visualizaBotoesDoFluxo(inversaoDiaCardapio) && (
                  <div className="row mt-4">
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
                        inversaoDiaCardapio.logs.filter(
                          (log) =>
                            log.status_evento_explicacao ===
                              "Terceirizada respondeu questionamento" &&
                            !log.resposta_sim_nao
                        ).length > 0 ? null : (
                          <Botao
                            texto={textoBotaoAprova}
                            className="ms-3"
                            onClick={() => handleClickBotaoAprova()}
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN}
                          />
                        ))}
                      {EXIBIR_BOTAO_QUESTIONAMENTO && (
                        <Botao
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
                      )}
                      {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
                        <div className="form-group float-end mt-4">
                          {inversaoDiaCardapio.terceirizada_conferiu_gestao ? (
                            <label className="ms-3 conferido">
                              <i className="fas fa-check me-2" />
                              Solicitação Conferida
                            </label>
                          ) : (
                            <BotaoMarcarConferencia
                              uuid={inversaoDiaCardapio.uuid}
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

const formName = "relatorioInversaoDeDiaDeCardapio";
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
