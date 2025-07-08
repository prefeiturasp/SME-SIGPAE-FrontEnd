import { TIPO_PERFIL } from "src/constants/shared";
import { escolaEhCei, escolaEhCEMEI } from "src/helpers/utilities";
import * as RelatoriosAlteracaoDeCardapio from "src/pages/AlteracaoDeCardapio/RelatorioPage";
import * as RelatoriosAlteracaoDeCardapioCEMEI from "src/pages/AlteracaoDeCardapioCEMEIRelatorios";
import DashboardCODAEPage from "src/pages/CODAE/DashboardCODAEPage";
import DashboardDREPage from "src/pages/DRE/DashboardDREPage";
import { AlteracaoDeCardapioCEIPage } from "src/pages/Escola/AlteracaoDeCardapioCEIPage";
import { AlteracaoDeCardapioCEMEIPage } from "src/pages/Escola/AlteracaoDeCardapioCEMEIPage";
import AlteracaoDeCardapioPage from "src/pages/Escola/AlteracaoDeCardapioPage";
import DashboardEscolaPage from "src/pages/Escola/DashboardEscolaPage";
import { InclusaoDeAlimentacaoCEIPage } from "src/pages/Escola/InclusaoDeAlimentacaoCEIPage";
import { InclusaoDeAlimentacaoCEMEIPage } from "src/pages/Escola/InclusaoDeAlimentacaoCEMEIPage";
import InclusaoDeAlimentacaoPage from "src/pages/Escola/InclusaoDeAlimentacaoPage";
import SuspensaoDeAlimentacaoDeCEI from "src/pages/Escola/SuspensaoDeAlimentacaoDeCEIPage";
import SuspensaoDeAlimentacaoPage from "src/pages/Escola/SuspensaoDeAlimentacaoPage";
import * as RelatoriosInclusaoDeAlimentacao from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import * as RelatoriosInclusaoDeAlimentacaoCEMEI from "src/pages/InclusaoDeAlimentacaoCEMEIRelatorios";
import * as RelatoriosInversaoDiaCardapio from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import DashboardNutricionistaGAPage from "src/pages/Nutricionista/DashboardNutricionistaGAPage";
import DashboardNutriManifestacaoPage from "src/pages/Nutricionista/DashboardNutriManifestacaoPage";
import * as RelatoriosSolicitacaoKitLanche from "src/pages/SolicitacaoDeKitLanche/RelatorioPage";
import * as RelatorioSolicitacaoKitLancheCEMEI from "src/pages/SolicitacaoDeKitLancheCEMEI/RelatorioPage";
import * as RelatoriosSolicitacaoUnificada from "src/pages/SolicitacaoUnificada/RelatoriosPage";
import DashboardTerceirizadaPage from "src/pages/Terceirizada/DashboardTerceirizadaPage";

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
