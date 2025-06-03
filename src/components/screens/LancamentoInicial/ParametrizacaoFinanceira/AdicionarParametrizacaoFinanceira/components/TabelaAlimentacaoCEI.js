import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table } from "antd";
import Column from "antd/es/table/Column";
import { Field } from "react-final-form";
import { AInputNumber } from "src/components/Shareable/MakeField";
import {
  formataValorDecimal,
  parserValorDecimal,
} from "src/components/screens/helper";
export function TabelaAlimentacaoCEI({
  faixasEtarias,
  grupoSelecionado,
  periodo,
}) {
  const labelTabela =
    grupoSelecionado === "grupo_2"
      ? `CEI - Período ${periodo}`
      : `Período ${periodo}`;
  return _jsx("div", {
    className: "row mt-5",
    children: _jsxs("div", {
      className: "col",
      children: [
        _jsxs("h2", {
          className: "text-start texto-simples-verde fw-bold mb-3",
          children: [
            "Pre\u00E7o das Alimenta\u00E7\u00F5es -",
            " ",
            _jsx("span", {
              className: `titulo-tag periodo-${periodo.toLowerCase()}`,
              children: labelTabela,
            }),
          ],
        }),
        _jsxs(Table, {
          pagination: false,
          bordered: true,
          dataSource: faixasEtarias,
          children: [
            _jsx(
              Column,
              {
                title: "Faixas Et\u00E1rias",
                dataIndex: "__str__",
                render: (value, record) => {
                  return _jsxs("div", {
                    children: [
                      _jsx("p", { className: "fw-bold mb-0", children: value }),
                      _jsx(Field, {
                        component: "input",
                        name: `tabelas[Preço das Alimentações - ${labelTabela}].${value}.faixa_etaria`,
                        type: "hidden",
                        defaultValue: record.uuid,
                      }),
                    ],
                  });
                },
              },
              "__str__"
            ),
            _jsx(
              Column,
              {
                title: "Valor Unit\u00E1rio",
                dataIndex: "valor_unitario",
                render: (_, record) =>
                  _jsx(Field, {
                    component: AInputNumber,
                    name: `tabelas[Preço das Alimentações - ${labelTabela}].${record.__str__}.valor_unitario`,
                    placeholder: "0,00",
                    min: 0,
                    formatter: (value) => formataValorDecimal(value),
                    parser: (value) => parserValorDecimal(value),
                    defaultValue: null,
                  }),
              },
              "valor_unitario"
            ),
            _jsx(
              Column,
              {
                title: "Valor Unit\u00E1rio Reajuste",
                dataIndex: "valor_unitario_reajuste",
                render: (_, record) =>
                  _jsx(Field, {
                    component: AInputNumber,
                    name: `tabelas[Preço das Alimentações - ${labelTabela}].${record.__str__}.valor_unitario_reajuste`,
                    placeholder: "0,00",
                    min: 0,
                    formatter: (value) => formataValorDecimal(value),
                    parser: (value) => parserValorDecimal(value),
                    defaultValue: null,
                  }),
              },
              "valor_unitario_reajuste"
            ),
          ],
        }),
      ],
    }),
  });
}
