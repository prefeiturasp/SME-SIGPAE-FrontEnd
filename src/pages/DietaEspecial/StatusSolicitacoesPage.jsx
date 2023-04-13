import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import StatusSolicitacoes from "../../components/screens/DashBoardDietaEspecial/StatusSolicitacoes";
import Page from "../../components/Shareable/Page/Page";
import { ESCOLA, CODAE, TERCEIRIZADA, DRE } from "../../configs/constants";

import {
  getDietaEspecialAutorizadasCODAE,
  getDietaEspecialAutorizadasDRE,
  getDietaEspecialAutorizadasEscola,
  getDietaEspecialAutorizadasTemporariamenteCODAE,
  getDietaEspecialAutorizadasTemporariamenteDRE,
  getDietaEspecialAutorizadasTemporariamenteEscola,
  getDietaEspecialAutorizadasTemporariamenteTerceirizada,
  getDietaEspecialAutorizadasTerceirizada,
  getDietaEspecialCanceladasCODAE,
  getDietaEspecialCanceladasDRE,
  getDietaEspecialCanceladasEscola,
  getDietaEspecialCanceladasTerceirizada,
  getDietaEspecialInativasCODAE,
  getDietaEspecialInativasDRE,
  getDietaEspecialInativasEscola,
  getDietaEspecialInativasTemporariamenteCODAE,
  getDietaEspecialInativasTemporariamenteDRE,
  getDietaEspecialInativasTemporariamenteEscola,
  getDietaEspecialInativasTemporariamenteTerceirizada,
  getDietaEspecialInativasTerceirizada,
  getDietaEspecialNegadasCODAE,
  getDietaEspecialNegadasDRE,
  getDietaEspecialNegadasEscola,
  getDietaEspecialNegadasTerceirizada,
  getDietaEspecialPendenteAutorizacaoCODAE,
  getDietaEspecialPendenteAutorizacaoDRE,
  getDietaEspecialPendenteAutorizacaoEscola,
  getDietaEspecialPendenteAutorizacaoTerceirizada,
  getDietaEspecialAguardandoVigenciaTerceirizada,
  getDietaEspecialAguardandoVigenciaEscola
} from "../../services/dashBoardDietaEspecial.service";

export const HOME = "/painel-dieta-especial";

export const LOG_PARA = {
  ESCOLA: 0,
  DRE: 1,
  CODAE: 3,
  TERCEIRIZADA: 2
};

const StatusSolicitacoesBase = props => {
  const atual = {
    href: "#",
    titulo: "Status Solicitações"
  };
  const anteriores = [
    {
      href: `/painel-dieta-especial`,
      titulo: "Painel Dieta Especial"
    }
  ];
  return (
    <Page titulo={atual.titulo} botaoVoltar voltarPara={HOME}>
      <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
      <StatusSolicitacoes {...props} />
    </Page>
  );
};

// Escola
export const SolicitacoesDietaEspecialEscola = () => (
  <StatusSolicitacoesBase
    visao={ESCOLA}
    logPara={LOG_PARA.ESCOLA}
    getDietaEspecialPendenteAutorizacao={
      getDietaEspecialPendenteAutorizacaoEscola
    }
    getDietaEspecialAutorizadas={getDietaEspecialAutorizadasEscola}
    getDietaEspecialNegadas={getDietaEspecialNegadasEscola}
    getDietaEspecialCanceladas={getDietaEspecialCanceladasEscola}
    getDietaEspecialAutorizadasTemporariamente={
      getDietaEspecialAutorizadasTemporariamenteEscola
    }
    getDietaEspecialInativasTemporariamente={
      getDietaEspecialInativasTemporariamenteEscola
    }
    getDietaEspecialInativas={getDietaEspecialInativasEscola}
    getDietaEspecialAguardandoVigencia={
      getDietaEspecialAguardandoVigenciaEscola
    }
  />
);

// DRE
export const SolicitacoesDietaEspecialDRE = () => (
  <StatusSolicitacoesBase
    visao={DRE}
    logPara={LOG_PARA.DRE}
    getDietaEspecialPendenteAutorizacao={getDietaEspecialPendenteAutorizacaoDRE}
    getDietaEspecialAutorizadas={getDietaEspecialAutorizadasDRE}
    getDietaEspecialNegadas={getDietaEspecialNegadasDRE}
    getDietaEspecialCanceladas={getDietaEspecialCanceladasDRE}
    getDietaEspecialAutorizadasTemporariamente={
      getDietaEspecialAutorizadasTemporariamenteDRE
    }
    getDietaEspecialInativasTemporariamente={
      getDietaEspecialInativasTemporariamenteDRE
    }
    getDietaEspecialInativas={getDietaEspecialInativasDRE}
  />
);

// CODAE
export const SolicitacoesDietaEspecialCODAE = () => (
  <StatusSolicitacoesBase
    visao={CODAE}
    logPara={LOG_PARA.CODAE}
    getDietaEspecialPendenteAutorizacao={
      getDietaEspecialPendenteAutorizacaoCODAE
    }
    getDietaEspecialAutorizadas={getDietaEspecialAutorizadasCODAE}
    getDietaEspecialNegadas={getDietaEspecialNegadasCODAE}
    getDietaEspecialCanceladas={getDietaEspecialCanceladasCODAE}
    getDietaEspecialAutorizadasTemporariamente={
      getDietaEspecialAutorizadasTemporariamenteCODAE
    }
    getDietaEspecialInativasTemporariamente={
      getDietaEspecialInativasTemporariamenteCODAE
    }
    getDietaEspecialInativas={getDietaEspecialInativasCODAE}
  />
);

// Terceirizada
export const SolicitacoesDietaEspecialTerceirizada = () => (
  <StatusSolicitacoesBase
    visao={TERCEIRIZADA}
    logPara={LOG_PARA.TERCEIRIZADA}
    getDietaEspecialPendenteAutorizacao={
      getDietaEspecialPendenteAutorizacaoTerceirizada
    }
    getDietaEspecialAutorizadas={getDietaEspecialAutorizadasTerceirizada}
    getDietaEspecialNegadas={getDietaEspecialNegadasTerceirizada}
    getDietaEspecialCanceladas={getDietaEspecialCanceladasTerceirizada}
    getDietaEspecialAutorizadasTemporariamente={
      getDietaEspecialAutorizadasTemporariamenteTerceirizada
    }
    getDietaEspecialInativasTemporariamente={
      getDietaEspecialInativasTemporariamenteTerceirizada
    }
    getDietaEspecialInativas={getDietaEspecialInativasTerceirizada}
    getDietaEspecialAguardandoVigencia={
      getDietaEspecialAguardandoVigenciaTerceirizada
    }
  />
);
