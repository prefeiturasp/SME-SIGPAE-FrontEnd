import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import { Select } from "src/components/Shareable/Select";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { FormApi } from "final-form";
import { required } from "src/helpers/fieldValidators";
import { getError } from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import { DiretoriaRegionalInterface } from "src/interfaces/escola.interface";
import { LoteRascunhosInterface } from "src/interfaces/rascunhos.interface";
import { TerceirizadaInterface } from "src/interfaces/terceirizada.interface";
import moment from "moment";
import React, { useState } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { encerraContratoTerceirizada } from "src/services/terceirizada.service";
import { VIGENCIA_STATUS } from "../../../ConsultaEditaisContratos/constants";
import {
  FormCadastroEditaisContratosContratoInterface,
  FormCadastroEditaisContratosInterface,
  FormCadastroEditaisContratosVigenciaInterface,
} from "../../../interfaces";
import { ModalEncerrarContrato } from "../ModalEncerrarContrato.tsx";

interface FieldArrayContratosInterface {
  form: FormApi<any, Partial<any>>;
  values: FormCadastroEditaisContratosInterface;
  push: (_field: string) => void;
  lotes: Array<LoteRascunhosInterface>;
  DREs: Array<DiretoriaRegionalInterface>;
  empresas: Array<TerceirizadaInterface>;
  getEditalContratoAsync: (_uuid: string) => Promise<void>;
}

