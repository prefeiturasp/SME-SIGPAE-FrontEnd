import { deepCopy } from "helpers/utilities";

export const PAGE_SIZE = 10;

export const normalizarValues = (values, page = 1) => {
  const values_ = deepCopy(values);
  const PARAMS = {
    page_size: PAGE_SIZE,
    page,
  };

  if (values_.unidades_educacionais_selecionadas.includes("todas")) {
    delete values_.unidades_educacionais_selecionadas;
  }
  if (
    values_.tipos_unidades_selecionadas &&
    values_.tipos_unidades_selecionadas.includes("todos")
  ) {
    delete values_.tipos_unidades_selecionadas;
  }
  if (
    values_.periodos_escolares_selecionadas &&
    values_.periodos_escolares_selecionadas.includes("todos")
  ) {
    delete values_.periodos_escolares_selecionadas;
  }
  if (
    values_.classificacoes_selecionadas &&
    values_.classificacoes_selecionadas.includes("todas")
  ) {
    delete values_.classificacoes_selecionadas;
  }
  if (values_.tipo_gestao === "Selecione um tipo de gestão") {
    delete values_.tipo_gestao;
  }
  let params = {
    ...PARAMS,
    ...values_,
  };
  return params;
};
