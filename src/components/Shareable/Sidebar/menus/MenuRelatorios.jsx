import React from "react";
import { Menu, LeafItem } from "./shared";
import {
  usuarioEhCODAEDietaEspecial,
  usuarioEhCODAEGestaoProduto,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhNutricionistaSupervisao,
  usuarioEhTerceirizada,
  usuarioEhEscola,
  usuarioEhDRE,
  usuarioEscolaEhGestaoDireta,
  usuarioEscolaEhGestaoMistaParceira
} from "helpers/utilities";
import * as constants from "configs/constants";

const MenuRelatorios = () => {
  const exibirProdutosHomologados =
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAEGestaoProduto() ||
    (usuarioEhEscola() &&
      !usuarioEscolaEhGestaoMistaParceira() &&
      !usuarioEscolaEhGestaoDireta()) ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhTerceirizada() ||
    usuarioEhCODAENutriManifestacao();

  const exibirQuantitativoPorTerceirizada = usuarioEhCODAEGestaoProduto();
  const exibirRelatorioAnaliseSensorial =
    usuarioEhTerceirizada() || usuarioEhCODAEGestaoProduto();

  const exibirMenuTodosPerfis =
    usuarioEhCODAEGestaoProduto() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhTerceirizada() ||
    (usuarioEhEscola() &&
      !usuarioEscolaEhGestaoMistaParceira() &&
      !usuarioEscolaEhGestaoDireta()) ||
    usuarioEhCODAEDietaEspecial();

  const exibirProdutosSuspensos =
    usuarioEhCODAEGestaoProduto() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhTerceirizada() ||
    (usuarioEhEscola() &&
      !usuarioEscolaEhGestaoMistaParceira() &&
      !usuarioEscolaEhGestaoDireta()) ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhCODAENutriManifestacao();

  const exibirRelatorioQuantitativoSolicDietaEsp =
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhDRE() ||
    (usuarioEhEscola() && !usuarioEscolaEhGestaoDireta());

  const exibeRelatorioDietasEspeciais = usuarioEhTerceirizada();

  return (
    <Menu id="Relatorios" icon="fa-file-alt" title={"Relatórios"}>
      {exibirProdutosHomologados && (
        <LeafItem
          to={`/${constants.GESTAO_PRODUTO}/relatorios/produtos-homologados`}
        >
          Produtos Homologados
        </LeafItem>
      )}
      {exibirQuantitativoPorTerceirizada && (
        <LeafItem
          to={`/${
            constants.GESTAO_PRODUTO
          }/relatorios/quantitativo-por-terceirizada`}
        >
          Quantitativo Por Terceirizada
        </LeafItem>
      )}
      {exibirProdutosSuspensos && (
        <LeafItem
          to={`/${constants.GESTAO_PRODUTO}/relatorio-produtos-suspensos`}
        >
          Produtos suspensos
        </LeafItem>
      )}

      {exibirRelatorioAnaliseSensorial && (
        <LeafItem
          to={`/${constants.GESTAO_PRODUTO}/relatorio-analise-sensorial`}
        >
          Produtos em a. sensorial
        </LeafItem>
      )}

      {exibirMenuTodosPerfis && (
        <LeafItem
          to={`/${constants.GESTAO_PRODUTO}/${
            constants.RELATORIO_SITUACAO_PRODUTO
          }`}
        >
          Relatório Situação Produto
        </LeafItem>
      )}
      {exibirMenuTodosPerfis && (
        <LeafItem
          to={`/${constants.GESTAO_PRODUTO}/${
            constants.RELATORIO_RECLAMACAO_PRODUTO
          }`}
        >
          Relatório de reclamação de produto
        </LeafItem>
      )}
      {exibirRelatorioQuantitativoSolicDietaEsp && (
        <LeafItem
          to={`/${constants.DIETA_ESPECIAL}/${
            constants.RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP
          }`}
        >
          Relatório quant. solic. dieta esp.
        </LeafItem>
      )}
      {exibirRelatorioQuantitativoSolicDietaEsp && (
        <LeafItem
          to={`/${constants.DIETA_ESPECIAL}/${
            constants.RELATORIO_QUANTITATIVO_DIAG_DIETA_ESP
          }`}
        >
          Relatório quant. diag. dieta esp.
        </LeafItem>
      )}
      {exibirRelatorioQuantitativoSolicDietaEsp && (
        <LeafItem
          to={`/${constants.DIETA_ESPECIAL}/${
            constants.RELATORIO_QUANTITATIVO_CLASSIFICACAO_DIETA_ESP
          }`}
        >
          Relatório quant. class. dieta esp.
        </LeafItem>
      )}
      {exibirRelatorioQuantitativoSolicDietaEsp && (
        <LeafItem
          to={`/${constants.DIETA_ESPECIAL}/${
            constants.RELATORIO_GESTAO_DIETA_ESPECIAL
          }`}
        >
          Relatório de gestão de dieta esp.
        </LeafItem>
      )}
      {exibeRelatorioDietasEspeciais && (
        <LeafItem
          to={`/${constants.DIETA_ESPECIAL}/${
            constants.RELATORIO_DIETA_ESPECIAL
          }`}
        >
          Relatório de Dietas Especiais
        </LeafItem>
      )}
    </Menu>
  );
};

export default MenuRelatorios;
