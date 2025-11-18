import { capitalize } from "src/helpers/utilities";
import {
  CampoValor,
  ParametrizacaoFinanceiraPayload,
  TabelaParametrizacao,
  ValorLinha,
  ValorTabela,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { stringDecimalToNumber } from "src/helpers/parsers";

const gerarValores = (valores: object) => {
  let lista_valores: object[] = [];
  const titulos = Object.keys(valores);

  Object.values(valores).forEach((valor: ValorLinha, index) => {
    const { tipo_alimentacao, faixa_etaria, ...rest } = valor;

    const tiposValores = [
      {
        campo: "valor_unitario_reajuste",
        valor: rest.valor_unitario_reajuste,
        tipo: "REAJUSTE",
      },
      { campo: "valor_unitario", valor: rest.valor_unitario, tipo: "UNITARIO" },
      {
        campo: "percentual_acrescimo",
        valor: rest.percentual_acrescimo,
        tipo: "ACRESCIMO",
      },
    ];

    const valoresFormatados = tiposValores
      .filter((e) => e.valor !== undefined)
      .map((e) => ({
        faixa_etaria,
        tipo_alimentacao,
        nome_campo: titulos[index]
          .toLowerCase()
          .replace(/\s+/g, "_")
          .normalize("NFD"),
        tipo_valor: e.tipo,
        valor: e.valor,
      }));

    lista_valores = lista_valores.concat(valoresFormatados);
  });

  return lista_valores;
};

export const formataPayload = (values: ParametrizacaoFinanceiraPayload) => {
  const tabelas = Object.entries(values.tabelas).map(([tabela, valores]) => {
    const [nome, periodo] = tabela.split(" - Período ");

    return {
      nome: nome || tabela,
      valores: gerarValores(valores as object),
      periodo_escolar: periodo ? periodo?.toUpperCase() : null,
    };
  });

  return { ...values, tabelas };
};

const calcularTotaisFaixa = (dados: Record<string, any>) => {
  Object.entries(dados).forEach(([_, valores]: [string, any]) => {
    const { valor_unitario, valor_unitario_reajuste, percentual_acrescimo } =
      valores;

    let total = 0;

    const temValorUnitario =
      valor_unitario !== null && valor_unitario !== undefined;
    const temReajuste =
      valor_unitario_reajuste !== null && valor_unitario_reajuste !== undefined;
    const temAcrescimo =
      percentual_acrescimo !== null && percentual_acrescimo !== undefined;

    if (temValorUnitario && temReajuste)
      total =
        stringDecimalToNumber(valor_unitario) +
        stringDecimalToNumber(valor_unitario_reajuste);
    else if (temValorUnitario && temAcrescimo)
      total =
        stringDecimalToNumber(valor_unitario) *
        (1 + stringDecimalToNumber(percentual_acrescimo) / 100);

    if (!isNaN(total)) valores.valor_unitario_total = total.toFixed(2);
  });
};
export const carregarValores = (tabelas: TabelaParametrizacao[]) => {
  const getCampo = (tipo: string): string => {
    const campos = {
      UNITARIO: "valor_unitario",
      REAJUSTE: "valor_unitario_reajuste",
      ACRESCIMO: "percentual_acrescimo",
    };
    return campos[tipo];
  };

  const resultado: object = {};

  tabelas.forEach((item) => {
    const chavePrincipal = item.periodo_escolar
      ? `${item.nome} - Período ${capitalize(item.periodo_escolar)}`
      : item.nome;
    resultado[chavePrincipal] ||= {};

    item.valores.forEach((valor: ValorTabela) => {
      if (valor.faixa_etaria) {
        const faixaNome = valor.faixa_etaria?.__str__;
        resultado[chavePrincipal][faixaNome] ||= {};
        resultado[chavePrincipal][faixaNome].faixa_etaria =
          valor.faixa_etaria?.uuid;
        resultado[chavePrincipal][faixaNome][getCampo(valor.tipo_valor)] =
          valor.valor;
      } else {
        const tipoNome = valor.tipo_alimentacao?.nome;
        resultado[chavePrincipal][tipoNome] ||= {};
        resultado[chavePrincipal][tipoNome].tipo_alimentacao =
          valor.tipo_alimentacao?.uuid;
        resultado[chavePrincipal][tipoNome][getCampo(valor.tipo_valor)] =
          valor.valor;
      }
    });

    calcularTotaisFaixa(resultado[chavePrincipal]);
  });

  return resultado;
};

export const formatarTotal = (value: number) =>
  String(value.toFixed(2)).replace(".", ",");

export const retornaTotal = (
  value: string,
  campo: CampoValor,
  registro: ValorLinha,
) => {
  const valorSoma = stringDecimalToNumber(
    campo === "valor_unitario"
      ? registro?.valor_unitario_reajuste
      : registro?.valor_unitario,
  );
  const valorTotal = stringDecimalToNumber(value) + valorSoma;
  return valorTotal ? formatarTotal(valorTotal) : null;
};
