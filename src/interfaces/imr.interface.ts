export interface ArquivoInterface {
  nome: string;
  arquivo: string;
}

export interface ArquivoFormInterface {
  nome: string;
  arquivo?: string;
  base64: string;
}

export interface NovoRelatorioVisitasFormInterface {
  uuid?: string;
  diretoria_regional: string;
  escola: string;
  data: string;
  lote: string;
  terceirizada: string;
  periodo_visita?: string;
  acompanhou_visita?: string;
  nome_nutricionista_empresa?: string;
  total_matriculados_por_data: number;
  maior_frequencia_no_periodo: number;
  anexos: Array<ArquivoInterface>;
  notificacoes_assinadas: Array<ArquivoInterface>;
  status?: string;
}

export interface InitialValuesInterface {
  [key: string]: Object[];
}
export interface EscolaLabelInterface {
  label: string;
  value: string;
  lote_nome: string;
  terceirizada: string;
  edital: string;
  uuid: string;
}

export interface EscolaOptionsInterface {
  uuid: string;
  nome: string;
  codigo_eol: string;
}

export interface PeriodoDeVisitaInterface {
  alterado_em: string;
  criado_em: string;
  nome: string;
  uuid: string;
}

export interface CategoriaTipoOcorrenciaInterface {
  nome: string;
  posicao: number;
  gera_notificacao: boolean;
  uuid: string;
}

export interface TipoPerguntaInterface {
  nome: string;
  uuid: string;
}

export interface ParametrizacoesInterface {
  uuid: string;
  posicao: number;
  titulo: string;
  tipo_pergunta: TipoPerguntaInterface;
}

export interface PenalidadeInterface {
  descricao: string;
  numero_clausula: string;
  obrigacoes: Array<string>;
}

export interface TipoOcorrenciaInterface {
  aceita_multiplas_respostas: boolean;
  categoria: CategoriaTipoOcorrenciaInterface;
  descricao: string;
  parametrizacoes: Array<ParametrizacoesInterface>;
  penalidade: PenalidadeInterface;
  posicao: number;
  titulo: string;
  uuid: string;
}

export interface UtensilioCozinhaInterface {
  nome: string;
  uuid: string;
}

export interface UtensilioMesaInterface {
  nome: string;
  uuid: string;
}

export interface EquipamentoInterface {
  nome: string;
  uuid: string;
}

export interface MobiliarioInterface {
  nome: string;
  uuid: string;
}

export interface ReparoEAdaptacaoInterface {
  nome: string;
  uuid: string;
}

export interface InsumoInterface {
  nome: string;
  uuid: string;
}

export interface FiltrosRelatoriosVisitasInterface {
  diretoria_regional?: string;
  unidade_educacional?: string;
  nome_nutricionista?: string;
  data_inicial?: string;
  data_final?: string;
  status?: string;
}

export interface RelatorioVisitaItemListagem {
  uuid?: string;
  unidade_educacional?: string;
  diretoria_regional?: string;
  data?: string;
  status?: string;
}

export interface RespostaOcorrenciaInterface {
  criado_em: string;
  alterado_em: string;
  uuid: string;
  grupo: number;
  resposta: any;
  formulario_base: number;
  parametrizacao: {
    uuid: string;
    posicao: number;
    titulo: string;
    tipo_pergunta: {
      uuid: string;
      nome: string;
    };
    tipo_ocorrencia: string;
  };
}

export interface RespostaOcorrenciaNaoSeAplicaInterface {
  criado_em: string;
  alterado_em: string;
  uuid: string;
  grupo: number;
  descricao: string;
  formulario_base: number;
  tipo_ocorrencia: string;
}

export interface NutricionistaOptionInterface {
  value: string;
  label: string;
}

export interface RespostaOcorrenciaDiretorInterface {
  uuid: string;
  parametrizacao: string | null;
  titulo: string;
  posicao: number | null;
  resposta: string;
}

export interface OcorrenciaDiretorInterface {
  uuid: string;
  data: string;
  categoria: {
    uuid: string;
    nome: string;
    posicao: number | null;
    gera_notificacao: boolean;
  };
  tipo_ocorrencia: string;
  titulo: string;
  descricao: string;
  grupo: number | null;
  respostas: RespostaOcorrenciaDiretorInterface[];
}
