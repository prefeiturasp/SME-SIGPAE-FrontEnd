import { FormApi } from "final-form";

import { IFiltros } from "../../types";

export type Args = {
  form: FormApi;
  // eslint-disable-next-line
  onChange: (values: IFiltros) => void;
};

export type SelectOption = {
  uuid: string | number;
  nome: string;
};

export type MultiSelectOption = {
  label: string;
  value: string | number;
};

export type Option = {
  label: string;
  value: any;
};

export type TipoUnidade = {
  uuid: string;
  iniciais: string;
};

export type GrupoUnidadeEscolar = {
  uuid: string;
  nome: string;
  tipos_unidades: TipoUnidade[];
};

export type TiposUnidadesTreeNode = {
  title: string;
  value: string;
  key: string;
  disabled?: boolean;
  children?: TiposUnidadesTreeNode[];
};
