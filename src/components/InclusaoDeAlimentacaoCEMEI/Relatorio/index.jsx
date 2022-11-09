import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { getInclusaoCEMEI } from "services/inclusaoDeAlimentacao";
import { CorpoRelatorio } from "./componentes/CorpoRelatorio";
import { getVinculosTipoAlimentacaoPorEscola } from "services/cadastroTipoAlimentacao.service";
import {
  justificativaAoNegarSolicitacao,
  visualizaBotoesDoFluxo
} from "helpers/utilities";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { statusEnum, TIPO_PERFIL } from "constants/shared";
import { CODAE, TERCEIRIZADA } from "configs/constants";
import RelatorioHistoricoJustificativaEscola from "components/Shareable/RelatorioHistoricoJustificativaEscola";
import { Form } from "react-final-form";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import RelatorioHistoricoQuestionamento from "components/Shareable/RelatorioHistoricoQuestionamento";
import ModalMarcarConferencia from "components/Shareable/ModalMarcarConferencia";

export const RelatorioInclusaoDeAlimentacaoCEMEI = ({ ...props }) => {
  const [uuid, setUuid] = useState(null);
  const [solicitacao, setSolicitacao] = useState(null);
  const [vinculos, setVinculos] = useState(null);
  const [respostaSimNao, setRespostaSimNao] = useState(null);
  const [showNaoAprovaModal, setShowNaoAprovaModal] = useState(false);
  const [showQuestionamentoModal, setShowQuestionamentoModal] = useState(false);
  const [showModalMarcarConferencia, setShowModalMarcarConferencia] = useState(
    false
  );

  const {
    endpointAprovaSolicitacao,
    endpointNaoAprovaSolicitacao,
    endpointQuestionamento,
    motivosDREnaoValida,
    ModalNaoAprova,
    ModalQuestionamento,
    textoBotaoAprova,
    textoBotaoNaoAprova,
    visao,
    tipoSolicitacao,
    toastAprovaMensagem,
    toastAprovaMensagemErro
  } = props;

  const justificativaNegacao =
    solicitacao && justificativaAoNegarSolicitacao(solicitacao.logs);

  const getVinculosTipoAlimentacaoPorEscolaAsync = async escola => {
    const response = await getVinculosTipoAlimentacaoPorEscola(escola.uuid);
    if (response.status === HTTP_STATUS.OK) {
      setVinculos(response.data.results);
    }
  };

  const getInclusaoCEMEIAsync = async (uuid_ = uuid) => {
    const response = await getInclusaoCEMEI(uuid_);
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacao(response.data);
      if (!vinculos) {
        getVinculosTipoAlimentacaoPorEscolaAsync(response.data.escola);
      }
    }
  };

  const onSubmit = values => {
    endpointAprovaSolicitacao(uuid, values.justificativa, tipoSolicitacao).then(
      response => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess(toastAprovaMensagem);
          getInclusaoCEMEIAsync();
        } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(toastAprovaMensagemErro);
        }
      },
      function() {
        toastError(toastAprovaMensagemErro);
      }
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setUuid(urlParams.get("uuid"));
    getInclusaoCEMEIAsync(urlParams.get("uuid"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const EXIBIR_BOTAO_NAO_APROVAR =
    visao !== TERCEIRIZADA ||
    (solicitacao &&
      solicitacao.prioridade !== "REGULAR" &&
      solicitacao.status === statusEnum.CODAE_QUESTIONADO &&
      textoBotaoNaoAprova);

  const tipoPerfil = localStorage.getItem("tipo_perfil");
  const EXIBIR_BOTAO_APROVAR =
    (![
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA
    ].includes(tipoPerfil) &&
      textoBotaoAprova) ||
    (solicitacao &&
      (solicitacao.prioridade === "REGULAR" ||
        [
          statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
          statusEnum.CODAE_AUTORIZADO
        ].includes(solicitacao.status)) &&
      textoBotaoAprova);

  const EXIBIR_BOTAO_QUESTIONAMENTO =
    [
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA
    ].includes(tipoPerfil) &&
    solicitacao &&
    (solicitacao.prioridade !== "REGULAR" ||
      (visao === CODAE && solicitacao.prioridade !== "REGULAR")) &&
    [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
      solicitacao.status
    );
  const EXIBIR_BOTAO_MARCAR_CONFERENCIA =
    visao === TERCEIRIZADA &&
    solicitacao &&
    [statusEnum.CODAE_AUTORIZADO, statusEnum.ESCOLA_CANCELOU].includes(
      solicitacao.status
    );

  return (
    <Spin tip="Carregando..." spinning={!solicitacao || !vinculos}>
      {solicitacao && vinculos && (
        <Form onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="report">
                <span className="page-title">{`Inclusão de Alimentação - Solicitação # ${
                  solicitacao.id_externo
                }`}</span>
                <div className="card mt-3">
                  <div className="card-body">
                    <CorpoRelatorio
                      solicitacao={solicitacao}
                      vinculos={vinculos}
                    />
                    {visualizaBotoesDoFluxo(solicitacao) && (
                      <div className="row">
                        <div className="col-12 text-right">
                          {EXIBIR_BOTAO_NAO_APROVAR && (
                            <Botao
                              texto={textoBotaoNaoAprova}
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                              onClick={() => {
                                setRespostaSimNao("Não");
                                setShowNaoAprovaModal(true);
                              }}
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
                              type={BUTTON_TYPE.BUTTON}
                              onClick={() => {
                                setRespostaSimNao("Sim");
                                setShowQuestionamentoModal(true);
                              }}
                              style={BUTTON_STYLE.GREEN}
                              className="ml-3"
                            />
                          )}
                          {EXIBIR_BOTAO_APROVAR &&
                            (textoBotaoAprova !== "Ciente" &&
                              (visao === CODAE &&
                                solicitacao.logs.filter(
                                  log =>
                                    log.status_evento_explicacao ===
                                      "Terceirizada respondeu questionamento" &&
                                    log.resposta_sim_nao
                                ).length > 0 && (
                                  <Botao
                                    texto={textoBotaoAprova}
                                    type={BUTTON_TYPE.SUBMIT}
                                    style={BUTTON_STYLE.GREEN}
                                    className="ml-3"
                                  />
                                )))}
                          {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
                            <div className="form-group float-right mt-4">
                              {solicitacao.terceirizada_conferiu_gestao ? (
                                <label className="ml-3 conferido">
                                  <i className="fas fa-check mr-2" />
                                  Solicitação Conferida
                                </label>
                              ) : (
                                <Botao
                                  texto="Marcar Conferência"
                                  type={BUTTON_TYPE.BUTTON}
                                  style={BUTTON_STYLE.GREEN}
                                  className="ml-3"
                                  onClick={() => {
                                    setShowModalMarcarConferencia(true);
                                  }}
                                />
                              )}
                            </div>
                          )}
                          <ModalMarcarConferencia
                            showModal={showModalMarcarConferencia}
                            closeModal={() =>
                              setShowModalMarcarConferencia(false)
                            }
                            onMarcarConferencia={() => {
                              getInclusaoCEMEIAsync();
                            }}
                            uuid={solicitacao.uuid}
                            endpoint={"inclusao-alimentacao-cemei"}
                          />
                          {ModalNaoAprova && (
                            <ModalNaoAprova
                              showModal={showNaoAprovaModal}
                              closeModal={() => setShowNaoAprovaModal(false)}
                              motivosDREnaoValida={motivosDREnaoValida}
                              endpoint={endpointNaoAprovaSolicitacao}
                              uuid={solicitacao.uuid}
                              solicitacao={solicitacao}
                              resposta_sim_nao={respostaSimNao}
                              loadSolicitacao={getInclusaoCEMEIAsync}
                              tipoSolicitacao={tipoSolicitacao}
                            />
                          )}
                          {ModalQuestionamento && (
                            <ModalQuestionamento
                              closeModal={() =>
                                setShowQuestionamentoModal(false)
                              }
                              showModal={showQuestionamentoModal}
                              loadSolicitacao={getInclusaoCEMEIAsync}
                              resposta_sim_nao={respostaSimNao}
                              endpoint={endpointQuestionamento}
                              tipoSolicitacao={tipoSolicitacao}
                              solicitacao={solicitacao}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {solicitacao.dias_motivos_da_inclusao_cemei.find(
                      inclusao => inclusao.cancelado
                    ) && (
                      <>
                        <hr />
                        <p>
                          <strong>Histórico de cancelamento parcial</strong>
                          {solicitacao.dias_motivos_da_inclusao_cemei
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
                    {justificativaNegacao && (
                      <div className="row">
                        <div className="col-12 report-label-value">
                          <p>Justificativa da negação</p>
                          <p
                            className="value"
                            dangerouslySetInnerHTML={{
                              __html: justificativaNegacao
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <RelatorioHistoricoJustificativaEscola
                      solicitacao={solicitacao}
                    />
                    <RelatorioHistoricoQuestionamento
                      solicitacao={solicitacao}
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </Form>
      )}
    </Spin>
  );
};
