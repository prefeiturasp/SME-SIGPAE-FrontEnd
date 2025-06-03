import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Modal } from "react-bootstrap";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import {
  ALTERACAO_CRONOGRAMA,
  PRE_RECEBIMENTO,
} from "../../../../../configs/constants";
import {
  usuarioEhCronograma,
  usuarioEhCodaeDilog,
} from "../../../../../helpers/utilities";
export const ModalCronograma = ({ event, showModal, closeModal }) => {
  const navigate = useNavigate();
  return _jsxs(Modal, {
    dialogClassName: "modal-info-cronograma modal-50w",
    show: showModal,
    onHide: closeModal,
    children: [
      _jsx(Modal.Header, {
        closeButton: true,
        children: _jsx(Modal.Title, {
          children: "Informa\u00E7\u00F5es do Cronograma",
        }),
      }),
      _jsxs(Modal.Body, {
        children: [
          _jsx("div", {
            className: "row",
            children: _jsxs("div", {
              className: "col-12",
              children: [
                _jsx("span", {
                  className: "fw-bold",
                  children: "N\u00BA do Cronograma: ",
                }),
                _jsx("span", {
                  className: "fw-bold green",
                  children: event.objeto.numero_cronograma,
                }),
              ],
            }),
          }),
          _jsx("div", {
            className: "row",
            children: _jsxs("div", {
              className: "col-12",
              children: [
                _jsx("span", {
                  className: "fw-bold",
                  children: "Nome do Produto: ",
                }),
                _jsx("span", { children: event.objeto.nome_produto }),
              ],
            }),
          }),
          _jsx("div", {
            className: "row",
            children: _jsxs("div", {
              className: "col-12",
              children: [
                _jsx("span", {
                  className: "fw-bold",
                  children: "Nome do Fornecedor: ",
                }),
                _jsx("span", { children: event.objeto.nome_fornecedor }),
              ],
            }),
          }),
          _jsxs("div", {
            className: "row",
            children: [
              _jsxs("div", {
                className: "col-6",
                children: [
                  _jsx("span", {
                    className: "fw-bold",
                    children: "Data da Entrega: ",
                  }),
                  _jsx("span", { children: event.objeto.data_programada }),
                ],
              }),
              _jsxs("div", {
                className: "col-6",
                children: [
                  _jsx("span", { className: "fw-bold", children: "Empenho: " }),
                  _jsx("span", { children: event.objeto.numero_empenho }),
                ],
              }),
            ],
          }),
          _jsxs("div", {
            className: "row",
            children: [
              _jsxs("div", {
                className: "col-4",
                children: [
                  _jsx("span", { className: "fw-bold", children: "Etapa: " }),
                  _jsx("span", { children: event.objeto.etapa }),
                ],
              }),
              _jsxs("div", {
                className: "col-4",
                children: [
                  _jsx("span", { className: "fw-bold", children: "Parte: " }),
                  _jsx("span", { children: event.objeto.parte }),
                ],
              }),
              _jsxs("div", {
                className: "col-4",
                children: [
                  _jsx("span", {
                    className: "fw-bold",
                    children: "Quantidade: ",
                  }),
                  _jsxs("span", {
                    children: [
                      event.objeto.quantidade,
                      " ",
                      event.objeto.unidade_medida,
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsxs(Modal.Footer, {
        children: [
          (usuarioEhCronograma() || usuarioEhCodaeDilog()) &&
            event.objeto.status === "Assinado CODAE" &&
            _jsx(Botao, {
              texto: "Alterar",
              type: BUTTON_TYPE.BUTTON,
              onClick: () => {
                navigate(
                  `/${PRE_RECEBIMENTO}/${ALTERACAO_CRONOGRAMA}?uuid=${event.objeto.uuid_cronograma}`
                );
              },
              style: BUTTON_STYLE.GREEN_OUTLINE,
              className: "ms-3",
            }),
          _jsx(Botao, {
            texto: "Fechar",
            onClick: closeModal,
            type: BUTTON_TYPE.BUTTON,
            style: BUTTON_STYLE.GREEN,
            className: "ms-3",
          }),
        ],
      }),
    ],
  });
};
