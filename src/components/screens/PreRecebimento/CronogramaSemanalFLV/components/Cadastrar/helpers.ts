import moment from "moment";
import {
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
