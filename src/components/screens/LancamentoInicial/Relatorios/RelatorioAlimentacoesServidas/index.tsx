import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";

import FormFiltro from "./components/FormFiltro";
import { IFiltros } from "./types";

export default () => {
  return (
    <div className="card mt-3">
      <div className="card-body">
        <CollapseFiltros
          titulo="Filtrar Resultados"
          onSubmit={() => {}}
          onClear={() => {}}
          renderBotoes={({ values, limparFiltros }) => (
            <>
              <Botao
                dataTestId="botao-exportar-excel"
                texto="Exportar Excel"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                icon={BUTTON_ICON.FILE_EXCEL}
                className="float-end ms-3"
                disabled={!values.mes || !values.dres?.length}
              />
              <Botao
                dataTestId="botao-limpar-filtros"
                texto="Limpar Filtros"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end ms-3"
                onClick={limparFiltros}
              />
            </>
          )}
        >
          {(values: IFiltros, form) => (
            <FormFiltro form={form} values={values} />
          )}
        </CollapseFiltros>
      </div>
    </div>
  );
};
