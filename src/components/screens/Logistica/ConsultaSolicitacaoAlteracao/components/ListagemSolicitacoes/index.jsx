import React from "react";

import "./styles.scss";
import AlimentosConsolidado from "../AlimentosConsolidado";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

const ListagemSolicitacoes = ({ solicitacoes, ativos, setAtivos }) => {
  return (
    <section className="resultado-busca-solicitacao-alteracao">
      <header>Solicitações Disponibilizadas</header>
      <article>
        <div className="grid-table header-table">
          <div>N° da Solicitação de Alteração</div>
          <div>Nº da Requisição de Entrega</div>
          <div>Qtde. de Guias Remessa</div>
          <div>Nome do Distribuidor</div>
          <div>Status</div>
          <div>Data de Entrega</div>
          <div />
        </div>
        {solicitacoes.map((solicitacao) => {
          const bordas =
            ativos && ativos.includes(solicitacao.uuid)
              ? "desativar-borda"
              : "";
          const icone =
            ativos && ativos.includes(solicitacao.uuid) ? "minus" : "plus";
          const alternarExpansao = () => {
            ativos && ativos.includes(solicitacao.uuid)
              ? setAtivos(ativos.filter((el) => el !== solicitacao.uuid))
              : setAtivos(
                  ativos ? [...ativos, solicitacao.uuid] : [solicitacao.uuid],
                );
          };
          return (
            <>
              <div className="grid-table body-table">
                <div className={`${bordas}`}>
                  {solicitacao.numero_solicitacao}
                </div>
                <div className={`${bordas}`}>
                  {solicitacao.requisicao.numero_solicitacao}
                </div>
                <div className={`${bordas}`}>{solicitacao.qtd_guias}</div>
                <div className={`${bordas}`}>
                  {solicitacao.nome_distribuidor}
                </div>
                <div className={`${bordas}`}>{solicitacao.status}</div>
                <div className={`${bordas}`}>{solicitacao.data_entrega}</div>
                <div>
                  <i
                    className={`fas fa-${icone}`}
                    role="button"
                    tabIndex={0}
                    aria-expanded={Boolean(
                      ativos && ativos.includes(solicitacao.uuid),
                    )}
                    aria-label={`Alimentos da solicitação ${solicitacao.numero_solicitacao}`}
                    onClick={alternarExpansao}
                    onKeyDown={(e) =>
                      acionaComEnterOuEspaco(e, alternarExpansao)
                    }
                  />
                </div>
              </div>
              {ativos && ativos.includes(solicitacao.uuid) && (
                <section className="resultado-busca-detalhe pb-3 pt-3">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col">
                        <b>Data de Solicitação de Alteração: </b>{" "}
                        {solicitacao.criado_em}
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col">
                        <b>Motivo</b> <br />
                        {solicitacao.motivo.replace(",", " /")}
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col">
                        <b>Justificativa da Solicitação</b> <br />
                        {solicitacao.justificativa}
                      </div>
                    </div>
                    {solicitacao.justificativa_aceite && (
                      <div className="row mt-2">
                        <div className="col">
                          <b>Justificativa de Aceite</b> <br />
                          {solicitacao.justificativa_aceite}
                        </div>
                      </div>
                    )}
                    {solicitacao.justificativa_negacao && (
                      <div className="row mt-2">
                        <div className="col">
                          <b>Justificativa de negação</b> <br />
                          {solicitacao.justificativa_negacao}
                        </div>
                      </div>
                    )}

                    <div>
                      <AlimentosConsolidado solicitacao={solicitacao} />
                    </div>
                  </div>
                </section>
              )}
            </>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemSolicitacoes;
