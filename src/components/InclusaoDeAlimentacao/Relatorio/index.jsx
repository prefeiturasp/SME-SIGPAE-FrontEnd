import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { Botao } from "../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../Shareable/Botao/constants";
import { reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { getInclusaoDeAlimentacaoAvulsa } from "../../../services/inclusaoDeAlimentacaoAvulsa.service";
import { visualizaBotoesDoFluxo } from "../../../helpers/utilities";
import CorpoRelatorio from "./componentes/CorpoRelatorio";
import { prazoDoPedidoMensagem } from "../../../helpers/utilities";
import { toastSuccess, toastError } from "../../Shareable/Toast/dialogs";
import { TIPO_PERFIL } from "../../../constants";
import { statusEnum } from "../../../constants";
import RelatorioHistoricoQuestionamento from "../../Shareable/RelatorioHistoricoQuestionamento";
import { getInclusaoDeAlimentacaoContinua } from "../../../services/inclusaoDeAlimentacaoContinua.service";
import { CODAE } from "../../../configs/constants";
import { ModalAutorizarAposQuestionamento } from "../../Shareable/ModalAutorizarAposQuestionamento";

class Relatorio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: null,
      showNaoAprovaModal: false,
      ehInclusaoContinua: false,
      showAutorizarModal: false,
      showModal: false,
      inclusaoDeAlimentacao: null,
      prazoDoPedidoMensagem: null,
      resposta_sim_nao: null
    };
    this.closeQuestionamentoModal = this.closeQuestionamentoModal.bind(this);
    this.closeNaoAprovaModal = this.closeNaoAprovaModal.bind(this);
    this.closeAutorizarModal = this.closeAutorizarModal.bind(this);
    this.loadSolicitacao = this.loadSolicitacao.bind(this);
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const ehInclusaoContinua = urlParams.get("ehInclusaoContinua");
    const getInclusaoDeAlimentacao =
      ehInclusaoContinua === "true"
        ? getInclusaoDeAlimentacaoContinua
        : getInclusaoDeAlimentacaoAvulsa;
    if (uuid) {
      getInclusaoDeAlimentacao(uuid).then(response => {
        this.setState({
          inclusaoDeAlimentacao: response,
          uuid,
          ehInclusaoContinua: ehInclusaoContinua === "true",
          prazoDoPedidoMensagem: prazoDoPedidoMensagem(response.data_inicial)
        });
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

  loadSolicitacao(uuid) {
    const { ehInclusaoContinua } = this.state;
    const getInclusaoDeAlimentacao = ehInclusaoContinua
      ? getInclusaoDeAlimentacaoContinua
      : getInclusaoDeAlimentacaoAvulsa;
    getInclusaoDeAlimentacao(uuid).then(response => {
      this.setState({
        inclusaoDeAlimentacao: response
      });
    });
  }

  handleSubmit() {
    const { toastAprovaMensagem, toastAprovaMensagemErro } = this.props;
    const uuid = this.state.uuid;
    this.props.endpointAprovaSolicitacao(uuid).then(
      response => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess(toastAprovaMensagem);
          this.loadSolicitacao(uuid);
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
      ehInclusaoContinua,
      showQuestionamentoModal,
      uuid,
      showAutorizarModal
    } = this.state;
    const {
      endpointAprovaSolicitacao,
      justificativa,
      visao,
      textoBotaoNaoAprova,
      textoBotaoAprova,
      endpointNaoAprovaSolicitacao,
      endpointQuestionamento,
      ModalNaoAprova,
      ModalQuestionamento
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
      inclusaoDeAlimentacao.foi_solicitado_fora_do_prazo &&
      [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
        inclusaoDeAlimentacao.status
      );
    const EXIBIR_MODAL_AUTORIZACAO =
      visao === CODAE &&
      inclusaoDeAlimentacao &&
      inclusaoDeAlimentacao.foi_solicitado_fora_do_prazo &&
      !inclusaoDeAlimentacao.logs[inclusaoDeAlimentacao.logs.length - 1]
        .resposta_sim_nao;
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
            resposta_sim_nao={resposta_sim_nao}
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
        {!inclusaoDeAlimentacao ? (
          <div>Carregando...</div>
        ) : (
          <form onSubmit={this.props.handleSubmit}>
            {endpointAprovaSolicitacao && (
              <ModalAutorizarAposQuestionamento
                showModal={showAutorizarModal}
                loadSolicitacao={this.loadSolicitacao}
                justificativa={justificativa}
                closeModal={this.closeAutorizarModal}
                endpoint={endpointAprovaSolicitacao}
                uuid={uuid}
              />
            )}
            <span className="page-title">{`Inclusão de Alimentação - Solicitação # ${
              inclusaoDeAlimentacao.id_externo
            }`}</span>
            <div className="card mt-3">
              <div className="card-body">
                <CorpoRelatorio
                  inclusaoDeAlimentacao={inclusaoDeAlimentacao}
                  prazoDoPedidoMensagem={prazoDoPedidoMensagem}
                  ehInclusaoContinua={ehInclusaoContinua}
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
                    {EXIBIR_BOTAO_APROVAR && (
                      <Botao
                        texto={textoBotaoAprova}
                        type={BUTTON_TYPE.SUBMIT}
                        onClick={() =>
                          EXIBIR_MODAL_AUTORIZACAO
                            ? this.showAutorizarModal()
                            : this.handleSubmit()
                        }
                        style={BUTTON_STYLE.GREEN}
                        className="ml-3"
                      />
                    )}
                    {EXIBIR_BOTAO_QUESTIONAMENTO && (
                      <Botao
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
