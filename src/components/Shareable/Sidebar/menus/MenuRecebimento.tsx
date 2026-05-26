import React from "react";
import { Menu, LeafItem, SubMenu } from "./shared";
import {
  RECEBIMENTO,
  QUESTOES_POR_PRODUTO,
  FICHA_RECEBIMENTO,
  RELATORIO_DOCUMENTOS_RECEBIMENTO,
} from "src/configs/constants";
import { usuarioEhRecebimento } from "src/helpers/utilities";

const MenuRecebimento = ({ activeMenu, onSubmenuClick }) => {
  return (
    <Menu id="Recebimento" icon="fa-clipboard-list" title={"Recebimento"}>
      {usuarioEhRecebimento() && (
        <LeafItem to={`/${RECEBIMENTO}/${QUESTOES_POR_PRODUTO}`}>
          Questões por Produto
        </LeafItem>
      )}
      <LeafItem to={`/${RECEBIMENTO}/${FICHA_RECEBIMENTO}`}>
        Ficha de Recebimento
      </LeafItem>
      <SubMenu
        icon="fa-chevron-down"
        onClick={onSubmenuClick}
        title="Relatórios"
        activeMenu={activeMenu}
        dataTestId="relatorios-pr"
      >
        <LeafItem to={`/${RECEBIMENTO}/${RELATORIO_DOCUMENTOS_RECEBIMENTO}/`}>
          Documentos de Recebimento
        </LeafItem>
      </SubMenu>
    </Menu>
  );
};

export default MenuRecebimento;
