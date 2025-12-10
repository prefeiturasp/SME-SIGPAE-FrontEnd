import React from "react";

import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  CADASTRO_CRONOGRAMA,
  DETALHE_CRONOGRAMA,
  PRE_RECEBIMENTO,
  EDITAR,
  ALTERACAO_CRONOGRAMA,
} from "src/configs/constants";
import {
  usuarioEhCronograma,
  usuarioEhEmpresaFornecedor,
  formataMilhar,
} from "src/helpers/utilities";
import { deParaStatusCronograma } from "../Filtros/utils";
import { Tooltip } from "antd";
import { formataNome } from "./helpers";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { imprimirCronograma } from "src/services/cronograma.service";
import {
  usuarioEhCodaeDilog,
  usuarioEhDilogDiretoria,
  usuarioEhDilogAbastecimento,
} from "../../../../../../helpers/utilities";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

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
      .catch((error) =>
        error.response.data.text().then((text) => toastError(text)),
      )
      .finally(() => {
        setCarregando(false);
      });
  };

  const getAssinarEnviar = (cronograma) => {
    return (
      (usuarioEhEmpresaFornecedor() &&
        cronograma.status === "Assinado e Enviado ao Fornecedor") ||
      (usuarioEhDilogAbastecimento() &&
        cronograma.status === "Assinado Fornecedor") ||
      (usuarioEhDilogDiretoria() &&
        cronograma.status === "Assinado Abastecimento")
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
          <div>Empresa</div>
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
                  <div className={bordas}>{cronograma.numero}</div>
                  <div className="d-flex align-items-center justify-content-between">
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
                    {cronograma.ficha_tecnica?.programa === "LEVE_LEITE" && (
                      <TagLeveLeite />
                    )}
                  </div>
                  <div className={bordas}>
                    {cronograma.qtd_total_programada &&
                      formataMilhar(cronograma.qtd_total_programada)}{" "}
                    {cronograma.unidade_medida?.abreviacao}
                  </div>
                  <div className={bordas}>
                    {cronograma.empresa
                      ? cronograma.empresa.nome_fantasia
                      : undefined}
                  </div>
                  <div className={bordas}>
                    {cronograma.armazem
                      ? cronograma.armazem.nome_fantasia
                      : undefined}
                  </div>
                  <div className={bordas}>
                    {deParaStatusCronograma(statusValue(cronograma.status))}
                  </div>

                  <div className={bordas}>
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
                              data-testid={`imprimir_${index}`}
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
                          {(usuarioEhCronograma() || usuarioEhCodaeDilog()) && (
                            <NavLink
                              className="float-start"
                              to={`/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA}/${EDITAR}?uuid=${cronograma.uuid}`}
                            >
                              <span className="link-acoes green">
                                <i className="fas fa-edit" title="Editar" />
                              </span>
                            </NavLink>
                          )}
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
