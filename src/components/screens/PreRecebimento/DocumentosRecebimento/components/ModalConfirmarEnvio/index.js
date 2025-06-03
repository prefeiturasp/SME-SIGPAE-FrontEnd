import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
const ModalConfirmarEnvio = ({
  show,
  handleClose,
  loading,
  handleSim,
  correcao,
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
            children: [
              " ",
              _jsx("strong", { children: "Salvar e Enviar Documentos" }),
              " ",
            ],
          }),
        }),
        _jsx(Modal.Body, {
          children: correcao
            ? _jsxs("p", {
                children: [
                  "Deseja enviar as corre\u00E7\u00F5es para ",
                  _jsx("strong", { children: "An\u00E1lise da CODAE?" }),
                ],
              })
            : _jsxs("p", {
                children: [
                  "Deseja enviar os documentos recebidos para",
                  " ",
                  _jsx("strong", { children: "An\u00E1lise da CODAE?" }),
                ],
              }),
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
              onClick: () => handleSim(),
            }),
          ],
        }),
      ],
    }),
  });
};
export default ModalConfirmarEnvio;
