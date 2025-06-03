import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { useState } from "react";
import { Form } from "react-final-form";
import "./styles.scss";
import {
  usuarioEhDRE,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "src/helpers/utilities";
export const CollapseFiltros = ({
  titulo = "Filtrar Cadastros",
  children,
  onSubmit,
  onClear,
  desabilitarBotoes,
  manterFiltros,
  initialValues = {},
  keepDirtyOnReinitialize = false,
  destroyOnUnregister = false,
}) => {
  const id = "collapseFiltros";
  const [collapse, setCollapse] = useState(true);
  const toggleCollapse = () => {
    setCollapse(!collapse);
    const element = document.getElementById("heading");
    element.classList.toggle("open");
  };
  const limparFiltros = (form, values) => {
    if (usuarioEhDRE() && manterFiltros?.includes("dre")) {
      form.reset({ dre: values["dre"] });
    } else if (
      usuarioEhEscolaTerceirizadaQualquerPerfil() &&
      manterFiltros?.includes("unidade_educacional")
    ) {
      form.reset({
        dre: values["dre"],
        unidade_educacional: values["unidade_educacional"],
      });
    } else if (manterFiltros?.includes("status_selecionado")) {
      form.reset({ status_selecionado: values["status_selecionado"] });
    } else {
      form.reset({});
    }
    onClear();
  };
  return _jsx("div", {
    className: "accordion accordionFiltros mt-1",
    id: id,
    children: _jsxs("div", {
      className: "card mt-3",
      children: [
        _jsx("div", {
          className: `card-header card-tipo open`,
          id: `heading`,
          children: _jsxs("div", {
            className: "row card-header-content",
            children: [
              _jsxs("div", {
                className: "col-11 titulo my-auto",
                children: [
                  _jsx("i", { className: "fas fa-sort-amount-down" }),
                  _jsx("span", { children: titulo }),
                ],
              }),
              _jsx("div", {
                className: "col-1 my-auto",
                children: _jsx("button", {
                  onClick: () => toggleCollapse(),
                  className: "btn btn-link btn-block text-end px-0",
                  type: "button",
                  "data-bs-toggle": "collapse",
                  "data-bs-target": `#collapse`,
                  "aria-expanded": "true",
                  "aria-controls": `collapse`,
                  children: _jsx("span", {
                    className: "span-icone-toogle",
                    children: _jsx("i", {
                      className: collapse
                        ? "fas fa-chevron-up"
                        : "fas fa-chevron-down",
                    }),
                  }),
                }),
              }),
            ],
          }),
        }),
        _jsx("div", {
          id: `collapse`,
          className: "collapse show",
          "aria-labelledby": "headingOne",
          "data-bs-parent": `#${id}`,
          children: _jsx("div", {
            className: "card-body",
            children: _jsx(Form, {
              onSubmit: onSubmit,
              initialValues: initialValues,
              destroyOnUnregister: destroyOnUnregister,
              keepDirtyOnReinitialize: keepDirtyOnReinitialize,
              render: ({ form, handleSubmit, values }) =>
                _jsxs("form", {
                  onSubmit: handleSubmit,
                  children: [
                    _jsx("div", { children: children(values, form) }),
                    _jsxs("div", {
                      className: "pt-4 pb-4 mb-2",
                      children: [
                        _jsx(Botao, {
                          dataTestId: "botao-filtrar",
                          texto: "Filtrar",
                          type: BUTTON_TYPE.SUBMIT,
                          style: BUTTON_STYLE.GREEN,
                          className: "float-end ms-3",
                          disabled: desabilitarBotoes,
                        }),
                        _jsx(Botao, {
                          texto: "Limpar Filtros",
                          type: BUTTON_TYPE.BUTTON,
                          style: BUTTON_STYLE.GREEN_OUTLINE,
                          className: "float-end ms-3",
                          onClick: () => limparFiltros(form, values),
                          disabled: desabilitarBotoes,
                        }),
                      ],
                    }),
                  ],
                }),
            }),
          }),
        }),
      ],
    }),
  });
};
export default CollapseFiltros;
