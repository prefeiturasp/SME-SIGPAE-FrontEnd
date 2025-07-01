import {
  EscolaComLoteEDREInterface,
  DiretoriaRegionalInterface,
  PeriodoEscolarInterface,
} from "src/interfaces/escola.interface";

interface AlimentacoesLancamentoEspecialInterface {
  nome: string;
  ativo: boolean;
  uuid: string;
}

export interface PermissaoLancamentosEspeciaisInterface {
  alimentacoes_lancamento_especial: AlimentacoesLancamentoEspecialInterface[];
  alterado_em: string;
  ativo: boolean;
  criado_em: string;
  criado_por: number;
  data_final: string | null;
  data_inicial: string | null;
  diretoria_regional: DiretoriaRegionalInterface;
  escola: EscolaComLoteEDREInterface;
  id: number;
  periodo_escolar: PeriodoEscolarInterface;
  uuid: string;
}

export interface EscolasComPermissoesLancamentosEspeciaisInterface {
  escola: string;
  uuid: string;
}
