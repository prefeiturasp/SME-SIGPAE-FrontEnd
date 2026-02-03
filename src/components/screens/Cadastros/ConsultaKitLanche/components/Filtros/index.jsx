import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { getNumerosEditais } from "src/services/edital.service";
import "./style.scss";

const FORM_NAME = "buscaKitsLanche";

export default ({ setFiltros, setKits }) => {
  const navigate = useNavigate();
  const [initialValues] = useState();
  const [editais, setEditais] = useState();

  const onSubmit = async (values) => {
    const filtros = { ...values };
    setFiltros({ ...filtros });
  };

  useEffect(() => {
    carregarEditais();
  }, []);

  const carregarEditais = async () => {
    const response = await getNumerosEditais();
    setEditais(response.data.results.map((edital) => edital.numero));
  };

  const getEditaisFiltrado = (numEdital) => {
    if (numEdital) {
      const reg = new RegExp(numEdital, "i");
      return editais?.filter((a) => reg.test(a));
    }
    return editais;
  };

  return (
    <div className="filtros-consulta-kits">
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />
            <div className="row">
              <div className="col-6">
                <Field
                  component={AutoCompleteField}
                  dataTestId="numero-edital-autocomplete"
                  dataSource={getEditaisFiltrado(values.numero_edital)}
                  label="Número do Edital"
                  name="numero_edital"
                  className="input-busca-produto"
                />
              </div>

              <div className="col-6">
                <Field
                  label="Status do Kit"
                  component={MultiSelect}
                  disableSearch
                  name="status"
                  multiple
                  nomeDoItemNoPlural="status"
                  options={[
                    {
                      value: "ATIVO",
                      label: "Ativo",
                    },
                    {
                      value: "INATIVO",
                      label: "Inativo",
                    },
                  ]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="mt-4 mb-4">
                  <Botao
                    texto="Adicionar Novo Modelo de KIT"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN}
                    className="float-start"
                    onClick={() => navigate("/codae/cadastros/kits")}
                  />

                  <Botao
                    texto="Consultar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="float-end ms-3"
                    disabled={submitting}
                  />

                  <Botao
                    texto="Limpar Filtros"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    onClick={() => {
                      form.reset(initialValues);
                      setKits(undefined);
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};
