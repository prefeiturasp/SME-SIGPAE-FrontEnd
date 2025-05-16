import { TIPO_PERFIL } from "constants/shared";
import { escolaEhCei, escolaEhCEMEI } from "helpers/utilities";
import * as RelatoriosAlteracaoDeCardapio from "pages/AlteracaoDeCardapio/RelatorioPage";
import * as RelatoriosAlteracaoDeCardapioCEMEI from "pages/AlteracaoDeCardapioCEMEIRelatorios";
import DashboardCODAEPage from "pages/CODAE/DashboardCODAEPage";
import DashboardDREPage from "pages/DRE/DashboardDREPage";
import { AlteracaoDeCardapioCEIPage } from "pages/Escola/AlteracaoDeCardapioCEIPage";
import { AlteracaoDeCardapioCEMEIPage } from "pages/Escola/AlteracaoDeCardapioCEMEIPage";
import AlteracaoDeCardapioPage from "pages/Escola/AlteracaoDeCardapioPage";
import DashboardEscolaPage from "pages/Escola/DashboardEscolaPage";
import InclusaoDeAlimentacaoCEIPage from "pages/Escola/InclusaoDeAlimentacaoCEIPage";
import InclusaoDeAlimentacaoCEMEIPage from "pages/Escola/InclusaoDeAlimentacaoCEMEIPage";
import InclusaoDeAlimentacaoPage from "pages/Escola/InclusaoDeAlimentacaoPage";
import SuspensaoDeAlimentacaoDeCEI from "pages/Escola/SuspensaoDeAlimentacaoDeCEIPage";
import SuspensaoDeAlimentacaoPage from "pages/Escola/SuspensaoDeAlimentacaoPage";
import * as RelatoriosInclusaoDeAlimentacao from "pages/InclusaoDeAlimentacao/RelatorioPage";
import * as RelatoriosInclusaoDeAlimentacaoCEMEI from "pages/InclusaoDeAlimentacaoCEMEIRelatorios";
import * as RelatoriosInversaoDiaCardapio from "pages/InversaoDeDiaDeCardapio/RelatorioPage";
import DashboardNutricionistaGAPage from "pages/Nutricionista/DashboardNutricionistaGAPage";
import DashboardNutriManifestacaoPage from "pages/Nutricionista/DashboardNutriManifestacaoPage";
import * as RelatoriosSolicitacaoKitLanche from "pages/SolicitacaoDeKitLanche/RelatorioPage";
import * as RelatorioSolicitacaoKitLancheCEMEI from "pages/SolicitacaoDeKitLancheCEMEI/RelatorioPage";
import * as RelatoriosSolicitacaoUnificada from "pages/SolicitacaoUnificada/RelatoriosPage";
import DashboardTerceirizadaPage from "pages/Terceirizada/DashboardTerceirizadaPage";

export const painelGestaoAlimentacao = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return DashboardDREPage;
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
      return DashboardCODAEPage;
    case TIPO_PERFIL.TERCEIRIZADA:
      return DashboardTerceirizadaPage;
    case TIPO_PERFIL.SUPERVISAO_NUTRICAO:
      return DashboardNutricionistaGAPage;
    case TIPO_PERFIL.NUTRICAO_MANIFESTACAO:
    case TIPO_PERFIL.MEDICAO:
    case TIPO_PERFIL.CODAE_GABINETE:
    case TIPO_PERFIL.DINUTRE:
      return DashboardNutriManifestacaoPage;
    default:
      return DashboardEscolaPage;
  }
};

export const inclusaoAlimentacao = () => {
  return escolaEhCei()
    ? InclusaoDeAlimentacaoCEIPage
    : escolaEhCEMEI()
    ? InclusaoDeAlimentacaoCEMEIPage
    : InclusaoDeAlimentacaoPage;
};

