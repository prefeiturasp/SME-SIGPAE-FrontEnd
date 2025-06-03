import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { components } from "react-select";
export const Option = (props) => {
  return _jsx("div", {
    children: _jsxs(components.Option, {
      ...props,
      children: [
        _jsx("input", {
          type: "checkbox",
          checked: props.isSelected,
          onChange: () => null,
        }),
        " ",
        _jsx("label", { children: props.label }),
      ],
    }),
  });
};
