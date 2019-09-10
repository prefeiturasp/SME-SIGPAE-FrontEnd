import React from "react";
import { NavLink } from "react-router-dom";
import "./style.scss";

export const CARD_TYPE_ENUM = {
  CANCELADO: "card-cancelled",
  PENDENTE: "card-pending",
  APROVADO: "card-authorized",
  NEGADO: "card-denied"
};

export const CardStatusDeSolicitacao = props => {
  const { cardTitle, cardType, solicitations, icon, href, loading } = props;
  return (
    <div className={"card card-panel " + cardType}>
      <div className="card-title-status ajuste-icones">
        <div>
          <i className={"fas " + icon} />
          {cardTitle}
        </div>
        {loading && (
          <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
        )}
      </div>
      <hr />
      {solicitations.slice(0, 3).map((solicitation, key) => {
        return (
          <p className="data">
            {solicitation.text}
            <span className="float-right">{solicitation.date}</span>
          </p>
        );
      })}
      {solicitations.length > 3 && (
        <NavLink to={`${href}`} className="see-more">
          Ver Mais
        </NavLink>
      )}
    </div>
  );
};

export default CardStatusDeSolicitacao;
