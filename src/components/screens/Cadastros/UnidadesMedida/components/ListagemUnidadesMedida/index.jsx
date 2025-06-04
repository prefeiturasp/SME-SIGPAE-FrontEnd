import {
  CADASTROS,
  CONFIGURACOES,
  EDICAO_UNIDADE_MEDIDA,
} from "src/configs/constants";
import React from "react";
import { NavLink } from "react-router-dom";

import "./styles.scss";

const ListagemUnidadesMedida = ({ unidadesMedida }) => {
  return (
    <div className="container-listagem-resultados">
      <div className="titulo-verde mb-3">Unidades Cadastradas</div>
      <article>
        <div className="grid-table header-table">
          <div>Nome da Unidade de Medida</div>
          <div>Abreviação</div>
          <div>Data do Cadastro</div>
          <div>Ações</div>
        </div>
        {unidadesMedida.map((unidadeMedida) => {
          return (
            <>
              <div key={unidadeMedida.uuid} className="grid-table body-table">
                <div>{unidadeMedida.nome}</div>
                <div>{unidadeMedida.abreviacao}</div>
                <div>{unidadeMedida.criado_em.slice(0, 10)}</div>
                <div>
                  <NavLink
                    to={`/${CONFIGURACOES}/${CADASTROS}/${EDICAO_UNIDADE_MEDIDA}/?uuid=${unidadeMedida.uuid}`}
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
    </div>
  );
};

export default ListagemUnidadesMedida;
