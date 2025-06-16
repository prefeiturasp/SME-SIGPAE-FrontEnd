import {
  USUARIO_PODE_ATUALIZAR_FOTO_DEV_HOM,
  USUARIO_PODE_ATUALIZAR_FOTO_PROD,
} from "src/configs/constants";
import { ENVIRONMENT } from "src/constants/config";
import {
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
} from "src/helpers/utilities";

export const formatarSolicitacoesVigentes = (solicitacoes) => {
  solicitacoes.forEach((solicitacao) => {
    solicitacao.active = false;
  });
  return solicitacoes;
};

export const exibirParteInativacao = (solicitacao, uuid) => {
  return (
    solicitacao.ativo &&
    uuid &&
    (usuarioEhEscolaTerceirizadaDiretor() || usuarioEhEscolaTerceirizada()) &&
    ["CODAE_AUTORIZADO", "TERCEIRIZADA_TOMOU_CIENCIA"].includes(
      solicitacao.status_solicitacao
    )
  );
};

export const podeAtualizarFoto = (criadoRF) => {
  return (
    (ENVIRONMENT !== "production" &&
      criadoRF === USUARIO_PODE_ATUALIZAR_FOTO_DEV_HOM) ||
    (ENVIRONMENT === "production" &&
      criadoRF === USUARIO_PODE_ATUALIZAR_FOTO_PROD)
  );
};
