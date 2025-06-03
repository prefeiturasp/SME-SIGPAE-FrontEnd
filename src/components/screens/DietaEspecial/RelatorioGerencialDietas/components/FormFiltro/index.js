import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { Skeleton } from "antd";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputComData } from "src/components/Shareable/DatePicker";
import useView from "./view";
export default (props) => {
  const { values, form, anoVigente } = props;
  const view = useView({ values, form, anoVigente });
  return _jsxs("div", {
    className: "row",
    children: [
      _jsx("div", {
        className: "col-4",
        children: view.loadingAnoOpcoes
          ? _jsx(Skeleton, { paragraph: false, active: true })
          : _jsx(Field, {
              component: MultiSelect,
              disableSearch: true,
              label: "Ano",
              name: "anos",
              nomeDoItemNoPlural: "anos",
              placeholder: "Selecione o ano",
              tooltipText:
                "Ser\u00E3o contabilizadas todas as dietas referente ao(s) ano(s) selecionado(s).",
              options: view.anoOpcoes,
            }),
      }),
      _jsx("div", {
        className: "col-4",
        children: _jsx(Field, {
          component: MultiSelect,
          disableSearch: true,
          label: "M\u00EAs",
          name: "meses",
          nomeDoItemNoPlural: "meses",
          placeholder: "Selecione o m\u00EAs",
          tooltipText:
            "Ser\u00E3o contabilizadas todas as dietas referente ao(s) mes(s) selecionado(s).",
          options: view.MES_OPCOES,
          disabled: view.selecionouMaisDeUmAno,
        }),
      }),
      _jsx("div", {
        className: "col-4",
        children: _jsx(Field, {
          component: InputComData,
          className: "input-data",
          label: "Dia",
          name: "dia",
          placeholder: "Selecione o dia",
          tooltipText:
            "Selecione apenas um m\u00EAs e um ano para habilitar o filtro de Dia",
          writable: false,
          minDate: view.dataMinima,
          maxDate: view.dataMaxima,
          disabled: view.selecionouMaisDeUmAno || view.selecionouMaisDeUmMes,
        }),
      }),
    ],
  });
};
