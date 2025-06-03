import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import TabelaResultadoPeriodo from "./components/TabelaResultadoPeriodo";
import ExportarResultado from "./components/ExportarResultado";
export default (props) => {
  const { params, filtros, resultado, exibirTitulo } = props;
  const temFiltros = filtros && Object.keys(filtros).length > 0;
  const resultadoVazio = resultado && Object.keys(resultado).length === 0;
  return _jsxs("div", {
    className: "container-fluid mt-4",
    children: [
      _jsx("h2", {
        className: "text-start texto-simples-verde",
        children:
          temFiltros &&
          exibirTitulo &&
          _jsxs(_Fragment, {
            children: [
              _jsx("b", {
                children: "Ades\u00E3o das Alimenta\u00E7\u00F5es Servidas",
              }),
              _jsx("b", { className: "mx-2", children: "-" }),
              filtros.mes &&
                _jsxs("b", {
                  className: "text-dark",
                  children: [filtros.mes, " | "],
                }),
              filtros.dre &&
                _jsxs("b", {
                  className: "text-dark",
                  children: [filtros.dre, " | "],
                }),
              filtros.lotes &&
                _jsxs("b", {
                  className: "text-dark",
                  children: [filtros.lotes.join(", "), " | "],
                }),
              filtros.unidade_educacional &&
                _jsx("b", {
                  className: "text-dark",
                  children: filtros.unidade_educacional,
                }),
            ],
          }),
      }),
      resultado &&
        _jsxs(_Fragment, {
          children: [
            _jsx("div", {
              children: Object.entries(resultado).map(([periodo, dados]) =>
                _jsx(
                  TabelaResultadoPeriodo,
                  {
                    className: "mt-4",
                    periodo: periodo,
                    dados: Object.entries(dados).map(
                      ([tipoAlimentacao, d]) => ({
                        tipo_alimentacao: tipoAlimentacao,
                        total_servido: d.total_servido,
                        total_frequencia: d.total_frequencia,
                        total_adesao: d.total_adesao,
                      })
                    ),
                  },
                  periodo
                )
              ),
            }),
            _jsx(ExportarResultado, {
              className: "d-flex justify-content-end mt-5",
              params: params,
            }),
          ],
        }),
      resultadoVazio &&
        _jsx("div", {
          children: _jsx("p", {
            children: "Nenhum resultado foi encontrado para esta busca.",
          }),
        }),
    ],
  });
};