export const relatoriosInclusaoDeAlimentacao = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return RelatoriosInclusaoDeAlimentacao.RelatorioDRE;
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
      return RelatoriosInclusaoDeAlimentacao.RelatorioCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return RelatoriosInclusaoDeAlimentacao.RelatorioTerceirizada;
    default:
      return RelatoriosInclusaoDeAlimentacao.RelatorioEscola;
  }
};

export const relatoriosInclusaoDeAlimentacaoCEMEI = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return RelatoriosInclusaoDeAlimentacaoCEMEI.RelatorioDRE;
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
      return RelatoriosInclusaoDeAlimentacaoCEMEI.RelatorioCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return RelatoriosInclusaoDeAlimentacaoCEMEI.RelatorioTerceirizada;
    default:
      return RelatoriosInclusaoDeAlimentacaoCEMEI.RelatorioEscola;
  }
};

export const alteracaoCardapio = () => {
  return escolaEhCei()
    ? AlteracaoDeCardapioCEIPage
    : escolaEhCEMEI()
    ? AlteracaoDeCardapioCEMEIPage
    : AlteracaoDeCardapioPage;
};

export const relatoriosAlteracaoDeCardapio = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return RelatoriosAlteracaoDeCardapio.RelatorioDRE;
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
      return RelatoriosAlteracaoDeCardapio.RelatorioCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return RelatoriosAlteracaoDeCardapio.RelatorioTerceirizada;
    default:
      return RelatoriosAlteracaoDeCardapio.RelatorioEscola;
  }
};

export const relatoriosAlteracaoDeCardapioCEMEI = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return RelatoriosAlteracaoDeCardapioCEMEI.RelatorioDRE;
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
      return RelatoriosAlteracaoDeCardapioCEMEI.RelatorioCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return RelatoriosAlteracaoDeCardapioCEMEI.RelatorioTerceirizada;
    default:
      return RelatoriosAlteracaoDeCardapioCEMEI.RelatorioEscola;
  }
};

export const relatoriosSolicitacaoKitLanche = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return RelatoriosSolicitacaoKitLanche.RelatorioDRE;
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
      return RelatoriosSolicitacaoKitLanche.RelatorioCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return RelatoriosSolicitacaoKitLanche.RelatorioTerceirizada;
    default:
      return RelatoriosSolicitacaoKitLanche.RelatorioEscola;
  }
};

export const relatoriosSolicitacaoKitLancheCEMEI = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return RelatorioSolicitacaoKitLancheCEMEI.RelatorioDRE;
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
      return RelatorioSolicitacaoKitLancheCEMEI.RelatorioCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return RelatorioSolicitacaoKitLancheCEMEI.RelatorioTerceirizada;
    default:
      return RelatorioSolicitacaoKitLancheCEMEI.RelatorioEscola;
  }
};

export const relatoriosSolicitacaoUnificada = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
      return RelatoriosSolicitacaoUnificada.RelatorioCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return RelatoriosSolicitacaoUnificada.RelatorioTerceirizada;
    case TIPO_PERFIL.ESCOLA:
      return RelatoriosSolicitacaoUnificada.RelatorioEscola;
    default:
      return RelatoriosSolicitacaoUnificada.RelatorioDRE;
  }
};

export const relatoriosInversaoDiaCardapio = () => {
  switch (localStorage.getItem("tipo_perfil")) {
    case TIPO_PERFIL.DIRETORIA_REGIONAL:
      return RelatoriosInversaoDiaCardapio.RelatorioDRE;
    case TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA:
      return RelatoriosInversaoDiaCardapio.RelatorioCODAE;
    case TIPO_PERFIL.TERCEIRIZADA:
      return RelatoriosInversaoDiaCardapio.RelatorioTerceirizada;
    default:
      return RelatoriosInversaoDiaCardapio.RelatorioEscola;
  }
};

export const suspensaoAlimentacao = () => {
  return escolaEhCei()
    ? SuspensaoDeAlimentacaoDeCEI
    : SuspensaoDeAlimentacaoPage;
};
