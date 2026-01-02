import {
  ehUsuarioRelatorios,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
  usuarioEhGticCODAE,
  usuarioEhMedicao,
  usuarioEhNutricionistaSupervisao,
} from "src/helpers/utilities";

import PainelPedidosAlteracaoDeCardapioCODAEPage from "src/pages/CODAE/AlteracaoDeCardapio/PainelPedidosPage";
import PainelPedidosInclusaoDeAlimentacaoCODAEPage from "src/pages/CODAE/InclusaoDeAlimentacao/PainelPedidosPage";
import PainelPedidosInversaoDiaCardapioCODAEPage from "src/pages/CODAE/InversaoDiaCardapio/PainelPedidosPage";
import PainelPedidosSolicitacaoUnificadaCODAEPage from "src/pages/CODAE/SolicitacaoUnificada/PainelPedidosPage";
import StatusSolicitacoesAutorizadasCODAEPage from "src/pages/CODAE/Solicitacoes/StatusSolicitacoesAutorizadasCODAEPage";
import StatusSolicitacoesCanceladasCODAEPage from "src/pages/CODAE/Solicitacoes/StatusSolicitacoesCanceladasCODAEPage";
import StatusSolicitacoesComQuestionamentosCODAEPage from "src/pages/CODAE/Solicitacoes/StatusSolicitacoesComQuestionamentosCODAEPage";
import StatusSolicitacoesPendentesCODAEPage from "src/pages/CODAE/Solicitacoes/StatusSolicitacoesPendentesCODAEPage";
import StatusSolicitacoesRecusadasCODAEPage from "src/pages/CODAE/Solicitacoes/StatusSolicitacoesRecusadasCODAEPage";
import CadastroKitLanchePage from "src/pages/Cadastros/CadastroKitLanchePage";
import { ConsultaKitLanchePage } from "src/pages/Cadastros/ConsultaKitLanchePage";
import PainelPedidosAlteracaoDeCardapioDREPage from "src/pages/DRE/AlteracaoDeCardapio/PainelPedidosPage";
import PainelPedidosInclusaoDeAlimentacaoDREPage from "src/pages/DRE/InclusaoDeAlimentacao/PainelPedidosPage";
import PainelPedidosInversaoDiaCardapioDREPage from "src/pages/DRE/InversaoDiaCardapio/PainelPedidosPage";
import { SolicitacaoUnificadaPage } from "src/pages/DRE/SolicitacaoUnificadaPage";
import StatusSolicitacoesAguardandoDREPage from "src/pages/DRE/Solicitacoes/StatusSolicitacoesAguardandoDREPage";
import StatusSolicitacoesAutorizadasDREPage from "src/pages/DRE/Solicitacoes/StatusSolicitacoesAutorizadasDREPage";
import StatusSolicitacoesCanceladasDREPage from "src/pages/DRE/Solicitacoes/StatusSolicitacoesCanceladasDREPage";
import StatusSolicitacoesPendentesDREPage from "src/pages/DRE/Solicitacoes/StatusSolicitacoesPendentesDREPage";
import StatusSolicitacoesRecusadasDREPage from "src/pages/DRE/Solicitacoes/StatusSolicitacoesRecusadasDREPage";
import { StatusSolicitacoesAutorizadasEscolaPage } from "src/pages/Escola/StatusSolicitacoes/StatusSolicitacoesAutorizadasEscolaPage";
import { StatusSolicitacoesCanceladasEscolaPage } from "src/pages/Escola/StatusSolicitacoes/StatusSolicitacoesCanceladasEscolaPage";
import { StatusSolicitacoesPendentesEscolaPage } from "src/pages/Escola/StatusSolicitacoes/StatusSolicitacoesPendentesEscolaPage";
import { StatusSolicitacoesRecusadasEscolaPage } from "src/pages/Escola/StatusSolicitacoes/StatusSolicitacoesRecusadasEscolaPage";
import * as RelatorioPageInversaoDiaCardapio from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import StatusSolicitacoesAutorizadasNutriManifestacaoPage from "src/pages/Nutricionista/Solicitacoes/StatusSolicitacoesAutorizadasNutriManifestacaoPage";
import StatusSolicitacoesAutorizadasNutrisupervisaoPage from "src/pages/Nutricionista/Solicitacoes/StatusSolicitacoesAutorizadasNutrisupervisaoPage";
import StatusSolicitacoesCanceladasNutriManifestacaoPage from "src/pages/Nutricionista/Solicitacoes/StatusSolicitacoesCanceladasNutriManifestacaoPage";
import StatusSolicitacoesCanceladasNutrisupervisaoPage from "src/pages/Nutricionista/Solicitacoes/StatusSolicitacoesCanceladasNutrisupervisaoPage";
import StatusSolicitacoesComQuestionamentosNutrisupervisaoPage from "src/pages/Nutricionista/Solicitacoes/StatusSolicitacoesComQuestionamentosNutrisupervisaoPage";
import StatusSolicitacoesPendentesNutrisupervisaoPage from "src/pages/Nutricionista/Solicitacoes/StatusSolicitacoesPendentesNutrisupervisaoPage";
import StatusSolicitacoesRecusadasNutriManifestacaoPage from "src/pages/Nutricionista/Solicitacoes/StatusSolicitacoesRecusadasNutriManifestacaoPage";
import StatusSolicitacoesRecusadasNutrisupervisaoPage from "src/pages/Nutricionista/Solicitacoes/StatusSolicitacoesRecusadasNutrisupervisaoPage";
import RelatorioAlunosMatriculadosPage from "src/pages/Relatorios/RelatorioAlunosMatriculadosPage";
import RelatorioSolicitacoesAlimentacaoPage from "src/pages/Relatorios/RelatorioSolicitacoesAlimentacaoPage";
import * as PainelPageKitLanche from "src/pages/SolicitacaoDeKitLanche/ContainerPage";
import PainelPedidosSuspensaoAlimentacaoCEIRelatorio from "src/pages/SuspensaoAlimentacaoCEI/RelatorioPage";
import { StatusQuestionamentosCodae } from "src/pages/Terceirizada/StatusSolicitacoes/StatusQuestionamentosCodae";
import { StatusSolicitacoesAutorizadasTerceirizadaPage } from "src/pages/Terceirizada/StatusSolicitacoes/StatusSolicitacoesAutorizadas";
import { StatusSolicitacoesCanceladasTerceirizadaPage } from "src/pages/Terceirizada/StatusSolicitacoes/StatusSolicitacoesCanceladasTerceirizada";
import { StatusSolicitacoesNegadasTerceirizadaPage } from "src/pages/Terceirizada/StatusSolicitacoes/StatusSolicitacoesNegadasTerceirizada";
import StatusSolicitacoesPendentesTerceirizadaPage from "src/pages/Terceirizada/StatusSolicitacoes/StatusSolicitacoesPendentes";
import PainelPedidosSuspensaoAlimentacao from "src/pages/Terceirizada/SuspensaoAlimentacao/PainelPedidosPage";
import PainelPedidosSuspensaoAlimentacaoRelatorio from "src/pages/Terceirizada/SuspensaoAlimentacao/RelatorioPage";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

