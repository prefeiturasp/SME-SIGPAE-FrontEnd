import {
  CADASTROS,
  CONFIGURACOES,
  EDITAIS_CONTRATOS,
  EMPRESA,
  EMPRESAS_CADASTRADAS,
  FABRICANTES,
  FAIXAS_ETARIAS,
  HORARIO_COMBOS_ALIMENTACAO,
  LABORATORIOS_CADASTRADOS,
  LOTE,
  MARCAS,
  PRODUTOS,
  RECREIO_NAS_FERIAS,
  SOBREMESA_DOCE,
  SUSPENSAO_ATIVIDADES,
  TIPOS_ALIMENTACAO,
  TIPOS_EMBALAGENS,
  UNIDADES_MEDIDA,
} from "src/configs/constants";
import {
  usuarioEhAdministradorCONTRATOS,
  usuarioEhCodaeDilog,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAEGestaoProduto,
  usuarioEhCronograma,
  usuarioEhDilogQualidade,
  usuarioEhDilogQualidadeOuCronograma,
  usuarioEhDilogVisualizacao,
  usuarioEhEmpresaFornecedor,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhLogistica,
  usuarioEhMedicao,
} from "src/helpers/utilities";
import { LeafItem, Menu } from "./shared";

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
      {(usuarioEhDilogQualidade() || usuarioEhDilogVisualizacao()) && (
        <LeafItem to={`/${CONFIGURACOES}/${CADASTROS}/${EMPRESAS_CADASTRADAS}`}>
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
