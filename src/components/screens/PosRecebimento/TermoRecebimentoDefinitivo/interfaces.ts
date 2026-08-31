export interface TermoRecebimentoListagem {
  uuid: string;
  numero_contrato: string;
  nome_empresa: string;
  data_cadastro: string;
  status: string;
  status_display?: string;
}

export interface FiltrosTermoRecebimento {
  nome_produto?: string;
  numero_contrato?: string;
  nome_empresa?: string;
  data_cadastro?: string;
  status?: string;
}

export interface EmpresaTermoDetalhe {
  uuid: string;
  cnpj?: string;
  nome_fantasia: string;
  razao_social?: string;
}

export interface ContratoTermoDetalhe {
  uuid: string;
  numero: string;
  processo?: string;
  numero_pregao?: string;
  numero_chamada_publica?: string;
  ata?: string;
}

export interface UnidadeMedidaTermo {
  uuid: string;
  nome: string;
  abreviacao: string;
}

export interface ProdutoFichaTecnicaTermo {
  uuid: string;
  nome: string;
}

export interface FichaTecnicaTermo {
  uuid: string;
  numero: string;
  pregao_chamada_publica?: string;
  produto: ProdutoFichaTecnicaTermo | null;
}

export interface CronogramaResumoTermo {
  uuid: string;
  numero: string;
  status?: string;
  criado_em?: string;
  alterado_em?: string;
  qtd_total_programada?: number;
  unidade_medida?: UnidadeMedidaTermo | null;
  ficha_tecnica?: FichaTecnicaTermo | null;
  ponto_a_ponto?: boolean;
  observacoes?: string;
  // O payload traz ainda contrato, empresa, armazem, etapas,
  // programacoes_de_recebimento etc. — tipar conforme forem usados na tela.
}

export interface CronogramaTermoItem {
  cronograma: CronogramaResumoTermo;
  valor_contrato?: string;
  quantidade_total_recebida: number | string;
}

export interface FiscalTermoDetalhe {
  uuid: string;
  nome: string;
}

export interface TermoRecebimentoDetalhe {
  uuid: string;
  status: string;
  status_display?: string;
  empresa: EmpresaTermoDetalhe;
  contrato: ContratoTermoDetalhe;
  cronogramas: CronogramaTermoItem[];
  fiscal_1: FiscalTermoDetalhe;
  fiscal_2: FiscalTermoDetalhe;
  fiscal_3: FiscalTermoDetalhe;
  texto_termo: string;
  criado_em?: string;
  alterado_em?: string;
}
