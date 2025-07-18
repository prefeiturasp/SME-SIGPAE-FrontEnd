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
