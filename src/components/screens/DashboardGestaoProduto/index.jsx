import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import HTTP_STATUS from "http-status-codes";
import { dataAtual } from "helpers/utilities";
import { ASelect } from "components/Shareable/MakeField";
import { getNomesUnicosEditais } from "services/produto.service";
import { InputText } from "components/Shareable/Input/InputText";
import { Spin } from "antd";

export const DashboardGestaoProduto = () => {
  const [editais, setEditais] = useState();

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const getEditaisAsync = async () => {
    const response = await getNomesUnicosEditais();
    if (response.status === HTTP_STATUS.OK) {
      setEditais(
        response.data.results.map((edital) => {
          return { label: edital, value: edital };
        })
      );
    } else {
      setErro("Erro ao carregar Editais. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    getEditaisAsync();
    setLoading(false);
  }, []);

  const LOADING_INICIAL = !editais;

  return (
    <div className="card mt-3">
      <div className="card-body dash-terc">
        {erro && <div>{erro}</div>}
        <Spin tip="Carregando painel..." spinning={LOADING_INICIAL}>
          <div className="card-title fw-bold dashboard-card-title">
            <Form
              onSubmit={() => {}}
              initialValues={{}}
              render={({ form, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12 text-end">
                      <p className="current-date">
                        Data: <span>{dataAtual()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4 produtos-edital">
                      <Field
                        component={ASelect}
                        showSearch
                        name="edital"
                        placeholder="Número do Edital"
                        disabled={LOADING_INICIAL || loading}
                        options={
                          editais
                            ? [{ label: "Número do Edital", value: "" }].concat(
                                editais
                              )
                            : []
                        }
                        onChange={(value) => {
                          form.change("edital", value);
                        }}
                      />
                    </div>

                    <div className="col-4">
                      <Field
                        component={InputText}
                        name="titulo"
                        placeholder="Pesquisar"
                        disabled={LOADING_INICIAL || loading}
                        inputOnChange={(e) => {
                          const value = e.target.value;
                          form.change("titulo", value);
                        }}
                      />
                      <div className="warning-num-charac">
                        * mínimo de 3 caracteres
                      </div>
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        name="marca"
                        placeholder="Busca da Marca"
                        disabled={LOADING_INICIAL || loading}
                        inputOnChange={(e) => {
                          const value = e.target.value;
                          form.change("marca", value);
                        }}
                      />
                      <div className="warning-num-charac">
                        * mínimo de 3 caracteres
                      </div>
                    </div>
                  </div>
                </form>
              )}
            />
          </div>
        </Spin>
      </div>
    </div>
  );
};
