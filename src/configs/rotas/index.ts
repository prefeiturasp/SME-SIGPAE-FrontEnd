import * as constants from "src/configs/constants";

import CentralDownloadsPage from "src/pages/CentralDownloads/CentralDownloadsPage";
import FaqPage from "src/pages/Faq/FaqPage";
import NotificacoesPage from "src/pages/Notificacoes/NotificacoesPage";
import PainelInicialPage from "src/pages/PainelInicial/PainelInicialPage";
import PerfilPage from "src/pages/Perfil/PerfilPage";

import { rotasAbastecimento } from "../rotas/abastecimento";
import { rotasCadastros } from "../rotas/cadastros";
import { rotasConfiguracoes } from "../rotas/configuracoes";
import { rotasDietaEspecial } from "../rotas/dietaEspecial";
import { rotasGestaoDeAlimentacao } from "../rotas/gestaoDeAlimentacao";
import { rotasGestaoDeProdutos } from "../rotas/gestaoDeProdutos";
import { rotasMedicaoInicial } from "../rotas/medicaoInicial";
import { rotasPreRecebimento } from "../rotas/preRecebimento";
import { rotasPosRecebimento } from "../rotas/posRecebimento";
import { rotasRecebimento } from "../rotas/recebimento";
import { rotasSupervisao } from "../rotas/supervisao";
import { rotasFaq } from "./Faq";

export const rotas = [
  {
    path: "/",
    component: PainelInicialPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: "/perfil",
    component: PerfilPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/ajuda`,
    component: FaqPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.NOTIFICACOES}`,
    component: NotificacoesPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.CENTRAL_DOWNLOADS}`,
    component: CentralDownloadsPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
]
  .concat(rotasGestaoDeAlimentacao)
  .concat(rotasDietaEspecial)
  .concat(rotasGestaoDeProdutos)
  .concat(rotasMedicaoInicial)
  .concat(rotasSupervisao)
  .concat(rotasAbastecimento)
  .concat(rotasPreRecebimento)
  .concat(rotasPosRecebimento)
  .concat(rotasRecebimento)
  .concat(rotasCadastros)
  .concat(rotasConfiguracoes)
  .concat(rotasFaq);
