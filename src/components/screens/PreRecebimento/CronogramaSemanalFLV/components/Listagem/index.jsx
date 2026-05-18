import React from "react";

import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  usuarioEhEmpresaFornecedor,
  formataMilharDecimal,
} from "src/helpers/utilities";
import { Tooltip } from "antd";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { formataNome } from "./helpers";
import {
  PRE_RECEBIMENTO,
  ALTERAR_CRONOGRAMA_SEMANAL,
  DETALHE_CRONOGRAMA_SEMANAL,
  CADASTRO_CRONOGRAMA_SEMANAL,
} from "src/configs/constants";
import { imprimirCronogramaSemanal } from "src/services/cronogramaSemanal.service";

const ListagemCronogramas = ({ cronogramas, ativos, setCarregando }) => {
  const ehFornecedor = usuarioEhEmpresaFornecedor();

  const statusValue = (status) => {
    if (status === "Enviado ao Fornecedor" && ehFornecedor) {
      return "Recebido";
    } else {
      return status;
    }
  };

  const baixarPDFCronogramaSemanal = (cronograma) => {
    setCarregando(true);
    let uuid = cronograma.uuid;
    let numero = cronograma.numero;
    imprimirCronogramaSemanal(uuid, numero)
      .catch((error) =>
        error.response.data.text().then((text) => toastError(text)),
      )
      .finally(() => {
        setCarregando(false);
      });
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
        <div
          className={`grid-table header-table ${ehFornecedor ? "sem-fornecedor" : ""}`}
        >
          <div>N° do Cronograma Ponto a Ponto</div>
          <div>Nome do Produto</div>
          <div>Quantidade</div>
          {!ehFornecedor && <div>Fornecedor</div>}
          <div>Status</div>
          <div>Ações</div>
        </div>
        {cronogramas.map((cronograma, index) => {
          const bordas =
            ativos && ativos.includes(cronograma.uuid) ? "desativar-borda" : "";
          return (
            <div key={`${cronograma.numero}_${index}`}>
              <div
                className={`grid-table body-table ${ehFornecedor ? "sem-fornecedor" : ""}`}
              >
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
                {!ehFornecedor && (
                  <div className={bordas}>
                    {cronograma.empresa ? cronograma.empresa : undefined}
                  </div>
                )}
                <div className={bordas}>{statusValue(cronograma.status)}</div>

                <div className={bordas}>
                  {cronograma.status === "Rascunho" ? (
                    <NavLink
                      className="float-start"
                      to={`/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA_SEMANAL}?uuid=${cronograma.uuid}`}
                    >
                      <span className="link-acoes green">
                        <i className="fas fa-edit" title="Editar" />
                      </span>
                    </NavLink>
                  ) : (
                    <>
                      <NavLink
                        className="float-start"
                        to={`/${PRE_RECEBIMENTO}/${DETALHE_CRONOGRAMA_SEMANAL}?uuid=${cronograma.uuid}`}
                      >
                        <span className="link-acoes green">
                          {ehFornecedor &&
                          cronograma.status === "Enviado ao Fornecedor" ? (
                            <i
                              className="fas fa-file-signature"
                              title="Assinar"
                            />
                          ) : (
                            <i className="fas fa-eye" title="Detalhar" />
                          )}
                        </span>
                      </NavLink>
                      {cronograma.status === "Fornecedor Ciente" && (
                        <>
                          <span
                            data-testid={`imprimir_${index}`}
                            className="float-start ms-1 link-acoes green"
                            onClick={() =>
                              baixarPDFCronogramaSemanal(cronograma)
                            }
                          >
                            <i className="fas fa-print" title="Imprimir" />
                          </span>
                          {!ehFornecedor && (
                            <NavLink
                              className="float-start ms-1"
                              to={`/${PRE_RECEBIMENTO}/${ALTERAR_CRONOGRAMA_SEMANAL}?uuid=${cronograma.uuid}`}
                            >
                              <span className="link-acoes laranja">
                                <i className="fas fa-edit" title="Editar" />
                              </span>
                            </NavLink>
                          )}
                        </>
                      )}
                    </>
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
