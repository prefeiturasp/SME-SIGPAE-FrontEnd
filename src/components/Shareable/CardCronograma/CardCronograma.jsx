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
  const ehPontoAPonto = (solicitation) =>
    Boolean(solicitation.ponto_a_ponto) ||
    solicitation.tipo_entrega === "PONTO_A_PONTO";

  const ehFichaTecnicaFlv = (solicitation) =>
    Boolean(solicitation.eh_ficha_tecnica_flv);

  const getClasseSolicitacao = (solicitation) => {
    const classes = ["data"];

    if (solicitation.programa_leve_leite) {
      classes.push("programa-leve-leite");
    }

    if (ehPontoAPonto(solicitation)) {
      classes.push("ponto-a-ponto");
    }

    if (ehFichaTecnicaFlv(solicitation)) {
      classes.push("eh-ficha-tecnica-flv");
    }
    return classes.join(" ");
  };

  const renderSolicitations = (solicitations, exibirTooltip) => {
    return exibirTooltip
      ? solicitations.slice(0, 5).map((solicitation, key) => {
          return (
            <Tooltip
              placement="topLeft"
              key={key}
              title={solicitation.fullText}
            >
              <NavLink to={solicitation.link}>
                <p className={getClasseSolicitacao(solicitation)}>
                  {solicitation.text}
                  <span className="float-end">{solicitation.date}</span>
                </p>
              </NavLink>
            </Tooltip>
          );
        })
      : solicitations.slice(0, 5).map((solicitation, key) => {
          return (
            <NavLink key={key} to={solicitation.link}>
              <p className={getClasseSolicitacao(solicitation)}>
                {solicitation.text}
                <span className="float-end">{solicitation.date}</span>
              </p>
            </NavLink>
          );
        });
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
      <div className="card-title-status ajuste-icones">
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
