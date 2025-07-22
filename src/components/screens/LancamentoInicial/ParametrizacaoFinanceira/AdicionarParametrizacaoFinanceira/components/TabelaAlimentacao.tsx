import React from "react";

import { Table } from "antd";

import { Field } from "react-final-form";

import { AInputNumber } from "src/components/Shareable/MakeField";

import {
  formataValorDecimal,
  parserValorDecimal,
} from "src/components/screens/helper";

type Props = {
  tiposAlimentacao: Array<any>;
  grupoSelecionado: string;
  tipoTurma?: string;
};

export default ({ tiposAlimentacao, grupoSelecionado, tipoTurma }: Props) => {
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

  return (
    <div className="row mt-5">
      <div
        className={`col${
          !["grupo_2", "grupo_4"].includes(grupoSelecionado) ? "-4" : ""
        }`}
      >
        {["grupo_2", "grupo_4"].includes(grupoSelecionado) ? (
          <h2 className="text-start texto-simples-verde fw-bold mb-3">
            Preço das Alimentações -{" "}
            <span
              className={`titulo-tag turma-${tipoTurma
                .replace(/\s/g, "-")
                .toLocaleLowerCase()}`}
            >
              {tipoTurma}
            </span>
          </h2>
        ) : (
          <h2 className="text-start texto-simples-verde fw-bold">
            Preço das Alimentações
          </h2>
        )}

        <Table pagination={false} bordered dataSource={alimentacoes}>
          <Table.Column
            title="Tipo de Alimentação"
            dataIndex="nome"
            key="nome"
            render={(value, record: any) => {
              return (
                <div>
                  <p className="fw-bold mb-0">
                    {value} {record.grupo && `- ${record.grupo}`}
                  </p>
                  <Field
                    component="input"
                    name={`tabelas[${nomeTabela}].${value}_${record.grupo}.tipo_alimentacao`}
                    type="hidden"
                    defaultValue={record.uuid}
                  />
                  <Field
                    component="input"
                    name={`tabelas[${nomeTabela}].${value}_${record.grupo}.grupo`}
                    type="hidden"
                    defaultValue={record.grupo}
                  />
                </div>
              );
            }}
          />
          <Table.Column
            title="Valor Unitário"
            dataIndex="valor_unitario"
            key="valor_unitario"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario`}
                placeholder="0,00"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
              />
            )}
          />
          <Table.Column
            title="Valor Unitário Reajuste"
            dataIndex="valor_unitario_reajuste"
            key="valor_unitario_reajuste"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[${nomeTabela}].${record.nome}_${record.grupo}.valor_unitario_reajuste`}
                placeholder="0,00"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
};
