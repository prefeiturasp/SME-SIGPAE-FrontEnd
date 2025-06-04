import React, { Fragment } from "react";
import { formataMesNome } from "src/helpers/utilities";
import "./style.scss";

export const HistoricoCorrecaoEscola = ({ ...props }) => {
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
          <label className="cor-texo-periodos-corrigidos">
            <b>CORREÇÕES SOLICITADAS PELA UE:</b>
          </label>
        </div>
        {historico &&
          historico.alteracoes.map((alteracao) => {
            return alteracao.tabelas_lancamentos.map(
              (categoria, categoriaIdx) => {
                return (
                  <div className="col-12 mb-3" key={categoriaIdx}>
                    <label className="cor-texo-detalhes mb-3">
                      <b>{`Período ${alteracao.periodo_escolar} - Tabela de ${categoria.categoria_medicao}`}</b>
                    </label>
                    <ul>
                      {categoria.semanas.map((semana) => {
                        return semana.dias.map((dia, diaIdx) => {
                          return (
                            <Fragment key={diaIdx}>
                              <li className="cor-texo-detalhes">
                                <b>
                                  Semana {semana.semana} - DIA {dia.dia}:
                                </b>
                              </li>
                              <ul className="mb-5">
                                {dia.campos.map((campo, campoIdx) => {
                                  return (
                                    <Fragment key={campoIdx}>
                                      <li className="cor-texo-detalhes">
                                        {campo.campo_nome}
                                      </li>
                                      <ul>
                                        <li className="cor-texo-detalhes">
                                          <b>DE:</b> {campo.de}
                                        </li>
                                        <li className="cor-texo-detalhes">
                                          <b>PARA:</b> {campo.para}
                                        </li>
                                      </ul>
                                    </Fragment>
                                  );
                                })}
                              </ul>
                            </Fragment>
                          );
                        });
                      })}
                    </ul>
                  </div>
                );
              }
            );
          })}
      </div>
    </Fragment>
  );
};
