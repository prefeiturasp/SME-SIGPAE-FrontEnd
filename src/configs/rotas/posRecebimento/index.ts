import CadastroTermoRecebimentoDefinitivoPage from "src/pages/PosRecebimento/CadastroTermoRecebimentoDefinitivoPage";
import TermoRecebimentoDefinitivoFornecedorPage from "src/pages/PosRecebimento/TermoRecebimentoDefinitivoFornecedorPage";
import TermoRecebimentoDefinitivoPage from "src/pages/PosRecebimento/TermoRecebimentoDefinitivoPage";
import DetalharTermoRecebimentoDefinitivoPage from "src/pages/PosRecebimento/DetalharTermoRecebimentoDefinitivoPage";
import {
  usuarioEhCronogramaOuCodae,
  usuarioEhDilogDiretoria,
  usuarioEhDilogQualidade,
  usuarioEhEmpresaFornecedor,
} from "src/helpers/utilities";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasPosRecebimento: Array<RotaInterface> = [
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.TERMO_RECEBIMENTO_DEFINITIVO}`,
    component: TermoRecebimentoDefinitivoPage,
    tipoUsuario:
      usuarioEhCronogramaOuCodae() ||
      usuarioEhDilogDiretoria() ||
      usuarioEhDilogQualidade(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO}`,
    component: CadastroTermoRecebimentoDefinitivoPage,
    tipoUsuario: usuarioEhCronogramaOuCodae(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO}`,
    component: DetalharTermoRecebimentoDefinitivoPage,
    tipoUsuario:
      usuarioEhCronogramaOuCodae() ||
      usuarioEhDilogDiretoria() ||
      usuarioEhDilogQualidade() ||
      usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.POS_RECEBIMENTO}/${constants.TERMO_RECEBIMENTO_DEFINITIVO_FORNECEDOR}`,
    component: TermoRecebimentoDefinitivoFornecedorPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
];
