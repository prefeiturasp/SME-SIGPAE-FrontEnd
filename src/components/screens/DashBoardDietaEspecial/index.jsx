import { MeusDadosContext } from "src/context/MeusDadosContext";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import React, { useContext, useEffect, useState } from "react";
import { ajustarFormatoLog } from "../helper";
import {
  dataAtual,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaTerceirizada,
  usuarioEscolaEhGestaoDireta,
  usuarioEscolaEhGestaoParceira,
} from "src/helpers/utilities";
import { usuarioEhEscolaTerceirizadaDiretor } from "src/helpers/utilities";
import { getMeusLotes } from "src/services/lote.service";
import CardMatriculados from "src/components/Shareable/CardMatriculados";
import CardBody from "src/components/Shareable/CardBody";
import CardStatusDeSolicitacao, {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM,
} from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { getNomeCardAguardandoAutorizacao } from "src/helpers/dietaEspecial";
import CardAtalho from "src/components/Shareable/CardAtalho";

export const DashboardDietaEspecial = ({ ...props }) => {
  const {
    getDietaEspecialAutorizadas,
    getDietaEspecialCanceladas,
    getDietaEspecialNegadas,
    getDietaEspecialPendenteAutorizacao,
    getDietaEspecialAutorizadasTemporariamente,
    getDietaEspecialInativasTemporariamente,
    getDietaEspecialInativas,
    getDietaEspecialAguardandoVigencia,
  } = props;

  const LIMIT = 6;
  const PARAMS = { limit: LIMIT, offset: 0 };

  const { meusDados } = useContext(MeusDadosContext);

  const [instituicao, setInstituicao] = useState();
  const [aguardandoVigencia, setAguardandoVigencia] = useState();
  const [aguardandoAutorizacao, setAguardandoAutorizacao] = useState();
  const [autorizadas, setAutorizadas] = useState();
  const [autorizadasTemporariamente, setAutorizadasTemporariamente] =
    useState();
  const [negadas, setNegadas] = useState();
  const [canceladas, setCanceladas] = useState();
  const [inativas, setInativas] = useState();
  const [inativasTemporariamente, setInativasTemporariamente] = useState();
  const [listaLotes, setListaLotes] = useState();

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [countRecebidas, setCountRecebidas] = useState(0);
  const [countAutorizadas, setCountAutorizadas] = useState(0);

  const LOADING =
    !instituicao ||
    !aguardandoAutorizacao ||
    !autorizadas ||
    !autorizadasTemporariamente ||
    !negadas ||
    !canceladas ||
    !inativas ||
    !inativasTemporariamente ||
    !meusDados ||
    !meusDados.vinculo_atual;

  const EXIBE_ATALHOS_SOLICITACOES =
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEscolaEhGestaoDireta() ||
    usuarioEscolaEhGestaoParceira();

  const getSolicitacoesAsync = async (params = null) => {
    setLoading(true);

    const [
      responsePendenteAutorizacao,
      responseAutorizadas,
      responseNegadas,
      responseCanceladas,
      responseInativas,
      responseInativasTemporariamente,
      responseAutorizadasTemporariamente,
    ] = await Promise.all([
      getDietaEspecialPendenteAutorizacao(instituicao.uuid, params),
      getDietaEspecialAutorizadas(instituicao.uuid, params),
      getDietaEspecialNegadas(instituicao.uuid, params),
      getDietaEspecialCanceladas(instituicao.uuid, params),
      getDietaEspecialInativas(instituicao.uuid, params),
      getDietaEspecialInativasTemporariamente(instituicao.uuid, params),
      getDietaEspecialAutorizadasTemporariamente(instituicao.uuid, params),
    ]);

    if (responsePendenteAutorizacao.status === HTTP_STATUS.OK) {
      setAguardandoAutorizacao(
        ajustarFormatoLog(
          responsePendenteAutorizacao.data.results,
          "pendentes-aut",
        ),
      );
      setCountRecebidas(responsePendenteAutorizacao.data.count);
    } else {
      setErro("Erro ao carregar solicitações aguardando autorização.");
    }

    if (responseAutorizadas.status === HTTP_STATUS.OK) {
      setAutorizadas(
        ajustarFormatoLog(responseAutorizadas.data.results, "autorizadas"),
      );
      setCountAutorizadas(responseAutorizadas.data.count);
    } else {
      setErro("Erro ao carregar solicitações autorizadas.");
    }

    if (responseNegadas.status === HTTP_STATUS.OK) {
      setNegadas(ajustarFormatoLog(responseNegadas.data.results, "negadas"));
    } else {
      setErro("Erro ao carregar solicitações negadas.");
    }

    if (responseCanceladas.status === HTTP_STATUS.OK) {
      setCanceladas(
        ajustarFormatoLog(responseCanceladas.data.results, "canceladas"),
      );
    } else {
      setErro("Erro ao carregar solicitações canceladas.");
    }

    if (responseInativas.status === HTTP_STATUS.OK) {
      setInativas(ajustarFormatoLog(responseInativas.data.results, "inativas"));
    } else {
      setErro("Erro ao carregar solicitações inativas.");
    }

    if (responseInativasTemporariamente.status === HTTP_STATUS.OK) {
      setInativasTemporariamente(
        ajustarFormatoLog(
          responseInativasTemporariamente.data.results,
          "inativas-temp",
        ),
      );
    } else {
      setErro("Erro ao carregar solicitações inativas temporariamente.");
    }

    if (responseAutorizadasTemporariamente.status === HTTP_STATUS.OK) {
      setAutorizadasTemporariamente(
        ajustarFormatoLog(
          responseAutorizadasTemporariamente.data.results,
          "autorizadas-temp",
        ),
      );
    } else {
      setErro("Erro ao carregar solicitações autorizadas temporariamente.");
    }

    if (
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhEmpresaTerceirizada()
    ) {
      const responseAguardandoVigencia =
        await getDietaEspecialAguardandoVigencia(instituicao.uuid, params);
      if (responseAguardandoVigencia.status === HTTP_STATUS.OK) {
        setAguardandoVigencia(
          ajustarFormatoLog(
            responseAguardandoVigencia.data.results,
            "aguardando-inicio-vigencia",
          ),
        );
      } else {
        setErro("Erro ao carregar solicitações aguardando início de vigência.");
      }
    } else {
      setAguardandoVigencia([]);
    }
    setLoading(false);
  };

  const getMeusLotesAsync = async () => {
    if (!usuarioEhEmpresaTerceirizada()) {
      setListaLotes([]);
    } else {
      const response = await getMeusLotes();
      if (response.status === HTTP_STATUS.OK) {
        setListaLotes(
          [{ nome: "Selecione um lote", uuid: "" }].concat(
            response.data.results,
          ),
        );
      }
    }
  };

  useEffect(() => {
    if (instituicao) {
      getSolicitacoesAsync(PARAMS);
      getMeusLotesAsync();
    }
  }, [instituicao]);

  useEffect(() => {
    if (meusDados) {
      setInstituicao(meusDados.vinculo_atual.instituicao);
    }
  }, [meusDados]);

  let typingTimeout = null;

  const onPesquisaChanged = (values) => {
    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(async () => {
      const params = PARAMS;
      if (values.titulo && values.titulo.length > 2) {
        params["titulo"] = values.titulo;
      }
      params["lote"] = values.lote;
      params["status"] = values.status;
      await getSolicitacoesAsync(params);
    }, 1000);
  };

  const contadorDietas = (title) => {
    if (!usuarioEhCoordenadorNutriCODAE()) return title;
    const count = title === "Autorizadas" ? countAutorizadas : countRecebidas;
    return `${title}${` (${count}) `}`;
  };

  return (
    <div>
      {erro && <div>{erro}</div>}
      {!erro && (
        <Spin tip="Carregando..." spinning={LOADING || loading}>
          {!LOADING && (
            <div>
              <CardMatriculados
                meusDados={meusDados}
                numeroAlunos={instituicao && instituicao.quantidade_alunos}
              />
              <CardBody
                titulo={"Acompanhamento de solicitações dieta especial"}
                dataAtual={dataAtual()}
                onChange={(values) => onPesquisaChanged(values)}
                listaLotes={listaLotes}
                listaStatus={[
                  { nome: "Conferência Status", uuid: "" },
                  { nome: "Conferida", uuid: "1" },
                  { nome: "Não Conferida", uuid: "0" },
                ]}
                loadingDietas={LOADING || loading}
              >
                <div className="row">
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={`${contadorDietas(
                        getNomeCardAguardandoAutorizacao(),
                        aguardandoAutorizacao,
                      )}`}
                      cardType={CARD_TYPE_ENUM.PENDENTE}
                      solicitations={aguardandoAutorizacao}
                      icon={ICON_CARD_TYPE_ENUM.PENDENTE}
                      href={`/solicitacoes-dieta-especial/solicitacoes-pendentes`}
                      dataTestId="card-aguardando-autorizacao"
                    />
                  </div>
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={`${contadorDietas(
                        "Autorizadas",
                        autorizadas,
                      )}`}
                      cardType={CARD_TYPE_ENUM.AUTORIZADO}
                      solicitations={autorizadas}
                      icon={ICON_CARD_TYPE_ENUM.AUTORIZADO}
                      href={`/solicitacoes-dieta-especial/solicitacoes-autorizadas`}
                    />
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Negadas"}
                      cardType={CARD_TYPE_ENUM.NEGADO}
                      solicitations={negadas}
                      icon={ICON_CARD_TYPE_ENUM.NEGADO}
                      href={`/solicitacoes-dieta-especial/solicitacoes-negadas`}
                    />
                  </div>
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Canceladas"}
                      cardType={CARD_TYPE_ENUM.CANCELADO}
                      solicitations={canceladas}
                      icon={ICON_CARD_TYPE_ENUM.CANCELADO}
                      href={`/solicitacoes-dieta-especial/solicitacoes-canceladas`}
                    />
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Inativas"}
                      cardType={CARD_TYPE_ENUM.INATIVO}
                      solicitations={inativas}
                      icon={ICON_CARD_TYPE_ENUM.INATIVO}
                      href={`/solicitacoes-dieta-especial/solicitacoes-inativas`}
                    />
                  </div>
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Autorizadas Temporariamente"}
                      cardType={CARD_TYPE_ENUM.AUTORIZADO}
                      solicitations={autorizadasTemporariamente}
                      icon={ICON_CARD_TYPE_ENUM.AUTORIZADO}
                      href={`/solicitacoes-dieta-especial/solicitacoes-autorizadas-temporariamente`}
                    />
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Inativas Temporariamente"}
                      cardType={CARD_TYPE_ENUM.AGUARDANDO_ANALISE_RECLAMACAO}
                      solicitations={inativasTemporariamente}
                      icon={ICON_CARD_TYPE_ENUM.AGUARDANDO_ANALISE_RECLAMACAO}
                      href={`/solicitacoes-dieta-especial/solicitacoes-inativas-temporariamente`}
                    />
                  </div>
                  {aguardandoVigencia && aguardandoVigencia.length > 0 && (
                    <div className="col-6">
                      <CardStatusDeSolicitacao
                        cardTitle={"Aguardando início da vigência"}
                        cardType={CARD_TYPE_ENUM.AGUARDANDO_ANALISE_RECLAMACAO}
                        solicitations={aguardandoVigencia}
                        icon={ICON_CARD_TYPE_ENUM.AGUARDANDO_ANALISE_RECLAMACAO}
                        href={`/solicitacoes-dieta-especial/solicitacoes-aguardando-inicio-vigencia`}
                        dataTestId="card-aguardando-inicio-vigencia"
                      />
                    </div>
                  )}
                </div>
              </CardBody>
              {EXIBE_ATALHOS_SOLICITACOES && (
                <div
                  className="row row-shortcuts"
                  data-testid="cards-atalhos-escola"
                >
                  <div className="col-3">
                    <CardAtalho
                      titulo={"Inclusão de Dieta Especial"}
                      nome="card-inclusao"
                      texto={`Quando houver necessidade de incluir Dieta Especial para os alunos matriculados na unidade.`}
                      textoLink={"Novo pedido"}
                      href={"/escola/dieta-especial"}
                    />
                  </div>
                  <div className="col-3">
                    <CardAtalho
                      titulo={"Alterar U.E da Dieta Especial"}
                      nome="card-inclusao"
                      texto={`Quando houver necessidade de alteração de unidade escolar
                        do aluno para os programas Polo e Recreio nas Férias.`}
                      textoLink={"Alterar U.E"}
                      href={"/escola/dieta-especial-alteracao-ue"}
                    />
                  </div>
                  <div className="col-3">
                    <CardAtalho
                      titulo={"Cancelar Dieta Especial"}
                      nome="card-cancelar"
                      texto={`Quando houver necessidade de cancelamento de dieta devido a existência de laudo de alta.`}
                      textoLink={"Cancelar Dieta"}
                      href={"/dieta-especial/cancelamento"}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Spin>
      )}
    </div>
  );
};

export default DashboardDietaEspecial;
