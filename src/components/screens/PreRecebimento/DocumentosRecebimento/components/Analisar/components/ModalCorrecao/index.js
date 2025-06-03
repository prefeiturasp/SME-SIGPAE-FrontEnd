import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { Field } from "react-final-form";
import { textAreaRequired } from "src/helpers/fieldValidators";
const ModalCorrecao = ({ show, handleClose, loading, handleSim, errors }) => {
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
              _jsx("strong", {
                children: "Solicitar Corre\u00E7\u00E3o ao Fornecedor",
              }),
              " ",
            ],
          }),
        }),
        _jsx(Modal.Body, {
          children: _jsx(Field, {
            component: TextArea,
            label: "Corre\u00E7\u00F5es Necess\u00E1rias",
            name: `correcao_solicitada`,
            placeholder: "Informe aqui as corre\u00E7\u00F5es necess\u00E1rias",
            required: true,
            validate: textAreaRequired,
          }),
        }),
        _jsxs(Modal.Footer, {
          children: [
            _jsx(Botao, {
              texto: "Cancelar",
              type: BUTTON_TYPE.BUTTON,
              onClick: () => handleClose(),
              style: BUTTON_STYLE.GREEN_OUTLINE,
              className: "ms-3",
            }),
            _jsx(Botao, {
              texto: "Enviar",
              type: BUTTON_TYPE.BUTTON,
              style: BUTTON_STYLE.GREEN,
              className: "ms-3",
              onClick: () => handleSim(),
              disabled: Object.keys(errors).length > 0,
            }),
          ],
        }),
      ],
    }),
  });
};
export default ModalCorrecao;
