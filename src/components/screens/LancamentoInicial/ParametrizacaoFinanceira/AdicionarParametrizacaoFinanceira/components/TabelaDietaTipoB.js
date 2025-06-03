import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table } from "antd";
import Column from "antd/es/table/Column";
import { Field } from "react-final-form";
import { AInputNumber } from "src/components/Shareable/MakeField";
import {
  formataValorDecimal,
  parserValorDecimal,
} from "src/components/screens/helper";
const ALIMENTACOES = ["Lanche", "Lanche 4h"];
export default ({
  form,
  tiposAlimentacao,
  grupoSelecionado,
  tipoTurma = "",
}) => {
  const alimentacoes = tiposAlimentacao.filter((t) =>
    ALIMENTACOES.includes(t.nome)
  );
  const nomeTabela = tipoTurma
    ? `Dietas Tipo B - ${tipoTurma}`
    : "Dietas Tipo B";
  return _jsx("div", {
    className: "row mt-5",
    children: _jsxs("div", {
      className: "col",
      children: [
        ["grupo_2", "grupo_4"].includes(grupoSelecionado)
          ? _jsxs("h2", {
              className: "text-start texto-simples-verde fw-bold mb-3",
              children: [
                "Pre\u00E7o das Dietas Tipo B -",
                " ",
                _jsx("span", {
                  className: `titulo-tag turma-${tipoTurma
                    .replace(/\s/g, "-")
                    .toLocaleLowerCase()}`,
                  children: tipoTurma,
                }),
              ],
            })
          : _jsx("h2", {
              className: "text-start texto-simples-verde fw-bold",
              children: "Pre\u00E7o das Dietas Tipo B",
            }),
        _jsxs(Table, {
          pagination: false,
          bordered: true,
          dataSource: alimentacoes,
          children: [
            _jsx(
              Column,
              {
                title: "Tipo de Alimenta\u00E7\u00E3o",
                dataIndex: "nome",
                render: (value, record) => {
                  return _jsxs("div", {
                    children: [
                      _jsxs("p", {
                        className: "fw-bold mb-0",
                        children: [
                          value,
                          " ",
                          record.grupo && `- ${record.grupo}`,
                        ],
                      }),
                      _jsx(Field, {
                        component: "input",
                        name: `tabelas[${nomeTabela}].${value}_${record.grupo}.tipo_alimentacao`,
                        type: "hidden",
                        defaultValue: record.uuid,
                      }),
                      _jsx(Field, {
                        component: "input",
                        name: `tabelas[${nomeTabela}].${value}_${record.grupo}.grupo`,
                        type: "hidden",
                        defaultValue: record.grupo,
                      }),
                    ],
                  });
                },
              },
              "nome"
            ),
            _jsx(
              Column,
              {
                title: "Valor Unit\u00E1rio",
                dataIndex: "valor_unitario",
                render: (_, record) =>
                  _jsx(Field, {
                    component: AInputNumber,
                    name: `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario`,
                    placeholder: "0,00",
                    min: 0,
                    formatter: (value) => formataValorDecimal(value),
                    parser: (value) => parserValorDecimal(value),
                    defaultValue: null,
                    onChange: (value) => {
                      const percentualAcrescimo =
                        form.getState().values.tabelas[nomeTabela]?.[
                          `${record.nome}_${record.grupo}`
                        ]?.percentual_acrescimo || 0;
                      const valorUnitarioTotal =
                        value * (1 + percentualAcrescimo / 100);
                      form.change(
                        `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario_total`,
                        valorUnitarioTotal
                          ? Number(valorUnitarioTotal.toFixed(2))
                          : undefined
                      );
                      form.change(
                        `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario`,
                        value
                      );
                    },
                  }),
              },
              "valor_unitario"
            ),
            _jsx(
              Column,
              {
                title: "% de acr\u00E9scimo",
                dataIndex: "percentual_acrescimo",
                render: (_, record) =>
                  _jsx(Field, {
                    component: AInputNumber,
                    name: `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.percentual_acrescimo`,
                    placeholder: "%",
                    min: 0,
                    formatter: (value) => formataValorDecimal(value),
                    parser: (value) => parserValorDecimal(value),
                    defaultValue: null,
                    onChange: (value) => {
                      const valorUnitario =
                        form.getState().values.tabelas[nomeTabela]?.[
                          `${record.nome}_${record.grupo}`
                        ]?.valor_unitario || 0;
                      const valorUnitarioTotal =
                        valorUnitario * (1 + value / 100);
                      form.change(
                        `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario_total`,
                        valorUnitarioTotal
                          ? Number(valorUnitarioTotal.toFixed(2))
                          : undefined
                      );
                      form.change(
                        `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.percentual_acrescimo`,
                        value
                      );
                    },
                  }),
              },
              "percentual_acrescimo"
            ),
            _jsx(
              Column,
              {
                title: "Valor Unit. Total",
                dataIndex: "valor_unitario_total",
                render: (_, record) =>
                  _jsx(Field, {
                    component: AInputNumber,
                    name: `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario_total`,
                    placeholder: "0,00",
                    disabled: true,
                  }),
              },
              "valor_unitario_total"
            ),
          ],
        }),
      ],
    }),
  });
};
