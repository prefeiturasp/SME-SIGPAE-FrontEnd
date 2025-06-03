import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Modal } from "react-bootstrap";
export const ModalSalvar = ({ ...props }) => {
  const { show, handleClose, salvar, values } = props;
  return _jsxs(Modal, {
    show: show,
    onHide: handleClose,
    dialogClassName: "modal-cancelar-analise-layout",
    children: [
      _jsx(Modal.Header, {
        closeButton: true,
        children: _jsx(Modal.Title, {
          children: "Salvar Registro da Ocorr\u00EAncia",
        }),
      }),
      _jsxs(Modal.Body, {
        children: [
          "Deseja salvar o registro da ocorr\u00EAncia? ",
          _jsx("br", {}),
          "Voc\u00EA ainda poder\u00E1 editar o registro at\u00E9 o envio da Medi\u00E7\u00E3o Inicial.",
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
