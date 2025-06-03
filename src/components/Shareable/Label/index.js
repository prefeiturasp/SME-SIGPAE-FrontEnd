import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./style.scss";
export default ({ content, required, htmlFor, className }) => {
  return _jsxs("span", {
    className: `custom-label ${className}`,
    children: [
      required &&
        _jsx("span", { className: "required-asterisk", children: "*" }),
      _jsx("label", {
        htmlFor: htmlFor,
        className: "col-form-label",
        children: content,
      }),
    ],
  });
};
