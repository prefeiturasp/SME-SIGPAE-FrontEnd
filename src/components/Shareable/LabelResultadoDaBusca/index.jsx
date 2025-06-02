import React from "react";
import * as R from "ramda";
import "./styles.scss";

const LabelResultadoDaBusca = ({ filtros }) => {
  const somenteFiltroDeNome =
    filtros &&
    R.pathOr(0, ["nome_produto", "length"])(filtros) &&
    Object.keys(filtros).length === 2;

  return (
    <div className="componente-label-resultado-da-busca">
      {somenteFiltroDeNome
        ? `Veja os resultados para "${filtros.nome_produto}":`
        : "Veja os resultados para a busca:"}
    </div>
  );
};

export default LabelResultadoDaBusca;
