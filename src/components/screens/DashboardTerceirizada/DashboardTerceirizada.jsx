import { Spin } from "antd";
import CardBody from "components/Shareable/CardBody";
import CardMatriculados from "components/Shareable/CardMatriculados";
import CardStatusDeSolicitacao, {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM,
} from "components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import {
  SOLICITACOES_AUTORIZADAS,
  SOLICITACOES_CANCELADAS,
  SOLICITACOES_COM_QUESTIONAMENTO,
  SOLICITACOES_NEGADAS,
  TERCEIRIZADA,
} from "configs/constants";
import {
  JS_DATE_DEZEMBRO,
  JS_DATE_FEVEREIRO,
  JS_DATE_JANEIRO,
  JS_DATE_JULHO,
  PAGINACAO_DASHBOARD_DEFAULT,
} from "constants/shared";
import { dataAtual, deepCopy } from "helpers/utilities";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import {
  getSolicitacoesAutorizadasTerceirizada,
  getSolicitacoesCanceladasTerceirizada,
  getSolicitacoesComQuestionamento,
  getSolicitacoesNegadasTerceirizada,
} from "services/painelTerceirizada.service";
import { ajustarFormatoLog, LOG_PARA } from "../helper";
import { MENU_DASHBOARD_TERCEIRIZADAS } from "./constants";

