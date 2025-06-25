import {
  EscolaRascunhosInterface,
  PeriodoEscolarRascunhosInterface,
  TipoAlimentacaoRascunhoInterface,
} from "src/interfaces/rascunhos.interface";

export interface PeriodosInclusaoInterface {
  checked: boolean;
  dias_semana: Array<number | string>;
  maximo_alunos: number;
  multiselect: "multiselect-wrapper-enabled" | "multiselect-wrapper-disabled";
  nome: string;
  numero_alunos: string | number | null;
  posicao: number;
  possui_alunos_regulares: boolean;
  tipo_turno: number;
  tipos_alimentacao: Array<TipoAlimentacaoRascunhoInterface>;
}

export interface QuantidadePeriodoValuesInterface {
  cancelado?: false;
  cancelado_em?: null;
  cancelado_justificativa?: string;
  cancelado_por?: null;
  dias_semanas: Array<string | number>;
  numero_alunos: string | number;
  observacao: string;
  periodo_escolar: string | PeriodoEscolarRascunhosInterface;
  tipos_alimentacao: Array<string>;
}
export interface ValuesFormInclusaoDeAlimentacaoInterface {
  inclusoes: Array<InclusoesDeAlimentacaoValuesInterface>;
  quantidades_periodo: Array<QuantidadePeriodoValuesInterface>;
  uuid: string;
  status: string;
  id_externo: string;
  escola: string;
}

export interface InclusoesDeAlimentacaoValuesInterface {
  motivo: string;
  data: string;
  evento: string;
}

export interface InclusoesDeAlimentacaoFromRequestInterface {
  motivo: MotivoInterface | string;
  data: string;
}

export interface MotivoInterface {
  nome: string;
  uuid: string;
}

export interface MotivoSimplesInterface extends MotivoInterface {
  nome: "Evento Específico" | "Outro" | "Dia da família" | "Reposição de aula";
}

export interface MotivoContinuoInterface extends MotivoInterface {
  nome:
    | "Programas/Projetos Específicos"
    | "ETEC"
    | "Programas/Projetos Contínuos";
}

export interface MotivoETECInterface extends MotivoInterface {
  nome: "ETEC";
}

export interface QuantidadesPeriodoInclusaoRascunhosInterface {
  cancelado: boolean;
  cancelado_em: string | null;
  cancelado_justificativa: string;
  cancelado_por: number | null;
  numero_alunos: number;
  observacao: string;
  periodo_escolar: Array<PeriodoEscolarRascunhosInterface>;
  tipos_alimentacao: Array<TipoAlimentacaoRascunhoInterface>;
  uuid: string;
}

export interface QuantidadesPeriodoInclusaoNormalRascunhosInterface
  extends QuantidadesPeriodoInclusaoRascunhosInterface {
  dias_semana: [];
  grupo_inclusao_normal: number;
  inclusao_alimentacao_continua: null;
}

export interface QuantidadesPeriodoInclusaoContinuaRascunhosInterface
  extends QuantidadesPeriodoInclusaoRascunhosInterface {
  dias_semana: Array<number>;
  grupo_inclusao_normal: null;
  inclusao_alimentacao_continua: number;
}

export interface RascunhosInclusaoDeAlimentacaoInterface {
  criado_em: string;
  criado_por: number;
  datas: string;
  descricao: string;
  escola: EscolaRascunhosInterface;
  foi_solicitado_fora_do_prazo: boolean;
  id_externo: string;
  logs: Array<any>;
  quantidades_periodo: Array<
    | QuantidadesPeriodoInclusaoNormalRascunhosInterface
    | QuantidadesPeriodoInclusaoContinuaRascunhosInterface
  >;
  inclusoes: undefined | Array<InclusoesDeAlimentacaoFromRequestInterface>;
  motivo: MotivoInterface;
  outro_motivo: string;
  prioridade: "VENCIDO" | "PRIORIDADE" | "LIMITE" | "REGULAR";
  rastro_dre: null;
  rastro_escola: null;
  rastro_lote: null;
  rastro_terceirizada: null;
  status: "RASCUNHO";
  terceirizada_conferiu_gestao: false;
  uuid: string;
}

export interface RascunhosInclusaoDeAlimentacaoNormalInterface
  extends RascunhosInclusaoDeAlimentacaoInterface {
  inclusoes: Array<InclusoesDeAlimentacaoFromRequestInterface>;
  quantidades_periodo: Array<QuantidadesPeriodoInclusaoNormalRascunhosInterface>;
}

export interface RascunhosInclusaoDeAlimentacaoContinuaInterface
  extends RascunhosInclusaoDeAlimentacaoInterface {
  quantidades_periodo: Array<QuantidadesPeriodoInclusaoContinuaRascunhosInterface>;
}
