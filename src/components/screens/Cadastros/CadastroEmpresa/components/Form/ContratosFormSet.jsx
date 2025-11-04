import React, { Fragment } from "react";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
import { InputComData } from "src/components/Shareable/DatePicker";
import { Tooltip } from "antd";
import Select from "src/components/Shareable/Select";
import Botao from "src/components/Shareable/Botao";
import { optionsPrograma } from "../../constants";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { useState } from "react";
import { encerraContratoTerceirizada } from "src/services/terceirizada.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { ModalRemoveContrato } from "../ModalRemoveContrato";
import MaskedInputText from "src/components/Shareable/Input/MaskedInputText";
import { numeroProcessoContratoSEIMask } from "src/constants/shared";
import { dateDelta, getDataObj } from "src/helpers/utilities";
import { composeValidators } from "../../../../../../helpers/fieldValidators";
import { deletaValues } from "../../../../../../helpers/formHelper";
import { numeroChamadaPublicamMask } from "src/constants/shared";

const contratosEstadoInicial = {
  numero_processo: null,
  numero_contrato: null,
  modalidade: null,
  numero_ata: null,
  numero_pregao: null,
  numero_chamada_publica: null,
  vigencia_de: null,
  vigencia_ate: null,
};

export const ContratosFormSet = ({
  ehDistribuidor,
  contratos,
  setContratos,
  terceirizada,
  values,
  numerosContratosCadastrados,
  form,
  optionsModalidade,
}) => {
  const [contratoARemover, setContratoARemover] = useState({});
  const [exibirModalRemoverContrato, setExibirModalRemoverContrato] =
    useState(false);

  const adicionaContrato = () => {
    const novosContratos = [...contratos, contratosEstadoInicial];
    setContratos(novosContratos);
  };

  const removeContrato = (index) => {
    const camposParaDeletar = [
      "numero_processo",
      "numero_contrato",
      "modalidade",
      "numero_ata",
      "numero_pregao",
      "numero_chamada_publica",
      "vigencia_de",
      "vigencia_ate",
      "programa",
    ];
    deletaValues(contratos, camposParaDeletar, values, index);

    const novosContratos = [...contratos];
    novosContratos.splice(index, 1);
    setContratos(novosContratos);
  };

  const encerraContrato = async () => {
    let uuid = contratoARemover.uuid;
    let response = await encerraContratoTerceirizada(uuid);
    if (response && response.status === 200) {
      let contratosNew = [...contratos];
      let index = contratosNew.findIndex((c) => c.uuid === uuid);
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

  const abrirModalRemoverContrato = (index) => {
    setExibirModalRemoverContrato(true);
    setContratoARemover(contratos[index]);
  };

  const getNomeModalidade = (value) =>
    optionsModalidade.find((modalidade) => modalidade.uuid === value)?.nome;

  const contratoJaCadastrado = (value) => {
    return numerosContratosCadastrados.includes(value)
      ? "Nº de Contrato já informado"
      : undefined;
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
                      <div className="col-4">
                        <Field
                          name={`numero_processo_${index}`}
                          component={MaskedInputText}
                          mask={numeroProcessoContratoSEIMask}
                          label="Nº do Processo Administrativo (SEI)"
                          required
                          validate={required}
                          apenasNumeros
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          name={`numero_contrato_${index}`}
                          component={InputText}
                          label="Nº do Contrato"
                          required
                          validate={composeValidators(
                            required,
                            !contratos[index].uuid
                              ? contratoJaCadastrado
                              : () => {},
                          )}
                          disabled={!!contratos[index].uuid}
                        />
                      </div>
                      <div className="col-2">
                        <Field
                          component={InputComData}
                          label="Vigência do Contrato"
                          name={`vigencia_de_${index}`}
                          placeholder="De"
                          writable={false}
                          minDate={null}
                          maxDate={
                            values[`vigencia_ate_${index}`]
                              ? getDataObj(values[`vigencia_ate_${index}`])
                              : null
                          }
                          required
                          validate={required}
                        />
                      </div>
                      <div className="col-2">
                        <Field
                          component={InputComData}
                          label="&nbsp;"
                          name={`vigencia_ate_${index}`}
                          placeholder="Até"
                          writable={false}
                          minDate={
                            values[`vigencia_de_${index}`]
                              ? getDataObj(values[`vigencia_de_${index}`])
                              : dateDelta(0)
                          }
                          maxDate={null}
                          validate={required}
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          name={`modalidade_${index}`}
                          component={Select}
                          label="Modalidade"
                          required
                          validate={required}
                          naoDesabilitarPrimeiraOpcao
                          options={optionsModalidade}
                          onChangeEffect={(e) => {
                            const value = e.target.value;
                            form.change(`numero_pregao_${index}`, "");
                            form.change(`numero_ata_${index}`, "");
                            form.change(`numero_chamada_publica_${index}`, "");
                            form.change(`modalidade_${index}`, value);
                          }}
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          name={`programa_${index}`}
                          component={Select}
                          label="Programa"
                          naoDesabilitarPrimeiraOpcao
                          options={optionsPrograma}
                        />
                      </div>
                      {getNomeModalidade(values[`modalidade_${index}`]) ===
                        "Pregão Eletrônico" && (
                        <Fragment>
                          <div className="col-4">
                            <Field
                              name={`numero_pregao_${index}`}
                              component={InputText}
                              label="Nº do Pregão Eletrônico"
                              required
                              validate={required}
                            />
                          </div>
                          <div className="col-4">
                            <Field
                              name={`numero_ata_${index}`}
                              component={InputText}
                              label="Nº da Ata"
                            />
                          </div>
                        </Fragment>
                      )}
                      {getNomeModalidade(values[`modalidade_${index}`]) ===
                        "Chamada Pública" && (
                        <div className="col-4">
                          <Field
                            name={`numero_chamada_publica_${index}`}
                            component={MaskedInputText}
                            mask={numeroChamadaPublicamMask}
                            label="Nº da Chamada Pública"
                            required
                            validate={required}
                          />
                        </div>
                      )}
                      {terceirizada &&
                        (contrato.encerrado ? (
                          <div className="col-12 mb-2">
                            <div className="aviso-encerramento">
                              <strong>Aviso:</strong> Contrato encerrado em{" "}
                              {contrato.data_hora_encerramento}
                            </div>
                          </div>
                        ) : (
                          contrato.numero_contrato !== null && (
                            <div className="row justify-content-end mb-2">
                              <div className="col-2">
                                <Botao
                                  className="btn-encerrar-contrato"
                                  texto="Encerrar Vigência"
                                  onClick={() =>
                                    abrirModalRemoverContrato(index)
                                  }
                                  type={BUTTON_TYPE.BUTTON}
                                  style={BUTTON_STYLE.RED_OUTLINE}
                                />
                              </div>
                            </div>
                          )
                        ))}
                    </div>
                    <hr />
                    <div className="flex-center my-3">
                      {index === contratos.length - 1 && (
                        <Botao
                          texto="+ Adicionar"
                          className="me-3"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          onClick={() => adicionaContrato()}
                        />
                      )}
                      {index > 0 && !contratos[index].uuid && (
                        <Tooltip title="Remover">
                          <span>
                            <Botao
                              texto="Remover"
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
