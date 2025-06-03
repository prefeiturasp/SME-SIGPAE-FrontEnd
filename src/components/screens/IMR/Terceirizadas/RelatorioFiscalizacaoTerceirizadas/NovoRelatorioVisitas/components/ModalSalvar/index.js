import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
export const ModalSalvar = ({ ...props }) => {
  const { show, handleClose, salvar, values, escolaSelecionada } = props;
  return _jsxs(Modal, {
    show: show,
    onHide: handleClose,
    dialogClassName: "modal-cancelar-analise-layout",
    children: [
      _jsx(Modal.Header, {
        closeButton: true,
        children: _jsx(Modal.Title, {
          children: "Enviar Relat\u00F3rio de Fiscaliza\u00E7\u00E3o",
        }),
      }),
      _jsxs(Modal.Body, {
        children: [
          "Deseja enviar seu relat\u00F3rio de fiscaliza\u00E7\u00E3o da visita a Unidade Educacional: ",
          _jsx("b", { children: escolaSelecionada?.label }),
          ", para avalia\u00E7\u00E3o de CODAE?",
        ],
      }),
      _jsxs(Modal.Footer, {
        children: [
          _jsx(Botao, {
            texto: "N\u00E3o",
            type: BUTTON_TYPE.BUTTON,
            onClick: () => {
              handleClose();
            },
            style: BUTTON_STYLE.GREEN_OUTLINE,
            className: "ms-3",
          }),
          _jsx(Botao, {
            texto: "Sim",
            type: BUTTON_TYPE.BUTTON,
            onClick: async () => {
              await salvar(values);
              handleClose();
            },
            style: BUTTON_STYLE.GREEN,
            className: "ms-3",
          }),
        ],
      }),
    ],
  });
};
