import React from "react";

import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { FormFields } from "../FormFields";

type FiltrosProps = {
  onSubmit: (_values: any) => void;
  onClear: () => void;
  lotes: {
    value: string;
    label: string;
  }[];
  gruposUnidadeEscolar: {
    uuid: string;
    nome: string;
  }[];
  mesesAnos: {
    uuid: string;
    nome: string;
  }[];
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
