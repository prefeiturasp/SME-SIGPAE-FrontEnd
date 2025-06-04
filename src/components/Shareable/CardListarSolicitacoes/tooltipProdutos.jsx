import React from "react";
import { NavLink } from "react-router-dom";
import { Tooltip } from "antd";
import { conferidaClass } from "src/helpers/terceirizadas";

const TooltipProdutos = ({ solicitacao, cardTitulo }) => {
  const renderSolicitation = (solicitation) => {
    let conferida = conferidaClass(solicitation, cardTitulo);
    const text = (
      <span>
        Marca: {solicitacao.marca},<br />
        Editais: {solicitacao.editais}
      </span>
    );

    return (
      <NavLink to={solicitation.link}>
        <p className={`data ${conferida}`}>
          <Tooltip
            color="#42474a"
            overlayStyle={{
              maxWidth: "320px",
              fontSize: "12px",
              fontWeight: "700",
            }}
            title={text}
          >
            <span style={{ fontWeight: "bold" }}>{solicitation.text}</span>
          </Tooltip>
        </p>
      </NavLink>
    );
  };

  return <>{renderSolicitation(solicitacao)}</>;
};

export default TooltipProdutos;
