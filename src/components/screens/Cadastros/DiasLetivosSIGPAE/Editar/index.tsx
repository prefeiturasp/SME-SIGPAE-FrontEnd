import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { lotesToOptions } from "src/components/screens/Relatorios/SolicitacoesAlimentacao/helpers";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { requiredMultiselect } from "src/helpers/fieldValidators";
import { getLotesSimples } from "src/services/lote.service";

export const EditarDiasLetivosSIGPAE = () => {
  const [lotes, setLotes] = useState([]);

  const [erroAPI, setErroAPI] = useState("");

  const getLotesSimplesAsync = async () => {
    const response = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      setLotes(lotesToOptions(response.data.results));
    } else {
      setErroAPI("Erro ao carregar lotes.");
    }
  };

  const onSubmit = () => {};

  useEffect(() => {
    Promise.all([getLotesSimplesAsync()]);
  }, []);

  return (
    <div className="editar-dias-letivos">
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && (
        <div className="card mt-3">
          <div className="card-body">
            <Form onSubmit={onSubmit}>
              {({ handleSubmit, form, values }) => (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-4">
                      <label className="col-form-label">
                        <span className="red">*</span> DRE/Lote
                      </label>
                      <Field
                        component={MultiselectRaw}
                        name="lotes"
                        selected={values.lotes || []}
                        options={lotes}
                        onSelectedChanged={(values_) =>
                          form.change(
                            `lotes`,
                            values_.map((value_) => value_.value),
                          )
                        }
                        hasSelectAll
                        placeholder="Selecione Lote(s)"
                        required
                        validate={requiredMultiselect}
                      />
                    </div>
                  </div>
                </form>
              )}
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};
