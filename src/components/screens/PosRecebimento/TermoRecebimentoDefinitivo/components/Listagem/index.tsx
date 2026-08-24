import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import "./styles.scss";

import { TermoRecebimentoListagem } from "../../interfaces";

interface Props {
  objetos: Array<TermoRecebimentoListagem>;
}

const Listagem: React.FC<Props> = ({ objetos }) => {
  const renderizarAcoes = (): ReactElement => {
    const botaoDetalhar = (
      <NavLink className="float-start">
        <span className="link-acoes px-2">
          <i title="Detalhar" className="fas fa-eye green" />
        </span>
      </NavLink>
    );

    const botaoAlterar = (
      <NavLink className="float-start">
        <span className="link-acoes px-2">
          <i title="Alterar" className="fas fa-edit green" />
        </span>
      </NavLink>
    );

    const botaoImprimir = (
      <span
        className="float-start ms-1 link-acoes green"
        data-testid="btnImprimir"
      >
        <i className="fas fa-print" title="Baixar PDF" />
      </span>
    );

    return (
      <div className="d-flex">
        {botaoDetalhar}
        {botaoImprimir}
        {botaoAlterar}
      </div>
    );
  };

  return (
    <div className="listagem-fichas-tecnicas">
      <header>
        <div className="row mt-3">
          <div className="col-5 px-0">
            <div className="titulo-verde">Resultado da Pesquisa</div>
          </div>
        </div>
      </header>

      <article>
        <div className="grid-table header-table">
          <div>Nº do Contrato</div>
          <div>Empresa Contratada</div>
          <div>Data de Cadastro</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {objetos.map((objeto) => {
          return (
            <>
              <div key={objeto.uuid} className="grid-table body-table">
                <div>{objeto.numero_contrato}</div>
                <div
                  className={`d-flex align-items-center justify-content-between`}
                >
                  {objeto.nome_empresa}
                </div>
                <div>{objeto.data_cadastro}</div>
                <div>{objeto.status_display}</div>
                <div className="p-0">{renderizarAcoes()}</div>
              </div>
            </>
          );
        })}
      </article>
    </div>
  );
};

export default Listagem;
