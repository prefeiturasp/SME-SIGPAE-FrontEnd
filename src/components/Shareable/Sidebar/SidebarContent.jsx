import React, { useCallback, useState } from "react";

import { ENVIRONMENT } from "src/constants/config";
import {
  ehUsuarioRelatorios,
  exibirGA,
  exibirModuloMedicaoInicial,
  usuarioComAcessoTelaEntregasDilog,
  usuarioEhAdministradorCONTRATOS,
  usuarioEhAdministradorGpCODAE,
  usuarioEhAdministradorNutriSupervisao,
  usuarioEhAdministradorRepresentanteCodae,
  usuarioEhCODAEDietaEspecial,
  usuarioEhCodaeDilog,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAEGestaoProduto,
  usuarioEhCODAENutriManifestacao,
  usuarioEhCoordenadorGpCODAE,
  usuarioEhDilog,
  usuarioEhDilogDiretoria,
  usuarioEhDilogQualidadeOuCronograma,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
  usuarioEhEmpresaDistribuidora,
  usuarioEhEmpresaFornecedor,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaAbastecimento,
  usuarioEhEscolaAbastecimentoDiretor,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhGticCODAE,
  usuarioEhLogistica,
  usuarioEhMedicao,
  usuarioEhNutricionistaSupervisao,
  usuarioEhOrgaoFiscalizador,
  usuarioEhOutrosDilog,
  usuarioEhPreRecebimento,
  usuarioEhPreRecebimentoSemLogistica,
  usuarioEhQualquerUsuarioEmpresa,
  usuarioEhRecebimento,
  usuarioEscolaEhGestaoDireta,
  usuarioEscolaEhGestaoParceira,
  usuarioEhCronograma,
  usuarioEhDilogAbastecimento,
} from "src/helpers/utilities";

import {
  MenuCadastros,
  MenuConfiguracoes,
  MenuDietaEspecial,
  MenuGestaoDeAlimentacao,
  MenuGestaoDeProduto,
  MenuLancamentoInicial,
  MenuLogistica,
  MenuPreRecebimento,
  MenuRecebimento,
  MenuRelatorios,
} from "./menus";
import { MenuSupervisao } from "./menus/MenuSupervisao";
import { ListItem } from "./menus/shared";
import { usuarioEhDilogVisualizacao } from "../../../helpers/utilities";

