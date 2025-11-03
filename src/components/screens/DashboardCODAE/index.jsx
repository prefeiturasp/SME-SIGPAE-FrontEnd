import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { Link } from "react-router-dom";
import CardMatriculados from "../../Shareable/CardMatriculados";
import CardPendencia from "../../Shareable/CardPendencia/CardPendencia";
import CardStatusDeSolicitacao, {
  ICON_CARD_TYPE_ENUM,
  CARD_TYPE_ENUM,
} from "src/components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import {
  FILTRO_VISAO,
  PAGINACAO_DASHBOARD_DEFAULT,
} from "src/constants/shared";
import { FILTRO } from "../const";
import {
  CODAE,
  SOLICITACOES_AUTORIZADAS,
  SOLICITACOES_PENDENTES,
  SOLICITACOES_NEGADAS,
  SOLICITACOES_CANCELADAS,
  SOLICITACOES_COM_QUESTIONAMENTO,
} from "src/configs/constants";
import { ajustarFormatoLog } from "../helper";
import {
  getSolicitacoesCanceladasCodae,
  getSolicitacoesNegadasCodae,
  getSolicitacoesAutorizadasCodae,
  getSolicitacoesPendentesAutorizacaoCODAESecaoPendencias,
  getSolicitacoesComQuestionamentoCodae,
  getSolicitacoesPendentesAutorizacaoCodaeSemFiltro,
} from "src/services/painelCODAE.service";
import corrigeResumo from "src/helpers/corrigeDadosDoDashboard";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { dataAtual } from "src/helpers/utilities";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select as SelectAntd } from "antd";
import "./style.scss";
import {
  updateDREAlimentacao,
  updateLoteAlimentacao,
  updateTituloAlimentacao,
} from "src/reducers/filtersAlimentacaoReducer";
import { connect } from "react-redux";
import { Spin } from "antd";
import CardBody from "src/components/Shareable/CardBody";
import {
  JS_DATE_DEZEMBRO,
  JS_DATE_FEVEREIRO,
  JS_DATE_JANEIRO,
  JS_DATE_JULHO,
} from "src/constants/shared";

