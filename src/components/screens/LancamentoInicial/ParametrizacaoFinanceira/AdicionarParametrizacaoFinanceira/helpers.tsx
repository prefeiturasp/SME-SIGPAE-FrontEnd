import { capitalize } from "src/helpers/utilities";
import {
  ParametrizacaoFinanceiraPayload,
  TabelaParametrizacao,
  ValorTabela,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";

type ValorLinha = {
  faixa_etaria?: string;
  tipo_alimentacao?: string;
  valor_unitario_reajuste: string;
  valor_unitario: string;
  percentual_acrescimo: string;
};

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
    const periodo_escolar = periodo?.toUpperCase();

    return {
      nome,
      valores: gerarValores(valores as object),
      periodo_escolar,
    };
  });

  return { ...values, tabelas };
};

const calcularTotaisFaixa = (dados: Record<string, any>) => {
  Object.entries(dados).forEach(([_, valores]: [string, any]) => {
    const { valor_unitario, valor_unitario_reajuste, percentual_acrescimo } =
      valores;

    let total = 0;

    if (valor_unitario && valor_unitario_reajuste)
      total = valor_unitario + valor_unitario_reajuste;
    else if (valor_unitario && percentual_acrescimo)
      total = valor_unitario * (1 + percentual_acrescimo / 100);
    else if (valor_unitario) total = valor_unitario;

    if (total) valores.valor_unitario_total = parseFloat(total.toFixed(2));
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
    const chavePrincipal = `${item.nome} - Período ${capitalize(item.periodo_escolar)}`;
    resultado[chavePrincipal] ||= {};

    item.valores.forEach((valor: ValorTabela) => {
      const faixaNome = valor.faixa_etaria?.__str__;
      const faixaUuid = valor.faixa_etaria?.uuid;

      resultado[chavePrincipal][faixaNome] ||= {};
      if (faixaUuid)
        resultado[chavePrincipal][faixaNome].faixa_etaria = faixaUuid;

      resultado[chavePrincipal][faixaNome][getCampo(valor.tipo_valor)] = Number(
        valor.valor,
      );
    });

    calcularTotaisFaixa(resultado[chavePrincipal]);
  });

  return resultado;
};
