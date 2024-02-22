import React from "react";

import { Field } from "react-final-form";
import { FormApi } from "final-form";

import Select from "components/Shareable/Select";
import MultiSelect from "components/Shareable/FinalForm/MultiSelect";

import useView from "./view";

type Props = {
  values: Record<string, any>;
  form: FormApi;
};

export default (props: Props) => {
  const { values, form } = props;

  // eslint-disable-next-line
  const view = useView({ values, form });

  return (
    <div className="row">
      <div className="col-4">
        <Field
          component={Select}
          label="Mês de Referência"
          name="mes"
          placeholder="Selecione o mês de referência"
          options={[]}
          required
        />
      </div>

      <div className="col-8">
        <Field
          component={Select}
          label="DRE"
          name="dre"
          placeholder="Selecione uma DRE"
          options={view.diretoriasRegionaisOpcoes}
          naoDesabilitarPrimeiraOpcao
          onChangeEffect={view.onChangeDRE}
        />
      </div>

      <div className="col-4">
        <Field
          component={MultiSelect}
          label="Lote"
          name="lote"
          placeholder="Selecione os lotes"
          options={view.lotesOpcoes}
          nomeDoItemNoPlural="lotes"
        />
      </div>

      <div className="col-8">
        <Field
          component={Select}
          label="Unidade Educacional"
          name="unidade_educacional"
          placeholder="Selecione uma Unidade Educacional"
          options={[]}
        />
      </div>

      <div className="col-4">
        <Field
          component={MultiSelect}
          disableSearch
          label="Período"
          name="periodo"
          nomeDoItemNoPlural="períodos"
          placeholder="Selecione os períodos"
          options={[]}
        />
      </div>

      <div className="col-4">
        <Field
          component={MultiSelect}
          disableSearch
          label="Tipo de Alimentação"
          name="tipo_alimentacao"
          nomeDoItemNoPlural="alimentações"
          placeholder="Selecione os tipos de alimentação"
          options={[]}
        />
      </div>
    </div>
  );
};
