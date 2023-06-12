import React, { useState, useCallback } from "react";
import {
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhCODAEDietaEspecial,
  usuarioEhEscolaAbastecimento,
  usuarioEhEmpresaTerceirizada,
  usuarioEhCODAEGestaoProduto,
  usuarioEhNutricionistaSupervisao,
  usuarioEhDRE,
  usuarioEhLogistica,
  usuarioEhPreRecebimento,
  usuarioEhAdministradorGpCODAE,
  usuarioEhAdministradorNutriSupervisao,
  usuarioEhEmpresaDistribuidora,
  usuarioComAcessoTelaEntregasDilog,
  usuarioEscolaEhGestaoDireta,
  usuarioEhMedicao,
  exibirGA,
  usuarioEhDilogQualidadeOuCronograma,
  usuarioEhOutrosDilog,
  usuarioEhPreRecebimentoSemLogistica,
  usuarioEhEmpresaFornecedor,
  usuarioEhAdministradorRepresentanteCodae,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaAbastecimentoDiretor,
  usuarioEhQualquerUsuarioEmpresa,
  exibirModuloMedicaoInicial,
  usuarioEhCodaeDilog,
  usuarioEhDilog
} from "helpers/utilities";
import { ListItem } from "./menus/shared";
import {
  MenuGestaoDeAlimentacao,
  MenuDietaEspecial,
  MenuCadastros,
  MenuConfiguracoes,
  MenuGestaoDeProduto,
  MenuLancamentoInicial,
  MenuRelatorios,
  MenuLogistica,
  MenuPreRecebimento
} from "./menus";

export const SidebarContent = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const [activeMenuCadastros, setActiveMenuCadastros] = useState("");

  const onSubmenuClick = useCallback(
    clickedMenu => {
      setActiveMenu(clickedMenu === activeMenu ? "" : clickedMenu);
    },
    [activeMenu]
  );

  const onSubmenuCadastroClick = useCallback(
    clickedMenu => {
      setActiveMenuCadastros(
        clickedMenu === activeMenuCadastros ? "" : clickedMenu
      );
    },
    [activeMenuCadastros]
  );

  // NOTE: essas condicoes consideram apenas codae e terceirizada.
  // Para utilizar esse componente com outros perfis precisa atualizar os
  // criterios de exibicao abaixo
  const exibeMenuValidandoAmbiente = exibirGA();
  const exibirPainelInicial =
    !usuarioEhEscolaAbastecimento() &&
    !usuarioEhEscolaAbastecimentoDiretor() &&
    !usuarioComAcessoTelaEntregasDilog() &&
    !usuarioEhLogistica() &&
    !usuarioEhEmpresaDistribuidora();
  const exibirGestaoAlimentacao =
    exibeMenuValidandoAmbiente &&
    (usuarioEhCODAEGestaoAlimentacao() ||
      usuarioEhCODAENutriManifestacao() ||
      usuarioEhDRE() ||
      usuarioEhMedicao() ||
      usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEmpresaTerceirizada() ||
      usuarioEhNutricionistaSupervisao());
  const exibirDietaEspecial =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEhDRE() ||
    usuarioEhEmpresaTerceirizada() ||
    usuarioEhMedicao();
  const exibirGestaoProduto =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEGestaoProduto() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEhDRE() ||
    usuarioEhEmpresaTerceirizada();
  const exibirCadastros =
    usuarioEhCodaeDilog() ||
    usuarioEhMedicao() ||
    usuarioEhDilogQualidadeOuCronograma() ||
    (!exibeMenuValidandoAmbiente && usuarioEhCODAEGestaoAlimentacao()) ||
    (exibeMenuValidandoAmbiente &&
      (usuarioEhCODAEGestaoAlimentacao() ||
        usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhEscolaTerceirizada()));
  const exibirRelatorios =
    !usuarioEhEscolaAbastecimento() &&
    !usuarioEhEscolaAbastecimentoDiretor() &&
    !usuarioEhEscolaAbastecimentoDiretor() &&
    !usuarioComAcessoTelaEntregasDilog() &&
    !usuarioEhLogistica() &&
    !usuarioEhEmpresaDistribuidora() &&
    !usuarioEhEmpresaFornecedor() &&
    !usuarioEscolaEhGestaoDireta() &&
    !usuarioEhMedicao() &&
    !usuarioEhPreRecebimento() &&
    !usuarioEhAdministradorRepresentanteCodae();

  const exibirConfiguracoes =
    !usuarioEhEscolaTerceirizada() &&
    !usuarioEhAdministradorGpCODAE() &&
    !usuarioEhAdministradorNutriSupervisao() &&
    !usuarioEhEscolaAbastecimento() &&
    !usuarioEhOutrosDilog() &&
    !usuarioEhPreRecebimentoSemLogistica() &&
    !usuarioEhQualquerUsuarioEmpresa() &&
    !usuarioEhDilog();

  const exibirMenuLogistica =
    usuarioEhLogistica() ||
    usuarioEhEmpresaDistribuidora() ||
    usuarioEhDRE() ||
    usuarioEhEscolaAbastecimento() ||
    usuarioEhEscolaAbastecimentoDiretor() ||
    usuarioComAcessoTelaEntregasDilog();

  const exibirMenuPreRecebimento =
    usuarioEhPreRecebimento() || usuarioEhEmpresaFornecedor();

  const _props = {
    activeMenu,
    onSubmenuClick: onSubmenuClick,
    activeMenuCadastros,
    onSubmenuCadastroClick: onSubmenuCadastroClick
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
    exibirCadastros && <MenuCadastros key={5} />,
    exibirModuloMedicaoInicial() && <MenuLancamentoInicial key={6} />,
    exibirMenuLogistica && <MenuLogistica key={7} {..._props} />,
    exibirRelatorios && <MenuRelatorios key={8} />,
    exibirConfiguracoes && <MenuConfiguracoes key={9} {..._props} />,
    exibirMenuPreRecebimento && <MenuPreRecebimento key={10} />
  ];
};
