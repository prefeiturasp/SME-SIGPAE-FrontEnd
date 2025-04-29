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
import RelatorioHistoricoJustificativaEscola from "components/Shareable/RelatorioHistoricoJustificativaEscola";
import RelatorioHistoricoQuestionamento from "components/Shareable/RelatorioHistoricoQuestionamento";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { DRE } from "configs/constants";
import { statusEnum, TIPO_PERFIL, TIPO_SOLICITACAO } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import {
  prazoDoPedidoMensagem,
  visualizaBotoesDoFluxo,
} from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useContext, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { getAlteracaoCardapio } from "services/alteracaoDeCardapio";
import { CorpoRelatorio } from "./componentes/CorpoRelatorio";

export const Relatorio = ({ ...props }) => {
  const { meusDados } = useContext(MeusDadosContext);

  const [uuid, setUuid] = useState();
  const [tipoSolicitacao, setTipoSolicitacao] = useState();
  const [alteracaoDoTipoDeAlimentacao, setAlteracaoDoTipoDeAlimentacao] =
    useState();
  const [prazoMensagem, setPrazoMensagem] = useState();
  const [respostaSimNao, setRespostaSimNao] = useState();

  const [showNaoAprovaModal, setShowNaoAprovaModal] = useState(false);
  const [showAutorizarModal, setShowAutorizarModal] = useState(false);
  const [showModalCodaeAutorizar, setShowModalCodaeAutorizar] = useState(false);
  const [showModalMarcarConferencia, setShowModalMarcarConferencia] =
    useState(false);
  const [showQuestionamentoModal, setShowQuestionamentoModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const {
    endpointAprovaSolicitacao,
    visao,
    textoBotaoNaoAprova,
    textoBotaoAprova,
    endpointNaoAprovaSolicitacao,
    endpointQuestionamento,
    ModalNaoAprova,
    ModalQuestionamento,
    motivosDREnaoValida,
    ModalCODAEAutoriza,
    toastAprovaMensagem,
    toastAprovaMensagemErro,
  } = props;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid_ = urlParams.get("uuid");
    const tipoSolicitacao_ = urlParams.get("tipoSolicitacao");

    if (!uuid_) {
      setErro(
        "Parâmetro `uuid` é obrigatório na URL para carregar a página corretamente."
      );
      return;
    }

    if (!tipoSolicitacao_) {
      setErro(
        "Parâmetro `tipoSolicitacao` é obrigatório na URL para carregar a página corretamente."
      );
      return;
    }

    setUuid(uuid_);
    setTipoSolicitacao(tipoSolicitacao_);
    getSolicitacaoAsync(uuid_, tipoSolicitacao_);
  }, []);

  const getSolicitacaoAsync = async (
    uuid_ = uuid,
    tipoSolicitacao_ = tipoSolicitacao
  ) => {
    setLoading(true);
    const response = await getAlteracaoCardapio(uuid_, tipoSolicitacao_);
    if (response.status === HTTP_STATUS.OK) {
      setAlteracaoDoTipoDeAlimentacao(response.data);
      setPrazoMensagem(prazoDoPedidoMensagem(response.data.prioridade));
    } else {
      setErro(
        "Erro ao carregar Alteração do tipo de alimentação. Tente novamente mais tarde."
      );
    }
    setLoading(false);
  };

  const BotaoMarcarConferencia = () => {
    return (
      <Botao
        texto="Marcar Conferência"
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN}
        className="ms-3"
        onClick={() => {
          setShowModalMarcarConferencia(true);
        }}
        disabled={loading}
      />
    );
  };

  const onSubmit = async (values) => {
    const response = await endpointAprovaSolicitacao(
      uuid,
      values.justificativa,
      tipoSolicitacao
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess(toastAprovaMensagem);
      getSolicitacaoAsync();
    } else {
      toastError(toastAprovaMensagemErro);
    }
  };

  const tipoPerfil = localStorage.getItem("tipo_perfil");

  return (
    <div className="report">
      {ModalNaoAprova && showNaoAprovaModal && (
        <ModalNaoAprova
          showModal={showNaoAprovaModal}
          closeModal={() => setShowNaoAprovaModal(false)}
          endpoint={endpointNaoAprovaSolicitacao}
          solicitacao={alteracaoDoTipoDeAlimentacao}
          loadSolicitacao={getSolicitacaoAsync}
          resposta_sim_nao={respostaSimNao}
          uuid={uuid}
          tipoSolicitacao={tipoSolicitacao}
          motivosDREnaoValida={motivosDREnaoValida}
        />
      )}
      {ModalQuestionamento && (
        <ModalQuestionamento
          closeModal={() => setShowQuestionamentoModal(false)}
          showModal={showQuestionamentoModal}
          uuid={uuid}
          loadSolicitacao={getSolicitacaoAsync}
          resposta_sim_nao={respostaSimNao}
          endpoint={endpointQuestionamento}
          tipoSolicitacao={tipoSolicitacao}
        />
      )}
      {alteracaoDoTipoDeAlimentacao && (
        <ModalMarcarConferencia
          showModal={showModalMarcarConferencia}
          closeModal={() => setShowModalMarcarConferencia(false)}
          onMarcarConferencia={getSolicitacaoAsync}
          uuid={uuid}
          endpoint={`alteracoes-cardapio${
            tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI ? "-cei" : ""
          }`}
        />
      )}
      {ModalCODAEAutoriza && (
        <ModalCODAEAutoriza
          showModal={showModalCodaeAutorizar}
          loadSolicitacao={getSolicitacaoAsync}
          closeModal={() => setShowModalCodaeAutorizar(false)}
          endpoint={endpointAprovaSolicitacao}
          uuid={uuid}
          ehInclusao={true}
          tipoSolicitacao={tipoSolicitacao}
        />
      )}
      {erro && <div>{erro}</div>}
      {!erro && (
        <Spin
          tip="Carregando..."
          spinning={loading || !alteracaoDoTipoDeAlimentacao}
        >
          {alteracaoDoTipoDeAlimentacao && (
            <Form onSubmit={onSubmit}>
              {({ handleSubmit, values, submitting }) => (
                <form onSubmit={handleSubmit}>
                  {endpointAprovaSolicitacao && (
                    <ModalAutorizarAposQuestionamento
                      showModal={showAutorizarModal}
                      loadSolicitacao={getSolicitacaoAsync}
                      closeModal={() => setShowAutorizarModal(false)}
                      endpoint={endpointAprovaSolicitacao}
                      uuid={uuid}
                      tipoSolicitacao={tipoSolicitacao}
                    />
                  )}
                  <span className="page-title">
                    Alteração do tipo de alimentação - Solicitação #{" "}
                    {alteracaoDoTipoDeAlimentacao.id_externo}
                  </span>
                  <div className="card mt-3">
                    <div className="card-body">
                      <CorpoRelatorio
                        alteracaoDeCardapio={alteracaoDoTipoDeAlimentacao}
                        prazoDoPedidoMensagem={prazoMensagem}
                        tipoSolicitacao={tipoSolicitacao}
                        meusDados={meusDados}
                      />
                      <RelatorioHistoricoJustificativaEscola
                        solicitacao={alteracaoDoTipoDeAlimentacao}
                      />
                      <RelatorioHistoricoQuestionamento
                        solicitacao={alteracaoDoTipoDeAlimentacao}
                      />
                      {visualizaBotoesDoFluxo(alteracaoDoTipoDeAlimentacao) && (
                        <div className="row mt-4 me-3">
                          <div className="col-12 text-end">
                            {exibeBotaoNaoAprovar(
                              alteracaoDoTipoDeAlimentacao,
                              textoBotaoNaoAprova
                            ) && (
                              <Botao
                                texto={textoBotaoNaoAprova}
                                className="ms-3"
                                onClick={() => {
                                  setRespostaSimNao("Não");
                                  setShowNaoAprovaModal(true);
                                }}
                                type={BUTTON_TYPE.BUTTON}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                              />
                            )}
                            {exibeBotaoAprovar(
                              alteracaoDoTipoDeAlimentacao,
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
                                        alteracaoDoTipoDeAlimentacao,
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
                            {exibirBotaoQuestionamento(
                              alteracaoDoTipoDeAlimentacao,
                              visao,
                              tipoPerfil
                            ) && (
                              <>
                                {alteracaoDoTipoDeAlimentacao.status ===
                                  statusEnum.CODAE_QUESTIONADO &&
                                tipoPerfil === TIPO_PERFIL.TERCEIRIZADA ? (
                                  <Botao
                                    key="1"
                                    texto="Não"
                                    type={BUTTON_TYPE.BUTTON}
                                    onClick={() => {
                                      setRespostaSimNao("Não");
                                      setShowQuestionamentoModal(true);
                                    }}
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
                                  onClick={() => {
                                    setRespostaSimNao("Sim");
                                    setShowQuestionamentoModal(true);
                                  }}
                                  style={BUTTON_STYLE.GREEN}
                                  className="ms-3"
                                />
                              </>
                            )}
                            {exibirBotaoMarcarConferencia(
                              alteracaoDoTipoDeAlimentacao,
                              visao
                            ) && (
                              <div className="form-group float-end mt-4">
                                {alteracaoDoTipoDeAlimentacao.terceirizada_conferiu_gestao ? (
                                  <label className="ms-3 conferido">
                                    <i className="fas fa-check me-2" />
                                    Solicitação Conferida
                                  </label>
                                ) : (
                                  <BotaoMarcarConferencia
                                    uuid={alteracaoDoTipoDeAlimentacao.uuid}
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
            </Form>
          )}
        </Spin>
      )}
    </div>
  );
};
