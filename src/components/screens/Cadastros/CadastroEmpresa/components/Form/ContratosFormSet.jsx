import React from "react";
import { Field } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import { required } from "helpers/fieldValidators";
import { InputComData } from "components/Shareable/DatePicker";
import { Tooltip } from "antd";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { useState } from "react";
import { encerraContratoTerceirizada } from "services/terceirizada.service";
import { toastError } from "components/Shareable/Toast/dialogs";
import { ModalRemoveContrato } from "../ModalRemoveContrato";
import MaskedInputText from "components/Shareable/Input/MaskedInputText";
import { numeroProcessoContratoSEIMask } from "constants/shared";

const contratosEstadoInicial = {
  numero_processo: null,
  numero_contrato: null,
  vigencia_de: null,
  vigencia_ate: null
};

export const ContratosFormSet = ({
  ehDistribuidor,
  contratos,
  setContratos,
  terceirizada,
  values
}) => {
  const [contratoARemover, setContratoARemover] = useState({});
  const [exibirModalRemoverContrato, setExibirModalRemoverContrato] = useState(
    false
  );
  const adicionaContrato = () => {
    contratos = contratos.concat([contratosEstadoInicial]);
    setContratos(contratos);
  };

  const removeContrato = index => {
    let newContratos = [...contratos];
    newContratos.splice(index, 1);
    setContratos(newContratos);
  };

  const encerraContrato = async () => {
    let uuid = contratoARemover.uuid;
    let response = await encerraContratoTerceirizada(uuid);
    if (response && response.status === 200) {
      let contratosNew = [...contratos];
      let index = contratosNew.findIndex(c => c.uuid === uuid);
      contratosNew[index].data_hora_encerramento =
        response.data.data_hora_encerramento;
      contratosNew[index].encerrado = true;
      setContratos(contratosNew);
      fecharModalRemoverContrato();
    } else {
      toastError("Erro ao encerrar contrato");
    }
  };

  const fecharModalRemoverContrato = () => {
    setExibirModalRemoverContrato(false);
  };

  const abrirModalRemoverContrato = index => {
    setExibirModalRemoverContrato(true);
    setContratoARemover(contratos[index]);
  };

  return (
    <>
      {ehDistribuidor && (
        <div>
          <ModalRemoveContrato
            numeroContrato={contratoARemover.numero}
            values={values}
            onSubmit={encerraContrato}
            closeModal={fecharModalRemoverContrato}
            showModal={exibirModalRemoverContrato}
          />
          <hr className="linha-form" />
          <div>
            <div className="card-body">
              <div className="card-title green">Contratos</div>
              {contratos.map((contrato, index) => {
                return (
                  <div key={index}>
                    <div className="row">
                      <div className="col-6">
                        <Field
                          name={`numero_processo_${index}`}
                          component={MaskedInputText}
                          mask={numeroProcessoContratoSEIMask}
                          label="Nº do Processo Administrativo do Contrato (SEI)"
                          required
                          validate={required}
                          apenasNumeros
                        />
                      </div>
                      <div className="col-6">
                        <Field
                          name={`numero_contrato_${index}`}
                          component={InputText}
                          label="Nº do Contrato"
                          required
                          validate={required}
                        />
                      </div>
                      <div className="col-3">
                        <Field
                          component={InputComData}
                          label="Vigência do Contrato"
                          name={`vigencia_de_${index}`}
                          placeholder="De"
                          writable={false}
                          required
                        />
                      </div>
                      <div className="col-3">
                        <Field
                          component={InputComData}
                          label="&nbsp;"
                          name={`vigencia_ate_${index}`}
                          placeholder="Até"
                          writable={false}
                          maxDate={null}
                        />
                      </div>
                      {terceirizada &&
                        (contrato.encerrado ? (
                          <div className="col-6">
                            <div className="aviso-encerramento">
                              <strong>Aviso:</strong> Contrato encerrado em{" "}
                              {contrato.data_hora_encerramento}
                            </div>
                          </div>
                        ) : (
                          <div className="col-3">
                            <Botao
                              className="btn-encerrar-contrato"
                              texto="Encerrar Contrato"
                              onClick={() => abrirModalRemoverContrato(index)}
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.RED_OUTLINE}
                            />
                          </div>
                        ))}
                    </div>
                    <div className="flex-center my-3">
                      <Botao
                        texto="+ Adicionar"
                        className="mr-4"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        onClick={() => adicionaContrato()}
                      />

                      {index > 0 && (
                        <Tooltip title="Remover Contrato">
                          <span>
                            <Botao
                              texto="Remover Contrato"
                              icon="fas fa-trash"
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                              onClick={() => {
                                removeContrato(index);
                              }}
                            />
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
