import React, { useState } from "react";

import "./styles.scss";
import {
  CONFERENCIA_GUIA,
  LOGISTICA,
  REPOSICAO_GUIA,
  DETALHAMENTO_GUIA,
} from "src/configs/constants";
import { NavLink } from "react-router-dom";
import { imprimirGuiaRemessa } from "src/services/logistica.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { Spin, Tooltip } from "antd";
import ModalEdicao from "../ModalEdicao";
import TooltipIcone from "src/components/Shareable/TooltipIcone";

const ListagemSolicitacoes = ({ guias }) => {
  const [carregando, setCarregando] = useState(false);

  const checaReposicao = (guia) => {
    let alimentosPendentes = guia.alimentos.filter((alimento) => {
      return (
        alimento.embalagens.filter((embalagem) => embalagem.qtd_a_receber !== 0)
          .length > 0
      );
    });
    return alimentosPendentes.length > 0;
  };

  const baixarPDFGuiaRemessa = (guia) => {
    setCarregando(true);
    let uuid = guia.uuid;
    let numero = guia.numero_guia;
    imprimirGuiaRemessa(uuid, numero)
      .then(() => {
        setCarregando(false);
      })
      .catch((error) => {
        error.response.data.text().then((text) => toastError(text));
        setCarregando(false);
      });
  };

  const retornaBotaoAcao = (guia) => {
    if (
      ["Recebimento parcial", "Não recebida"].includes(guia.status) &&
      checaReposicao(guia) &&
      guia.situacao === "ATIVA"
    ) {
      return (
        <>
          <NavLink
            className="float-start"
            to={`/${LOGISTICA}/${REPOSICAO_GUIA}?uuid=${guia.uuid}`}
          >
            <span className="link-acoes green">Reposição</span>
          </NavLink>
        </>
      );
    } else if (
      ["Pendente de conferência", "Insucesso de entrega"].includes(
        guia.status
      ) &&
      guia.situacao === "ATIVA"
    ) {
      return (
        <>
          <NavLink
            className="float-start"
            to={`/${LOGISTICA}/${CONFERENCIA_GUIA}?uuid=${guia.uuid}`}
          >
            <span className="link-acoes green">Conferir entrega</span>
          </NavLink>
        </>
      );
    }
  };
  const retornaBotaoEdicao = (guia, exibir) => {
    if (exibir) {
      const editarConferencia = (
        <>
          <NavLink
            className="float-start"
            to={`/${LOGISTICA}/${CONFERENCIA_GUIA}?uuid=${guia.uuid}&editar=true`}
          >
            <span className="link-acoes green">Editar Conferência</span>
          </NavLink>
          | &nbsp;
        </>
      );

      const editarReposicao = (
        <>
          <NavLink
            className="float-start"
            to={`/${LOGISTICA}/${REPOSICAO_GUIA}?uuid=${guia.uuid}&editar=true`}
          >
            <span className="link-acoes green">Editar Reposição</span>
          </NavLink>
          | &nbsp;
        </>
      );

      if (
        ["Recebida", "Recebimento parcial", "Não recebida"].includes(
          guia.status
        ) &&
        guia.situacao === "ATIVA"
      ) {
        return editarConferencia;
      } else if (
        ["Reposição total", "Reposição parcial"].includes(guia.status) &&
        guia.situacao === "ATIVA"
      ) {
        return [<ModalEdicao uuid={guia.uuid} key={0} />, editarReposicao];
      }
    }
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <section className="resultado-conferir-entrega">
        <article>
          <div className="grid-table header-table">
            <div>Número da Guia</div>
            <div>Nome do Distribuidor</div>
            <div>Data de entrega</div>
            <div>Status de Entrega</div>
            <div>Conferência de Entregas</div>
            <div>Opções</div>
          </div>
          {guias.map((guia) => {
            return (
              <>
                <div key={guia.uuid} className="grid-table body-table">
                  <div>{guia.numero_guia}</div>
                  <div>{guia.nome_distribuidor}</div>
                  <div>{guia.data_entrega}</div>
                  <div>
                    {guia.status}
                    {guia.status === "Insucesso de entrega" && (
                      <TooltipIcone tooltipText="Não foi possível o distribuidor realizar a entrega, por motivo externo" />
                    )}
                  </div>
                  <div>
                    {retornaBotaoEdicao(guia, false)}
                    {retornaBotaoAcao(guia)}
                  </div>
                  <div className="opcoes-entregas">
                    <span className="link-acoes px-2">
                      <NavLink
                        className="float-start"
                        to={`/${LOGISTICA}/${DETALHAMENTO_GUIA}?uuid=${guia.uuid}`}
                      >
                        <Tooltip title="Detalhar guia">
                          <i className="fas fa-eye" />
                        </Tooltip>
                      </NavLink>
                    </span>
                    <span
                      className="link-acoes"
                      onClick={() => baixarPDFGuiaRemessa(guia)}
                    >
                      <Tooltip title="Imprimir guia">
                        <i className="fas fa-print" />
                      </Tooltip>
                    </span>
                  </div>
                </div>
              </>
            );
          })}
        </article>
      </section>
    </Spin>
  );
};

export default ListagemSolicitacoes;
