import React, { Component } from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import { meusDados } from "../../../services/perfil.service";
import {
  getPaginacaoSolicitacoesDietaEspecial,
  getPaginacaoSolicitacoesDietaEspecialCODAE
} from "../../../services/dashBoardDietaEspecial.service";
import { extrairStatusDaSolicitacaoURL } from "./helpers";
import {
  CODAE,
  TERCEIRIZADA,
  ESCOLA,
  DRE,
  SOLICITACOES_PENDENTES,
  SOLICITACOES_NEGADAS,
  SOLICITACOES_AUTORIZADAS,
  SOLICITACOES_CANCELADAS,
  AUTORIZADOS_DIETA,
  AUTORIZADAS_TEMPORARIAMENTE_DIETA,
  CANCELADOS_DIETA,
  PENDENTES_DIETA,
  NEGADOS_DIETA,
  DIETA_ESPECIAL_SOLICITACOES,
  SOLICITACOES_AUTORIZADAS_TEMPORARIAMENTE,
  SOLICITACOES_INATIVAS_TEMPORARIAMENTE,
  SOLICITACOES_AGUARDANDO_INICIO_VIGENCIA,
  INATIVAS_TEMPORARIAMENTE_DIETA,
  SOLICITACOES_INATIVAS,
  INATIVAS_DIETA,
  AGUARDANDO_VIGENCIA_DIETA
} from "../../../configs/constants";
import {
  CARD_TYPE_ENUM,
  ICON_CARD_TYPE_ENUM
} from "../../Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { ajustarFormatoLog } from "../helper";
import { InputSearchPendencias } from "../../Shareable/InputSearchPendencias";
import CardListarSolicitacoes from "../../Shareable/CardListarSolicitacoes";
import { Paginacao } from "../../Shareable/Paginacao";
import { getNomeCardAguardandoAutorizacao } from "helpers/dietaEspecial";
import { getMeusLotes } from "services/lote.service";
import { usuarioEhEmpresaTerceirizada } from "helpers/utilities";

