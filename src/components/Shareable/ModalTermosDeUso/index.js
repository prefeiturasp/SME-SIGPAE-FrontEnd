import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { BUTTON_STYLE } from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import { aceitarTermos } from "src/services/perfil.service";
import "./style.scss";
export default ({ nomeUsuario, uuidUsuario }) => {
  const [showModal, setShowModal] = useState(true);
  const [deAcordo, setDeAcordo] = useState(false);
  const handleCheckboxChange = (event) => setDeAcordo(event.target.checked);
  const handleClickContinar = async () => {
    const response = await aceitarTermos(uuidUsuario);
    response.status === 200 && setShowModal(false);
  };
  return _jsxs(Modal, {
    dialogClassName: "modal-termos-de-uso",
    show: showModal,
    backdrop: "static",
    className: "modal-dialog modal-dialog-centered modal-dialog-scrollable",
    children: [
      _jsx(Modal.Header, {
        children: _jsxs(Modal.Title, {
          children: ["Ol\u00E1, ", _jsx("strong", { children: nomeUsuario })],
        }),
      }),
      _jsxs(Modal.Body, {
        children: [
          _jsx("div", {
            className: "row py-2",
            children: _jsxs("div", {
              className: "col",
              children: [
                "Atualizamos os",
                " ",
                _jsx("a", {
                  href: "assets/documents/termos-de-uso-sigpae.pdf",
                  target: "_blank",
                  children:
                    "Termos de Uso e a Pol\u00EDtica de Privacidade do SIGPAE",
                }),
                ", recomendamos a leitura do documento para seguir com seu acesso ao sistema.",
              ],
            }),
          }),
          _jsx("div", {
            className: "row py-2 justify-content-center",
            children: _jsx("div", {
              className: "col px-3",
              children: _jsxs("label", {
                className: "d-flex align-items-center",
                children: [
                  _jsx("input", {
                    type: "checkbox",
                    checked: deAcordo,
                    onChange: handleCheckboxChange,
                    className: "me-2",
                  }),
                  "Declaro que li e estou de acordo com os Termos de Uso e com a Pol\u00EDtica de Privacidade SIGPAE",
                ],
              }),
            }),
          }),
          _jsx("div", {
            className: "row pt-3 pb-2",
            children: _jsx("div", {
              className: "col",
              children: _jsx(Botao, {
                texto: "Continuar",
                onClick: handleClickContinar,
                style: BUTTON_STYLE.GREEN_OUTLINE,
                className: "float-end",
                disabled: !deAcordo,
              }),
            }),
          }),
        ],
      }),
    ],
  });
};
