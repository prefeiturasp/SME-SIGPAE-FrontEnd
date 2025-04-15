import React from "react";
import { PainelPedidos } from ".";

const Container = ({ ...props }) => {
  const { filtros } = props;

  return (
    <PainelPedidos
      pedidosAutorizados={[]}
      pedidosReprovados={[]}
      filtrosProps={filtros}
    />
  );
};
export default Container;
