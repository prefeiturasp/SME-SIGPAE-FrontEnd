import {
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhMedicao,
  usuarioEhNutricionistaSupervisao,
} from "helpers/utilities";
import PainelPedidosAlteracaoDeCardapioCODAEPage from "pages/CODAE/AlteracaoDeCardapio/PainelPedidosPage";
import PainelPedidosInclusaoDeAlimentacaoCODAEPage from "pages/CODAE/InclusaoDeAlimentacao/PainelPedidosPage";
import PainelPedidosInversaoDiaCardapioCODAEPage from "pages/CODAE/InversaoDiaCardapio/PainelPedidosPage";
import PainelPedidosSolicitacaoUnificadaCODAEPage from "pages/CODAE/SolicitacaoUnificada/PainelPedidosPage";
import StatusSolicitacoesAutorizadasCODAEPage from "pages/CODAE/Solicitacoes/StatusSolicitacoesAutorizadasCODAEPage";
import StatusSolicitacoesCanceladasCODAEPage from "pages/CODAE/Solicitacoes/StatusSolicitacoesCanceladasCODAEPage";
import StatusSolicitacoesComQuestionamentosCODAEPage from "pages/CODAE/Solicitacoes/StatusSolicitacoesComQuestionamentosCODAEPage";
import StatusSolicitacoesPendentesCODAEPage from "pages/CODAE/Solicitacoes/StatusSolicitacoesPendentesCODAEPage";
import StatusSolicitacoesRecusadasCODAEPage from "pages/CODAE/Solicitacoes/StatusSolicitacoesRecusadasCODAEPage";
import CadastroKitLanchePage from "pages/Cadastros/CadastroKitLanchePage";
import ConsultaKitLanchePage from "pages/Cadastros/ConsultaKitLanchePage";
import PainelPedidosAlteracaoDeCardapioDREPage from "pages/DRE/AlteracaoDeCardapio/PainelPedidosPage";
import PainelPedidosInclusaoDeAlimentacaoDREPage from "pages/DRE/InclusaoDeAlimentacao/PainelPedidosPage";
import PainelPedidosInversaoDiaCardapioDREPage from "pages/DRE/InversaoDiaCardapio/PainelPedidosPage";
import SolicitacaoUnificadaPage from "pages/DRE/SolicitacaoUnificadaPage";
import StatusSolicitacoesAguardandoDREPage from "pages/DRE/Solicitacoes/StatusSolicitacoesAguardandoDREPage";
import StatusSolicitacoesAutorizadasDREPage from "pages/DRE/Solicitacoes/StatusSolicitacoesAutorizadasDREPage";
import StatusSolicitacoesCanceladasDREPage from "pages/DRE/Solicitacoes/StatusSolicitacoesCanceladasDREPage";
import StatusSolicitacoesPendentesDREPage from "pages/DRE/Solicitacoes/StatusSolicitacoesPendentesDREPage";
import StatusSolicitacoesRecusadasDREPage from "pages/DRE/Solicitacoes/StatusSolicitacoesRecusadasDREPage";
import { StatusSolicitacoesAutorizadasEscolaPage } from "pages/Escola/StatusSolicitacoes/StatusSolicitacoesAutorizadasEscolaPage";
import { StatusSolicitacoesCanceladasEscolaPage } from "pages/Escola/StatusSolicitacoes/StatusSolicitacoesCanceladasEscolaPage";
import { StatusSolicitacoesPendentesEscolaPage } from "pages/Escola/StatusSolicitacoes/StatusSolicitacoesPendentesEscolaPage";
import { StatusSolicitacoesRecusadasEscolaPage } from "pages/Escola/StatusSolicitacoes/StatusSolicitacoesRecusadasEscolaPage";
import * as RelatorioPageInversaoDiaCardapio from "pages/InversaoDeDiaDeCardapio/RelatorioPage";
import StatusSolicitacoesAutorizadasNutriManifestacaoPage from "pages/Nutricionista/Solicitacoes/StatusSolicitacoesAutorizadasNutriManifestacaoPage";
import StatusSolicitacoesAutorizadasNutrisupervisaoPage from "pages/Nutricionista/Solicitacoes/StatusSolicitacoesAutorizadasNutrisupervisaoPage";
import StatusSolicitacoesCanceladasNutriManifestacaoPage from "pages/Nutricionista/Solicitacoes/StatusSolicitacoesCanceladasNutriManifestacaoPage";
import StatusSolicitacoesCanceladasNutrisupervisaoPage from "pages/Nutricionista/Solicitacoes/StatusSolicitacoesCanceladasNutrisupervisaoPage";
import StatusSolicitacoesComQuestionamentosNutrisupervisaoPage from "pages/Nutricionista/Solicitacoes/StatusSolicitacoesComQuestionamentosNutrisupervisaoPage";
import StatusSolicitacoesPendentesNutrisupervisaoPage from "pages/Nutricionista/Solicitacoes/StatusSolicitacoesPendentesNutrisupervisaoPage";
import StatusSolicitacoesRecusadasNutriManifestacaoPage from "pages/Nutricionista/Solicitacoes/StatusSolicitacoesRecusadasNutriManifestacaoPage";
import StatusSolicitacoesRecusadasNutrisupervisaoPage from "pages/Nutricionista/Solicitacoes/StatusSolicitacoesRecusadasNutrisupervisaoPage";
import * as PainelPageKitLanche from "pages/SolicitacaoDeKitLanche/ContainerPage";
import PainelPedidosSuspensaoAlimentacaoCEIRelatorio from "pages/SuspensaoAlimentacaoCEI/RelatorioPage";
import PainelPedidosInclusaoDeAlimentacaoTerceirizadaPage from "pages/Terceirizada/InclusaoDeAlimentacao/PainelPedidosPage";
import PainelPedidosInversaoDiaCardapioTerceirizadaPage from "pages/Terceirizada/InversaoDiaCardapio/PainelPedidosPage";
import PainelPedidosSolicitacaoUnificadaTerceirizadaPage from "pages/Terceirizada/SolicitacaoUnificada/PainelPedidosPage";
import { StatusQuestionamentosCodae } from "pages/Terceirizada/StatusSolicitacoes/StatusQuestionamentosCodae";
import { StatusSolicitacoesAutorizadasTerceirizadaPage } from "pages/Terceirizada/StatusSolicitacoes/StatusSolicitacoesAutorizadas";
import { StatusSolicitacoesCanceladasTerceirizadaPage } from "pages/Terceirizada/StatusSolicitacoes/StatusSolicitacoesCanceladasTerceirizada";
import { StatusSolicitacoesNegadasTerceirizadaPage } from "pages/Terceirizada/StatusSolicitacoes/StatusSolicitacoesNegadasTerceirizada";
import StatusSolicitacoesPendentesTerceirizadaPage from "pages/Terceirizada/StatusSolicitacoes/StatusSolicitacoesPendentes";
import PainelPedidosSuspensaoAlimentacao from "pages/Terceirizada/SuspensaoAlimentacao/PainelPedidosPage";
import PainelPedidosSuspensaoAlimentacaoRelatorio from "pages/Terceirizada/SuspensaoAlimentacao/RelatorioPage";
import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

