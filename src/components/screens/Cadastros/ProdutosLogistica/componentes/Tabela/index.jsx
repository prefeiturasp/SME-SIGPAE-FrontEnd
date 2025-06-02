import React from "react";
import { useNavigate } from "react-router-dom";

import "./style.scss";
import {
  CADASTROS,
  CONFIGURACOES,
  EDICAO_PRODUTOS,
} from "src/configs/constants";

const Tabela = ({ produtos }) => {
  const navigate = useNavigate();

  const editarProduto = (produto) =>
    navigate(`/${CONFIGURACOES}/${CADASTROS}/${EDICAO_PRODUTOS}`, {
      state: {
        produto: produto,
      },
    });

  return (
    <section className="resultado-produtos">
      <div className="titulo-verde">Produtos Cadastrados</div>
      <article>
        <div className="grid-table header-table">
          <div>Nome do Produto</div>
          <div>Status</div>
          <div>Data do Cadastro</div>
          <div>Ações</div>
        </div>
        {produtos.map((produto) => {
          return (
            <>
              <div key={produto.uuid} className="grid-table body-table">
                <div>{produto.nome}</div>
                <div>{produto.status}</div>
                <div>{produto.criado_em}</div>
                <div>
                  <span onClick={() => editarProduto(produto)}>
                    <i className={`verde fas fa-edit`} />
                  </span>
                </div>
              </div>
            </>
          );
        })}
      </article>
    </section>
  );
};

export default Tabela;
