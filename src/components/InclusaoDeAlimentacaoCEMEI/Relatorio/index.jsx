import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { getInclusaoCEMEI } from "services/inclusaoDeAlimentacao";
import { CorpoRelatorio } from "./componentes/CorpoRelatorio";
import {
  getVinculosTipoAlimentacaoPorEscola,
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
} from "services/cadastroTipoAlimentacao.service";
import { visualizaBotoesDoFluxo } from "helpers/utilities";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { statusEnum, TIPO_PERFIL } from "constants/shared";
import { CODAE, DRE, TERCEIRIZADA } from "configs/constants";
import { Form } from "react-final-form";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import ModalMarcarConferencia from "components/Shareable/ModalMarcarConferencia";

export const RelatorioInclusaoDeAlimentacaoCEMEI = ({ ...props }) => {
  const [uuid, setUuid] = useState(null);
  const [solicitacao, setSolicitacao] = useState(null);
  const [vinculos, setVinculos] = useState(null);
  const [respostaSimNao, setRespostaSimNao] = useState(null);
  const [showNaoAprovaModal, setShowNaoAprovaModal] = useState(false);
  const [showQuestionamentoModal, setShowQuestionamentoModal] = useState(false);
  const [showModalMarcarConferencia, setShowModalMarcarConferencia] =
    useState(false);
  const [showModalCodaeAutorizar, setShowModalCodaeAutorizar] = useState(false);
  const [vinculosMotivoEspecifico, setVinculosMotivoEspecifico] =
    useState(null);
  const [ehMotivoEspecifico, setEhMotivoEspecifico] = useState(false);

  const {
    endpointAprovaSolicitacao,
    endpointNaoAprovaSolicitacao,
    endpointQuestionamento,
    motivosDREnaoValida,
    ModalNaoAprova,
    ModalQuestionamento,
    ModalCodaeAutoriza,
    textoBotaoAprova,
    textoBotaoNaoAprova,
    visao,
    tipoSolicitacao,
    toastAprovaMensagem,
    toastAprovaMensagemErro,
  } = props;

  const getVinculosMotivoEspecificoCEMEIAsync = async (
    escola,
    periodosNormais
  ) => {
    const tipo_unidade_escolar_iniciais = escola.tipo_unidade.iniciais;
    const response = await getVinculosTipoAlimentacaoMotivoInclusaoEspecifico({
      tipo_unidade_escolar_iniciais,
    });
    if (response.status === HTTP_STATUS.OK) {
      let periodosMotivoInclusaoEspecifico = [];
      response.data.forEach((vinculo) => {
        let periodo = vinculo.periodo_escolar;
        let tipos_de_alimentacao = vinculo.tipos_alimentacao;
        let periodoNormal = periodosNormais.find(
          (p) => periodo.nome === p.periodo_escolar.nome
        );
        if (!periodoNormal) {
          periodoNormal = periodosNormais.find(
            (p) => p.periodo_escolar.nome === "INTEGRAL"
          );
          tipos_de_alimentacao = response.data.find(
            (p) => p.periodo_escolar.nome === "INTEGRAL"
          ).tipos_alimentacao;
        }
        periodo.tipos_alimentacao = tipos_de_alimentacao;
        periodo.maximo_alunos = null;
        periodosMotivoInclusaoEspecifico.push(periodo);
      });
      const periodosOrdenados = periodosMotivoInclusaoEspecifico.sort(
        (obj1, obj2) => (obj1.posicao > obj2.posicao ? 1 : -1)
      );
      setVinculosMotivoEspecifico(periodosOrdenados);
    }
  };

  const getVinculosTipoAlimentacaoPorEscolaAsync = async (inclusao) => {
    const response = await getVinculosTipoAlimentacaoPorEscola(
      inclusao.escola.uuid
    );
    if (response.status === HTTP_STATUS.OK) {
      const diasMotivos = inclusao.dias_motivos_da_inclusao_cemei;
      const temMotivoEspecifico = diasMotivos.some((dm) =>
        dm.motivo.nome.includes("Específico")
      );
      if (temMotivoEspecifico) {
        setEhMotivoEspecifico(true);
        const periodosEMEI = response.data.results.filter(
          (r) => r.tipo_unidade_escolar.iniciais === "EMEI"
        );
        await getVinculosMotivoEspecificoCEMEIAsync(
          inclusao.escola,
          periodosEMEI
        );
      }
      setVinculos(response.data.results);
    }
  };

  const getInclusaoCEMEIAsync = async (uuid_ = uuid) => {
    const response = await getInclusaoCEMEI(uuid_);
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacao(response.data);
      if (!vinculos) {
        getVinculosTipoAlimentacaoPorEscolaAsync(response.data);
      }
    }
  };

  const onSubmit = (values) => {
    endpointAprovaSolicitacao(uuid, values.justificativa, tipoSolicitacao).then(
      (response) => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess(toastAprovaMensagem);
          getInclusaoCEMEIAsync();
        } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(toastAprovaMensagemErro);
        }
      },
      function () {
        toastError(toastAprovaMensagemErro);
      }
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setUuid(urlParams.get("uuid"));
    getInclusaoCEMEIAsync(urlParams.get("uuid"));
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
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) &&
      textoBotaoAprova) ||
    (solicitacao &&
      (solicitacao.prioridade === "REGULAR" ||
        [
          statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
          statusEnum.CODAE_AUTORIZADO,
        ].includes(solicitacao.status)) &&
      textoBotaoAprova);

  const EXIBIR_BOTAO_QUESTIONAMENTO =
    [
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
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
                <span className="page-title">{`Inclusão de Alimentação - Solicitação # ${solicitacao.id_externo}`}</span>
                <div className="card mt-3">
                  <div className="card-body">
                    <CorpoRelatorio
                      solicitacao={solicitacao}
                      solicitacoesSimilares={solicitacao.solicitacoes_similares}
                      vinculos={
                        ehMotivoEspecifico ? vinculosMotivoEspecifico : vinculos
                      }
                      ehMotivoEspecifico={ehMotivoEspecifico}
                    />
                    {visualizaBotoesDoFluxo(solicitacao) && (
                      <div className="row">
                        <div className="col-12 text-end">
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
                              className="ms-3"
                            />
                          )}
                          {EXIBIR_BOTAO_APROVAR &&
                            textoBotaoAprova !== "Ciente" &&
                            (visao === CODAE &&
                            solicitacao.logs.filter(
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
                                    ? handleSubmit()
                                    : setShowModalCodaeAutorizar(true)
                                }
                                style={BUTTON_STYLE.GREEN}
                                className="ms-3"
                              />
                            ))}
                          {EXIBIR_BOTAO_MARCAR_CONFERENCIA && (
                            <div className="form-group float-end mt-4">
                              {solicitacao.terceirizada_conferiu_gestao ? (
                                <label className="ms-3 conferido">
                                  <i className="fas fa-check me-2" />
                                  Solicitação Conferida
                                </label>
                              ) : (
                                <Botao
                                  texto="Marcar Conferência"
                                  type={BUTTON_TYPE.BUTTON}
                                  style={BUTTON_STYLE.GREEN}
                                  className="ms-3"
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
                          {ModalCodaeAutoriza && (
                            <ModalCodaeAutoriza
                              showModal={showModalCodaeAutorizar}
                              loadSolicitacao={getInclusaoCEMEIAsync}
                              closeModal={() =>
                                setShowModalCodaeAutorizar(false)
                              }
                              endpoint={endpointAprovaSolicitacao}
                              uuid={uuid}
                              ehInclusao={true}
                              tipoSolicitacao={tipoSolicitacao}
                            />
                          )}
                        </div>
                      </div>
                    )}
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
