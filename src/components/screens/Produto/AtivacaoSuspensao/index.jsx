import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { getProdutosListagem } from "src/services/produto.service";
import { deepEqual, gerarParametrosConsulta } from "src/helpers/utilities";
import Botao from "src/components/Shareable/Botao";
import LabelResultadoDaBusca from "src/components/Shareable/LabelResultadoDaBusca";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import FormBuscaProduto from "./FormBuscaProduto";
import { ATIVACAO_DE_PRODUTO, GESTAO_PRODUTO } from "src/configs/constants";
import "./style.scss";
import { Paginacao } from "src/components/Shareable/Paginacao";

const TabelaProdutos = ({ filtros, produtos }) => {
  let arrayDeProdutosRenderizados = [];
  const checaStatus = (produto) => {
    let retorno =
      (produto.ultima_homologacao.status === "CODAE_HOMOLOGADO" ||
        produto.ultima_homologacao.status ===
          "ESCOLA_OU_NUTRICIONISTA_RECLAMOU") &&
      !arrayDeProdutosRenderizados.includes(produto.id_externo);
    arrayDeProdutosRenderizados.push(produto.id_externo);
    if (filtros && filtros.status.length === 1) {
      if (
        deepEqual(filtros.status, ["CODAE_SUSPENDEU"]) &&
        produto.ultima_homologacao.status === "CODAE_HOMOLOGADO"
      ) {
        retorno = false;
      }
    }

    return retorno;
  };

  const nomeDaColunaEditais = (filtros) => {
    let nome = "Editais";
    if (filtros && filtros.status.length === 1) {
      if (deepEqual(filtros.status, ["CODAE_SUSPENDEU"])) {
        nome += " suspensos";
      } else {
        nome += " ativos";
      }
    }

    return nome;
  };

  if (!produtos) return false;
  return (
    <section className="mb-3">
      <section>
        <div className="tabela-ativacao-suspensao-produto tabela-header-ativacao-suspensao-produto">
          <div>Nome do Produto</div>
          <div>Marca</div>
          <div>Fabricante</div>
          <div>Status</div>
          <div>{nomeDaColunaEditais(filtros)}</div>
          <div />
        </div>
      </section>
      {produtos.map((produto, index) => {
        return (
          <div key={index}>
            <div className="tabela-ativacao-suspensao-produto tabela-body-ativacao-suspensao-produto item-ativacao-suspensao-produto">
              <div>{produto.nome}</div>
              <div>{produto.marca.nome}</div>
              <div>{produto.fabricante.nome}</div>
              {checaStatus(produto) ? (
                <>
                  <div>Ativo</div>
                  <div>{produto.vinculos_produto_edital_ativos || " -- "}</div>
                  <div>
                    <Link
                      to={`/${GESTAO_PRODUTO}/${ATIVACAO_DE_PRODUTO}/detalhe?id=${produto.ultima_homologacao.uuid}`}
                    >
                      <Botao
                        type={BUTTON_TYPE.BUTTON}
                        texto="Visualizar"
                        icon={undefined}
                        style={BUTTON_STYLE.GREEN}
                      />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div>Suspenso</div>
                  <div>
                    {produto.vinculos_produto_edital_suspensos || " -- "}
                  </div>
                  <div>
                    <Link
                      to={`/${GESTAO_PRODUTO}/${ATIVACAO_DE_PRODUTO}/detalhe?id=${produto.ultima_homologacao.uuid}&suspenso=true`}
                    >
                      <Botao
                        type={BUTTON_TYPE.BUTTON}
                        texto="Visualizar"
                        icon={undefined}
                        style={BUTTON_STYLE.GREEN}
                      />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};

const AtivacaoSuspencaoProduto = () => {
  const [produtos, setProdutos] = useState(null);
  const [filtros, setFiltros] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [page, setPage] = useState(1);
  const [produtosCount, setProdutosCount] = useState(0);

  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!filtros) return;
    async function fetchData() {
      setCarregando(true);
      const params = gerarParametrosConsulta({
        ...filtros,
        page: page,
        page_size: PAGE_SIZE,
      });
      const response = await getProdutosListagem(params);
      setCarregando(false);
      setProdutos(response.data.results);
      setProdutosCount(response.data.count);
    }
    fetchData();
  }, [filtros, setProdutos, page]);

  const onSubmitForm = (formValues) => {
    setPage(1);
    const status = [];
    switch (formValues.status) {
      case "ativo":
        status.push("CODAE_HOMOLOGADO");
        break;
      case "suspenso":
        status.push("CODAE_SUSPENDEU", "CODAE_AUTORIZOU_RECLAMACAO");
        break;
      default:
        status.push(
          "CODAE_HOMOLOGADO",
          "CODAE_SUSPENDEU",
          "CODAE_AUTORIZOU_RECLAMACAO"
        );
    }
    setFiltros({ ...formValues, status });
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 screen-ativacao-suspensao-produto">
        <div className="card-body">
          <FormBuscaProduto
            onSubmit={onSubmitForm}
            onAtualizaProdutos={() => {}}
            exibirBotaoVoltar
          />
        </div>
        {produtos && !produtos.length && (
          <div className="text-center mt-5">
            Não existem dados para filtragem informada
          </div>
        )}

        {produtos && produtosCount > 0 && (
          <div className="container-tabela">
            <LabelResultadoDaBusca filtros={filtros} />
            <TabelaProdutos filtros={filtros} produtos={produtos} />
            <Paginacao
              className="mt-3 mb-3"
              current={page}
              total={produtosCount}
              showSizeChanger={false}
              onChange={(page) => {
                setPage(page);
              }}
              pageSize={PAGE_SIZE}
            />
          </div>
        )}
      </div>
    </Spin>
  );
};

export default AtivacaoSuspencaoProduto;