const PARAMS = { limit: PAGINACAO_DASHBOARD_DEFAULT, offset: 0 };
class DashboardTerceirizada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secao: null,
      cards: this.props.cards,

      lotes: [],

      collapsed: true,
      questionamentosListSolicitacao: [],
      autorizadasListSolicitacao: [],
      canceladasListSolicitacao: [],
      negadasListSolicitacao: [],
      loadingFiltro: false,
      loadingAcompanhamentoSolicitacoes: false,

      listaStatus: [
        { nome: "Conferência Status", uuid: "" },
        { nome: "Conferida", uuid: "1" },
        { nome: "Não Conferida", uuid: "0" },
      ],
    };
    this.alterarCollapse = this.alterarCollapse.bind(this);
    this.onPesquisaChanged = this.onPesquisaChanged.bind(this);
    this.typingTimeout = null;
  }

  alterarCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  async getSolicitacoesAsync(params) {
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
    this.setState({ loadingAcompanhamentoSolicitacoes: true });

    getSolicitacoesComQuestionamento(parametros).then((request) => {
      let questionamentosListSolicitacao = ajustarFormatoLog(
        request.data.results,
        LOG_PARA.TERCEIRIZADA
      );
      this.setState({
        questionamentosListSolicitacao,
        loadingFiltro: false,
      });
    });

    getSolicitacoesCanceladasTerceirizada(parametros).then((request) => {
      let canceladasListSolicitacao = ajustarFormatoLog(
        request.data.results,
        LOG_PARA.TERCEIRIZADA
      );
      this.setState({
        canceladasListSolicitacao,
      });
    });

    getSolicitacoesNegadasTerceirizada(parametros).then((request) => {
      let negadasListSolicitacao = ajustarFormatoLog(
        request.data.results,
        LOG_PARA.TERCEIRIZADA
      );
      this.setState({
        negadasListSolicitacao,
      });
    });

    getSolicitacoesAutorizadasTerceirizada(parametros).then((request) => {
      let autorizadasListSolicitacao = ajustarFormatoLog(
        request.data.results,
        LOG_PARA.TERCEIRIZADA
      );
      this.setState({
        autorizadasListSolicitacao,
        loadingAcompanhamentoSolicitacoes: false,
      });
    });
  }

  resetParams() {
    const newParams = { limit: PAGINACAO_DASHBOARD_DEFAULT, offset: 0 };
    this.setState({ loadingFiltro: true }, () => {
      this.getSolicitacoesAsync(newParams);
    });
  }

  async componentDidMount() {
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.botaoVoltar
    ) {
      this.setState({
        secao: MENU_DASHBOARD_TERCEIRIZADAS.GESTAO_DE_ALIMENTACAO,
      });
    }
    this.resetParams();
  }

  onPesquisaChanged(values, previous) {
    const params = PARAMS;
    const values_ = deepCopy(values);
    if (values.titulo && values.titulo.length > 2) {
      params["busca"] = values.titulo;
      if (previous && previous.length >= 2) {
        this.setState({ loadingFiltro: true });
      }
    } else {
      if (previous && previous.length > 2) {
        this.setState({ loadingFiltro: true });
      }
      delete params["busca"];
    }
    params["status"] = values.status;
    params["lote"] = values.lote;
    params["tipo_solicitacao"] = values.tipo_solicitacao;
    params["data_evento"] =
      values_.data_evento && values_.data_evento.split("/").reverse().join("-");
    if (
      values.status ||
      values.lote ||
      values.tipo_solicitacao ||
      values.data_evento
    ) {
      this.setState({
        loadingFiltro: true,
      });
    }

    setTimeout(async () => {
      this.getSolicitacoesAsync(params);
    }, 500);
  }

  render() {
    const { handleSubmit, meusDados, listaLotes } = this.props;

    const {
      collapsed,
      questionamentosListSolicitacao,
      canceladasListSolicitacao,
      negadasListSolicitacao,
      autorizadasListSolicitacao,
      listaStatus,
      loadingFiltro,
      loadingAcompanhamentoSolicitacoes,
    } = this.state;

    const LOADING =
      !questionamentosListSolicitacao ||
      !canceladasListSolicitacao ||
      !negadasListSolicitacao ||
      !autorizadasListSolicitacao;

    return (
      <div>
        <form onSubmit={handleSubmit(this.props.handleSubmit)}>
          <Field component={"input"} type="hidden" name="uuid" />
          <CardMatriculados
            collapsed={collapsed}
            meusDados={meusDados}
            alterarCollapse={this.alterarCollapse}
            numeroAlunos={
              (meusDados &&
                meusDados.vinculo_atual.instituicao.quantidade_alunos) ||
              0
            }
          />
          <Spin tip="Carregando..." spinning={LOADING || loadingFiltro}>
            <CardBody
              titulo={"Acompanhamento solicitações"}
              dataAtual={dataAtual()}
              onChange={(values) => {
                clearTimeout(this.typingTimeout);
                this.typingTimeout = setTimeout(async () => {
                  this.onPesquisaChanged(values);
                }, 1000);
              }}
              listaLotes={listaLotes}
              listaStatus={listaStatus}
            >
              <Spin
                tip="Carregando..."
                spinning={loadingAcompanhamentoSolicitacoes}
              >
                <div className="row pb-3">
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Questionamentos da CODAE"}
                      cardType={CARD_TYPE_ENUM.PENDENTE}
                      solicitations={questionamentosListSolicitacao}
                      icon={"fa-exclamation-triangle"}
                      href={`/${TERCEIRIZADA}/${SOLICITACOES_COM_QUESTIONAMENTO}`}
                    />
                  </div>
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Autorizadas"}
                      cardType={CARD_TYPE_ENUM.AUTORIZADO}
                      solicitations={autorizadasListSolicitacao}
                      icon={ICON_CARD_TYPE_ENUM.AUTORIZADO}
                      href={`/${TERCEIRIZADA}/${SOLICITACOES_AUTORIZADAS}`}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Negadas"}
                      cardType={CARD_TYPE_ENUM.NEGADO}
                      solicitations={negadasListSolicitacao}
                      icon={ICON_CARD_TYPE_ENUM.NEGADO}
                      href={`/${TERCEIRIZADA}/${SOLICITACOES_NEGADAS}`}
                    />
                  </div>
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Canceladas"}
                      cardType={CARD_TYPE_ENUM.CANCELADO}
                      solicitations={canceladasListSolicitacao}
                      icon={ICON_CARD_TYPE_ENUM.CANCELADO}
                      href={`/${TERCEIRIZADA}/${SOLICITACOES_CANCELADAS}`}
                    />
                  </div>
                </div>
              </Spin>
            </CardBody>
          </Spin>
        </form>
      </div>
    );
  }
}

const DashboardTerceirizadaForm = reduxForm({
  form: "dashboardTerceirizada",
  enableReinitialize: true,
})(DashboardTerceirizada);

export default DashboardTerceirizadaForm;
