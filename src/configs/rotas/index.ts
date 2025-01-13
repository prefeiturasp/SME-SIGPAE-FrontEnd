import * as constants from "configs/constants.js";

import { Login } from "components/Login";
import CentralDownloadsPage from "pages/CentralDownloads/CentralDownloadsPage";
import FaqPage from "pages/Faq/FaqPage";
import NotificacoesPage from "pages/Notificacoes/NotificacoesPage";
import PainelInicialPage from "pages/PainelInicial/PainelInicialPage";
import PerfilPage from "pages/Perfil/PerfilPage";

import { rotasAbastecimento } from "../rotas/abastecimento";
import { rotasCadastros } from "../rotas/cadastros";
import { rotasConfiguracoes } from "../rotas/configuracoes";
import { rotasDietaEspecial } from "../rotas/dietaEspecial";
import { rotasGestaoDeAlimentacao } from "../rotas/gestaoDeAlimentacao";
import { rotasGestaoDeProdutos } from "../rotas/gestaoDeProdutos";
import { rotasMedicaoInicial } from "../rotas/medicaoInicial";
import { rotasPreRecebimento } from "../rotas/preRecebimento";
import { rotasRecebimento } from "../rotas/recebimento";
import { rotasSupervisao } from "../rotas/supervisao";

export let rotas = [
  {
    path: "/",
    component: PainelInicialPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: "/login",
    component: Login,
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
];

rotas = rotas.concat(rotasGestaoDeAlimentacao);
rotas = rotas.concat(rotasDietaEspecial);
rotas = rotas.concat(rotasGestaoDeProdutos);
rotas = rotas.concat(rotasMedicaoInicial);
rotas = rotas.concat(rotasSupervisao);
rotas = rotas.concat(rotasAbastecimento);
rotas = rotas.concat(rotasPreRecebimento);
rotas = rotas.concat(rotasRecebimento);
rotas = rotas.concat(rotasCadastros);
rotas = rotas.concat(rotasConfiguracoes);
