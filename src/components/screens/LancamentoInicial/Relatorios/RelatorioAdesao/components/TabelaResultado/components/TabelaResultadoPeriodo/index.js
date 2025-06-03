import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table } from "antd";
import Column from "antd/es/table/Column";
const numeroParaPorcentagem = (value) =>
  numeroParaFormatoBR(Number((value * 100).toFixed(2))) + "%";
const numeroParaFormatoBR = (value) => value.toLocaleString("pt-BR");
const Total = (dados) => {
  let totalServido = 0;
  let totalFrequencia = 0;
  dados.forEach(({ total_servido, total_frequencia }) => {
    totalServido += total_servido;
    totalFrequencia += total_frequencia;
  });
  const totalAdesao = totalServido / totalFrequencia;
  return _jsxs(Table.Summary.Row, {
    children: [
      _jsx(Table.Summary.Cell, {
        index: 0,
        children: _jsx("b", { children: "TOTAL" }),
      }),
      _jsx(Table.Summary.Cell, {
        index: 1,
        children: _jsx("b", { children: numeroParaFormatoBR(totalServido) }),
      }),
      _jsx(Table.Summary.Cell, {
        index: 2,
        children: numeroParaFormatoBR(totalFrequencia),
      }),
      _jsx(Table.Summary.Cell, {
        index: 3,
        children: _jsx("b", { children: numeroParaPorcentagem(totalAdesao) }),
      }),
    ],
  });
};
export default (props) => {
  const { className, periodo, dados } = props;
  return _jsxs("div", {
    className: className,
    children: [
      _jsx("h3", {
        className: "text-start texto-simples-verde",
        children: _jsx("b", { children: periodo }),
      }),
      _jsxs(Table, {
        pagination: false,
        bordered: true,
        dataSource: dados,
        summary: Total,
        children: [
          _jsx(
            Column,
            {
              title: "Tipo de Alimenta\u00E7\u00E3o",
              dataIndex: "tipo_alimentacao",
            },
            "tipo_alimentacao"
          ),
          _jsx(
            Column,
            {
              title: "Total de Alimenta\u00E7\u00F5es Servidas",
              dataIndex: "total_servido",
              render: (value) =>
                _jsx("b", { children: numeroParaFormatoBR(value) }),
            },
            "total_servido"
          ),
          _jsx(
            Column,
            {
              title: "N\u00FAmero Total de Frequ\u00EAncia",
              dataIndex: "total_frequencia",
              render: (value) =>
                _jsx("span", { children: numeroParaFormatoBR(value) }),
            },
            "total_frequencia"
          ),
          _jsx(
            Column,
            {
              title: "% de Ades\u00E3o",
              dataIndex: "total_adesao",
              render: (value) =>
                _jsx("b", { children: numeroParaPorcentagem(value) }),
            },
            "total_adesao"
          ),
        ],
      }),
    ],
  });
};
