import { TIPO_PERFIL } from "src/constants/shared";
import * as DashBoardDietaEspecial from "src/pages/DietaEspecial/DashboardDietaEspecialPage";
import * as RelatoriosDietaEspecial from "src/pages/DietaEspecial/RelatorioPage";
import * as StatusSolicitacoesDietaEspecialPage from "src/pages/DietaEspecial/StatusSolicitacoesPage";
export const dashBoardDietaEspecial = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return DashBoardDietaEspecial.DietaEspecialDRE;
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
    case TIPO_PERFIL.SUPERVISAO_NUTRICAO:
    case TIPO_PERFIL.DIETA_ESPECIAL:
    case TIPO_PERFIL.NUTRICAO_MANIFESTACAO:
    case TIPO_PERFIL.MEDICAO:
    case TIPO_PERFIL.CODAE_GABINETE:
    case TIPO_PERFIL.DINUTRE:
      return DashBoardDietaEspecial.DietaEspecialCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return DashBoardDietaEspecial.DietaEspecialTerceirizada;
    default:
      return DashBoardDietaEspecial.DietaEspecialEscola;
  }
};
export const StatusSolicitacoesDietaEspecial = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return StatusSolicitacoesDietaEspecialPage.SolicitacoesDietaEspecialDRE;
    case TIPO_PERFIL.DIETA_ESPECIAL:
    case TIPO_PERFIL.SUPERVISAO_NUTRICAO:
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
    case TIPO_PERFIL.NUTRICAO_MANIFESTACAO:
    case TIPO_PERFIL.CODAE_GABINETE:
    case TIPO_PERFIL.DINUTRE:
      return StatusSolicitacoesDietaEspecialPage.SolicitacoesDietaEspecialCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return StatusSolicitacoesDietaEspecialPage.SolicitacoesDietaEspecialTerceirizada;
    default:
      return StatusSolicitacoesDietaEspecialPage.SolicitacoesDietaEspecialEscola;
  }
};
export const relatoriosDietaEspecial = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
    case TIPO_PERFIL.NUTRICAO_MANIFESTACAO:
    case TIPO_PERFIL.CODAE_GABINETE:
    case TIPO_PERFIL.DINUTRE:
      return RelatoriosDietaEspecial.RelatorioEscola;
    case TIPO_PERFIL.DIETA_ESPECIAL:
      return RelatoriosDietaEspecial.RelatorioCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return RelatoriosDietaEspecial.RelatorioTerceirizada;
    default:
      return RelatoriosDietaEspecial.RelatorioEscola;
  }
};
