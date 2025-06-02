import { Spin } from "antd";
import {
  exibeBotaoAprovar,
  exibeBotaoNaoAprovar,
  exibirBotaoMarcarConferencia,
  exibirBotaoQuestionamento,
  exibirModalAutorizacaoAposQuestionamento,
} from "components/GestaoDeAlimentacao/Relatorios/logicaExibirBotoes.helper";
import { Botao } from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import ModalAutorizarAposQuestionamento from "components/Shareable/ModalAutorizarAposQuestionamento";
import ModalMarcarConferencia from "components/Shareable/ModalMarcarConferencia";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { DRE } from "configs/constants";
import { TIPO_PERFIL } from "constants/shared";
import { visualizaBotoesDoFluxo } from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { getAlteracaoCEMEI } from "services/alteracaoDeCardapio";
import { getQuantidadeAlunosCEMEIporCEIEMEI } from "services/aluno.service";
import { formataDadosTabelaCEMEI } from "../helpers";
import { CorpoRelatorio } from "./componentes/CorpoRelatorio";
import "./style.scss";

export const Relatorio = ({ ...props }) => {
  const {
    endpointAprovaSolicitacao,
    endpointNaoAprovaSolicitacao,
    endpointQuestionamento,
    motivosDREnaoValida,
    ModalNaoAprova,
    ModalQuestionamento,
    textoBotaoAprova,
    textoBotaoNaoAprova,
    tipoSolicitacao,
    toastAprovaMensagem,
    toastAprovaMensagemErro,
    ModalCODAEAutoriza,
    visao,
  } = props;

  const [solicitacao, setSolicitacao] = useState(undefined);
  const [matriculados, setMatriculados] = useState(undefined);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [respostaSimNao, setRespostaSimNao] = useState(null);
  const [showNaoAprovaModal, setShowNaoAprovaModal] = useState(false);
  const [showQuestionamentoModal, setShowQuestionamentoModal] = useState(false);
  const [showModalMarcarConferencia, setShowModalMarcarConferencia] =
    useState(false);
  const [uuid, setUuid] = useState(null);
  const [showAutorizarModal, setShowAutorizarModal] = useState(false);
  const [showModalCodaeAutorizar, setShowModalCodaeAutorizar] = useState(false);

  const [justificativaCancelamentoEscola, setJustificativaCancelamentoEscola] =
    useState(undefined);

  const getMatriculados = async (codigo_eol) => {
    const response = await getQuantidadeAlunosCEMEIporCEIEMEI(codigo_eol);
    if (response.status === HTTP_STATUS.OK) {
      setMatriculados(response.data);
    }
  };

  const getSolicitacao = async (uuid_ = uuid) => {
    const response = await getAlteracaoCEMEI(uuid_);
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacao(response.data);
      setDadosTabela(formataDadosTabelaCEMEI(response.data));
      getMatriculados(response.data.escola.codigo_eol);
      const logCancelamentoEscola = response.data.logs.filter(
        (log) => log.status_evento_explicacao === "Escola cancelou"
      );
      setJustificativaCancelamentoEscola(logCancelamentoEscola);
    }
  };

  const tipoPerfil = localStorage.getItem("tipo_perfil");

  const onSubmit = async (values) => {
    endpointAprovaSolicitacao(uuid, values, tipoSolicitacao).then(
      (response) => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess(toastAprovaMensagem);
          getSolicitacao();
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
    getSolicitacao(urlParams.get("uuid"));
  }, []);

  return (
    <Spin
      tip="Carregando..."
      spinning={!solicitacao || !dadosTabela || !matriculados}
    >
      {solicitacao && dadosTabela && matriculados && (
        <>
          <Form onSubmit={onSubmit}>
            {({ handleSubmit, submitting, values }) => (
              <form onSubmit={handleSubmit}>
                {endpointAprovaSolicitacao && (
                  <ModalAutorizarAposQuestionamento
                    showModal={showAutorizarModal}
                    loadSolicitacao={getSolicitacao}
                    closeModal={() => setShowAutorizarModal(false)}
                    endpoint={endpointAprovaSolicitacao}
                    uuid={uuid}
                    tipoSolicitacao={tipoSolicitacao}
                  />
                )}
                {ModalCODAEAutoriza && (
                  <ModalCODAEAutoriza
                    showModal={showModalCodaeAutorizar}
                    loadSolicitacao={getSolicitacao}
                    closeModal={() => setShowModalCodaeAutorizar(false)}
                    endpoint={endpointAprovaSolicitacao}
                    uuid={uuid}
                    ehInclusao={true}
                    tipoSolicitacao={tipoSolicitacao}
                  />
                )}
                <span className="page-title">{`Alteração do Tipo de Alimentação - Solicitação # ${solicitacao.id_externo}`}</span>
                <div className="card style-padrao-inclusao-cei mt-3">
                  <div className="card-body">
                    <CorpoRelatorio
                      solicitacao={solicitacao}
                      dadosTabela={dadosTabela}
                      matriculados={matriculados}
                      justificativaCancelamentoEscola={
                        justificativaCancelamentoEscola
                      }
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
                                  ? onSubmit(values)
                                  : exibirModalAutorizacaoAposQuestionamento(
                                      solicitacao,
                                      visao
                                    )
                                  ? setShowAutorizarModal(true)
                                  : setShowModalCodaeAutorizar(true)
                              }
                              disabled={submitting}
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
                              getSolicitacao();
                            }}
                            uuid={solicitacao.uuid}
                            endpoint={"alteracoes-cardapio-cemei"}
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
                              loadSolicitacao={getSolicitacao}
                              tipoSolicitacao={tipoSolicitacao}
                            />
                          )}
                          {ModalQuestionamento && (
                            <ModalQuestionamento
                              closeModal={() =>
                                setShowQuestionamentoModal(false)
                              }
                              showModal={showQuestionamentoModal}
                              loadSolicitacao={getSolicitacao}
                              resposta_sim_nao={respostaSimNao}
                              endpoint={endpointQuestionamento}
                              tipoSolicitacao={tipoSolicitacao}
                              solicitacao={solicitacao}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
          </Form>
        </>
      )}
    </Spin>
  );
};
