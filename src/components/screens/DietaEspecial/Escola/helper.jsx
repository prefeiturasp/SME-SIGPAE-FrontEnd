import {
  USUARIO_PODE_ATUALIZAR_FOTO_DEV_HOM,
  USUARIO_PODE_ATUALIZAR_FOTO_PROD,
} from "src/configs/constants";
import { ENVIRONMENT } from "src/constants/config";

export const formatarSolicitacoesVigentes = (solicitacoes) => {
  solicitacoes.forEach((solicitacao) => {
    solicitacao.active = false;
  });
  return solicitacoes;
};

export const podeAtualizarFoto = (criadoRF) => {
  return (
    (!ENVIRONMENT.includes("production") &&
      criadoRF === USUARIO_PODE_ATUALIZAR_FOTO_DEV_HOM) ||
    (ENVIRONMENT.includes("production") &&
      criadoRF === USUARIO_PODE_ATUALIZAR_FOTO_PROD)
  );
};
