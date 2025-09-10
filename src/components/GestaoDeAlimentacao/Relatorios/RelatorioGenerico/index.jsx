import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import {
  exibeBotaoAprovar,
  exibeBotaoNaoAprovar,
  exibirBotaoMarcarConferencia,
  exibirBotaoQuestionamento,
  exibirModalAutorizacaoAposQuestionamento,
} from "src/components/GestaoDeAlimentacao/Relatorios/logicaExibirBotoes.helper";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import ModalAutorizarAposQuestionamento from "src/components/Shareable/ModalAutorizarAposQuestionamento";
import ModalMarcarConferencia from "src/components/Shareable/ModalMarcarConferencia";
import RelatorioHistoricoJustificativaEscola from "src/components/Shareable/RelatorioHistoricoJustificativaEscola";
import RelatorioHistoricoQuestionamento from "src/components/Shareable/RelatorioHistoricoQuestionamento";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { DRE } from "src/configs/constants";
import { statusEnum, TIPO_PERFIL } from "src/constants/shared";
import {
  prazoDoPedidoMensagem,
  visualizaBotoesDoFluxo,
} from "src/helpers/utilities";
import { BotaoMarcarConferencia } from "./components/BotaoMarcarConferencia";

export const RelatorioGenerico = ({ ...props }) => {
  const [uuid, setUuid] = useState();
  const [tipoSolicitacao, setTipoSolicitacao] = useState();
  const [solicitacao, setSolicitacao] = useState();
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
    getSolicitacao,
    nomeSolicitacao,
    endpointMarcarConferencia,
    CorpoRelatorio,
    tipoSolicitacaoObrigatorio = false,
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

    if (tipoSolicitacaoObrigatorio && !tipoSolicitacao_) {
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
    const response = await getSolicitacao(uuid_, tipoSolicitacao_);
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacao(response.data);
      setPrazoMensagem(prazoDoPedidoMensagem(response.data.prioridade));
    } else {
      setErro(
        `Erro ao carregar ${nomeSolicitacao}. Tente novamente mais tarde.`
      );
    }
    setLoading(false);
  };

  const handleClickBotaoAprova = (values) => {
    if (visao === DRE) {
      onSubmit(values);
    } else if (exibirModalAutorizacaoAposQuestionamento(solicitacao, visao)) {
      setShowAutorizarModal(true);
    } else {
      setShowModalCodaeAutorizar(true);
    }
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
          solicitacao={solicitacao}
          loadSolicitacao={getSolicitacaoAsync}
          resposta_sim_nao={respostaSimNao}
          uuid={uuid}
          motivosDREnaoValida={motivosDREnaoValida}
          tipoSolicitacao={tipoSolicitacao}
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
      {solicitacao && (
        <ModalMarcarConferencia
          showModal={showModalMarcarConferencia}
          closeModal={() => setShowModalMarcarConferencia(false)}
          onMarcarConferencia={getSolicitacaoAsync}
          uuid={uuid}
          endpoint={endpointMarcarConferencia(tipoSolicitacao)}
        />
      )}
      {ModalCODAEAutoriza && showModalCodaeAutorizar && (
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
        <Spin tip="Carregando..." spinning={loading || !solicitacao}>
          {solicitacao && (
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
                    {nomeSolicitacao} - Solicitação # {solicitacao.id_externo}
                  </span>
                  <div className="card mt-3">
                    <div className="card-body">
                      <CorpoRelatorio
                        solicitacao={solicitacao}
                        prazoDoPedidoMensagem={prazoMensagem}
                        tipoSolicitacao={tipoSolicitacao}
                      />
                      <RelatorioHistoricoJustificativaEscola
                        solicitacao={solicitacao}
                      />
                      <RelatorioHistoricoQuestionamento
                        solicitacao={solicitacao}
                      />
                      {visualizaBotoesDoFluxo(solicitacao) && (
                        <div className="row mt-4 me-3">
                          <div className="col-12 text-end">
                            {exibeBotaoNaoAprovar(
                              solicitacao,
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
                              solicitacao,
                              visao,
                              textoBotaoAprova
                            ) && (
                              <Botao
                                texto={textoBotaoAprova}
                                type={BUTTON_TYPE.BUTTON}
                                onClick={() => handleClickBotaoAprova(values)}
                                disabled={submitting}
                                style={BUTTON_STYLE.GREEN}
                                className="ms-3"
                              />
                            )}
                            {exibirBotaoQuestionamento(
                              solicitacao,
                              visao,
                              tipoPerfil
                            ) && (
                              <>
                                {solicitacao.status ===
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
                              solicitacao,
                              visao
                            ) && (
                              <div className="form-group float-end mt-4">
                                {solicitacao.terceirizada_conferiu_gestao ? (
                                  <span className="ms-3 conferido">
                                    <i className="fas fa-check me-2" />{" "}
                                    Solicitação Conferida
                                  </span>
                                ) : (
                                  <BotaoMarcarConferencia
                                    setShowModalMarcarConferencia={
                                      setShowModalMarcarConferencia
                                    }
                                    loading={loading}
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

RelatorioGenerico.propTypes = {
  endpointAprovaSolicitacao: PropTypes.func.isRequired,
  visao: PropTypes.string.isRequired,
  textoBotaoNaoAprova: PropTypes.string.isRequired,
  textoBotaoAprova: PropTypes.string.isRequired,
  endpointNaoAprovaSolicitacao: PropTypes.func.isRequired,
  endpointQuestionamento: PropTypes.func.isRequired,
  ModalNaoAprova: PropTypes.element.isRequired,
  ModalQuestionamento: PropTypes.element.isRequired,
  motivosDREnaoValida: PropTypes.array.isRequired,
  ModalCODAEAutoriza: PropTypes.element.isRequired,
  toastAprovaMensagem: PropTypes.string.isRequired,
  toastAprovaMensagemErro: PropTypes.string.isRequired,
  getSolicitacao: PropTypes.func.isRequired,
  nomeSolicitacao: PropTypes.string.isRequired,
  endpointMarcarConferencia: PropTypes.func.isRequired,
  CorpoRelatorio: PropTypes.element.isRequired,
  tipoSolicitacaoObrigatorio: PropTypes.bool,
};
