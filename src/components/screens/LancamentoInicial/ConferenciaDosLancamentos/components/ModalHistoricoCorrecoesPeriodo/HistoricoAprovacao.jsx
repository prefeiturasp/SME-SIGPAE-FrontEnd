import React, { Fragment } from "react";
import { formataMesNome } from "src/helpers/utilities";
import "./style.scss";

export const HistoricoAprovacao = ({ ...props }) => {
  const {
    solicitacao,
    historico,
    retornaIniciais,
    formatarTitulo,
    instituicao,
  } = props;

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
            <b>
              {instituicao(historico.acao)} aprovou o lançamento dos períodos
            </b>
          </label>
        </div>
        <div className="col-12">
          <ul>
            {historico &&
              historico.alteracoes.map((alteracao, alteracaoIdx) => {
                return (
                  <li className="ms-3 cor-texo-detalhes" key={alteracaoIdx}>
                    <b>{alteracao.periodo_escolar}</b>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};
