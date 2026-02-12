import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { getSolicitacaoUnificada } from "src/services/solicitacaoUnificada.service";
import { visualizaBotoesDoFluxoSolicitacaoUnificada } from "src/helpers/utilities";
import CorpoRelatorio from "./componentes/CorpoRelatorio";
import { prazoDoPedidoMensagem, ehUsuarioEmpresa } from "src/helpers/utilities";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";
import { TIPO_PERFIL } from "src/constants/shared";
import { statusEnum } from "src/constants/shared";
import RelatorioHistoricoQuestionamento from "src/components/Shareable/RelatorioHistoricoQuestionamento";
import RelatorioHistoricoJustificativaEscola from "src/components/Shareable/RelatorioHistoricoJustificativaEscola";
import { CODAE, ESCOLA, TERCEIRIZADA } from "src/configs/constants";
import ModalAutorizarAposQuestionamento from "src/components/Shareable/ModalAutorizarAposQuestionamento";
import ModalMarcarConferencia from "src/components/Shareable/ModalMarcarConferencia";
import { Spin } from "antd";

const Relatorio = (props) => {
  let {
    visao,
    endpointAprovaSolicitacao,
    justificativa,
    textoBotaoNaoAprova,
    textoBotaoAprova,
    endpointNaoAprovaSolicitacao,
    endpointQuestionamento,
    ModalNaoAprova,
    ModalQuestionamento,
    toastAprovaMensagem,
    toastAprovaMensagemErro,
  } = props;

  const [uuid, setUuid] = useState(null);
  const [showNaoAprovaModal, setShowNaoAprovaModal] = useState(false);
  const [showAutorizarModal, setShowAutorizarModal] = useState(false);
  const [solicitacaoUnificada, setSolicitacaoUnificada] = useState(null);
  const [prazoDoPedido, setPrazoDoPedido] = useState(null);
  const [resposta_sim_nao, setResposta_sim_nao] = useState(null);
  const [showModalMarcarConferencia, setShowModalMarcarConferencia] =
    useState(false);
  const [showQuestionamentoModal, setShowQuestionamentoModal] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuidURL = urlParams.get("uuid");

    if (uuidURL) {
      setCarregando(true);
      getSolicitacaoUnificada(uuidURL).then((response) => {
        setSolicitacaoUnificada(response.data);
        setUuid(uuidURL);
        setPrazoDoPedido(prazoDoPedidoMensagem(response.data.prioridade));
        setCarregando(false);
      });
    }
  }, []);

  useEffect(() => {
    if (!showNaoAprovaModal) {
      props.change("justificativa", "");
      props.change("escolas", []);
    }
  }, [showNaoAprovaModal]);

  const openQuestionamentoModal = (resposta_sim_nao) => {
    setResposta_sim_nao(resposta_sim_nao);
    setShowQuestionamentoModal(true);
  };

  const closeQuestionamentoModal = () => {
    setShowQuestionamentoModal(false);
  };

  const openNaoAprovaModal = (resposta_sim_nao) => {
    setResposta_sim_nao(resposta_sim_nao);
    setShowNaoAprovaModal(true);
  };

  const closeNaoAprovaModal = () => {
    setShowNaoAprovaModal(false);
  };

  const openAutorizarModal = () => {
    setShowAutorizarModal(true);
  };

  const closeAutorizarModal = () => {
    setShowAutorizarModal(false);
  };

  const openModalMarcarConferencia = () => {
    setShowModalMarcarConferencia(true);
  };

  const closeModalMarcarConferencia = () => {
    setShowModalMarcarConferencia(false);
  };

  const loadSolicitacao = (uuidProp) => {
    setCarregando(true);
    getSolicitacaoUnificada(uuidProp || uuid).then((response) => {
      setSolicitacaoUnificada(response.data);
      setCarregando(false);
    });
  };

  const handleSubmit = async () => {
    setCarregando(true);
    endpointAprovaSolicitacao(uuid).then(
      (response) => {
        if (response.status === HTTP_STATUS.OK) {
          setCarregando(false);
          toastSuccess(toastAprovaMensagem);
          loadSolicitacao(uuid);
        } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(toastAprovaMensagemErro);
        }
      },
      function () {
        toastError(toastAprovaMensagemErro);
      },
    );
  };

  const tipoPerfil = localStorage.getItem("tipo_perfil");
  const nomeEscola = localStorage.getItem("nome_instituicao");

  let EXIBIR_BOTAO_NAO_APROVAR =
    tipoPerfil !== TIPO_PERFIL.TERCEIRIZADA ||
    (solicitacaoUnificada &&
      solicitacaoUnificada.prioridade !== "REGULAR" &&
      solicitacaoUnificada.status === statusEnum.CODAE_QUESTIONADO &&
      textoBotaoNaoAprova);
  if (solicitacaoUnificada && visao === ESCOLA) {
    const escolaQuantidade = solicitacaoUnificada.escolas_quantidades.filter(
      (eq) => {
        return eq.escola.nome.includes(nomeEscola.replace(/"/g, ""));
      },
    )[0];
    EXIBIR_BOTAO_NAO_APROVAR = !escolaQuantidade.cancelado;
  }
  const EXIBIR_BOTAO_APROVAR =
    (![
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) &&
      textoBotaoAprova) ||
    (solicitacaoUnificada &&
      (solicitacaoUnificada.prioridade === "REGULAR" ||
        [
          statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
          statusEnum.CODAE_AUTORIZADO,
        ].includes(solicitacaoUnificada.status)) &&
      textoBotaoAprova);
  const EXIBIR_BOTAO_QUESTIONAMENTO =
    [
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) &&
    solicitacaoUnificada &&
    (solicitacaoUnificada.prioridade !== "REGULAR" ||
      (visao === CODAE && solicitacaoUnificada.prioridade !== "REGULAR")) &&
    [statusEnum.CODAE_A_AUTORIZAR, statusEnum.CODAE_QUESTIONADO].includes(
      solicitacaoUnificada.status,
    );
  const EXIBIR_MODAL_AUTORIZACAO =
    visao === CODAE &&
    solicitacaoUnificada &&
    solicitacaoUnificada.prioridade !== "REGULAR" &&
    !solicitacaoUnificada.logs[solicitacaoUnificada.logs.length - 1]
      .resposta_sim_nao;
  const EXIBIR_BOTAO_MARCAR_CONFERENCIA =
    !ehUsuarioEmpresa() &&
    visao === TERCEIRIZADA &&
    solicitacaoUnificada &&
    [
      statusEnum.CODAE_AUTORIZADO,
      statusEnum.ESCOLA_CANCELOU,
      statusEnum.DRE_CANCELOU,
    ].includes(solicitacaoUnificada.status);

  const BotaoMarcarConferencia = () => {
    return (
      <Botao
        texto="Marcar Conferência"
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN}
        className="ms-3"
        onClick={() => {
          openModalMarcarConferencia();
        }}
      />
    );
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="report">
        {ModalNaoAprova && (
          <ModalNaoAprova
            showModal={showNaoAprovaModal}
            closeModal={closeNaoAprovaModal}
            endpoint={endpointNaoAprovaSolicitacao}
            solicitacao={solicitacaoUnificada}
            loadSolicitacao={loadSolicitacao}
            justificativa={justificativa}
            resposta_sim_nao={resposta_sim_nao}
            uuid={uuid}
            visao={visao}
          />
        )}
        {ModalQuestionamento && (
          <ModalQuestionamento
            closeModal={closeQuestionamentoModal}
            solicitacao={solicitacaoUnificada}
            showModal={showQuestionamentoModal}
            justificativa={justificativa}
            uuid={uuid}
            loadSolicitacao={loadSolicitacao}
            resposta_sim_nao={resposta_sim_nao}
            endpoint={endpointQuestionamento}
          />
        )}
        {solicitacaoUnificada && (
          <ModalMarcarConferencia
            showModal={showModalMarcarConferencia}
            closeModal={closeModalMarcarConferencia}
            onMarcarConferencia={() => {
              loadSolicitacao(uuid);
            }}
            uuid={solicitacaoUnificada.uuid}
            endpoint="solicitacoes-kit-lanche-unificada"
          />
        )}

        <form onSubmit={props.handleSubmit}>
          {endpointAprovaSolicitacao && (
            <ModalAutorizarAposQuestionamento
              showModal={showAutorizarModal}
              loadSolicitacao={loadSolicitacao}
              justificativa={justificativa}
              closeModal={closeAutorizarModal}
              endpoint={endpointAprovaSolicitacao}
              uuid={uuid}
            />
          )}
          <span className="page-title">{`Solicitação Unificada - Solicitação # ${solicitacaoUnificada?.id_externo}`}</span>
          <div className="card mt-3">
            <div className="card-body">
              {solicitacaoUnificada && (
                <CorpoRelatorio
                  solicitacaoUnificada={solicitacaoUnificada}
                  prazoDoPedidoMensagem={prazoDoPedido}
                  visao={visao}
                />
              )}
              {solicitacaoUnificada && (
                <RelatorioHistoricoJustificativaEscola
                  solicitacao={solicitacaoUnificada}
                  visao={visao}
                  nomeEscola={nomeEscola}
                />
              )}
              {solicitacaoUnificada && (
                <RelatorioHistoricoQuestionamento
                  solicitacao={solicitacaoUnificada}
                />
              )}
              {visualizaBotoesDoFluxoSolicitacaoUnificada(
                solicitacaoUnificada,
              ) && (
                <div className="form-group row float-end justify-content-end mt-4">
                  {EXIBIR_BOTAO_NAO_APROVAR && (
                    <Botao
                      texto={textoBotaoNaoAprova}
                      className="ms-3 me-3 mt-4"
                      onClick={() => openNaoAprovaModal("Não")}
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                  )}
                  {EXIBIR_BOTAO_APROVAR &&
                    textoBotaoAprova !== "Ciente" &&
                    (visao === CODAE &&
                    solicitacaoUnificada?.logs.filter(
                      (log) =>
                        log.status_evento_explicacao ===
                          "Terceirizada respondeu questionamento" &&
                        !log.resposta_sim_nao,
                    ).length > 0 ? null : (
                      <Botao
                        texto={textoBotaoAprova}
                        type={BUTTON_TYPE.SUBMIT}
                        onClick={
                          EXIBIR_MODAL_AUTORIZACAO
                            ? openAutorizarModal
                            : handleSubmit
                        }
                        style={BUTTON_STYLE.GREEN}
                        className="ms-3 me-3 mt-4"
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
                      onClick={() => openQuestionamentoModal("Sim")}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3 me-3 mt-4"
                    />
                  )}
                  {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
                    <div className="form-group float-end mt-4">
                      {solicitacaoUnificada?.terceirizada_conferiu_gestao ? (
                        <label className="ms-3 conferido">
                          <i className="fas fa-check me-2" />
                          Solicitação Conferida
                        </label>
                      ) : (
                        <BotaoMarcarConferencia
                          uuid={solicitacaoUnificada?.uuid}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Spin>
  );
};

const formName = "relatorioSolicitacaoUnificada";
const RelatorioForm = reduxForm({
  form: formName,
  enableReinitialize: true,
})(Relatorio);

const selector = formValueSelector(formName);

const mapStateToProps = (state) => {
  return {
    justificativa: selector(state, "justificativa"),
    escolas: selector(state, "escolas"),
    motivo_cancelamento: selector(state, "motivo_cancelamento"),
  };
};

export default connect(mapStateToProps)(RelatorioForm);
