import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
import "./style.scss";

export const RecreioFerias = () => {
  return (
    <div className="card recreio-nas-ferias-container">
      <div className="card-body">
        <div className="row mt-3 mb-3">
          <div className="col-6">
            <div className="title">Informe o Período do Recreio nas Férias</div>
          </div>
          <div className="col-6 text-end">
            <Botao
              texto="Recreios Cadastrados"
              onClick={() => {}}
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
            />
          </div>
        </div>

        {/* Use o Form do react-final-form */}
        <Form
          keepDirtyOnReinitialize
          onSubmit={() => {}}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="">
                  <Field
                    component={InputText}
                    label="Título"
                    name="titulo_cadastro"
                    placeholder="Título para o cadastro (ex. Recreio nas Férias - JAN 2026)"
                    required
                    validate={required}
                    max={50}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className={`col-4`}>
                  <Field
                    component={InputComData}
                    label="Período de Realização"
                    name="periodo_realizacao_de"
                    placeholder="De"
                    writable={false}
                    // minDate={getMinDateDataInicial(
                    //   index_contratos,
                    //   indexVigencia
                    // )}
                    // maxDate={moment(
                    //   values.contratos[index_contratos].vigencias[
                    //     indexVigencia
                    //   ]?.data_final,
                    //   "DD/MM/YYYY"
                    // ).toDate()}
                    required
                    validate={required}
                    // disabled={getDataInicialDisabled(
                    //   index_contratos,
                    //   indexVigencia
                    // )}
                  />
                </div>
                <div className={`col-4`}>
                  <Field
                    component={InputComData}
                    label="&nbsp;"
                    name="periodo_realizacao_ate"
                    placeholder="Até"
                    writable={false}
                    // minDate={getMinDateDataFinal(
                    //   index_contratos,
                    //   indexVigencia
                    // )}
                    maxDate={null}
                    // disabled={getDataFinalDisabled(
                    //   index_contratos,
                    //   indexVigencia
                    // )}
                  />
                </div>

                <div className="space-between mb-2 mt-4">
                  <span className="title">Unidades Participantes: 0</span>
                  <Botao
                    className="text-end"
                    texto="+ Adicionar Unidades"
                    // disabled={submitting}
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 text-end">
                  <Botao
                    texto="Salvar Recreio nas Férias"
                    // disabled={submitting}
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                  />
                </div>
              </div>
              {/* Modal... */}
            </form>
          )}
        />
      </div>
    </div>
  );
};
