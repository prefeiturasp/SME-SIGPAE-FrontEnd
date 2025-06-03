import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select as SelectAntd } from "antd";
import { Field } from "react-final-form";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { AInput, ASelect } from "src/components/Shareable/MakeField";
export function Filtros({ onSubmit, onClear, contratos, editais }) {
  const filtrarOpcoes = (value, option) => {
    return option.children
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase());
  };
  return _jsx(CollapseFiltros, {
    onSubmit: onSubmit,
    onClear: onClear,
    children: () =>
      _jsxs("div", {
        className: "row",
        children: [
          _jsx("div", {
            className: "col-4",
            children: _jsx(Field, {
              name: "numero",
              label: "Filtrar por N\u00BA do Empenho",
              placeholder: "Digite o N\u00BA do empenho",
              autoComplete: "off",
              component: AInput,
            }),
          }),
          _jsx("div", {
            className: "col-4",
            children: _jsxs(Field, {
              name: "contrato",
              label: "Filtrar por Contratos",
              component: ASelect,
              showSearch: true,
              filterOption: filtrarOpcoes,
              children: [
                _jsx(SelectAntd.Option, {
                  value: "",
                  children: "Selecione um contrato",
                }),
                contratos.map((contrato) =>
                  _jsx(
                    SelectAntd.Option,
                    { children: contrato.numero },
                    contrato.uuid
                  )
                ),
              ],
            }),
          }),
          _jsx("div", {
            className: "col-4",
            children: _jsxs(Field, {
              name: "edital",
              label: "Filtrar por Editais",
              component: ASelect,
              showSearch: true,
              filterOption: filtrarOpcoes,
              children: [
                _jsx(SelectAntd.Option, {
                  value: "",
                  children: "Selecione um edital",
                }),
                editais.map((edital) =>
                  _jsx(
                    SelectAntd.Option,
                    { children: edital.numero },
                    edital.uuid
                  )
                ),
              ],
            }),
          }),
        ],
      }),
  });
}
