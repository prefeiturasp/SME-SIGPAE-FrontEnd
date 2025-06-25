import {
  DiretoriaRegionalInterface,
  LoteInterface,
} from "src/interfaces/escola.interface";

export interface LoteRascunhosInterface extends LoteInterface {
  diretoria_regional: DiretoriaRegionalInterface;
  tipo_gestao: string | null;
}

export interface TipoAlimentacaoRascunhoInterface {
  nome: string;
  uuid: string;
  posicao: number;
}

export interface PeriodoEscolarRascunhosInterface {
  nome: string;
  posicao: number;
  possui_alunos_regulares: boolean | null;
  tipo_turno: number;
  tipos_alimentacao: Array<TipoAlimentacaoRascunhoInterface>;
}

export interface TipoGestaoRascunhosInterface {
  nome: string;
  uuid: string;
}

export interface TipoUnidadeRascunhosInterface {
  ativo: boolean;
  iniciais: string;
  periodos_escolares: Array<PeriodoEscolarRascunhosInterface>;
  pertence_relatorio_solicitacoes_alimentacao: boolean;
  tem_somente_integral_e_parcial: boolean;
  uuid: string;
}

export interface EscolaRascunhosInterface {
  codigo_eol: number;
  diretoria_regional: DiretoriaRegionalInterface;
  lote: LoteRascunhosInterface;
  nome: string;
  periodos_escolares: Array<PeriodoEscolarRascunhosInterface>;
  quantidade_alunos: number;
  quantidade_alunos_cei_da_cemei: number | null;
  quantidade_alunos_emei_da_cemei: number | null;
  tipo_gestao: TipoGestaoRascunhosInterface;
  tipo_unidade: TipoUnidadeRascunhosInterface;
  tipos_contagem: Array<any>;
  uuid: string;
}
