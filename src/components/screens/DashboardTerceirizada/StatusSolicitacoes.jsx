import React, { Component } from "react";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import { meusDados } from "../../../services/perfil.service";
import CardListarSolicitacoes from "../../Shareable/CardListarSolicitacoes";
import { Paginacao } from "../../Shareable/Paginacao";
import { InputSearchPendencias } from "../../Shareable/InputSearchPendencias";
import { ordenaPorDate, extrairStatusDaSolicitacaoURL } from "./helper";
import { getMeusLotes } from "src/services/lote.service";
import {
  usuarioEhCogestorDRE,
  usuarioEhEmpresaTerceirizada,
} from "src/helpers/utilities";
import {
  ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS,
  TIPO_PERFIL,
} from "src/constants/shared";
import { GESTAO_PRODUTO_CARDS } from "src/configs/constants";
import {
  getHomologacoesDeProdutoPorStatusTitulo,
  getNomesUnicosEditais,
} from "src/services/produto.service";
import { resetCamposProduto } from "src/reducers/filtersProdutoReducer";

export class StatusSolicitacoes extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dadosMeus: null,
      solicitacoes: [
        {
          text: "...",
          date: "...",
          link: "...",
        },
      ],
      solicitacoesFiltrados: [
        {
          text: "...",
          date: "...",
          link: "...",
        },
      ],
      titulo: "...",
      tipoCard: "...",
      icone: "...",
      listaLotes: null,
      editais: [],
      loading: true,
      erro: false,
      currentPage: 1,
      originalCurrentPage: 1,
      count: 0,
      pageSize: 0,
      nextPage: null,
      previousPage: null,
      solicitacoesPaginaAtual: [
        {
          text: "...",
          date: "...",
          link: "...",
        },
      ],
      todasSolicitacoesCardAtual: [
        {
          text: "...",
          date: "...",
          link: "...",
        },
      ],
      solicitacoesCardRespQuest: [
        {
          text: "...",
          date: "...",
          link: "...",
        },
      ],
      originalCount: null,
      propsProdutoRedux: {},
    };
    this.typingTimeout = null;

    this.onPesquisarChanged = this.onPesquisarChanged.bind(this);
  }

  async onPesquisarChanged(values) {
    const { status, formatarDadosSolicitacao } = this.props;
    const data = {};
    let solicitacoes = [];
    let solicitacoesFiltrados = this.state.solicitacoesPaginaAtual;
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(async () => {
      if (
        (values.titulo && values.titulo.length > 2) ||
        (values.marca && values.marca.length > 2) ||
        values.edital
      ) {
        const listaStatus = Array.isArray(status) ? status : [status];
        data["titulo_produto"] = values.titulo;
        data["nome_edital"] = values.edital;
        data["nome_marca"] = values.marca;
        this.setState({
          loading: true,
        });
        const promises = listaStatus.map((status) =>
          getHomologacoesDeProdutoPorStatusTitulo(status, data)
        );
        const retornos = await Promise.all(promises);
        if (retornos[0].status === HTTP_STATUS.OK) {
          retornos.forEach(
            (retorno) =>
              (solicitacoes = solicitacoes.concat(
                formatarDadosSolicitacao(
                  retorno.data ? retorno.data.results : retorno.results,
                  null,
                  this.props.titulo
                )
              ))
          );
          solicitacoesFiltrados = solicitacoes;
          this.setState({
            count: 1,
            currentPage: 1,
            loading: false,
            solicitacoesFiltrados: solicitacoesFiltrados,
          });
        } else {
          this.setState({
            loading: false,
            erro: true,
          });
        }
      }
      if (
        values.titulo === undefined ||
        (values.titulo && values.titulo.length < 3)
      ) {
        solicitacoesFiltrados = this.state.solicitacoesPaginaAtual;
        this.setState({
          count: this.state.originalCount,
          currentPage: this.state.originalCurrentPage,
        });
      }
    }, 1000);
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
    if (values.marcaProduto && values.marcaProduto.length > 0) {
      solicitacoesFiltrados = this.filtrarMarca(
        solicitacoesFiltrados,
        values.marcaProduto
      );
    }

    if (values.editalProduto && values.editalProduto.length > 0) {
      solicitacoesFiltrados = this.filtrarEdital(
        solicitacoesFiltrados,
        values.editalProduto
      );
    }
    if (values.nomeProduto && values.nomeProduto.length > 2) {
      solicitacoesFiltrados = this.filtrarNome(
        solicitacoesFiltrados,
        values.nomeProduto
      );
    }
    this.setState({ solicitacoesFiltrados });
  }

  filtrarMarca(listaFiltro, value) {
    return listaFiltro.filter((item) =>
      item.marca.toLowerCase().includes(value.toLowerCase())
    );
  }

  filtrarEdital(listaFiltro, value) {
    return listaFiltro.filter(
      (item) =>
        item.produto_editais &&
        item.produto_editais.toLowerCase().includes(value.toLowerCase())
    );
  }

  filtrarNome(listaFiltro, value) {
    listaFiltro = listaFiltro.filter(function (item) {
      const wordToFilter = value.toLowerCase();
      return item.text.toLowerCase().search(wordToFilter) !== -1;
    });
    return listaFiltro;
  }

  filtrarStatus(listaFiltro, value) {
    if (value === "1") {
      listaFiltro = listaFiltro.filter((item) => item.conferido === true);
    }
    if (value === "0") {
      listaFiltro = listaFiltro.filter((item) => item.conferido === false);
    }
    return listaFiltro;
  }

  filtrarLote(listaFiltro, value) {
    listaFiltro = listaFiltro.filter((item) => item.lote_uuid === value);
    return listaFiltro;
  }

  navegacaoPage = async (paginaAtual) => {
    const { endpointGetSolicitacoes, formatarDadosSolicitacao, status } =
      this.props;
    const { solicitacoesCardRespQuest, pageSize, dadosMeus } = this.state;

    this.setState({
      originalCurrentPage: paginaAtual,
    });

    const listaStatus = Array.isArray(status) ? status : [status];
    let solicitacoes = [];

    if (
      this.props.titulo ===
      GESTAO_PRODUTO_CARDS.RESPONDER_QUESTIONAMENTOS_DA_CODAE
    ) {
      const solicitacoesPaginaAtual = solicitacoesCardRespQuest.slice(
        paginaAtual * pageSize - pageSize,
        paginaAtual * pageSize
      );
      this.setState({
        solicitacoesPaginaAtual: solicitacoesPaginaAtual,
        solicitacoesFiltrados: solicitacoesPaginaAtual,
        currentPage: paginaAtual,
        loading: false,
      });
      return;
    }

    try {
      this.setState({
        loading: true,
      });
      const promises = listaStatus.map((status) =>
        endpointGetSolicitacoes(
          status || dadosMeus.vinculo_atual.instituicao.uuid,
          [
            "Autorizadas",
            "Negadas",
            "Canceladas",
            "Questionamentos da CODAE",
          ].includes(this.props.titulo)
            ? { limit: 100, offset: (paginaAtual - 1) * 100 }
            : paginaAtual
        )
      );
      const retornos = await Promise.all(promises);
      retornos.forEach(
        (retorno) =>
          (solicitacoes = solicitacoes.concat(
            formatarDadosSolicitacao(
              retorno.data ? retorno.data.results : retorno.results,
              null,
              this.props.titulo
            )
          ))
      );

      this.setState({
        nextPage: retornos[0].data.next,
        previousPage: retornos[0].data.previous,
      });
    } catch {
      this.setState({
        loading: false,
        erro: true,
      });
    }
    this.setState({
      solicitacoesPaginaAtual: solicitacoes,
      solicitacoesFiltrados: solicitacoes,
      currentPage: paginaAtual,
      loading: false,
    });
  };

  async componentDidMount() {
    const { endpointGetSolicitacoes, formatarDadosSolicitacao, status } =
      this.props;
    const listaStatus = Array.isArray(status) ? status : [status];
    const { erro, loading, currentPage } = this.state;
    const url = window.location.href;
    let tipoSolicitacao = extrairStatusDaSolicitacaoURL(url);
    this.setState({ tipoSolicitacao });
    const dadosMeus = await meusDados();
    this.setState({ dadosMeus });

    const terceirizadaUUID = dadosMeus.vinculo_atual.instituicao.uuid;
    let solicitacoes = [];
    const { marcaProduto, editalProduto, nomeProduto } = this.props;
    const propsProduto = {
      marcaProduto: this.props.marcaProduto || "",
      editalProduto: this.props.editalProduto || "",
      nomeProduto: this.props.nomeProduto || "",
    };
    this.setState({ propsProdutoRedux: propsProduto });

    if (marcaProduto || editalProduto || nomeProduto) {
      this.onPesquisarChanged({
        marca: propsProduto.marcaProduto || "",
        edital: propsProduto.editalProduto || "",
        titulo: propsProduto.nomeProduto || "",
      });
    } else {
      try {
        const promises = listaStatus.map((status) =>
          endpointGetSolicitacoes(status || terceirizadaUUID, currentPage)
        );
        const retornos = await Promise.all(promises);
        retornos.forEach(
          (retorno) =>
            (solicitacoes = solicitacoes.concat(
              formatarDadosSolicitacao(
                retorno.data ? retorno.data.results : retorno.results,
                null,
                this.props.titulo
              )
            ))
        );
        this.setState({
          count: retornos[0].data.count,
          pageSize: retornos[0].data.page_size,
          nextPage: retornos[0].data.next,
          originalCount: retornos[0].data.count,
          loading: false,
        });
      } catch (e) {
        this.setState({
          loading: false,
          erro: true,
        });
      }
    }
    this.props.resetCamposProduto();

    if (solicitacoes.length > 0 && !erro && loading) {
      this.setState({ loading: false });
    }
    solicitacoes = solicitacoes.sort(ordenaPorDate);
    if (usuarioEhEmpresaTerceirizada() || usuarioEhCogestorDRE()) {
      await getMeusLotes().then((response) => {
        this.setState({
          listaLotes: [{ nome: "Selecione um lote", uuid: "" }].concat(
            response.data.results
          ),
        });
      });
    }
    this.setState({
      solicitacoes,
      solicitacoesFiltrados: solicitacoes,
      solicitacoesPaginaAtual: solicitacoes,
    });

    const listaEditais = await getNomesUnicosEditais();
    let listaRsultados = listaEditais.data.results;
    let listaFormatada = listaRsultados.map((element) => {
      return { value: element, label: element };
    });
    this.setState({ editais: listaFormatada });
  }

  cardResponderQuestionamentosCodae = (solicitacoes) => {
    const nomeUsuario = localStorage.getItem("nome");
    const tipoPerfil = localStorage.getItem("tipo_perfil");
    if (tipoPerfil === TIPO_PERFIL.TERCEIRIZADA) {
      return solicitacoes
        .filter(
          (solicitacao) =>
            ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_PEDIU_ANALISE_RECLAMACAO.toUpperCase() ===
            solicitacao.status
        )
        .sort(ordenaPorDate);
    } else if (tipoPerfil === TIPO_PERFIL.ESCOLA) {
      return solicitacoes
        .filter(
          (solicitacao) =>
            nomeUsuario === `"${solicitacao.nome_usuario_log_de_reclamacao}"` &&
            ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_QUESTIONOU_UE.toUpperCase() ===
              solicitacao.status
        )
        .sort(ordenaPorDate);
    } else if (tipoPerfil === TIPO_PERFIL.SUPERVISAO_NUTRICAO) {
      return solicitacoes
        .filter(
          (solicitacao) =>
            ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_QUESTIONOU_NUTRISUPERVISOR.toUpperCase() ===
            solicitacao.status
        )
        .sort(ordenaPorDate);
    }
  };

  render() {
    const {
      solicitacoesFiltrados,
      tipoSolicitacao,
      listaLotes,
      loading,
      erro,
      count,
      pageSize,
      editais,
      currentPage,
      propsProdutoRedux,
    } = this.state;
    const { titulo, tipoCard, icone } = this.props;
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="card mt-3">
          <div className="card-body">
            {!erro ? (
              <Spin tip="Carregando..." spinning={loading}>
                <div className="pe-3">
                  <InputSearchPendencias
                    voltarLink={`/`}
                    filterList={this.onPesquisarChanged}
                    tipoSolicitacao={tipoSolicitacao}
                    listaLotes={listaLotes}
                    editais={editais}
                    disabled={loading}
                    propsProduto={propsProdutoRedux}
                  />
                </div>
                <div className="pb-3" />
                <CardListarSolicitacoes
                  titulo={titulo}
                  solicitacoes={solicitacoesFiltrados}
                  tipo={tipoCard}
                  icone={icone}
                />
                {!loading &&
                  solicitacoesFiltrados &&
                  solicitacoesFiltrados.length === 0 && (
                    <div>Não há solicitações neste status</div>
                  )}
                <Paginacao
                  onChange={this.navegacaoPage}
                  total={count}
                  pageSize={
                    window.location.pathname.includes("gestao-produto")
                      ? 10
                      : pageSize
                  }
                  current={currentPage}
                />
              </Spin>
            ) : (
              <div>Erro ao carregar as Solicitações</div>
            )}
          </div>
        </div>
      </form>
    );
  }
}

const StatusSolicitacoesForm = reduxForm({
  form: "statusSolicitacoes",
  enableReinitialize: true,
})(StatusSolicitacoes);

const selector = formValueSelector("statusSolicitacoesForm");
const mapStateToProps = (state) => {
  const marcaProduto = state.filtersProduto.marcaProduto;
  const editalProduto = state.filtersProduto.editalProduto;
  const nomeProduto = state.filtersProduto.nomeProduto;
  return {
    selecionar_todos: selector(state, "selecionar_todos"),
    marcaProduto: marcaProduto,
    editalProduto: editalProduto,
    nomeProduto: nomeProduto,
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetCamposProduto: () => dispatch(resetCamposProduto()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusSolicitacoesForm);
