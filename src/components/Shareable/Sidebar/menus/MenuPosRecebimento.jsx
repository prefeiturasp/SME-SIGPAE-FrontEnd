import React from "react";
import { Menu, LeafItem } from "./shared";
import {
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_DEFINITIVO,
  TERMO_RECEBIMENTO_DEFINITIVO_FORNECEDOR,
} from "src/configs/constants";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";

const MenuPosRecebimento = () => {
  return (
    <Menu
      id="PosRecebimento"
      icon="fa-clipboard-check"
      title="Pós-Recebimento"
      dataTestId="pos-recebimento"
    >
      {usuarioEhEmpresaFornecedor() ? (
        <LeafItem
          to={`/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO_FORNECEDOR}`}
          dataTestId="termo-recebimento-definitivo-fornecedor"
        >
          Termo de Recebimento Definitivo
        </LeafItem>
      ) : (
        <LeafItem
          to={`/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO}`}
          dataTestId="termo-recebimento-definitivo"
        >
          Termo de Recebimento Definitivo
        </LeafItem>
      )}
    </Menu>
  );
};

export default MenuPosRecebimento;
