import moment from "moment";
import { formataMilharDecimal } from "src/helpers/utilities";
import {
  CronogramaMensalDetalhado,
  CronogramaSemanalDetalhado,
  EtapaCronograma,
  EtapaMes,
} from "src/interfaces/cronograma_semanal.interface";

interface ProgramacaoForm {
  mes_programado: string;
  data_inicio: string;
  data_fim: string;
  quantidade: string;
}

export const obterLimitesMes = (
  mesAno: string,
): { minDate: Date | null; maxDate: Date | null } => {
  if (!mesAno || !/^\d{2}\/\d{4}$/.test(mesAno)) {
    return { minDate: null, maxDate: null };
  }

  const [mes, ano] = mesAno.split("/").map(Number);
  const minDate = new Date(ano, mes - 1, 1);
  const maxDate = new Date(ano, mes, 0);

  return { minDate, maxDate };
};

export const formataDataISOparaDDMMYYYY = (
  dataISO: string | null,
): string | undefined => {
  if (!dataISO) return undefined;
  const data = moment(dataISO, ["YYYY-MM-DD", "DD/MM/YYYY"]);
  if (!data.isValid()) return undefined;
  return data.format("DD/MM/YYYY");
};

export const calcularQuantidadeEstimada = (
  mesProgramado: string,
  etapas: EtapaCronograma[],
): number => {
  if (!mesProgramado || !etapas) return 0;

  const etapasDoMes = etapas.filter(
    (etapa) => etapa.data_programada === mesProgramado,
  );

  return etapasDoMes.reduce((sum, etapa) => sum + (etapa.quantidade || 0), 0);
};

export const calcularQuantidadeEstimadaDisponivel = (
  mesProgramado: string,
  etapasMeses: EtapaMes[],
): number => {
  if (!mesProgramado || !etapasMeses) return 0;

  const etapaMes = etapasMeses.find((em) => em.mes_ano === mesProgramado);
  return etapaMes?.quantidade_estimada_disponivel || 0;
};

export const calcularDiferenca = (
  mesProgramado: string,
  programacoes: ProgramacaoForm[] | undefined,
  etapasMeses: EtapaMes[],
): number => {
  const quantidadeEstimadaDisponivel = calcularQuantidadeEstimadaDisponivel(
    mesProgramado,
    etapasMeses,
  );

  const quantidadeEntregue = (programacoes || []).reduce((total, prog) => {
    if (prog.mes_programado !== mesProgramado) return total;
    const qtd =
      parseFloat(
        prog.quantidade?.replace(/\./g, "").replace(",", ".") || "0",
      ) || 0;
    return total + qtd;
  }, 0);

  return (
    Math.round((quantidadeEstimadaDisponivel - quantidadeEntregue) * 100) / 100
  );
};

export const montarCamposCronograma = (data: CronogramaMensalDetalhado) => ({
  produto: data.ficha_tecnica?.produto?.nome || "",
  fornecedor: data.empresa?.nome_fantasia || "",
  numero_contrato: data.contrato?.numero || "",
  numero_processo_sei: data.contrato?.processo || "",
  numero_chamada_publica_ou_ata: data.contrato?.numero_pregao
    ? data.contrato?.ata || ""
    : data.contrato?.numero_chamada_publica || "",
  tipo_documento: data.contrato?.numero_pregao
    ? "Nº da Ata"
    : "Nº da Chamada Pública",
  numero_empenho: data.numero_empenho || "",
  qtd_total_empenho: formataMilharDecimal(data.qtd_total_empenho) || "",
  custo_unitario_produto: `R$ ${formataMilharDecimal(data.custo_unitario_produto)}`,
});

export const obterProgramacoesIniciais = (
  cronogramaSemanalExistente: CronogramaSemanalDetalhado | undefined,
  programacoesAtuais: any[] | undefined,
  programacaoPadrao: any,
) => {
  if (cronogramaSemanalExistente?.programacoes) {
    return cronogramaSemanalExistente.programacoes.map((p) => ({
      mes_programado: p.mes_programado,
      data_inicio: formataDataISOparaDDMMYYYY(p.data_inicio) || "",
      data_fim: formataDataISOparaDDMMYYYY(p.data_fim) || "",
      quantidade: formataMilharDecimal(p.quantidade),
    }));
  }
  return programacoesAtuais && programacoesAtuais.length > 0
    ? programacoesAtuais
    : [programacaoPadrao];
};

export const agruparEtapasPorMes = (etapas: any[]): EtapaMes[] => {
  const meses: {
    [key: string]: {
      quantidade_total: number;
      quantidade_estimada_disponivel: number;
    };
  } = {};

  for (const etapa of etapas) {
    if (!etapa.data_programada) continue;
    const mesAno = etapa.data_programada;
    meses[mesAno] ??= {
      quantidade_total: 0,
      quantidade_estimada_disponivel: 0,
    };
    meses[mesAno].quantidade_total += etapa.quantidade || 0;
    meses[mesAno].quantidade_estimada_disponivel =
      etapa.quantidade_estimada_disponivel ?? 0;
  }

  return Object.entries(meses).map(
    ([mes_ano, { quantidade_total, quantidade_estimada_disponivel }]) => ({
      mes_ano,
      quantidade_total,
      quantidade_estimada_disponivel,
    }),
  );
};
