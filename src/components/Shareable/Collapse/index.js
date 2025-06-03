import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useEffect } from "react";
import "./styles.scss";
const Collapse = ({
  collapse,
  setCollapse,
  titulos,
  children,
  id,
  collapseConfigs,
  state,
}) => {
  const toggleCollapse = (index) => {
    setCollapse({
      [index]: !collapse[index],
    });
  };
  const gerarConfigsPadrao = () =>
    children.map(() => {
      return { titulo: "", camposObrigatorios: true };
    });
  const configs =
    collapseConfigs?.length > 0 ? collapseConfigs : gerarConfigsPadrao();
  useEffect(() => {
    const elements = document.querySelectorAll(`.accordionComponent .collapse`);
    elements.forEach((element, index) => {
      if (collapse[index]) element.classList.add("show");
    });
  }, []);
  return (
    collapse &&
    _jsx("div", {
      className: "accordion accordionComponent mt-1",
      id: id,
      children: children
        .filter(Boolean)
        .map((el, index) =>
          _jsx(_Fragment, {
            children: _jsxs("div", {
              className: "card mt-3",
              children: [
                _jsx("div", {
                  className: `card-header card-tipo`,
                  id: `heading_${index}`,
                  children: _jsxs("div", {
                    className: "row card-header-content",
                    children: [
                      _jsx("span", {
                        className: "col-8 titulo",
                        children: configs[index]?.titulo || titulos[index],
                      }),
                      _jsxs("div", {
                        className: "col-4 my-auto flex-end",
                        children: [
                          configs[index].camposObrigatorios &&
                            _jsxs(_Fragment, {
                              children: [
                                _jsx("span", {
                                  className:
                                    "texto-obrigatorio required-asterisk",
                                  children: "*",
                                }),
                                _jsx("span", {
                                  className: "texto-obrigatorio",
                                  children:
                                    "Campos de Preenchimento Obrigat\u00F3rio",
                                }),
                              ],
                            }),
                          state &&
                            _jsx("span", {
                              className: "tags",
                              children:
                                configs[index].tag === true &&
                                (state[el.props.id] === false
                                  ? _jsxs("div", {
                                      className: "tag correcao",
                                      children: [
                                        _jsx("i", {
                                          className:
                                            "fas fa-exclamation-circle",
                                        }),
                                        "Indica\u00E7\u00E3o de Corre\u00E7\u00E3o",
                                      ],
                                    })
                                  : state[el.props.id] === true
                                  ? _jsxs("div", {
                                      className: "tag collapse-conferido",
                                      children: [
                                        _jsx("i", {
                                          className: "fas fa-check-circle",
                                        }),
                                        "Conferido",
                                      ],
                                    })
                                  : _jsx("div", {
                                      className: "tag pendente",
                                      children: "Pendente de An\u00E1lise",
                                    })),
                            }),
                          _jsx("span", {
                            children: _jsx("button", {
                              onClick: () => toggleCollapse(index),
                              className: "btn btn-link text-end px-0 ms-4",
                              type: "button",
                              "data-bs-toggle": "collapse",
                              "data-bs-target": `#collapse_${index}`,
                              "aria-expanded": "true",
                              "aria-controls": `collapse_${index}`,
                              children: _jsx("span", {
                                className: "span-icone-toogle",
                                children: _jsx("i", {
                                  className: collapse[index]
                                    ? "fas fa-chevron-up"
                                    : "fas fa-chevron-down",
                                }),
                              }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                _jsx("div", {
                  id: `collapse_${index}`,
                  className: `collapse`,
                  "aria-labelledby": "headingOne",
                  "data-bs-parent": `#${id}`,
                  children: _jsx("div", {
                    className: "card-body",
                    children: el,
                  }),
                }),
              ],
            }),
          })
        ),
    })
  );
};
export default Collapse;
