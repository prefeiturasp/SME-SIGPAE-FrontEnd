import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { Select as SelectAntd } from "antd";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { ASelect } from "src/components/Shareable/MakeField";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputComData } from "src/components/Shareable/DatePicker";
import { MESES } from "src/constants/shared";
import { required } from "src/helpers/fieldValidators";
import {
  formatarParaMultiselect,
  maxEntreDatas,
  formataData,
  adicionaDias,
} from "src/helpers/utilities";
import "./styles.scss";
export function Filtros({
  onSubmit,
  onClear,
  mesesAnos,
  getOpcoesFiltros,
  periodos,
  dataInicial,
  dataFinal,
}) {
  const minDate = new Date(dataInicial.replace(/-/g, "/"));
  const maxDate = new Date(dataFinal.replace(/-/g, "/"));
  const resetForm = (form) => {
    form.change("periodos", null);
    form.change("data_inicial", null);
    form.change("data_final", null);
  };
  return _jsx("div", {
    className: "filtros-controle-de-frequencia",
    children: _jsx(CollapseFiltros, {
      onSubmit: onSubmit,
      onClear: onClear,
      titulo: "Filtrar Resultados",
      children: (values, form) =>
        _jsxs("div", {
          className: "row",
          children: [
            _jsxs("div", {
              className: "col-3 d-flex",
              children: [
                _jsx("span", { className: "required-asterisk", children: "*" }),
                _jsxs(Field, {
                  name: "mes_ano",
                  label: "Filtrar por M\u00EAs",
                  component: ASelect,
                  validate: required,
                  onChange: (value) => {
                    form.change("mes_ano", value);
                    resetForm(form);
                    if (value) {
                      getOpcoesFiltros(value);
                    }
                  },
                  children: [
                    _jsx(SelectAntd.Option, {
                      value: "",
                      children: "Selecione um M\u00EAs",
                    }),
                    mesesAnos.map((mesAno) =>
                      _jsx(
                        SelectAntd.Option,
                        { children: `${MESES[mesAno.mes - 1]} ${mesAno.ano}` },
                        `${mesAno.mes}_${mesAno.ano}`
                      )
                    ),
                  ],
                }),
              ],
            }),
            _jsx("div", {
              className: "col-3",
              children: _jsx(Field, {
                name: "periodos",
                label: "Filtrar por Per\u00EDodo",
                nomeDoItemNoPlural: "periodos",
                placeholder: "Selecione um Per\u00EDodo",
                component: MultiSelect,
                options: formatarParaMultiselect(periodos),
                disabled: !values.mes_ano,
              }),
            }),
            _jsx("div", {
              className: "col-3",
              children: _jsx(Field, {
                name: "data_inicial",
                label: "Filtrar por Dia",
                placeholder: "De",
                component: InputComData,
                minDate: minDate,
                maxDate: values.data_final
                  ? adicionaDias(values.data_final, "YYYY-MM-DD")
                  : maxDate,
                format: (data) =>
                  data ? formataData(data, "YYYY-MM-DD", "DD/MM/YYYY") : null,
                parse: (value) =>
                  value && formataData(value, "DD/MM/YYYY", "YYYY-MM-DD"),
                disabled: !values.mes_ano,
              }),
            }),
            _jsx("div", {
              className: "col-3 datepicker-data_final",
              children: _jsx(Field, {
                name: "data_final",
                placeholder: "At\u00E9",
                component: InputComData,
                minDate: maxEntreDatas([
                  minDate,
                  values.data_inicial &&
                    adicionaDias(values.data_inicial, "YYYY-MM-DD"),
                ]),
                maxDate: maxDate,
                format: (data) =>
                  data ? formataData(data, "YYYY-MM-DD", "DD/MM/YYYY") : null,
                parse: (value) =>
                  value && formataData(value, "DD/MM/YYYY", "YYYY-MM-DD"),
                disabled: !values.mes_ano,
              }),
            }),
          ],
        }),
    }),
  });
}
