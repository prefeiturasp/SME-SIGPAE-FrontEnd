import moment from "moment";
import { Field } from "react-final-form";
import { InputComData } from "src/components/Shareable/DatePicker";
import { TIPO_SOLICITACAO_DIETA } from "src/constants/shared";
import DataOpcional from "./componentes/DataOpcional";
import "./style.scss";

const DataTermino = ({ dietaEspecial, temData }) => {
  const tipoSolicitacaoAlunoNaoMatriculado =
    TIPO_SOLICITACAO_DIETA.ALUNO_NAO_MATRICULADO;

  const dietaRecreioNasFeriasParaAlunoNaoMatriculado =
    tipoSolicitacaoAlunoNaoMatriculado &&
    dietaEspecial.dieta_para_recreio_ferias;

  return (
    <>
      {dietaRecreioNasFeriasParaAlunoNaoMatriculado && (
        <>
          <div className="row mt-3">
            <div className="col-12">
              <p className="label mb-0">Período de Vigência</p>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Field
                component={InputComData}
                label="Início"
                name="data_inicio"
                disabled
              />
            </div>
            <div className="col-4">
              <Field
                component={InputComData}
                label="Fim"
                name="data_termino"
                disabled
              />
            </div>
          </div>
        </>
      )}
      {!dietaRecreioNasFeriasParaAlunoNaoMatriculado && (
        <div className="row mt-3">
          {dietaEspecial.tipo_solicitacao ===
          tipoSolicitacaoAlunoNaoMatriculado ? (
            <div className="col-3">
              <Field
                component={InputComData}
                label="Data de Término"
                name="data_termino"
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
      )}
    </>
  );
};

export default DataTermino;
