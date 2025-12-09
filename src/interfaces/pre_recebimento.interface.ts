import { AnaliseFichaTecnicaPayload } from "src/components/screens/PreRecebimento/FichaTecnica/interfaces";
import { LogSolicitacoesUsuarioSimples } from "./dados_comuns.interface";
import { InformacaoNutricional } from "./produto.interface";
import { TerceirizadaSimplesInterface } from "./terceirizada.interface";

export type ProgramaChoices = "LEVE_LEITE" | "ALIMENTACAO_ESCOLAR";

export interface DocumentosRecebimento {
  criado_em: string;
  nome_produto: string;
  numero_cronograma: string;
  numero_laudo: string;
  pregao_chamada_publica: string;
  status: string;
  uuid: string;
}

export interface DocumentosRecebimentoDetalhado extends DocumentosRecebimento {
  numero_laudo: string;
  correcao_solicitada: string;
  tipos_de_documentos: TiposDocumentos[];
  logs: LogSolicitacoesUsuarioSimples[];
}

export interface DocumentosRecebimentoParaAnalise
  extends DocumentosRecebimentoDetalhado {
  data_final_lote: string;
  datas_fabricacao_e_prazos: DatasFabricacaoPrazos[];
  quantidade_laudo: number;
  saldo_laudo: number;
  numero_lote_laudo: string;
  numero_sei: string;
  fornecedor: string;
  unidade_medida: UnidadeMedidaSimples;
  laboratorio: LaboratorioSimples;
}

export interface DatasFabricacaoPrazos {
  data_fabricacao: string;
  data_validade: string;
  prazo_maximo_recebimento: string;
  data_maxima_recebimento?: string;
  justificativa?: string;
}

export interface UnidadeMedidaSimples {
  uuid: string;
  nome: string;
  abreviacao: string;
}

export interface LaboratorioSimples {
  uuid: string;
  nome: string;
}
export interface Arquivo {
  nome: string;
  arquivo: string;
}

export interface ArquivoForm {
  nome: string;
  arquivo?: string;
  base64: string;
}

export type TiposDocumentoChoices =
  | "LAUDO"
  | "DECLARACAO_LEI_1512010"
  | "CERTIFICADO_CONF_ORGANICA"
  | "RASTREABILIDADE"
  | "DECLARACAO_MATERIA_ORGANICA"
  | "OUTROS";

export type PrazoRecebimentoChoices =
  | "30"
  | "60"
  | "90"
  | "120"
  | "180"
  | "OUTRO";

export interface TiposDocumentos {
  tipo_documento: TiposDocumentoChoices;
  arquivos: Array<Arquivo>;
  descricao_documento?: string;
  uuid: string;
}

export interface CronogramaSimples {
  uuid: string;
  nome_produto: string;
  numero: string;
  pregao_chamada_publica: string;
  value?: string;
}

export interface DocumentosRecebimentoDashboard {
  programa_leve_leite: boolean;
  log_mais_recente: string;
  nome_empresa: string;
  nome_produto: string;
  numero_cronograma: string;
  status: string;
  uuid: string;
}

export interface FiltrosDashboardDocumentos {
  nome_produto?: string;
  numero_cronograma?: string;
  nome_fornecedor?: string;
  status?: string[];
  offset?: number;
  limit?: number;
}

export interface FichaTecnicaDashboard {
  programa_leve_leite: boolean;
  log_mais_recente: string;
  nome_empresa: string;
  nome_produto: string;
  numero_ficha: string;
  status: string;
  uuid: string;
}

export interface FiltrosDashboardFichasTecnicas {
  nome_produto?: string;
  numero_ficha?: string;
  nome_empresa?: string;
  status?: string[];
  offset?: number;
  limit?: number;
}

export interface OptionsGenerico {
  uuid: string;
  nome: string;
}

export type CategoriaFichaTecnicaChoices = "PERECIVEIS" | "NAO_PERECIVEIS";

export interface ProdutoSimples {
  uuid: string;
  nome: string;
}

export interface MarcaSimples {
  uuid: string;
  nome: string;
}

export interface FabricanteSimples {
  uuid: string;
  nome: string;
}

export type MecanismoControleChoices = "CERTIFICACAO" | "OPAC" | "OCS" | "";

export interface FichaTecnica {
  uuid: string;
  numero: string;
  nome_produto: string;
  pregao_chamada_publica: string;
  criado_em: string;
  status: string;
}

