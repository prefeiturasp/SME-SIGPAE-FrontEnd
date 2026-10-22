import { useMemo, forwardRef, useImperativeHandle } from "react";
import {
  TabelaParametrizacao,
  TipoAlimentacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { formataMilhar, formataMilharDecimal } from "src/helpers/utilities";
import { TabelaDietasHandle } from "../../types";
import {
  chaveCampoConsumo,
  chaveLinhaTipoAlimentacao,
  formataPercentual,
  listaAlimentacoes,
  obterValorParametrizado,
  prioridadeAlimentacao,
} from "../../helpers";
import { normalizar } from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";

type TipoDieta = "TIPO A" | "TIPO B";

type Props = {
  tabelas: TabelaParametrizacao[];
  tipoDieta: TipoDieta;
  tiposAlimentacao: Array<TipoAlimentacao>;
  totaisConsumo?: any;
  ordem?: string;
  exibeNoturno?: boolean;
  unidade?: string;
};

type LinhaDieta = {
  chave: string;
  nomeExibicao: string;
  grupo: string | null;
  numeroConsumo: number;
  valorUnitario: number;
  valorAcrescimo: number;
  valorUnitarioTotal: number;
  valorTotal: number;
};

const _TIPO_CLASS: Record<TipoDieta, string> = {
  "TIPO A": "cor-tipo-a",
  "TIPO B": "cor-tipo-b",
};

const obterTabelaDieta = (
  tabelas: TabelaParametrizacao[],
  tipoDieta: TipoDieta,
  ehCemei: boolean,
) => {
  if (ehCemei) {
    const tipo = tipoDieta === "TIPO A" ? "Tipo A e Tipo A Enteral" : "Tipo B";
    return tabelas.find(
      (tabela) => tabela.nome === `Dietas ${tipo} - Turma Infantil - EMEI`,
    );
  }

  return tabelas.find((tabela) =>
    tabela.nome.toUpperCase().includes(tipoDieta),
  );
};

const moeda = (valor: number) => `R$ ${formataMilharDecimal(valor)}`;

export const TabelaDietas = forwardRef<TabelaDietasHandle, Props>(
  (
    {
      tabelas,
      tipoDieta,
      tiposAlimentacao,
      totaisConsumo,
      ordem,
      exibeNoturno,
      unidade,
    },
    ref,
  ) => {
    const linhas = useMemo<LinhaDieta[]>(() => {
      const ehCieja = unidade === "CIEJA";
      const tabela = obterTabelaDieta(tabelas, tipoDieta, unidade === "CEMEI");
      const permitidas = listaAlimentacoes(tipoDieta, ehCieja);

      return tiposAlimentacao
        .filter((tipo) => {
          const nome = normalizar(tipo.nome);
          return (
            permitidas.includes(nome) ||
            (exibeNoturno && nome.startsWith("refeicao"))
          );
        })
        .sort(
          (a, b) =>
            prioridadeAlimentacao(a.nome) - prioridadeAlimentacao(b.nome),
        )
        .map((tipo) => {
          const nomeNormalizado = normalizar(tipo.nome);
          const valorUnitario = obterValorParametrizado(
            tabela,
            tipo,
            "UNITARIO",
          );
          const valorAcrescimo = obterValorParametrizado(
            tabela,
            tipo,
            "ACRESCIMO",
          );
          const numeroConsumo =
            totaisConsumo?.[`DIETA ESPECIAL - ${tipoDieta}`]?.[
              chaveCampoConsumo(tipo.nome)
            ] ?? 0;
          const valorUnitarioTotal = valorUnitario * (1 + valorAcrescimo / 100);

          return {
            chave: chaveLinhaTipoAlimentacao(tipo),
            nomeExibicao:
              ehCieja && nomeNormalizado === "refeicao"
                ? "Refeição CIEJA e CMCT"
                : tipo.nome,
            grupo: nomeNormalizado.includes("refeicao")
              ? "Dieta Enteral"
              : null,
            numeroConsumo,
            valorUnitario,
            valorAcrescimo,
            valorUnitarioTotal,
            valorTotal: valorUnitarioTotal * numeroConsumo,
          };
        });
    }, [
      tabelas,
      tipoDieta,
      tiposAlimentacao,
      totaisConsumo,
      exibeNoturno,
      unidade,
    ]);

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
                DIETA ESPECIAL -{" "}
                {tipoDieta === "TIPO A"
                  ? "TIPO A, A ENTERAL E RESTRIÇÃO DE AMINOÁCIDOS"
                  : tipoDieta}
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
              <tr key={`${tipoDieta}-${linha.chave}`}>
                <td className="col-descricao">
                  <b>{linha.nomeExibicao.toUpperCase()}</b>{" "}
                  {linha.grupo && `- ${linha.grupo}`}
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
