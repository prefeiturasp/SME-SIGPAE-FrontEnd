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
  SUSPENSAO_ATIVIDADES,
  LABORATORIOS_CADASTRADOS,
  PRODUTOS,
  TIPOS_EMBALAGENS,
  UNIDADES_MEDIDA,
  MARCAS,
  FABRICANTES,
  RECREIO_NAS_FERIAS,
} from "src/configs/constants";
import {
  usuarioEhAdministradorCONTRATOS,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCronograma,
  usuarioEhDilogQualidade,
  usuarioEhDilogQualidadeOuCronograma,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
  usuarioEhLogistica,
  usuarioEhMedicao,
  usuarioEhCodaeDilog,
  usuarioEhEmpresaFornecedor,
} from "src/helpers/utilities";
import { usuarioEhCODAEGestaoProduto } from "../../../../helpers/utilities";

const MenuCadastros = () => {
  return (
    <Menu
      id="Cadastros"
      icon="fa-user-plus"
      title={"Cadastros"}
      dataTestId="menu-cadastros"
    >
      {(usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhEscolaTerceirizada()) && (
        <LeafItem
          to={`/${CONFIGURACOES}/${CADASTROS}/${HORARIO_COMBOS_ALIMENTACAO}`}
        >
          Horários de Alimentações
        </LeafItem>
      )}
      {(usuarioEhLogistica() ||
        usuarioEhAdministradorCONTRATOS() ||
        usuarioEhCronograma() ||
        usuarioEhCODAEGestaoProduto()) && (
        <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${EMPRESA}`}>
          Empresas
        </LeafItem>
      )}
      {usuarioEhDilogQualidadeOuCronograma() && (
        <>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${TIPOS_EMBALAGENS}`}>
            Tipos de Embalagens
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${UNIDADES_MEDIDA}`}>
            Unidades de Medida
          </LeafItem>
        </>
      )}
      {(usuarioEhDilogQualidade() || usuarioEhCodaeDilog()) && (
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
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${RECREIO_NAS_FERIAS}`}>
            Recreio nas Férias
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${SOBREMESA_DOCE}`}>
            Sobremesa Doce
          </LeafItem>
          <LeafItem
            to={`/${CONFIGURACOES}/${CADASTROS}/${SUSPENSAO_ATIVIDADES}`}
          >
            Suspensão de Atividades
          </LeafItem>
        </>
      )}
      {usuarioEhMedicao() && (
        <>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${SOBREMESA_DOCE}`}>
            Sobremesa Doce
          </LeafItem>
          <LeafItem
            to={`/${CONFIGURACOES}/${CADASTROS}/${SUSPENSAO_ATIVIDADES}`}
          >
            Suspensão de Atividades
          </LeafItem>
        </>
      )}
      {(usuarioEhCronograma() ||
        usuarioEhCodaeDilog() ||
        usuarioEhEmpresaFornecedor()) && (
        <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${PRODUTOS}`}>
          Produtos
        </LeafItem>
      )}
      {(usuarioEhEmpresaFornecedor() || usuarioEhCodaeDilog()) && (
        <>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${MARCAS}`}>
            Marcas
          </LeafItem>
          <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${FABRICANTES}`}>
            Fabricantes
          </LeafItem>
        </>
      )}
    </Menu>
  );
};

export default MenuCadastros;
