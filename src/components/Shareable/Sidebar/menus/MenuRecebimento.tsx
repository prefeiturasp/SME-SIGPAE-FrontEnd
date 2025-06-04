import React from "react";
import { Menu, LeafItem } from "./shared";
import {
  RECEBIMENTO,
  QUESTOES_POR_PRODUTO,
  FICHA_RECEBIMENTO,
} from "src/configs/constants";

const MenuRecebimento = () => {
  return (
    <Menu id="Recebimento" icon="fa-clipboard-list" title={"Recebimento"}>
      <LeafItem to={`/${RECEBIMENTO}/${QUESTOES_POR_PRODUTO}`}>
        Questões por Produto
      </LeafItem>
      <LeafItem to={`/${RECEBIMENTO}/${FICHA_RECEBIMENTO}`}>
        Ficha de Recebimento
      </LeafItem>
    </Menu>
  );
};

export default MenuRecebimento;
