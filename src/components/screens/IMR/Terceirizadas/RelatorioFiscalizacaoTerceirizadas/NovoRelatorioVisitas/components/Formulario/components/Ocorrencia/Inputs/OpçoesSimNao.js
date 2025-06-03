import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { required } from "src/helpers/fieldValidators";
export const OpçoesSimNao = ({ ...props }) => {
  const { titulo, name, somenteLeitura } = props;
  return _jsxs("div", {
    className: "col-12",
    children: [
      _jsxs("div", {
        children: [
          _jsx("span", { className: "required-asterisk me-1", children: "*" }),
          _jsx("label", { className: "col-form-label", children: titulo }),
        ],
      }),
      _jsxs("div", {
        className: "row parametrizacao-tipo-radio",
        children: [
          _jsxs("div", {
            className: "col-2 p-0 d-flex align-items-center",
            children: [
              _jsx(Field, {
                name: name,
                component: "input",
                type: "radio",
                value: "Sim",
                id: "sim",
                required: true,
                validate: required,
                style: { paddingRight: 2 },
                disabled: somenteLeitura,
              }),
              _jsx("label", { htmlFor: "sim", children: "Sim" }),
            ],
          }),
          _jsxs("div", {
            className: "col-2 p-0 d-flex align-items-center",
            children: [
              _jsx(Field, {
                name: name,
                component: "input",
                type: "radio",
                value: "N\u00E3o",
                id: "nao",
                required: true,
                validate: required,
                disabled: somenteLeitura,
              }),
              _jsx("label", { htmlFor: "nao", children: "N\u00E3o" }),
            ],
          }),
        ],
      }),
    ],
  });
};
