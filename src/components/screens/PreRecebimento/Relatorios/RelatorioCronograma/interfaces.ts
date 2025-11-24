import { EtapaFicha } from "src/components/screens/Recebimento/FichaRecebimento/interfaces";

export interface FiltrosRelatorioCronograma {
  empresa?: string[];
  nome_produto?: string;
  numero?: string;
  status?: string;
  data_inicial?: string;
  data_final?: string;
  situacao?: string[];
}

export interface EmpresaFiltros {
  uuid: string;
  nome_fantasia: string;
}

export interface CronogramaRelatorio {
  armazem: string;
  custo_unitario_produto: number;
  empresa: string;
  etapas: EtapaFicha[];
  marca: string;
  numero: string;
  produto: string;
  qtd_total_programada: number;
  status: string;
  uuid: string;
}
