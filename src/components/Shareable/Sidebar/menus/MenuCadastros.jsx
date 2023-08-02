import React from "react";
import { Menu, LeafItem } from "./shared";
import {
  CONFIGURACOES,
  CADASTROS,
  LOTE,
  EMPRESA,
  EDITAIS_CONTRATOS,
  TIPOS_ALIMENTACAO,
  FAIXAS_ETARIAS,
  HORARIO_COMBOS_ALIMENTACAO,
  SOBREMESA_DOCE,
  LABORATORIOS_CADASTRADOS,
  PRODUTOS,
  EMBALAGENS_CADASTRADAS,
  UNIDADES_MEDIDA
} from "configs/constants";
import {
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCronograma,
  usuarioEhDilogQualidade,
  usuarioEhDilogQualidadeOuCronograma,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
  usuarioEhLogistica,
  usuarioEhMedicao,
  usuarioEhCodaeDilog,
  usuarioEhEmpresaFornecedor
} from "helpers/utilities";

const MenuCadastros = () => {
  return (
    <Menu id="Cadastros" icon="fa-user-plus" title={"Cadastros"}>
      {(usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhEscolaTerceirizada()) && (
        <LeafItem
          to={`/${CONFIGURACOES}/${CADASTROS}/${HORARIO_COMBOS_ALIMENTACAO}`}
        >
          Horários de Alimentações
        </LeafItem>
      )}
      {(usuarioEhLogistica() || usuarioEhCronograma()) && (
        <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${EMPRESA}`}>
          Empresas
        </LeafItem>
      )}
      {usuarioEhDilogQualidadeOuCronograma() && (
        <>
          <LeafItem
            to={`/${CONFIGURACOES}/${CADASTROS}/${EMBALAGENS_CADASTRADAS}`}
          >
            Embalagens
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${UNIDADES_MEDIDA}`}>
            Unidades de Medida
          </LeafItem>
        </>
      )}
      {usuarioEhDilogQualidade() && (
        <LeafItem
          to={`/${CONFIGURACOES}/${CADASTROS}/${LABORATORIOS_CADASTRADOS}`}
        >
          Laboratórios
        </LeafItem>
      )}
      {usuarioEhCODAEGestaoAlimentacao() && (
        <>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}`}>
            Painel Inicial
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${LOTE}`}>
            Lotes
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${EMPRESA}`}>
            Empresas
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${EDITAIS_CONTRATOS}`}>
            Editais e Contratos
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${TIPOS_ALIMENTACAO}`}>
            Tipos de Alimentações
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${FAIXAS_ETARIAS}`}>
            Faixas Etárias
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${SOBREMESA_DOCE}`}>
            Sobremesa Doce
          </LeafItem>
        </>
      )}
      {usuarioEhMedicao() && (
        <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${SOBREMESA_DOCE}`}>
          Sobremesa Doce
        </LeafItem>
      )}
      {(usuarioEhCronograma() ||
        usuarioEhCodaeDilog() ||
        usuarioEhEmpresaFornecedor()) && (
        <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${PRODUTOS}`}>
          Produtos
        </LeafItem>
      )}
    </Menu>
  );
};

export default MenuCadastros;
