import React from "react";

import { formataValorDecimal } from "../../../../helper.jsx";

type Props = {
  tabelas: Tabela[];
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
  valor_unitario_reajuste: number;
};

export function TabelaAlimentacaoCEI({ tabelas }: Props) {
  return (
    <table>
      <thead>
        <tr className="row">
          <th className="col-6 text-center">TIPO DE ATENDIMENTO - SEM DIETA</th>
          <th className="col-2 text-center">VALOR UNITÁRIO</th>
          <th className="col-2 text-center">VALOR UNITÁRIO REAJUSTE</th>
          <th className="col-2 text-center">VALOR UNITÁRIO TOTAL</th>
        </tr>
      </thead>

      <tbody>
        {tabelas
          .filter((tabela) => tabela.nome.includes("Preço das Alimentações"))
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
                <td className="col-2 text-center">{`R$ ${formataValorDecimal(
                  valor.valor_colunas?.valor_unitario_reajuste,
                )}`}</td>
                <td className="col-2 text-center">{`R$ ${formataValorDecimal(
                  valor.valor_colunas?.valor_unitario +
                    valor.valor_colunas?.valor_unitario_reajuste,
                )}`}</td>
              </tr>
            ));
          })}
      </tbody>
    </table>
  );
}
