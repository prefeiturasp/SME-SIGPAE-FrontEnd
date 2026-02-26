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

    if (tipo_alimentacao || faixa_etaria) {
      const tiposValores = [
        {
          campo: "valor_unitario_reajuste",
          valor: rest.valor_unitario_reajuste,
          tipo: "REAJUSTE",
        },
        {
          campo: "valor_unitario",
          valor: rest.valor_unitario,
          tipo: "UNITARIO",
        },
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
    }
  });

  return lista_valores;
};

export const formataPayload = (values: ParametrizacaoFinanceiraPayload) => {
  const tabelas = Object.entries(values.tabelas).map(([tabela, valores]) => {
    let tabelaLimpa = tabela.replace(" - CEI ", " ");
    const [nome, periodo] = tabelaLimpa.split(" - Período ");
    return {
      nome: nome.trim(),
      valores: gerarValores(valores as object),
      periodo_escolar: periodo ? periodo.toUpperCase() : null,
    };
  });

  return { ...values, tabelas };
};

export const formatarTotal = (value: number) =>
  String(value.toFixed(2)).replace(".", ",");

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

    if (!isNaN(total)) valores.valor_unitario_total = formatarTotal(total);
  });
};

export const carregarValores = (
  tabelas: TabelaParametrizacao[],
  grupoSelecionado: string,
  grupoPendencia?: string,
) => {
  const getCampo = (tipo: string): string => {
    const campos = {
      UNITARIO: "valor_unitario",
      REAJUSTE: "valor_unitario_reajuste",
      ACRESCIMO: "percentual_acrescimo",
    };
    return campos[tipo];
  };

  const resultado: object = {};
  const ehGrupo2 = grupoSelecionado.toLowerCase().includes("grupo 2");
  const ehGrupo4 = grupoSelecionado.toLowerCase().includes("grupo 4");
  const ehGrupo5 = grupoSelecionado.toLowerCase().includes("grupo 5");
  tabelas.forEach((item) => {
    let chavePrincipal: string;
    if (ehGrupo2 && item.periodo_escolar) {
      chavePrincipal = `${item.nome} - CEI - Período ${capitalize(item.periodo_escolar)}`;
    } else if (item.periodo_escolar) {
      chavePrincipal = `${item.nome} - Período ${capitalize(item.periodo_escolar)}`;
    } else if (ehGrupo2 && grupoPendencia) {
      chavePrincipal = `${item.nome.replace("/Restrição de Aminoácidos", "")} - Turma Infantil - EMEI`;
    } else if (ehGrupo5 && grupoPendencia) {
      if (grupoPendencia === "grupo 3")
        chavePrincipal = `${item.nome} - EMEBS Fundamental`;
      else if (grupoPendencia === "grupo 4")
        chavePrincipal = `${item.nome} - EMEBS Infantil`;
    } else {
      chavePrincipal = item.nome;
    }
    resultado[chavePrincipal] ||= {};
    item.valores.forEach((valor: ValorTabela) => {
      if (valor.faixa_etaria) {
        const faixaNome = valor.faixa_etaria?.__str__;
        resultado[chavePrincipal][faixaNome] ||= {};
        resultado[chavePrincipal][faixaNome].faixa_etaria =
          valor.faixa_etaria?.uuid || valor.faixa_etaria;
        resultado[chavePrincipal][faixaNome][getCampo(valor.tipo_valor)] =
          valor.valor;
      } else if (valor.tipo_alimentacao) {
        let tipoNome = valor.tipo_alimentacao?.nome;
        if (ehGrupo4) {
          const nome = valor.nome_campo
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

          const ehEmef = /(^|[_,-])emefm?([_,]|$)/.test(nome);
          const ehEnteral = nome.includes("dieta_enteral");
          const ehEja = nome.includes("eja");

          if (ehEmef) {
            tipoNome = ehEnteral
              ? "Refeição - Dieta Enteral - CEU EMEF, CEU GESTÃO, EMEF, EMEFM"
              : "Refeição - CEU EMEF, CEU GESTÃO, EMEF, EMEFM";
          } else if (ehEja) {
            tipoNome = ehEnteral
              ? "Refeição - Dieta Enteral - EJA"
              : "Refeição - EJA";
          }
        }
        resultado[chavePrincipal][tipoNome] ||= {};
        resultado[chavePrincipal][tipoNome].tipo_alimentacao =
          valor.tipo_alimentacao?.uuid || valor.tipo_alimentacao;
        resultado[chavePrincipal][tipoNome][getCampo(valor.tipo_valor)] =
          valor.valor;
      } else if (valor.nome_campo === "kit_lanche") {
        resultado[chavePrincipal]["Kit Lanche"] ||= {};
        resultado[chavePrincipal]["Kit Lanche"].tipo_alimentacao = "Kit Lanche";
        resultado[chavePrincipal]["Kit Lanche"][getCampo(valor.tipo_valor)] =
          valor.valor;
      }
    });

    calcularTotaisFaixa(resultado[chavePrincipal]);
  });
  return resultado;
};

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

export const normalizar = (texto = "") =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const parseDate = (str: string) => {
  if (!str) return null;
  const [dia, mes, ano] = str.split("/").map(Number);
  return new Date(ano, mes - 1, dia);
};

export const limparTabelas = (tabelas: Record<string, any>) => {
  const novasTabelas: Record<string, any> = {};

  for (const categoria in tabelas) {
    novasTabelas[categoria] = {};

    for (const item in tabelas[categoria]) {
      const linha = tabelas[categoria][item];

      novasTabelas[categoria][item] = Object.keys(linha).reduce(
        (acc, key) => {
          if (key === "tipo_alimentacao" || key === "faixa_etaria")
            acc[key] = linha[key];
          else acc[key] = "";
          return acc;
        },
        {} as Record<string, any>,
      );
    }
  }

  return novasTabelas;
};
