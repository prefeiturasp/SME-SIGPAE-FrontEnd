import React, { ReactElement, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  POS_RECEBIMENTO,
  DETALHAR_TERMO_RECEBIMENTO_PROVISORIO,
} from "src/configs/constants";
import {
  acionaComEnterOuEspaco,
  usuarioPodeBaixarTermoRecebimentoProvisorio,
} from "src/helpers/utilities";
import { imprimirTermoRecebimentoProvisorio } from "src/services/posRecebimento.service";

import "./styles.scss";

import { TermoRecebimentoListagem } from "../../interfaces";
import { STATUS_ASSINATURAS_CONCLUIDAS } from "../../constants";

interface Props {
  objetos: Array<TermoRecebimentoListagem>;
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
  const [uuidEmDownload, setUuidEmDownload] = useState<string | null>(null);
  const podeBaixarTermo = usuarioPodeBaixarTermoRecebimentoProvisorio();

  const baixarTermoEmPdf = async (objeto: TermoRecebimentoListagem) => {
    if (uuidEmDownload) return;
    setUuidEmDownload(objeto.uuid);
    try {
      await imprimirTermoRecebimentoProvisorio(objeto.uuid);
    } finally {
      setUuidEmDownload(null);
    }
  };

  const renderizarAcoes = (objeto: TermoRecebimentoListagem): ReactElement => {
    const botaoDetalhar = (
      <NavLink
        className="float-start"
        to={`/${POS_RECEBIMENTO}/${DETALHAR_TERMO_RECEBIMENTO_PROVISORIO}?uuid=${objeto.uuid}`}
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

    const baixando = uuidEmDownload === objeto.uuid;
    const botaoImprimir = (
      <span
        className="float-start ms-1 link-acoes green"
        role="button"
        tabIndex={0}
        aria-label="Termo em PDF"
        onClick={() => baixarTermoEmPdf(objeto)}
        onKeyDown={(e) =>
          acionaComEnterOuEspaco(e, () => baixarTermoEmPdf(objeto))
        }
        data-testid="btnImprimir"
      >
        <i
          className={`fas ${baixando ? "fa-spinner fa-spin" : "fa-print"}`}
          title="Termo em PDF"
        />
      </span>
    );

    if (fornecedor) {
      const assinado = objeto.status === "ASSINADO_FORNECEDOR";
      return (
        <div className="d-flex">
          {botaoDetalhar}
          {assinado && botaoAlterar}
        </div>
      );
    }

    const assinaturasConcluidas = STATUS_ASSINATURAS_CONCLUIDAS.includes(
      objeto.status,
    );

    return (
      <div className="d-flex">
        {botaoDetalhar}
        {assinaturasConcluidas && podeBaixarTermo && botaoImprimir}
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
          <div>Empresa Contratada</div>
          <div>Data de Cadastro</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {objetos.map((objeto) => {
          return (
            <React.Fragment key={objeto.uuid}>
              <div className="grid-table body-table">
                <div>{objeto.numero_contrato}</div>
                <div
                  className={`d-flex align-items-center justify-content-between`}
                >
                  {objeto.nome_empresa}
                </div>
                <div>{objeto.data_cadastro}</div>
                <div>{objeto.status_display}</div>
                <div className="p-0">{renderizarAcoes(objeto)}</div>
              </div>
            </React.Fragment>
          );
        })}
      </article>
    </div>
  );
};

export default Listagem;