export const SidebarContent = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const [activeMenuCadastros, setActiveMenuCadastros] = useState("");
  const [activeSubmenu, setActiveSubMenu] = useState("");

  const onSubmenuClick = useCallback(
    (clickedMenu) => {
      setActiveMenu(clickedMenu === activeMenu ? "" : clickedMenu);
    },
    [activeMenu],
  );

  const onSubmenuCadastroClick = useCallback(
    (clickedMenu) => {
      setActiveMenuCadastros(
        clickedMenu === activeMenuCadastros ? "" : clickedMenu,
      );
    },
    [activeMenuCadastros],
  );

  const onSubmenuLancamentoClick = useCallback(
    (clickedMenu) => {
      setActiveSubMenu(clickedMenu === activeSubmenu ? "" : clickedMenu);
    },
    [activeSubmenu],
  );

  // NOTE: essas condicoes consideram apenas codae e terceirizada.
  // Para utilizar esse componente com outros perfis precisa atualizar os
  // criterios de exibicao abaixo
  const exibeMenuValidandoAmbiente = exibirGA();

  const usuarioEscolaEhGestaoDiretaParceira =
    (usuarioEscolaEhGestaoDireta() || usuarioEscolaEhGestaoParceira()) &&
    !["production"].includes(ENVIRONMENT);

  const exibirPainelInicial =
    (!usuarioEhEscolaAbastecimento() || usuarioEscolaEhGestaoDiretaParceira) &&
    !usuarioEhEscolaAbastecimentoDiretor() &&
    (!usuarioComAcessoTelaEntregasDilog() || usuarioEhCODAEGabinete()) &&
    !usuarioEhLogistica() &&
    !usuarioEhEmpresaDistribuidora() &&
    !ehUsuarioRelatorios();
  const exibirGestaoAlimentacao =
    exibeMenuValidandoAmbiente &&
    (usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhDRE() ||
      usuarioEhMedicao() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhNutricionistaSupervisao() ||
      usuarioEhCODAEGabinete() ||
      ehUsuarioRelatorios() ||
      usuarioEhGticCODAE() ||
      usuarioEhDinutreDiretoria());
  const exibirDietaEspecial =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEhDRE() ||
    usuarioEhEmpresaTerceirizada() ||
    usuarioEhMedicao() ||
    usuarioEhCODAEGabinete() ||
    usuarioEscolaEhGestaoDiretaParceira ||
    ehUsuarioRelatorios() ||
    usuarioEhGticCODAE() ||
    usuarioEhDinutreDiretoria();
  const exibirGestaoProduto =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEGestaoProduto() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEhDRE() ||
    usuarioEhEmpresaTerceirizada() ||
    usuarioEhOrgaoFiscalizador() ||
    usuarioEhCODAEGabinete() ||
    usuarioEhDinutreDiretoria();
  const exibirCadastros =
    usuarioEhCodaeDilog() ||
    usuarioEhMedicao() ||
    usuarioEhAdministradorCONTRATOS() ||
    usuarioEhDilogQualidadeOuCronograma() ||
    usuarioEhDilogVisualizacao() ||
    usuarioEhEmpresaFornecedor() ||
    usuarioEhCODAEGestaoProduto() ||
    (!exibeMenuValidandoAmbiente && usuarioEhCODAEGestaoAlimentacao()) ||
    (exibeMenuValidandoAmbiente &&
      (usuarioEhCODAEGestaoAlimentacao() ||
        usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhEscolaTerceirizada()));
  const exibirRelatorios =
    (!usuarioEhEscolaAbastecimento() &&
      !usuarioEhEscolaAbastecimentoDiretor() &&
      !usuarioEhEscolaAbastecimentoDiretor() &&
      !(usuarioComAcessoTelaEntregasDilog() && !usuarioEhCODAEGabinete()) &&
      !usuarioEhLogistica() &&
      !usuarioEhEmpresaDistribuidora() &&
      !usuarioEhEmpresaFornecedor() &&
      !usuarioEscolaEhGestaoDireta() &&
      !usuarioEhMedicao() &&
      !usuarioEhPreRecebimento() &&
      !usuarioEhAdministradorRepresentanteCodae() &&
      !usuarioEhAdministradorCONTRATOS()) ||
    usuarioEhDinutreDiretoria();

  const exibirConfiguracoes =
    !usuarioEhEscolaTerceirizada() &&
    !usuarioEhAdministradorNutriSupervisao() &&
    !usuarioEhEscolaAbastecimento() &&
    !usuarioEhOutrosDilog() &&
    !usuarioEhPreRecebimentoSemLogistica() &&
    !usuarioEhQualquerUsuarioEmpresa() &&
    !usuarioEhDilog() &&
    !usuarioEhOrgaoFiscalizador() &&
    !usuarioEhDinutreDiretoria() &&
    !ehUsuarioRelatorios() &&
    !usuarioEhDilogVisualizacao();

  const exibirMenuLogistica =
    usuarioEhLogistica() ||
    usuarioEhEmpresaDistribuidora() ||
    usuarioEhDRE() ||
    usuarioEhEscolaAbastecimento() ||
    usuarioEhEscolaAbastecimentoDiretor() ||
    usuarioComAcessoTelaEntregasDilog() ||
    usuarioEhCODAEGabinete() ||
    usuarioEhDilogDiretoria();

  const exibirMenuPreRecebimento =
    usuarioEhPreRecebimento() ||
    usuarioEhEmpresaFornecedor() ||
    usuarioEhCoordenadorGpCODAE() ||
    usuarioEhAdministradorGpCODAE() ||
    usuarioEhCODAEGabinete() ||
    usuarioEhGticCODAE();

  const exibirMenuRecebimento =
    usuarioEhRecebimento() ||
    usuarioEhCronograma() ||
    usuarioEhDilogAbastecimento() ||
    usuarioEhCodaeDilog() ||
    usuarioEhDilogDiretoria();

  const exibirMenuSupervisao =
    (usuarioEhNutricionistaSupervisao() ||
      usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhMedicao() ||
      usuarioEhCODAENutriManifestacao()) &&
    !ENVIRONMENT.includes("production");

  const _props = {
    activeMenu,
    onSubmenuClick: onSubmenuClick,
    activeMenuCadastros,
    onSubmenuCadastroClick: onSubmenuCadastroClick,
    activeSubmenu,
    onSubmenuLancamentoClick: onSubmenuLancamentoClick,
  };

  return [
    exibirPainelInicial && (
      <ListItem key={0} icon="fa-home" to={"/"}>
        Painel Inicial
      </ListItem>
    ),
    exibirGestaoAlimentacao && <MenuGestaoDeAlimentacao key={1} {..._props} />,
    exibirDietaEspecial && <MenuDietaEspecial key={2} {..._props} />,
    exibirGestaoProduto && <MenuGestaoDeProduto key={3} {..._props} />,
    exibirCadastros && <MenuCadastros key={4} />,
    exibirModuloMedicaoInicial() && (
      <MenuLancamentoInicial key={5} {..._props} />
    ),
    exibirMenuSupervisao && <MenuSupervisao key={6} {..._props} />,
    exibirRelatorios && <MenuRelatorios key={7} />,
    exibirMenuLogistica && <MenuLogistica key={8} {..._props} />,
    exibirMenuPreRecebimento && <MenuPreRecebimento key={9} {..._props} />,
    exibirMenuRecebimento && <MenuRecebimento key={10} />,
    exibirConfiguracoes && <MenuConfiguracoes key={11} {..._props} />,
  ];
};
