import {
  ALTERACAO_TIPO_ALIMENTACAO,
  CADASTROS,
  CODAE,
  CONSULTA_KITS,
  DRE,
  ESCOLA,
  INCLUSAO_ALIMENTACAO,
  INVERSAO_CARDAPIO,
  NUTRIMANIFESTACAO,
  NUTRISUPERVISAO,
  RELATORIO_SOLICITACOES_ALIMENTACAO,
  SOLICITACAO_KIT_LANCHE,
  SOLICITACAO_KIT_LANCHE_UNIFICADA,
  SOLICITACOES_AUTORIZADAS,
  SOLICITACOES_CANCELADAS,
  SOLICITACOES_COM_QUESTIONAMENTO,
  SOLICITACOES_NEGADAS,
  SOLICITACOES_PENDENTES,
  SUSPENSAO_ALIMENTACAO,
  TERCEIRIZADA,
  USUARIO_RELATORIOS,
} from "src/configs/constants";
import {
  ehUsuarioRelatorios,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhGticCODAE,
  usuarioEhMedicao,
  usuarioEhNutricionistaSupervisao,
  usuarioEscolaEhGestaoDireta,
} from "src/helpers/utilities";
import React from "react";
import { LeafItem, Menu, SubMenu } from "./shared";

const MenuGestaoDeAlimentacao = ({ activeMenu, onSubmenuClick }) => {
  const exibeMenuNovasSolicitacoes =
    usuarioEhEscolaTerceirizada() ||
    usuarioEhEscolaTerceirizadaDiretor() ||
    usuarioEhDRE();
  const exibeMenuConsultaDeSolicitacoes =
    !usuarioEscolaEhGestaoDireta() &&
    !ehUsuarioRelatorios() &&
    !usuarioEhGticCODAE();
  const PERFIL =
    usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor()
      ? ESCOLA
      : usuarioEhDRE()
        ? DRE
        : usuarioEhCODAEGestaoAlimentacao()
          ? CODAE
          : usuarioEhCODAENutriManifestacao() ||
              usuarioEhMedicao() ||
              usuarioEhCODAEGabinete() ||
              usuarioEhDinutreDiretoria()
            ? NUTRIMANIFESTACAO
            : usuarioEhNutricionistaSupervisao()
              ? NUTRISUPERVISAO
              : ehUsuarioRelatorios()
                ? USUARIO_RELATORIOS
                : TERCEIRIZADA;
  return (
    <Menu
      id="GestaoAlimentacao"
      icon="fa-utensils"
      title={"Gestão de Alimentação"}
      dataTestId="gestao-alimentacao"
    >
      {!ehUsuarioRelatorios() && !usuarioEhGticCODAE() && (
        <LeafItem to="/painel-gestao-alimentacao">
          Painel de Solicitações
        </LeafItem>
      )}
      {exibeMenuNovasSolicitacoes && (
        <SubMenu
          icon="fa-chevron-down"
          path="novas-solicitacoes"
          onClick={onSubmenuClick}
          title="Novas Solicitações"
          activeMenu={activeMenu}
        >
          {!usuarioEhDRE() && (
            <>
              <LeafItem to={`/${ESCOLA}/${INCLUSAO_ALIMENTACAO}`}>
                Inclusão de Alimentação
              </LeafItem>
              <LeafItem to={`/${ESCOLA}/${ALTERACAO_TIPO_ALIMENTACAO}`}>
                Alteração do Tipo de Alimentação
              </LeafItem>
              <LeafItem to={`/${ESCOLA}/${SOLICITACAO_KIT_LANCHE}`}>
                Kit Lanche Passeio
              </LeafItem>
              <LeafItem to={`/${ESCOLA}/${INVERSAO_CARDAPIO}`}>
                Inversão de Dia de Cardápio
              </LeafItem>
              <LeafItem to={`/${ESCOLA}/${SUSPENSAO_ALIMENTACAO}`}>
                Suspensão de Alimentação
              </LeafItem>
            </>
          )}
          {usuarioEhDRE() && (
            <LeafItem to={`/${DRE}/${SOLICITACAO_KIT_LANCHE_UNIFICADA}`}>
              Solicitação Unificada
            </LeafItem>
          )}
        </SubMenu>
      )}
      {exibeMenuConsultaDeSolicitacoes && (
        <SubMenu
          icon="fa-chevron-down"
          path="consulta-solicitacoes"
          onClick={onSubmenuClick}
          title="Consulta de Solicitações"
          dataTestId="consulta-solicitacoes"
          activeMenu={activeMenu}
        >
          {PERFIL === "nutrisupervisao" && (
            <LeafItem to={`/${PERFIL}/${SOLICITACOES_COM_QUESTIONAMENTO}`}>
              Aguardando resposta da empresa
            </LeafItem>
          )}
          {PERFIL === "terceirizada" ? (
            <LeafItem to={`/${PERFIL}/${SOLICITACOES_COM_QUESTIONAMENTO}`}>
              Questionamentos da CODAE
            </LeafItem>
          ) : (
            !usuarioEhCODAENutriManifestacao() &&
            !usuarioEscolaEhGestaoDireta() &&
            !usuarioEhMedicao() &&
            !usuarioEhCODAEGabinete() &&
            !usuarioEhDinutreDiretoria() && (
              <LeafItem to={`/${PERFIL}/${SOLICITACOES_PENDENTES}`}>
                Aguardando autorização
              </LeafItem>
            )
          )}
          <LeafItem
            to={`/${PERFIL}/${SOLICITACOES_AUTORIZADAS}`}
            dataTestId="autorizadas-ga"
          >
            Autorizadas
          </LeafItem>
          <LeafItem to={`/${PERFIL}/${SOLICITACOES_NEGADAS}`}>Negadas</LeafItem>
          <LeafItem to={`/${PERFIL}/${SOLICITACOES_CANCELADAS}`}>
            Canceladas
          </LeafItem>
        </SubMenu>
      )}
      {PERFIL === "terceirizada" && (
        <SubMenu
          icon="fa-chevron-down"
          path="relatorios"
          onClick={onSubmenuClick}
          title="Relatórios"
          activeMenu={activeMenu}
        >
          <LeafItem to={`/${RELATORIO_SOLICITACOES_ALIMENTACAO}`}>
            Solicitações de Alimentação
          </LeafItem>
          <LeafItem to={`/relatorio/alunos-matriculados`}>
            Alunos Matriculados
          </LeafItem>
        </SubMenu>
      )}
      {usuarioEhCODAEGestaoAlimentacao() && (
        <SubMenu
          icon="fa-chevron-down"
          path="cadastros"
          onClick={onSubmenuClick}
          title="Cadastros"
          activeMenu={activeMenu}
        >
          <LeafItem to={`/${CODAE}/${CADASTROS}/${CONSULTA_KITS}`}>
            Consulta de Kits
          </LeafItem>
        </SubMenu>
      )}
      {(usuarioEhDRE() ||
        usuarioEhCODAEGestaoAlimentacao() ||
        usuarioEhMedicao() ||
        usuarioEhCODAENutriManifestacao() ||
        usuarioEhNutricionistaSupervisao() ||
        usuarioEhEscolaTerceirizada() ||
        usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhCODAEGabinete() ||
        usuarioEhDinutreDiretoria() ||
        ehUsuarioRelatorios()) && (
        <SubMenu
          icon="fa-chevron-down"
          path="relatorios"
          onClick={onSubmenuClick}
          title="Relatórios"
          activeMenu={activeMenu}
        >
          {!usuarioEhNutricionistaSupervisao() && (
            <LeafItem to={`/${RELATORIO_SOLICITACOES_ALIMENTACAO}`}>
              Solicitações de Alimentação
            </LeafItem>
          )}

          <LeafItem to={`/relatorio/alunos-matriculados`}>
            Alunos Matriculados
          </LeafItem>
        </SubMenu>
      )}
    </Menu>
  );
};

export default MenuGestaoDeAlimentacao;
