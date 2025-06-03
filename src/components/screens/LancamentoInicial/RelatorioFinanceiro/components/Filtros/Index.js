import { jsx as _jsx } from "react/jsx-runtime";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { FormFields } from "../FormFields";
export function Filtros({
  onSubmit,
  onClear,
  lotes,
  gruposUnidadeEscolar,
  mesesAnos,
}) {
  return _jsx("div", {
    className: "filtros-relatorio-financeiro",
    children: _jsx(CollapseFiltros, {
      onSubmit: onSubmit,
      onClear: onClear,
      titulo: "Filtrar Resultados",
      children: () =>
        _jsx(FormFields, {
          lotes: lotes,
          gruposUnidadeEscolar: gruposUnidadeEscolar,
          mesesAnos: mesesAnos,
        }),
    }),
  });
}
