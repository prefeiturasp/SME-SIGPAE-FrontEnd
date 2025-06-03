import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
export const ModalCancelaPreenchimento = ({ ...props }) => {
  const { show, handleClose, form, navigate } = props;
  return _jsxs(Modal, {
    show: show,
    onHide: handleClose,
    dialogClassName: "modal-cancelar-analise-layout",
    children: [
      _jsx(Modal.Header, {
        closeButton: true,
        children: _jsx(Modal.Title, { children: "Cancelar Preenchimento" }),
      }),
      _jsxs(Modal.Body, {
        children: [
          "Deseja cancelar o preenchimento do Relat\u00F3rio de Fiscaliza\u00E7\u00E3o? ",
          _jsx("br", {}),
          "As informa\u00E7\u00F5es preenchidas ser\u00E3o perdidas e o formul\u00E1rio n\u00E3o ser\u00E1 salvo!",
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
            onClick: () => {
              form.reset();
              handleClose();
              navigate(-1);
            },
            style: BUTTON_STYLE.GREEN,
            className: "ms-3",
          }),
        ],
      }),
    ],
  });
};
