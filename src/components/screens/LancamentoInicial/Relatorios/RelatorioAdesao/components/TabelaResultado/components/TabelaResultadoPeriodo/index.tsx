import React from "react";

import { Table } from "antd";

import { Props, TotalAlimentacao } from "./types";

const numeroParaPorcentagem = (value: number) =>
  numeroParaFormatoBR(Number((value * 100).toFixed(2))) + "%";

const numeroParaFormatoBR = (value: number) => value.toLocaleString("pt-BR");

const Total = (dados: Array<TotalAlimentacao>) => {
  let totalServido = 0;
  let totalFrequencia = 0;

  dados.forEach(({ total_servido, total_frequencia }) => {
    totalServido += total_servido;
    totalFrequencia += total_frequencia;
  });

  const totalAdesao = totalServido / totalFrequencia;

  return (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}>
        <b>TOTAL</b>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={1}>
        <b>{numeroParaFormatoBR(totalServido)}</b>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={2}>
        {numeroParaFormatoBR(totalFrequencia)}
      </Table.Summary.Cell>
      <Table.Summary.Cell index={3}>
        <b>{numeroParaPorcentagem(totalAdesao)}</b>
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );
};

export default (props: Props) => {
  const { className, periodo, dados } = props;

  return (
    <div className={className}>
      <h3 className="text-start texto-simples-verde">
        <b>{periodo}</b>
      </h3>
      <Table pagination={false} bordered dataSource={dados} summary={Total}>
        <Table.Column
          title="Tipo de Alimentação"
          dataIndex="tipo_alimentacao"
          key="tipo_alimentacao"
        />
        <Table.Column
          title="Total de Alimentações Servidas"
          dataIndex="total_servido"
          key="total_servido"
          render={(value: number) => <b>{numeroParaFormatoBR(value)}</b>}
        />
        <Table.Column
          title="Número Total de Frequência"
          dataIndex="total_frequencia"
          key="total_frequencia"
          render={(value: number) => <span>{numeroParaFormatoBR(value)}</span>}
        />
        <Table.Column
          title="% de Adesão"
          dataIndex="total_adesao"
          key="total_adesao"
          render={(value: number) => <b>{numeroParaPorcentagem(value)}</b>}
        />
      </Table>
    </div>
  );
};
