import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import CardAtalho from "src/components/Shareable/CardAtalho";
import CardBody from "src/components/Shareable/CardBody";
import CardMatriculados from "src/components/Shareable/CardMatriculados";
import CardStatusDeSolicitacao, {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM,
} from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import {
  ESCOLA,
  SOLICITACOES_AUTORIZADAS,
  SOLICITACOES_CANCELADAS,
  SOLICITACOES_NEGADAS,
  SOLICITACOES_PENDENTES,
} from "src/configs/constants";
import { PAGINACAO_DEFAULT } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { dataAtual } from "src/helpers/utilities";
import {
  getSolicitacoesAutorizadasEscola,
  getSolicitacoesCanceladasEscola,
  getSolicitacoesNegadasEscola,
  getSolicitacoesPendentesEscola,
} from "src/services/painelEscola.service";
import { ajustarFormatoLog } from "../helper";
import "./style.scss";

export const DashboardEscola = () => {
  const [aguardandoAutorizacao, setAguardandoAutorizacao] = useState(null);
  const [autorizadas, setAutorizadas] = useState(null);
  const [negadas, setNegadas] = useState(null);
  const [canceladas, setCanceladas] = useState(null);
  const [erro, setErro] = useState("");
  const prepararParametros = (values) => {
    const params = PARAMS;
    params["tipo_solicitacao"] = values.tipo_solicitacao;
    params["data_evento"] =
      values.data_evento && values.data_evento.split("/").reverse().join("-");
    return params;
  };
  const [
    loadingAcompanhamentoSolicitacoes,
    setLoadingAcompanhamentoSolicitacoes,
  ] = useState(false);
  const { meusDados } = useContext(MeusDadosContext);

  const LOADING =
    !aguardandoAutorizacao ||
    !autorizadas ||
    !negadas ||
    !canceladas ||
    !meusDados;
  const PARAMS = { limit: PAGINACAO_DEFAULT, offset: 0 };

  const getSolicitacoesAsync = async (params = null) => {
    setLoadingAcompanhamentoSolicitacoes(true);

    const response = await getSolicitacoesPendentesEscola(params);
    if (response.status === HTTP_STATUS.OK) {
      setAguardandoAutorizacao(ajustarFormatoLog(response.data.results));
    } else {
      setErro("Erro ao carregar solicitações aguardando autorização.");
    }
    const responseAutorizadas = await getSolicitacoesAutorizadasEscola(params);
    if (responseAutorizadas.status === HTTP_STATUS.OK) {
      setAutorizadas(ajustarFormatoLog(responseAutorizadas.data.results));
    } else {
      setErro("Erro ao carregar solicitações autorizadas.");
    }
    const responseNegadas = await getSolicitacoesNegadasEscola(params);
    if (responseNegadas.status === HTTP_STATUS.OK) {
      setNegadas(ajustarFormatoLog(responseNegadas.data.results));
    } else {
      setErro("Erro ao carregar solicitações negadas.");
    }
    const responseCanceladas = await getSolicitacoesCanceladasEscola(params);
    if (responseCanceladas.status === HTTP_STATUS.OK) {
      setCanceladas(ajustarFormatoLog(responseCanceladas.data.results));
    } else {
      setErro("Erro ao carregar solicitações canceladas.");
    }

    setLoadingAcompanhamentoSolicitacoes(false);
  };

  useEffect(() => {
    getSolicitacoesAsync(PARAMS);
  }, []);

  const onPesquisaChanged = (values) => {
    if (values.titulo && values.titulo.length > 2) {
      getSolicitacoesAsync({
        busca: values.titulo,
        ...prepararParametros(values),
      });
    } else {
      getSolicitacoesAsync(prepararParametros(values));
    }
  };

  let typingTimeout = null;

  return (
    <div className="dashboard-school">
      {erro && <div>{erro}</div>}
      {!erro && (
        <Spin tip="Carregando..." spinning={LOADING}>
          {!LOADING && (
            <>
              <CardMatriculados
                meusDados={meusDados}
                numeroAlunos={
                  meusDados.vinculo_atual.instituicao.quantidade_alunos
                }
              />
              <CardBody
                exibirFiltrosDataEventoETipoSolicitacao={true}
                titulo={"Acompanhamento solicitações"}
                dataAtual={dataAtual()}
                onChange={(values) => {
                  clearTimeout(typingTimeout);
                  typingTimeout = setTimeout(async () => {
                    onPesquisaChanged(values);
                  }, 1000);
                }}
              >
                <Spin
                  tip="Carregando..."
                  spinning={loadingAcompanhamentoSolicitacoes}
                >
                  <div className="row">
                    <div className="col-12 col-sm-6 div-card-status-solicitacao">
                      <CardStatusDeSolicitacao
                        cardTitle={"Aguardando Autorização"}
                        cardType={CARD_TYPE_ENUM.PENDENTE}
                        solicitations={aguardandoAutorizacao}
                        icon={ICON_CARD_TYPE_ENUM.PENDENTE}
                        href={`/${ESCOLA}/${SOLICITACOES_PENDENTES}`}
                      />
                    </div>
                    <div className="col-12 col-sm-6 div-card-status-solicitacao">
                      <CardStatusDeSolicitacao
                        cardTitle={"Autorizados"}
                        cardType={CARD_TYPE_ENUM.AUTORIZADO}
                        solicitations={autorizadas}
                        icon={ICON_CARD_TYPE_ENUM.AUTORIZADO}
                        href={`/${ESCOLA}/${SOLICITACOES_AUTORIZADAS}`}
                      />
                    </div>
                  </div>
                  <div className="row pt-3">
                    <div className="col-12 col-sm-6 div-card-status-solicitacao">
                      <CardStatusDeSolicitacao
                        cardTitle={"Negadas"}
                        cardType={CARD_TYPE_ENUM.NEGADO}
                        solicitations={negadas}
                        icon={ICON_CARD_TYPE_ENUM.NEGADO}
                        href={`/${ESCOLA}/${SOLICITACOES_NEGADAS}`}
                      />
                    </div>
                    <div className="col-12 col-sm-6 div-card-status-solicitacao">
                      <CardStatusDeSolicitacao
                        cardTitle={"Canceladas"}
                        cardType={CARD_TYPE_ENUM.CANCELADO}
                        solicitations={canceladas}
                        icon={ICON_CARD_TYPE_ENUM.CANCELADO}
                        href={`/${ESCOLA}/${SOLICITACOES_CANCELADAS}`}
                      />
                    </div>
                  </div>
                </Spin>
              </CardBody>
            </>
          )}
          <div className="row row-shortcuts">
            <div className="col-md-3 col-sm-6 col-12">
              <CardAtalho
                titulo={"Inclusão de Alimentação"}
                nome="card-inclusao"
                texto={
                  "Quando houver necessidade de incluir dentro" +
                  " da unidade alimentação para os alunos matriculados" +
                  " na RME (exemplos: reposição de aula aos sábados; projetos)"
                }
                textoLink={"Novo pedido"}
                href={"/escola/inclusao-de-alimentacao"}
              />
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <CardAtalho
                titulo={"Alteração do Tipo de Alimentação"}
                nome="card-alteracao"
                texto={
                  "Quando houver necessidade de alteração do cardápio dentro da unidade, " +
                  "alterando o tipo de alimentação (exemplos: alteração de refeição " +
                  "por lanche; alteração de refeição e lanche por merenda seca)"
                }
                textoLink={"Novo pedido"}
                href={"/escola/alteracao-do-tipo-de-alimentacao"}
              />
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <CardAtalho
                titulo={"Kit Lanche Passeio"}
                nome="card-kit-lanche"
                texto={
                  "Quando houver necessidade da solicitação de Kit Lanche Passeio para consumo durante " +
                  "o passeio externo (situações em que não há possibilidade de oferecer a " +
                  "alimentação na própria unidade como por exemplo Kit Lanche Passeio para visitar " +
                  "o museu)"
                }
                textoLink={"Novo pedido"}
                href="/escola/solicitacao-de-kit-lanche"
              />
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <CardAtalho
                titulo={"Inversão de dia de Cardápio"}
                nome="card-inversao"
                texto={
                  "Quando houver necessidade da inversão de todo cardápio de um dia do mês por " +
                  "outro dia de atendimento (exemplo: inversão do cardápio do dia X pelo dia Y)"
                }
                textoLink={"Novo pedido"}
                href={"/escola/inversao-de-dia-de-cardapio"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-6 col-12">
              <CardAtalho
                titulo={"Suspensão de Alimentação"}
                nome="card-suspensao"
                texto={
                  "Quando houver necessidade de suspensão da alimentação de algum dia do mês " +
                  "(refeição/lanche) por não ter atendimento com alunos (exemplo: suspensão da " +
                  "alimentação do dia X devido a parada pedagógica)"
                }
                textoLink={"Novo pedido"}
                href={"/escola/suspensao-de-alimentacao"}
              />
            </div>
          </div>
        </Spin>
      )}
    </div>
  );
};
