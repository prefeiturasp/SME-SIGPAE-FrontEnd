import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
export function ModalExcluirClausula({
  uuid,
  show,
  carregando = false,
  handleClose,
  handleConfirm,
}) {
  return _jsxs(Modal, {
    show: show,
    onHide: handleClose,
    children: [
      _jsx(Modal.Header, {
        closeButton: true,
        children: _jsx(Modal.Title, { children: "Excluir Cl\u00E1usula" }),
      }),
      _jsxs(Modal.Body, {
        children: [
          _jsx("p", {
            children:
              "Voc\u00EA confirma a exclus\u00E3o da cl\u00E1usula selecionada?",
          }),
          _jsx("p", {
            children:
              "N\u00E3o ser\u00E1 poss\u00EDvel aplicar o desconto indicado em novas medi\u00E7\u00F5es.",
          }),
        ],
      }),
      _jsxs(Modal.Footer, {
        children: [
          _jsx(Botao, {
            texto: "N\u00E3o",
            type: BUTTON_TYPE.BUTTON,
            onClick: () => handleClose(),
            style: BUTTON_STYLE.GREEN_OUTLINE,
            className: "ms-3",
          }),
          _jsx(Botao, {
            texto: "Sim",
            type: BUTTON_TYPE.BUTTON,
            style: BUTTON_STYLE.GREEN,
            className: "ms-3",
            onClick: () => handleConfirm(uuid),
            disabled: carregando,
          }),
        ],
      }),
    ],
  });
}
