import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { useSearchParams } from "react-router-dom";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { Select } from "src/components/Shareable/Select";
export function FormFields({ lotes, gruposUnidadeEscolar, mesesAnos }) {
  const [searchParams] = useSearchParams();
  const uuidRelatorioFinanceiro = searchParams.get("uuid");
  return _jsxs("div", {
    className: "row",
    children: [
      _jsx("div", {
        className: "col-8",
        children: _jsx(Field, {
          component: MultiSelect,
          name: "lote",
          label: "Lote e DRE",
          placeholder: "Selecione um lote e uma DRE",
          nomeDoItemNoPlural: "lotes",
          naoDesabilitarPrimeiraOpcao: true,
          options: lotes,
          disabled: uuidRelatorioFinanceiro,
        }),
      }),
      _jsx("div", {
        className: "col-4",
        children: _jsx(Field, {
          component: Select,
          name: "grupo_unidade_escolar",
          label: "Tipo de UE",
          naoDesabilitarPrimeiraOpcao: true,
          options: gruposUnidadeEscolar,
          disabled: uuidRelatorioFinanceiro,
        }),
      }),
      _jsx("div", {
        className: "col-4",
        children: _jsx(Field, {
          component: Select,
          name: "mes_ano",
          label: "M\u00EAs de Refer\u00EAncia",
          naoDesabilitarPrimeiraOpcao: true,
          options: mesesAnos,
          disabled: uuidRelatorioFinanceiro,
        }),
      }),
    ],
  });
}
