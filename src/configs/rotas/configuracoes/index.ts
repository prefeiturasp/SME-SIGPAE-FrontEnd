import {
  usuarioEhAdmQualquerEmpresa,
  usuarioEhAdministradorCONTRATOS,
  usuarioEhAdministradorGpCODAE,
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
} from "src/helpers/utilities";

import AtualizacaoEmailEOLPage from "src/pages/Configuracoes/AtualizacaoEmailEOLPage";
import CargasUsuariosPage from "src/pages/Configuracoes/CargasUsuariosPage";
import CargasUsuariosServidoresPage from "src/pages/Configuracoes/CargasUsuariosServidoresPage";
import ConfigEmailPage from "src/pages/Configuracoes/ConfigEmailPage";
import GerenciamentoEmailsPage from "src/pages/Configuracoes/GerenciamentoEmailsPage";
import GestaoAcessoCodaeDilogPage from "src/pages/Configuracoes/GestaoAcessoCodaeDilogPage";
import GestaoAcessoCogestorPage from "src/pages/Configuracoes/GestaoAcessoCogestorPage";
import GestaoAcessoDiretorEscolaPage from "src/pages/Configuracoes/GestaoAcessoDiretorEscolaPage";
import GestaoAcessoEmpresaPage from "src/pages/Configuracoes/GestaoAcessoEmpresaPage";
import GestaoAcessoGeralPage from "src/pages/Configuracoes/GestaoAcessoGeralPage";
import GestaoAcessoMasterPage from "src/pages/Configuracoes/GestaoAcessoMasterPage";

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
      usuarioEhCoordenadorGpCODAE() ||
      usuarioEhAdministradorGpCODAE(),
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
      usuarioEhGticCODAE() ||
      usuarioEhCogestorDRE(),
  },
];
