import {
  DescontoFinanceiro,
  RelatorioFinanceiroConsolidado,
} from "src/interfaces/relatorio_financeiro.interface";
import { normalizar } from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira/helpers";
import {
  FaixaEtaria,
  TipoAlimentacao,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { stringDecimalToNumber } from "src/helpers/parsers";
import { getUuid } from "../../helpers";

type TipoGrupoFlags = {
  ehCei?: boolean;
  ehEmef: boolean;
  ehCemei: boolean;
  ehEmebs: boolean;
};

type GetValorUnitarioParams = {
  desconto: DescontoFinanceiro;
  grupo: TipoGrupoFlags;
  faixasEtarias: FaixaEtaria[];
  tiposAlimentacao: TipoAlimentacao[];
  tabelas: RelatorioFinanceiroConsolidado["tabelas"];
};

export const formatarPayload = (
  descontos: DescontoFinanceiro[],
  { ehCemei, ehEmebs, ehEmef }: TipoGrupoFlags,
): DescontoFinanceiro[] =>
  descontos.map((desconto) => {
    let payload = {
      ...desconto,
      periodo_escolar: null,
    };

    if (typeof desconto.faixa_etaria === "string") {
      const [periodo, faixaEtaria] = desconto.faixa_etaria.split("|");

      payload = {
        ...payload,
        periodo_escolar: periodo,
        faixa_etaria: faixaEtaria,
      };
    }

    if (
      ehEmef &&
      typeof desconto.tipo_alimentacao === "string" &&
      desconto.tipo_alimentacao.includes("NOITE")
    ) {
      const [periodo, tipoAlimentacao] = desconto.tipo_alimentacao.split("|");

      payload = {
        ...payload,
        periodo_escolar: periodo,
        tipo_alimentacao: tipoAlimentacao,
      };
    }

    if (ehCemei) {
      const [tipoUnidade, tipoLancamento] =
        desconto.tipo_lancamento?.split("|") ?? [];

      payload = {
        ...payload,
        tipo_lancamento: tipoLancamento,
        cei_ou_emei: tipoUnidade,
      };
    }

    if (ehEmebs) {
      const [turma, tipoLancamento] =
        desconto.tipo_lancamento?.split("|") ?? [];

      payload = {
        ...payload,
        tipo_lancamento: tipoLancamento,
        infantil_ou_fundamental: turma,
      };
    }

    return payload;
  });

export const getValorUnitario = ({
  desconto,
  grupo,
  faixasEtarias,
  tiposAlimentacao,
  tabelas,
}: GetValorUnitarioParams) => {
  const {
    tipo_lancamento: tipoLancamento,
    faixa_etaria: faixaSelecionada,
    tipo_alimentacao: alimentacaoSelecionada,
  } = desconto;

  const { ehCei, ehCemei, ehEmebs, ehEmef } = grupo;

  if (!tipoLancamento) return 0;

  const [tipo, lancamento] = tipoLancamento.includes("|")
    ? tipoLancamento.split("|")
    : [null, tipoLancamento];

  let campo = null;

  if (
    (ehCei || ehCemei) &&
    faixaSelecionada &&
    typeof faixaSelecionada === "string"
  ) {
    const [periodo, faixaUuid] = faixaSelecionada.split("|");

    const faixa = faixasEtarias.find((f) => f.uuid === faixaUuid);

    if (!faixa) return 0;

    const nomeFaixa = normalizar(faixa.__str__);

    const tabela = tabelas?.find((tabela) => {
      const nomeTabela = tabela.nome
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

      return (
        nomeTabela?.includes(lancamento.replaceAll("_", " ").toUpperCase()) &&
        tabela.periodo_escolar === periodo
      );
    });

    if (!tabela) return 0;

    campo = tabela.valores?.find(
      (item) =>
        normalizar(item.nome_campo).replaceAll("_", " ") === nomeFaixa &&
        item.tipo_valor === "UNITARIO",
    );
  } else if (
    alimentacaoSelecionada &&
    typeof alimentacaoSelecionada === "string"
  ) {
    const ehRefeicaoEja = alimentacaoSelecionada.includes("NOITE");

    let nomeTipo = "";

    if (alimentacaoSelecionada === "kit_lanche") {
      nomeTipo = "kit lanche";
    } else {
      const uuidTipoAlimentacao = ehRefeicaoEja
        ? alimentacaoSelecionada.replace("NOITE|", "")
        : alimentacaoSelecionada;

      const tipoAlimentacao = tiposAlimentacao.find(
        (tipo) => tipo.uuid === uuidTipoAlimentacao,
      );

      nomeTipo = normalizar(tipoAlimentacao?.nome);
    }

    const tabela = tabelas?.find((tabela) => {
      const nomeTabela = tabela.nome
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

      const corresponde =
        nomeTabela?.includes(lancamento.replaceAll("_", " ").toUpperCase()) &&
        ((!ehEmebs && !ehCemei) || nomeTabela?.includes(tipo?.toUpperCase()));

      return (
        corresponde &&
        tabela.periodo_escolar === (ehRefeicaoEja ? "NOITE" : null)
      );
    });

    if (!tabela) return 0;

    if (!ehEmef || !nomeTipo.includes("refeicao")) {
      campo = tabela.valores?.find(
        (item) =>
          normalizar(item.nome_campo).replaceAll("_", " ") === nomeTipo &&
          item.tipo_valor === "UNITARIO",
      );
    } else {
      const tipoRefeicao = ehRefeicaoEja ? "eja" : "emef";

      campo = tabela.valores?.find(
        (item) =>
          normalizar(item.nome_campo)
            .replaceAll("_", " ")
            .includes(tipoRefeicao) && item.tipo_valor === "UNITARIO",
      );
    }
  }

  return stringDecimalToNumber(campo?.valor) ?? 0;
};

export const getValoresDescontos = (
  desconto: DescontoFinanceiro,
  { ehEmef }: Pick<TipoGrupoFlags, "ehEmef">,
): DescontoFinanceiro => {
  let tipoAlimentacao = getUuid(desconto.tipo_alimentacao);

  if (!desconto.tipo_alimentacao && !desconto.faixa_etaria) {
    tipoAlimentacao = "kit_lanche";
  } else if (ehEmef && desconto.periodo_escolar) {
    tipoAlimentacao = `${desconto.periodo_escolar}|${tipoAlimentacao}`;
  }

  const payload: DescontoFinanceiro = {
    ...desconto,
    faixa_etaria:
      desconto.faixa_etaria && desconto.periodo_escolar
        ? `${desconto.periodo_escolar}|${getUuid(desconto.faixa_etaria)}`
        : null,
    tipo_alimentacao: tipoAlimentacao,
    clausula_desconto: getUuid(desconto.clausula_desconto),
    unidades_educacionais: desconto.unidades_educacionais?.map(getUuid) ?? [],
  };

  if (desconto.cei_ou_emei && desconto.cei_ou_emei !== "N/A") {
    return {
      ...payload,
      tipo_lancamento: `${desconto.cei_ou_emei}|${getUuid(
        desconto.tipo_lancamento,
      )}`,
    };
  } else if (
    desconto.infantil_ou_fundamental &&
    desconto.infantil_ou_fundamental !== "N/A"
  ) {
    return {
      ...payload,
      tipo_lancamento: `${desconto.infantil_ou_fundamental}|${getUuid(
        desconto.tipo_lancamento,
      )}`,
    };
  }

  return payload;
};