import {
  alteracaoCardapio,
  inclusaoAlimentacao,
  painelGestaoAlimentacao,
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
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.INCLUSAO_ALIMENTACAO}`,
    component: inclusaoAlimentacao(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.ALTERACAO_TIPO_ALIMENTACAO}`,
    component: alteracaoCardapio(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.SOLICITACAO_KIT_LANCHE}`,
    component: PainelPageKitLanche.PainelPedidosEscola,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.INVERSAO_CARDAPIO}`,
    component: RelatorioPageInversaoDiaCardapio.InversaoDeDiaDeCardapioPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.ESCOLA}/${constants.SUSPENSAO_ALIMENTACAO}`,
    component: suspensaoAlimentacao(),
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
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
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.NUTRIMANIFESTACAO}/${constants.SOLICITACOES_NEGADAS}`,
    component: StatusSolicitacoesRecusadasNutriManifestacaoPage,
    tipoUsuario:
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.NUTRIMANIFESTACAO}/${constants.SOLICITACOES_CANCELADAS}`,
    component: StatusSolicitacoesCanceladasNutriManifestacaoPage,
    tipoUsuario:
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhMedicao() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.INVERSAO_CARDAPIO}`,
    component: PainelPedidosInversaoDiaCardapioTerceirizadaPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
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
    path: `/${constants.TERCEIRIZADA}/${constants.SOLICITACAO_KIT_LANCHE_UNIFICADA}`,
    component: PainelPedidosSolicitacaoUnificadaTerceirizadaPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.INCLUSAO_ALIMENTACAO}`,
    component: PainelPedidosInclusaoDeAlimentacaoTerceirizadaPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.SOLICITACAO_KIT_LANCHE}`,
    component: PainelPageKitLanche.PainelPedidosTerceirizada,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.TERCEIRIZADA}/${constants.SUSPENSAO_ALIMENTACAO}`,
    component: PainelPedidosSuspensaoAlimentacao,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
];
