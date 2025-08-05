import React from "react";
import "./styles.scss";

const LabelResultadoDaBusca = ({ filtros }) => {
  const somenteFiltroDeNome =
    filtros &&
    filtros.nome_produto?.length > 0 &&
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
