import React from "react";

import { Table } from "antd";
import Column from "antd/es/table/Column";

import { Field } from "react-final-form";

import { AInputNumber } from "components/Shareable/MakeField";

import {
  formataValorDecimal,
  parserValorDecimal,
} from "components/screens/helper";
import { FormApi } from "final-form";

const ALIMENTACOES = ["Refeição", "Lanche", "Lanche 4h"];

type Props = {
  form: FormApi<any, any>;
  tiposAlimentacao: Array<any>;
};

export default ({ form, tiposAlimentacao }: Props) => {
  const alimentacoes = tiposAlimentacao
    .filter((t) => ALIMENTACOES.includes(t.nome))
    .map((ta) => ({
      ...ta,
      grupo: ta.nome === "Refeição" ? "Dieta Enteral" : null,
    }));

  return (
    <div className="row mt-5">
      <div className="col">
        <h2 className="text-start texto-simples-verde fw-bold">
          Preço das Dietas Tipo A e Tipo A Enteral
        </h2>
        <Table pagination={false} bordered dataSource={alimentacoes}>
          <Column
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
                    name={`tabelas["Dietas Tipo A e Tipo A Enteral"].${value}.tipo_alimentacao`}
                    type="hidden"
                    defaultValue={record.uuid}
                  />
                  <Field
                    component="input"
                    name={`tabelas["Dietas Tipo A e Tipo A Enteral"].${value}.grupo`}
                    type="hidden"
                    defaultValue={record.grupo}
                  />
                </div>
              );
            }}
          />
          <Column
            title="Valor Unitário"
            dataIndex="valor_unitario"
            key="valor_unitario"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas["Dietas Tipo A e Tipo A Enteral"].${record.nome}.valor_unitario`}
                placeholder="0,00"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
                onChange={(value: number) => {
                  const percentualAcrescimo =
                    form.getState().values.tabelas[
                      "Dietas Tipo A e Tipo A Enteral"
                    ][record.nome].percentual_acrescimo || 0;
                  const valorUnitarioTotal =
                    value * (1 + percentualAcrescimo / 100);

                  form.change(
                    `tabelas["Dietas Tipo A e Tipo A Enteral"].${record.nome}.valor_unitario_total`,
                    valorUnitarioTotal
                      ? Number(valorUnitarioTotal.toFixed(2))
                      : undefined
                  );
                  form.change(
                    `tabelas["Dietas Tipo A e Tipo A Enteral"].${record.nome}.valor_unitario`,
                    value
                  );
                }}
              />
            )}
          />
          <Column
            title="% de acréscimo"
            dataIndex="percentual_acrescimo"
            key="percentual_acrescimo"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas["Dietas Tipo A e Tipo A Enteral"].${record.nome}.percentual_acrescimo`}
                placeholder="%"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
                onChange={(value: number) => {
                  const valorUnitario =
                    form.getState().values.tabelas[
                      "Dietas Tipo A e Tipo A Enteral"
                    ][record.nome].valor_unitario || 0;
                  const valorUnitarioTotal = valorUnitario * (1 + value / 100);

                  form.change(
                    `tabelas["Dietas Tipo A e Tipo A Enteral"].${record.nome}.valor_unitario_total`,
                    valorUnitarioTotal
                      ? Number(valorUnitarioTotal.toFixed(2))
                      : undefined
                  );
                  form.change(
                    `tabelas["Dietas Tipo A e Tipo A Enteral"].${record.nome}.percentual_acrescimo`,
                    value
                  );
                }}
              />
            )}
          />
          <Column
            title="Valor Unit. Total"
            dataIndex="valor_unitario_total"
            key="valor_unitario_total"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas["Dietas Tipo A e Tipo A Enteral"].${record.nome}.valor_unitario_total`}
                placeholder="0,00"
                disabled
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
};