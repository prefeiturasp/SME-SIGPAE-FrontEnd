import CadastroTermoRecebimentoDefinitivoPage from "src/pages/PosRecebimento/CadastroTermoRecebimentoDefinitivoPage";
import TermoRecebimentoDefinitivoPage from "src/pages/PosRecebimento/TermoRecebimentoDefinitivoPage";
import { usuarioEhCronogramaOuCodae } from "src/helpers/utilities";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasPosRecebimento: Array<RotaInterface> = [
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.TERMO_RECEBIMENTO_DEFINITIVO}`,
    component: TermoRecebimentoDefinitivoPage,
    tipoUsuario: usuarioEhCronogramaOuCodae(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO}`,
    component: CadastroTermoRecebimentoDefinitivoPage,
    tipoUsuario: usuarioEhCronogramaOuCodae(),
  },
];
