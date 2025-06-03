import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
const ModalGenerico = ({
  show,
  textoBotaoClose = "Não",
  handleClose,
  loading = false,
  textoBotaoSim = "Sim",
  handleSim,
  titulo,
  texto,
}) => {
  return _jsx(Modal, {
    show: show,
    onHide: handleClose,
    backdrop: "static",
    children: _jsxs(Spin, {
      tip: "Carregando...",
      spinning: loading,
      children: [
        _jsx(Modal.Header, {
          closeButton: true,
          children: _jsxs(Modal.Title, {
            children: [" ", _jsx("strong", { children: titulo }), " "],
          }),
        }),
        _jsx(Modal.Body, { children: _jsx("p", { children: texto }) }),
        _jsxs(Modal.Footer, {
          children: [
            _jsx(Botao, {
              texto: textoBotaoClose,
              type: BUTTON_TYPE.BUTTON,
              onClick: () => handleClose(),
              style: BUTTON_STYLE.GREEN_OUTLINE,
              className: "ms-3",
            }),
            _jsx(Botao, {
              texto: textoBotaoSim,
              type: BUTTON_TYPE.BUTTON,
              style: BUTTON_STYLE.GREEN,
              className: "ms-3",
              onClick: () => handleSim(),
            }),
          ],
        }),
      ],
    }),
  });
};
export default ModalGenerico;
