import { useMemo, forwardRef, useImperativeHandle } from "react";
import {
  FaixaEtaria,
  TabelaParametrizacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { formataMilhar, formataMilharDecimal } from "src/helpers/utilities";
import { TabelaDietasHandle } from "../../types";
import { formataPercentual, obterValorFaixa } from "../../helpers";

type TipoDieta = "TIPO A" | "TIPO B";

type Props = {
  tabelas: TabelaParametrizacao[];
  tipoDieta: TipoDieta;
  faixasEtarias: FaixaEtaria[];
  totaisConsumo?: any;
  ordem?: string;
};

type LinhaDietaFaixa = {
  chave: string;
  periodo: string;
  faixa: string;
  numeroConsumo: number;
  valorUnitario: number;
  valorAcrescimo: number;
  valorUnitarioTotal: number;
  valorTotal: number;
};

const _PERIODOS = [
  { value: "INTEGRAL", label: "Período Integral" },
  { value: "PARCIAL", label: "Período Parcial" },
];

const _TIPO_CLASS: Record<TipoDieta, string> = {
  "TIPO A": "cor-tipo-a",
  "TIPO B": "cor-tipo-b",
};

const moeda = (valor: number) => `R$ ${formataMilharDecimal(valor)}`;

export const TabelaDietasCEI = forwardRef<TabelaDietasHandle, Props>(
  ({ tabelas, tipoDieta, faixasEtarias, totaisConsumo, ordem }, ref) => {
    const linhas = useMemo<LinhaDietaFaixa[]>(
      () =>
        _PERIODOS.flatMap((periodo) => {
          const tabela = tabelas.find(
            (item) =>
              item.nome.toUpperCase().includes(tipoDieta) &&
              item.periodo_escolar === periodo.value,
          );

          return faixasEtarias.map((faixa) => {
            const valorUnitario = obterValorFaixa(
              tabela,
              faixa.uuid,
              "UNITARIO",
            );
            const valorAcrescimo = obterValorFaixa(
              tabela,
              faixa.uuid,
              "ACRESCIMO",
            );
            const numeroConsumo =
              totaisConsumo?.[
                `DIETA ESPECIAL - ${tipoDieta} - ${periodo.value}`
              ]?.[faixa.__str__] ?? 0;
            const valorUnitarioTotal =
              valorUnitario * (1 + valorAcrescimo / 100);

            return {
              chave: `${faixa.uuid}-${periodo.value}`,
              periodo: periodo.label,
              faixa: faixa.__str__,
              numeroConsumo,
              valorUnitario,
              valorAcrescimo,
              valorUnitarioTotal,
              valorTotal: valorUnitarioTotal * numeroConsumo,
            };
          });
        }),
      [tabelas, tipoDieta, faixasEtarias, totaisConsumo],
    );

    const totais = useMemo(
      () => ({
        totalConsumoGeral: linhas.reduce(
          (soma, linha) => soma + linha.numeroConsumo,
          0,
        ),
        valorTotalGeral: linhas.reduce(
          (soma, linha) => soma + linha.valorTotal,
          0,
        ),
      }),
      [linhas],
    );

    useImperativeHandle(ref, () => ({ getTotais: () => totais }), [totais]);

    return (
      <div className="tabela-relatorio-responsiva">
        <table className="tabela-relatorio tabela-detalhada tabela-detalhada-dieta">
          <thead>
            <tr className={_TIPO_CLASS[tipoDieta]}>
              <th scope="col" className="col-descricao">
                DIETA ESPECIAL - {tipoDieta}
              </th>
              <th scope="col" className="col-numero">
                NÚMERO DE ATEND. {tipoDieta}
              </th>
              <th scope="col">VALOR UNITÁRIO</th>
              <th scope="col">% DE ACRÉSCIMO</th>
              <th scope="col">VALOR UNITÁRIO TOTAL</th>
              <th scope="col" className="col-valor-total">
                VALOR TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.chave}>
                <td className="col-descricao">
                  {linha.periodo} <b>- {linha.faixa}</b>
                </td>
                <td className="col-numero">
                  {formataMilhar(linha.numeroConsumo)}
                </td>
                <td>{moeda(linha.valorUnitario)}</td>
                <td>{formataPercentual(linha.valorAcrescimo)}</td>
                <td>{moeda(linha.valorUnitarioTotal)}</td>
                <td className="col-valor-total">{moeda(linha.valorTotal)}</td>
              </tr>
            ))}
            <tr className="linha-total">
              <td>TOTAL ({ordem})</td>
              <td className="col-numero">
                {formataMilhar(totais.totalConsumoGeral)}
              </td>
              <td />
              <td />
              <td />
              <td className="col-valor-total">
                {moeda(totais.valorTotalGeral)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
);
