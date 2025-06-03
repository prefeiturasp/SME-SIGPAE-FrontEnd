import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select as SelectAntd } from "antd";
import { Field } from "react-final-form";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import {
  ASelect,
  AInput,
  AInputNumber,
} from "src/components/Shareable/MakeField";
import {
  formataValorDecimal,
  parserValorDecimal,
} from "../../../../helper.jsx";
export function Filtros({ onSubmit, onClear, editais }) {
  return _jsx(CollapseFiltros, {
    onSubmit: onSubmit,
    onClear: onClear,
    titulo: "Filtrar Resultados",
    children: () =>
      _jsxs("div", {
        className: "row",
        children: [
          _jsx("div", {
            className: "col-4",
            children: _jsxs(Field, {
              name: "edital",
              label: "N\u00BA do Edital",
              component: ASelect,
              showSearch: true,
              filterOption: (value, option) =>
                option.label.toUpperCase().indexOf(value.toUpperCase()) !== -1,
              children: [
                _jsx(SelectAntd.Option, {
                  value: "",
                  children: "Selecione o edital",
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
          _jsx("div", {
            className: "col-4",
            children: _jsx(Field, {
              name: "numero_clausula",
              label: "Cl\u00E1usulas",
              placeholder: "Digite uma cl\u00E1usula",
              autoComplete: "off",
              component: AInput,
            }),
          }),
          _jsx("div", {
            className: "col-4",
            children: _jsx(Field, {
              name: "porcentagem_desconto",
              label: "% de Desconto",
              placeholder: "Digite uma porcentagem",
              component: AInputNumber,
              min: 0,
              formatter: (value) => formataValorDecimal(value),
              parser: (value) => parserValorDecimal(value),
              style: { width: "100%" },
            }),
          }),
        ],
      }),
  });
}
