import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Modal } from "react-bootstrap";
export const ModalEncerrarContrato = (props) => {
  const { showModal, closeModal, encerrarContrato, contrato } = props;
  return _jsxs(Modal, {
    dialogClassName: "modal-cadastro-empresa modal-50w",
    show: showModal,
    onHide: closeModal,
    children: [
      _jsx(Modal.Header, {
        closeButton: true,
        children: _jsx(Modal.Title, { children: "Encerrar Contrato" }),
      }),
      _jsxs(Modal.Body, {
        children: [
          "Confirma o encerramento do ",
          _jsxs("strong", { children: ["Contrato ", contrato.numero] }),
          "?",
        ],
      }),
      _jsxs(Modal.Footer, {
        children: [
          _jsx(Botao, {
            texto: "N\u00E3o",
            type: BUTTON_TYPE.BUTTON,
            onClick: closeModal,
            style: BUTTON_STYLE.GREEN_OUTLINE,
            className: "ms-3",
          }),
          _jsx(Botao, {
            texto: "Sim",
            type: BUTTON_TYPE.BUTTON,
            onClick: () => encerrarContrato(contrato),
            style: BUTTON_STYLE.GREEN,
            className: "ms-3",
          }),
        ],
      }),
    ],
  });
};
