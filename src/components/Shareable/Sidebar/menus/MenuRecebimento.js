import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu, LeafItem } from "./shared";
import {
  RECEBIMENTO,
  QUESTOES_POR_PRODUTO,
  FICHA_RECEBIMENTO,
} from "src/configs/constants";
const MenuRecebimento = () => {
  return _jsxs(Menu, {
    id: "Recebimento",
    icon: "fa-clipboard-list",
    title: "Recebimento",
    children: [
      _jsx(LeafItem, {
        to: `/${RECEBIMENTO}/${QUESTOES_POR_PRODUTO}`,
        children: "Quest\u00F5es por Produto",
      }),
      _jsx(LeafItem, {
        to: `/${RECEBIMENTO}/${FICHA_RECEBIMENTO}`,
        children: "Ficha de Recebimento",
      }),
    ],
  });
};
export default MenuRecebimento;
