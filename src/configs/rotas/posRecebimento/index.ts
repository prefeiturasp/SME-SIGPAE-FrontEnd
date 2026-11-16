import CadastroTermoRecebimentoProvisorioPage from "src/pages/PosRecebimento/CadastroTermoRecebimentoProvisorioPage";
import TermoRecebimentoProvisorioPage from "src/pages/PosRecebimento/TermoRecebimentoProvisorioPage";
import DetalharTermoRecebimentoProvisorioPage from "src/pages/PosRecebimento/DetalharTermoRecebimentoProvisorioPage";
import MemorandoOcorrenciasPage from "src/pages/PosRecebimento/MemorandoOcorrenciasPage";
import RegistrarMemorandoOcorrenciaPage from "src/pages/PosRecebimento/RegistrarMemorandoOcorrenciaPage";
import PainelAssinaturaTermosRecebimentoPage from "src/pages/PosRecebimento/PainelAssinaturaTermosRecebimentoPage";
import StatusTermoPendentesAssinatura from "src/pages/PosRecebimento/CardsAssinaturaTermos/StatusTermoPendentesAssinatura";
import StatusTermoAssinados from "src/pages/PosRecebimento/CardsAssinaturaTermos/StatusTermoAssinados";
import {
  exibirMemorandoOcorrencias,
  usuarioEhCronogramaOuCodae,
  usuarioEhDilogDiretoria,
  usuarioEhDilogQualidade,
} from "src/helpers/utilities";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasPosRecebimento: Array<RotaInterface> = [
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.MEMORANDO_OCORRENCIAS}/${constants.REGISTRAR_MEMORANDO_OCORRENCIA}`,
    component: RegistrarMemorandoOcorrenciaPage,
    tipoUsuario: exibirMemorandoOcorrencias(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.MEMORANDO_OCORRENCIAS}`,
    component: MemorandoOcorrenciasPage,
    tipoUsuario: exibirMemorandoOcorrencias(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.TERMO_RECEBIMENTO_PROVISORIO}`,
    component: TermoRecebimentoProvisorioPage,
    tipoUsuario:
      usuarioEhCronogramaOuCodae() ||
      usuarioEhDilogDiretoria() ||
      usuarioEhDilogQualidade(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.CADASTRO_TERMO_RECEBIMENTO_PROVISORIO}`,
    component: CadastroTermoRecebimentoProvisorioPage,
    tipoUsuario: usuarioEhCronogramaOuCodae(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.DETALHAR_TERMO_RECEBIMENTO_PROVISORIO}`,
    component: DetalharTermoRecebimentoProvisorioPage,
    tipoUsuario:
      usuarioEhCronogramaOuCodae() ||
      usuarioEhDilogDiretoria() ||
      usuarioEhDilogQualidade(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`,
    component: PainelAssinaturaTermosRecebimentoPage,
    tipoUsuario: usuarioEhDilogQualidade(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}/${constants.PENDENTES_ASSINATURA_TERMOS}/`,
    component: StatusTermoPendentesAssinatura,
    tipoUsuario: usuarioEhDilogQualidade(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}/${constants.ASSINADOS_TERMOS}/`,
    component: StatusTermoAssinados,
    tipoUsuario: usuarioEhDilogQualidade(),
  },
];
