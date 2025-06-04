import {
  ehUsuarioRelatorios,
  usuarioEhCODAEDietaEspecial,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAEGestaoProduto,
  usuarioEhCODAENutriManifestacao,
  usuarioEhCogestorDRE,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhGticCODAE,
  usuarioEhNutricionistaSupervisao,
  usuarioEhOrgaoFiscalizador,
  usuarioEhQualquerCODAE,
  usuarioEscolaEhGestaoDireta,
  validaPerfilEscolaMistaParceira,
} from "src/helpers/utilities";

import CadastroGeralPage from "src/pages/Cadastros/CadastroGeralPage";
import CadastroProdutosEdital from "src/pages/Cadastros/CadastroProdutosEdital";
import VincularProdutosEditaisPage from "src/pages/Cadastros/VincularProdutosEditaisPage";
import DashboardGestaoProdutoPage from "src/pages/DashboardGestaoProduto/DashboardGestaoProdutoPage";
import {
  AtivacaoDeProdutoPage,
  ConsultaAtivacaoDeProdutoPage,
  ConsultaResponderReclamacaoPage,
  ReclamacaoDeProdutoPage,
  RelatorioQuantitativoPorTerceirizadaPage,
  ResponderQuestionamentoNutrisupervisorPage,
  ResponderQuestionamentoUEPage,
  ResponderReclamacaoPage,
} from "src/pages/Produto";
import AcompanharSolicitacaoCadastroProdutoPage from "src/pages/Produto/AcompanharSolicitacaoCadastroProdutoPage";
import AtualizacaoProdutoFormPage from "src/pages/Produto/AtualizacaoProdutoFormPage";
import AvaliarReclamacaoProdutoPage from "src/pages/Produto/AvaliarReclamacaoProdutoPage";
import AvaliarSolicitacaoCadastroProdutoPage from "src/pages/Produto/AvaliarSolicitacaoCadastroProdutoPage";
import BuscaAvancadaProdutoAnaliseSensorial from "src/pages/Produto/BuscaAvancadaProdutoAnaliseSensorial";
import BuscaAvancadaProdutoPage from "src/pages/Produto/BuscaAvancadaProdutoPage";
import BuscaProdutoAnaliseSensorial from "src/pages/Produto/BuscaProdutoAnaliseSensorial";
import BuscaProdutosSuspensos from "src/pages/Produto/BuscaProdutosSuspensos";
import CadastroProdutoPage from "src/pages/Produto/CadastroProdutoPage";
import HomologacaoProdutoPage from "src/pages/Produto/HomologacaoProdutoPage";
import RelatorioAnaliseSensorial from "src/pages/Produto/RelatorioAnaliseSensorial";
import RelatorioProduto from "src/pages/Produto/RelatorioProduto";
import RelatorioReclamacaoProduto from "src/pages/Produto/RelatorioReclamacaoProduto";
import * as StatusSolicitacoesGestaoProduto from "src/pages/Produto/StatusSolicitacoesGestaoProduto";
import RelatorioProdutosHomologadosPage from "src/pages/RelatorioProdutosHomologados/RelatorioProdutosHomologadosPage";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasGestaoDeProdutos: Array<RotaInterface> = [
  {
    path: `/${constants.PESQUISA_DESENVOLVIMENTO}/${constants.PRODUTO}`,
    component: CadastroProdutoPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.EDITAR}`,
    component: AtualizacaoProdutoFormPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.PESQUISA_DESENVOLVIMENTO}/${constants.BUSCA_PRODUTO}`,
    component: BuscaAvancadaProdutoPage,
    tipoUsuario:
      validaPerfilEscolaMistaParceira() && !usuarioEscolaEhGestaoDireta(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.AVALIAR_RECLAMACAO_PRODUTO}`,
    component: AvaliarReclamacaoProdutoPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.PESQUISA_DESENVOLVIMENTO}/${constants.BUSCA_PRODUTO_ANALISE_SENSORIAL}`,
    component: BuscaProdutoAnaliseSensorial,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.RELATORIO_ANALISE_SENSORIAL}`,
    component: BuscaAvancadaProdutoAnaliseSensorial,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() || usuarioEhCODAEGestaoProduto(),
  },
  {
    path: `/${constants.PESQUISA_DESENVOLVIMENTO}/${constants.RELATORIO_ANALISE_SENSORIAL}`,
    component: RelatorioAnaliseSensorial,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.PESQUISA_DESENVOLVIMENTO}/${constants.RELATORIO_PRODUTO}`,
    component: RelatorioProduto,
    tipoUsuario: validaPerfilEscolaMistaParceira(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.RELATORIO_RECLAMACAO_PRODUTO}`,
    component: RelatorioReclamacaoProduto,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGestaoProduto() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhDRE() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/responder-questionamento-ue`,
    component: ResponderQuestionamentoUEPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/responder-questionamento-nutrisupervisor`,
    component: ResponderQuestionamentoNutrisupervisorPage,
    tipoUsuario: usuarioEhNutricionistaSupervisao(),
  },
  {
    path: `/${constants.PESQUISA_DESENVOLVIMENTO}/${constants.HOMOLOGACAO_PRODUTO}`,
    component: HomologacaoProdutoPage,
    tipoUsuario: usuarioEhCODAEGestaoProduto(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.RELATORIO}`,
    component: HomologacaoProdutoPage,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGestaoProduto() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhDRE() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO.RECLAMACAO_DE_PRODUTO}`,
    component: StatusSolicitacoesGestaoProduto.ReclamacaoDeProduto,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAEGestaoProduto() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO.PRODUTOS_SUSPENSOS}`,
    component: StatusSolicitacoesGestaoProduto.ProdutosSuspensos,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGestaoProduto() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhDRE() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO.CORRECAO_DE_PRODUTO}`,
    component: StatusSolicitacoesGestaoProduto.CorrecaoDeProduto,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() || usuarioEhCODAEGestaoProduto(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO.AGUARDANDO_ANALISE_RECLAMACAO}`,
    component: StatusSolicitacoesGestaoProduto.AguardandoAnaliseReclamacao,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGestaoProduto() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhCogestorDRE() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO.RESPONDER_QUESTIONAMENTOS_DA_CODAE}`,
    component: StatusSolicitacoesGestaoProduto.ResponderQuestionamentoDaCodae,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhCogestorDRE() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO.AGUARDANDO_ANALISE_SENSORIAL}`,
    component: StatusSolicitacoesGestaoProduto.AguardandoAnaliseSensorial,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() || usuarioEhCODAEGestaoProduto(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO.SOLICITACOES_PENDENTE_HOMOLOGACAO}`,
    component: StatusSolicitacoesGestaoProduto.PendenteHomologacao,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() || usuarioEhCODAEGestaoProduto(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO.SOLICITACOES_HOMOLOGADAS}`,
    component: StatusSolicitacoesGestaoProduto.Homologados,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGestaoProduto() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhDRE() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO.SOLICITACOES_NAO_HOMOLOGADAS}`,
    component: StatusSolicitacoesGestaoProduto.NaoHomologados,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGestaoProduto() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhDRE() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: "/painel-gestao-produto",
    component: DashboardGestaoProdutoPage,
    tipoUsuario:
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGestaoProduto() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhDRE() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.RECLAMACAO_DE_PRODUTO}`,
    component: ReclamacaoDeProdutoPage,
    tipoUsuario:
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.SUSPENSAO_DE_PRODUTO}`,
    component: BuscaProdutosSuspensos,
    tipoUsuario:
      usuarioEhCODAEGestaoProduto() ||
      usuarioEhCODAEDietaEspecial() ||
      usuarioEhDRE() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      ehUsuarioRelatorios() ||
      usuarioEhGticCODAE() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ATIVACAO_DE_PRODUTO}/consulta`,
    component: ConsultaAtivacaoDeProdutoPage,
    tipoUsuario: usuarioEhCODAEGestaoProduto,
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ATIVACAO_DE_PRODUTO}/detalhe`,
    component: AtivacaoDeProdutoPage,
    tipoUsuario: usuarioEhCODAEGestaoProduto,
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/relatorios/produtos-homologados`,
    component: RelatorioProdutosHomologadosPage,
    tipoUsuario:
      usuarioEhQualquerCODAE() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhDRE() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      ehUsuarioRelatorios() ||
      usuarioEhGticCODAE() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/responder-reclamacao/consulta`,
    component: ConsultaResponderReclamacaoPage,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhCogestorDRE() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhOrgaoFiscalizador() ||
      usuarioEhCODAEGabinete() ||
      usuarioEhDinutreDiretoria(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/responder-reclamacao/detalhe`,
    component: ResponderReclamacaoPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/cadastro-geral`,
    component: CadastroGeralPage,
    tipoUsuario:
      usuarioEhEmpresaTerceirizada() || usuarioEhCODAEGestaoProduto(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/vincular-produto-edital`,
    component: VincularProdutosEditaisPage,
    tipoUsuario: usuarioEhCODAEGestaoProduto(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/cadastro-produtos-provinientes-edital`,
    component: CadastroProdutosEdital,
    tipoUsuario: usuarioEhCODAEGestaoProduto(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/relatorios/quantitativo-por-terceirizada`,
    component: RelatorioQuantitativoPorTerceirizadaPage,
    tipoUsuario: usuarioEhCODAEGestaoProduto(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.AVALIAR_SOLICITACAO_CADASTRO_PRODUTO}`,
    component: AvaliarSolicitacaoCadastroProdutoPage,
    tipoUsuario: usuarioEhEmpresaTerceirizada(),
  },
  {
    path: `/${constants.GESTAO_PRODUTO}/${constants.ACOMPANHAR_SOLICITACAO_CADASTRO_PRODUTO}`,
    component: AcompanharSolicitacaoCadastroProdutoPage,
    tipoUsuario: usuarioEhCODAEDietaEspecial(),
  },
];
