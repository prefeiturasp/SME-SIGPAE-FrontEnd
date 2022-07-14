import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { Botao } from "../../Shareable/Botao";
import { Link } from "react-router-dom";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON
} from "../../Shareable/Botao/constants";
import { reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { visualizaBotoesDoFluxo } from "../../../helpers/utilities";
import CorpoRelatorio from "./componentes/CorpoRelatorio";
import { prazoDoPedidoMensagem } from "../../../helpers/utilities";
import { toastSuccess, toastError } from "../../Shareable/Toast/dialogs";
import { TIPO_PERFIL, TIPO_SOLICITACAO } from "../../../constants/shared";
import { statusEnum } from "../../../constants/shared";
import RelatorioHistoricoQuestionamento from "../../Shareable/RelatorioHistoricoQuestionamento";
import RelatorioHistoricoJustificativaEscola from "../../Shareable/RelatorioHistoricoJustificativaEscola";
import { CODAE, TERCEIRIZADA } from "../../../configs/constants";
import { ModalAutorizarAposQuestionamento } from "../../Shareable/ModalAutorizarAposQuestionamento";
import { meusDados } from "services/perfil.service";
import ModalMarcarConferencia from "components/Shareable/ModalMarcarConferencia";
// services
import { obterSolicitacaoDeInclusaoDeAlimentacao } from "services/inclusaoDeAlimentacao";

class Relatorio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: null,
      showNaoAprovaModal: false,
      tipoSolicitacao: null,
      showAutorizarModal: false,
      showModal: false,
      meusDados: null,
      inclusaoDeAlimentacao: null,
      prazoDoPedidoMensagem: null,
      resposta_sim_nao: null,
      showModalMarcarConferencia: false
    };

    //FIXME: migrar para padrao sem binding
    this.closeQuestionamentoModal = this.closeQuestionamentoModal.bind(this);
    this.closeNaoAprovaModal = this.closeNaoAprovaModal.bind(this);
    this.closeAutorizarModal = this.closeAutorizarModal.bind(this);
    this.loadSolicitacao = this.loadSolicitacao.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModalMarcarConferencia = this.closeModalMarcarConferencia.bind(
      this
    );
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const tipoSolicitacao = urlParams.get("tipoSolicitacao");
    meusDados().then(response => {
      if (response) {
        this.setState({ meusDados: response });
      } else {
        this.setState({ erro: true });
        toastError("Erro ao carregar dados do usuário");
      }
    });
    if (uuid) {
      obterSolicitacaoDeInclusaoDeAlimentacao(uuid, tipoSolicitacao).then(
        response => {
          this.setState({
            uuid,
            inclusaoDeAlimentacao: response,
            tipoSolicitacao,
            prazoDoPedidoMensagem: prazoDoPedidoMensagem(response.prioridade)
          });
        }
      );
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

  showModalMarcarConferencia() {
    this.setState({ showModalMarcarConferencia: true });
  }

  closeModalMarcarConferencia() {
    this.setState({ showModalMarcarConferencia: false });
  }

  loadSolicitacao(uuid, tipoSolicitacao) {
    obterSolicitacaoDeInclusaoDeAlimentacao(uuid, tipoSolicitacao).then(
      response => {
        this.setState({
          inclusaoDeAlimentacao: response
        });
      }
    );
  }

  handleSubmit() {
    const { toastAprovaMensagem, toastAprovaMensagemErro } = this.props;
    this.props
      .endpointAprovaSolicitacao(
        this.state.uuid,
        this.props.justificativa,
        this.state.tipoSolicitacao
      )
      .then(
        response => {
          if (response.status === HTTP_STATUS.OK) {
            toastSuccess(toastAprovaMensagem);
            this.loadSolicitacao(this.state.uuid, this.state.tipoSolicitacao);
          } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
            toastError(toastAprovaMensagemErro);
          }
        },
        function() {
          toastError(toastAprovaMensagemErro);
        }
      );
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
      meusDados,
      showModalMarcarConferencia
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
      motivosDREnaoValida
    } = this.props;
    const tipoPerfil = localStorage.getItem("tipo_perfil");
    const EXIBIR_BOTAO_NAO_APROVAR =
      tipoPerfil !== TIPO_PERFIL.TERCEIRIZADA ||
      (inclusaoDeAlimentacao &&
        inclusaoDeAlimentacao.foi_solicitado_fora_do_prazo &&
        inclusaoDeAlimentacao.status === statusEnum.CODAE_QUESTIONADO &&
        textoBotaoNaoAprova);
    const EXIBIR_BOTAO_APROVAR =
      (![
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.TERCEIRIZADA
      ].includes(tipoPerfil) &&
        textoBotaoAprova) ||
      (inclusaoDeAlimentacao &&
        (!inclusaoDeAlimentacao.foi_solicitado_fora_do_prazo ||
          [
            statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
            statusEnum.CODAE_AUTORIZADO
          ].includes(inclusaoDeAlimentacao.status)) &&
        textoBotaoAprova);
    const EXIBIR_BOTAO_QUESTIONAMENTO =
      [
        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
        TIPO_PERFIL.TERCEIRIZADA
      ].includes(tipoPerfil) &&
      inclusaoDeAlimentacao &&
      (inclusaoDeAlimentacao.foi_solicitado_fora_do_prazo ||
        (visao === CODAE && inclusaoDeAlimentacao.prioridade !== "REGULAR")) &&
      [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
        inclusaoDeAlimentacao.status
      );
    const EXIBIR_MODAL_AUTORIZACAO =
      visao === CODAE &&
      inclusaoDeAlimentacao &&
      inclusaoDeAlimentacao.foi_solicitado_fora_do_prazo &&
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
          className="ml-3"
          onClick={() => {
            this.showModalMarcarConferencia();
          }}
        />
      );
    };

    return (
      <div className="report">
        {ModalNaoAprova && (
          <ModalNaoAprova
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
            endpoint="grupos-inclusao-alimentacao-normal"
          />
        )}
        {!inclusaoDeAlimentacao ? (
          <div>Carregando...</div>
        ) : (
          <form onSubmit={this.props.handleSubmit || (() => {})}>
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
            <span className="page-title">{`Inclusão de Alimentação - Solicitação # ${
              inclusaoDeAlimentacao.id_externo
            }`}</span>
            <Link to={`/`}>
              <Botao
                texto="voltar"
                titulo="voltar"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.BLUE}
                icon={BUTTON_ICON.ARROW_LEFT}
                className="float-right"
              />
            </Link>
            <div className="card mt-3">
              <div className="card-body">
                <CorpoRelatorio
                  inclusaoDeAlimentacao={inclusaoDeAlimentacao}
                  prazoDoPedidoMensagem={prazoDoPedidoMensagem}
                  tipoSolicitacao={tipoSolicitacao}
                  meusDados={meusDados}
                />
                {tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL &&
                  inclusaoDeAlimentacao.inclusoes.find(
                    inclusao => inclusao.cancelado
                  ) && (
                    <>
                      <hr />
                      <p>
                        <strong>Histórico de cancelamento parcial</strong>
                        {inclusaoDeAlimentacao.inclusoes
                          .filter(inclusao => inclusao.cancelado)
                          .map((inclusao, key) => {
                            return (
                              <div key={key}>
                                {inclusao.data}
                                {" - "}
                                {inclusao.cancelado_justificativa}
                              </div>
                            );
                          })}
                      </p>
                    </>
                  )}
                <RelatorioHistoricoJustificativaEscola
                  solicitacao={inclusaoDeAlimentacao}
                />
                <RelatorioHistoricoQuestionamento
                  solicitacao={inclusaoDeAlimentacao}
                />

                {visualizaBotoesDoFluxo(inclusaoDeAlimentacao) && (
                  <div className="form-group row float-right mt-4">
                    {EXIBIR_BOTAO_NAO_APROVAR && (
                      <Botao
                        texto={textoBotaoNaoAprova}
                        className="ml-3"
                        onClick={() => this.showNaoAprovaModal("Não")}
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                    )}
                    {EXIBIR_BOTAO_APROVAR &&
                      (textoBotaoAprova !== "Ciente" &&
                        (visao === CODAE &&
                        inclusaoDeAlimentacao.logs.filter(
                          log =>
                            log.status_evento_explicacao ===
                              "Terceirizada respondeu questionamento" &&
                            !log.resposta_sim_nao
                        ).length > 0 ? null : (
                          <Botao
                            texto={textoBotaoAprova}
                            type={BUTTON_TYPE.BUTTON}
                            onClick={() =>
                              EXIBIR_MODAL_AUTORIZACAO
                                ? this.showAutorizarModal()
                                : this.handleSubmit()
                            }
                            style={BUTTON_STYLE.GREEN}
                            className="ml-3"
                          />
                        )))}
                    {EXIBIR_BOTAO_QUESTIONAMENTO && (
                      <>
                        {inclusaoDeAlimentacao.status ===
                          statusEnum.CODAE_QUESTIONADO &&
                        tipoPerfil === TIPO_PERFIL.TERCEIRIZADA ? (
                          <Botao
                            key="1"
                            texto="Não"
                            type={BUTTON_TYPE.SUBMIT}
                            onClick={() => this.showQuestionamentoModal("Não")}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            className="ml-3"
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
                          type={BUTTON_TYPE.SUBMIT}
                          onClick={() => this.showQuestionamentoModal("Sim")}
                          style={BUTTON_STYLE.GREEN}
                          className="ml-3"
                        />
                      </>
                    )}
                    {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
                      <div className="form-group float-right mt-4">
                        {inclusaoDeAlimentacao.terceirizada_conferiu_gestao ? (
                          <label className="ml-3 conferido">
                            <i className="fas fa-check mr-2" />
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
  enableReinitialize: true
})(Relatorio);

const selector = formValueSelector(formName);

const mapStateToProps = state => {
  return {
    justificativa: selector(state, "justificativa"),
    motivo_cancelamento: selector(state, "motivo_cancelamento")
  };
};

export default connect(mapStateToProps)(RelatorioForm);
