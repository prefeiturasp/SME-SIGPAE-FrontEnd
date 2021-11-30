import React from "react";
import { useHistory, NavLink } from "react-router-dom";
import "./style.scss";

export const CARD_TYPE_ENUM = {
  CANCELADO: "card-cancelled",
  PENDENTE: "card-pending",
  AUTORIZADO: "card-authorized",
  NEGADO: "card-denied",
  RECLAMACAO: "card-complained",
  AGUARDANDO_ANALISE_SENSORIAL: "card-awaiting-sensory",
  CORRECAO: "card-product-correction",
  AGUARDANDO_ANALISE_RECLAMACAO: "card-awaiting-complain"
};

export const ICON_CARD_TYPE_ENUM = {
  CANCELADO: "fa-times-circle",
  PENDENTE: "fa-exclamation-triangle",
  AUTORIZADO: "fa-check",
  NEGADO: "fa-ban",
  RECLAMACAO: "fa-bullhorn",
  AGUARDANDO_ANALISE_SENSORIAL: "fa-search",
  SUSPENSO: "fa-hand-paper",
  CORRECAO: "fa-pencil-alt",
  AGUARDANDO_ANALISE_RECLAMACAO: "fa-history"
};

export const CardStatusDeSolicitacao = props => {
  const {
    cardTitle,
    cardType,
    solicitations,
    icon,
    href,
    loading,
    hrefCard
  } = props;
  let history = useHistory();
  return (
    <div className={`card card-panel card-colored ${cardType}`}>
      <div
        className={`card-title-status ajuste-icones ${
          hrefCard ? "card-com-href" : undefined
        }`}
        onClick={() => hrefCard && history.push(hrefCard)}
      >
        <div>
          <i className={"fas " + icon} />
          {cardTitle}
        </div>
        {loading && (
          <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
        )}
        <span className="float-right my-auto">Data/Hora</span>
      </div>
      <hr />
      {solicitations.slice(0, 5).map((solicitation, key) => {
        let conferida = "";
        if (["Autorizadas", "Canceladas"].includes(cardTitle)) {
          conferida =
            solicitation.conferido || solicitation.terceirizada_conferiu_gestao
              ? "conferida"
              : "";
        }
        return (
          <NavLink
            to={solicitation.link}
            key={key}
            data-cy={`${cardType}-${key}`}
          >
            <p className={`data ${conferida}`}>
              {solicitation.text}
              <span className="float-right">{solicitation.date}</span>
            </p>
          </NavLink>
        );
      })}
      {solicitations.length > 5 && (
        <div className="container-link">
          <NavLink
            to={`${href}`}
            className="see-more"
            data-cy={`ver-mais-${cardType}`}
          >
            Ver Mais
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default CardStatusDeSolicitacao;
