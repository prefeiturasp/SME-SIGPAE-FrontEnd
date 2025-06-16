import React, { Fragment } from "react";
import { formataMesNome } from "src/helpers/utilities";
import "./style.scss";

export const HistoricoCorrecaoSolicitada = ({ ...props }) => {
  const { solicitacao, historico, retornaIniciais, formatarTitulo } = props;

  return (
    <Fragment>
      <div className="row mt-3">
        <div className="col-8">
          <label className="iniciais-usuario align-middle text-center me-3">
            {retornaIniciais(historico.usuario.email)}
          </label>
          <label className="cor-texo-detalhes">{historico.usuario.nome}</label>
        </div>
        <div className="col-4">
          <label className="text-end float-end cor-texo-detalhes">
            {historico.criado_em.split(" ")[0].replaceAll("-", "/")}
            <br />
            {historico.criado_em.split(" ")[1]}
          </label>
        </div>
      </div>
      <hr />
      <div className="row mb-3">
        <div className="col-12 mb-3">
          <label className="cor-texo-detalhes">
            <b>Status</b>: {formatarTitulo(historico.acao)}
          </label>
        </div>
        <div className="col-12 mb-3">
          <label className="cor-texo-detalhes">
            <b>Mês de Lançamento</b>: {formataMesNome(solicitacao.mes)}/
            {solicitacao.ano}
          </label>
        </div>
        <div className="col-12 mb-3">
          <label className="cor-texo-detalhes">
            <b>Correções Solicitadas</b>
          </label>
        </div>
        <div className="col-12">
          <table className="faixas-etarias-cei mx-auto">
            <thead>
              <tr className="row">
                <th className="col-3">PERÍODO</th>
                <th className="col-3">TABELA DE LANÇAMENTO</th>
                <th className="col-3">CORREÇÕES</th>
                <th className="col-3">OBSERVAÇÃO</th>
              </tr>
            </thead>
            <tbody>
              {historico &&
                historico.alteracoes.map((alteracao, alteracaoIdx) => {
                  return (
                    <tr key={alteracaoIdx} className="row">
                      <td className="col-3">{alteracao.periodo_escolar}</td>
                      <td colSpan={2} className="col-6 celula-transbordada">
                        {alteracao.tabelas_lancamentos.map(
                          (categoria, categoriaIdx) => {
                            return (
                              <Fragment key={categoriaIdx}>
                                <div
                                  className={`row ${
                                    alteracao.tabelas_lancamentos.length - 1 ===
                                    categoriaIdx
                                      ? ""
                                      : "divisor"
                                  }`}
                                >
                                  <div className="col-6 custom-padding borda-lateral">
                                    <span>{categoria.categoria_medicao}</span>
                                  </div>
                                  <div className="col-6 custom-padding">
                                    {categoria.semanas.map(
                                      (semana, semanaIdx) => {
                                        return (
                                          <div key={semanaIdx} className="">
                                            <p>
                                              <b>Semana:</b> {semana.semana}
                                            </p>
                                            <p>
                                              <b>Dias:</b>{" "}
                                              {semana.dias
                                                .map((dia) => dia)
                                                .join(", ")}
                                            </p>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </Fragment>
                            );
                          }
                        )}
                      </td>
                      <td className="col-3">
                        <p
                          className="cor-texo-detalhes"
                          dangerouslySetInnerHTML={{
                            __html: alteracao.justificativa,
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};
