import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import FormFiltro from "./components/FormFiltro";
import CardResultado from "./components/CardResultado";
import { buscaTotaisRelatorioGerencialDietas } from "src/services/painelNutricionista.service";
const getAnoVigente = () => new Date().getFullYear();
export default () => {
  const [loading, setLoading] = useState(true);
  const [totais, setTotais] = useState({});
  const filtrar = async (values) => {
    setLoading(true);
    const params = {
      anos: Array.isArray(values.anos) ? values.anos.join() : null,
      meses: Array.isArray(values.meses) ? values.meses.join() : null,
      dia: values.dia || null,
    };
    const data = await buscaTotaisRelatorioGerencialDietas(params);
    setTotais(data);
    setLoading(false);
  };
  const limparFiltro = () => {
    filtrar({
      anos: [getAnoVigente()],
    });
  };
  return _jsx("div", {
    className: "card mt-3",
    children: _jsxs("div", {
      className: "card-body",
      children: [
        _jsx(CollapseFiltros, {
          onSubmit: filtrar,
          onClear: limparFiltro,
          titulo: "Filtrar Resultados",
          children: (values, form) =>
            _jsx(FormFiltro, {
              values: values,
              form: form,
              anoVigente: getAnoVigente(),
            }),
        }),
        loading
          ? _jsx(SigpaeLogoLoader, {})
          : _jsxs("div", {
              className: "d-flex gap-2 mt-4",
              children: [
                _jsx(CardResultado, {
                  titulo: "Total de Solicita\u00E7\u00F5es",
                  classeCor: "azul-escuro",
                  total: totais.total_solicitacoes ?? 0,
                }),
                _jsx(CardResultado, {
                  titulo: "Autorizadas",
                  classeCor: "verde-claro",
                  total: totais.total_autorizadas ?? 0,
                }),
                _jsx(CardResultado, {
                  titulo: "Negadas",
                  classeCor: "laranja",
                  total: totais.total_negadas ?? 0,
                }),
                _jsx(CardResultado, {
                  titulo: "Canceladas",
                  classeCor: "vermelho",
                  total: totais.total_canceladas ?? 0,
                }),
              ],
            }),
      ],
    }),
  });
};
