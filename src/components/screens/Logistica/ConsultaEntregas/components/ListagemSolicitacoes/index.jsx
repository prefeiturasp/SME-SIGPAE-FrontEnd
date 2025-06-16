import React, { useState } from "react";

import "./styles.scss";
import FiltrosExcel from "../FiltrosRelatorios";

import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import TooltipIcone from "src/components/Shareable/TooltipIcone";

const ListagemSolicitacoes = ({
  solicitacoes,
  ativos,
  setAtivos,
  dilog,
  dre,
}) => {
  const [showDownload, setShowDownload] = useState(false);

  return (
    <>
      <ModalSolicitacaoDownload show={showDownload} setShow={setShowDownload} />
      <section
        className={`resultado-busca-entregas ${
          dilog || dre ? "dilog" : "distribuidor"
        }`}
      >
        <article>
          <div className={`grid-table header-table top-header`}>
            <div className={dilog || dre ? "colspan-3" : "colspan-2"} />
            <div className="colspan-4">Guias de Remessa</div>
            <div className="colspan-2">Exportar</div>
            <div className="colspan-1" />
          </div>
          <div className="grid-table header-table">
            <div>Requisição</div>
            {(dilog || dre) && <div>Distribuidor</div>}
            <div>Data de Entrega</div>
            <div>Quantidade</div>
            <div>Conferidas</div>
            <div>
              <span>
                Insucessos de <br />
                Entrega
                <TooltipIcone
                  tooltipText={
                    "Não foi possível o distribuidor realizar a entrega, por motivo externo."
                  }
                />
              </span>
            </div>
            <div>
              <span>
                Pendentes de <br />
                Conferência
                <TooltipIcone
                  tooltipText={
                    "Guias de remessa disponibilizadas, porém pendentes de conferência pela Unidade Educacional."
                  }
                />
              </span>
            </div>
            <div>Relatório</div>
            <div>Requisição</div>
            <div />
          </div>
          {solicitacoes.map((solicitacao) => {
            const bordas =
              ativos && ativos.includes(solicitacao.uuid)
                ? "desativar-borda"
                : "";
            const icone =
              ativos && ativos.includes(solicitacao.uuid) ? "minus" : "plus";
            return (
              <>
                <div className="grid-table body-table">
                  <div className={`${bordas}`}>
                    {solicitacao.numero_solicitacao}
                  </div>
                  {(dilog || dre) && (
                    <div className={`${bordas}`}>
                      {solicitacao.distribuidor_nome}
                    </div>
                  )}
                  <div className={`${bordas}`}>{solicitacao.data_entrega}</div>
                  <div className={`${bordas}`}>{solicitacao.qtd_guias}</div>
                  <div className={`${bordas}`}>
                    {solicitacao.guias_parciais +
                      solicitacao.guias_recebidas +
                      solicitacao.guias_nao_recebidas +
                      solicitacao.guias_reposicao_parcial +
                      solicitacao.guias_reposicao_total}
                  </div>
                  <div className={`${bordas}`}>
                    {solicitacao.guias_insucesso}
                  </div>
                  <div className={`${bordas}`}>
                    {solicitacao.guias_pendentes}
                  </div>

                  <div>
                    <FiltrosExcel
                      solicitacao={solicitacao}
                      excel={true}
                      showModal={setShowDownload}
                    />
                  </div>
                  <div>
                    <FiltrosExcel
                      solicitacao={solicitacao}
                      pdf={true}
                      showModal={setShowDownload}
                    />
                  </div>
                  <div>
                    <i
                      className={`fas fa-${icone} expand`}
                      onClick={() => {
                        ativos && ativos.includes(solicitacao.uuid)
                          ? setAtivos(
                              ativos.filter((el) => el !== solicitacao.uuid)
                            )
                          : setAtivos(
                              ativos
                                ? [...ativos, solicitacao.uuid]
                                : [solicitacao.uuid]
                            );
                      }}
                    />
                  </div>
                </div>
                {ativos && ativos.includes(solicitacao.uuid) && (
                  <>
                    <section className="resultado-busca-detalhe pb-3">
                      <div className="container-fluid">
                        <strong className="mb-2">
                          Detalhes das Guias Conferidas:{" "}
                        </strong>
                        <div className="card-container">
                          <div className="card-status">
                            <div className="card-content recebidas">
                              <div>Recebidas:</div>
                              <div>{solicitacao.guias_recebidas}</div>
                            </div>
                          </div>

                          <div className="card-status">
                            <div className="card-content parciais">
                              <div>Parciais:</div>
                              <div>{solicitacao.guias_parciais}</div>
                            </div>
                          </div>

                          <div className="card-status">
                            <div className="card-content nao-recebidas">
                              <div>Não Recebidas:</div>
                              <div>{solicitacao.guias_nao_recebidas}</div>
                            </div>
                          </div>

                          <div className="card-status">
                            <div className="card-content repo-parcial">
                              <div>Reposição Parcial:</div>
                              <div>{solicitacao.guias_reposicao_parcial}</div>
                            </div>
                          </div>

                          <div className="card-status">
                            <div className="card-content repo-total">
                              <div>Reposição Total:</div>
                              <div>{solicitacao.guias_reposicao_total}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </>
            );
          })}
        </article>
      </section>
    </>
  );
};

export default ListagemSolicitacoes;
