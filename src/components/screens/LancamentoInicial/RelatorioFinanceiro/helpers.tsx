import {
  DescontoFinanceiro,
  RelatorioFinanceiroConsolidado,
} from "src/interfaces/relatorio_financeiro.interface";
import { ClausulaInterface } from "src/interfaces/clausulas_para_descontos.interface";
import {
  FaixaEtaria,
  TabelaParametrizacao,
  TipoAlimentacao,
  ValorTabela,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { stringDecimalToNumber } from "src/helpers/parsers";
import { ResumoDescontos, TipoGrupoFlags } from "./types";
import { capitalize } from "src/helpers/utilities";
import { normalizar } from "../ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";
import {
  getFlagsGrupo,
  getValorUnitario,
  getValoresDescontos,
} from "./components/ModalAplicarDesconto/helpers";

type MontarResumoDescontosParams = {
  descontos?: DescontoFinanceiro[];
  relatorioConsolidado?: RelatorioFinanceiroConsolidado;
  faixasEtarias: FaixaEtaria[];
  tiposAlimentacao: TipoAlimentacao[];
};

const SEM_SEGMENTO = "N/A";
const PERIODO_REFEICAO_EJA = "NOITE";
const ROTULO_REFEICAO_EJA = "REFEIÇÃO - EJA";
const ROTULO_KIT_LANCHE = "KIT LANCHE";

const TIPO_LANCAMENTO_DISPLAY: Record<string, string> = {
  ALIMENTACOES: "ALIMENTAÇÃO",
  DIETAS_TIPO_A: "DIETA ESPECIAL TIPO A",
  DIETAS_TIPO_B: "DIETA ESPECIAL TIPO B",
};

export const listaAlimentacoes = (tipoDieta: string, cieja: boolean) => {
  if (tipoDieta === "TIPO A") {
    return cieja
      ? ["refeicao", "lanche 4h"]
      : ["refeicao", "lanche", "lanche 4h"];
  }

  return cieja ? ["lanche 4h"] : ["lanche", "lanche 4h"];
};

export const prioridadeAlimentacao = (nome: string) => {
  const n = normalizar(nome);

  if (n === "refeicao") return 0;
  if (n.includes("refeicao cieja")) return 1;
  if (n.includes("refeicao eja")) return 2;
  if (n === "lanche") return 3;

  return 99;
};

export const buscarCampoEMEF = (
  valor: ValorTabela,
  tipo: TipoAlimentacao,
  tipo_valor: string,
) => {
  if (tipo.tipo_refeicao) {
    return (
      normalizar(valor.nome_campo).includes(tipo.tipo_refeicao) &&
      valor.tipo_valor === tipo_valor
    );
  }

  return (
    (valor.tipo_alimentacao?.uuid === tipo.uuid ||
      valor.nome_campo === "kit_lanche") &&
    valor.tipo_valor === tipo_valor
  );
};

export const obterValorParametrizado = (
  tabela: TabelaParametrizacao | undefined,
  tipo: TipoAlimentacao,
  tipoValor: string,
) =>
  stringDecimalToNumber(
    tabela?.valores.find((valor: ValorTabela) =>
      buscarCampoEMEF(valor, tipo, tipoValor),
    )?.valor ?? "0",
  );

export const obterValorFaixa = (
  tabela: TabelaParametrizacao | undefined,
  faixaUuid: string,
  tipoValor: string,
) =>
  stringDecimalToNumber(
    tabela?.valores.find(
      (valor) =>
        valor.faixa_etaria?.uuid === faixaUuid &&
        valor.tipo_valor === tipoValor,
    )?.valor ?? "0",
  ) ?? 0;

export const chaveCampoConsumo = (nome: string) =>
  normalizar(nome).replaceAll(/\s+/g, "_");

export const formataPercentual = (valor?: number | null) =>
  `${Number(valor ?? 0).toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  })}%`;

export const chaveLinhaTipoAlimentacao = (tipo: TipoAlimentacao) =>
  `${tipo.uuid}-${tipo.tipo_refeicao ?? "padrao"}`;

export const paraCentesimos = (valor: number): number => {
  const centesimos = Math.round(Number(Math.abs(valor * 100).toPrecision(15)));
  return valor < 0 ? -centesimos : centesimos;
};

const calcularTotalLinha = (
  quantidade: number,
  valorUnitario: number,
  porcentagem: number,
): number => {
  const base =
    quantidade * paraCentesimos(valorUnitario) * paraCentesimos(porcentagem);
  return Math.floor((base + 5000) / 10000) / 100;
};

const compararTexto = (a: string, b: string) => Number(a > b) - Number(a < b);

const tituloColunaFaixaOuAlimentacao = ({
  ehCei,
  ehCemei,
}: TipoGrupoFlags): string => {
  if (ehCei) return "FAIXA ETÁRIA";
  if (ehCemei) return "FAIXA ETÁRIA OU ALIMENTAÇÃO";
  return "ALIMENTAÇÃO";
};

const nomeOuTexto = (valor: string | FaixaEtaria | TipoAlimentacao) => {
  if (typeof valor === "string") return valor;
  return "__str__" in valor ? valor.__str__ : valor.nome;
};

const rotuloDesconto = (
  desconto: DescontoFinanceiro,
  ehCieja: boolean,
): string => {
  const periodo = desconto.periodo_escolar ?? "";

  if (desconto.faixa_etaria) {
    return `${capitalize(periodo)} - ${nomeOuTexto(desconto.faixa_etaria)}`;
  }
  if (!desconto.tipo_alimentacao) return ROTULO_KIT_LANCHE;
  if (periodo === PERIODO_REFEICAO_EJA) return ROTULO_REFEICAO_EJA;

  const nome = nomeOuTexto(desconto.tipo_alimentacao).toUpperCase();
  return ehCieja && normalizar(nome) === "refeicao"
    ? `${nome} CIEJA E CMCT`
    : nome;
};

const tipoLancamentoDesconto = (desconto: DescontoFinanceiro): string => {
  const tipoLancamento =
    TIPO_LANCAMENTO_DISPLAY[desconto.tipo_lancamento] ??
    desconto.tipo_lancamento;
  const segmento = [
    desconto.cei_ou_emei,
    desconto.infantil_ou_fundamental,
  ].find((valor) => valor && valor !== SEM_SEGMENTO);

  return segmento ? `${tipoLancamento} - ${segmento}` : tipoLancamento;
};

const clausulaDesconto = ({
  numero_clausula,
  item_clausula,
  porcentagem_desconto,
}: ClausulaInterface): string =>
  `${numero_clausula}. ${item_clausula} - (${formataPercentual(
    Number(porcentagem_desconto),
  )})`;

export const montarResumoDescontos = ({
  descontos,
  relatorioConsolidado,
  faixasEtarias,
  tiposAlimentacao,
}: MontarResumoDescontosParams): ResumoDescontos => {
  const grupo = getFlagsGrupo(
    relatorioConsolidado?.grupo_unidade_escolar?.nome,
  );
  const tituloFaixaOuAlimentacao = tituloColunaFaixaOuAlimentacao(grupo);
  const aguardandoFaixas =
    (grupo.ehCei || grupo.ehCemei) && !faixasEtarias?.length;

  if (!descontos?.length || !relatorioConsolidado?.tabelas || aguardandoFaixas)
    return { tituloFaixaOuAlimentacao, linhas: [], total: 0 };

  const linhas = descontos.map((desconto, index) => {
    const clausula = desconto.clausula_desconto as ClausulaInterface;
    const quantidade = Number(desconto.quantidade);
    const valorUnitario = getValorUnitario({
      desconto: getValoresDescontos(desconto, grupo),
      grupo,
      faixasEtarias,
      tiposAlimentacao,
      tabelas: relatorioConsolidado.tabelas,
    });

    return {
      chave: desconto.uuid ?? String(index),
      unidades: (desconto.unidades_educacionais ?? [])
        .map((unidade) => unidade.nome)
        .sort(compararTexto),
      tipoLancamento: tipoLancamentoDesconto(desconto),
      faixaOuAlimentacao: rotuloDesconto(desconto, grupo.ehCieja),
      clausula: clausulaDesconto(clausula),
      quantidade,
      valorUnitario,
      total: calcularTotalLinha(
        quantidade,
        valorUnitario,
        Number(clausula.porcentagem_desconto),
      ),
    };
  });

  const totalCentesimos = linhas.reduce(
    (soma, linha) => soma + paraCentesimos(linha.total),
    0,
  );

  return { tituloFaixaOuAlimentacao, linhas, total: totalCentesimos / 100 };
};

export const calcularFaturamentoFinal = (
  valorFaturamento: number,
  totalDescontos: number,
): number =>
  (paraCentesimos(valorFaturamento) - paraCentesimos(totalDescontos)) / 100;

export const tituloFaturamentoFinal = (tituloConsolidado: string): string => {
  const soma = tituloConsolidado.slice(
    tituloConsolidado.indexOf("(") + 1,
    tituloConsolidado.lastIndexOf(")"),
  );
  return `VALOR DO FATURAMENTO FINAL (${soma} - D):`;
};
