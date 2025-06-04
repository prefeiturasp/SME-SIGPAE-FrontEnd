import { InputComData } from "src/components/Shareable/DatePicker";
import { required } from "src/helpers/fieldValidators";
import { fimDoCalendario } from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { useState } from "react";
import { Field } from "react-final-form";
import { getDiasUteis } from "src/services/diasUteis.service";

export const AlterarDiaOuPeriodo = ({ ...props }) => {
  const [limiteDataInicial, setLimiteDataInicial] = useState();
  const [limiteDataFinal, setLimiteDataFinal] = useState();

  const {
    values,
    onAlterarDiaChanged,
    ehMotivoPorNome,
    setErro,
    proximosDoisDiasUteis,
    form,
  } = props;

  const obtemDataInicial = async (value) => {
    setLimiteDataInicial(moment(value, "DD/MM/YYYY").add(1, "days")["_d"]);
    const response = await getDiasUteis({ data: value });
    if (response.status === HTTP_STATUS.OK) {
      setLimiteDataFinal(
        moment(response.data.data_apos_quatro_dias_uteis, "YYYY-MM-DD")._d
      );
    } else {
      setErro(
        "Erro ao carregar limite da data final da Alteração de dia de Cardápio"
      );
    }
  };

  return (
    <section className="section-form-datas mt-2">
      <Field
        component={InputComData}
        dataTestId="div-input-alterar-dia"
        inputOnChange={(value) => onAlterarDiaChanged(value, values)}
        name="alterar_dia"
        minDate={
          ehMotivoPorNome("Lanche Emergencial", values)
            ? moment().toDate()
            : proximosDoisDiasUteis
        }
        maxDate={fimDoCalendario()}
        label="Alterar dia"
        disabled={values.data_inicial || values.data_final}
        usarDirty
      />
      <>
        <div className="opcao-data">Ou</div>
        <Field
          component={InputComData}
          dataTestId="div-input-data-inicial"
          name="data_inicial"
          label="De"
          minDate={
            ehMotivoPorNome("Lanche Emergencial", values)
              ? moment().toDate()
              : proximosDoisDiasUteis
          }
          maxDate={
            values.data_final
              ? moment(values.data_final, "DD/MM/YYYY")["_d"]
              : fimDoCalendario()
          }
          disabled={
            values.alterar_dia ||
            !values.motivo ||
            !ehMotivoPorNome("Lanche Emergencial", values)
          }
          inputOnChange={async (value) => {
            await obtemDataInicial(value);
            onAlterarDiaChanged(value, values);
            if (!value) form.change("data_final", undefined);
          }}
        />
        <Field
          component={InputComData}
          dataTestId="div-input-data-final"
          name="data_final"
          label="Até"
          disabled={!values.data_inicial || values.alterar_dia}
          minDate={limiteDataInicial}
          maxDate={limiteDataFinal}
          required={values.data_inicial}
          validate={values.data_inicial && required}
        />
      </>
    </section>
  );
};
