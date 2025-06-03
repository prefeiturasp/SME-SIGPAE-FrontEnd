import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TemaContext } from "src/context/TemaContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
export default function Breadcrumb({ home, anteriores, atual }) {
  const temaContext = useContext(TemaContext);
  const navigate = useNavigate();
  return _jsxs("div", {
    className: "breadcrumb-row row g-0",
    children: [
      _jsx("div", {
        className: "col-10",
        children: _jsxs("ul", {
          className: "br-breadcrumb",
          children: [
            _jsx("li", {
              children: _jsxs(Link, {
                className: `home ${!atual && "is-active"}`,
                to: home,
                children: [
                  _jsx("i", { className: "fas fa-home home" }),
                  "In\u00EDcio",
                ],
              }),
            }),
            anteriores &&
              anteriores.length > 0 &&
              anteriores.map((anterior, key) => {
                return _jsx(
                  "li",
                  {
                    onClick: () => {
                      if (anterior.navigate_to) navigate(anterior.navigate_to);
                    },
                    children: _jsx(Link, {
                      to: anterior.href,
                      children: anterior.titulo,
                    }),
                  },
                  key
                );
              }),
            atual &&
              _jsx("li", {
                children: _jsx(Link, {
                  className: "is-active",
                  to: atual.href,
                  children: atual.titulo,
                }),
              }),
          ],
        }),
      }),
      _jsxs("div", {
        className: "col-2 text-end contrast",
        onClick: () => {
          temaContext.mudarTema();
        },
        children: [_jsx("i", { className: "fas fa-adjust" }), " Contraste"],
      }),
    ],
  });
}
