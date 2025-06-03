import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table } from "antd";
import Column from "antd/es/table/Column";
import { Field } from "react-final-form";
import { AInputNumber } from "src/components/Shareable/MakeField";
import {
  formataValorDecimal,
  parserValorDecimal,
} from "src/components/screens/helper";
export default ({ tiposAlimentacao, grupoSelecionado, tipoTurma }) => {
  const alimentacoes = tiposAlimentacao.map((t) => ({ ...t }));
  if (grupoSelecionado === "grupo_3") {
    const refeicaoIndex = alimentacoes.findIndex((t) => t.nome === "Refeição");
    if (refeicaoIndex !== -1) {
      alimentacoes[refeicaoIndex] = {
        ...alimentacoes[refeicaoIndex],
        grupo: "EMEF / CEUEMEF / EMEFM",
      };
      alimentacoes.splice(refeicaoIndex + 1, 0, {
        ...alimentacoes[refeicaoIndex],
        grupo: "CIEJA / EJA",
      });
    }
  }
  const nomeTabela = tipoTurma
    ? `Preço das Alimentações - ${tipoTurma}`
    : "Preço das Alimentações";
  return _jsx("div", {
    className: "row mt-5",
    children: _jsxs("div", {
      className: `col${
        !["grupo_2", "grupo_4"].includes(grupoSelecionado) ? "-4" : ""
      }`,
      children: [
        ["grupo_2", "grupo_4"].includes(grupoSelecionado)
          ? _jsxs("h2", {
              className: "text-start texto-simples-verde fw-bold mb-3",
              children: [
                "Pre\u00E7o das Alimenta\u00E7\u00F5es -",
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
              children: "Pre\u00E7o das Alimenta\u00E7\u00F5es",
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
                    name: `tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario_reajuste`,
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
};
