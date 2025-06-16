import React from "react";

import { Table } from "antd";
import Column from "antd/es/table/Column";

import { Field } from "react-final-form";

import { AInputNumber } from "src/components/Shareable/MakeField";

import {
  formataValorDecimal,
  parserValorDecimal,
} from "src/components/screens/helper";

type Props = {
  faixasEtarias: Array<any>;
  grupoSelecionado: string;
  periodo: string;
};

export function TabelaAlimentacaoCEI({
  faixasEtarias,
  grupoSelecionado,
  periodo,
}: Props) {
  const labelTabela =
    grupoSelecionado === "grupo_2"
      ? `CEI - Período ${periodo}`
      : `Período ${periodo}`;

  return (
    <div className="row mt-5">
      <div className="col">
        <h2 className="text-start texto-simples-verde fw-bold mb-3">
          Preço das Alimentações -{" "}
          <span className={`titulo-tag periodo-${periodo.toLowerCase()}`}>
            {labelTabela}
          </span>
        </h2>

        <Table pagination={false} bordered dataSource={faixasEtarias}>
          <Column
            title="Faixas Etárias"
            dataIndex="__str__"
            key="__str__"
            render={(value, record: any) => {
              return (
                <div>
                  <p className="fw-bold mb-0">{value}</p>
                  <Field
                    component="input"
                    name={`tabelas[Preço das Alimentações - ${labelTabela}].${value}.faixa_etaria`}
                    type="hidden"
                    defaultValue={record.uuid}
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
                name={`tabelas[Preço das Alimentações - ${labelTabela}].${record.__str__}.valor_unitario`}
                placeholder="0,00"
                min={0}
                formatter={(value: string) => formataValorDecimal(value)}
                parser={(value: string) => parserValorDecimal(value)}
                defaultValue={null}
              />
            )}
          />
          <Column
            title="Valor Unitário Reajuste"
            dataIndex="valor_unitario_reajuste"
            key="valor_unitario_reajuste"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[Preço das Alimentações - ${labelTabela}].${record.__str__}.valor_unitario_reajuste`}
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
}
