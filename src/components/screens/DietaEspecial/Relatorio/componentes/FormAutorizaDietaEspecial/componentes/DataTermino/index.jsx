import React from "react";
import { Field } from "react-final-form";
import { TIPO_SOLICITACAO_DIETA } from "src/constants/shared";
import moment from "moment";
import { InputComData } from "src/components/Shareable/DatePicker";
import DataOpcional from "./componentes/DataOpcional";
import "./style.scss";

const DataTermino = ({ tipoSolicitacao, temData }) => {
  const tipoAluno = TIPO_SOLICITACAO_DIETA.ALUNO_NAO_MATRICULADO;

  return (
    <div className="row mt-3">
      {tipoSolicitacao === tipoAluno ? (
        <div className="col-3">
          <Field
            component={InputComData}
            label="Data de Término"
            name="data_termino"
            dateFormat={"YYYY-MM-DD"}
            required
            className="form-control data-label"
            minDate={moment().add(1, "days")._d}
          />
        </div>
      ) : (
        <div className="col-12">
          <Field
            component={DataOpcional}
            label="Data de Término"
            className="data-label"
            labelLigado="Com data de término"
            labelDesligado="Sem data de término"
            minDate={moment().add(1, "day")["_d"]}
            name="data_termino"
            temData={temData}
            hasIcon={true}
            format={(v) => v && moment(v, "YYYY-MM-DD")["_d"]}
            parse={(v) => v && moment(v).format("YYYY-MM-DD")}
          />
        </div>
      )}
    </div>
  );
};

export default DataTermino;
