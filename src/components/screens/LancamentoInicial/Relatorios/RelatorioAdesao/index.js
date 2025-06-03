import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import FormFiltro from "./components/FormFiltro";
import TabelaResultado from "./components/TabelaResultado";
import useView from "./view";
export default () => {
  const view = useView();
  return _jsx("div", {
    className: "card mt-3",
    children: _jsxs("div", {
      className: "card-body",
      children: [
        _jsx(CollapseFiltros, {
          onSubmit: view.filtrar,
          onClear: view.limparFiltro,
          titulo: "Filtrar Resultados",
          manterFiltros: ["dre", "unidade_educacional"],
          children: (_, form) =>
            _jsx(FormFiltro, {
              form: form,
              onChange: view.atualizaFiltrosSelecionados,
            }),
        }),
        view.loading
          ? _jsx(SigpaeLogoLoader, {})
          : _jsx("div", {
              className: "d-flex gap-2 mt-4",
              children: _jsx(TabelaResultado, {
                params: view.params,
                filtros: view.filtros,
                resultado: view.resultado,
                exibirTitulo: view.exibirTitulo,
              }),
            }),
      ],
    }),
  });
};
