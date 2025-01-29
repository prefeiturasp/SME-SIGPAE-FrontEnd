import { visaoPorComboSomenteDatas } from "constants/shared";
import React from "react";
import { PainelPedidos } from ".";

const Container = ({ ...props }) => {
  const { filtros } = props;

  return (
    <PainelPedidos
      visaoPorCombo={visaoPorComboSomenteDatas}
      pedidosAutorizados={[]}
      pedidosReprovados={[]}
      filtrosProps={filtros}
    />
  );
};
export default Container;
