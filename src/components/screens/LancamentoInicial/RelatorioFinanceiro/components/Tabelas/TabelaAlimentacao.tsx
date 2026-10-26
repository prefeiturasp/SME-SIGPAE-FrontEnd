import {
  TabelaParametrizacao,
  TipoAlimentacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { formataMilhar, formataMilharDecimal } from "src/helpers/utilities";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { TabelaAlimentacaoHandle } from "../../types";
import {
  chaveCampoConsumo,
  chaveLinhaTipoAlimentacao,
  obterValorParametrizado,
  prioridadeAlimentacao,
} from "../../helpers";
import { normalizar } from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";

type Props = {
  tabelas: TabelaParametrizacao[];
  tiposAlimentacao: Array<TipoAlimentacao>;
  totaisConsumo?: any;
  ordem?: string;
  unidade?: string;
  possuiReajuste?: boolean;
};

type LinhaAlimentacao = {
  chave: string;
  nomeExibicao: string;
  numeroAtendimentos: number;
  valorUnitario: number;
  valorTotalUnitario: number;
  valorReajuste: number;
  valorTotalReajuste: number;
  valorUnitarioReajustado: number;
  valorTotal: number;
};

const obterNomeTabela = (unidade?: string) => {
  if (unidade?.includes("EMEBS")) return `Preço das Alimentações - ${unidade}`;
  if (unidade === "CEMEI")
    return "Preço das Alimentações - Turma Infantil - EMEI";
  return "Preço das Alimentações";
};

const moeda = (valor: number) => `R$ ${formataMilharDecimal(valor)}`;

export const TabelaAlimentacao = forwardRef<TabelaAlimentacaoHandle, Props>(
  (
    {
      tabelas,
      tiposAlimentacao,
      totaisConsumo,
      ordem,
      unidade,
      possuiReajuste,
    },
    ref,
  ) => {
    const exibeReajuste = possuiReajuste !== false;

    const linhas = useMemo<LinhaAlimentacao[]>(() => {
      const ehCieja = unidade === "CIEJA";
      const tabela = tabelas.find((t) => t.nome === obterNomeTabela(unidade));

      return [...tiposAlimentacao]
        .sort(
          (a, b) =>
            prioridadeAlimentacao(a.nome) - prioridadeAlimentacao(b.nome),
        )
        .map((tipo) => {
          const valorUnitario = obterValorParametrizado(
            tabela,
            tipo,
            "UNITARIO",
          );
          const valorReajuste = obterValorParametrizado(
            tabela,
            tipo,
            "REAJUSTE",
          );
          const numeroAtendimentos =
            totaisConsumo?.["ALIMENTAÇÃO"]?.[
              `total_${chaveCampoConsumo(tipo.nome)}`
            ] ?? 0;
          const valorTotalUnitario = valorUnitario * numeroAtendimentos;
          const valorUnitarioReajustado = valorUnitario + valorReajuste;

          return {
            chave: chaveLinhaTipoAlimentacao(tipo),
            nomeExibicao:
              ehCieja && normalizar(tipo.nome) === "refeicao"
                ? "Refeição CIEJA e CMCT"
                : tipo.nome,
            numeroAtendimentos,
            valorUnitario,
            valorTotalUnitario,
            valorReajuste,
            valorTotalReajuste: valorReajuste * numeroAtendimentos,
            valorUnitarioReajustado,
            valorTotal: exibeReajuste
              ? valorUnitarioReajustado * numeroAtendimentos
              : valorTotalUnitario,
          };
        });
    }, [tabelas, tiposAlimentacao, totaisConsumo, unidade, exibeReajuste]);

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
        <table
          className={`tabela-relatorio tabela-detalhada tabela-detalhada-alimentacao${
            exibeReajuste ? "" : " sem-reajuste"
          }`}
        >
          <thead>
            <tr>
              <th scope="col" className="col-descricao">
                TIPOS DE ALIMENTAÇÕES - SEM DIETAS
              </th>
              <th scope="col" className="col-numero">
                NÚMERO DE ATEND.
              </th>
              <th scope="col">VALOR UNITÁRIO</th>
              <th scope="col">VALOR TOTAL UNITÁRIO</th>
              {exibeReajuste && (
                <>
                  <th scope="col">VALOR DO REAJUSTE</th>
                  <th scope="col">VALOR TOTAL DO REAJUSTE</th>
                  <th scope="col">VALOR UNITÁRIO REAJUSTADO</th>
                </>
              )}
              <th scope="col" className="col-valor-total">
                VALOR TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.chave}>
                <td className="col-descricao">
                  <b>{linha.nomeExibicao.toUpperCase()}</b>
                </td>
                <td className="col-numero">
                  {formataMilhar(linha.numeroAtendimentos)}
                </td>
                <td>{moeda(linha.valorUnitario)}</td>
                <td>{moeda(linha.valorTotalUnitario)}</td>
                {exibeReajuste && (
                  <>
                    <td>{moeda(linha.valorReajuste)}</td>
                    <td>{moeda(linha.valorTotalReajuste)}</td>
                    <td>{moeda(linha.valorUnitarioReajustado)}</td>
                  </>
                )}
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
              {exibeReajuste && (
                <>
                  <td />
                  <td />
                  <td />
                </>
              )}
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
