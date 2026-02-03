import React, { useState, useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { Botao } from "../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../Shareable/Botao/constants";
import { Form } from "react-final-form";
import { getDetalheKitLancheAvulsa } from "../../../services/kitLanche";
import { deepCopy, visualizaBotoesDoFluxo } from "../../../helpers/utilities";
import CorpoRelatorio from "./componentes/CorpoRelatorio";
import { prazoDoPedidoMensagem } from "../../../helpers/utilities";
import { toastSuccess, toastError } from "../../Shareable/Toast/dialogs";
import { TIPO_PERFIL, TIPO_SOLICITACAO } from "../../../constants/shared";
import { statusEnum } from "../../../constants/shared";
import RelatorioHistoricoQuestionamento from "../../Shareable/RelatorioHistoricoQuestionamento";
import RelatorioHistoricoJustificativaEscola from "../../Shareable/RelatorioHistoricoJustificativaEscola";
import { CODAE, TERCEIRIZADA } from "../../../configs/constants";
import ModalMarcarConferencia from "src/components/Shareable/ModalMarcarConferencia";
import { meusDados } from "src/services/perfil.service";
import ModalAutorizarAposQuestionamento from "src/components/Shareable/ModalAutorizarAposQuestionamento";
import { ModalAprovarGenericoSimOpcional } from "src/components/Shareable/ModalAprovarGenericoSimOpcional";
import { ehUsuarioEmpresa } from "src/helpers/utilities";

const Relatorio = (props) => {
  const [estado, setEstado] = useState({
    uuid: null,
    showNaoAprovaModal: false,
    showAutorizarModal: false,
    showModal: false,
    meusDados: null,
    prazoDoPedidoMensagem: "",
    resposta_sim_nao: null,
    showModalMarcarConferencia: false,
  });
  const [solicitacaoKitLanche, setSolicitacaoKitLanche] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const tipoSolicitacao = urlParams.get("tipoSolicitacao");

    let newState = { ...estado };

    Promise.all([
      meusDados(),
      uuid && tipoSolicitacao
        ? getDetalheKitLancheAvulsa(uuid, tipoSolicitacao)
        : Promise.resolve(),
    ]).then(([dadosResponse, detalheResponse]) => {
      if (dadosResponse) {
        newState = { ...newState, meusDados: dadosResponse };
      } else {
        newState = { ...newState, erro: true };
        toastError("Erro ao carregar dados do usuário");
      }

      if (detalheResponse) {
        let _response = deepCopy(detalheResponse);
        let solicitacoes_similares = _response.solicitacoes_similares.map(
          (s) => {
            s["collapsed"] = true;
            return s;
          },
        );
        _response["solicitacoes_similares"] = solicitacoes_similares;
        setSolicitacaoKitLanche(_response);
        newState = {
          ...newState,
          uuid,
          tipoSolicitacao,
          prazoDoPedidoMensagem: prazoDoPedidoMensagem(
            detalheResponse.prioridade,
          ),
        };
      }
      setEstado(newState);
    });
  }, []);

  const showQuestionamentoModal = (resposta_sim_nao) => {
    setEstado({ ...estado, resposta_sim_nao, showQuestionamentoModal: true });
  };

  const closeQuestionamentoModal = () => {
    setEstado({ ...estado, showQuestionamentoModal: false });
  };

  const showNaoAprovaModal = (resposta_sim_nao) => {
    setEstado((prevState) => ({
      ...prevState,
      resposta_sim_nao,
      showNaoAprovaModal: true,
    }));
  };

  const closeNaoAprovaModal = () => {
    setEstado((prevState) => ({ ...prevState, showNaoAprovaModal: false }));
  };

  const showAutorizarModal = () => {
    setEstado({ ...estado, showAutorizarModal: true });
  };

  const closeAutorizarModal = () => {
    setEstado({ ...estado, showAutorizarModal: false });
  };

  const showModalMarcarConferencia = () => {
    setEstado({ ...estado, showModalMarcarConferencia: true });
  };

  const closeModalMarcarConferencia = () => {
    setEstado({ ...estado, showModalMarcarConferencia: false });
  };

  const showModalObservacaoCodae = () => {
    setEstado({ ...estado, showModalObservacaoCodae: true });
  };

  const closeModalObservacaoCodae = () => {
    setEstado({ ...estado, showModalObservacaoCodae: false });
  };

  const loadSolicitacao = (uuid) => {
    getDetalheKitLancheAvulsa(uuid, estado.tipoSolicitacao).then((response) => {
      setSolicitacaoKitLanche(response);
    });
  };

  const onSubmitForm = () => {
    const { toastAprovaMensagem, toastAprovaMensagemErro, justificativa } =
      props;
    const uuid = estado.uuid;
    const tipoSolicitacao = estado.tipoSolicitacao;
    props.endpointAprovaSolicitacao(uuid, justificativa, tipoSolicitacao).then(
      (response) => {
        if (response.status === HTTP_STATUS.OK) {
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

  const {
    visao,
    motivo_cancelamento,
    endpointAprovaSolicitacao,
    motivosDREnaoValida,
    justificativa,
    textoBotaoNaoAprova,
    textoBotaoAprova,
    endpointNaoAprovaSolicitacao,
    endpointQuestionamento,
    ModalNaoAprova,
    ModalQuestionamento,
  } = props;

  const tipoPerfil = localStorage.getItem("tipo_perfil");

  const EXIBIR_BOTAO_NAO_APROVAR =
    tipoPerfil !== TIPO_PERFIL.TERCEIRIZADA ||
    (solicitacaoKitLanche &&
      solicitacaoKitLanche.prioridade !== "REGULAR" &&
      solicitacaoKitLanche.status === statusEnum.CODAE_QUESTIONADO &&
      textoBotaoNaoAprova);

  // TODO:  Rever se essa lógica ainda está sendo usada
  const EXIBIR_BOTAO_APROVAR =
    (![
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) &&
      textoBotaoAprova) ||
    (solicitacaoKitLanche &&
      (solicitacaoKitLanche.prioridade === "REGULAR" ||
        [
          statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
          statusEnum.CODAE_AUTORIZADO,
        ].includes(solicitacaoKitLanche.status)) &&
      textoBotaoAprova);

  const EXIBIR_BOTAO_QUESTIONAMENTO =
    [
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) &&
    solicitacaoKitLanche &&
    (solicitacaoKitLanche.prioridade !== "REGULAR" ||
      (visao === CODAE && solicitacaoKitLanche.prioridade !== "REGULAR")) &&
    [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
      solicitacaoKitLanche.status,
    );

  const EXIBIR_MODAL_AUTORIZACAO =
    visao === CODAE &&
    solicitacaoKitLanche &&
    solicitacaoKitLanche.prioridade !== "REGULAR" &&
    !solicitacaoKitLanche.logs[solicitacaoKitLanche.logs.length - 1]
      .resposta_sim_nao;

  const EXIBIR_BOTAO_MARCAR_CONFERENCIA =
    !ehUsuarioEmpresa() &&
    visao === TERCEIRIZADA &&
    solicitacaoKitLanche &&
    [statusEnum.CODAE_AUTORIZADO, statusEnum.ESCOLA_CANCELOU].includes(
      solicitacaoKitLanche.status,
    );

  const BotaoMarcarConferencia = () => {
    return (
      <Botao
        texto="Marcar Conferência"
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN}
        className="ms-3"
        onClick={() => {
          showModalMarcarConferencia();
        }}
      />
    );
  };
  return (
    <Form
      onSubmit={onSubmitForm}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="report">
            {ModalNaoAprova && (
              <ModalNaoAprova
                showModal={estado.showNaoAprovaModal}
                closeModal={closeNaoAprovaModal}
                endpoint={endpointNaoAprovaSolicitacao}
                solicitacao={solicitacaoKitLanche}
                loadSolicitacao={loadSolicitacao}
                justificativa={justificativa}
                resposta_sim_nao={estado.resposta_sim_nao}
                motivosDREnaoValida={motivosDREnaoValida}
                motivoCancelamento={motivo_cancelamento}
                uuid={estado.uuid}
                tipoSolicitacao={estado.tipoSolicitacao}
              />
            )}
            {ModalQuestionamento && (
              <ModalQuestionamento
                closeModal={closeQuestionamentoModal}
                showModal={estado.showQuestionamentoModal}
                justificativa={justificativa}
                uuid={estado.uuid}
                loadSolicitacao={loadSolicitacao}
                resposta_sim_nao={estado.resposta_sim_nao}
                endpoint={endpointQuestionamento}
                tipoSolicitacao={estado.tipoSolicitacao}
              />
            )}
            {solicitacaoKitLanche && (
              <ModalMarcarConferencia
                showModal={estado.showModalMarcarConferencia}
                closeModal={() => closeModalMarcarConferencia()}
                onMarcarConferencia={() => {
                  loadSolicitacao(estado.uuid);
                }}
                uuid={solicitacaoKitLanche.uuid}
                endpoint={
                  estado.tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI
                    ? "solicitacoes-kit-lanche-cei-avulsa"
                    : "solicitacoes-kit-lanche-avulsa"
                }
              />
            )}
            {!solicitacaoKitLanche ? (
              <div>Carregando...</div>
            ) : (
              <form onSubmit={props.handleSubmit}>
                {endpointAprovaSolicitacao && (
                  <ModalAutorizarAposQuestionamento
                    showModal={estado.showAutorizarModal}
                    loadSolicitacao={loadSolicitacao}
                    justificativa={justificativa}
                    closeModal={closeAutorizarModal}
                    endpoint={endpointAprovaSolicitacao}
                    uuid={estado.uuid}
                    tipoSolicitacao={estado.tipoSolicitacao}
                  />
                )}
                <span className="page-title">{`Kit Lanche Passeio - Solicitação # ${solicitacaoKitLanche.id_externo}`}</span>
                <div className="card mt-3">
                  <div className="card-body">
                    <CorpoRelatorio
                      solicitacaoKitLanche={solicitacaoKitLanche}
                      solicitacoesSimilares={
                        solicitacaoKitLanche.solicitacoes_similares
                      }
                      prazoDoPedidoMensagem={estado.prazoDoPedidoMensagem}
                      tipoSolicitacao={estado.tipoSolicitacao}
                      meusDados={meusDados}
                    />
                    <RelatorioHistoricoJustificativaEscola
                      solicitacao={solicitacaoKitLanche}
                    />
                    <RelatorioHistoricoQuestionamento
                      solicitacao={solicitacaoKitLanche}
                    />
                    {visualizaBotoesDoFluxo(solicitacaoKitLanche) && (
                      <div className="row mt-4 me-2">
                        <div className="col-12 text-end">
                          {EXIBIR_BOTAO_NAO_APROVAR && (
                            <Botao
                              texto={textoBotaoNaoAprova}
                              className="custom-col-width ms-3"
                              onClick={() => showNaoAprovaModal("Não")}
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                            />
                          )}

                          {EXIBIR_BOTAO_APROVAR &&
                            textoBotaoAprova !== "Ciente" &&
                            (visao === CODAE &&
                            solicitacaoKitLanche.logs.filter(
                              (log) =>
                                log.status_evento_explicacao ===
                                  "Terceirizada respondeu questionamento" &&
                                !log.resposta_sim_nao,
                            ).length > 0 ? null : (
                              <Botao
                                texto={textoBotaoAprova}
                                type={BUTTON_TYPE.BUTTON}
                                onClick={() =>
                                  EXIBIR_MODAL_AUTORIZACAO
                                    ? showAutorizarModal()
                                    : tipoPerfil ===
                                        TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
                                      ? showModalObservacaoCodae()
                                      : handleSubmit()
                                }
                                style={BUTTON_STYLE.GREEN}
                                className="custom-col-width ms-3"
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
                              onClick={() => showQuestionamentoModal("Sim")}
                              style={BUTTON_STYLE.GREEN}
                              className="ms-3"
                            />
                          )}
                          {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
                            <div className="form-group float-end mt-4">
                              {solicitacaoKitLanche.terceirizada_conferiu_gestao ? (
                                <label className="ms-3 conferido">
                                  <i className="fas fa-check me-2" />
                                  Solicitação Conferida
                                </label>
                              ) : (
                                <BotaoMarcarConferencia
                                  uuid={solicitacaoKitLanche.uuid}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <ModalAprovarGenericoSimOpcional
                  showModal={estado.showModalObservacaoCodae}
                  loadSolicitacao={() => loadSolicitacao(estado.uuid)}
                  justificativa={justificativa}
                  closeModal={() => closeModalObservacaoCodae()}
                  endpoint={endpointAprovaSolicitacao}
                  uuid={estado.uuid}
                  tipoSolicitacao={estado.tipoSolicitacao}
                />
              </form>
            )}
          </div>
        </form>
      )}
    />
  );
};

export default Relatorio;
