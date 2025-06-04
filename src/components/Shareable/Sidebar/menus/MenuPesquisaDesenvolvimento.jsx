import React from "react";
import { Menu, LeafItem } from "./shared";
import { PESQUISA_DESENVOLVIMENTO } from "src/configs/constants";

const MenuPesquisaDesenvolvimento = () => {
  return (
    <Menu
      id="PesquisaDesenvolvimento"
      icon="fa-atom"
      title={"Gestão de Produto"}
    >
      <LeafItem to={`/${PESQUISA_DESENVOLVIMENTO}/busca-produto`}>
        Consulta de Produto
      </LeafItem>
    </Menu>
  );
};

export default MenuPesquisaDesenvolvimento;
