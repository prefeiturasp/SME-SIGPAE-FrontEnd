import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./styles.scss";
import { Field } from "react-final-form";
import { required } from "src/helpers/fieldValidators";
const RadioButtonField = ({
  name,
  label,
  options = [],
  className,
  modoTabela = false,
}) => {
  return _jsxs("div", {
    className: `radio-button-sigpae ${className} ${
      modoTabela ? "modo-tabela" : ""
    }`,
    children: [
      label &&
        _jsxs("p", {
          className: "label-radio",
          children: [
            _jsx("span", { className: "required-asterisk", children: "*" }),
            " ",
            label,
          ],
        }),
      _jsx("div", {
        className: "radio-btn-container",
        children: options.map((option, index) =>
          _jsxs(
            "label",
            {
              className: "container-radio",
              children: [
                option.label,
                _jsx(Field, {
                  component: "input",
                  type: "radio",
                  value: option.value,
                  name: name,
                  validate: required,
                }),
                _jsx("span", { className: "checkmark" }),
              ],
            },
            index
          )
        ),
      }),
    ],
  });
};
export default RadioButtonField;
