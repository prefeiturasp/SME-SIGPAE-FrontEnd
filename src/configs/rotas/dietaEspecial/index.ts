import {
  ehUsuarioRelatorios,
  usuarioEhAdministradorNutriCODAE,
  usuarioEhCODAEDietaEspecial,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhDRE,
  usuarioEhDinutreDiretoria,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhGticCODAE,
  usuarioEhMedicao,
  usuarioEhNutricionistaSupervisao,
  usuarioEscolaEhGestaoDireta,
  usuarioEscolaEhGestaoParceira,
  usuarioEhCoordenadorCODAE,
  usuarioEhEscola,
} from "helpers/utilities";
import {
  StatusSolicitacoesDietaEspecial,
  dashBoardDietaEspecial,
  relatoriosDietaEspecial,
} from "./helpers";

import { CancelamentoDietaPage } from "pages/DietaEspecial/CancelamentoDietaPage";
import ConsultaProtocoloPadraoDietaEspecial from "pages/DietaEspecial/ConsultaProtocoloPadraoDietaEspecial.jsx";
import CriarCopiaProtocoloPadraoDieta from "pages/DietaEspecial/CriarCopiaProtocoloPadraoDieta";
import { DietaEspecialAluno } from "pages/DietaEspecial/DashboardDietaEspecialPage";
import EditaProtocoloPadraoDieta from "pages/DietaEspecial/EditaProtocoloPadraoDieta";
import ProtocoloPadraoDietaEspecialPage from "pages/DietaEspecial/ProtocoloPadraoDietaEspecialPage.jsx";
import RelatorioAlunosDietasAtivasInativasPage from "pages/DietaEspecial/RelatorioAlunosDietasAtivasInativasPage.jsx";
import RelatorioDietasAutorizadas from "pages/DietaEspecial/RelatorioDietasAutorizadas";
import RelatorioDietasCanceladas from "pages/DietaEspecial/RelatorioDietasCanceladas";
import RelatorioHistoricoDietasPage from "pages/DietaEspecial/RelatorioHistoricoDietasPage";
import RelatorioGerencialDietas from "pages/DietaEspecial/RelatorioGerencialDietas.jsx";
import RelatorioGestaoDietaEspecial from "pages/DietaEspecial/RelatorioGestaoDietaEspecial";
import RelatorioQuantitativoClassificacaoDietaEspPage from "pages/DietaEspecial/RelatorioQuantitativoClassificacaoDietaEspPage";
import RelatorioQuantitativoDiagDietaEspPage from "pages/DietaEspecial/RelatorioQuantitativoDiagDietaEspPage";
import RelatorioQuantitativoSolicDietaEspPage from "pages/DietaEspecial/RelatorioQuantitativoSolicDietaEspPage";
import { AlteracaoUEPage } from "pages/Escola/DietaEspecial/AlteracaoUEPage";
import { DietaEspecialEscolaPage } from "pages/Escola/DietaEspecial/DietaEspecialEscolaPage";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasDietaEspecial: Array<RotaInterface> = [
  {
    path: `/painel-dieta-especial`,
    component: dashBoardDietaEspecial(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhDRE() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhMedicao() ||
      usuarioEscolaEhGestaoDireta() ||
      usuarioEscolaEhGestaoParceira() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.SOLICITACOES_DIETA_ESPECIAL}/${constants.SOLICITACOES_PENDENTES}`,
    component: StatusSolicitacoesDietaEspecial(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhDRE() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.SOLICITACOES_DIETA_ESPECIAL}/${constants.SOLICITACOES_NEGADAS}`,
    component: StatusSolicitacoesDietaEspecial(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhDRE() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.SOLICITACOES_DIETA_ESPECIAL}/${constants.SOLICITACOES_AUTORIZADAS}`,
    component: StatusSolicitacoesDietaEspecial(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhDRE() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.SOLICITACOES_DIETA_ESPECIAL}/${constants.SOLICITACOES_CANCELADAS}`,
    component: StatusSolicitacoesDietaEspecial(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.SOLICITACOES_DIETA_ESPECIAL}/${constants.SOLICITACOES_AUTORIZADAS_TEMPORARIAMENTE}`,
    component: StatusSolicitacoesDietaEspecial(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.SOLICITACOES_DIETA_ESPECIAL}/${constants.SOLICITACOES_AGUARDANDO_INICIO_VIGENCIA}`,
    component: StatusSolicitacoesDietaEspecial(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.SOLICITACOES_DIETA_ESPECIAL}/${constants.SOLICITACOES_INATIVAS}`,
    component: StatusSolicitacoesDietaEspecial(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.SOLICITACOES_DIETA_ESPECIAL}/${constants.SOLICITACOES_INATIVAS_TEMPORARIAMENTE}`,
    component: StatusSolicitacoesDietaEspecial(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.ALUNO}/${constants.DIETA_ESPECIAL}`,
    component: DietaEspecialAluno,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO}`,
    component: relatoriosDietaEspecial(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/ativas-inativas`,
    component: RelatorioAlunosDietasAtivasInativasPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.ESCOLA}/${constants.DIETA_ESPECIAL}`,
    component: DietaEspecialEscolaPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEscolaEhGestaoDireta() ||
      usuarioEscolaEhGestaoParceira(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.CANCELAMENTO}`,
    component: CancelamentoDietaPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEscolaEhGestaoDireta() ||
      usuarioEscolaEhGestaoParceira(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.DIETA_ESPECIAL_ALTERACAO_UE}`,
    component: AlteracaoUEPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEscolaEhGestaoDireta() ||
      usuarioEscolaEhGestaoParceira(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP}`,
    component: RelatorioQuantitativoSolicDietaEspPage,
    tipoUsuario:
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhDRE() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO_QUANTITATIVO_CLASSIFICACAO_DIETA_ESP}`,
    component: RelatorioQuantitativoClassificacaoDietaEspPage,
    tipoUsuario:
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhDRE() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO_QUANTITATIVO_DIAG_DIETA_ESP}`,
    component: RelatorioQuantitativoDiagDietaEspPage,
    tipoUsuario:
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhDRE() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO_DIETAS_AUTORIZADAS}`,
    component: RelatorioDietasAutorizadas,
    tipoUsuario:
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhDRE() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhAdministradorNutriCODAE() ||
      usuarioEhCoordenadorNutriSupervisao() ||
      usuarioEhAdministradorNutriCODAE() ||
      usuarioEhCoordenadorNutriCODAE() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhEmpresaTerceirizada() ||
      ehUsuarioRelatorios() ||
      usuarioEhGticCODAE() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO_DIETAS_CANCELADAS}`,
    component: RelatorioDietasCanceladas,
    tipoUsuario:
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhDRE() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhAdministradorNutriCODAE() ||
      usuarioEhCoordenadorNutriSupervisao() ||
      usuarioEhAdministradorNutriCODAE() ||
      usuarioEhCoordenadorNutriCODAE() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhEmpresaTerceirizada() ||
      ehUsuarioRelatorios() ||
      usuarioEhGticCODAE() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO_GERENCIAL_DIETAS}`,
    component: RelatorioGerencialDietas,
    tipoUsuario:
      usuarioEhAdministradorNutriCODAE() ||
      usuarioEhCoordenadorNutriCODAE() ||
      ehUsuarioRelatorios() ||
      usuarioEhGticCODAE(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO_GESTAO_DIETA_ESPECIAL}`,
    component: RelatorioGestaoDietaEspecial,
    tipoUsuario:
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhDRE() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      ehUsuarioRelatorios() ||
      usuarioEhGticCODAE(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.PROTOCOLO_PADRAO_DIETA}`,
    component: ProtocoloPadraoDietaEspecialPage,
    tipoUsuario: usuarioEhCODAEDietaEspecial(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.CONSULTA_PROTOCOLO_PADRAO_DIETA}`,
    component: ConsultaProtocoloPadraoDietaEspecial,
    tipoUsuario: usuarioEhCODAEDietaEspecial(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/protocolo-padrao/:uuid/editar`,
    component: EditaProtocoloPadraoDieta,
    tipoUsuario: usuarioEhCODAEDietaEspecial(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/protocolo-padrao/:uuid/criar-copia`,
    component: CriarCopiaProtocoloPadraoDieta,
    tipoUsuario: usuarioEhCODAEDietaEspecial(),
  },
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO_HISTORICO_DIETAS}`,
    component: RelatorioHistoricoDietasPage,
    tipoUsuario:
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEscola() ||
      usuarioEhDRE() ||
      usuarioEhCoordenadorCODAE() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCoordenadorNutriSupervisao() ||
      usuarioEhAdministradorNutriCODAE() ||
      usuarioEhCoordenadorNutriCODAE() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhEmpresaTerceirizada() ||
      ehUsuarioRelatorios() ||
      usuarioEhDinutreDiretoria(),
  },
];
