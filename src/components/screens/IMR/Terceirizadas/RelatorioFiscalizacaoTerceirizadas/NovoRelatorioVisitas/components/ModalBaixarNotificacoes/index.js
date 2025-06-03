import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
export const ModalBaixarNotificaoces = ({ ...props }) => {
  const { show, handleClose, salvarRascunhoEBaixarNotificacoes } = props;
  return _jsxs(Modal, {
    show: show,
    onHide: handleClose,
    dialogClassName: "modal-cancelar-analise-layout",
    children: [
      _jsx(Modal.Header, {
        closeButton: true,
        children: _jsx(Modal.Title, {
          children: "Salvar Relat\u00F3rio e Baixar Notifica\u00E7\u00F5es",
        }),
      }),
      _jsx(Modal.Body, {
        children:
          "Deseja salvar as informa\u00E7\u00F5es inseridas no relat\u00F3rio da visita a unidade para gerar o(s) documento(s) de notifica\u00E7\u00E3o para assinatura?",
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
            onClick: salvarRascunhoEBaixarNotificacoes,
            style: BUTTON_STYLE.GREEN,
            className: "ms-3",
          }),
        ],
      }),
    ],
  });
};
