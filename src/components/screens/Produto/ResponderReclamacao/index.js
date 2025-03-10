import { Spin } from "antd";
import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { Link, useNavigationType } from "react-router-dom";
import { bindActionCreators } from "redux";
import { gerarParametrosConsulta } from "helpers/utilities";

import Botao from "components/Shareable/Botao";
import LabelResultadoDaBusca from "components/Shareable/LabelResultadoDaBusca";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";

import {
  reset,
  setProdutos,
  setAtivos,
  setPage,
  setProdutosCount,
} from "reducers/responderReclamacaoProduto";

import { getReclamacoesTerceirizadaPorFiltro } from "services/produto.service";

import Reclamacao from "./Reclamacao";
import FormBuscaProduto from "./FormBuscaProduto";

import { getStatus } from "./helpers.js";
import "./style.scss";
import { Paginacao } from "components/Shareable/Paginacao";

const TabelaProdutos = ({
  produtos,
  filtros,
  setProdutos,
  setCarregando,
  ativos,
  setAtivos,
}) => {
  return (
    <>
      <LabelResultadoDaBusca filtros={filtros} />
      <section className="tabela-resultado-consultar-reclamacao-produto mb-3">
        <div className="table-grid table-header">
          <div className="table-header-cell">Nome do Produto</div>
          <div className="table-header-cell">Marca</div>
          <div className="table-header-cell">Tipo</div>
          <div className="table-header-cell">Qtde. Reclamações</div>
          <div className="table-header-cell">Data de Cadastro</div>
          <div />
        </div>
        {produtos.map((produto, indexProduto) => {
          const bordas = ativos.includes(indexProduto) ? "desativar-borda" : "";
          const icone = ativos.includes(indexProduto)
            ? "angle-up"
            : "angle-down";

          return (
            <Fragment key={indexProduto}>
              <div className="tabela-produto tabela-body-produto item-produto">
                <div className="table-grid table-body">
                  <div className={`table-body-cell ${bordas}`}>
                    {produto.nome}
                  </div>
                  <div className={`table-body-cell ${bordas}`}>
                    {produto.marca.nome}
                  </div>
                  <div className={`table-body-cell ${bordas}`}>
                    {produto.eh_para_alunos_com_dieta ? "D. Especial" : "Comum"}
                  </div>
                  <div className={`table-body-cell ${bordas}`}>
                    {produto.qtde_questionamentos}
                  </div>

                  <div
                    className={`table-body-cell ${bordas} d-flex justify-content-between`}
                  >
                    {produto.criado_em.split(" ")[0]}
                  </div>
                  <div
                    className={`table-body-cell ${bordas} d-flex justify-content-between`}
                  >
                    <i
                      className={`fas fa-${icone} me-3`}
                      onClick={() => {
                        ativos.includes(indexProduto)
                          ? setAtivos(
                              ativos.filter((el) => el !== indexProduto)
                            )
                          : setAtivos([...ativos, indexProduto]);
                      }}
                    />
                  </div>
                </div>
              </div>
              {ativos.includes(indexProduto) && (
                <Fragment key={indexProduto}>
                  <div className="mt-2 text-end">
                    <Link
                      to={`/gestao-produto/relatorio?uuid=${produto.ultima_homologacao.uuid}`}
                    >
                      <Botao
                        texto="Ver produto"
                        type={BUTTON_TYPE.SUBMIT}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        className="ms-3 me-3"
                      />
                    </Link>
                  </div>
                  <hr />

                  {produto.ultima_homologacao.reclamacoes.map(
                    (reclamacao, indexReclamacao, arr) => {
                      const deveMostrarBarraHorizontal =
                        indexReclamacao < arr.length - 1;
                      return [
                        <Reclamacao
                          key={indexReclamacao}
                          indexReclamacao={indexReclamacao + 1}
                          indexProduto={indexProduto}
                          reclamacao={reclamacao}
                          setAtivos={setAtivos}
                          setProdutos={setProdutos}
                          produtos={produtos}
                          produto={produto}
                          setCarregando={setCarregando}
                          rastro_terceirizada={
                            produto.ultima_homologacao.rastro_terceirizada
                          }
                        />,
                        deveMostrarBarraHorizontal && <hr />,
                      ];
                    }
                  )}

                  <div className="mt-4 mb-5"> &nbsp;</div>
                </Fragment>
              )}
            </Fragment>
          );
        })}
      </section>
    </>
  );
};

const ResponderReclamacaoProduto = ({
  produtos,
  setProdutos,
  ativos,
  setAtivos,
  reset,
  page,
  produtosCount,
  setProdutosCount,
  setPage,
}) => {
  const [filtros, setFiltros] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [filtrarUUID, setFiltrarUUID] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");
  const PAGE_SIZE = 10;

  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "PUSH") {
      reset();
    }
    if (!filtros && !uuid) return;
    async function fetchData() {
      setCarregando(true);
      setProdutos(null);
      let response = {};

      if (filtrarUUID && uuid) {
        setFiltrarUUID(false);
        const params = gerarParametrosConsulta({
          ...getStatus(filtros),
          page: 1,
          uuid: uuid,
          page_size: PAGE_SIZE,
        });
        response = await getReclamacoesTerceirizadaPorFiltro(params);
        setAtivos([0]);
      } else {
        const params = gerarParametrosConsulta({
          ...getStatus(filtros),
          page: page,
          page_size: PAGE_SIZE,
        });
        response = await getReclamacoesTerceirizadaPorFiltro(params);
        setAtivos([]);
      }
      setProdutos(response.data.results);
      setProdutosCount(response.data.count);
      setCarregando(false);
    }
    fetchData();
  }, [filtros, page]);

  const onSubmitForm = (formValues) => {
    setFiltros({ ...formValues });
    setPage(1);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 screen-responder-reclamacao-produto">
        <div className="card-body">
          {filtrarUUID && (
            <FormBuscaProduto
              onSubmit={onSubmitForm}
              onAtualizaProdutos={() => {}}
              exibirBotaoVoltar
              exibirStatus={false}
            />
          )}
        </div>
        {produtos && !produtos.length && (
          <div className="text-center mt-5">
            A consulta retornou 0 resultados.
          </div>
        )}
        {produtos && produtos.length > 0 && (
          <div className="container-tabela">
            <>
              <TabelaProdutos
                produtos={produtos}
                filtros={filtros}
                setProdutos={setProdutos}
                setCarregando={setCarregando}
                ativos={ativos}
                setAtivos={setAtivos}
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
            </>
          </div>
        )}
      </div>
    </Spin>
  );
};

const mapStateToProps = (state) => {
  return {
    ativos: state.responderReclamacaoProduto.ativos,
    produtos: state.responderReclamacaoProduto.produtos,
    produtosCount: state.responderReclamacaoProduto.produtosCount,
    page: state.responderReclamacaoProduto.page,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setAtivos,
      setPage,
      setProdutosCount,
      setProdutos,
      reset,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResponderReclamacaoProduto);
