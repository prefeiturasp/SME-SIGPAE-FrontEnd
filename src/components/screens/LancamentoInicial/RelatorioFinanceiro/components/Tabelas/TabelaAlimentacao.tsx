import {
  TabelaParametrizacao,
  ValorTabela,
  TipoAlimentacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { stringDecimalToNumber } from "src/helpers/parsers";
import { formataMilharDecimal } from "src/helpers/utilities";
import { forwardRef, useImperativeHandle } from "react";
import { TabelaAlimentacaoHandle } from "../../types";

type Props = {
  tabelas: TabelaParametrizacao[];
  tiposAlimentacao: Array<TipoAlimentacao>;
  totaisConsumo?: any;
  ordem?: string;
};

export const TabelaAlimentacao = forwardRef<TabelaAlimentacaoHandle, Props>(
  ({ tabelas, tiposAlimentacao, totaisConsumo, ordem }, ref) => {
    let totalAtendimentosGeral = 0;
    let valorTotalGeral = 0;

    useImperativeHandle(ref, () => ({
      getTotais() {
        return {
          totalAtendimentosGeral,
          valorTotalGeral,
        };
      },
    }));

    return (
      <table className="tabela-relatorio">
        <thead>
          <tr>
            <th className="col-faixa">TIPOS DE ALIMENTAÇÕES - SEM DIETAS</th>
            <th className="col-unitario">VALOR UNITÁRIO</th>
            <th className="col-reajuste">VALOR DO REAJUSTE</th>
            <th className="col-total-unitario">VALOR UNITÁRIO TOTAL</th>
            <th className="col-atendimentos">NÚMERO DE ATENDIMENTO</th>
            <th className="col-valor-total">VALOR TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {tiposAlimentacao.map((tipo) => {
            const tabela = tabelas.find(
              (t) => t.nome === "Preço das Alimentações",
            );

            const valorUnitario = stringDecimalToNumber(
              tabela?.valores.find(
                (v: ValorTabela) =>
                  (v.tipo_alimentacao?.uuid === tipo.uuid ||
                    v.nome_campo === "kit_lanche") &&
                  v.tipo_valor === "UNITARIO",
              )?.valor ?? "0",
            );

            const valorReajuste = stringDecimalToNumber(
              tabela?.valores.find(
                (v: ValorTabela) =>
                  (v.tipo_alimentacao?.uuid === tipo.uuid ||
                    v.nome_campo === "kit_lanche") &&
                  v.tipo_valor === "REAJUSTE",
              )?.valor ?? "0",
            );

            let nomeCampoAtendimento = "";
            if (tipo.nome === "Kit Lanche")
              nomeCampoAtendimento = "total_kit_lanche";
            else
              nomeCampoAtendimento = `total_${tipo.nome
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "_")
                .toLowerCase()}`;

            const numeroAtendimentos =
              totaisConsumo?.["ALIMENTAÇÃO"]?.[nomeCampoAtendimento] ?? 0;

            const totalUnitario = Number(
              (valorUnitario + valorReajuste).toFixed(2),
            );
            const valorTotal = Number(
              (totalUnitario * numeroAtendimentos).toFixed(2),
            );

            totalAtendimentosGeral += numeroAtendimentos;
            valorTotalGeral += valorTotal;

            return (
              <tr key={tipo.uuid}>
                <td className="col-tipo">
                  <b>{tipo.nome.toUpperCase()}</b>
                </td>
                <td className="col-unitario">
                  R$ {formataMilharDecimal(valorUnitario)}
                </td>
                <td className="col-reajuste">
                  R$ {formataMilharDecimal(valorReajuste)}
                </td>
                <td className="col-total-unitario">
                  R$ {formataMilharDecimal(totalUnitario)}
                </td>
                <td className="col-atendimentos">{numeroAtendimentos}</td>
                <td className="col-valor-total">
                  R$ {formataMilharDecimal(valorTotal)}
                </td>
              </tr>
            );
          })}

          <tr key={`total_${ordem}`} className="linha-total">
            <td className="col-faixa">TOTAL ({ordem})</td>
            <td />
            <td />
            <td />
            <td className="col-atendimentos">{totalAtendimentosGeral}</td>
            <td className="col-valor-total">
              R$ {formataMilharDecimal(valorTotalGeral)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);