export const DashboardCODAE = (props) => {
  const { cards, lotes, diretoriasRegionais, handleSubmit, meusDados } = props;
  const PARAMS = { limit: PAGINACAO_DASHBOARD_DEFAULT, offset: 0 };
  const filtroPorVencimento = FILTRO.SEM_FILTRO;
  const visao = FILTRO_VISAO.POR_TIPO_SOLICITACAO;
  const { Option } = SelectAntd;

  const opcoesDRE = diretoriasRegionais
    ? [
        <Option key={0} value={""}>
          Filtrar por DRE
        </Option>,
      ].concat(
        diretoriasRegionais.map((dre) => {
          return (
            <Option key={dre.value} value={dre.value}>
              {dre.label}
            </Option>
          );
        }),
      )
    : [];

  const opcoesLote = lotes
    ? [
        <Option key={0} value={""}>
          Filtrar por Lote
        </Option>,
      ].concat(
        lotes.map((lote) => {
          return (
            <Option value={lote.value} key={lote.value}>
              {lote.label}
            </Option>
          );
        }),
      )
    : [];

  const [collapsed, setCollapsed] = useState(true);
  const [filtros, setFiltros] = useState({});
  const [resumo, setResumo] = useState([]);
  const [loadingPainelSolicitacoes, setLoadingPainelSolicitacoes] =
    useState(false);
  const [
    loadingAcompanhamentoSolicitacoes,
    setLoadingAcompanhamentoSolicitacoes,
  ] = useState(false);

  const [solicitacoesFiltradas, setSolicitacoesFiltradas] = useState({
    pendentes: [],
    questionadas: [],
    autorizadas: [],
    negadas: [],
    canceladas: [],
  });

  const params_periodo = (params) => {
    let parametros = { ...params };
    let isAllUndefined = true;
    for (let key in parametros) {
      if (
        key !== "limit" &&
        key !== "offset" &&
        parametros[key] !== undefined
      ) {
        isAllUndefined = false;
        break;
      }
    }
    if (isAllUndefined) {
      parametros.periodo = [
        JS_DATE_JANEIRO,
        JS_DATE_FEVEREIRO,
        JS_DATE_JULHO,
        JS_DATE_DEZEMBRO,
      ].includes(new Date().getMonth())
        ? 30
        : 7;
    }
    return parametros;
  };
  const getSolicitacoesAsync = async (params = null) => {
    setLoadingAcompanhamentoSolicitacoes(true);

    const [
      responsePendentesAutorizacao,
      responseAutorizadas,
      responseCanceladas,
      responseNegadas,
      responseQuestionamentos,
    ] = await Promise.all([
      getSolicitacoesPendentesAutorizacaoCodaeSemFiltro(params),
      getSolicitacoesAutorizadasCodae(params_periodo(params)),
      getSolicitacoesCanceladasCodae(params_periodo(params)),
      getSolicitacoesNegadasCodae(params_periodo(params)),
      getSolicitacoesComQuestionamentoCodae(params),
    ]);

    setSolicitacoesFiltradas({
      pendentes: ajustarFormatoLog(responsePendentesAutorizacao.data.results),
      autorizadas: ajustarFormatoLog(responseAutorizadas.data.results),
      negadas: ajustarFormatoLog(responseNegadas.data.results),
      canceladas: ajustarFormatoLog(responseCanceladas.data.results),
      questionadas: ajustarFormatoLog(responseQuestionamentos.data.results),
    });

    setLoadingAcompanhamentoSolicitacoes(false);
  };

  const carregaResumoPendencias = async (values = {}) => {
    setLoadingPainelSolicitacoes(true);
    await getSolicitacoesPendentesAutorizacaoCODAESecaoPendencias(
      filtroPorVencimento,
      visao,
      prepararParametros(values),
    ).then((response) => {
      const resumo = response.data.results;
      const correcaoOk = corrigeResumo(resumo);
      if (!correcaoOk) toastError("Erro na inclusão de dados da CEI");
      setResumo(resumo);
    });
    setLoadingPainelSolicitacoes(false);
  };

  const onPesquisaChanged = (values) => {
    carregaResumoPendencias(values);
    if (values.titulo && values.titulo.length > 2) {
      setTimeout(async () => {
        getSolicitacoesAsync({
          busca: values.titulo,
          ...prepararParametros(values),
        });
      }, 500);
    } else {
      setTimeout(async () => {
        getSolicitacoesAsync(prepararParametros(values));
      }, 500);
    }
  };

  const linkTo = (link) => {
    let url =
      visao === FILTRO_VISAO.POR_TIPO_SOLICITACAO ? `/${CODAE}/${link}` : "/";

    return url;
  };

  const prepararParametros = (values) => {
    setFiltros(values);
    const params = PARAMS;
    params["tipo_solicitacao"] = values.tipo_solicitacao;
    params["data_evento"] =
      values.data_evento && values.data_evento.split("/").reverse().join("-");
    params["diretoria_regional"] = values.diretoria_regional;
    params["lote"] = values.lote;
    return params;
  };

  useEffect(() => {
    carregaResumoPendencias();
    getSolicitacoesAsync(PARAMS);
  }, []);

  let typingTimeout = null;

  return (
    <div>
      <Form
        onSubmit={() => handleSubmit}
        initialValues={{}}
        render={({ handleSubmit, values, form }) => (
          <form onSubmit={handleSubmit}>
            <Field component={"input"} type="hidden" name="uuid" />
            <CardMatriculados
              collapsed={collapsed}
              alterarCollapse={() => setCollapsed(!collapsed)}
              meusDados={meusDados}
              numeroAlunos={
                (meusDados &&
                  meusDados.vinculo_atual.instituicao.quantidade_alunos) ||
                0
              }
            />
            <div className="card mt-3">
              <div className="card-body">
                <div className="card-title fw-bold dashboard-card-title">
                  <div className="row">
                    <div className="col-3 mt-3 color-black">Pendências</div>
                    <div className="offset-3 col-3 my-auto">
                      <Field
                        component={ASelect}
                        showSearch
                        onChange={(value) => {
                          form.change(`diretoria_regional`, value || undefined);
                          onPesquisaChanged(form.getState().values);
                          props.updateDREAlimentacao(value);
                        }}
                        name="diretoria_regional"
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toString()
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                        data-testid="select-dre"
                      >
                        {opcoesDRE}
                      </Field>
                    </div>
                    <div className="col-3 my-auto">
                      <Field
                        component={ASelect}
                        showSearch
                        onChange={(value) => {
                          form.change(`lote`, value || undefined);
                          onPesquisaChanged(form.getState().values);
                          props.updateLoteAlimentacao(value);
                        }}
                        name="lote"
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toString()
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                        data-testid="select-lote"
                      >
                        {opcoesLote}
                      </Field>
                    </div>
                  </div>
                </div>
                <div className="pt-3" />
                <div className="row pt-3">
                  {cards.map((card, key) => {
                    return resumo[card.titulo] ? (
                      <div key={key} className="col-6 pb-3">
                        <Link
                          to={linkTo(card.link)}
                          state={{
                            prevPath: window.location.pathname,
                            filtros: filtros,
                          }}
                        >
                          <CardPendencia
                            cardTitle={card.titulo}
                            totalOfOrders={resumo[card.titulo]["TOTAL"] || 0}
                            priorityOrders={
                              resumo[card.titulo]["PRIORITARIO"] || 0
                            }
                            onLimitOrders={resumo[card.titulo]["LIMITE"] || 0}
                            regularOrders={resumo[card.titulo]["REGULAR"] || 0}
                            loading={loadingPainelSolicitacoes}
                          />
                        </Link>
                      </div>
                    ) : (
                      <div key={key} className="col-6 pb-3">
                        <Link
                          to={linkTo(card.link)}
                          state={{
                            prevPath: window.location.pathname,
                            filtros: filtros,
                          }}
                        >
                          <CardPendencia
                            cardTitle={card.titulo}
                            totalOfOrders={0}
                            priorityOrders={0}
                            onLimitOrders={0}
                            regularOrders={0}
                            loading={loadingPainelSolicitacoes}
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <CardBody
              exibirFiltrosDataEventoETipoSolicitacao={true}
              titulo={"Acompanhamento solicitações"}
              filtrosDesabilitados={loadingAcompanhamentoSolicitacoes}
              dataAtual={dataAtual()}
              onChange={(value) => {
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(async () => {
                  onPesquisaChanged(value);
                  props.updateTituloAlimentacao(value.titulo);
                }, 1000);
              }}
              values={values}
            >
              <Spin
                tip="Carregando..."
                spinning={loadingAcompanhamentoSolicitacoes}
              >
                <div className="row pb-3">
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Aguardando Autorização"}
                      cardType={CARD_TYPE_ENUM.PENDENTE}
                      solicitations={solicitacoesFiltradas.pendentes}
                      icon={"fa-exclamation-triangle"}
                      href={`/${CODAE}/${SOLICITACOES_PENDENTES}`}
                    />
                  </div>
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Aguardando Resposta da Empresa"}
                      cardType={CARD_TYPE_ENUM.PENDENTE}
                      solicitations={solicitacoesFiltradas.questionadas}
                      icon={"fa-exclamation-triangle"}
                      href={`/${CODAE}/${SOLICITACOES_COM_QUESTIONAMENTO}`}
                    />
                  </div>
                </div>
                <div className="row pb-3">
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Autorizadas"}
                      cardType={CARD_TYPE_ENUM.AUTORIZADO}
                      solicitations={solicitacoesFiltradas.autorizadas}
                      icon={ICON_CARD_TYPE_ENUM.AUTORIZADO}
                      href={`/${CODAE}/${SOLICITACOES_AUTORIZADAS}`}
                    />
                  </div>
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Negadas"}
                      cardType={CARD_TYPE_ENUM.NEGADO}
                      solicitations={solicitacoesFiltradas.negadas}
                      icon={ICON_CARD_TYPE_ENUM.NEGADO}
                      href={`/${CODAE}/${SOLICITACOES_NEGADAS}`}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Canceladas"}
                      cardType={CARD_TYPE_ENUM.CANCELADO}
                      solicitations={solicitacoesFiltradas.canceladas}
                      icon={ICON_CARD_TYPE_ENUM.CANCELADO}
                      href={`/${CODAE}/${SOLICITACOES_CANCELADAS}`}
                    />
                  </div>
                </div>
              </Spin>
            </CardBody>
          </form>
        )}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateDREAlimentacao: (dreAlimentacao) => {
    dispatch(updateDREAlimentacao(dreAlimentacao));
  },
  updateLoteAlimentacao: (loteAlimentacao) => {
    dispatch(updateLoteAlimentacao(loteAlimentacao));
  },
  updateTituloAlimentacao: (tituloAlimentacao) => {
    dispatch(updateTituloAlimentacao(tituloAlimentacao));
  },
});

export default connect(null, mapDispatchToProps)(DashboardCODAE);
