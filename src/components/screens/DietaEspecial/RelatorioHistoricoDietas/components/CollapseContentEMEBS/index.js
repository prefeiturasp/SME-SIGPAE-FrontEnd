import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./styles.scss";
export const CollapseContentEMEBS = ({ periodos }) => {
  return _jsxs("div", {
    className: "detalhes-collapse-emebs",
    children: [
      periodos.infantil?.length > 0 &&
        _jsx("div", {
          className: "linha linha-1",
          children: _jsx("p", { children: "Alunos do Infantil (4 a 6 anos)" }),
        }),
      periodos.infantil?.map((item) =>
        _jsxs(
          "div",
          {
            className: "linha linha-2",
            children: [
              _jsx("div", {
                className: "item item-periodo",
                children: item.periodo,
              }),
              _jsx("div", { className: "item", children: item.autorizadas }),
            ],
          },
          `infantil-${item.periodo}`
        )
      ),
      periodos.fundamental?.length > 0 &&
        _jsx("div", {
          className: "linha linha-1",
          children: _jsx("p", {
            children: "Alunos do Fundamental (acima de 6 anos)",
          }),
        }),
      periodos.fundamental?.map((item) =>
        _jsxs(
          "div",
          {
            className: "linha linha-2",
            children: [
              _jsx("div", {
                className: "item item-periodo",
                children: item.periodo,
              }),
              _jsx("div", { className: "item", children: item.autorizadas }),
            ],
          },
          `fundamental-${item.periodo}`
        )
      ),
    ],
  });
};
