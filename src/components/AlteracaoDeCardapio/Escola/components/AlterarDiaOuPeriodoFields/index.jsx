import { InputComData } from "components/Shareable/DatePicker";
import HTTP_STATUS from "http-status-codes";
import { fimDoCalendario } from "helpers/utilities";
import moment from "moment";
import React, { useState } from "react";
import { Field } from "react-final-form";
import { getDiasUteis } from "services/diasUteis.service";

export const AlterarDiaOuPeriodo = ({ ...props }) => {
  const [limiteDataInicial, setLimiteDataInicial] = useState();
  const [limiteDataFinal, setLimiteDataFinal] = useState();

  const {
    values,
    onAlterarDiaChanged,
    ehMotivoPorNome,
    setErro,
    proximosDoisDiasUteis,
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
          name="data_inicial"
          label="De"
          minDate={
            ehMotivoPorNome("Lanche Emergencial", values)
              ? moment().toDate()
              : proximosDoisDiasUteis
          }
          maxDate={fimDoCalendario()}
          disabled={
            values.alterar_dia ||
            !values.motivo ||
            !ehMotivoPorNome("Lanche Emergencial", values)
          }
          inputOnChange={async (value) => {
            await obtemDataInicial(value);
            onAlterarDiaChanged(value, values);
          }}
        />
        <Field
          component={InputComData}
          name="data_final"
          label="Até"
          disabled={!values.data_inicial || values.alterar_dia}
          minDate={limiteDataInicial}
          maxDate={limiteDataFinal}
        />
      </>
    </section>
  );
};
