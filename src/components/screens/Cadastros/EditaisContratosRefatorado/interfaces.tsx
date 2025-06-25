import { TerceirizadaInterface } from "src/interfaces/terceirizada.interface";

export interface FormCadastroEditaisContratosVigenciaInterface {
  data_inicial: string;
  data_final: string;
  uuid?: string;
  status?: string;
}

export interface FormCadastroEditaisContratosContratoInterface {
  processo: string;
  data_proposta: string;
  numero: string;
  vigencias: Array<FormCadastroEditaisContratosVigenciaInterface>;
  lotes: Array<string>;
  diretorias_regionais: Array<string>;
  terceirizada: string;
  encerrado?: boolean;
  data_hora_encerramento?: string | null;
  uuid?: string;
}

export interface FormCadastroEditaisContratosInterface {
  tipo_contratacao: string;
  numero: string;
  processo: string;
  objeto: string;
  contratos: Array<FormCadastroEditaisContratosContratoInterface>;
  uuid?: string;
}

export interface VigenciaInterface
  extends FormCadastroEditaisContratosVigenciaInterface {
  uuid: string;
  status: string;
}

export interface ContratoInterface {
  ata: string;
  data_hora_encerramento: string | null;
  data_proposta: string;
  diretorias_regionais: Array<{
    uuid: string;
    nome: string;
  }>;
  edital: string;
  encerrado: boolean;
  lotes: Array<{
    uuid: string;
    nome: string;
  }>;
  modalidade: string;
  numero: string;
  numero_chamada_publica: string;
  numero_pregao: string;
  processo: string;
  terceirizada: TerceirizadaInterface;
  uuid: string;
  vigencias: Array<VigenciaInterface>;
}

export interface EditalContratoInterface {
  contratos: Array<ContratoInterface>;
  numero: string;
  objeto: string;
  processo: string;
  tipo_contratacao: string;
  uuid: string;
  eh_imr?: boolean;
}

export interface EditalContratoListadoInterface
  extends EditalContratoInterface {
  ativo: boolean;
}
