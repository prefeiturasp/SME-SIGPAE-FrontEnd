import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Field } from "react-final-form";
import { required } from "src/helpers/fieldValidators";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../../../Shareable/Botao/constants";
import Botao from "../../../../../../../Shareable/Botao";
import "./styles.scss";
const FormAprovacao = ({ name, aprovaCollapse, reprovaCollapse, values }) => {
  const [conferido, setConferido] = useState(null);
  return _jsx("div", {
    className: "form-aprovacao",
    children:
      conferido !== false
        ? _jsxs("div", {
            className: "mt-4",
            children: [
              _jsx(Botao, {
                texto: "Conferido",
                type: BUTTON_TYPE.BUTTON,
                style: BUTTON_STYLE.GREEN,
                className: "float-end ms-3",
                onClick: () => {
                  setConferido(true);
                  values[`${name}_correcoes`] = "";
                  aprovaCollapse(name);
                },
              }),
              _jsx(Botao, {
                texto: "Solicitar Corre\u00E7\u00E3o",
                type: BUTTON_TYPE.BUTTON,
                style: BUTTON_STYLE.GREEN_OUTLINE,
                className: "float-end ms-3",
                onClick: () => {
                  setConferido(false);
                },
              }),
            ],
          })
        : _jsxs("div", {
            className: "row mt-3",
            children: [
              _jsx("div", {
                className: "col",
                children: _jsx(Field, {
                  component: TextArea,
                  label: "Solicita\u00E7\u00E3o de Corre\u00E7\u00E3o",
                  dataTestId: `${name}_correcoes`,
                  name: `${name}_correcoes`,
                  placeholder:
                    "Descreva as corre\u00E7\u00F5es necess\u00E1rias.",
                  className: "textarea-ficha-tecnica",
                  required: true,
                  validate: required,
                }),
              }),
              _jsxs("div", {
                className: "mt-4",
                children: [
                  _jsx(Botao, {
                    texto: "Salvar Corre\u00E7\u00F5es",
                    type: BUTTON_TYPE.BUTTON,
                    style: BUTTON_STYLE.GREEN,
                    className: "float-end ms-3",
                    disabled: !values[`${name}_correcoes`],
                    onClick: () => {
                      reprovaCollapse(name);
                    },
                  }),
                  _jsx(Botao, {
                    texto: "Cancelar",
                    type: BUTTON_TYPE.BUTTON,
                    style: BUTTON_STYLE.GREEN_OUTLINE,
                    className: "float-end ms-3",
                    onClick: () => {
                      setConferido(null);
                      delete values[`${name}_correcoes`];
                    },
                  }),
                ],
              }),
            ],
          }),
  });
};
export default FormAprovacao;
