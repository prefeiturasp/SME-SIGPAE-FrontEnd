import React from "react";
import { Menu, LeafItem } from "./shared";
import {
  DIETA_ESPECIAL,
  CANCELAMENTO,
  CONSULTA_PROTOCOLO_PADRAO_DIETA,
  RELATORIO_DIETA_ESPECIAL
} from "configs/constants";
import {
  usuarioEhTerceirizada,
  usuarioEhCODAEDietaEspecial,
  usuarioEhDRE,
  usuarioEhEscola,
  usuarioEhNutricionistaSupervisao,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao
} from "helpers/utilities";
import { getNomeCardAguardandoAutorizacao } from "helpers/dietaEspecial";

const MenuDietaEspecial = () => {
  const exibePainelInicial =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhDRE() ||
    usuarioEhEscola() ||
    usuarioEhTerceirizada() ||
    usuarioEhNutricionistaSupervisao();
  const exibeNovaSolicitacao = usuarioEhEscola();
  const exibeConsultaDieta =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhTerceirizada() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhEscola() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhDRE();
  const exibeAtivasInativas = usuarioEhCODAEDietaEspecial();
  const exibeRelatorioDietasEspeciais = usuarioEhTerceirizada();

  return (
    <Menu id="DietaEspecial" icon="fa-utensils" title={"Dieta Especial"}>
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
      {usuarioEhEscola() && (
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
        <LeafItem to={`/${DIETA_ESPECIAL}/${RELATORIO_DIETA_ESPECIAL}`}>
          Relatórios
        </LeafItem>
      )}
    </Menu>
  );
};

export default MenuDietaEspecial;
