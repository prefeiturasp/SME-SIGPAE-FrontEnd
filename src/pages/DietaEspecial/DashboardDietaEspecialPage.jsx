import React from "react";
import DashBoardDietaEspecial from "../../components/screens/DashBoardDietaEspecial";
import SolicitacaoDietaEspecial from "../../components/screens/DietaEspecial/Aluno";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import {
  CODAE,
  DRE,
  ESCOLA,
  TERCEIRIZADA,
  ALUNO,
  DIETA_ESPECIAL,
} from "../../configs/constants";
import { HOME } from "../../constants/config";
import {
  getDietaEspecialAutorizadasCODAE,
  getDietaEspecialAutorizadasDRE,
  getDietaEspecialAutorizadasEscola,
  getDietaEspecialAutorizadasTemporariamenteCODAE,
  getDietaEspecialAutorizadasTemporariamenteDRE,
  getDietaEspecialAutorizadasTemporariamenteEscola,
  getDietaEspecialAguardandoVigenciaEscola,
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
} from "../../services/dashBoardDietaEspecial.service";

class DietaEspecialBase extends React.Component {
  render() {
    return (
      <Page>
        <Breadcrumb home={HOME} />
        <DashBoardDietaEspecial {...this.props} />
      </Page>
    );
  }
}

// Escola
export const DietaEspecialEscola = () => (
  <DietaEspecialBase
    visao={ESCOLA}
    getDietaEspecialPendenteAutorizacao={
      getDietaEspecialPendenteAutorizacaoEscola
    }
    getDietaEspecialAutorizadas={getDietaEspecialAutorizadasEscola}
    getDietaEspecialNegadas={getDietaEspecialNegadasEscola}
    getDietaEspecialCanceladas={getDietaEspecialCanceladasEscola}
    getDietaEspecialAutorizadasTemporariamente={
      getDietaEspecialAutorizadasTemporariamenteEscola
    }
    getDietaEspecialAguardandoVigencia={
      getDietaEspecialAguardandoVigenciaEscola
    }
    getDietaEspecialInativasTemporariamente={
      getDietaEspecialInativasTemporariamenteEscola
    }
    getDietaEspecialInativas={getDietaEspecialInativasEscola}
  />
);

// DRE
export const DietaEspecialDRE = () => (
  <DietaEspecialBase
    visao={DRE}
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
export const DietaEspecialCODAE = () => (
  <DietaEspecialBase
    visao={CODAE}
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
export const DietaEspecialTerceirizada = () => (
  <DietaEspecialBase
    visao={TERCEIRIZADA}
    getDietaEspecialPendenteAutorizacao={
      getDietaEspecialPendenteAutorizacaoTerceirizada
    }
    getDietaEspecialAutorizadas={getDietaEspecialAutorizadasTerceirizada}
    getDietaEspecialNegadas={getDietaEspecialNegadasTerceirizada}
    getDietaEspecialCanceladas={getDietaEspecialCanceladasTerceirizada}
    getDietaEspecialInativasTemporariamente={
      getDietaEspecialInativasTemporariamenteTerceirizada
    }
    getDietaEspecialAguardandoVigencia={
      getDietaEspecialAguardandoVigenciaTerceirizada
    }
    getDietaEspecialAutorizadasTemporariamente={
      getDietaEspecialAutorizadasTemporariamenteTerceirizada
    }
    getDietaEspecialInativas={getDietaEspecialInativasTerceirizada}
  />
);

// Detalhes do aluno

const atualAluno = {
  href: `/${ALUNO}/${DIETA_ESPECIAL}`,
  titulo: "Detalhes da Dieta do Aluno",
};

export const DietaEspecialAluno = () => (
  <Page botaoVoltar titulo="Detalhes da Dieta do Aluno">
    <Breadcrumb home={HOME} atual={atualAluno} />
    <SolicitacaoDietaEspecial />
  </Page>
);
