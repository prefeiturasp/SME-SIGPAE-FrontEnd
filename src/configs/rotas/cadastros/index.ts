import {
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCodaeDilog,
  usuarioEhCronograma,
  usuarioEhDilogQualidade,
  usuarioEhDilogQualidadeOuCronograma,
  usuarioEhEmpresaFornecedor,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhMedicao,
  usuarioEhQualquerCODAE,
  usuarioEhAdministradorCONTRATOS,
} from "src/helpers/utilities";

import CadastroEmpresaPage from "src/pages/Cadastros/CadastroEmpresaPage";
import CadastroFabricantePage from "src/pages/Cadastros/CadastroFabricantePage";
import CadastroHorarioComboAlimentacaoPage from "src/pages/Cadastros/CadastroHorarioComboAlimentacaoPage";
import CadastroLaboratorioPage from "src/pages/Cadastros/CadastroLaboratorioPage";
import CadastroLotePage from "src/pages/Cadastros/CadastroLotePage";
import CadastroMarcaPage from "src/pages/Cadastros/CadastroMarcaPage";
import CadastroProdutosLogisticaPage from "src/pages/Cadastros/CadastroProdutosLogisticaPage";
import CadastroSobremesaDocePage from "src/pages/Cadastros/CadastroSobremesaDocePage";
import CadastroSuspensaoDeAtividadesPage from "src/pages/Cadastros/CadastroSuspensaoAtividades";
import CadastroTipoAlimentacaoPage from "src/pages/Cadastros/CadastroTipoAlimentacaoPage";
import CadastroTipoEmbalagemPage from "src/pages/Cadastros/CadastroTipoEmbalagemPage";
import CadastroUnidadeMedidaPage from "src/pages/Cadastros/CadastroUnidadeMedidaPage";
import CadastrosPage from "src/pages/Cadastros/CadastrosPage";
import DetalharCadastroLaboratorioPage from "src/pages/Cadastros/DetalharCadastroLaboratorioPage";
import EditaisCadastradosPage from "src/pages/Cadastros/EditaisCadastradosPage";
import EditaisContratosEditarPage from "src/pages/Cadastros/EditaisContratosEditarPage.jsx";
import EditaisContratosPage from "src/pages/Cadastros/EditaisContratosPage";
import EditarCadastroLaboratorioPage from "src/pages/Cadastros/EditarCadastroLaboratorioPage ";
import EditarCadastroTipoEmbalagemPage from "src/pages/Cadastros/EditarCadastroTipoEmbalagemPage";
import EditarEmpresaPage from "src/pages/Cadastros/EditarEmpresaPage";
import EditarProdutosLogisticaPage from "src/pages/Cadastros/EditarProdutosLogisticaPage";
import EditarUnidadesMedidaPage from "src/pages/Cadastros/EditarUnidadesMedidaPage";
import EmpresasCadastradas from "src/pages/Cadastros/EmpresasCadastradasPage";
import FaixasEtariasPage from "src/pages/Cadastros/FaixasEtariasPage";
import LaboratoriosCadastradosPage from "src/pages/Cadastros/LaboratoriosCadastradosPage";
import LotesCadastradosPage from "src/pages/Cadastros/LotesCadastradosPage";
import NovaPermissaoLancamentoEspecialPage from "src/pages/Cadastros/NovaPermissaoLancamentoEspecialPage";
import PermissaoLancamentosEspeciaisPage from "src/pages/Cadastros/PermissaoLancamentosEspeciaisPage";
import ProdutosLogisticaPage from "src/pages/Cadastros/ProdutosLogisticaPage";
import TiposEmbalagensCadastradosPage from "src/pages/Cadastros/TiposEmbalagensCadastradosPage";
import UnidadesMedidaPage from "src/pages/Cadastros/UnidadesMedidaPage";
import RecreioFeriasPage from "src/pages/Cadastros/RecreioFeriasPage";
import RecreioFeriasCadastradosPage from "src/pages/Cadastros/RecreioFeriasCadastradosPage";

import * as constants from "../../constants";
import { RotaInterface } from "../interfaces";

