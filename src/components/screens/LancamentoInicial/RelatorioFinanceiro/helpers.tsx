import {
  TabelaParametrizacao,
  TipoAlimentacao,
  ValorTabela,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { stringDecimalToNumber } from "src/helpers/parsers";
import { normalizar } from "../ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";

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

export const getUuid = (obj: any) =>
  typeof obj === "string" ? obj : obj?.uuid;

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

export const chaveCampoConsumo = (nome: string) =>
  normalizar(nome).replaceAll(/\s+/g, "_");

export const formataPercentual = (valor?: number | null) =>
  `${Number(valor ?? 0).toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  })}%`;

export const chaveLinhaTipoAlimentacao = (tipo: TipoAlimentacao) =>
  `${tipo.uuid}-${tipo.tipo_refeicao ?? "padrao"}`;