export const FieldArrayContratos = ({
  form,
  values,
  push,
  lotes,
  DREs,
  empresas,
  getEditalContratoAsync,
}: FieldArrayContratosInterface) => {
  const [showModalEncerrarContrato, setShowModalEncerrarContrato] =
    useState<boolean>(false);
  const [contratoAEncerrar, setContratoAEncerrar] =
    useState<FormCadastroEditaisContratosContratoInterface>(undefined);

  const renderizarLabelLote = (
    selected: Array<string>,
    options: Array<string>
  ): string => {
    if (selected.length === 0) {
      return "Selecione um ou mais lotes...";
    }
    if (selected.length === options.length) {
      return "Todos os lotes foram selecionados";
    }
    if (selected.length === 1) {
      return `${selected.length} lote selecionado`;
    }
    return `${selected.length} lotes selecionados`;
  };

  const renderizarDiretoriaRegional = (
    selected: Array<string>,
    options: Array<string>
  ): string => {
    if (selected.length === 0) {
      return "Selecione uma ou mais diretorias...";
    }
    if (selected.length === options.length) {
      return "Todas as diretorias foram selecionadas";
    }
    if (selected.length === 1) {
      return `${selected.length} diretoria selecionada`;
    }
    return `${selected.length} diretorias selecionadas`;
  };

  const removeContrato = (index_contratos: number): void => {
    form.change(
      `contratos`,
      values.contratos.filter(
        (_: FormCadastroEditaisContratosContratoInterface, i: number) =>
          i !== index_contratos
      )
    );
  };

  const exibeBotaoRemoverVigencia = (
    indexVigencia: number,
    index_contratos: number
  ): boolean => {
    return (
      indexVigencia > 0 &&
      !values.contratos[index_contratos].encerrado &&
      (!values.contratos[index_contratos].vigencias[indexVigencia]?.uuid ||
        moment(
          values.contratos[index_contratos].vigencias[indexVigencia]
            ?.data_final,
          "DD/MM/YYYY"
        ).toDate() > new Date())
    );
  };

  const removeVigencia = (
    index_contratos: number,
    indexVigencia: number
  ): void => {
    form.change(
      `contratos[${index_contratos}].vigencias`,
      values.contratos[index_contratos].vigencias.filter(
        (_: FormCadastroEditaisContratosVigenciaInterface, i: number) =>
          i !== indexVigencia
      )
    );
  };

  const exibeAvisoVigenciaVencida = (
    indexVigencia: number,
    index_contratos: number
  ): boolean => {
    return (
      indexVigencia ===
        values.contratos[index_contratos]?.vigencias.length - 1 &&
      values.contratos[index_contratos]?.vigencias[indexVigencia]?.status ===
        VIGENCIA_STATUS.VENCIDO
    );
  };

  const exibeAvisoContratoEncerrado = (
    indexVigencia: number,
    index_contratos: number
  ): boolean => {
    return (
      indexVigencia ===
        values.contratos[index_contratos]?.vigencias.length - 1 &&
      values.contratos[index_contratos].encerrado
    );
  };

  const encerrarContrato = async (
    contrato: FormCadastroEditaisContratosContratoInterface
  ): Promise<void> => {
    const response = await encerraContratoTerceirizada(contrato.uuid);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Contrato encerrado com sucesso!");
      setShowModalEncerrarContrato(false);
      getEditalContratoAsync(values.uuid);
    } else {
      toastError(getError(response.data));
    }
  };

  const exibeRemoverContrato = (index_contratos: number): boolean => {
    return (
      index_contratos > 0 &&
      (!values.contratos[index_contratos]?.uuid ||
        moment(
          values.contratos[index_contratos]?.vigencias[0]?.data_inicial,
          "DD/MM/YYYY"
        ).toDate() > new Date())
    );
  };

  const getMinDateDataInicial = (
    index_contratos: number,
    indexVigencia: number
  ): Date | null => {
    return indexVigencia === 0
      ? null
      : moment(
          values.contratos[index_contratos].vigencias[indexVigencia - 1]
            ?.data_final,
          "DD/MM/YYYY"
        ).toDate();
  };

  const getMinDateDataFinal = (
    index_contratos: number,
    indexVigencia: number
  ): Date => {
    return indexVigencia === 0
      ? moment(
          values.contratos[index_contratos].vigencias[indexVigencia]
            .data_inicial,
          "DD/MM/YYYY"
        ).toDate()
      : moment(
          values.contratos[index_contratos].vigencias[indexVigencia - 1]
            ?.data_final,
          "DD/MM/YYYY"
        ).toDate();
  };

  const getDataInicialDisabled = (
    index_contratos: number,
    indexVigencia: number
  ): boolean => {
    return (
      values.contratos[index_contratos].encerrado ||
      (values.contratos[index_contratos].vigencias[indexVigencia]?.uuid &&
        moment(
          values.contratos[index_contratos].vigencias[indexVigencia]
            ?.data_inicial,
          "DD/MM/YYYY"
        ).toDate() <= new Date())
    );
  };

  const getDataFinalDisabled = (
    index_contratos: number,
    indexVigencia: number
  ): boolean => {
    return (
      values.contratos[index_contratos].encerrado ||
      (values.contratos[index_contratos].vigencias[indexVigencia]?.uuid &&
        moment(
          values.contratos[index_contratos].vigencias[indexVigencia]
            ?.data_final,
          "DD/MM/YYYY"
        ).toDate() <= new Date())
    );
  };

  return (
    <FieldArray name="contratos">
      {({ fields }) =>
        fields.map((name_contratos, index_contratos) => (
          <div key={name_contratos}>
            <div className="row mt-3 mb-3">
              <div className="col-12">
                <div className="title">
                  <span
                    className={`com-linha ${
                      exibeRemoverContrato(index_contratos) ? "w-78" : "w-100"
                    }`}
                  >
                    Contratos Relacionados
                  </span>
                  {exibeRemoverContrato(index_contratos) && (
                    <span
                      onClick={() => {
                        removeContrato(index_contratos);
                      }}
                      className="remover float-end"
                    >
                      <i className="fas fa-trash" /> Remover contrato
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-8">
                <Field
                  name={`${name_contratos}.processo`}
                  label="Processo administrativo do contrato"
                  placeholder="Digite o número do processo administrativo"
                  component={InputText}
                  required
                  validate={required}
                  max={50}
                />
              </div>
              <div className="col-4">
                <Field
                  name={`${name_contratos}.data_proposta`}
                  label="Data da proposta"
                  placeholder="Selecione a data da proposta"
                  component={InputComData}
                  validate={required}
                  minDate={null}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field
                  name={`${name_contratos}.numero`}
                  component={InputText}
                  label="Nº do Contrato"
                  placeholder="Digite o número do contrato"
                  required
                  validate={required}
                />
              </div>
              <FieldArray name={`${name_contratos}.vigencias`}>
                {({ fields }) =>
                  fields.map((name_vigencias, indexVigencia) => (
                    <>
                      <div className={`col-4`}>
                        <Field
                          component={InputComData}
                          label={`${indexVigencia > 0 ? "Nova " : ""}Vigência`}
                          name={`${name_vigencias}.data_inicial`}
                          placeholder="DE"
                          writable={false}
                          minDate={getMinDateDataInicial(
                            index_contratos,
                            indexVigencia
                          )}
                          maxDate={moment(
                            values.contratos[index_contratos].vigencias[
                              indexVigencia
                            ]?.data_final,
                            "DD/MM/YYYY"
                          ).toDate()}
                          required
                          validate={required}
                          disabled={getDataInicialDisabled(
                            index_contratos,
                            indexVigencia
                          )}
                        />
                      </div>
                      <div className={`col-4`}>
                        <Field
                          component={InputComData}
                          label="&nbsp;"
                          name={`${name_vigencias}.data_final`}
                          placeholder="ATÉ"
                          writable={false}
                          minDate={getMinDateDataFinal(
                            index_contratos,
                            indexVigencia
                          )}
                          maxDate={null}
                          disabled={getDataFinalDisabled(
                            index_contratos,
                            indexVigencia
                          )}
                        />
                      </div>
                      {indexVigencia > 0 &&
                        !exibeBotaoRemoverVigencia(
                          indexVigencia,
                          index_contratos
                        ) && <div className="col-2" />}
                      {exibeBotaoRemoverVigencia(
                        indexVigencia,
                        index_contratos
                      ) && (
                        <div className="col-2 mt-auto mb-2">
                          <Botao
                            texto="Remover"
                            type={BUTTON_TYPE.BUTTON}
                            onClick={() =>
                              removeVigencia(index_contratos, indexVigencia)
                            }
                            style={BUTTON_STYLE.RED_OUTLINE}
                          />
                        </div>
                      )}
                      {exibeAvisoVigenciaVencida(
                        indexVigencia,
                        index_contratos
                      ) && (
                        <div
                          className="pt-3 pb-3"
                          style={{
                            paddingLeft: "12px",
                            paddingRight: "12px",
                          }}
                        >
                          <div className="aviso vencido">
                            <b>Aviso:</b> Contrato fora do prazo de vigência.
                          </div>
                        </div>
                      )}
                      {exibeAvisoContratoEncerrado(
                        indexVigencia,
                        index_contratos
                      ) && (
                        <div
                          className="pt-3 pb-3"
                          style={{
                            paddingLeft: "12px",
                            paddingRight: "12px",
                          }}
                        >
                          <div className="aviso encerrado">
                            <b>Aviso:</b> Contrato encerrado em{" "}
                            {
                              values.contratos[index_contratos]
                                .data_hora_encerramento
                            }
                          </div>
                        </div>
                      )}
                    </>
                  ))
                }
              </FieldArray>
            </div>

            {!values.contratos[index_contratos].encerrado && (
              <div className="row mt-3">
                <div className="col-12">
                  <Botao
                    texto="Adicionar Vigência"
                    onClick={() => push(`${name_contratos}.vigencias`)}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    type={BUTTON_TYPE.BUTTON}
                    disabled={
                      !values.contratos[index_contratos]?.vigencias[
                        values.contratos[index_contratos].vigencias.length - 1
                      ]?.data_final
                    }
                  />
                  {values.uuid && (
                    <Botao
                      texto="Encerrar contrato"
                      className="ms-3"
                      onClick={() => {
                        setContratoAEncerrar(values.contratos[index_contratos]);
                        setShowModalEncerrarContrato(true);
                      }}
                      style={BUTTON_STYLE.RED_OUTLINE}
                      type={BUTTON_TYPE.BUTTON}
                      disabled={
                        !values.contratos[index_contratos]?.vigencias[
                          values.contratos[index_contratos].vigencias.length - 1
                        ]?.data_final
                      }
                    />
                  )}
                  {contratoAEncerrar && (
                    <ModalEncerrarContrato
                      showModal={showModalEncerrarContrato}
                      closeModal={() => setShowModalEncerrarContrato(false)}
                      contrato={contratoAEncerrar}
                      encerrarContrato={async (contrato) =>
                        await encerrarContrato(contrato)
                      }
                    />
                  )}
                </div>
              </div>
            )}
            <div className="row mt-3">
              <div className="col-6">
                <label className="label fw-normal">
                  <span className="required-asterisk">* </span>
                  Lote
                </label>
                <Field
                  component={StatefulMultiSelect}
                  name={`${name_contratos}.lotes`}
                  selected={values.contratos[index_contratos]?.lotes || []}
                  options={lotes.map((lote) => ({
                    label: lote.nome,
                    value: lote.uuid,
                  }))}
                  onSelectedChanged={(values_: Array<string>) => {
                    form.change(`contratos[${index_contratos}].lotes`, values_);
                  }}
                  overrideStrings={{
                    search: "Busca",
                    selectSomeItems: "Selecione",
                    allItemsAreSelected: "Todos os lotes estão selecionados",
                    selectAll: "Todos",
                  }}
                  valueRenderer={renderizarLabelLote}
                  validate={required}
                />
                {values.contratos[index_contratos]?.lotes?.length > 0 && (
                  <div className="lotes-selecionados pt-3">
                    <div className="mb-3">Lotes selecionados:</div>
                    {lotes
                      .filter((lote) =>
                        values.contratos[index_contratos].lotes.includes(
                          lote.uuid
                        )
                      )
                      .map((lote, indice) => {
                        return (
                          <span className="value-selected-unities" key={indice}>
                            {`${lote.nome} | `}
                          </span>
                        );
                      })}
                  </div>
                )}
              </div>
              <div className="col-6">
                <label className="label fw-normal">
                  <span className="required-asterisk">* </span>
                  DRE
                </label>
                <Field
                  component={StatefulMultiSelect}
                  name={`${name_contratos}.diretorias_regionais`}
                  selected={
                    values.contratos[index_contratos]?.diretorias_regionais ||
                    []
                  }
                  options={DREs.map((dre) => ({
                    label: dre.nome,
                    value: dre.uuid,
                  }))}
                  onSelectedChanged={(values_: Array<string>) => {
                    form.change(
                      `contratos[${index_contratos}].diretorias_regionais`,
                      values_
                    );
                  }}
                  overrideStrings={{
                    search: "Busca",
                    selectSomeItems: "Selecione",
                    allItemsAreSelected:
                      "Todos as diretorias regionais estão selecionadas",
                    selectAll: "Todos",
                  }}
                  valueRenderer={renderizarDiretoriaRegional}
                  validate={required}
                />
                {values.contratos[index_contratos]?.diretorias_regionais
                  ?.length > 0 && (
                  <div className="lotes-selecionados pt-3">
                    <div className="mb-3">DREs selecionadas:</div>
                    {DREs.filter((dre) =>
                      values.contratos[
                        index_contratos
                      ]?.diretorias_regionais.includes(dre.uuid)
                    ).map((dre, indice) => {
                      return (
                        <div className="value-selected-unities" key={indice}>
                          {dre.nome}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <label className="label fw-normal">
                  <span className="required-asterisk">* </span>
                  Empresa
                </label>
                <Field
                  component={Select}
                  name={`${name_contratos}.terceirizada`}
                  options={[
                    {
                      nome: "Selecione uma empresa",
                      uuid: "",
                    },
                  ].concat(
                    empresas.map((empresa) => {
                      return {
                        nome: empresa.nome_fantasia,
                        uuid: empresa.uuid,
                      };
                    })
                  )}
                  required
                  validate={required}
                  naoDesabilitarPrimeiraOpcao
                />
              </div>
            </div>
          </div>
        ))
      }
    </FieldArray>
  );
};
