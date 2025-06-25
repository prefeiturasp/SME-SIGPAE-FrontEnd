import { TipoAlimentacaoInterface } from "src/interfaces/cardapio.interface";
import {
  PeriodoEscolarRascunhosInterface,
  TipoGestaoRascunhosInterface,
  TipoUnidadeRascunhosInterface,
} from "./rascunhos.interface";
import { TerceirizadaInterface } from "./terceirizada.interface";

export interface DiretoriaRegionalInterface {
  acesso_modulo_medicao_inicial: boolean;
  codigo_eol: number;
  iniciais: string;
  nome: string;
  uuid: string;
}

export interface LoteInterface {
  nome: string;
  terceirizada: TerceirizadaInterface;
  uuid: string;
}

export interface TipoUnidadeEscolarInterface {
  ativo: boolean;
  iniciais: string;
  pertence_relatorio_solicitacoes_alimentacao: boolean;
  tem_somente_integral_e_parcial: boolean;
  uuid: string;
}

export interface PeriodoEscolarInterface {
  uuid: string;
  nome: string;
  posicao: number;
  possui_alunos_regulares: boolean | null;
  tipo_turno: number;
  tipos_alimentacao: Array<TipoAlimentacaoInterface>;
}

export interface VinculoTipoAlimentacaoPorEscolaInterface {
  periodo_escolar: PeriodoEscolarInterface;
  tipos_unidade_escolar: TipoUnidadeEscolarInterface;
  tipos_alimentacao: TipoAlimentacaoInterface;
  uuid: string;
}

export interface EscolaComLoteEDREInterface {
  codigo_codae: string | null;
  codigo_eol: string;
  diretoria_regional: DiretoriaRegionalInterface;
  lote: LoteInterface;
  nome: string;
  quantidade_alunos: number;
  tipo_gestao: string;
  uuid: string;
}

export interface QuantidadeAlunosEscolaInterface {
  escola: EscolaComLoteEDREInterface;
  periodo_escolar: PeriodoEscolarInterface;
  quantidade_alunos: number;
  uuid: string;
}

export interface EnderecoInterface {
  logradouro: string;
  numero: number;
  complemento: string;
  bairro: string;
  cep: number;
}

export interface LoteComContratosInterface {
  contratos_do_lote: Array<ContratoDoLoteInterface>;
  nome: string;
  uuid: string;
}

export interface EscolaSimplissimaInterface {
  codigo_eol: string;
  diretoria_regional: DiretoriaRegionalInterface;
  lote?: string;
  lote_obj?: LoteComContratosInterface;
  nome: string;
  quantidade_alunos: number;
  terceirizada: string;
  tipo_unidade: string;
  uuid: string;
}

export interface ContratoDoLoteInterface {
  edital: string;
  edital_numero: string;
  eh_imr: boolean;
  encerrado: boolean;
  uuid: string;
}

export interface LoteDaEscolaSimplesInterface {
  contratos_do_lote: Array<ContratoDoLoteInterface>;
  diretoria_regional: DiretoriaRegionalInterface;
  nome: string;
  terceirizada: TerceirizadaInterface;
  tipo_gestao: string;
  uuid: string;
}

export interface EscolaSimplesInterface {
  codigo_eol: number;
  diretoria_regional: DiretoriaRegionalInterface;
  lote: LoteDaEscolaSimplesInterface;
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
