import React from "react";
import { Menu, LeafItem, SubMenu } from "./shared";
import {
  ENVIO_REQUISICOES_ENTREGA_AVANCADO,
  LOGISTICA,
  GESTAO_REQUISICAO_ENTREGA,
  GESTAO_SOLICITACAO_ALTERACAO,
  CONSULTA_SOLICITACAO_ALTERACAO,
  CONFERENCIA_INCONSISTENCIAS,
  CONFERIR_ENTREGA,
  INSUCESSO_ENTREGA,
  ENTREGAS_DILOG,
  ENTREGAS_DRE,
  ENTREGAS_DISTRIBUIDOR,
  GUIAS_NOTIFICACAO,
  GUIAS_NOTIFICACAO_FISCAL,
} from "src/configs/constants";
import {
  usuarioEhEmpresaDistribuidora,
  usuarioEhLogistica,
  usuarioEhEscolaAbastecimento,
  usuarioEhDRE,
  usuarioComAcessoTelaEntregasDilog,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhCodaeDilog,
  usuarioEhEscolaAbastecimentoDiretor,
  exibirModuloOcorrencias,
  usuarioEhDilogJuridico,
  usuarioEhDilogQualidade,
  usuarioEhDilog,
  usuarioEhCODAEGabinete,
  usuarioEhDilogDiretoria,
} from "src/helpers/utilities";

const MenuLogistica = ({ activeMenu, onSubmenuClick }) => {
  return (
    <Menu id="Logistica" icon="fa-truck" title="Abastecimento">
      {(usuarioEhLogistica() ||
        usuarioEhCODAEGabinete() ||
        usuarioEhDilogDiretoria()) && (
        <LeafItem to={`/${LOGISTICA}/${ENVIO_REQUISICOES_ENTREGA_AVANCADO}`}>
          Requisição de Entrega
        </LeafItem>
      )}

      {usuarioEhEmpresaDistribuidora() && (
        <LeafItem to={`/${LOGISTICA}/${GESTAO_REQUISICAO_ENTREGA}`}>
          Requisição de Entrega
        </LeafItem>
      )}

      {usuarioEhEmpresaDistribuidora() && (
        <LeafItem to={`/${LOGISTICA}/${INSUCESSO_ENTREGA}`}>
          Insucesso de Entrega
        </LeafItem>
      )}

      {usuarioEhEmpresaDistribuidora() && (
        <LeafItem to={`/${LOGISTICA}/${CONSULTA_SOLICITACAO_ALTERACAO}`}>
          Solicitação de Alteração
        </LeafItem>
      )}

      {(usuarioEhLogistica() ||
        usuarioEhCODAEGabinete() ||
        usuarioEhDilogDiretoria()) && (
        <LeafItem to={`/${LOGISTICA}/${GESTAO_SOLICITACAO_ALTERACAO}`}>
          Alteração da Requisição
        </LeafItem>
      )}

      {usuarioEhCodaeDilog() && (
        <LeafItem to={`/${LOGISTICA}/${CONFERENCIA_INCONSISTENCIAS}`}>
          Conferência de Inconsistência
        </LeafItem>
      )}

      {(usuarioComAcessoTelaEntregasDilog() ||
        usuarioEhCoordenadorNutriSupervisao()) && (
        <LeafItem to={`/${LOGISTICA}/${ENTREGAS_DILOG}`}>Entregas</LeafItem>
      )}

      {usuarioEhDRE() && (
        <LeafItem to={`/${LOGISTICA}/${ENTREGAS_DRE}`}>Entregas</LeafItem>
      )}

      {usuarioEhEmpresaDistribuidora() && (
        <LeafItem to={`/${LOGISTICA}/${ENTREGAS_DISTRIBUIDOR}`}>
          Entregas
        </LeafItem>
      )}

      {(usuarioEhEscolaAbastecimento() ||
        usuarioEhEscolaAbastecimentoDiretor()) && (
        <LeafItem to={`/${LOGISTICA}/${CONFERIR_ENTREGA}`}>
          Conferir Entrega
        </LeafItem>
      )}

      {exibirModuloOcorrencias() && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Ocorrências"
          activeMenu={activeMenu}
        >
          {(usuarioEhCodaeDilog() ||
            usuarioEhDilogJuridico() ||
            usuarioEhCODAEGabinete() ||
            usuarioEhDilogDiretoria()) && (
            <LeafItem to={`/${LOGISTICA}/${GUIAS_NOTIFICACAO}/`}>
              Guias com Notificações
            </LeafItem>
          )}

          {(usuarioEhDilogQualidade() || usuarioEhDilog()) && (
            <LeafItem to={`/${LOGISTICA}/${GUIAS_NOTIFICACAO_FISCAL}/`}>
              Notificações
            </LeafItem>
          )}
        </SubMenu>
      )}
    </Menu>
  );
};

export default MenuLogistica;
