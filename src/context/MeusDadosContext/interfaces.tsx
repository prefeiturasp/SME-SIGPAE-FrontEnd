import { TipoContagemInterface } from "interfaces/dietaespecial.interface";
import {
  DiretoriaRegionalInterface,
  EnderecoInterface,
  LoteInterface,
  PeriodoEscolarInterface,
} from "interfaces/escola.interface";
import { ContratoTerceirizadaInterface } from "interfaces/terceirizada.interface";

export interface InstituicaoInterface {
  acesso_modulo_medicao_inicial?: boolean;
  codigo_eol: string | null;
  contato: ContratoTerceirizadaInterface;
  diretoria_regional: DiretoriaRegionalInterface;
  eh_cei?: boolean;
  eh_cemei?: boolean;
  endereco: EnderecoInterface;
  lotes: Array<LoteInterface>;
  modulo_gestao?: string;
  nome: string;
  periodos_escolares: Array<PeriodoEscolarInterface>;
  quantidade_alunos?: number;
  tipo_servico?: string;
  tipo_gestao: string;
  tipo_gestao_uuid?: string;
  tipo_unidade_escolar: string;
  tipo_unidade_escolar_iniciais: string;
  tipos_contagem: Array<TipoContagemInterface>;
  uuid: string;
}

export interface PerfilInterface {
  nome: string;
  uuid: string;
  visao: string;
}

export interface VinculoAtualInterface {
  ativo: boolean;
  instituicao: InstituicaoInterface;
  perfil: PerfilInterface;
  uuid: string;
}

export interface MeusDadosInterface {
  cargo: string | null;
  cpf: string | null;
  crn_numero: string | null;
  nome: string | null;
  date_joined: string;
  email: string;
  registro_funcional: string | null;
  tipo_email: string | null;
  tipo_usuario: string;
  uuid: string;
  vinculo_atual: VinculoAtualInterface;
  aceitou_termos: boolean;
}
