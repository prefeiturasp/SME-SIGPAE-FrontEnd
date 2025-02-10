import React from "react";
import { LinhasProdutos } from "../LinhaProduto";
import { NavLink, useNavigate } from "react-router-dom";

export const CardPainel = ({ ...props }) => {
  let navigate = useNavigate();

  const {
    cardType,
    dataTestId,
    href,
    hrefCard,
    icon,
    cardTitle,
    loading,
    produtos,
  } = props;

  return (
    <div
      className={`card card-panel card-colored ${cardType}`}
      data-testid={dataTestId}
    >
      <div
        className={`card-title-status ajuste-icones ${
          hrefCard ? "card-com-href" : undefined
        }`}
        onClick={() => hrefCard && navigate(hrefCard)}
      >
        <div>
          <i className={"fas " + icon} />
          {cardTitle}
        </div>
        {loading && (
          <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
        )}
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
