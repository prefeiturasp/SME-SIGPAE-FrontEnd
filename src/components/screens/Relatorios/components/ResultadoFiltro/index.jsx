import React, { Component } from "react";
import { Botao } from "../../../../Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON,
} from "../../../../Shareable/Botao/constants";
import { toastError } from "../../../../Shareable/Toast/dialogs";
import { Paginacao } from "../../../../Shareable/Paginacao";
import "./style.scss";
import { converterDDMMYYYYparaYYYYMMDD } from "../../../../../helpers/utilities";
import { getRelatorioFiltroPorPeriodo } from "../../../../../services/relatorios";

class ResultadoFiltro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkTodos: false,
      listaSolicitacoes: null,
      pagina: false,
      index: 0,
    };
  }

  componentDidMount() {
    this.setState({ listaSolicitacoes: this.props.resultadosFiltro });
  }

  componentDidUpdate(prevProps) {
    if (this.props.resultadosFiltro !== this.state.listaSolicitacoes) {
      if (this.props.count !== prevProps.count) {
        this.setState({ index: 0, pagina: false });
      }
      if (!this.state.pagina) {
        this.setState({
          listaSolicitacoes: this.props.resultadosFiltro,
        });
      }
    }
  }

  checarTodosItens() {
    let checkTodos = this.state.checkTodos;
    checkTodos = !checkTodos;
    let listaSolicitacoes = this.state.listaSolicitacoes;
    listaSolicitacoes.forEach((item) => {
      item.check = checkTodos;
    });
    this.setState({ checkTodos, listaSolicitacoes });
  }

  setaCheckItem(index) {
    let listaSolicitacoes = this.state.listaSolicitacoes;
    listaSolicitacoes[index].check = !listaSolicitacoes[index].check;
    this.setState({ listaSolicitacoes });
  }
  navegacaoPage = (paginaSelecionanda, rangeQuantidade) => {
    const dataDe = converterDDMMYYYYparaYYYYMMDD(this.props.values.data_de);
    const dataAte = converterDDMMYYYYparaYYYYMMDD(this.props.values.data_ate);
    if (paginaSelecionanda === 1) {
      this.props
        .getPedidosESolicitacoesFiltro(this.props.values, dataDe, dataAte)
        .then((response) => {
          if (response.results.length > 0) {
            this.setState({
              listaSolicitacoes: response.results,
              pagina: true,
            });
          } else {
            toastError("Nenhum resultado encontrado!");
            this.props.renderizarRelatorio(response.results);
          }
        });
    } else {
      this.props
        .getPedidosESolicitacoesFiltroPaginacao(
          this.props.values,
          dataDe,
          dataAte,
          rangeQuantidade
        )
        .then((response) => {
          if (response.results.length > 0) {
            this.setState({
              listaSolicitacoes: response.results,
              pagina: true,
            });
          } else {
            toastError("Nenhum resultado encontrado!");
            this.props.renderizarRelatorio(response.results);
          }
        });
    }
  };

  render() {
    const { count, visao } = this.props;
    const { checkTodos, listaSolicitacoes } = this.state;
    const filtros = this.props.values;
    return (
      <section className="card">
        <section className="card-body relatorio-filtro">
          <header>Resultado</header>
          <section className="cabecalho">
            <div className="cabecalho-esquerdo">Solicitações por status</div>
            <div className="cabecalho-direito">
              <section>
                <Botao
                  className="ml-2"
                  style={BUTTON_STYLE.BLUE_OUTLINE}
                  icon={BUTTON_ICON.PRINT}
                  texto={"Imprimir"}
                  onClick={() => getRelatorioFiltroPorPeriodo(filtros, visao)}
                  type={BUTTON_TYPE.BUTTON}
                />
                <Botao
                  className="ml-2"
                  style={BUTTON_STYLE.BLUE_OUTLINE}
                  icon={BUTTON_ICON.SAIR}
                  texto={"Sair"}
                  type={BUTTON_TYPE.BUTTON}
                  onClick={() => this.props.renderizarRelatorio("sair")}
                />
              </section>
            </div>
          </section>
          {!count ? (
            <div>Nenhuma solicitação no período para estes filtros.</div>
          ) : (
            <div>
              <section className="total-pedidos">
                {count || 0} solicitações no período
              </section>
              <section className="grid-listagem-itens mb-5">
                <div
                  className="check-seleciona-todos"
                  onClick={() => this.checarTodosItens()}
                >
                  <input
                    type="checkbox"
                    name="select_all"
                    value="select_all_check"
                    checked={checkTodos}
                  />
                  <label>Selecionar todos</label>
                </div>

                <section className="cabecalho-listagem mt-2">
                  <div>Data/Hora da solicitação</div>
                  <div>N° solicitação</div>
                  <div>Tipo de solicitação</div>
                  <div>Quantidade de alunos</div>
                </section>
                <section className="corpo-listagem mt-2">
                  {listaSolicitacoes === null ? (
                    <div>Carregando</div>
                  ) : (
                    listaSolicitacoes.map((item, index) => {
                      return (
                        <div className="linha-dado" key={index}>
                          <div className="input-check">
                            <div
                              className="check-item"
                              onClick={() => this.setaCheckItem(index)}
                            >
                              <input
                                type="checkbox"
                                name="select_all"
                                value="select_all_check"
                                checked={item.check}
                              />
                              <label />
                            </div>
                          </div>
                          <div className="grid-detalhe-item">
                            <div>{item.criado_em}</div>
                            <div>{item.id_externo}</div>
                            <div>{item.desc_doc}</div>
                            <div>
                              {item.tipo_doc === "SUSP_ALIMENTACAO"
                                ? "------"
                                : item.numero_alunos}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </section>
                <Paginacao onChange={this.navegacaoPage} total={count} />
              </section>
            </div>
          )}
        </section>
      </section>
    );
  }
}

export default ResultadoFiltro;
