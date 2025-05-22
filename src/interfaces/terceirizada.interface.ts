export interface ContatoTerceirizadaInterface {
  celular: string;
  crn_numero: string;
  eh_nutricionista: boolean;
  email: string;
  nome: string;
  telefone: string;
  telefone2: string;
}

export interface EditalInterface {
  numero: string;
  objeto: string;
  processo: string;
  tipo_contratacao: string;
  uuid: string;
}

export interface VigenciaContratoInterface {
  data_final: string;
  data_inicial: string;
  uuid: string;
}

export interface ContratoTerceirizadaInterface {
  ata_chamada_publica: string;
  data_hora_encerramento: string | null;
  data_proposta: string;
  edital: EditalInterface | null;
  encerrado: boolean;
  numero: string;
  pregao: string;
  processo: string;
  uuid: string;
  vigencias: Array<VigenciaContratoInterface>;
}

export interface TerceirizadaInterface {
  cnpj: string;
  contatos: Array<ContatoTerceirizadaInterface>;
  contratos: Array<ContratoTerceirizadaInterface>;
  nome_fantasia: string;
  uuid: string;
}

export interface TerceirizadaComEnderecoInterface
  extends TerceirizadaInterface {
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  responsavel_email: string;
  responsavel_telefone: string;
  razao_social: string;
}

export interface TerceirizadaSimplesInterface {
  uuid: string;
  razao_social: string;
  nome_fantasia: string;
}
