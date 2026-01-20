import React from "react";

import { formataValorDecimal } from "../../../../helper.jsx";

type Props = {
  tabelas: Tabela[];
  tipoDieta: string;
};

type Tabela = {
  nome: string;
  valores: Valores[];
};

type Valores = {
  faixa_etaria: FaixaEtaria;
  tipo_alimentacao: null;
  grupo: string;
  valor_colunas: ValorColunas;
};

type FaixaEtaria = {
  __str__: string;
  uuid: string;
  inicio: number;
  fim: number;
};

type ValorColunas = {
  valor_unitario: number;
  percentual_acrescimo: number;
  valor_unitario_total: number;
};

export function TabelaDietasCEI({ tabelas, tipoDieta }: Props) {
  const grupoDieta = tipoDieta.includes("Tipo A") ? "GRUPO A" : "GRUPO B";

  return (
    <table className="mt-4">
      <thead>
        <tr className="row">
          <th className="col-6 text-center">
            TIPO DE ATENDIMENTO - DIETA ESPECIAL {grupoDieta}
          </th>
          <th className="col-2 text-center">VALOR UNITÁRIO</th>
          <th className="col-2 text-center">% de ACRÉSCIMO</th>
          <th className="col-2 text-center">VALOR UNITÁRIO COM ACRÉSCIMO</th>
        </tr>
      </thead>

      <tbody>
        {tabelas
          .filter((tabela) => tabela.nome.includes(tipoDieta))
          .map((tabela) => {
            const periodo = tabela.nome.split("Período ")[1];
            return tabela.valores.map((valor) => (
              <tr
                key={`${valor.faixa_etaria.__str__}_${periodo}`}
                className="row"
              >
                <td className="col-6 text-center">{`${periodo} ${valor.faixa_etaria.__str__}`}</td>
                <td className="col-2 text-center">{`R$ ${formataValorDecimal(
                  valor.valor_colunas?.valor_unitario,
                )}`}</td>
                <td className="col-2 text-center">{`${formataValorDecimal(
                  valor.valor_colunas?.percentual_acrescimo,
                )} %`}</td>
                <td className="col-2 text-center">{`R$ ${formataValorDecimal(
                  valor.valor_colunas?.valor_unitario_total,
                )}`}</td>
              </tr>
            ));
          })}
      </tbody>
    </table>
  );
}
