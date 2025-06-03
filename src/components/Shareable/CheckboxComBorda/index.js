import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./styles.scss";
const CheckboxComBorda = ({ label, input, meta, disabled, dataTestId }) => {
  const estiloDaBorda = input.value ? "marcado" : "desmarcado";
  return _jsxs("div", {
    className: `checkbox-com-borda ${estiloDaBorda}`,
    children: [
      _jsx("input", {
        type: "checkbox",
        className: "checkbox-input",
        ...input,
        ...meta,
        id: input.name,
        checked: input.value,
        disabled: disabled,
        "data-testid": dataTestId,
      }),
      _jsx("label", {
        htmlFor: input.name,
        className: "checkbox-label",
        children: label,
      }),
    ],
  });
};
export default CheckboxComBorda;
