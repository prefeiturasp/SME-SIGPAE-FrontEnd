import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatarPara4Digitos } from "src/components/screens/helper";
import "./style.scss";
export default (props) => {
  const { titulo, classeCor, total } = props;
  return _jsx("div", {
    className: `card-medicao-por-status ${classeCor} me-3 mb-3`,
    children: _jsxs("div", {
      className: "p-2",
      children: [
        _jsx("h5", {
          className: "titulo",
          children: _jsx("b", { children: titulo }),
        }),
        _jsx("hr", {}),
        _jsx("div", {
          className: "total",
          children: formatarPara4Digitos(total),
        }),
      ],
    }),
  });
};
