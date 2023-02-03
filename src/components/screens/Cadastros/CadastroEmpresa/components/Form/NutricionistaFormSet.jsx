import React from "react";
import { Field } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import { required } from "helpers/fieldValidators";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { OnChange } from "react-final-form-listeners";
import MaskedInputText from "components/Shareable/Input/MaskedInputText";
import { telefoneMask } from "constants/shared";

export const NutricionistaFormSet = ({
  ehDistribuidor,
  contatosTerceirizadaForm,
  setContatosTerceirizadaForm,
  contatosNutricionista,
  setContatosNutricionista
}) => {
  const nomeFormContatoTerceirizada = () => {
    const indiceDoFormAtual = `contatoTerceirizada_${
      contatosTerceirizadaForm.length
    }`;
    let contatosTerceirizadaFormArray = [...contatosTerceirizadaForm];
    contatosTerceirizadaFormArray.push(indiceDoFormAtual);
    setContatosTerceirizadaForm(contatosTerceirizadaFormArray);
  };
  const adicionaContatoNutricionista = () => {
    const contatosNutricionistaArray = contatosNutricionista;
    contatosNutricionistaArray.push({
      vinculo_atual: null,
      telefone: null,
      responsavel: null,
      crn: null,
      email: null
    });
    setContatosNutricionista(contatosNutricionistaArray);
  };

  const excluirNutricionista = (
    indice,
    contatosNutricionista,
    setContatosNutricionista,
    contatosTerceirizadaForm,
    setContatosTerceirizadaForm
  ) => {
    if (
      contatosNutricionista.indexOf(indice) !== -1 &&
      contatosNutricionista[indice].vinculo_atual
    ) {
      setContatosNutricionista([]);
    } else {
      let newContatosNutricionista = [...contatosNutricionista];
      newContatosNutricionista.splice(indice, 1);
      let newContatosTerceirizadaForm = contatosTerceirizadaForm;
      newContatosTerceirizadaForm.splice(indice, 1);
      setContatosNutricionista(newContatosNutricionista);
      setContatosTerceirizadaForm(newContatosTerceirizadaForm);
    }
  };

  const setaContatosNutricionista = (input, event, indice) => {
    contatosNutricionista[indice][input] = event;
    setContatosNutricionista(contatosNutricionista);
  };
  return (
    <>
      {!ehDistribuidor && (
        <div>
          <div>
            <hr className="linha-form my-3" />
            <div className="container-fields">
              <div className="fields">
                {contatosTerceirizadaForm.map(
                  (contatoTerceirizada, indiceTerceirizada) => {
                    return (
                      <>
                        {indiceTerceirizada > 0 && <hr />}
                        <div className="form-section-terceirizada">
                          <div className="section-nutri-crn">
                            <div>
                              <Field
                                name={`nutricionista_nome_${indiceTerceirizada}`}
                                component={InputText}
                                label="Nutricionista Responsável Técnico"
                                required
                                validate={required}
                                maxlength="140"
                              />
                              <OnChange
                                name={`nutricionista_nome_${indiceTerceirizada}`}
                              >
                                {value =>
                                  setaContatosNutricionista(
                                    "responsavel",
                                    value,
                                    indiceTerceirizada
                                  )
                                }
                              </OnChange>
                            </div>
                            <div>
                              <Field
                                name={`nutricionista_crn_${indiceTerceirizada}`}
                                label="CRN"
                                component={InputText}
                                required
                                validate={required}
                                maxlength="140"
                              />
                              <OnChange
                                name={`nutricionista_crn_${indiceTerceirizada}`}
                              >
                                {value =>
                                  setaContatosNutricionista(
                                    "crn",
                                    value,
                                    indiceTerceirizada
                                  )
                                }
                              </OnChange>
                            </div>
                            {contatosNutricionista.length > 1 && (
                              <div className="trash">
                                <i
                                  onClick={() =>
                                    excluirNutricionista(
                                      indiceTerceirizada,
                                      contatosNutricionista,
                                      setContatosNutricionista,
                                      contatosTerceirizadaForm,
                                      setContatosTerceirizadaForm
                                    )
                                  }
                                  className="fas fa-trash"
                                />
                              </div>
                            )}
                          </div>
                          <div className="section-nutri-contato pt-2">
                            <div>
                              <Field
                                name={`telefone_terceirizada_${indiceTerceirizada}`}
                                component={MaskedInputText}
                                mask={telefoneMask}
                                label="Telefone/Celular Técnico"
                                id={`telefone_terceirizada_${indiceTerceirizada}`}
                                indice={indiceTerceirizada}
                                required
                                validate={required}
                              />
                              <OnChange
                                name={`telefone_terceirizada_${indiceTerceirizada}`}
                              >
                                {value =>
                                  setaContatosNutricionista(
                                    "telefone",
                                    value,
                                    indiceTerceirizada
                                  )
                                }
                              </OnChange>
                            </div>
                            <div>
                              <Field
                                name={`email_terceirizada_${indiceTerceirizada}`}
                                label="E-mail"
                                type={"email"}
                                component={InputText}
                                required
                                validate={required}
                                maxlength="140"
                              />
                              <OnChange
                                name={`email_terceirizada_${indiceTerceirizada}`}
                              >
                                {value =>
                                  setaContatosNutricionista(
                                    "email",
                                    value,
                                    indiceTerceirizada
                                  )
                                }
                              </OnChange>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  }
                )}
              </div>
              <div className={`col-1 mt-auto mb-1`}>
                <Botao
                  texto="+"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={() => {
                    nomeFormContatoTerceirizada();
                    adicionaContatoNutricionista();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
