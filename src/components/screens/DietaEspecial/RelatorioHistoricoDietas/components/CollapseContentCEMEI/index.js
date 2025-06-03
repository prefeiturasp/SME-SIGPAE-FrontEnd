import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./styles.scss";
export const CollapseContentCEMEI = ({ periodos }) => {
  return _jsxs("div", {
    className: "detalhes-collapse-cemei",
    children: [
      periodos.por_idade?.length > 0 &&
        _jsx("div", {
          className: "linha linha-1",
          children: _jsx("p", {
            children: "Faixas Et\u00E1rias com Dietas Autorizadas",
          }),
        }),
      periodos.por_idade?.map((p) =>
        _jsxs(
          "div",
          {
            className: "linha item-periodo",
            children: [
              _jsx("div", {
                className: "linha item item-periodo",
                children: _jsxs("p", {
                  children: ["Per\u00EDodo ", p.periodo],
                }),
              }),
              p.faixa_etaria?.map((faixa) =>
                _jsxs(
                  "div",
                  {
                    className: "linha linha-2",
                    children: [
                      _jsx("div", { className: "item", children: faixa.faixa }),
                      _jsx("div", {
                        className: "item",
                        children: faixa.autorizadas,
                      }),
                    ],
                  },
                  faixa.faixa
                )
              ),
            ],
          },
          p.periodo
        )
      ),
      periodos.turma_infantil?.length > 0 &&
        _jsx("div", {
          className: "linha linha-1",
          children: _jsx("p", {
            children: "Dietas Autorizadas nas Turmas do Infantil",
          }),
        }),
      periodos.turma_infantil?.map((item) =>
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
    ],
  });
};
