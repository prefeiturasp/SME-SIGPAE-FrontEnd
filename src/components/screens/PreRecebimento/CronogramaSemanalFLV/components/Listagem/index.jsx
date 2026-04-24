import React from "react";

import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  usuarioEhEmpresaFornecedor,
  formataMilharDecimal,
} from "src/helpers/utilities";
import { Tooltip } from "antd";
import { formataNome } from "./helpers";
import {
  PRE_RECEBIMENTO,
  DETALHE_CRONOGRAMA_SEMANAL,
} from "src/configs/constants";

const ListagemCronogramas = ({ cronogramas, ativos }) => {
  const statusValue = (status) => {
    if (
      status === "Assinado e Enviado ao Fornecedor" &&
      usuarioEhEmpresaFornecedor()
    ) {
      return "Recebido";
    } else {
      return status;
    }
  };

  return (
    <section className="resultado-cronograma-semanal mt-5">
      <header>
        <div className="row">
          <div className="col-5">
            <p className="titulo-grid-alunos-matriculados">
              Resultados da Pesquisa
            </p>
          </div>
        </div>
      </header>
      <article>
        <div className="grid-table header-table">
          <div>N° do Cronograma Ponto a Ponto</div>
          <div>Nome do Produto</div>
          <div>Quantidade</div>
          <div>Fornecedor</div>
          <div>Status</div>
          <div>Ações</div>
        </div>
        {cronogramas.map((cronograma, index) => {
          const bordas =
            ativos && ativos.includes(cronograma.uuid) ? "desativar-borda" : "";
          return (
            <div key={`${cronograma.numero}_${index}`}>
              <div className="grid-table body-table">
                <div className={bordas}>{cronograma.numero}</div>
                <div className="d-flex align-items-center justify-content-between">
                  <Tooltip
                    color="#42474a"
                    overlayStyle={{
                      maxWidth: "320px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                    title={cronograma.produto}
                  >
                    {cronograma.produto && formataNome(cronograma.produto)}
                  </Tooltip>
                </div>
                <div className={bordas}>
                  {cronograma.quantidade_total &&
                    formataMilharDecimal(cronograma.quantidade_total)}{" "}
                  {cronograma.unidade_medida}
                </div>
                <div className={bordas}>
                  {cronograma.empresa ? cronograma.empresa : undefined}
                </div>
                <div className={bordas}>{statusValue(cronograma.status)}</div>

                <div className={bordas}>
                  {cronograma.status !== "Rascunho" && (
                    <NavLink
                      className="float-start"
                      to={`/${PRE_RECEBIMENTO}/${DETALHE_CRONOGRAMA_SEMANAL}?uuid=${cronograma.uuid}`}
                    >
                      <span className="link-acoes green">
                        <i className="fas fa-eye" title="Detalhar" />
                      </span>
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemCronogramas;
