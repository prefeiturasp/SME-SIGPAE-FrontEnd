import {
  CALENDARIO_CRONOGRAMA,
  CRONOGRAMA_ENTREGA,
  DOCUMENTOS_RECEBIMENTO,
  FICHA_TECNICA,
  LAYOUT_EMBALAGEM,
  PAINEL_APROVACOES,
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PAINEL_FICHAS_TECNICAS,
  PAINEL_LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
  RELATORIO_CRONOGRAMA,
  SOLICITACAO_ALTERACAO_CRONOGRAMA,
  SOLICITACAO_ALTERACAO_CRONOGRAMA_FORNECEDOR,
} from "configs/constants";
import {
  usuarioComAcessoAoCalendarioCronograma,
  usuarioComAcessoAoPainelAprovacoes,
  usuarioComAcessoAoPainelDocumentos,
  usuarioComAcessoAoPainelEmbalagens,
  usuarioComAcessoAoPainelFichasTecnicas,
  usuarioComAcessoAoRelatorioCronogramas,
  usuarioEhCodaeDilog,
  usuarioEhCODAEGabinete,
  usuarioEhCronograma,
  usuarioEhDilogAbastecimento,
  usuarioEhDilogDiretoria,
  usuarioEhEmpresaFornecedor,
  usuarioEhPreRecebimento,
} from "helpers/utilities";
import React from "react";
import { LeafItem, Menu, SubMenu } from "./shared";

const MenuPreRecebimento = ({ activeMenu, onSubmenuClick }) => {
  return (
    <Menu
      id="PreRecebimento"
      icon="fa-calendar-check"
      title="Pré-Recebimento"
      dataTestId="pre-recebimento"
    >
      {usuarioComAcessoAoPainelAprovacoes() && (
        <LeafItem to={`/${PRE_RECEBIMENTO}/${PAINEL_APROVACOES}`}>
          Painel de Aprovações
        </LeafItem>
      )}
      {(usuarioEhPreRecebimento() ||
        usuarioEhEmpresaFornecedor() ||
        usuarioEhCODAEGabinete()) && (
        <LeafItem to={`/${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`}>
          Cronograma de Entrega
        </LeafItem>
      )}
      {(usuarioEhCronograma() ||
        usuarioEhDilogAbastecimento() ||
        usuarioEhCodaeDilog() ||
        usuarioEhDilogDiretoria()) && (
        <LeafItem
          to={`/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`}
        >
          Verificar Alterações de Cronograma
        </LeafItem>
      )}
      {usuarioEhEmpresaFornecedor() && (
        <LeafItem
          to={`/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA_FORNECEDOR}`}
        >
          Verificar Alterações de Cronograma
        </LeafItem>
      )}
      {usuarioComAcessoAoCalendarioCronograma() && (
        <LeafItem to={`/${PRE_RECEBIMENTO}/${CALENDARIO_CRONOGRAMA}`}>
          Calendário de Cronogramas
        </LeafItem>
      )}
      {usuarioEhEmpresaFornecedor() && (
        <LeafItem to={`/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`}>
          Layout de Embalagem
        </LeafItem>
      )}
      {usuarioComAcessoAoPainelEmbalagens() && (
        <LeafItem to={`/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`}>
          Layout de Embalagem
        </LeafItem>
      )}
      {usuarioEhEmpresaFornecedor() && (
        <LeafItem to={`/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`}>
          Documentos de Recebimento
        </LeafItem>
      )}
      {usuarioComAcessoAoPainelDocumentos() && (
        <LeafItem to={`/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`}>
          Documentos de Recebimento
        </LeafItem>
      )}
      {usuarioEhEmpresaFornecedor() && (
        <LeafItem to={`/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`}>
          Ficha Técnica do Produto
        </LeafItem>
      )}
      {usuarioComAcessoAoPainelFichasTecnicas() && (
        <LeafItem to={`/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`}>
          Fichas Técnicas
        </LeafItem>
      )}
      {usuarioComAcessoAoRelatorioCronogramas() && (
        <SubMenu
          icon="fa-chevron-down"
          onClick={onSubmenuClick}
          title="Relatórios"
          activeMenu={activeMenu}
          dataTestId="relatorios-pr"
        >
          {usuarioComAcessoAoRelatorioCronogramas() && (
            <LeafItem to={`/${PRE_RECEBIMENTO}/${RELATORIO_CRONOGRAMA}/`}>
              Cronogramas de Entregas
            </LeafItem>
          )}
        </SubMenu>
      )}
    </Menu>
  );
};

export default MenuPreRecebimento;
