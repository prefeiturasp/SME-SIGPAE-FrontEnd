export interface OcorrenciaFormInterface {
  tipoOcorrencia: string;
  parametrizacao: string;
  resposta: string | number | boolean;
  grupo: number;
}

export interface RegistrarNovaOcorrenciaFormInterface {
  categoria: string;
  tipo_ocorrencia: string;
  datas: Array<string>;
  ocorrencias: Array<OcorrenciaFormInterface>;
  solicitacao_medicao_inicial: string;
}

export interface AtualizarOcorrenciaFormInterface {
  tipo_ocorrencia: string;
  grupo: number;
  data: string;
  ocorrencias: Array<OcorrenciaFormInterface>;
}