export interface InformacoesNutricionaisFichaTecnica {
  uuid: string;
  informacao_nutricional: InformacaoNutricional;
  quantidade_por_100g: string;
  quantidade_porcao: string;
  valor_diario: string;
}

export interface FichaTecnicaDetalhada {
  uuid: string;
  numero: string;
  produto: ProdutoSimples;
  pregao_chamada_publica: string;
  marca: MarcaSimples;
  categoria: CategoriaFichaTecnicaChoices;
  programa: ProgramaChoices;
  status: string;
  criado_em: string;
  empresa: TerceirizadaSimplesInterface;
  fabricante: FabricanteFichaTecnica;
  envasador_distribuidor: FabricanteFichaTecnica;
  prazo_validade: string;
  numero_registro: string;
  agroecologico: boolean;
  organico: boolean;
  mecanismo_controle: MecanismoControleChoices;
  componentes_produto: string;
  alergenicos: boolean;
  ingredientes_alergenicos: string;
  gluten: boolean;
  lactose: boolean;
  lactose_detalhe: string;
  porcao: string;
  unidade_medida_porcao: UnidadeMedidaSimples;
  valor_unidade_caseira: string;
  unidade_medida_caseira: string;
  informacoes_nutricionais: InformacoesNutricionaisFichaTecnica[];
  prazo_validade_descongelamento: string;
  condicoes_de_conservacao: string;
  temperatura_congelamento: number;
  temperatura_veiculo: number;
  condicoes_de_transporte: string;
  embalagem_primaria: string;
  embalagem_secundaria: string;
  embalagens_de_acordo_com_anexo?: boolean;
  material_embalagem_primaria: string;
  produto_eh_liquido: boolean;
  volume_embalagem_primaria: number;
  unidade_medida_volume_primaria: UnidadeMedidaSimples;
  peso_liquido_embalagem_primaria: number;
  unidade_medida_primaria: UnidadeMedidaSimples;
  peso_liquido_embalagem_secundaria: number;
  unidade_medida_secundaria: UnidadeMedidaSimples;
  peso_embalagem_primaria_vazia: number;
  unidade_medida_primaria_vazia: UnidadeMedidaSimples;
  peso_embalagem_secundaria_vazia: number;
  unidade_medida_secundaria_vazia: UnidadeMedidaSimples;
  sistema_vedacao_embalagem_secundaria: string;
  rotulo_legivel?: boolean;
  variacao_percentual: number;
  nome_responsavel_tecnico: string;
  habilitacao: string;
  numero_registro_orgao: string;
  arquivo: string | null;
  modo_de_preparo: string;
  informacoes_adicionais: string;
}

export interface FabricanteFichaTecnica {
  fabricante: FabricanteSimples;
  cnpj: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  email: string;
  telefone: string;
}
export interface AnaliseFichaTecnica extends AnaliseFichaTecnicaPayload {
  criado_por: string;
  alterado_em: string;
  uuid: string;
  aprovada: boolean;
}

export interface FichaTecnicaDetalhadaComAnalise extends FichaTecnicaDetalhada {
  analise: AnaliseFichaTecnica;
  log_mais_recente: string;
  ficha_tecnica?: string;
}

export interface FichaTecnicaSimples {
  uuid: string;
  numero: string;
  produto: ProdutoSimples;
  uuid_empresa: string;
  pregao_chamada_publica: string;
}

export interface DadosCronogramaFichaTecnica extends FichaTecnicaSimples {
  marca: MarcaSimples;
  volume_embalagem_primaria: number;
  unidade_medida_volume_primaria: UnidadeMedidaSimples;
  peso_liquido_embalagem_primaria: number;
  unidade_medida_primaria: UnidadeMedidaSimples;
  peso_liquido_embalagem_secundaria: number;
  unidade_medida_secundaria: UnidadeMedidaSimples;
}

export interface EtapaCalendario {
  data_programada: string;
  etapa: string;
  nome_fornecedor: string;
  nome_produto: string;
  numero_cronograma: string;
  numero_empenho: string;
  parte: string;
  quantidade: number;
  uuid: string;
  uuid_cronograma: string;
  status: string;
  unidade_medida: string;
  programa_leve_leite: boolean;
}

export interface CardItem {
  text: string;
  date: string;
  link: string;
  status: string;
  fullText?: string;
}

export interface CardConfig<T> {
  id: string;
  titulo: string;
  icon: string;
  style: string;
  incluir_status: string[];
  href: string;
  items?: T[];
}

export interface VerMaisItem {
  texto: string;
  textoCompleto?: string;
  data: string;
  link: string;
}
