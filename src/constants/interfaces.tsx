import { TIPO_SOLICITACAO } from "./shared";

export type ITipoSolicitacao =
  (typeof TIPO_SOLICITACAO)[keyof typeof TIPO_SOLICITACAO];
