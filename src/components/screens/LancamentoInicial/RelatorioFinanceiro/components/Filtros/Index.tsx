import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { FormFields } from "../FormFields";
import { SelectOption, MultiSelectOption } from "../../types";

type FiltrosProps = {
  onSubmit: (_values: any) => void;
  onClear: () => void;
  lotes: MultiSelectOption[];
  gruposUnidadeEscolar: MultiSelectOption[] | SelectOption[];
  mesesAnos: SelectOption[];
};

export function Filtros({
  onSubmit,
  onClear,
  lotes,
  gruposUnidadeEscolar,
  mesesAnos,
}: FiltrosProps) {
  return (
    <div className="filtros-relatorio-financeiro">
      <CollapseFiltros
        onSubmit={onSubmit}
        onClear={onClear}
        titulo="Filtrar Resultados"
      >
        {() => (
          <FormFields
            lotes={lotes}
            gruposUnidadeEscolar={gruposUnidadeEscolar}
            mesesAnos={mesesAnos}
          />
        )}
      </CollapseFiltros>
    </div>
  );
}