export class StatusSolicitacoes extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      instituicao: null,
      count: 0,
      tipoSolicitacao: null,
      solicitacoes: null,
      listaSolicitacoesSemFiltro: null,
      originalCount: null,
      tipoCard: null,
      icone: null,
      titulo: null,
      solicitacoesFiltrados: null,
      urlPaginacao: null,
      selecionarTodos: false,
      listaLotes: null
    };
    this.selecionarTodos = this.selecionarTodos.bind(this);
    this.onCheckClicked = this.onCheckClicked.bind(this);
    this.onPesquisarChanged = this.onPesquisarChanged.bind(this);
  }

  async componentDidMount() {
    const url = window.location.href;
    let tipoSolicitacao = extrairStatusDaSolicitacaoURL(url);
    this.setState({ tipoSolicitacao });
    meusDados().then(response => {
      this.setState({
        instituicao: response.vinculo_atual.instituicao
      });
    });
    if (usuarioEhEmpresaTerceirizada()) {
      await getMeusLotes().then(response => {
        this.setState({
          listaLotes: [{ nome: "Selecione um lote", uuid: "" }].concat(
            response.results
          )
        });
      });
    }
  }

  selecionarTodos(solicitacoes) {
    const selecionarTodos = !this.state.selecionarTodos;
    solicitacoes.forEach((_, key) => {
      this.props.change(`check_${key}`, selecionarTodos);
    });
    this.props.change("selecionar_todos", selecionarTodos);
    this.setState({ selecionarTodos });
  }

  onCheckClicked(solicitacoes, key) {
    solicitacoes[key].checked = !solicitacoes[key].checked;
    this.props.change(`check_${key}`, solicitacoes[key].checked);
  }

  onPesquisarChanged(values) {
    if (values.titulo === undefined) values.titulo = "";
    let solicitacoesFiltrados = this.state.solicitacoes;
    let listaSolicitacoesSemFiltro = this.state.listaSolicitacoesSemFiltro;
    if (values.lote && values.lote.length > 0) {
      solicitacoesFiltrados = this.filtrarLote(
        solicitacoesFiltrados,
        values.lote
      );
    }
    if (values.status && values.status.length > 0) {
      solicitacoesFiltrados = this.filtrarStatus(
        solicitacoesFiltrados,
        values.status
      );
    }
    if (values.titulo && values.titulo.length > 0) {
      solicitacoesFiltrados = this.filtrarNome(
        listaSolicitacoesSemFiltro,
        values.titulo
      );
      this.setState({
        count: solicitacoesFiltrados.length
      });
    }
    if (values.titulo === "") {
      this.setState({
        count: this.state.originalCount
      });
    }
    this.setState({ solicitacoesFiltrados });
  }

  filtrarStatus(listaFiltro, value) {
    if (value === "1") {
      listaFiltro = listaFiltro.filter(item => item.conferido === true);
    }
    if (value === "0") {
      listaFiltro = listaFiltro.filter(item => item.conferido === false);
    }
    return listaFiltro;
  }

  filtrarLote(listaFiltro, value) {
    listaFiltro = listaFiltro.filter(item => item.lote_uuid === value);
    return listaFiltro;
  }

  filtrarNome(listaFiltro, value) {
    listaFiltro = listaFiltro.filter(function(item) {
      const wordToFilter = value.toLowerCase();
      return item.text.toLowerCase().search(wordToFilter) !== -1;
    });
    return listaFiltro;
  }

  retornaUrlPaginacao = (visao, statusDieta) => {
    switch (visao) {
      case ESCOLA:
        return `${DIETA_ESPECIAL_SOLICITACOES.ESCOLA}/${statusDieta}`;
      case TERCEIRIZADA:
        return `${DIETA_ESPECIAL_SOLICITACOES.TERCEIRIZADA}/${statusDieta}`;
      case CODAE:
        return `${DIETA_ESPECIAL_SOLICITACOES.CODAE}/${statusDieta}`;
      case DRE:
        return `${DIETA_ESPECIAL_SOLICITACOES.DRE}/${statusDieta}`;
      default:
        break;
    }
  };

  navegacaoPage = (multiploQuantidade, quantidadePorPagina) => {
    const { instituicao, urlPaginacao } = this.state;
    const offSet = quantidadePorPagina * (multiploQuantidade - 1);
    if (this.props.visao === CODAE) {
      getPaginacaoSolicitacoesDietaEspecialCODAE(urlPaginacao, offSet).then(
        response => {
          this.setState({
            solicitacoesFiltrados: ajustarFormatoLog(response.results),
            solicitacoes: ajustarFormatoLog(response.results)
          });
        }
      );
    } else {
      getPaginacaoSolicitacoesDietaEspecial(
        urlPaginacao,
        instituicao.uuid,
        offSet
      ).then(response => {
        this.setState({
          solicitacoesFiltrados: ajustarFormatoLog(response.results),
          solicitacoes: ajustarFormatoLog(response.results)
        });
      });
    }
  };

  componentDidUpdate() {
    const visao = this.props.visao;
    const {
      solicitacoesFiltrados,
      tipoSolicitacao,
      instituicao,
      solicitacoes
    } = this.state;
    if (tipoSolicitacao && instituicao && !solicitacoes) {
      switch (tipoSolicitacao) {
        case SOLICITACOES_PENDENTES:
          this.props
            .getDietaEspecialPendenteAutorizacao(instituicao.uuid)
            .then(response => {
              this.setState({
                solicitacoes: ajustarFormatoLog(
                  response.results,
                  "pendentes-aut"
                ),
                count: response.count,
                originalCount: response.count,
                tipoCard: CARD_TYPE_ENUM.PENDENTE,
                icone: ICON_CARD_TYPE_ENUM.PENDENTE,
                titulo: getNomeCardAguardandoAutorizacao(),
                urlPaginacao: this.retornaUrlPaginacao(visao, PENDENTES_DIETA)
              });
            });
          this.props
            .getDietaEspecialPendenteAutorizacao(instituicao.uuid, true)
            .then(response => {
              this.setState({
                listaSolicitacoesSemFiltro: ajustarFormatoLog(
                  response.results,
                  "pendentes-aut"
                )
              });
            });
          break;
        case SOLICITACOES_NEGADAS:
          this.props
            .getDietaEspecialNegadas(instituicao.uuid)
            .then(response => {
              this.setState({
                solicitacoes: ajustarFormatoLog(response.results, "negadas"),
                count: response.count,
                originalCount: response.count,
                tipoCard: CARD_TYPE_ENUM.NEGADO,
                icone: ICON_CARD_TYPE_ENUM.NEGADO,
                titulo: "Negadas",
                urlPaginacao: this.retornaUrlPaginacao(visao, NEGADOS_DIETA)
              });
            });
          this.props
            .getDietaEspecialNegadas(instituicao.uuid, true)
            .then(response => {
              this.setState({
                listaSolicitacoesSemFiltro: ajustarFormatoLog(
                  response.results,
                  "negadas"
                )
              });
            });
          break;
        case SOLICITACOES_AUTORIZADAS:
          this.props
            .getDietaEspecialAutorizadas(instituicao.uuid)
            .then(response => {
              this.setState({
                solicitacoes: ajustarFormatoLog(
                  response.results,
                  "autorizadas"
                ),
                count: response.count,
                originalCount: response.count,
                tipoCard: CARD_TYPE_ENUM.AUTORIZADO,
                icone: ICON_CARD_TYPE_ENUM.AUTORIZADO,
                titulo: "Autorizadas",
                urlPaginacao: this.retornaUrlPaginacao(visao, AUTORIZADOS_DIETA)
              });
            });
          this.props
            .getDietaEspecialAutorizadas(instituicao.uuid, true)
            .then(response => {
              this.setState({
                listaSolicitacoesSemFiltro: ajustarFormatoLog(
                  response.results,
                  "autorizadas"
                )
              });
            });
          break;
        case SOLICITACOES_CANCELADAS:
          this.props
            .getDietaEspecialCanceladas(instituicao.uuid)
            .then(response => {
              this.setState({
                solicitacoes: ajustarFormatoLog(response.results, "canceladas"),
                count: response.count,
                originalCount: response.count,
                tipoCard: CARD_TYPE_ENUM.CANCELADO,
                icone: ICON_CARD_TYPE_ENUM.CANCELADO,
                titulo: "Canceladas",
                urlPaginacao: this.retornaUrlPaginacao(visao, CANCELADOS_DIETA)
              });
            });
          this.props
            .getDietaEspecialCanceladas(instituicao.uuid, true)
            .then(response => {
              this.setState({
                listaSolicitacoesSemFiltro: ajustarFormatoLog(
                  response.results,
                  "canceladas"
                )
              });
            });
          break;
        case SOLICITACOES_AUTORIZADAS_TEMPORARIAMENTE:
          this.props
            .getDietaEspecialAutorizadasTemporariamente(instituicao.uuid)
            .then(response => {
              this.setState({
                solicitacoes: ajustarFormatoLog(
                  response.data.results,
                  "autorizadas-temp"
                ),
                count: response.data.count,
                originalCount: response.data.count,
                tipoCard: CARD_TYPE_ENUM.AUTORIZADO,
                icone: ICON_CARD_TYPE_ENUM.AUTORIZADO,
                titulo: "Autorizadas Temporariamente",
                urlPaginacao: this.retornaUrlPaginacao(
                  visao,
                  AUTORIZADAS_TEMPORARIAMENTE_DIETA
                )
              });
            });
          this.props
            .getDietaEspecialAutorizadasTemporariamente(instituicao.uuid, true)
            .then(response => {
              this.setState({
                listaSolicitacoesSemFiltro: ajustarFormatoLog(
                  response.data.results,
                  "autorizadas-temp"
                )
              });
            });
          break;
        case SOLICITACOES_AGUARDANDO_INICIO_VIGENCIA:
          this.props
            .getDietaEspecialAguardandoVigencia(instituicao.uuid)
            .then(response => {
              this.setState({
                solicitacoes: ajustarFormatoLog(
                  response.data.results,
                  "aguardando-inicio-vigencia"
                ),
                count: response.data.count,
                originalCount: response.data.count,
                tipoCard: CARD_TYPE_ENUM.AGUARDANDO_ANALISE_RECLAMACAO,
                icone: ICON_CARD_TYPE_ENUM.AGUARDANDO_ANALISE_RECLAMACAO,
                titulo: "Aguardando início da vigência",
                urlPaginacao: this.retornaUrlPaginacao(
                  visao,
                  AGUARDANDO_VIGENCIA_DIETA
                )
              });
            });
          this.props
            .getDietaEspecialAguardandoVigencia(instituicao.uuid, true)
            .then(response => {
              this.setState({
                listaSolicitacoesSemFiltro: ajustarFormatoLog(
                  response.data.results,
                  "aguardando-inicio-vigencia"
                )
              });
            });
          break;
        case SOLICITACOES_INATIVAS_TEMPORARIAMENTE:
          this.props
            .getDietaEspecialInativasTemporariamente(instituicao.uuid)
            .then(response => {
              this.setState({
                solicitacoes: ajustarFormatoLog(
                  response.data.results,
                  "inativas-temp"
                ),
                count: response.data.count,
                originalCount: response.data.count,
                tipoCard: CARD_TYPE_ENUM.AGUARDANDO_ANALISE_RECLAMACAO,
                icone: ICON_CARD_TYPE_ENUM.AGUARDANDO_ANALISE_RECLAMACAO,
                titulo: "Inativas Temporariamente",
                urlPaginacao: this.retornaUrlPaginacao(
                  visao,
                  INATIVAS_TEMPORARIAMENTE_DIETA
                )
              });
            });
          this.props
            .getDietaEspecialInativasTemporariamente(instituicao.uuid, true)
            .then(response => {
              this.setState({
                listaSolicitacoesSemFiltro: ajustarFormatoLog(
                  response.data.results,
                  "inativas-temp"
                )
              });
            });
          break;
        case SOLICITACOES_INATIVAS:
          this.props.getDietaEspecialInativas &&
            this.props
              .getDietaEspecialInativas(instituicao.uuid)
              .then(response => {
                this.setState({
                  solicitacoes: ajustarFormatoLog(
                    response.data.results,
                    "inativas"
                  ),
                  count: response.data.count,
                  originalCount: response.data.count,
                  tipoCard: CARD_TYPE_ENUM.CANCELADO,
                  icone: ICON_CARD_TYPE_ENUM.CANCELADO,
                  titulo: "Inativas",
                  urlPaginacao: this.retornaUrlPaginacao(visao, INATIVAS_DIETA)
                });
              }) &&
            this.props
              .getDietaEspecialInativas(instituicao.uuid, true)
              .then(response => {
                this.setState({
                  listaSolicitacoesSemFiltro: ajustarFormatoLog(
                    response.data.results,
                    "inativas"
                  )
                });
              });
          break;
        default:
          break;
      }
    }
    if (!solicitacoesFiltrados && solicitacoes) {
      this.setState({ solicitacoesFiltrados: solicitacoes });
    }
  }

  render() {
    const {
      solicitacoesFiltrados,
      titulo,
      tipoCard,
      icone,
      count,
      tipoSolicitacao,
      listaLotes
    } = this.state;

    return (
      <div className="card mt-3">
        <div className="card-body">
          <div className="pr-3">
            <InputSearchPendencias
              voltarLink={`/`}
              filterList={this.onPesquisarChanged}
              tipoSolicitacao={tipoSolicitacao}
              listaLotes={listaLotes}
            />
          </div>
          <div className="pb-3" />
          <CardListarSolicitacoes
            titulo={titulo}
            solicitacoes={solicitacoesFiltrados ? solicitacoesFiltrados : []}
            tipo={tipoCard}
            icone={icone}
            selecionarTodos={this.selecionarTodos}
            onCheckClicked={this.onCheckClicked}
          />
          <Paginacao onChange={this.navegacaoPage} total={count} />
        </div>
      </div>
    );
  }
}

const StatusSolicitacoesDietaEspecialForm = reduxForm({
  form: "statusSolicitacoesDietaEspecial",
  enableReinitialize: true
})(StatusSolicitacoes);

const selector = formValueSelector("statusSolicitacoesDietaEspecialForm");
const mapStateToProps = state => {
  return {
    selecionar_todos: selector(state, "selecionar_todos")
  };
};

export default connect(mapStateToProps)(StatusSolicitacoesDietaEspecialForm);
