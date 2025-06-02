import { Tooltip } from "antd";
import { GESTAO_PRODUTO_CARDS } from "src/configs/constants";
import React from "react";
import { NavLink } from "react-router-dom";

const getTextoTooltip = (produto) => {
  return (
    <span>
      Marca: {produto.marca},<br />
      Editais: {produto.editais}
    </span>
  );
};

const exibeTooltip = (cardTitle) => {
  return [
    GESTAO_PRODUTO_CARDS.HOMOLOGADOS,
    GESTAO_PRODUTO_CARDS.PRODUTOS_SUSPENSOS,
  ].includes(cardTitle);
};

export const LinhasProdutos = ({ ...props }) => {
  const { cardTitle, cardType, produtos } = props;

  return produtos.slice(0, 5).map((produto, key) => {
    return (
      <NavLink to={produto.link} key={key} data-cy={`${cardType}-${key}`}>
        <p className="data">
          {!exibeTooltip(cardTitle) && produto.text}
          {exibeTooltip(cardTitle) && (
            <Tooltip
              color="#42474a"
              overlayStyle={{
                maxWidth: "320px",
                fontSize: "12px",
                fontWeight: "700",
              }}
              title={getTextoTooltip(produto)}
            >
              <span style={{ fontWeight: "bold" }}>{produto.text}</span>
            </Tooltip>
          )}
          <span className="float-end">{produto.date}</span>
        </p>
      </NavLink>
    );
  });
};
