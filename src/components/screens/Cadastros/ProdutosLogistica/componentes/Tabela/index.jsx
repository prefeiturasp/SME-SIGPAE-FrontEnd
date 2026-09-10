import React from "react";
import { useNavigate } from "react-router-dom";

import "./style.scss";
import {
  CADASTROS,
  CONFIGURACOES,
  EDICAO_PRODUTOS,
} from "src/configs/constants";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

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
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Editar produto ${produto.nome}`}
                    onClick={() => editarProduto(produto)}
                    onKeyDown={(e) =>
                      acionaComEnterOuEspaco(e, () => editarProduto(produto))
                    }
                  >
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
