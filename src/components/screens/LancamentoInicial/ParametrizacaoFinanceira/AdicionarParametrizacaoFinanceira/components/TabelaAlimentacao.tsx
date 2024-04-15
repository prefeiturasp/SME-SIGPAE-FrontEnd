import React from "react";

import { Table } from "antd";
import Column from "antd/es/table/Column";

import { Field } from "react-final-form";

import { AInputNumber } from "components/Shareable/MakeField";

import {
  formataValorDecimal,
  parserValorDecimal,
} from "components/screens/helper";

type Props = {
  tiposAlimentacao: Array<any>;
  grupoSelecionado: string;
};

export default ({ tiposAlimentacao, grupoSelecionado }: Props) => {
  const alimentacoes = tiposAlimentacao.map((t) => ({ ...t }));

  if (grupoSelecionado === "grupo_3") {
    const refeicaoIndex = alimentacoes.findIndex((t) => t.nome === "Refeição");
    if (refeicaoIndex !== -1) {
      alimentacoes[refeicaoIndex] = {
        ...alimentacoes[refeicaoIndex],
        grupo: "EMEF / CEUEMEF / EMEFM / EMEBS",
      };

      alimentacoes.splice(refeicaoIndex + 1, 0, {
        ...alimentacoes[refeicaoIndex],
        grupo: "CIEJA / EJA",
      });
    }
  }

  return (
    <div className="row mt-5">
      <div className="col-4">
        <h2 className="text-start texto-simples-verde fw-bold">
          Preço das Alimentações Convencionais
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
                    name={`tabelas["Alimentações Convencionais"].${value}_${record.grupo}.tipo_alimentacao`}
                    type="hidden"
                    defaultValue={record.uuid}
                  />
                  <Field
                    component="input"
                    name={`tabelas["Alimentações Convencionais"].${value}_${record.grupo}.grupo`}
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
                name={`tabelas["Alimentações Convencionais"].${record.nome}_${record.grupo}.valor_unitario`}
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
                name={`tabelas["Alimentações Convencionais"].${record.nome}_${record.grupo}.valor_unitario_reajuste`}
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
