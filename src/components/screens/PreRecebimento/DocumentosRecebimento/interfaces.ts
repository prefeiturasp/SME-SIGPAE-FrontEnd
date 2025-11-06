import {
  TiposDocumentoChoices,
  Arquivo,
  PrazoRecebimentoChoices,
  DatasFabricacaoPrazos,
} from "src/interfaces/pre_recebimento.interface";

export interface OptionsTipoDocumento {
  value: TiposDocumentoChoices;
  label: string;
}

export interface OptionsPrazoRecebimento {
  uuid: PrazoRecebimentoChoices;
  nome: string;
}

export interface TiposDocumentosPayload {
  tipo_documento: TiposDocumentoChoices;
  arquivos_do_tipo_de_documento: Array<Arquivo>;
  descricao_documento?: string;
}

export interface DocumentosRecebimentoPayload {
  cronograma: string;
  numero_laudo: string;
  tipos_de_documentos: Array<TiposDocumentosPayload>;
}

export interface DocumentosState {
  [key: string]: Array<Arquivo>;
}

export interface FiltrosDocumentosRecebimento {
  nome_produto?: string;
  numero_cronograma?: string;
  status?: string;
  data_criacao?: string;
}

export interface AnaliseDocumentoPayload {
  laboratorio: string;
  quantidade_laudo: string;
  unidade_medida: string;
  numero_lote_laudo: string;
  data_final_lote: string;
  datas_fabricacao_e_prazos: DatasFabricacaoPrazos[];
  correcao_solicitada: string;
}

export interface CorrecaoDocumentoPayload {
  tipos_de_documentos: Array<TiposDocumentosPayload>;
}
