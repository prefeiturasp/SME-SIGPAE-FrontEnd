import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./styles.scss";
export const CollapseContentCEI = ({ periodos }) => {
  return _jsxs("div", {
    className: "detalhes-collapse-cei",
    children: [
      _jsx("div", {
        className: "linha linha-1",
        children: _jsx("p", {
          children: "Faixas Et\u00E1rias com Dietas Autorizadas",
        }),
      }),
      periodos.map((p) =>
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
    ],
  });
};
