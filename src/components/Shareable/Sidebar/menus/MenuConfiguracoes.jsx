import {
  ATUALIZACAO_EMAIL_EOL,
  CARGAS_USUARIOS,
  CARGAS_USUARIOS_SERVIDORES,
  CONFIGURACOES,
  GERENCIAMENTO_EMAILS,
  GESTAO_ACESSO_CODAE_DILOG,
  GESTAO_ACESSO_COGESTOR,
  GESTAO_ACESSO_DIRETOR_ESCOLA,
  GESTAO_ACESSO_EMPRESA,
  GESTAO_ACESSO_GERAL,
  GESTAO_ACESSO_MASTER,
} from "src/configs/constants";
import {
  usuarioEhAdministradorCONTRATOS,
  usuarioEhAdministradorGpCODAE,
  usuarioEhAdministradorRepresentanteCodae,
  usuarioEhAdmQualquerEmpresa,
  usuarioEhCODAEDietaEspecial,
  usuarioEhCodaeDilog,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCogestorDRE,
  usuarioEhCoordenadorCODAE,
  usuarioEhCoordenadorGpCODAE,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhDilogDiretoria,
  usuarioEhDiretorUE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhGticCODAE,
} from "src/helpers/utilities";
import { LeafItem, Menu, SubMenu } from "./shared";

const MenuConfiguracoes = ({ activeMenu, onSubmenuClick }) => {
  const exibirConfigEmail =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhEmpresaTerceirizada();
  const exibirGerenciamentoEmails =
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAEDietaEspecial() ||
    usuarioEhCoordenadorGpCODAE();

  const exibirGestaoUsuarioMaster =
    usuarioEhCodaeDilog() ||
    usuarioEhCoordenadorCODAE() ||
    usuarioEhGticCODAE();

  const exibirGestaoAcesso =
    usuarioEhAdministradorGpCODAE() ||
    usuarioEhCoordenadorNutriCODAE() ||
    usuarioEhCoordenadorGpCODAE() ||
    usuarioEhCoordenadorNutriSupervisao();

  const exibirGestaoAcessoSomenteLeitura =
    usuarioEhCODAEGabinete() || usuarioEhDilogDiretoria();

  return (
    <Menu
      id="Configuracoes"
      icon="fa-cog"
      title={"Configurações"}
      dataTestId="menu-configuracoes"
    >
      {exibirConfigEmail && (
        <>
          <LeafItem to={`/${CONFIGURACOES}`}>Disparo de E-mail</LeafItem>
        </>
      )}
      {exibirGerenciamentoEmails && (
        <LeafItem to={`/${CONFIGURACOES}/${GERENCIAMENTO_EMAILS}`}>
          Gerenciamento de E-mails
        </LeafItem>
      )}

      {exibirGestaoUsuarioMaster && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Gestão de Usuários"
          activeMenu={activeMenu}
        >
          <LeafItem to={`/${CONFIGURACOES}/${GESTAO_ACESSO_MASTER}/`}>
            Gestão de Acesso
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CARGAS_USUARIOS}/`}>
            Cargas de Usuários
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${ATUALIZACAO_EMAIL_EOL}/`}>
            Atualização de E-mail do EOL
          </LeafItem>
        </SubMenu>
      )}

      {usuarioEhAdministradorRepresentanteCodae() && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Gestão de Usuários"
          activeMenu={activeMenu}
          dataTestId="submenu-gst-usuarios"
        >
          <LeafItem to={`/${CONFIGURACOES}/${GESTAO_ACESSO_CODAE_DILOG}/`}>
            Gestão de Acesso
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CARGAS_USUARIOS_SERVIDORES}/`}>
            Cargas de Usuários
          </LeafItem>
        </SubMenu>
      )}

      {usuarioEhDiretorUE() && (
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

      {usuarioEhCogestorDRE() && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Gestão de Usuários"
          activeMenu={activeMenu}
          dataTestId="gestao-de-usuarios"
        >
          <LeafItem to={`/${CONFIGURACOES}/${GESTAO_ACESSO_COGESTOR}/`}>
            Gestão de Acesso
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${ATUALIZACAO_EMAIL_EOL}/`}>
            Atualização de E-mail do EOL
          </LeafItem>
        </SubMenu>
      )}

      {(usuarioEhAdmQualquerEmpresa() || usuarioEhAdministradorCONTRATOS()) && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Gestão de Usuários"
          activeMenu={activeMenu}
          dataTestId="submenu-gst-usuarios"
        >
          <LeafItem to={`/${CONFIGURACOES}/${GESTAO_ACESSO_EMPRESA}/`}>
            Gestão de Acesso
          </LeafItem>
        </SubMenu>
      )}

      {exibirGestaoAcesso && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Gestão de Usuários"
          activeMenu={activeMenu}
        >
          <LeafItem to={`/${CONFIGURACOES}/${GESTAO_ACESSO_GERAL}/`}>
            Gestão de Acesso
          </LeafItem>
        </SubMenu>
      )}

      {exibirGestaoAcessoSomenteLeitura && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Gestão de Usuários"
          activeMenu={activeMenu}
        >
          <LeafItem to={`/${CONFIGURACOES}/${GESTAO_ACESSO_MASTER}/`}>
            Gestão de Acesso
          </LeafItem>
        </SubMenu>
      )}
    </Menu>
  );
};

export default MenuConfiguracoes;
