import {
  usuarioEhAdmQualquerEmpresa,
  usuarioEhAdministradorCONTRATOS,
  usuarioEhAdministradorRepresentanteCodae,
  usuarioEhCODAEGabinete,
  usuarioEhCodaeDilog,
  usuarioEhCogestorDRE,
  usuarioEhCoordenadorCODAE,
  usuarioEhCoordenadorGpCODAE,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhDilogDiretoria,
  usuarioEhDiretorUE,
  usuarioEhGticCODAE,
  usuarioEhQualquerCODAE,
} from "helpers/utilities";

import AtualizacaoEmailEOLPage from "pages/Configuracoes/AtualizacaoEmailEOLPage";
import CargasUsuariosPage from "pages/Configuracoes/CargasUsuariosPage";
import CargasUsuariosServidoresPage from "pages/Configuracoes/CargasUsuariosServidoresPage";
import ConfigEmailPage from "pages/Configuracoes/ConfigEmailPage";
import GerenciamentoEmailsPage from "pages/Configuracoes/GerenciamentoEmailsPage";
import GestaoAcessoCodaeDilogPage from "pages/Configuracoes/GestaoAcessoCodaeDilogPage";
import GestaoAcessoCogestorPage from "pages/Configuracoes/GestaoAcessoCogestorPage";
import GestaoAcessoDiretorEscolaPage from "pages/Configuracoes/GestaoAcessoDiretorEscolaPage";
import GestaoAcessoEmpresaPage from "pages/Configuracoes/GestaoAcessoEmpresaPage";
import GestaoAcessoGeralPage from "pages/Configuracoes/GestaoAcessoGeralPage";
import GestaoAcessoMasterPage from "pages/Configuracoes/GestaoAcessoMasterPage";
import MensagemPage from "pages/Configuracoes/MensagemPage";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasConfiguracoes: Array<RotaInterface> = [
  {
    path: `/${constants.CONFIGURACOES}`,
    component: ConfigEmailPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/gerenciamento-emails`,
    component: GerenciamentoEmailsPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/mensagem`,
    component: MensagemPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.GESTAO_ACESSO_CODAE_DILOG}`,
    component: GestaoAcessoCodaeDilogPage,
    tipoUsuario: usuarioEhAdministradorRepresentanteCodae(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.GESTAO_ACESSO_MASTER}`,
    component: GestaoAcessoMasterPage,
    tipoUsuario:
      usuarioEhCoordenadorCODAE() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDilogDiretoria() ||
      usuarioEhGticCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.GESTAO_ACESSO_DIRETOR_ESCOLA}`,
    component: GestaoAcessoDiretorEscolaPage,
    tipoUsuario: usuarioEhDiretorUE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.GESTAO_ACESSO_EMPRESA}`,
    component: GestaoAcessoEmpresaPage,
    tipoUsuario:
      usuarioEhAdmQualquerEmpresa() || usuarioEhAdministradorCONTRATOS(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.GESTAO_ACESSO_COGESTOR}`,
    component: GestaoAcessoCogestorPage,
    tipoUsuario: usuarioEhCogestorDRE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.GESTAO_ACESSO_GERAL}`,
    component: GestaoAcessoGeralPage,
    tipoUsuario:
      usuarioEhCoordenadorNutriSupervisao() ||
      usuarioEhCoordenadorNutriCODAE() ||
      usuarioEhCoordenadorGpCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CARGAS_USUARIOS}`,
    component: CargasUsuariosPage,
    tipoUsuario:
      usuarioEhCoordenadorCODAE() ||
      usuarioEhCodaeDilog() ||
      usuarioEhGticCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CARGAS_USUARIOS_SERVIDORES}`,
    component: CargasUsuariosServidoresPage,
    tipoUsuario: usuarioEhAdministradorRepresentanteCodae(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.ATUALIZACAO_EMAIL_EOL}`,
    component: AtualizacaoEmailEOLPage,
    tipoUsuario:
      usuarioEhCoordenadorCODAE() ||
      usuarioEhCodaeDilog() ||
      usuarioEhGticCODAE(),
  },
];
