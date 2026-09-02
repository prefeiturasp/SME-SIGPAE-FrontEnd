import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import {
  POS_RECEBIMENTO,
  DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO,
} from "src/configs/constants";

import "./styles.scss";

import { TermoRecebimentoListagem } from "../../interfaces";

interface Props {
  objetos: Array<TermoRecebimentoListagem>;
  fornecedor?: boolean;
}

const deParaStatusFornecedor = (objeto: TermoRecebimentoListagem): string => {
  if (objeto.status === "ASSINADO_FORNECEDOR") {
    return "Assinado";
  }
  if (
    [
      "ENVIADO_FISCAIS",
      "ENVIADO_DILOG",
      "ENVIADO_COORDENADOR",
      "ENVIADO_FORNECEDOR",
    ].includes(objeto.status)
  ) {
    return "Recebido";
  }
  return objeto.status_display ?? "";
};

const Listagem: React.FC<Props> = ({ objetos, fornecedor }) => {
  const renderizarAcoes = (objeto: TermoRecebimentoListagem): ReactElement => {
    const botaoDetalhar = (
      <NavLink
        className="float-start"
        to={`/${POS_RECEBIMENTO}/${DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO}?uuid=${objeto.uuid}`}
      >
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
        <i
          className="fas fa-print"
          title={fornecedor ? "Imprimir" : "Baixar PDF"}
        />
      </span>
    );

    if (fornecedor) {
      const assinado = objeto.status === "ASSINADO_FORNECEDOR";
      return (
        <div className="d-flex">
          {botaoDetalhar}
          {assinado && botaoImprimir}
          {assinado && botaoAlterar}
        </div>
      );
    }

    return (
      <div className="d-flex">
        {botaoDetalhar}
        {botaoImprimir}
        {botaoAlterar}
      </div>
    );
  };

  return (
    <div className="listagem-termos-recebimento">
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
          {fornecedor ? <div>Produtos</div> : <div>Empresa Contratada</div>}
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
                  {fornecedor
                    ? objeto.produtos && objeto.produtos.join(", ")
                    : objeto.nome_empresa}
                </div>
                <div>{objeto.data_cadastro}</div>
                <div>
                  {fornecedor
                    ? deParaStatusFornecedor(objeto)
                    : objeto.status_display}
                </div>
                <div className="p-0">{renderizarAcoes(objeto)}</div>
              </div>
            </>
          );
        })}
      </article>
    </div>
  );
};

export default Listagem;
