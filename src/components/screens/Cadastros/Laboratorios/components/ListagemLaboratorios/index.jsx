import {
  CADASTROS,
  CONFIGURACOES,
  EDITAR,
  CADASTRO_LABORATORIO,
  DETALHAR,
} from "src/configs/constants";
import React from "react";
import { NavLink } from "react-router-dom";
import { formatarCPFouCNPJ } from "src/helpers/utilities";

import "./styles.scss";

const ListagemLaboratorios = ({ laboratorios }) => {
  return (
    <section className="resultado-laboratorios ">
      <div className="titulo-verde">Laboratórios Cadastrados</div>
      <article>
        <div className="grid-table header-table">
          <div>Nome do Laboratório</div>
          <div>CNPJ</div>
          <div>Credenciado</div>
          <div>Ações</div>
        </div>
        {laboratorios.map((laboratorio) => {
          return (
            <>
              <div key={laboratorio.uuid} className="grid-table body-table">
                <div>{laboratorio.nome}</div>
                <div>{formatarCPFouCNPJ(laboratorio.cnpj)}</div>
                <div>{laboratorio.credenciado ? "Sim" : "Não"} </div>
                <div>
                  <NavLink
                    to={`/${CONFIGURACOES}/${CADASTROS}/${CADASTRO_LABORATORIO}/${DETALHAR}?uuid=${laboratorio.uuid}`}
                  >
                    <span className="link-acoes px-2">
                      <i title="Detalhar" className="verde fas fa-eye" />
                    </span>
                  </NavLink>
                  <NavLink
                    to={`/${CONFIGURACOES}/${CADASTROS}/${CADASTRO_LABORATORIO}/${EDITAR}?uuid=${laboratorio.uuid}`}
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

export default ListagemLaboratorios;
