import { ParametrizacaoFinanceiraPayload } from "src/services/medicaoInicial/parametrizacao_financeira.interface";

const gerarValores = (valores: object, tabela: string) => {
  function propName(obj: object, value: string, titulo: string) {
    return `tabelas[${tabela}].${titulo}.${Object.keys(obj).find((k) => obj[k] === value)}`;
  }

  let lista_valores = [];
  const titulos = Object.keys(valores);
  Object.values(valores).forEach((valor: any, index) => {
    const { tipo_alimentacao, faixa_etaria, ...rest } = valor;
    lista_valores = lista_valores.concat(
      [
        {
          valor: rest.valor_unitario_reajuste,
          tipo: "REAJUSTE",
          nome: propName(rest, rest.valor_unitario_reajuste, titulos[index]),
        },
        {
          valor: rest.valor_unitario,
          tipo: "UNITARIO",
          nome: propName(rest, rest.valor_unitario, titulos[index]),
        },
        {
          valor: rest.percentual_acrescimo,
          tipo: "ACRESCIMO",
          nome: propName(rest, rest.percentual_acrescimo, titulos[index]),
        },
      ]
        .filter((e) => e.valor !== undefined)
        .map((e) => {
          return {
            faixa_etaria,
            tipo_alimentacao,
            nome_campo: e.nome,
            tipo_valor: e.tipo,
            valor: e.valor,
          };
        }),
    );
  });
  return lista_valores;
};

export const formataPayload = (values: ParametrizacaoFinanceiraPayload) => {
  let tabelas = [];
  Object.entries(values.tabelas).forEach(([tabela, valores]) => {
    const [nome, periodo] = tabela.split(" - Período ");
    tabelas.push({
      nome: nome,
      valores: gerarValores(valores, tabela),
      periodo_escolar: periodo.toUpperCase(),
    });
  });

  const payload = {
    ...values,
    tabelas,
  };
  return payload;
};
