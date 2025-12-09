import React from "react";
import "./style.scss";
import { NavLink } from "react-router-dom";
import { Tooltip } from "antd";

export const CardCronograma = ({
  cardTitle,
  cardType,
  solicitations,
  icon,
  loading,
  href,
  exibirTooltip = false,
}) => {
  const renderSolicitations = (solicitations, exibirTooltip) => {
    return exibirTooltip
      ? solicitations.slice(0, 5).map((solicitation, key) => (
          <Tooltip placement="topLeft" key={key} title={solicitation.fullText}>
            <NavLink key={key} to={solicitation.link}>
              <p
                key={key}
                className={`data ${solicitation.programa_leve_leite ? "programa-leve-leite" : ""}`}
              >
                {solicitation.text}
                <span className="float-end">{solicitation.date}</span>
              </p>
            </NavLink>
          </Tooltip>
        ))
      : solicitations.slice(0, 5).map((solicitation, key) => (
          <NavLink key={key} to={solicitation.link}>
            <p
              key={key}
              className={`data ${solicitation.programa_leve_leite ? "programa-leve-leite" : ""}`}
            >
              {solicitation.text}
              <span className="float-end">{solicitation.date}</span>
            </p>
          </NavLink>
        ));
  };

  const renderVerMais = (solicitations) => {
    return (
      solicitations.length > 5 && (
        <NavLink
          to={`${href}`}
          className="see-more"
          data-cy={`ver-mais-${cardType}`}
        >
          Ver Mais
        </NavLink>
      )
    );
  };

  return (
    <div className={`card card-panel-cronograma card-colored ${cardType}`}>
      <div className={`card-title-status ajuste-icones`}>
        <div>
          <i className={"fas " + icon} />
          {cardTitle}
        </div>
        {loading && (
          <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
        )}
        <span className="float-end my-auto">Data</span>
      </div>
      <hr />
      {renderSolicitations(solicitations, exibirTooltip)}
      {renderVerMais(solicitations)}
    </div>
  );
};

export default CardCronograma;
