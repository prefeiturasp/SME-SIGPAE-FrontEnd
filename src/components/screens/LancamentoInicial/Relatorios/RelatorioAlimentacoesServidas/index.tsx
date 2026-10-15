import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";

import FormFiltro from "./components/FormFiltro";
import { IFiltros } from "./types";
import useView from "./view";

export default () => {
  const view = useView();

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
                icon={
                  view.exportando ? BUTTON_ICON.LOADING : BUTTON_ICON.FILE_EXCEL
                }
                className="float-end ms-3"
                disabled={
                  view.exportando ||
                  !values.meses?.length ||
                  !values.dres?.length
                }
                onClick={() => view.exportar(values)}
              />
              <Botao
                dataTestId="botao-limpar-filtros"
                texto="Limpar Filtros"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end ms-3"
                onClick={limparFiltros}
                disabled={view.exportando}
              />
            </>
          )}
        >
          {(values: IFiltros, form) => (
            <FormFiltro form={form} values={values} />
          )}
        </CollapseFiltros>
        {view.exibirModalCentralDownloads && (
          <ModalSolicitacaoDownload
            show={view.exibirModalCentralDownloads}
            setShow={view.setExibirModalCentralDownloads}
            callbackClose={undefined}
          />
        )}
      </div>
    </div>
  );
};
