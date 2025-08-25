import { Arquivo } from "src/interfaces/pre_recebimento.interface";
import {
  ListagemPaginada,
  ResponseInterface,
} from "src/interfaces/responses.interface";

export interface FichaRecebimentoPayload {
  etapa: string;
  data_entrega: string;
  documentos_recebimento?: string[];
  lote_fabricante_de_acordo?: boolean | string;
  lote_fabricante_divergencia?: string;
  data_fabricacao_de_acordo?: boolean | string;
  data_fabricacao_divergencia?: string;
  data_validade_de_acordo?: boolean | string;
  data_validade_divergencia?: string;
  numero_lote_armazenagem?: string;
  numero_paletes?: string;
  peso_embalagem_primaria_1?: string;
  peso_embalagem_primaria_2?: string;
  peso_embalagem_primaria_3?: string;
  peso_embalagem_primaria_4?: string;
  veiculos?: VeiculoPayload[];
  sistema_vedacao_embalagem_secundaria?: string;
  observacao?: string;
  arquivos?: Arquivo[];
  observacoes_conferencia?: string;
  questoes?: QuestoesPayload[];
  ocorrencias?: OcorrenciaFichaRecebimento[];
  password?: string;
}

export interface DadosCronogramaSimples {
  uuid: string;
  numero: string;
  embalagem_primaria: string;
  embalagem_secundaria: string;
  peso_liquido_embalagem_primaria: string;
  peso_liquido_embalagem_secundaria: string;
  sistema_vedacao_embalagem_secundaria: string;
}

export interface FichaRecebimentoDetalhada {
  uuid: string;
  dados_cronograma: DadosCronogramaSimples;
  data_recebimento: string;
  status: string;
  etapa: EtapaFicha;
  data_entrega: string;
  documentos_recebimento?: string[];
  lote_fabricante_de_acordo?: boolean | string;
  lote_fabricante_divergencia?: string;
  data_fabricacao_de_acordo?: boolean | string;
  data_fabricacao_divergencia?: string;
  data_validade_de_acordo?: boolean | string;
  data_validade_divergencia?: string;
  numero_lote_armazenagem?: string;
  numero_paletes?: string;
  peso_embalagem_primaria_1?: string;
  peso_embalagem_primaria_2?: string;
  peso_embalagem_primaria_3?: string;
  peso_embalagem_primaria_4?: string;
  sistema_vedacao_embalagem_secundaria?: string;
  observacao?: string;
  observacoes_conferencia?: string;
  veiculos?: VeiculoPayload[];
  questoes?: QuestoesPayload[];
  ocorrencias?: OcorrenciaFichaRecebimento[];
  arquivos?: Arquivo[];
}

export interface QuestoesPayload {
  questao_conferencia: string;
  resposta: boolean;
  tipo_questao: string;
}

export interface VeiculoPayload {
  numero?: string;
  temperatura_recebimento?: string;
  temperatura_produto?: string;
  placa?: string;
  lacre?: string;
  numero_sif_sisbi_sisp?: string;
  numero_nota_fiscal?: string;
  quantidade_nota_fiscal?: string;
  embalagens_nota_fiscal?: string;
  quantidade_recebida?: string;
  embalagens_recebidas?: string;
  estado_higienico_adequado?: boolean | string;
  termografo?: boolean | string;
}

export interface DocumentoFicha {
  datas_fabricacao: string;
  datas_validade: string;
  numero_laudo: string;
  numero_lote_laudo: string;
  uuid: string;
}

export interface EtapaFicha {
  data_programada: string;
  desvinculada_recebimento: boolean;
  etapa: string;
  numero_empenho: string;
  parte: string;
  qtd_total_empenho: string;
  quantidade: string;
  total_embalagens: string;
  uuid: string;
}

export interface CronogramaFicha {
  ata: string;
  categoria: string;
  contrato: boolean;
  documentos_de_recebimento: DocumentoFicha[];
  embalagem_primaria: string;
  embalagem_secundaria: boolean;
  etapas: EtapaFicha[];
  fornecedor: string;
  marca: string;
  peso_liquido_embalagem_primaria: string;
  peso_liquido_embalagem_secundaria: string;
  pregao_chamada_publica: string;
  produto: string;
  qtd_total_programada: string;
  uuid: string;
  sistema_vedacao_embalagem_secundaria: string;
}

export interface FiltrosFichaRecebimento {
  numero_cronograma?: string;
  nome_produto?: string;
  nome_empresa?: string;
  data_inicial?: string;
  data_final?: string;
}

export interface FichaDeRecebimentoItemListagem {
  uuid?: string;
  numero_cronograma?: string;
  nome_produto?: string;
  fornecedor?: string;
  pregao_chamada_publica?: string;
  data_recebimento?: string;
}

export interface ResponseFichasDeRecebimento extends ResponseInterface {
  data: ListagemPaginada<FichaDeRecebimentoItemListagem>;
}

export interface OcorrenciaFichaRecebimento {
  houve_ocorrencia: string;
  tipo: string;
  relacao?: string;
  numero_nota?: string;
  quantidade?: string;
  descricao: string;
}
