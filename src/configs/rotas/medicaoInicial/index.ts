import {
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
  usuarioEhMedicao,
} from "helpers/utilities";
import { ListaOcorrenciasPage } from "pages/IMR/ListaOcorrenciasPage";
import { RegistrarNovaOcorrenciaPage } from "pages/IMR/RegistrarNovaOcorrenciaPage";
import { AcompanhamentoDeLancamentosPage } from "pages/LancamentoMedicaoInicial/AcompanhamentoDeLancamentosPage";
import { CadastroDeClausulasPage } from "pages/LancamentoMedicaoInicial/CadastroDeClausulasPage";
import { CadastroDeEmpenhoPage } from "pages/LancamentoMedicaoInicial/CadastroDeEmpenhoPage";
import { ClausulasParaDescontosPage } from "pages/LancamentoMedicaoInicial/ClausulasParaDescontosPage";
import { ConferenciaDosLancamentosPage } from "pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import { ControleDeFrequenciaPage } from "pages/LancamentoMedicaoInicial/ControleDeFrequenciaPage";
import { DetalhamentoDoLancamentoPage } from "pages/LancamentoMedicaoInicial/DetalhamentoDoLancamentoPage";
import { EditarClausulaPage } from "pages/LancamentoMedicaoInicial/EditarClausulaPage";
import { EditarEmpenhoPage } from "pages/LancamentoMedicaoInicial/EditarEmpenhoPage";
import { EmpenhosPage } from "pages/LancamentoMedicaoInicial/EmpenhosPage";
import { LancamentoMedicaoInicialPage } from "pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import { AdicionarParametrizacaoFinanceiraPage } from "pages/LancamentoMedicaoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceiraPage";
import { EditarParametrizacaoFinanceiraPage } from "pages/LancamentoMedicaoInicial/ParametrizacaoFinanceira/EditarParametrizacaoFinanceiraPage";
import { ParametrizacaoFinanceiraPage } from "pages/LancamentoMedicaoInicial/ParametrizacaoFinanceira/ParametrizacaoFinanceiraPage";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import { PeriodoLancamentoMedicaoInicialPage } from "pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import { RelatorioConsolidadoPage } from "pages/LancamentoMedicaoInicial/RelatorioConsolidado/RelatorioConsolidadoPage";
import { RelatorioFinanceiroPage } from "pages/LancamentoMedicaoInicial/RelatorioFinanceiro/RelatorioFinanceiroPage";
import { RelatorioAdesaoPage } from "pages/LancamentoMedicaoInicial/Relatorios/RelatorioAdesaoPage";
import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasMedicaoInicial: Array<RotaInterface> = [
  {
    path: `/${constants.LANCAMENTO_INICIAL}/${constants.LANCAMENTO_MEDICAO_INICIAL}`,
    component: LancamentoMedicaoInicialPage,
    tipoUsuario: usuarioEhEscolaTerceirizadaQualquerPerfil(),
  },
  {
    path: `/${constants.LANCAMENTO_INICIAL}/${constants.LANCAMENTO_MEDICAO_INICIAL}/${constants.PERIODO_LANCAMENTO}`,
    component: PeriodoLancamentoMedicaoInicialPage,
    tipoUsuario: usuarioEhEscolaTerceirizadaQualquerPerfil(),
  },
  {
    path: `/${constants.LANCAMENTO_INICIAL}/${constants.LANCAMENTO_MEDICAO_INICIAL}/${constants.PERIODO_LANCAMENTO_CEI}`,
    component: PeriodoLancamentoMedicaoInicialCEIPage,
    tipoUsuario: usuarioEhEscolaTerceirizadaQualquerPerfil(),
  },
  {
    path: `/${constants.LANCAMENTO_INICIAL}/${constants.LANCAMENTO_MEDICAO_INICIAL}/${constants.REGISTRAR_OCORRENCIAS}`,
    component: ListaOcorrenciasPage,
    tipoUsuario: usuarioEhEscolaTerceirizadaQualquerPerfil(),
  },
  {
    path: `/${constants.LANCAMENTO_INICIAL}/${constants.LANCAMENTO_MEDICAO_INICIAL}/${constants.REGISTRAR_OCORRENCIAS}/${constants.REGISTRAR_NOVA_OCORRENCIA}`,
    component: RegistrarNovaOcorrenciaPage,
    tipoUsuario: usuarioEhEscolaTerceirizadaQualquerPerfil(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.ACOMPANHAMENTO_DE_LANCAMENTOS}`,
    component: AcompanhamentoDeLancamentosPage,
    tipoUsuario:
      usuarioEhDRE() ||
      usuarioEhMedicao() ||
      usuarioEhEscolaTerceirizadaQualquerPerfil() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.CONFERENCIA_DOS_LANCAMENTOS}`,
    component: ConferenciaDosLancamentosPage,
    tipoUsuario:
      usuarioEhDRE() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.DETALHAMENTO_DO_LANCAMENTO}`,
    component: DetalhamentoDoLancamentoPage,
    tipoUsuario: usuarioEhEscolaTerceirizadaQualquerPerfil(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.EMPENHOS}`,
    component: EmpenhosPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.EMPENHOS}/${constants.CADASTRO_DE_EMPENHO}`,
    component: CadastroDeEmpenhoPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.EMPENHOS}/${constants.EDITAR_EMPENHO}`,
    component: EditarEmpenhoPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.CLAUSULAS_PARA_DESCONTOS}`,
    component: ClausulasParaDescontosPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.PARAMETRIZACAO_FINANCEIRA}`,
    component: ParametrizacaoFinanceiraPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.PARAMETRIZACAO_FINANCEIRA}/${constants.ADICIONAR_PARAMETRIZACAO_FINANCEIRA}`,
    component: AdicionarParametrizacaoFinanceiraPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.PARAMETRIZACAO_FINANCEIRA}/${constants.EDITAR_PARAMETRIZACAO_FINANCEIRA}`,
    component: EditarParametrizacaoFinanceiraPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.CLAUSULAS_PARA_DESCONTOS}/${constants.CADASTRO_DE_CLAUSULA}`,
    component: CadastroDeClausulasPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.CLAUSULAS_PARA_DESCONTOS}/${constants.EDITAR_CLAUSULA}`,
    component: EditarClausulaPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.CONTROLE_DE_FREQUENCIA}`,
    component: ControleDeFrequenciaPage,
    tipoUsuario: usuarioEhEscolaTerceirizadaQualquerPerfil(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.RELATORIOS}/${constants.RELATORIO_ADESAO}`,
    component: RelatorioAdesaoPage,
    tipoUsuario:
      usuarioEhMedicao() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhDRE() ||
      usuarioEhEscolaTerceirizadaQualquerPerfil() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.RELATORIO_FINANCEIRO}`,
    component: RelatorioFinanceiroPage,
    tipoUsuario: usuarioEhMedicao(),
  },
  {
    path: `/${constants.MEDICAO_INICIAL}/${constants.RELATORIO_FINANCEIRO}/${constants.RELATORIO_CONSOLIDADO}`,
    component: RelatorioConsolidadoPage,
    tipoUsuario: usuarioEhMedicao(),
  },
];
