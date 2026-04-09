export interface CronogramaMensalDetalhado {
  uuid: string;
  numero: string;
  empresa: {
    uuid: string;
    nome_fantasia: string;
  } | null;
  contrato: {
    uuid: string;
    numero: string;
    processo: string;
    numero_pregao?: string;
    ata?: string;
    numero_chamada_publica?: string;
  } | null;
  ficha_tecnica: {
    uuid: string;
    produto: {
      uuid: string;
      nome: string;
    } | null;
  } | null;
  numero_empenho: string | null;
  qtd_total_empenho: number | null;
  custo_unitario_produto: number | null;
  etapas: {
    uuid: string;
    data_programada: string;
    quantidade: number;
  }[];
}

export interface CronogramaSemanalCreate {
  cronograma_mensal: string;
  observacoes?: string;
  programacoes?: ProgramacaoEntregaSemanalCreate[];
}

export interface ProgramacaoEntregaSemanalCreate {
  mes_programado: string;
  data_inicio: string;
  data_fim: string;
  quantidade: number;
}

export interface CronogramaMensalSimples {
  uuid: string;
  numero: string;
  produto_nome: string;
  fornecedor_nome: string;
  numero_contrato: string;
}

export interface EtapaMes {
  mes_ano: string;
  quantidade_total: number;
}
