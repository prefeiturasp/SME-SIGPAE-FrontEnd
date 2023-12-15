import React, { useState } from "react";
import "./styles.scss";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { Field } from "react-final-form";
import SelectSelecione from "components/Shareable/SelectSelecione";
import { agregarDefault } from "helpers/utilities";
import { OnChange } from "react-final-form-listeners";

export default ({ values, form, etapas, recebimentos, setRecebimentos }) => {
  const [collapse, setCollapse] = useState(false);
  const [datasProgramadas, setDatasProgramadas] = useState([]);

  const toggleCollapse = () => {
    setCollapse(!collapse);
  };

  const adicionaRecebimento = () => {
    setRecebimentos([...recebimentos, {}]);
  };

  const deletaRecebimento = (index) => {
    let recebimentosNovo = [...recebimentos];
    recebimentosNovo.splice(index, 1);
    setRecebimentos(recebimentosNovo);
  };

  const getOptionsDataProgramada = (values) => {
    let options = [];
    etapas.forEach((e, index) => {
      if (values[`etapa_${index}`] && values[`data_programada_${index}`]) {
        let nomeConcatenado = `${values[`data_programada_${index}`]} - ${
          values[`etapa_${index}`]
        } ${values[`parte_${index}`] ? ` - ${values[`parte_${index}`]}` : ""}`;
        options.push({
          uuid: nomeConcatenado,
          nome: nomeConcatenado,
        });
      }
    });
    return agregarDefault(options);
  };

  return (
    <>
      <div className="card mt-3 form-recebimento">
        <div className={`card-header card-tipo`} id={`heading_2`}>
          <div className="row card-header-content">
            <span className="nome-alimento">Dados do Recebimento</span>
            <div className="col-1 align-self-center">
              <button
                onClick={() => toggleCollapse()}
                className="btn btn-link btn-block text-right px-0"
                type="button"
                data-toggle="collapse"
                data-target={`#collapse_2`}
                aria-expanded="true"
                aria-controls={`collapse_2`}
              >
                <span className="span-icone-toogle">
                  <i
                    className={
                      collapse ? "fas fa-chevron-up" : "fas fa-chevron-down"
                    }
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          id={`collapse_2`}
          className="collapse"
          aria-labelledby="headingOne"
          data-parent="#accordionCronograma"
        >
          <div className="card-body">
            {recebimentos.map((recebimento, index) => (
              <>
                {index !== 0 && (
                  <>
                    <hr />
                    <div className="row">
                      <div className="w-100">
                        <Botao
                          texto=""
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          icon="fas fa-trash"
                          className="float-end ml-3"
                          onClick={() => deletaRecebimento(index)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="row">
                  <div className="col-4">
                    <Field
                      component={SelectSelecione}
                      naoDesabilitarPrimeiraOpcao
                      options={getOptionsDataProgramada(values).filter(
                        (op) =>
                          !datasProgramadas.find(
                            (dp) => dp.nome === op.nome && dp.index !== index
                          )
                      )}
                      label="Data Programada"
                      name={`data_recebimento_${index}`}
                      placeholder={"Selecionar a Data"}
                    />
                    <OnChange name={`data_recebimento_${index}`}>
                      {async (value) => {
                        const index_ = datasProgramadas.findIndex(
                          (dp) => dp.index === index
                        );
                        if (index_ !== -1) {
                          datasProgramadas.splice(index_, 1);
                        }
                        datasProgramadas.push({
                          nome: value,
                          index,
                        });
                        setDatasProgramadas(datasProgramadas);
                        form.change("reload", !values.reload);
                      }}
                    </OnChange>
                  </div>
                  <div className="col-4">
                    <Field
                      component={SelectSelecione}
                      naoDesabilitarPrimeiraOpcao
                      options={[
                        {
                          uuid: "PALETIZADA",
                          nome: "Paletizada",
                        },
                        {
                          uuid: "ESTIVADA_BATIDA",
                          nome: "Estivada/Batida",
                        },
                      ]}
                      label="Tipo de Carga"
                      name={`tipo_recebimento_${index}`}
                      placeholder={"Selecione a Carga"}
                    />
                  </div>
                </div>
              </>
            ))}

            <div className="text-center mb-2 mt-2">
              <Botao
                texto="+ Adicionar Recebimento"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className=""
                onClick={() => adicionaRecebimento()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
