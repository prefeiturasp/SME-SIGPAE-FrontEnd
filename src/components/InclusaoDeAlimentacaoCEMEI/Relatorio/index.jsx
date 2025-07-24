import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import {
  exibeBotaoAprovar,
  exibeBotaoNaoAprovar,
  exibirBotaoMarcarConferencia,
  exibirBotaoQuestionamento,
} from "src/components/GestaoDeAlimentacao/Relatorios/logicaExibirBotoes.helper";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import ModalMarcarConferencia from "src/components/Shareable/ModalMarcarConferencia";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { DRE } from "src/configs/constants";
import { TIPO_PERFIL } from "src/constants/shared";
import { visualizaBotoesDoFluxo } from "src/helpers/utilities";
import {
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
  getVinculosTipoAlimentacaoPorEscola,
} from "src/services/cadastroTipoAlimentacao.service";
import { getInclusaoCEMEI } from "src/services/inclusaoDeAlimentacao";
import { CorpoRelatorio } from "./componentes/CorpoRelatorio";

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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    const response = await getInclusaoCEMEI(uuid_);
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacao(response.data);
      if (!vinculos) {
        getVinculosTipoAlimentacaoPorEscolaAsync(response.data);
      }
    }
    setIsSubmitting(false);
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    const response = await endpointAprovaSolicitacao(
      uuid,
      values.justificativa,
      tipoSolicitacao
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess(toastAprovaMensagem);
      getInclusaoCEMEIAsync();
    } else {
      toastError(toastAprovaMensagemErro);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setUuid(urlParams.get("uuid"));
    getInclusaoCEMEIAsync(urlParams.get("uuid"));
  }, []);

  const tipoPerfil = localStorage.getItem("tipo_perfil");

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
                          {exibeBotaoNaoAprovar(
                            solicitacao,
                            textoBotaoNaoAprova
                          ) && (
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
                          {exibirBotaoQuestionamento(
                            solicitacao,
                            visao,
                            tipoPerfil
                          ) && (
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
                          {exibeBotaoAprovar(
                            solicitacao,
                            visao,
                            textoBotaoAprova
                          ) && (
                            <Botao
                              texto={textoBotaoAprova}
                              type={BUTTON_TYPE.BUTTON}
                              onClick={() =>
                                visao === DRE
                                  ? handleSubmit()
                                  : setShowModalCodaeAutorizar(true)
                              }
                              disabled={isSubmitting}
                              style={BUTTON_STYLE.GREEN}
                              className="ms-3"
                            />
                          )}
                          {exibirBotaoMarcarConferencia(solicitacao, visao) && (
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
                                  disabled={isSubmitting}
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
