import React from "react";
import { Menu, LeafItem, SubMenu } from "./shared";
import {
  DIETA_ESPECIAL,
  CANCELAMENTO,
  CONSULTA_PROTOCOLO_PADRAO_DIETA,
  RELATORIO_DIETA_ESPECIAL
} from "configs/constants";
import {
  usuarioEhEmpresaTerceirizada,
  usuarioEhCODAEDietaEspecial,
  usuarioEhDRE,
  usuarioEhMedicao,
  usuarioEhNutricionistaSupervisao,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhAdministradorNutriCODAE,
  usuarioEhCoordenadorNutriSupervisao
} from "helpers/utilities";
import { getNomeCardAguardandoAutorizacao } from "helpers/dietaEspecial";

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
    usuarioEhNutricionistaSupervisao();
  const exibeNovaSolicitacao =
    usuarioEhEscolaTerceirizadaDiretor() || usuarioEhEscolaTerceirizada();
  const exibeConsultaDieta =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhEmpresaTerceirizada() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEhDRE();
  usuarioEhMedicao() || usuarioEhCODAEDietaEspecial() || usuarioEhDRE();
  const exibeAtivasInativas = usuarioEhCODAEDietaEspecial();
  const exibeRelatorioDietasEspeciais =
    usuarioEhEmpresaTerceirizada() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhDRE() ||
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhAdministradorNutriCODAE() ||
    usuarioEhCoordenadorNutriSupervisao() ||
    usuarioEhAdministradorNutriCODAE() ||
    usuarioEhMedicao();

  return (
    <Menu id="DietaEspecial" icon="fa-apple-alt" title={"Dieta Especial"}>
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
        usuarioEhEscolaTerceirizada()) && (
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
        >
          <LeafItem to={`/${DIETA_ESPECIAL}/${RELATORIO_DIETA_ESPECIAL}`}>
            Relatório de Dietas Especiais
          </LeafItem>
        </SubMenu>
      )}
    </Menu>
  );
};

export default MenuDietaEspecial;
