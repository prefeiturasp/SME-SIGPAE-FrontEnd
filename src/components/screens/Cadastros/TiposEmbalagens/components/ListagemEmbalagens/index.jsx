import {
  CADASTROS,
  CONFIGURACOES,
  EDITAR,
  CADASTRO_TIPO_EMBALAGEM,
} from "src/configs/constants";
import React from "react";
import { NavLink } from "react-router-dom";

import "./styles.scss";

const ListagemTiposEmbalagens = ({ embalagens }) => {
  return (
    <section className="resultado-embalagens">
      <div className="titulo-verde">Tipos de Embalagens Cadastradas</div>
      <article>
        <div className="grid-table header-table">
          <div>Tipos de Embalagens</div>
          <div>Abreviação</div>
          <div>Data do Cadastro</div>
          <div>Ações</div>
        </div>
        {embalagens.map((embalagem) => {
          return (
            <>
              <div key={embalagem.uuid} className="grid-table body-table">
                <div>{embalagem.nome}</div>
                <div>{embalagem.abreviacao}</div>
                <div>{embalagem.criado_em.slice(0, 10)}</div>
                <div>
                  <NavLink
                    to={`/${CONFIGURACOES}/${CADASTROS}/${CADASTRO_TIPO_EMBALAGEM}/${EDITAR}?uuid=${embalagem.uuid}`}
                  >
                    <span className="link-acoes px-2">
                      <i title="Editar" className="verde fas fa-edit" />
                    </span>
                  </NavLink>
                </div>
              </div>
            </>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemTiposEmbalagens;
