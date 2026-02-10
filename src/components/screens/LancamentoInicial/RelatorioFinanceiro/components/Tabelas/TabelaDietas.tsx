import {
  TabelaParametrizacao,
  TipoAlimentacao,
  ValorTabela,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { formataMilharDecimal } from "src/helpers/utilities";
import { stringDecimalToNumber } from "src/helpers/parsers";

type Props = {
  tabelas: TabelaParametrizacao[];
  tipoDieta: string;
  tiposAlimentacao: Array<TipoAlimentacao>;
  totaisConsumo?: any;
  ordem?: string;
};

const _TIPO_CLASS = {
  "TIPO A": "cor-tipo-a",
  "TIPO B": "cor-tipo-b",
};

const ALIMENTACOES_TIPO_A = ["Refeição", "Lanche", "Lanche 4h"];
const ALIMENTACOES_TIPO_B = ["Lanche", "Lanche 4h"];

export function TabelaDietas({
  tabelas,
  tipoDieta,
  tiposAlimentacao,
  totaisConsumo,
  ordem,
}: Props) {
  let totalConsumoGeral = 0;
  let valorTotalGeral = 0;

  const ListaDeAlimentacoes =
    tipoDieta === "TIPO A" ? ALIMENTACOES_TIPO_A : ALIMENTACOES_TIPO_B;

  const alimentacoes = tiposAlimentacao
    .filter((t) => ListaDeAlimentacoes.includes(t.nome))
    .flatMap((ta) => {
      return {
        ...ta,
        grupo: ta.nome === "Refeição" ? "Dieta Enteral" : null,
      };
    })
    .reverse();

  return (
    <table className="tabela-relatorio">
      <thead>
        <tr className={_TIPO_CLASS[tipoDieta] ?? ""}>
          <th className="col-faixa">
            DIETA ESPECIAL -{" "}
            {tipoDieta !== "TIPO A"
              ? tipoDieta
              : "TIPO A, A ENTERAL E RESTRIÇÃO DE AMINOÁCIDOS"}
          </th>
          <th className="col-unitario">VALOR UNITÁRIO</th>
          <th className="col-reajuste">% de ACRÉSCIMO</th>
          <th className="col-total-unitario">VALOR UNITÁRIO TOTAL</th>
          <th className="col-atendimentos">CONSUMO {tipoDieta}</th>
          <th className="col-valor-total">VALOR TOTAL</th>
        </tr>
      </thead>

      <tbody>
        {alimentacoes.map((tipo) => {
          const tabela = tabelas.find((tabela) =>
            tabela.nome.toUpperCase().includes(tipoDieta),
          );

          const valorUnitario = stringDecimalToNumber(
            tabela?.valores.find(
              (v: ValorTabela) =>
                v.tipo_alimentacao.uuid === tipo.uuid &&
                v.tipo_valor === "UNITARIO",
            )?.valor ?? "0",
          );

          const valorAcrescimo = stringDecimalToNumber(
            tabela?.valores.find(
              (v: ValorTabela) =>
                v.tipo_alimentacao.uuid === tipo.uuid &&
                v.tipo_valor === "ACRESCIMO",
            )?.valor ?? "0",
          );

          const totalUnitario = valorUnitario * (1 + valorAcrescimo / 100);
          const numeroConsumo =
            totaisConsumo?.[`DIETA ESPECIAL - ${tipoDieta}`]?.[
              tipo.nome
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "_")
                .toLowerCase()
            ] ?? 0;
          const valorTotal = totalUnitario * numeroConsumo;

          totalConsumoGeral += numeroConsumo;
          valorTotalGeral += valorTotal;

          return (
            <tr
              key={`${tipoDieta.replace(" ", "_").toLocaleLowerCase()}_${tipo.uuid}`}
            >
              <td className="col-tipo">
                <b>{tipo.nome.toUpperCase()}</b>{" "}
                {tipo.grupo && `- ${tipo.grupo}`}
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
}
