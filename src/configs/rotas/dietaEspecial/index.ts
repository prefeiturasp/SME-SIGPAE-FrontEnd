import {
  ehUsuarioRelatorios,
  usuarioEhAdministradorNutriCODAE,
  usuarioEhCODAEDietaEspecial,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhCogestorDRE,
  usuarioEhCoordenadorCODAE,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhDRE,
  usuarioEhDinutreDiretoria,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscola,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhGticCODAE,
  usuarioEhMedicao,
  usuarioEhNutricionistaSupervisao,
  usuarioEscolaEhGestaoDireta,
  usuarioEscolaEhGestaoParceira,
} from "src/helpers/utilities";
import {
  StatusSolicitacoesDietaEspecial,
  dashBoardDietaEspecial,
  relatoriosDietaEspecial,
} from "./helpers";

import { CancelamentoDietaPage } from "src/pages/DietaEspecial/CancelamentoDietaPage";
import ConsultaProtocoloPadraoDietaEspecial from "src/pages/DietaEspecial/ConsultaProtocoloPadraoDietaEspecial.jsx";
import CriarCopiaProtocoloPadraoDieta from "src/pages/DietaEspecial/CriarCopiaProtocoloPadraoDieta";
import { DietaEspecialAluno } from "src/pages/DietaEspecial/DashboardDietaEspecialPage";
import EditaProtocoloPadraoDieta from "src/pages/DietaEspecial/EditaProtocoloPadraoDieta";
import ProtocoloPadraoDietaEspecialPage from "src/pages/DietaEspecial/ProtocoloPadraoDietaEspecialPage.jsx";
import RelatorioAlunosDietasAtivasInativasPage from "src/pages/DietaEspecial/RelatorioAlunosDietasAtivasInativasPage.jsx";
import { RelatorioDietasAutorizadasPage } from "src/pages/DietaEspecial/RelatorioDietasAutorizadas";
import RelatorioDietasCanceladas from "src/pages/DietaEspecial/RelatorioDietasCanceladas";
import RelatorioGerencialDietas from "src/pages/DietaEspecial/RelatorioGerencialDietas.jsx";
import RelatorioGestaoDietaEspecial from "src/pages/DietaEspecial/RelatorioGestaoDietaEspecial";
import RelatorioHistoricoDietasPage from "src/pages/DietaEspecial/RelatorioHistoricoDietasPage";
import RelatorioQuantitativoClassificacaoDietaEspPage from "src/pages/DietaEspecial/RelatorioQuantitativoClassificacaoDietaEspPage";
import RelatorioQuantitativoDiagDietaEspPage from "src/pages/DietaEspecial/RelatorioQuantitativoDiagDietaEspPage";
import RelatorioQuantitativoSolicDietaEspPage from "src/pages/DietaEspecial/RelatorioQuantitativoSolicDietaEspPage";
import { RelatorioRecreioFeriasPage } from "src/pages/DietaEspecial/RelatorioRecreioFeriasPage";
import { AlteracaoUEPage } from "src/pages/Escola/DietaEspecial/AlteracaoUEPage";
import { DietaEspecialEscolaPage } from "src/pages/Escola/DietaEspecial/DietaEspecialEscolaPage";

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
    component: RelatorioDietasAutorizadasPage,
    tipoUsuario:
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhDRE() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
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
  {
    path: `/${constants.DIETA_ESPECIAL}/${constants.RELATORIO_RECREIO_NAS_FERIAS}`,
    component: RelatorioRecreioFeriasPage,
    tipoUsuario:
      usuarioEhEscola() ||
      usuarioEhCogestorDRE() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhAdministradorNutriCODAE() ||
      usuarioEhCoordenadorNutriCODAE() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhDinutreDiretoria() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete(),
  },
];
