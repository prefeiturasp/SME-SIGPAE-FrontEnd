import { Spin } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

import FormBuscaProduto from "./components/FormBuscaProduto";
import TabelaProdutos from "./components/TabelaProdutos";

import {
  reset,
  setIndiceProdutoAtivo,
  setPage,
  setProdutos,
  setProdutosCount
} from "reducers/reclamacaoProduto";

import { getProdutosPorParametros } from "services/produto.service";

import "./style.scss";
import { Paginacao } from "components/Shareable/Paginacao";

class ReclamacaoProduto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      formValues: undefined
    };
    this.TAMANHO_PAGINA = 10;
  }
  UNSAFE_componentWillMount() {
    const { history, reset } = this.props;
    if (history && history.action === "PUSH") {
      reset();
    }

    const parameters = new URLSearchParams(window.location.search);
    const nome_produto = parameters.get("nome_produto");
    const marca_produto = parameters.get("marca_produto");
    const fabricante_produto = parameters.get("fabricante_produto");
    const parametrosBusca = {
      nome_produto: nome_produto,
      nome_marca: marca_produto,
      nome_fabricante: fabricante_produto
    };
    this.onSubmitFormBuscaProduto(parametrosBusca);
  }

  onAtualizarProduto = page => {
    this.setState({
      loading: true,
      error: ""
    });
    this.atualizaListaProdutos(this.state.formValues, page);
  };

  atualizaListaProdutos = async (formValues, page) => {
    const response = await getProdutosPorParametros(
      formValues,
      page,
      this.TAMANHO_PAGINA
    );
    this.setState({ loading: false });
    if (response.status === 200) {
      this.props.setIndiceProdutoAtivo(0);
      this.props.setProdutos(response.data.results);
      this.props.setProdutosCount(response.data.count);
    }
  };

  onSubmitFormBuscaProduto = formValues => {
    this.setState({
      formValues,
      loading: true,
      error: ""
    });
    try {
      this.atualizaListaProdutos(formValues);
    } catch (e) {
      this.setState({ error: "Erro ao consultar a lista de produtos." });
    }
  };

  render() {
    const {
      produtos,
      produtosCount,
      setProdutos,
      indiceProdutoAtivo,
      setIndiceProdutoAtivo,
      formValues,
      page,
      setPage
    } = this.props;
    return (
      <Spin tip="Carregando..." spinning={this.state.loading}>
        <div className="card mt-3 page-reclamacao-produto">
          <div className="card-body">
            <FormBuscaProduto
              novaReclamacao
              formName="reclamacao"
              onSubmit={this.onSubmitFormBuscaProduto}
              onAtualizaProdutos={produtos => setProdutos(produtos)}
            />

            {produtos && produtos.length > 0 && (
              <>
                <div className="label-resultados-busca">
                  {formValues && formValues.nome_produto
                    ? `Veja os resultados para: "${formValues.nome_produto}"`
                    : "Veja os resultados para a busca:"}
                </div>
                <TabelaProdutos
                  listaProdutos={produtos}
                  onAtualizarProduto={this.onAtualizarProduto}
                  indiceProdutoAtivo={indiceProdutoAtivo}
                  setIndiceProdutoAtivo={setIndiceProdutoAtivo}
                />
                <Paginacao
                  className="mt-3 mb-3"
                  current={page || 1}
                  total={produtosCount}
                  showSizeChanger={false}
                  onChange={page => {
                    setPage(page);
                    this.onAtualizarProduto(page);
                  }}
                  pageSize={this.TAMANHO_PAGINA}
                />
              </>
            )}
            {produtos && produtos.length === 0 && formValues !== undefined && (
              <div className="text-center mt-5">
                A consulta retornou 0 resultados.
              </div>
            )}
          </div>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => {
  return {
    indiceProdutoAtivo: state.reclamacaoProduto.indiceProdutoAtivo,
    produtos: state.reclamacaoProduto.produtos,
    produtosCount: state.reclamacaoProduto.produtosCount,
    page: state.reclamacaoProduto.page,
    formValues: state.finalForm.reclamacao
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setIndiceProdutoAtivo,
      setPage,
      setProdutos,
      setProdutosCount,
      reset
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReclamacaoProduto)
);
