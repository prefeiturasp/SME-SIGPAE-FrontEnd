import React from "react";
import { Menu, LeafItem, SubMenu } from "./shared";
import {
  CONFIGURACOES,
  PERMISSOES,
  MENSAGEM,
  GERENCIAMENTO_EMAILS,
  GESTAO_ACESSO_CODAE_DILOG,
  GESTAO_ACESSO_DIRETOR_ESCOLA,
  CARGAS_USUARIOS,
  GESTAO_ACESSO_EMPRESA
} from "configs/constants";
import {
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAEDietaEspecial,
  usuarioEhDiretorEscola,
  usuarioEhTerceirizada,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhDRE,
  usuarioEhCoordenadorGpCODAE,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhCoordenadorCODAE,
  usuarioEhLogistica,
  usuarioEhEmpresa,
  usuarioEhAdministradorRepresentanteCodae
} from "helpers/utilities";

const MenuConfiguracoes = ({ activeMenu, onSubmenuClick }) => {
  const exibirPermissoes =
    usuarioEhCoordenadorNutriCODAE() ||
    usuarioEhCoordenadorGpCODAE() ||
    usuarioEhCoordenadorCODAE() ||
    usuarioEhDRE() ||
    usuarioEhCoordenadorNutriSupervisao() ||
    usuarioEhTerceirizada();
  const exibirConfigEmail =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhTerceirizada();
  const exibirGerenciamentoEmails =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhCoordenadorGpCODAE();

  const exibirGestaoUsuario =
    usuarioEhLogistica() ||
    usuarioEhCoordenadorCODAE() ||
    usuarioEhAdministradorRepresentanteCodae();

  return (
    <Menu id="Configuracoes" icon="fa-cog" title={"Configurações"}>
      {exibirPermissoes && (
        <LeafItem to={`/${CONFIGURACOES}/${PERMISSOES}`}>Permissões</LeafItem>
      )}

      {exibirConfigEmail && (
        <>
          <LeafItem to={`/${CONFIGURACOES}`}>Disparo de E-mail</LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${MENSAGEM}`}>
            Configuração de Mensagem
          </LeafItem>
        </>
      )}
      {exibirGerenciamentoEmails && (
        <LeafItem to={`/${CONFIGURACOES}/${GERENCIAMENTO_EMAILS}`}>
          Gerenciamento de E-mails
        </LeafItem>
      )}

      {exibirGestaoUsuario && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Gestão de Usuários"
          activeMenu={activeMenu}
        >
          <LeafItem to={`/${CONFIGURACOES}/${GESTAO_ACESSO_CODAE_DILOG}/`}>
            Gestão de Acesso
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CARGAS_USUARIOS}/`}>
            Cargas de Usuários
          </LeafItem>
        </SubMenu>
      )}

      {usuarioEhDiretorEscola() && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Gestão de Usuários"
          activeMenu={activeMenu}
        >
          <LeafItem to={`/${CONFIGURACOES}/${GESTAO_ACESSO_DIRETOR_ESCOLA}/`}>
            Gestão de Acesso
          </LeafItem>
        </SubMenu>
      )}

      {usuarioEhEmpresa() && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Gestão de Usuários"
          activeMenu={activeMenu}
        >
          <LeafItem to={`/${CONFIGURACOES}/${GESTAO_ACESSO_EMPRESA}/`}>
            Gestão de Acesso
          </LeafItem>
        </SubMenu>
      )}
    </Menu>
  );
};

export default MenuConfiguracoes;
