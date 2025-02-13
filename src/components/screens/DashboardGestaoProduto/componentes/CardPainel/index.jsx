import React from "react";
import { NavLink } from "react-router-dom";
import { LinhasProdutos } from "../LinhaProduto";

export const CardPainel = ({ ...props }) => {
  const { cardType, dataTestId, href, icon, cardTitle, produtos } = props;

  return (
    <div
      className={`card card-panel card-colored ${cardType}`}
      data-testid={dataTestId}
    >
      <div className="card-title-status ajuste-icones">
        <div>
          <i className={"fas " + icon} />
          {cardTitle}
        </div>
        <span className="float-end my-auto">Data/Hora</span>
      </div>
      <hr />
      <LinhasProdutos
        cardTitle={cardTitle}
        cardType={cardType}
        produtos={produtos}
      />
      {produtos?.length > 5 && (
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
