import React from "react";
import { Field } from "react-final-form";
import Select from "src/components/Shareable/Select";
import { required } from "src/helpers/fieldValidators";
import RadioButtonField from "src/components/Shareable/RadioButtonField";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

type Props = {
  ocorrenciasCount: number;
  setOcorrenciasCount: React.Dispatch<React.SetStateAction<number>>;
  values: any;
};

const optionsTipoOcorrencia = [
  { nome: "Selecione o tipo de ocorrência", uuid: "" },
  { nome: "FALTA", uuid: "FALTA" },
  { nome: "RECUSA", uuid: "RECUSA" },
  { nome: "OUTROS MOTIVOS", uuid: "OUTROS_MOTIVOS" },
];

const FormOcorrencia = ({
  ocorrenciasCount,
  setOcorrenciasCount,
  values,
}: Props) => {
  return (
    <>
      {Array.from({ length: ocorrenciasCount }).map((_, idx) => {
        const jaTeveRecusa = Array.from({ length: idx }).some(
          (_, i) => values[`tipo_${i}`] === "RECUSA"
        );

        return (
          <>
            {idx > 0 && (
              <div className="d-flex justify-content-end mt-3 mb-2">
                <Botao
                  icon="fas fa-trash"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.RED}
                  onClick={() => setOcorrenciasCount(ocorrenciasCount - 1)}
                />
              </div>
            )}
            <>
              <div className="col-6">
                <Field
                  component={Select}
                  name={`tipo_${idx}`}
                  label="Tipo de Ocorrência"
                  options={optionsTipoOcorrencia.map((opt) => ({
                    ...opt,
                    disabled: jaTeveRecusa && opt.uuid === "RECUSA",
                  }))}
                  placeholder="Selecione o tipo de ocorrência"
                  required
                  validate={required}
                />
              </div>
              <div className="row">
                {values[`tipo_${idx}`] === "FALTA" && (
                  <>
                    <div className="col-6">
                      <RadioButtonField
                        name={`relacao_${idx}`}
                        label="Ocorrência em relação a:"
                        options={[
                          { value: "CRONOGRAMA", label: "CRONOGRAMA" },
                          { value: "NOTA_FISCAL", label: "NOTA(S) FISCAL(IS)" },
                        ]}
                      />
                    </div>

                    {["CRONOGRAMA", "NOTA_FISCAL"].includes(
                      values[`relacao_${idx}`]
                    ) && (
                      <div className="row">
                        {values[`relacao_${idx}`] === "NOTA_FISCAL" && (
                          <div className="col-6">
                            <Field
                              component={InputText}
                              label="Nº das Notas Fiscais Sujeitas a Pagamento Parcial"
                              name={`numero_nota_${idx}`}
                              placeholder="Digite o número da nota fiscal"
                              required
                              validate={required}
                            />
                          </div>
                        )}

                        <div
                          className={
                            values[`relacao_${idx}`] === "NOTA_FISCAL"
                              ? "col-6"
                              : "col-12"
                          }
                        >
                          <Field
                            component={InputText}
                            label="Quantidade Faltante"
                            name={`quantidade_${idx}`}
                            placeholder="Digite a quantidade faltante"
                            required
                            validate={required}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {values[`tipo_${idx}`] === "RECUSA" && (
                  <>
                    <div className="row">
                      <div className="col-6">
                        <RadioButtonField
                          name={`relacao_${idx}`}
                          label="Ocorrência em relação a:"
                          options={[
                            { value: "TOTAL", label: "TOTAL" },
                            { value: "PARCIAL", label: "PARCIAL" },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <Field
                          component={InputText}
                          label="Nº das Notas Fiscais Sujeitas a Pagamento Parcial"
                          name={`numero_nota_${idx}`}
                          placeholder="Digite o número da nota fiscal"
                          required
                          validate={required}
                        />
                      </div>

                      <div className="col-6">
                        <Field
                          component={InputText}
                          label="Quantidade Recusada"
                          name={`quantidade_${idx}`}
                          placeholder="Digite a quantidade recusada"
                          required
                          validate={required}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
            <div className="row">
              <div className="col-12">
                <Field
                  component={TextArea}
                  label="Descrever a ocorrência"
                  name={`descricao_${idx}`}
                  placeholder="Descreva a ocorrência"
                  required
                  validate={required}
                />
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default FormOcorrencia;
