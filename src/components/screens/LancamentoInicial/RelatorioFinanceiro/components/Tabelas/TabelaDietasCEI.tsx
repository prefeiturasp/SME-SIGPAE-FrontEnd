import { stringDecimalToNumber } from "src/helpers/parsers.js";
import { formataValorDecimal } from "../../../../helper.jsx";
import {
  FaixaEtaria,
  TabelaParametrizacao,
  ValorTabela,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";

type Props = {
  tabelas: TabelaParametrizacao[];
  tipoDieta: string;
  faixasEtarias: FaixaEtaria[];
  totaisConsumo?: any;
};

const _PERIODOS = [
  { value: "INTEGRAL", label: "Período Integral" },
  { value: "PARCIAL", label: "Período Parcial" },
];

export function TabelaDietasCEI({
  tabelas,
  tipoDieta,
  faixasEtarias,
  totaisConsumo,
}: Props) {
  return (
    <table className="tabela-relatorio">
      <thead>
        <tr>
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

            const totalUnitario = valorUnitario * (1 + valorAcrescimo / 100);
            const numeroConsumo =
              totaisConsumo?.[
                `DIETA ESPECIAL - ${tipoDieta} - ${periodo.value}`
              ]?.[faixa.__str__] ?? 0;
            const valorTotal = totalUnitario * numeroConsumo;

            return (
              <tr key={`${faixa.uuid}-${periodo.value}`}>
                <td className="col-faixa">
                  {periodo.label} <b>- {faixa.__str__}</b>
                </td>
                <td className="col-unitario">
                  R$ {formataValorDecimal(valorUnitario)}
                </td>
                <td className="col-reajuste">
                  % {formataValorDecimal(valorAcrescimo)}
                </td>
                <td className="col-total-unitario">
                  R$ {formataValorDecimal(totalUnitario)}
                </td>
                <td className="col-atendimentos">{numeroConsumo}</td>
                <td className="col-valor-total">
                  R$ {formataValorDecimal(valorTotal)}
                </td>
              </tr>
            );
          });
        })}
      </tbody>
    </table>
  );
}
