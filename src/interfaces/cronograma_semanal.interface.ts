import { LogSolicitacoesUsuarioSimples as LogSolicitacoesUsuarioSimplesCommon } from "./dados_comuns.interface";
import {
  FichaTecnicaSimples,
  ProdutoSimples,
  UnidadeMedidaSimples,
} from "./pre_recebimento.interface";
import { TerceirizadaSimplesInterface } from "./terceirizada.interface";

export type EmpresaSimples = TerceirizadaSimplesInterface;

export interface ContratoSimples {
  uuid: string;
  numero: string;
  processo: string;
  numero_pregao?: string;
  ata?: string;
  numero_chamada_publica?: string;
}

export interface EtapaCronograma {
  uuid: string;
  data_programada: string;
  quantidade: number;
}

export interface CronogramaMensalDetalhado {
  uuid: string;
  numero: string;
  empresa: EmpresaSimples | null;
  contrato: ContratoSimples | null;
  ficha_tecnica: FichaTecnicaSimples | null;
  numero_empenho: string | null;
  qtd_total_empenho: number | null;
  custo_unitario_produto: number | null;
  etapas: EtapaCronograma[];
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

export interface ProgramacaoEntregaSemanal {
  mes_programado: string;
  data_inicio: string;
  data_fim: string;
  quantidade: number;
}

export interface CronogramaMensalSimplesDetail {
  uuid: string;
  numero: string;
  empresa: EmpresaSimples | null;
  contrato: ContratoSimples | null;
  numero_empenho: string | null;
  qtd_total_empenho: number | null;
  custo_unitario_produto: number | null;
  unidade_medida: UnidadeMedidaSimples | null;
  produto?: ProdutoSimples;
}

export interface CronogramaSemanalDetalhado {
  uuid: string;
  numero: string;
  status: string;
  observacoes: string | null;
  cronograma_mensal: CronogramaMensalSimplesDetail;
  programacoes: ProgramacaoEntregaSemanal[];
  logs: LogSolicitacoesUsuarioSimplesCommon[];
}

export { LogSolicitacoesUsuarioSimplesCommon as LogSolicitacoesUsuarioSimples };
