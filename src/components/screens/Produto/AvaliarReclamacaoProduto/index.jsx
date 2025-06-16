import { Spin } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigationType } from "react-router-dom";
import { bindActionCreators } from "redux";

import FormBuscaProduto from "src/components/screens/Produto/Reclamacao/components/FormBuscaProduto";
import TabelaProdutos from "./components/TabelaProdutos";

import { deepCopy, gerarParametrosConsulta } from "src/helpers/utilities";
import { formatarValues } from "./helpers";

import {
  reset,
  setProdutos,
  setIndiceProdutoAtivo,
  setProdutosCount,
  setPage,
} from "src/reducers/avaliarReclamacaoProduto";

import {
  getProdutosAvaliacaoReclamacao,
  getHomologacao,
  getNomesTerceirizadas,
} from "src/services/produto.service";
import "./style.scss";
import { Paginacao } from "src/components/Shareable/Paginacao";

export const AvaliarReclamacaoProduto = ({
  setPropsPageProduto,
  reset,
  produtos,
  setProdutos,
  produtosCount,
  setProdutosCount,
  page,
  setPage,
  indiceProdutoAtivo,
  setIndiceProdutoAtivo,
}) => {
  const [loading, setLoading] = useState(true);
  const [erroNaAPI, setErroNaAPI] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [terceirizadas, setTerceirizadas] = useState(null);
  const PAGE_SIZE = 10;

  const navigationType = useNavigationType();

  useEffect(() => {
    if (formValues) {
      setLoading(true);
      const values_ = deepCopy(formValues);
      const params = gerarParametrosConsulta({
        ...formatarValues(values_),
        page_size: PAGE_SIZE,
        page: page,
      });
      getProdutosAvaliacaoReclamacao(params).then((response) => {
        setProdutos(response.data.results);
        setProdutosCount(response.data.count);
        setLoading(false);
        setIndiceProdutoAtivo(undefined);
      });
    }
  }, [formValues, page]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    if (navigationType === "PUSH") {
      reset();
    }
    if (uuid) {
      getHomologacao(uuid)
        .then((response) => {
          setLoading(false);
          setPropsPageProduto(response.data.produto);
          setProdutos([response.data.produto]);
          setIndiceProdutoAtivo(0);
        })
        .catch(() => {
          setLoading(false);
          setErroNaAPI(true);
        });
    } else {
      setLoading(false);
    }
    getNomesTerceirizadas().then((response) => {
      setTerceirizadas(response.data.results);
    });
  }, []);

  const onSubmit = (values) => {
    setLoading(true);
    setFormValues(deepCopy(values));
    setPage(page ? page : 1);
  };

  return (
    <Spin tip="Carregando..." spinning={loading}>
      <div className="card avaliar-reclamacao-produto">
        <div className="card-body">
          {erroNaAPI && (
            <div>Erro ao carregar dados de Homologação de Produto</div>
          )}
          {!erroNaAPI && (
            <Fragment>
              <FormBuscaProduto
                onSubmit={onSubmit}
                formName="avaliarReclamacaoProduto"
              />
              {produtos && produtos.length > 0 && (
                <Fragment>
                  <div className="label-resultados-busca">
                    {formValues && formValues.nome_produto
                      ? `Veja os resultados para: "${formValues.nome_produto}"`
                      : "Veja os resultados para a busca:"}
                  </div>
                  <TabelaProdutos
                    listaProdutos={produtos}
                    atualizar={() => onSubmit(formValues)}
                    indiceProdutoAtivo={indiceProdutoAtivo}
                    setIndiceProdutoAtivo={setIndiceProdutoAtivo}
                    setLoading={setLoading}
                    terceirizadas={terceirizadas}
                  />
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page || 1}
                    total={produtosCount}
                    showSizeChanger={false}
                    onChange={(page) => {
                      setPage(page);
                    }}
                    pageSize={PAGE_SIZE}
                  />
                </Fragment>
              )}
              {produtos && produtos.length === 0 && formValues !== null && (
                <div className="text-center mt-5">
                  A consulta retornou 0 resultados.
                </div>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </Spin>
  );
};

const mapStateToProps = (state) => {
  return {
    indiceProdutoAtivo: state.avaliarReclamacaoProduto.indiceProdutoAtivo,
    produtos: state.avaliarReclamacaoProduto.produtos,
    produtosCount: state.avaliarReclamacaoProduto.produtosCount,
    page: state.avaliarReclamacaoProduto.page,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setIndiceProdutoAtivo,
      setProdutos,
      setProdutosCount,
      setPage,
      reset,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvaliarReclamacaoProduto);
