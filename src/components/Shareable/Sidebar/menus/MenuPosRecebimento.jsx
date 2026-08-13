import React from "react";
import { Menu, LeafItem } from "./shared";
import {
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_DEFINITIVO,
} from "src/configs/constants";

const MenuPosRecebimento = () => {
  return (
    <Menu
      id="PosRecebimento"
      icon="fa-clipboard-check"
      title="Pós-Recebimento"
      dataTestId="pos-recebimento"
    >
      <LeafItem
        to={`/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO}`}
        dataTestId="termo-recebimento-definitivo"
      >
        Termo de Recebimento Definitivo
      </LeafItem>
    </Menu>
  );
};

export default MenuPosRecebimento;
