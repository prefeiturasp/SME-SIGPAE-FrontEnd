import React from "react";

import { Table } from "antd";

import { Field } from "react-final-form";

import { AInputNumber } from "src/components/Shareable/MakeField";

import {
  formataValorDecimal,
  parserValorDecimal,
} from "src/components/screens/helper";
import { FormApi } from "final-form";

type Props = {
  form: FormApi<any, any>;
  faixasEtarias: Array<any>;
  nomeTabela: string;
  periodo: string;
  grupoSelecionado: string;
};

export default ({
  form,
  faixasEtarias,
  nomeTabela,
  periodo,
  grupoSelecionado,
}: Props) => {
  const labelTabela =
    grupoSelecionado === "grupo_2"
      ? `CEI - Período ${periodo}`
      : `Período ${periodo}`;

  return (
    <div className="row mt-5">
      <div className="col">
        <h2 className="text-start texto-simples-verde fw-bold mb-3">
          Preço das {nomeTabela} -{" "}
          <span className={`titulo-tag periodo-${periodo.toLowerCase()}`}>
            {labelTabela}
          </span>
        </h2>

        <Table pagination={false} bordered dataSource={faixasEtarias}>
          <Table.Column
            title="Faixas Etárias"
            dataIndex="__str__"
            key="__str__"
            render={(value, record: any) => {
              return (
                <div>
                  <p className="fw-bold mb-0">{value}</p>
                  <Field
                    component="input"
                    name={`tabelas[${nomeTabela} - ${labelTabela}].${value}.faixa_etaria`}
                    type="hidden"
                    defaultValue={record.uuid}
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
                name={`tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario`}
                placeholder="0,00"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
                onChange={(value: number) => {
                  const percentualAcrescimo =
                    form.getState().values.tabelas[
                      `${nomeTabela} - ${labelTabela}`
                    ]?.[record.__str__]?.percentual_acrescimo || 0;
                  const valorUnitarioTotal =
                    value * (1 + percentualAcrescimo / 100);

                  form.change(
                    `tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario_total`,
                    valorUnitarioTotal
                      ? Number(valorUnitarioTotal.toFixed(2))
                      : undefined,
                  );
                  form.change(
                    `tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario`,
                    value,
                  );
                }}
              />
            )}
          />
          <Table.Column
            title="% de acréscimo"
            dataIndex="percentual_acrescimo"
            key="percentual_acrescimo"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.percentual_acrescimo`}
                placeholder="%"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
                onChange={(value: number) => {
                  const valorUnitario =
                    form.getState().values.tabelas[
                      `${nomeTabela} - ${labelTabela}`
                    ]?.[record.__str__]?.valor_unitario || 0;
                  const valorUnitarioTotal = valorUnitario * (1 + value / 100);

                  form.change(
                    `tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario_total`,
                    valorUnitarioTotal
                      ? Number(valorUnitarioTotal.toFixed(2))
                      : undefined,
                  );
                  form.change(
                    `tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.percentual_acrescimo`,
                    value,
                  );
                }}
              />
            )}
          />
          <Table.Column
            title="Valor Total"
            dataIndex="valor_unitario_total"
            key="valor_unitario_total"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[${nomeTabela} - ${labelTabela}].${record.__str__}.valor_unitario_total`}
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