export const rotasCadastros: Array<RotaInterface> = [
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}`,
    component: CadastrosPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.SOBREMESA_DOCE}`,
    component: CadastroSobremesaDocePage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao() || usuarioEhMedicao(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.SUSPENSAO_ATIVIDADES}`,
    component: CadastroSuspensaoDeAtividadesPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao() || usuarioEhMedicao(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.RECREIO_NAS_FERIAS}`,
    component: RecreioFeriasPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.RECREIO_NAS_FERIAS_CADASTRADOS}`,
    component: RecreioFeriasCadastradosPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/lotes-cadastrados`,
    component: LotesCadastradosPage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/editais-cadastrados`,
    component: EditaisCadastradosPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/lote`,
    component: CadastroLotePage,
    tipoUsuario: constants.QUALQUER_USUARIO,
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/tipos-alimentacao`,
    component: CadastroTipoAlimentacaoPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/tipos-alimentacao/permissao-lancamentos-especiais`,
    component: PermissaoLancamentosEspeciaisPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/tipos-alimentacao/permissao-lancamentos-especiais/nova-permissao-lancamento-especial`,
    component: NovaPermissaoLancamentoEspecialPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/tipos-alimentacao/permissao-lancamentos-especiais/editar-permissao-lancamento-especial`,
    component: NovaPermissaoLancamentoEspecialPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/horario-combos-alimentacao`,
    component: CadastroHorarioComboAlimentacaoPage,
    tipoUsuario:
      usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/empresas-cadastradas`,
    component: EmpresasCadastradas,
    tipoUsuario:
      usuarioEhQualquerCODAE() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCronograma() ||
      usuarioEhAdministradorCONTRATOS(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/empresa`,
    component: CadastroEmpresaPage,
    tipoUsuario:
      usuarioEhQualquerCODAE() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCronograma() ||
      usuarioEhAdministradorCONTRATOS(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.EDITAR_EMPRESA}`,
    component: EditarEmpresaPage,
    tipoUsuario:
      usuarioEhQualquerCODAE() ||
      usuarioEhCodaeDilog() ||
      usuarioEhCronograma() ||
      usuarioEhAdministradorCONTRATOS(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/editais-contratos`,
    component: EditaisContratosPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/editais-contratos/editar`,
    component: EditaisContratosEditarPage,
    tipoUsuario: usuarioEhQualquerCODAE(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/faixas-etarias`,
    component: FaixasEtariasPage,
    tipoUsuario: usuarioEhCODAEGestaoAlimentacao(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.LABORATORIOS_CADASTRADOS}`,
    component: LaboratoriosCadastradosPage,
    tipoUsuario: usuarioEhDilogQualidade() || usuarioEhCodaeDilog(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.CADASTRO_LABORATORIO}`,
    component: CadastroLaboratorioPage,
    tipoUsuario: usuarioEhDilogQualidade() || usuarioEhCodaeDilog(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.CADASTRO_LABORATORIO}/${constants.DETALHAR}`,
    component: DetalharCadastroLaboratorioPage,
    tipoUsuario: usuarioEhDilogQualidade() || usuarioEhCodaeDilog(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.CADASTRO_LABORATORIO}/${constants.EDITAR}`,
    component: EditarCadastroLaboratorioPage,
    tipoUsuario: usuarioEhDilogQualidade() || usuarioEhCodaeDilog(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.TIPOS_EMBALAGENS}`,
    component: TiposEmbalagensCadastradosPage,
    tipoUsuario: usuarioEhDilogQualidadeOuCronograma(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.CADASTRO_TIPO_EMBALAGEM}`,
    component: CadastroTipoEmbalagemPage,
    tipoUsuario: usuarioEhDilogQualidadeOuCronograma(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.CADASTRO_TIPO_EMBALAGEM}/${constants.EDITAR}`,
    component: EditarCadastroTipoEmbalagemPage,
    tipoUsuario: usuarioEhDilogQualidadeOuCronograma(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.PRODUTOS}`,
    component: ProdutosLogisticaPage,
    tipoUsuario:
      usuarioEhCronograma() ||
      usuarioEhCodaeDilog() ||
      usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.CADASTRO_PRODUTOS}`,
    component: CadastroProdutosLogisticaPage,
    tipoUsuario:
      usuarioEhCronograma() ||
      usuarioEhCodaeDilog() ||
      usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.EDICAO_PRODUTOS}`,
    component: EditarProdutosLogisticaPage,
    tipoUsuario:
      usuarioEhCronograma() ||
      usuarioEhCodaeDilog() ||
      usuarioEhEmpresaFornecedor(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.UNIDADES_MEDIDA}`,
    component: UnidadesMedidaPage,
    tipoUsuario: usuarioEhDilogQualidadeOuCronograma(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.CADASTRO_UNIDADE_MEDIDA}`,
    component: CadastroUnidadeMedidaPage,
    tipoUsuario: usuarioEhDilogQualidadeOuCronograma(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.EDICAO_UNIDADE_MEDIDA}`,
    component: EditarUnidadesMedidaPage,
    tipoUsuario: usuarioEhDilogQualidadeOuCronograma(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.MARCAS}`,
    component: CadastroMarcaPage,
    tipoUsuario: usuarioEhEmpresaFornecedor() || usuarioEhCodaeDilog(),
  },
  {
    path: `/${constants.CONFIGURACOES}/${constants.CADASTROS}/${constants.FABRICANTES}`,
    component: CadastroFabricantePage,
    tipoUsuario: usuarioEhEmpresaFornecedor() || usuarioEhCodaeDilog(),
  },
];
