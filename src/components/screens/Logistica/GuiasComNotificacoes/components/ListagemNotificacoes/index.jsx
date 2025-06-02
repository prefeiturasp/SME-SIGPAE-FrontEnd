import {
  ANALISAR_ASSINAR,
  DETALHAR_NOTIFICACAO,
  LOGISTICA,
  NOTIFICAR_EMPRESA,
} from "src/configs/constants";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

import "./styles.scss";
import { EDITAR_NOTIFICACAO } from "src/configs/constants";
import { usuarioComAcessoTelaDetalharNotificacaoOcorrencia } from "src/helpers/utilities";

const ListagemNotificacoes = ({ notificacoes, fiscal, somenteLeitura }) => {
  const navigate = useNavigate();

  const renderizarBotoesDeAcoes = (notificacao) => {
    const botaoRascunho = (
      <span
        className="link-acoes px-2"
        onClick={() =>
          navigate(
            {
              pathname: `/${LOGISTICA}/${EDITAR_NOTIFICACAO}`,
            },
            {
              state: {
                guia: notificacao,
              },
            }
          )
        }
      >
        <i title="Editar Rascunho" className="verde fas fa-edit" />
      </span>
    );

    const botaoVisualizarNotificacao = (
      <NavLink
        to={`/${LOGISTICA}/${DETALHAR_NOTIFICACAO}?uuid=${notificacao.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Notificação" className="fas fa-eye green" />
        </span>
      </NavLink>
    );

    const botaoNotificarEmpresaHabilitado = (
      <NavLink
        to={`/${LOGISTICA}/${NOTIFICAR_EMPRESA}?uuid=${notificacao.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Notificação" className="fas fa-bell green" />
        </span>
      </NavLink>
    );

    const botaoNotificarEmpresaDesabilitado = (
      <span className="link-acoes px-2">
        <i title="Notificação Enviada" className="fas fa-bell" />
      </span>
    );

    const botaoAssinarEnviarFiscal = (
      <NavLink
        to={`/${LOGISTICA}/${ANALISAR_ASSINAR}?uuid=${notificacao.uuid}`}
      >
        <span className="link-acoes px-2">
          <i
            className="fas fa-file-signature green"
            title="Analisar e Assinar"
          />
        </span>
      </NavLink>
    );

    const status = notificacao.status.toUpperCase();

    if (somenteLeitura) {
      if (
        status === "NOTIFICAÇÃO ENVIADA FISCAL" &&
        usuarioComAcessoTelaDetalharNotificacaoOcorrencia()
      ) {
        return botaoVisualizarNotificacao;
      }
    } else {
      return fiscal ? (
        <>
          {status === "NOTIFICAÇÃO ENVIADA FISCAL" && botaoAssinarEnviarFiscal}
        </>
      ) : (
        <>
          {status === "RASCUNHO" && botaoRascunho}
          {status === "NOTIFICAÇÃO ENVIADA FISCAL" ? (
            <>
              {usuarioComAcessoTelaDetalharNotificacaoOcorrencia() &&
                botaoVisualizarNotificacao}
              {botaoNotificarEmpresaDesabilitado}
            </>
          ) : (
            ["RASCUNHO", "NOTIFICAÇÃO CRIADA"].includes(status) &&
            botaoNotificarEmpresaHabilitado
          )}
        </>
      );
    }
  };

  return (
    <section className="resultado-guias-notificacoes">
      <div className="titulo-verde">Lista de Notificações</div>
      <article>
        <div className="grid-table header-table">
          <div>Nº da Notificação</div>
          <div>Empresa</div>
          <div>Status da Notificação</div>
          <div>Número SEI</div>
          <div>Ações</div>
        </div>
        {notificacoes.map((notificacao) => {
          return (
            <>
              <div key={notificacao.uuid} className="grid-table body-table">
                <div>{notificacao.numero}</div>
                <div>{notificacao.nome_empresa}</div>
                <div>{notificacao.status}</div>
                <div>
                  {notificacao.processo_sei ? notificacao.processo_sei : "--"}
                </div>
                <div>{renderizarBotoesDeAcoes(notificacao)}</div>
              </div>
            </>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemNotificacoes;
