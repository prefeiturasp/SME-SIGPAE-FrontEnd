import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./styles.scss";
export const CollapseContentEMEI = ({ periodos }) => {
  return _jsx("div", {
    className: "detalhes-historico-relatorio",
    children: periodos.map((p) =>
      _jsxs(
        "div",
        {
          className: "linha linha-1",
          children: [
            _jsx("div", {
              className: "item item-periodo",
              children: p.periodo,
            }),
            _jsx("div", { className: "item", children: p.autorizadas }),
          ],
        },
        p.periodo
      )
    ),
  });
};
