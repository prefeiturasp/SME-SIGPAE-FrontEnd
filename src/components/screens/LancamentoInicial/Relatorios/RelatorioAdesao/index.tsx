import React from "react";

import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";

import FormFiltro from "./components/FormFiltro";
import TabelaResultado from "./components/TabelaResultado";

import useView from "./view";

export default () => {
  const view = useView();

  return (
    <div className="card mt-3">
      <div className="card-body">
        <CollapseFiltros
          onSubmit={view.filtrar}
          onClear={view.limparFiltro}
          titulo="Filtrar Resultados"
          manterFiltros={["dre", "unidade_educacional"]}
        >
          {(_, form) => (
            <FormFiltro
              form={form}
              onChange={view.atualizaFiltrosSelecionados}
            />
          )}
        </CollapseFiltros>

        {view.loading ? (
          <SigpaeLogoLoader />
        ) : (
          <div className="d-flex gap-2 mt-4">
            <TabelaResultado
              params={view.params}
              filtros={view.filtros}
              resultado={view.resultado}
              exibirTitulo={view.exibirTitulo}
            />
          </div>
        )}
      </div>
    </div>
  );
};
