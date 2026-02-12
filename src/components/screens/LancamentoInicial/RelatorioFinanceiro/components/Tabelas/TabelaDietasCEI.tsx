import {
  FaixaEtaria,
  TabelaParametrizacao,
  ValorTabela,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { formataMilharDecimal } from "src/helpers/utilities";
import { stringDecimalToNumber } from "src/helpers/parsers";
import { TabelaDietasCEIHandle } from "../../types";
import { forwardRef, useImperativeHandle } from "react";

type Props = {
  tabelas: TabelaParametrizacao[];
  tipoDieta: string;
  faixasEtarias: FaixaEtaria[];
  totaisConsumo?: any;
  ordem?: string;
};

const _PERIODOS = [
  { value: "INTEGRAL", label: "Período Integral" },
  { value: "PARCIAL", label: "Período Parcial" },
];

const _TIPO_CLASS = {
  "TIPO A": "cor-tipo-a",
  "TIPO B": "cor-tipo-b",
};

export const TabelaDietasCEI = forwardRef<TabelaDietasCEIHandle, Props>(
  ({ tabelas, tipoDieta, faixasEtarias, totaisConsumo, ordem }, ref) => {
    let totalConsumoGeral = 0;
    let valorTotalGeral = 0;

    useImperativeHandle(ref, () => ({
      getTotais: () => ({
        totalConsumoGeral,
        valorTotalGeral,
      }),
    }));

    return (
      <table className="tabela-relatorio">
        <thead>
          <tr className={_TIPO_CLASS[tipoDieta] ?? ""}>
            <th className="col-faixa">DIETA ESPECIAL - {tipoDieta}</th>
            <th className="col-unitario">VALOR UNITÁRIO</th>
            <th className="col-reajuste">% de ACRÉSCIMO</th>
            <th className="col-total-unitario">VALOR UNITÁRIO TOTAL</th>
            <th className="col-atendimentos">CONSUMO {tipoDieta}</th>
            <th className="col-valor-total">VALOR TOTAL</th>
          </tr>
        </thead>

        <tbody>
          {_PERIODOS.map((periodo) => {
            const tabela = tabelas.find(
              (tabela) =>
                tabela.nome.toUpperCase().includes(tipoDieta) &&
                tabela.periodo_escolar === periodo.value,
            );

            return faixasEtarias.map((faixa) => {
              const valorUnitario = stringDecimalToNumber(
                tabela?.valores.find(
                  (v: ValorTabela) =>
                    v.faixa_etaria.uuid === faixa.uuid &&
                    v.tipo_valor === "UNITARIO",
                )?.valor ?? "0",
              );

              const valorAcrescimo = stringDecimalToNumber(
                tabela?.valores.find(
                  (v: ValorTabela) =>
                    v.faixa_etaria.uuid === faixa.uuid &&
                    v.tipo_valor === "ACRESCIMO",
                )?.valor ?? "0",
              );

              const numeroConsumo =
                totaisConsumo?.[
                  `DIETA ESPECIAL - ${tipoDieta} - ${periodo.value}`
                ]?.[faixa.__str__] ?? 0;

              const totalUnitario = Number(
                (valorUnitario * (1 + valorAcrescimo / 100)).toFixed(2),
              );

              const valorTotal = Number(
                (totalUnitario * numeroConsumo).toFixed(2),
              );

              totalConsumoGeral += numeroConsumo;
              valorTotalGeral += valorTotal;

              return (
                <tr key={`${faixa.uuid}-${periodo.value}`}>
                  <td className="col-faixa">
                    {periodo.label} <b>- {faixa.__str__}</b>
                  </td>
                  <td className="col-unitario">
                    R$ {formataMilharDecimal(valorUnitario)}
                  </td>
                  <td className="col-reajuste">
                    % {formataMilharDecimal(valorAcrescimo)}
                  </td>
                  <td className="col-total-unitario">
                    R$ {formataMilharDecimal(totalUnitario)}
                  </td>
                  <td className="col-atendimentos">{numeroConsumo}</td>
                  <td className="col-valor-total">
                    R$ {formataMilharDecimal(valorTotal)}
                  </td>
                </tr>
              );
            });
          })}
          <tr key={`total_${ordem}`} className="linha-total">
            <td className="col-faixa">TOTAL ({ordem})</td>
            <td className="col-unitario"></td>
            <td className="col-reajuste"></td>
            <td className="col-total-unitario"></td>
            <td className="col-atendimentos">{totalConsumoGeral}</td>
            <td className="col-valor-total">
              R$ {formataMilharDecimal(valorTotalGeral)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);
