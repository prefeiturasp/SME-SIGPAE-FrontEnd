import {
  usuarioComAcessoAoCalendarioCronograma,
  usuarioComAcessoAoPainelAprovacoes,
  usuarioComAcessoAoPainelDocumentos,
  usuarioComAcessoAoPainelEmbalagens,
  usuarioComAcessoAoPainelFichasTecnicas,
  usuarioComAcessoAoRelatorioCronogramas,
  usuarioEhCODAEGabinete,
  usuarioEhCodaeDilog,
  usuarioEhCronograma,
  usuarioEhDilogAbastecimento,
  usuarioEhDilogDiretoria,
  usuarioEhDilogQualidade,
  usuarioEhEmpresaFornecedor,
  usuarioEhPreRecebimento,
} from "src/helpers/utilities";

import StatusAguardandoAssinaturasCronograma from "src/pages/Dinutre/Cronogramas/StatusAguardandoAssinaturasCronograma";
import StatusCronogramasAguardandoDilog from "src/pages/Dinutre/Cronogramas/StatusCronogramasAguardandoDilog";
import StatusCronogramasAssinadoCODAE from "src/pages/Dinutre/Cronogramas/StatusCronogramasAssinadoCODAE";
import StatusCronogramasPendentesDilog from "src/pages/Dinutre/Cronogramas/StatusCronogramasPendentesDilog";
import StatusCronogramasPendentesAbastecimento from "src/pages/Dinutre/Cronogramas/StatusCronogramasPendentesAbastecimento";
import StatusSolicitacoesAlteracoesAprovadasDilog from "src/pages/Dinutre/Solicitacoes/StatusSolicitacoesAlteracoesAprovadasDilog";
import StatusSolicitacoesAlteracoesAprovadasAbastecimento from "src/pages/Dinutre/Solicitacoes/StatusSolicitacoesAlteracoesAprovadasAbastecimento";
import StatusSolicitacoesAlteracoesCodae from "src/pages/Dinutre/Solicitacoes/StatusSolicitacoesAlteracoesCodae";
import StatusSolicitacoesAlteracoesCronograma from "src/pages/Dinutre/Solicitacoes/StatusSolicitacoesAlteracoesCronograma";
import StatusSolicitacoesAlteracoesDilog from "src/pages/Dinutre/Solicitacoes/StatusSolicitacoesAlteracoesDilog";
import StatusSolicitacoesAlteracoesAbastecimento from "src/pages/Dinutre/Solicitacoes/StatusSolicitacoesAlteracoesAbastecimento";
import StatusSolicitacoesAlteracoesReprovadasDilog from "src/pages/Dinutre/Solicitacoes/StatusSolicitacoesAlteracoesReprovadasDilog";
import StatusSolicitacoesAlteracoesReprovadasAbastecimento from "src/pages/Dinutre/Solicitacoes/StatusSolicitacoesAlteracoesReprovadasAbastecimento";
import AlterarCronogramaPage from "src/pages/PreRecebimento/AlterarCronogramaPage";
import AnalisarDocumentosRecebimentoPage from "src/pages/PreRecebimento/AnalisarDocumentosRecebimentoPage";
import AnalisarLayoutEmbalagemPage from "src/pages/PreRecebimento/AnalisarLayoutEmbalagemPage";
import AtualizarLayoutEmbalagemPage from "src/pages/PreRecebimento/AtualizarLayoutEmbalagemPage";
import CadastroCronogramaPage from "src/pages/PreRecebimento/CadastroCronogramaPage";
import CadastroDocumentosRecebimentoPage from "src/pages/PreRecebimento/CadastroDocumentosRecebimentoPage";
import CadastroLayoutEmbalagemPage from "src/pages/PreRecebimento/CadastroLayoutEmbalagemPage";
import CalendarioCronogramaPage from "src/pages/PreRecebimento/CalendarioCronogramaPage";
import StatusDocumentoAprovados from "src/pages/PreRecebimento/CardsDocumentosRecebimento/StatusDocumentoAprovados";
import StatusDocumentoEnviadosParaCorrecao from "src/pages/PreRecebimento/CardsDocumentosRecebimento/StatusDocumentoEnviadosParaCorrecao";
import StatusDocumentoPendenteAprovacao from "src/pages/PreRecebimento/CardsDocumentosRecebimento/StatusDocumentoPendenteAprovacao";
import StatusFichasTecnicasAprovadas from "src/pages/PreRecebimento/CardsFichasTecnicas/StatusFichasTecnicasAprovadas";
import StatusFichasTecnicasEnviadosParaCorrecao from "src/pages/PreRecebimento/CardsFichasTecnicas/StatusFichasTecnicasEnviadosParaCorrecao";
import StatusFichasTecnicasPendenteAprovacao from "src/pages/PreRecebimento/CardsFichasTecnicas/StatusFichasTecnicasPendenteAprovacao";
import StatusLayoutAprovados from "src/pages/PreRecebimento/CardsLayoutEmbalagem/StatusLayoutAprovados";
import StatusLayoutEnviadosParaCorrecao from "src/pages/PreRecebimento/CardsLayoutEmbalagem/StatusLayoutEnviadosParaCorrecao";
import StatusLayoutPendenteAprovacao from "src/pages/PreRecebimento/CardsLayoutEmbalagem/StatusLayoutPendenteAprovacao";
import CorrigirDocumentosRecebimentoPage from "src/pages/PreRecebimento/CorrigirDocumentosRecebimentoPage";
import CorrigirLayoutEmbalagemPage from "src/pages/PreRecebimento/CorrigirLayoutEmbalagemPage";
import CronogramaEntregaPage from "src/pages/PreRecebimento/CronogramaEntregaPage";
import DetalharCodaeDocumentosRecebimentoPage from "src/pages/PreRecebimento/DetalharCodaeDocumentosRecebimentoPage";
import DetalharCronogramaPage from "src/pages/PreRecebimento/DetalharCronogramaPage";
import DetalharFornecedorDocumentosRecebimentoPage from "src/pages/PreRecebimento/DetalharFornecedorDocumentosRecebimentoPage";
import AtualizarFornecedorDocumentosRecebimentoPage from "src/pages/PreRecebimento/AtualizarFornecedorDocumentosRecebimentoPage";
import DetalharLayoutEmbalagemPage from "src/pages/PreRecebimento/DetalharLayoutEmbalagemPage";
import DetalharSolicitacaoAlteracaoLayoutEmbalagemPage from "src/pages/PreRecebimento/DetalharSolicitacaoAlteracaoLayoutEmbalagemPage";
import AnaliseDilogCronogramaPage from "src/pages/PreRecebimento/DetalharSolicitacaoCronograma";
import DocumentosRecebimentoPage from "src/pages/PreRecebimento/DocumentosRecebimentoPage";
import EditarCronogramaPage from "src/pages/PreRecebimento/EditarCronogramaPage";
import AlterarFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/AlterarFichaTecnicaPage";
import AnalisarFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/AnalisarFichaTecnicaPage";
import AtualizarFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/AtualizarFichaTecnicaPage";
import CadastroFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/CadastroFichaTecnicaPage";
import DetalharFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/DetalharFichaTecnicaPage";
import FichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/FichaTecnicaPage";
import LayoutEmbalagemPage from "src/pages/PreRecebimento/LayoutEmbalagemPage";
import PainelAprovacoesPage from "src/pages/PreRecebimento/PainelAprovacoesPage";
import PainelDocumentosRecebimentoPage from "src/pages/PreRecebimento/PainelDocumentosRecebimentoPage";
import { PainelFichasTecnicasPage } from "src/pages/PreRecebimento/PainelFichasTecnicasPage";
import { PainelLayoutEmbalagemPage } from "src/pages/PreRecebimento/PainelLayoutEmbalagemPage";
import RelatorioCronogramaPage from "src/pages/PreRecebimento/Relatorios/RelatorioCronogramaPage";
import SolicitacaoAlteracaoCronogramaFornecedorPage from "src/pages/PreRecebimento/SolicitacaoAlteracaoCronogramaFornecedorPage";
import SolicitacaoAlteracaoCronogramaPage from "src/pages/PreRecebimento/SolicitacaoAlteracaoCronogramaPage";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasPreRecebimento: Array<RotaInterface> = [
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.CRONOGRAMA_ENTREGA}`,
    component: CronogramaEntregaPage,
    tipoUsuario:
      usuarioEhDilogAbastecimento() ||
      usuarioEhPreRecebimento() ||
      usuarioEhEmpresaFornecedor() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.SOLICITACAO_ALTERACAO_CRONOGRAMA}`,
    component: SolicitacaoAlteracaoCronogramaPage,
    tipoUsuario:
      usuarioEhCronograma() ||
      usuarioEhDilogAbastecimento() ||
      usuarioEhCodaeDilog() ||
      usuarioEhDilogDiretoria(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.SOLICITACAO_ALTERACAO_CRONOGRAMA_FORNECEDOR}`,
    component: SolicitacaoAlteracaoCronogramaFornecedorPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.DETALHE_CRONOGRAMA}`,
    component: DetalharCronogramaPage,
    tipoUsuario:
      usuarioEhPreRecebimento() ||
      usuarioEhEmpresaFornecedor() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.ALTERACAO_CRONOGRAMA}`,
    component: AlterarCronogramaPage,
    tipoUsuario:
      usuarioEhCronograma() ||
      usuarioEhPreRecebimento() ||
      usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.DETALHAR_ALTERACAO_CRONOGRAMA}`,
    component: AnaliseDilogCronogramaPage,
    tipoUsuario:
      usuarioEhCronograma() ||
      usuarioEhDilogAbastecimento() ||
      usuarioEhDilogDiretoria() ||
      usuarioEhEmpresaFornecedor() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.CADASTRO_CRONOGRAMA}`,
    component: CadastroCronogramaPage,
    tipoUsuario: usuarioEhCronograma() || usuarioEhCodaeDilog(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.CADASTRO_CRONOGRAMA}/${constants.EDITAR}`,
    component: EditarCronogramaPage,
    tipoUsuario: usuarioEhCronograma() || usuarioEhCodaeDilog(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_APROVACOES}`,
    component: PainelAprovacoesPage,
    tipoUsuario: usuarioComAcessoAoPainelAprovacoes(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.LAYOUT_EMBALAGEM}`,
    component: LayoutEmbalagemPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.CADASTRO_LAYOUT_EMBALAGEM}`,
    component: CadastroLayoutEmbalagemPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.DETALHAR_LAYOUT_EMBALAGEM}`,
    component: DetalharLayoutEmbalagemPage,
    tipoUsuario:
      usuarioEhEmpresaFornecedor() || usuarioComAcessoAoPainelEmbalagens(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.DETALHAR_LAYOUT_EMBALAGEM_SOLICITACAO_ALTERACAO}`,
    component: DetalharSolicitacaoAlteracaoLayoutEmbalagemPage,
    tipoUsuario: usuarioComAcessoAoPainelEmbalagens(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_LAYOUT_EMBALAGEM}`,
    component: PainelLayoutEmbalagemPage,
    tipoUsuario: usuarioComAcessoAoPainelEmbalagens(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_LAYOUT_EMBALAGEM}/${constants.PENDENTES_APROVACAO}/`,
    component: StatusLayoutPendenteAprovacao,
    tipoUsuario: usuarioComAcessoAoPainelEmbalagens(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_LAYOUT_EMBALAGEM}/${constants.APROVADOS}/`,
    component: StatusLayoutAprovados,
    tipoUsuario: usuarioComAcessoAoPainelEmbalagens(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_LAYOUT_EMBALAGEM}/${constants.ENVIADOS_PARA_CORRECAO}/`,
    component: StatusLayoutEnviadosParaCorrecao,
    tipoUsuario: usuarioComAcessoAoPainelEmbalagens(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.ANALISAR_LAYOUT_EMBALAGEM}`,
    component: AnalisarLayoutEmbalagemPage,
    tipoUsuario: usuarioComAcessoAoPainelEmbalagens(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.CORRIGR_LAYOUT_EMBALAGEM}`,
    component: CorrigirLayoutEmbalagemPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.ATUALIZAR_LAYOUT_EMBALAGEM}`,
    component: AtualizarLayoutEmbalagemPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.DOCUMENTOS_RECEBIMENTO}`,
    component: DocumentosRecebimentoPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.CADASTRO_DOCUMENTOS_RECEBIMENTO}`,
    component: CadastroDocumentosRecebimentoPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.DETALHAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO}`,
    component: DetalharFornecedorDocumentosRecebimentoPage,
    tipoUsuario:
      usuarioEhEmpresaFornecedor() || usuarioComAcessoAoPainelDocumentos(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.ATUALIZAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO}`,
    component: AtualizarFornecedorDocumentosRecebimentoPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.DETALHAR_CODAE_DOCUMENTO_RECEBIMENTO}`,
    component: DetalharCodaeDocumentosRecebimentoPage,
    tipoUsuario:
      usuarioEhEmpresaFornecedor() || usuarioComAcessoAoPainelDocumentos(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_DOCUMENTOS_RECEBIMENTO}`,
    component: PainelDocumentosRecebimentoPage,
    tipoUsuario: usuarioComAcessoAoPainelDocumentos(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_DOCUMENTOS_RECEBIMENTO}/${constants.PENDENTES_APROVACAO}/`,
    component: StatusDocumentoPendenteAprovacao,
    tipoUsuario: usuarioComAcessoAoPainelDocumentos(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_DOCUMENTOS_RECEBIMENTO}/${constants.APROVADOS}/`,
    component: StatusDocumentoAprovados,
    tipoUsuario: usuarioComAcessoAoPainelDocumentos(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_DOCUMENTOS_RECEBIMENTO}/${constants.ENVIADOS_PARA_CORRECAO}/`,
    component: StatusDocumentoEnviadosParaCorrecao,
    tipoUsuario: usuarioComAcessoAoPainelDocumentos(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.ANALISAR_DOCUMENTO_RECEBIMENTO}`,
    component: AnalisarDocumentosRecebimentoPage,
    tipoUsuario: usuarioEhDilogQualidade(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.CORRIGIR_DOCUMENTOS_RECEBIMENTO}`,
    component: CorrigirDocumentosRecebimentoPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.FICHA_TECNICA}`,
    component: FichaTecnicaPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.CADASTRAR_FICHA_TECNICA}`,
    component: CadastroFichaTecnicaPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_FICHAS_TECNICAS}`,
    component: PainelFichasTecnicasPage,
    exact: true,
    tipoUsuario: usuarioComAcessoAoPainelFichasTecnicas(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_FICHAS_TECNICAS}/${constants.PENDENTES_APROVACAO}/`,
    component: StatusFichasTecnicasPendenteAprovacao,
    exact: true,
    tipoUsuario: usuarioComAcessoAoPainelFichasTecnicas(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_FICHAS_TECNICAS}/${constants.APROVADOS}/`,
    component: StatusFichasTecnicasAprovadas,
    exact: true,
    tipoUsuario: usuarioComAcessoAoPainelFichasTecnicas(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.PAINEL_FICHAS_TECNICAS}/${constants.ENVIADOS_PARA_CORRECAO}/`,
    component: StatusFichasTecnicasEnviadosParaCorrecao,
    exact: true,
    tipoUsuario: usuarioComAcessoAoPainelFichasTecnicas(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.ANALISAR_FICHA_TECNICA}`,
    component: AnalisarFichaTecnicaPage,
    exact: true,
    tipoUsuario: usuarioComAcessoAoPainelFichasTecnicas(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.DETALHAR_FICHA_TECNICA}/`,
    component: DetalharFichaTecnicaPage,
    tipoUsuario:
      usuarioEhEmpresaFornecedor() || usuarioComAcessoAoPainelFichasTecnicas(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.ALTERAR_FICHA_TECNICA}/`,
    component: AlterarFichaTecnicaPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.ATUALIZAR_FICHA_TECNICA}/`,
    component: AtualizarFichaTecnicaPage,
    tipoUsuario: usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.CALENDARIO_CRONOGRAMA}`,
    component: CalendarioCronogramaPage,
    tipoUsuario: usuarioComAcessoAoCalendarioCronograma(),
  },
  {
    path: `/${constants.PRE_RECEBIMENTO}/${constants.RELATORIO_CRONOGRAMA}`,
    component: RelatorioCronogramaPage,
    tipoUsuario: usuarioComAcessoAoRelatorioCronogramas(),
  },
  {
    path: `/${constants.ABASTECIMENTO}/${constants.SOLICITACOES_PENDENTES}`,
    component: StatusCronogramasPendentesAbastecimento,
    tipoUsuario: usuarioEhDilogAbastecimento(),
  },
  {
    path: `/${constants.ABASTECIMENTO}/${constants.AGUARDANDO_DILOG}`,
    component: StatusCronogramasAguardandoDilog,
    tipoUsuario: usuarioEhDilogAbastecimento(),
  },
  {
    path: `/${constants.ABASTECIMENTO}/${constants.SOLICITACOES_ALTERACOES}`,
    component: StatusSolicitacoesAlteracoesAbastecimento,
    tipoUsuario: usuarioEhDilogAbastecimento(),
  },
  {
    path: `/${constants.ABASTECIMENTO}/${constants.ALTERACOES_APROVADAS}`,
    component: StatusSolicitacoesAlteracoesAprovadasAbastecimento,
    tipoUsuario: usuarioEhDilogAbastecimento(),
  },
  {
    path: `/${constants.ABASTECIMENTO}/${constants.ALTERACOES_REPROVADAS}`,
    component: StatusSolicitacoesAlteracoesReprovadasAbastecimento,
    tipoUsuario: usuarioEhDilogAbastecimento(),
  },
  {
    path: `/${constants.DILOG}/${constants.SOLICITACOES_PENDENTES}`,
    component: StatusCronogramasPendentesDilog,
    tipoUsuario: usuarioEhDilogDiretoria(),
  },
  {
    path: `/${constants.DILOG}/${constants.SOLICITACOES_ALTERACOES}`,
    component: StatusSolicitacoesAlteracoesDilog,
    tipoUsuario: usuarioEhDilogDiretoria(),
  },
  {
    path: `/${constants.DILOG}/${constants.ALTERACOES_APROVADAS}`,
    component: StatusSolicitacoesAlteracoesAprovadasDilog,
    tipoUsuario:
      usuarioEhDilogDiretoria() ||
      usuarioEhCronograma() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.DILOG}/${constants.ALTERACOES_REPROVADAS}`,
    component: StatusSolicitacoesAlteracoesReprovadasDilog,
    tipoUsuario:
      usuarioEhDilogDiretoria() ||
      usuarioEhCronograma() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.CRONOGRAMA}/${constants.AGUARDANDO_ASSINATURAS}`,
    component: StatusAguardandoAssinaturasCronograma,
    tipoUsuario:
      usuarioEhCronograma() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.ASSINADO_CODAE}`,
    component: StatusCronogramasAssinadoCODAE,
    tipoUsuario:
      usuarioEhDilogAbastecimento() ||
      usuarioEhDilogDiretoria() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCronograma() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.CRONOGRAMA}/${constants.SOLICITACOES_ALTERACOES}`,
    component: StatusSolicitacoesAlteracoesCronograma,
    tipoUsuario:
      usuarioEhCronograma() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCODAEGabinete(),
  },
  {
    path: `/${constants.CRONOGRAMA}/${constants.ALTERACOES_CODAE}`,
    component: StatusSolicitacoesAlteracoesCodae,
    tipoUsuario:
      usuarioEhCronograma() ||
      usuarioEhDilogDiretoria() ||
      usuarioEhCodaeDilog() ||
      usuarioEhDilogAbastecimento() ||
      usuarioEhCODAEGabinete(),
  },
];
