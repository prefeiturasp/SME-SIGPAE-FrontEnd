import {
  ACOMPANHAMENTO_DE_LANCAMENTOS,
  CLAUSULAS_PARA_DESCONTOS,
  CONTROLE_DE_FREQUENCIA,
  EMPENHOS,
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  MEDICAO_INICIAL,
  PARAMETRIZACAO_FINANCEIRA,
  RELATORIO_ADESAO,
  RELATORIO_FINANCEIRO,
  RELATORIOS,
} from "src/configs/constants";
import {
  escolaEhCei,
  escolaEhCEMEI,
  exibirModuloMedicaoInicial,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
  usuarioEhMedicao,
  usuarioEhEmpresaTerceirizada,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhAdministradorNutriSupervisao,
} from "src/helpers/utilities";
import React from "react";
import { LeafItem, Menu, SubMenu } from "./shared";

const MenuLancamentoInicial = ({ activeSubmenu, onSubmenuLancamentoClick }) => {
  const exibeCadastros = usuarioEhMedicao();
  const exibeRelatorios =
    usuarioEhMedicao() ||
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhDRE() ||
    usuarioEhEscolaTerceirizadaQualquerPerfil() ||
    usuarioEhDinutreDiretoria() ||
    usuarioEhEmpresaTerceirizada() ||
    usuarioEhCoordenadorNutriSupervisao() ||
    usuarioEhAdministradorNutriSupervisao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEGabinete();

  return (
    exibirModuloMedicaoInicial() && (
      <Menu
        id="LancamentoInicial"
        icon="fas fa-tachometer-alt"
        title={"Medição Inicial"}
        dataTestId="medicao-inicial"
      >
        {(usuarioEhEscolaTerceirizada() ||
          usuarioEhEscolaTerceirizadaQualquerPerfil()) && (
          <LeafItem to={`/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}`}>
            Lançamento Medição Inicial
          </LeafItem>
        )}
        {exibeRelatorios && (
          <LeafItem to={`/${MEDICAO_INICIAL}/${ACOMPANHAMENTO_DE_LANCAMENTOS}`}>
            Acompanhamento de Lançamentos
          </LeafItem>
        )}
        {usuarioEhMedicao() && (
          <LeafItem to={`/${MEDICAO_INICIAL}/${RELATORIO_FINANCEIRO}`}>
            Relatório Financeiro
          </LeafItem>
        )}
        {(escolaEhCEMEI() || escolaEhCei()) && (
          <LeafItem to={`/${MEDICAO_INICIAL}/${CONTROLE_DE_FREQUENCIA}`}>
            Controle de Frequência de Alunos
          </LeafItem>
        )}
        {exibeCadastros && (
          <SubMenu
            icon="fa-chevron-down"
            onClick={onSubmenuLancamentoClick}
            title="Cadastros"
            activeMenu={activeSubmenu}
          >
            <LeafItem to={`/${MEDICAO_INICIAL}/${EMPENHOS}`}>Empenhos</LeafItem>
            <LeafItem to={`/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}`}>
              Cláusulas para Descontos
            </LeafItem>
            <LeafItem to={`/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}`}>
              Parametrização Financeira
            </LeafItem>
          </SubMenu>
        )}
        {exibeRelatorios && (
          <SubMenu
            path="relatorios"
            icon="fa-chevron-down"
            onClick={onSubmenuLancamentoClick}
            title="Relatórios"
            activeMenu={activeSubmenu}
            dataTestId="relatorios-me"
          >
            <LeafItem
              to={`/${MEDICAO_INICIAL}/${RELATORIOS}/${RELATORIO_ADESAO}`}
            >
              Relatório de Adesão
            </LeafItem>
          </SubMenu>
        )}
      </Menu>
    )
  );
};

export default MenuLancamentoInicial;
