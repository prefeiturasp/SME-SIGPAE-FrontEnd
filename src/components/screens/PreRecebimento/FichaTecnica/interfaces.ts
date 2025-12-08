import {
  CategoriaFichaTecnicaChoices,
  MecanismoControleChoices,
  ProgramaChoices,
} from "src/interfaces/pre_recebimento.interface";

export interface OptionsCategoria {
  uuid: CategoriaFichaTecnicaChoices;
  nome: string;
}

export interface OptionsPrograma {
  uuid: ProgramaChoices;
  nome: string;
}

export interface InformacoesNutricionaisFichaTecnicaPayload {
  informacao_nutricional: string;
  quantidade_por_100g: string;
  quantidade_porcao: string;
  valor_diario: string;
}

// boolean | string -> tratado como string no form, enviado como boolean pro backend
// number | string -> tratado como string no form, enviado como number pro backend
export interface FichaTecnicaPayload {
  produto?: string;
  marca?: string;
  categoria?: CategoriaFichaTecnicaChoices;
  programa?: ProgramaChoices;
  empresa?: string;
  pregao_chamada_publica?: string;
  fabricante?: FabricanteFichaPayload;
  envasador_distribuidor?: FabricanteFichaPayload;
  prazo_validade?: string;
  numero_registro?: string;
  agroecologico?: boolean | string;
  organico?: boolean | string;
  mecanismo_controle?: MecanismoControleChoices;
  componentes_produto?: string;
  alergenicos?: boolean | string;
  ingredientes_alergenicos?: string;
  gluten?: boolean | string;
  lactose?: boolean | string;
  lactose_detalhe?: string;
  porcao?: string;
  unidade_medida_porcao?: string;
  valor_unidade_caseira?: string;
  unidade_medida_caseira?: string;
  informacoes_nutricionais?: InformacoesNutricionaisFichaTecnicaPayload[];
  prazo_validade_descongelamento?: string;
  condicoes_de_conservacao?: string;
  temperatura_congelamento?: number | string;
  temperatura_veiculo?: number | string;
  condicoes_de_transporte?: string;
  embalagem_primaria?: string;
  embalagem_secundaria?: string;
  embalagens_de_acordo_com_anexo?: boolean;
  material_embalagem_primaria?: string;
  produto_eh_liquido?: boolean | string;
  volume_embalagem_primaria?: number | string;
  unidade_medida_volume_primaria?: string;
  peso_liquido_embalagem_primaria?: number | string;
  unidade_medida_primaria?: string;
  peso_liquido_embalagem_secundaria?: number | string;
  unidade_medida_secundaria?: string;
  peso_embalagem_primaria_vazia?: number | string;
  unidade_medida_primaria_vazia?: string;
  peso_embalagem_secundaria_vazia?: number | string;
  unidade_medida_secundaria_vazia?: string;
  sistema_vedacao_embalagem_secundaria?: string;
  rotulo_legivel?: boolean;
  variacao_percentual?: number | string;
  nome_responsavel_tecnico?: string;
  habilitacao?: string;
  numero_registro_orgao?: string;
  arquivo?: string;
  modo_de_preparo?: string;
  informacoes_adicionais?: string;
  password?: string;
}

export interface FabricanteFichaPayload {
  fabricante?: string;
  cnpj?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  email?: string;
  telefone?: string;
}

export interface FiltrosFichaTecnica {
  numero_ficha?: string;
  nome_produto?: string;
  pregao_chamada_publica?: string;
  status?: string;
  data_cadastro?: string;
}

export interface StateConferidosAnalise {
  fabricante_envasador?: boolean;
  detalhes_produto?: boolean;
  informacoes_nutricionais?: boolean;
  conservacao?: boolean;
  temperatura_e_transporte?: boolean;
  armazenamento?: boolean;
  embalagem_e_rotulagem?: boolean;
  responsavel_tecnico?: boolean;
  modo_preparo?: boolean;
  outras_informacoes?: boolean;
}

export interface AnaliseFichaTecnicaPayload {
  fabricante_envasador_conferido: boolean;
  detalhes_produto_conferido: boolean;
  informacoes_nutricionais_conferido: boolean;
  conservacao_conferido: boolean;
  temperatura_e_transporte_conferido: boolean;
  armazenamento_conferido: boolean;
  embalagem_e_rotulagem_conferido: boolean;
  responsavel_tecnico_conferido: boolean;
  modo_preparo_conferido: boolean;
  outras_informacoes_conferido: boolean;
  fabricante_envasador_correcoes: string;
  detalhes_produto_correcoes: string;
  informacoes_nutricionais_correcoes: string;
  conservacao_correcoes: string;
  temperatura_e_transporte_correcoes: string;
  armazenamento_correcoes: string;
  embalagem_e_rotulagem_correcoes: string;
  responsavel_tecnico_correcoes: string;
  modo_preparo_correcoes: string;
}
