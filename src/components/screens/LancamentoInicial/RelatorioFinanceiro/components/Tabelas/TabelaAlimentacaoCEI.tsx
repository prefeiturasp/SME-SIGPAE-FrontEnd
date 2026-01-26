import {
  FaixaEtaria,
  TabelaParametrizacao,
  ValorTabela,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { stringDecimalToNumber } from "src/helpers/parsers";
import { formatarTotal } from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";

type Props = {
  tabelas: TabelaParametrizacao[];
  faixasEtarias: FaixaEtaria[];
  totaisConsumo?: any;
};

const _PERIODOS = [
  { value: "INTEGRAL", label: "Período Integral" },
  { value: "PARCIAL", label: "Período Parcial" },
];

export function TabelaAlimentacaoCEI({
  tabelas,
  faixasEtarias,
  totaisConsumo,
}: Props) {
  return (
    <table className="tabela-relatorio">
      <thead>
        <tr>
          <th className="col-faixa">ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETA</th>
          <th className="col-unitario">VALOR UNITÁRIO</th>
          <th className="col-reajuste">VALOR DO REAJUSTE</th>
          <th className="col-total-unitario">VALOR UNITÁRIO TOTAL</th>
          <th className="col-atendimentos">NÚMERO DE ATENDIMENTO</th>
          <th className="col-valor-total">VALOR TOTAL</th>
        </tr>
      </thead>
      <tbody>
        {_PERIODOS.map((periodo) =>
          faixasEtarias.map((faixa) => {
            const tabela = tabelas.find(
              (t) =>
                t.nome === "Preço das Alimentações" &&
                t.periodo_escolar === periodo.value,
            );

            const valorUnitario = stringDecimalToNumber(
              tabela?.valores.find(
                (v: ValorTabela) =>
                  v.faixa_etaria.uuid === faixa.uuid &&
                  v.tipo_valor === "UNITARIO",
              )?.valor ?? "0",
            );

            const valorReajuste = stringDecimalToNumber(
              tabela?.valores.find(
                (v: ValorTabela) =>
                  v.faixa_etaria.uuid === faixa.uuid &&
                  v.tipo_valor === "REAJUSTE",
              )?.valor ?? "0",
            );

            const totalUnitario = valorUnitario + valorReajuste;
            const numeroAtendimentos =
              totaisConsumo?.[periodo.value]?.[faixa.__str__] ?? 0;
            const valorTotal = totalUnitario * numeroAtendimentos;

            return (
              <tr key={`${faixa.uuid}-${periodo.value}`}>
                <td className="col-faixa">
                  {periodo.label} <b>- {faixa.__str__}</b>
                </td>
                <td className="col-unitario">
                  R$ {formatarTotal(valorUnitario)}
                </td>
                <td className="col-reajuste">
                  R$ {formatarTotal(valorReajuste)}
                </td>
                <td className="col-total-unitario">
                  R$ {formatarTotal(totalUnitario)}
                </td>
                <td className="col-atendimentos">{numeroAtendimentos}</td>
                <td className="col-valor-total">
                  R$ {formatarTotal(valorTotal)}
                </td>
              </tr>
            );
          }),
        )}
      </tbody>
    </table>
  );
}
