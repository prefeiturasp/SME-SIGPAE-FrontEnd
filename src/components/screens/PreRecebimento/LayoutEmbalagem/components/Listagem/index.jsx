import React from "react";
import { NavLink } from "react-router-dom";

import {
  DETALHAR_LAYOUT_EMBALAGEM,
  CORRIGR_LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
  ATUALIZAR_LAYOUT_EMBALAGEM,
} from "src/configs/constants";

import "./styles.scss";
import { Tooltip } from "antd";
import { truncarString } from "../../../../../../helpers/utilities";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

export default ({ objetos, perfilFornecedor = false }) => {
  const renderizarStatus = (status, perfilFornecedor) => {
    return perfilFornecedor && status === "Solicitado Correção" ? (
      <span className="orange">Pendente de Correção</span>
    ) : (
      status
    );
  };

  const renderizarAcoes = (objeto) => {
    const botaoDetalharVerde = (
      <NavLink
        className="float-start"
        to={`/${PRE_RECEBIMENTO}/${DETALHAR_LAYOUT_EMBALAGEM}?uuid=${objeto.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Detalhar" className="fas fa-eye green" />
        </span>
      </NavLink>
    );

    const botaoCorrigirLaranja = (
      <NavLink
        className="float-start"
        to={`/${PRE_RECEBIMENTO}/${CORRIGR_LAYOUT_EMBALAGEM}?uuid=${objeto.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Corrigir" className="fas fa-edit orange" />
        </span>
      </NavLink>
    );

    const botaoAtualizar = (
      <NavLink
        className="float-start"
        to={`/${PRE_RECEBIMENTO}/${ATUALIZAR_LAYOUT_EMBALAGEM}?uuid=${objeto.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Atualizar Layout" className="fas fa-photo-video green" />
        </span>
      </NavLink>
    );

    return (
      <>
        {objeto.status === "Enviado para Análise" && botaoDetalharVerde}
        {objeto.status === "Solicitado Correção" && botaoCorrigirLaranja}
        {objeto.status === "Aprovado" && botaoAtualizar}
      </>
    );
  };

  return (
    <div className="listagem-layouts-embalagens">
      <header>
        <div className="row mt-3">
          <div className="col-5 px-0">
            <div className="titulo-verde">
              Layouts de Embalagens Cadastrados
            </div>
          </div>
          <div className="col-7 px-0 text-end">
            <p className="mb-0">
              <i className="fa fa-info-circle me-2" />
              Veja a descrição do produto passando o mouse sobre o nome.
            </p>
          </div>
        </div>
      </header>

      <article>
        <div className="grid-table header-table">
          <div>Nº da Ficha Técnica</div>
          <div>Nome do Produto</div>
          <div>Nº do Pregão/Chamada Pública</div>
          <div>Status</div>
          <div>Data de Cadastro</div>
          <div>Ações</div>
        </div>

        {objetos.map((objeto) => {
          return (
            <>
              <div key={objeto.uuid} className="grid-table body-table">
                <div>{objeto.numero_ficha_tecnica}</div>
                <div className="d-flex align-items-center justify-content-between">
                  <Tooltip
                    color="#42474a"
                    overlayStyle={{
                      maxWidth: "320px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                    title={objeto.nome_produto}
                  >
                    {truncarString(objeto.nome_produto, 30)}
                  </Tooltip>
                  {objeto.programa === "LEVE_LEITE" && <TagLeveLeite />}
                </div>
                <div>{objeto.pregao_chamada_publica}</div>
                <div>{renderizarStatus(objeto.status, perfilFornecedor)}</div>
                <div>{objeto.criado_em.slice(0, 10)}</div>
                <div>{renderizarAcoes(objeto)}</div>
              </div>
            </>
          );
        })}
      </article>
    </div>
  );
};