import {
  alteracaoCardapio,
  inclusaoAlimentacao,
  painelGestaoAlimentacao,
  relatoriosAlteracaoDeCardapio,
  relatoriosAlteracaoDeCardapioCEMEI,
  relatoriosInclusaoDeAlimentacao,
  relatoriosInclusaoDeAlimentacaoCEMEI,
  relatoriosInversaoDiaCardapio,
  relatoriosSolicitacaoKitLanche,
  relatoriosSolicitacaoKitLancheCEMEI,
  relatoriosSolicitacaoUnificada,
  suspensaoAlimentacao,
} from "./helpers";

export const rotasGestaoDeAlimentacao: Array<RotaInterface> = [
  {
    path: "/painel-gestao-alimentacao",
    component: painelGestaoAlimentacao(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhDRE() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.INCLUSAO_ALIMENTACAO}`,
    component: inclusaoAlimentacao(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.INCLUSAO_ALIMENTACAO}/${constants.RELATORIO}`,
    component: relatoriosInclusaoDeAlimentacao(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.INCLUSAO_ALIMENTACAO_CEMEI}/${constants.RELATORIO}`,
    component: relatoriosInclusaoDeAlimentacaoCEMEI(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.ESCOLA}/${constants.ALTERACAO_TIPO_ALIMENTACAO}`,
    component: alteracaoCardapio(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.ALTERACAO_TIPO_ALIMENTACAO}/${constants.RELATORIO}`,
    component: relatoriosAlteracaoDeCardapio(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.ALTERACAO_TIPO_ALIMENTACAO_CEMEI}/${constants.RELATORIO}`,
    component: relatoriosAlteracaoDeCardapioCEMEI(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.ESCOLA}/${constants.SOLICITACAO_KIT_LANCHE}`,
    component: PainelPageKitLanche.PainelPedidosEscola,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.SOLICITACAO_KIT_LANCHE}/${constants.RELATORIO}`,
    component: relatoriosSolicitacaoKitLanche(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.SOLICITACAO_KIT_LANCHE_UNIFICADA}/${constants.RELATORIO}`,
    component: relatoriosSolicitacaoUnificada(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.SOLICITACAO_KIT_LANCHE_CEMEI}/${constants.RELATORIO}`,
    component: relatoriosSolicitacaoKitLancheCEMEI(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.ESCOLA}/${constants.INVERSAO_CARDAPIO}`,
    component: RelatorioPageInversaoDiaCardapio.InversaoDeDiaDeCardapioPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.INVERSAO_CARDAPIO}/${constants.RELATORIO}`,
    component: relatoriosInversaoDiaCardapio(),
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.ESCOLA}/${constants.SUSPENSAO_ALIMENTACAO}`,
    component: suspensaoAlimentacao(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.SUSPENSAO_ALIMENTACAO}/${constants.RELATORIO}`,
    component: PainelPedidosSuspensaoAlimentacaoRelatorio,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.SUSPENSAO_ALIMENTACAO_CEI}/${constants.RELATORIO}`,
    component: PainelPedidosSuspensaoAlimentacaoCEIRelatorio,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.ESCOLA}/${constants.SOLICITACOES_AUTORIZADAS}`,
    component: StatusSolicitacoesAutorizadasEscolaPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.SOLICITACOES_PENDENTES}`,
    component: StatusSolicitacoesPendentesEscolaPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.SOLICITACOES_CANCELADAS}`,
    component: StatusSolicitacoesCanceladasEscolaPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.SOLICITACOES_NEGADAS}`,
    component: StatusSolicitacoesRecusadasEscolaPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.DRE}/${constants.SOLICITACOES_AUTORIZADAS}`,
    component: StatusSolicitacoesAutorizadasDREPage,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.DRE}/${constants.SOLICITACOES_AGUARDADAS}`,
    component: StatusSolicitacoesAguardandoDREPage,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.DRE}/${constants.SOLICITACOES_PENDENTES}`,
    component: StatusSolicitacoesPendentesDREPage,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.DRE}/${constants.SOLICITACOES_NEGADAS}`,
    component: StatusSolicitacoesRecusadasDREPage,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.DRE}/${constants.SOLICITACOES_CANCELADAS}`,
    component: StatusSolicitacoesCanceladasDREPage,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.DRE}/${constants.INCLUSAO_ALIMENTACAO}`,
    component: PainelPedidosInclusaoDeAlimentacaoDREPage,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.DRE}/${constants.INVERSAO_CARDAPIO}`,
    component: PainelPedidosInversaoDiaCardapioDREPage,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.DRE}/${constants.SOLICITACAO_KIT_LANCHE}`,
    component: PainelPageKitLanche.PainelPedidosDRE,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.DRE}/${constants.SOLICITACAO_KIT_LANCHE_UNIFICADA}`,
    component: SolicitacaoUnificadaPage,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.DRE}/${constants.ALTERACAO_TIPO_ALIMENTACAO}`,
    component: PainelPedidosAlteracaoDeCardapioDREPage,
    tipoUsuario: usuarioEhDRE(),
  },
  {
    path: `/${constants.CODAE}/${constants.SOLICITACOES_AUTORIZADAS}`,
    component: StatusSolicitacoesAutorizadasCODAEPage,
    tipoUsuario:
      usuarioEhCODAEGestaoAlimentacao() || usuarioEhCODAENutriManifestacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.SOLICITACOES_PENDENTES}`,
    component: StatusSolicitacoesPendentesCODAEPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.SOLICITACOES_COM_QUESTIONAMENTO}`,
    component: StatusSolicitacoesComQuestionamentosCODAEPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao() || usuarioEhMedicao(),
  },
  {
    path: `/${constants.CODAE}/${constants.SOLICITACOES_NEGADAS}`,
    component: StatusSolicitacoesRecusadasCODAEPage,
    tipoUsuario:
      usuarioEhCODAEGestaoAlimentacao() || usuarioEhCODAENutriManifestacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.SOLICITACOES_CANCELADAS}`,
    component: StatusSolicitacoesCanceladasCODAEPage,
    tipoUsuario:
      usuarioEhCODAEGestaoAlimentacao() || usuarioEhCODAENutriManifestacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.INCLUSAO_ALIMENTACAO}`,
    component: PainelPedidosInclusaoDeAlimentacaoCODAEPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.ALTERACAO_TIPO_ALIMENTACAO}`,
    component: PainelPedidosAlteracaoDeCardapioCODAEPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.SOLICITACAO_KIT_LANCHE}`,
    component: PainelPageKitLanche.PainelPedidosCODAE,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.INVERSAO_CARDAPIO}`,
    component: PainelPedidosInversaoDiaCardapioCODAEPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.SOLICITACAO_KIT_LANCHE_UNIFICADA}`,
    component: PainelPedidosSolicitacaoUnificadaCODAEPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.CADASTROS}/${constants.CONSULTA_KITS}`,
    component: ConsultaKitLanchePage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.CADASTROS}/${constants.KITS}`,
    component: CadastroKitLanchePage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CODAE}/${constants.CADASTROS}/${constants.KITS}/:uuid/${constants.EDITAR}`,
    component: CadastroKitLanchePage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.NUTRISUPERVISAO}/${constants.SOLICITACOES_AUTORIZADAS}`,
    component: StatusSolicitacoesAutorizadasNutrisupervisaoPage,
    tipoUsuario: usuarioEhNutricionistaSupervisao(),
  },
  {
    path: `/${constants.NUTRISUPERVISAO}/${constants.SOLICITACOES_PENDENTES}`,
    component: StatusSolicitacoesPendentesNutrisupervisaoPage,
    tipoUsuario: usuarioEhNutricionistaSupervisao(),
  },
  {
    path: `/${constants.NUTRISUPERVISAO}/${constants.SOLICITACOES_NEGADAS}`,
    component: StatusSolicitacoesRecusadasNutrisupervisaoPage,
    tipoUsuario: usuarioEhNutricionistaSupervisao(),
  },
  {
    path: `/${constants.NUTRISUPERVISAO}/${constants.SOLICITACOES_CANCELADAS}`,
    component: StatusSolicitacoesCanceladasNutrisupervisaoPage,
    tipoUsuario: usuarioEhNutricionistaSupervisao(),
  },
  {
    path: `/${constants.NUTRISUPERVISAO}/${constants.SOLICITACOES_COM_QUESTIONAMENTO}`,
    component: StatusSolicitacoesComQuestionamentosNutrisupervisaoPage,
    tipoUsuario: usuarioEhNutricionistaSupervisao(),
  },
  {
    path: `/${constants.NUTRIMANIFESTACAO}/${constants.SOLICITACOES_AUTORIZADAS}`,
    component: StatusSolicitacoesAutorizadasNutriManifestacaoPage,
    tipoUsuario:
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.NUTRIMANIFESTACAO}/${constants.SOLICITACOES_NEGADAS}`,
    component: StatusSolicitacoesRecusadasNutriManifestacaoPage,
    tipoUsuario:
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.NUTRIMANIFESTACAO}/${constants.SOLICITACOES_CANCELADAS}`,
    component: StatusSolicitacoesCanceladasNutriManifestacaoPage,
    tipoUsuario:
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.SOLICITACOES_AUTORIZADAS}`,
    component: StatusSolicitacoesAutorizadasTerceirizadaPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.SOLICITACOES_COM_QUESTIONAMENTO}`,
    component: StatusQuestionamentosCodae,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.SOLICITACOES_PENDENTES}`,
    component: StatusSolicitacoesPendentesTerceirizadaPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.SOLICITACOES_NEGADAS}`,
    component: StatusSolicitacoesNegadasTerceirizadaPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.SOLICITACOES_CANCELADAS}`,
    component: StatusSolicitacoesCanceladasTerceirizadaPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.SUSPENSAO_ALIMENTACAO}`,
    component: PainelPedidosSuspensaoAlimentacao,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.RELATORIO_SOLICITACOES_ALIMENTACAO}`,
    component: RelatorioSolicitacoesAlimentacaoPage,
    tipoUsuario:
      usuarioEhDRE() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhMedicao() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhCODAEGabinete() ||
      ehUsuarioRelatorios() ||
      usuarioEhGticCODAE() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.RELATORIO_ALUNOS_MATRICULADOS}`,
    component: RelatorioAlunosMatriculadosPage,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhDRE() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete() ||
      ehUsuarioRelatorios() ||
      usuarioEhGticCODAE() ||
      usuarioEhDinutreDiretoria() ||
      usuarioEhEscolaTerceirizadaQualquerPerfil(),
  },
];
