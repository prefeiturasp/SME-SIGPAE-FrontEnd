import React from "react";

import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  CADASTRO_CRONOGRAMA,
  DETALHE_CRONOGRAMA,
  PRE_RECEBIMENTO,
  EDITAR,
  ALTERACAO_CRONOGRAMA,
} from "configs/constants";
import {
  usuarioEhCronograma,
  usuarioEhEmpresaFornecedor,
  formataMilhar,
} from "helpers/utilities";
import { deParaStatusCronograma } from "../Filtros/utils";
import { Tooltip } from "antd";
import { formataNome } from "./helpers";
import { toastError } from "components/Shareable/Toast/dialogs";
import { imprimirCronograma } from "services/cronograma.service";
import {
  usuarioEhCodaeDilog,
  usuarioEhDilogDiretoria,
  usuarioEhDinutreDiretoria,
} from "../../../../../../helpers/utilities";

const ListagemCronogramas = ({ cronogramas, ativos, setCarregando }) => {
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

  const baixarPDFCronograma = (cronograma) => {
    setCarregando(true);
    let uuid = cronograma.uuid;
    let numero = cronograma.numero;
    imprimirCronograma(uuid, numero)
      .then(() => {
        setCarregando(false);
      })
      .catch((error) => {
        error.response.data.text().then((text) => toastError(text));
        setCarregando(false);
      });
  };

  const getAssinarEnviar = (cronograma) => {
    return (
      (usuarioEhEmpresaFornecedor() &&
        cronograma.status === "Assinado e Enviado ao Fornecedor") ||
      (usuarioEhDinutreDiretoria() &&
        cronograma.status === "Assinado Fornecedor") ||
      (usuarioEhDilogDiretoria() && cronograma.status === "Assinado Dinutre")
    );
  };

  return (
    <section className="resultado-cronograma-de-entrega mt-5">
      <header>
        <div className="row">
          <div className="col-5">
            <p className="titulo-grid-alunos-matriculados">
              Resultados da Pesquisa
            </p>
          </div>
          <div className="col-7 text-end">
            <p className="helper-grid-alunos-matriculados">
              <i className="fa fa-info-circle me-2" />
              Veja a descrição do produto passando o mouse sobre o nome.
            </p>
          </div>
        </div>
      </header>
      <article>
        <div className="grid-table header-table">
          <div>N° do Cronograma</div>
          <div>Produto</div>
          <div>Quantidade</div>
          <div>Armazém</div>
          <div>Status</div>
          <div>Ações</div>
        </div>
        {cronogramas.map((cronograma, index) => {
          const bordas =
            ativos && ativos.includes(cronograma.uuid) ? "desativar-borda" : "";
          return (
            <div key={`${cronograma.numero}_${index}`}>
              {((usuarioEhEmpresaFornecedor() &&
                cronograma.status !== "Rascunho") ||
                !usuarioEhEmpresaFornecedor()) && (
                <div className="grid-table body-table">
                  <div className={`${bordas}`}>{cronograma.numero}</div>
                  <div className={`${bordas}`}>
                    <Tooltip
                      color="#42474a"
                      overlayStyle={{
                        maxWidth: "320px",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                      title={cronograma.ficha_tecnica?.produto?.nome}
                    >
                      {cronograma.ficha_tecnica?.produto?.nome &&
                        formataNome(cronograma.ficha_tecnica?.produto?.nome)}
                    </Tooltip>
                  </div>
                  <div className={`${bordas}`}>
                    {cronograma.qtd_total_programada &&
                      formataMilhar(cronograma.qtd_total_programada)}
                  </div>
                  <div className={`${bordas}`}>
                    {cronograma.armazem
                      ? cronograma.armazem.nome_fantasia
                      : undefined}
                  </div>
                  <div className={`${bordas}`}>
                    {deParaStatusCronograma(statusValue(cronograma.status))}
                  </div>

                  <div className={`${bordas}`}>
                    <>
                      {cronograma.status !== "Rascunho" ? (
                        <>
                          <NavLink
                            className="float-start"
                            to={`/${PRE_RECEBIMENTO}/${DETALHE_CRONOGRAMA}?uuid=${cronograma.uuid}`}
                          >
                            <span className="link-acoes green">
                              {getAssinarEnviar(cronograma) ? (
                                <i
                                  className="fas fa-file-signature"
                                  title="Assinar"
                                />
                              ) : (
                                <i className="fas fa-eye" title="Detalhar" />
                              )}
                            </span>
                          </NavLink>

                          {cronograma.status === "Assinado CODAE" && (
                            <span
                              className="float-start ms-1 link-acoes green"
                              onClick={() => baixarPDFCronograma(cronograma)}
                            >
                              <i className="fas fa-print" title="Imprimir" />
                            </span>
                          )}
                          {cronograma.status === "Assinado CODAE" &&
                            (usuarioEhEmpresaFornecedor() ||
                              usuarioEhCronograma() ||
                              usuarioEhCodaeDilog()) && (
                              <NavLink
                                className="float-start ms-1"
                                to={`/${PRE_RECEBIMENTO}/${ALTERACAO_CRONOGRAMA}?uuid=${cronograma.uuid}`}
                              >
                                <span className="link-acoes laranja">
                                  <i className="fas fa-edit" title="Alterar" />
                                </span>
                              </NavLink>
                            )}
                        </>
                      ) : (
                        <>
                          {usuarioEhCronograma() ||
                            (usuarioEhCodaeDilog() && (
                              <NavLink
                                className="float-start"
                                to={`/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA}/${EDITAR}?uuid=${cronograma.uuid}`}
                              >
                                <span className="link-acoes green">
                                  <i className="fas fa-edit" title="Editar" />
                                </span>
                              </NavLink>
                            ))}
                        </>
                      )}
                    </>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemCronogramas;
