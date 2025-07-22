import {
  CANCELAMENTO,
  CONSULTA_PROTOCOLO_PADRAO_DIETA,
  DIETA_ESPECIAL,
  RELATORIO_DIETAS_AUTORIZADAS,
  RELATORIO_DIETAS_CANCELADAS,
  RELATORIO_GERENCIAL_DIETAS,
  RELATORIO_HISTORICO_DIETAS,
  RELATORIO_RECREIO_NAS_FERIAS,
} from "src/configs/constants";
import { getNomeCardAguardandoAutorizacao } from "src/helpers/dietaEspecial";
import {
  ehUsuarioRelatorios,
  usuarioEhAdministradorNutriCODAE,
  usuarioEhCODAEDietaEspecial,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhCogestorDRE,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
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
import { LeafItem, Menu, SubMenu } from "./shared";

const MenuDietaEspecial = ({ activeMenu, onSubmenuClick }) => {
  const exibePainelInicial =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhDRE() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEhMedicao() ||
    usuarioEhEmpresaTerceirizada() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEscolaEhGestaoDireta() ||
    usuarioEscolaEhGestaoParceira() ||
    usuarioEhCODAEGabinete() ||
    usuarioEhDinutreDiretoria();
  const exibeNovaSolicitacao =
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEscolaEhGestaoDireta() ||
    usuarioEscolaEhGestaoParceira();
  const exibeConsultaDieta =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhEmpresaTerceirizada() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEhDRE() ||
    usuarioEhMedicao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhDRE() ||
    usuarioEscolaEhGestaoDireta() ||
    usuarioEscolaEhGestaoParceira() ||
    usuarioEhCODAEGabinete() ||
    usuarioEhDinutreDiretoria();
  const exibeAtivasInativas = usuarioEhCODAEDietaEspecial();
  const exibeRelatorioDietasEspeciais =
    usuarioEhEscolaTerceirizada() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEmpresaTerceirizada() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhDRE() ||
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhAdministradorNutriCODAE() ||
    usuarioEhCoordenadorNutriSupervisao() ||
    usuarioEhAdministradorNutriCODAE() ||
    usuarioEhCoordenadorNutriCODAE() ||
    usuarioEhMedicao() ||
    usuarioEhCODAEGabinete() ||
    ehUsuarioRelatorios() ||
    usuarioEhGticCODAE() ||
    usuarioEhDinutreDiretoria();
  const exibeRelatorioRecreioNasFerias =
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
    usuarioEhCODAEGabinete();

  return (
    <Menu
      id="DietaEspecial"
      icon="fa-apple-alt"
      title={"Dieta Especial"}
      dataTestId="dieta-especial"
    >
      {exibePainelInicial && (
        <LeafItem to="/painel-dieta-especial">Painel de Solicitações</LeafItem>
      )}
      {exibeNovaSolicitacao && (
        <LeafItem to={`/escola/dieta-especial`}>Nova Solicitação</LeafItem>
      )}
      {exibeNovaSolicitacao && (
        <LeafItem to={`/escola/dieta-especial-alteracao-ue`}>
          Alteração U.E
        </LeafItem>
      )}
      {exibeConsultaDieta && (
        <LeafItem to={`/dieta-especial/ativas-inativas`}>
          Consulta de Dieta do Aluno
        </LeafItem>
      )}
      {exibeAtivasInativas && (
        <LeafItem to={`/solicitacoes-dieta-especial/solicitacoes-pendentes`}>
          {getNomeCardAguardandoAutorizacao()}
        </LeafItem>
      )}
      {(usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhEscolaTerceirizada() ||
        usuarioEscolaEhGestaoDireta() ||
        usuarioEscolaEhGestaoParceira()) && (
        <LeafItem to={`/${DIETA_ESPECIAL}/${CANCELAMENTO}`}>
          Cancel. Dieta Especial
        </LeafItem>
      )}
      {usuarioEhCODAEDietaEspecial() && (
        <LeafItem to={`/${DIETA_ESPECIAL}/${CONSULTA_PROTOCOLO_PADRAO_DIETA}`}>
          Consultar Protocolo Padrão
        </LeafItem>
      )}
      {exibeRelatorioDietasEspeciais && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Relatórios"
          activeMenu={activeMenu}
          dataTestId="relatorios-de"
        >
          {!usuarioEhEscolaTerceirizada() &&
            !usuarioEhEscolaTerceirizadaDiretor() && (
              <LeafItem
                to={`/${DIETA_ESPECIAL}/${RELATORIO_DIETAS_AUTORIZADAS}`}
              >
                Relatório de Dietas Autorizadas
              </LeafItem>
            )}
          {!usuarioEhEscolaTerceirizada() &&
            !usuarioEhEscolaTerceirizadaDiretor() && (
              <LeafItem
                to={`/${DIETA_ESPECIAL}/${RELATORIO_DIETAS_CANCELADAS}`}
              >
                Relatório de Dietas Canceladas
              </LeafItem>
            )}
          <LeafItem to={`/${DIETA_ESPECIAL}/${RELATORIO_HISTORICO_DIETAS}`}>
            Relatório de Histórico de Dietas
          </LeafItem>
          {(usuarioEhAdministradorNutriCODAE() ||
            usuarioEhCoordenadorNutriCODAE() ||
            ehUsuarioRelatorios() ||
            usuarioEhGticCODAE()) && (
            <LeafItem to={`/${DIETA_ESPECIAL}/${RELATORIO_GERENCIAL_DIETAS}`}>
              Relatório Gerencial de Dietas
            </LeafItem>
          )}
          {exibeRelatorioRecreioNasFerias && (
            <LeafItem to={`/${DIETA_ESPECIAL}/${RELATORIO_RECREIO_NAS_FERIAS}`}>
              Relatório Recreio nas Férias
            </LeafItem>
          )}
        </SubMenu>
      )}
    </Menu>
  );
};

export default MenuDietaEspecial;
