import React from "react";

import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { Paginacao } from "src/components/Shareable/Paginacao";
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
          manterFiltros={["unidade_educacional"]}
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
          <>
            <div className="d-flex gap-2 mt-4">
              <TabelaResultado
                params={view.params}
                filtros={view.filtros}
                resultado={view.resultado}
                escola={view.escola}
                exibirTitulo={view.exibirTitulo}
              />
            </div>
            {view.paginacao && view.paginacao.count > 0 && (
              <Paginacao
                className="mt-3 mb-3"
                current={view.paginaAtual}
                total={view.paginacao.count}
                pageSize={view.paginacao.page_size}
                onChange={view.mudarPagina}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
