import React from "react";

import { Field } from "react-final-form";
import { FormApi } from "final-form";

import { Skeleton } from "antd";

import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputComData } from "src/components/Shareable/DatePicker";

import useView from "./view";

type Props = {
  values: Record<string, any>;
  form: FormApi;
  anoVigente: number;
};

export default (props: Props) => {
  const { values, form, anoVigente } = props;

  const view = useView({ values, form, anoVigente });

  return (
    <div className="row">
      <div className="col-4">
        {view.loadingAnoOpcoes ? (
          <Skeleton paragraph={false} active />
        ) : (
          <Field
            component={MultiSelect}
            disableSearch
            label="Ano"
            name="anos"
            nomeDoItemNoPlural="anos"
            placeholder="Selecione o ano"
            tooltipText="Serão contabilizadas todas as dietas referente ao(s) ano(s) selecionado(s)."
            options={view.anoOpcoes}
          />
        )}
      </div>

      <div className="col-4">
        <Field
          component={MultiSelect}
          disableSearch
          label="Mês"
          name="meses"
          nomeDoItemNoPlural="meses"
          placeholder="Selecione o mês"
          tooltipText="Serão contabilizadas todas as dietas referente ao(s) mes(s) selecionado(s)."
          options={view.MES_OPCOES}
          disabled={view.selecionouMaisDeUmAno}
        />
      </div>

      <div className="col-4">
        <Field
          component={InputComData}
          className="input-data"
          label="Dia"
          name="dia"
          placeholder="Selecione o dia"
          tooltipText="Selecione apenas um mês e um ano para habilitar o filtro de Dia"
          writable={false}
          minDate={view.dataMinima}
          maxDate={view.dataMaxima}
          disabled={view.selecionouMaisDeUmAno || view.selecionouMaisDeUmMes}
        />
      </div>
    </div>
  );
};
