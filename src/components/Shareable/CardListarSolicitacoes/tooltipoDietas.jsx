import React from "react";
import { Tooltip } from "antd";

const TooltipVisualizacoesSimultaneas = ({ quantidade }) => {
  if (!quantidade) return null;

  return (
    <Tooltip
      color="#686868"
      overlayStyle={{
        maxWidth: "140px",
        fontSize: "12px",
        fontWeight: "700",
      }}
      title="Usuários visualizando simultaneamente"
    >
      <span
        className={`ms-2 dietas-abertas ${
          quantidade > 9 ? "qtd-dois-digitos" : ""
        }`}
      >
        {quantidade}
      </span>
    </Tooltip>
  );
};

export default TooltipVisualizacoesSimultaneas;
