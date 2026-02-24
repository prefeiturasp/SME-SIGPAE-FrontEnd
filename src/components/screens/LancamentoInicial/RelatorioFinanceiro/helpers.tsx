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

  return 99;
};
