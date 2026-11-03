import PropTypes from "prop-types";
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

Container.propTypes = {
  filtros: PropTypes.shape({
    diretoria_regional: PropTypes.string,
    lote: PropTypes.string,
  }),
};

export default Container;
