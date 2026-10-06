import { FormApi } from "final-form";

import { IFiltros } from "../../types";

export type Args = {
  form: FormApi;
  values: IFiltros;
};

export type SelectOption = {
  uuid: string;
  nome: string;
};

export type MultiSelectOption = {
  label: string;
  value: string;
};

export type DiretoriaRegional = {
  uuid: string;
  nome: string;
};

export type Lote = {
  uuid: string;
  nome: string;
  diretoria_regional: { uuid: string; nome: string; iniciais: string };
};

export type TipoUnidade = {
  uuid: string;
  iniciais: string;
};

export type GrupoUnidadeEscolar = {
  uuid: string;
  nome: string;
  tipos_unidades: Array<TipoUnidade>;
};

export type Escola = {
  uuid: string;
  nome: string;
  codigo_eol: string;
  diretoria_regional: { uuid: string; nome: string };
  lote: { uuid: string; nome: string } | null;
};

export type TiposUnidadesTreeNode = {
  title: string;
  value: string;
  key: string;
  disabled?: boolean;
  children?: Array<TiposUnidadesTreeNode>;
};
