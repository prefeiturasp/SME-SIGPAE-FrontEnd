import { useMemo, forwardRef, useImperativeHandle } from "react";
import {
  FaixaEtaria,
  TabelaParametrizacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { formataMilhar, formataMilharDecimal } from "src/helpers/utilities";
import { TabelaAlimentacaoHandle } from "../../types";
import { obterValorFaixa } from "../../helpers";

type Props = {
  tabelas: TabelaParametrizacao[];
  faixasEtarias: FaixaEtaria[];
  totaisConsumo?: any;
  ordem?: string;
};

type PeriodoFaixa = {
  value: string;
  label: string;
};

type LinhaFaixa = {
  chave: string;
  periodo: string;
  faixa: string;
  numeroAtendimentos: number;
  valorUnitario: number;
  valorTotalUnitario: number;
  valorReajuste: number;
  valorTotalReajuste: number;
  valorUnitarioReajustado: number;
  valorTotal: number;
};

const _PERIODOS: PeriodoFaixa[] = [
  { value: "INTEGRAL", label: "Período Integral" },
  { value: "PARCIAL", label: "Período Parcial" },
];

const moeda = (valor: number) => `R$ ${formataMilharDecimal(valor)}`;

export const TabelaAlimentacaoCEI = forwardRef<TabelaAlimentacaoHandle, Props>(
  ({ tabelas, faixasEtarias, totaisConsumo, ordem }, ref) => {
    const linhas = useMemo<LinhaFaixa[]>(
      () =>
        _PERIODOS.flatMap((periodo) => {
          const tabela = tabelas.find(
            (item) =>
              item.nome === "Preço das Alimentações" &&
              item.periodo_escolar === periodo.value,
          );

          return faixasEtarias.map((faixa) => {
            const valorUnitario = obterValorFaixa(
              tabela,
              faixa.uuid,
              "UNITARIO",
            );
            const valorReajuste = obterValorFaixa(
              tabela,
              faixa.uuid,
              "REAJUSTE",
            );
            const numeroAtendimentos =
              totaisConsumo?.[`ALIMENTAÇÃO - ${periodo.value}`]?.[
                faixa.__str__
              ] ?? 0;
            const valorUnitarioReajustado = valorUnitario + valorReajuste;

            return {
              chave: `${faixa.uuid}-${periodo.value}`,
              periodo: periodo.label,
              faixa: faixa.__str__,
              numeroAtendimentos,
              valorUnitario,
              valorTotalUnitario: valorUnitario * numeroAtendimentos,
              valorReajuste,
              valorTotalReajuste: valorReajuste * numeroAtendimentos,
              valorUnitarioReajustado,
              valorTotal: valorUnitarioReajustado * numeroAtendimentos,
            };
          });
        }),
      [tabelas, faixasEtarias, totaisConsumo],
    );

    const totais = useMemo(
      () => ({
        totalAtendimentosGeral: linhas.reduce(
          (soma, linha) => soma + linha.numeroAtendimentos,
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
        <table className="tabela-relatorio tabela-detalhada tabela-detalhada-alimentacao">
          <thead>
            <tr>
              <th scope="col" className="col-descricao">
                ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETAS
              </th>
              <th scope="col" className="col-numero">
                NÚMERO DE ATEND.
              </th>
              <th scope="col">VALOR UNITÁRIO</th>
              <th scope="col">VALOR TOTAL UNITÁRIO</th>
              <th scope="col">VALOR DO REAJUSTE</th>
              <th scope="col">VALOR TOTAL DO REAJUSTE</th>
              <th scope="col">VALOR UNITÁRIO REAJUSTADO</th>
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
                  {formataMilhar(linha.numeroAtendimentos)}
                </td>
                <td>{moeda(linha.valorUnitario)}</td>
                <td>{moeda(linha.valorTotalUnitario)}</td>
                <td>{moeda(linha.valorReajuste)}</td>
                <td>{moeda(linha.valorTotalReajuste)}</td>
                <td>{moeda(linha.valorUnitarioReajustado)}</td>
                <td className="col-valor-total">{moeda(linha.valorTotal)}</td>
              </tr>
            ))}
            <tr className="linha-total">
              <td>TOTAL ({ordem})</td>
              <td className="col-numero">
                {formataMilhar(totais.totalAtendimentosGeral)}
              </td>
              <td />
              <td />
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
