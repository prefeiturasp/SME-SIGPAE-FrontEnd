import {
  TipoAlimentacao,
  ValorTabela,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
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
