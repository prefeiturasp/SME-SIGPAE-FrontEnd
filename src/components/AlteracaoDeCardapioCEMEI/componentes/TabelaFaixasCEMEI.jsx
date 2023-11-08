import React, { useState } from "react";
import { Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import MultiSelect from "components/Shareable/FinalForm/MultiSelect";
import InputText from "components/Shareable/Input/InputText";
import { maxValue, naoPodeSerZero, required } from "helpers/fieldValidators";
import { agregarDefault, composeValidators } from "helpers/utilities";
import { formatarParaMultiselect } from "helpers/utilities";
import { totalMatriculados, totalSolicitacao } from "../helpers";
import Select from "components/Shareable/Select";

export const TabelaFaixasCEMEI = ({
  values,
  form,
  periodo,
  periodoIndice,
  vinculos,
  alimentosCEI,
  alimentosEMEI,
  substitutosCEI,
  substitutosEMEI,
  ehMotivoRPL,
}) => {
  const periodoCEI = vinculos.find(
    (vinculo) =>
      vinculo.tipo_unidade_escolar.iniciais === "CEI DIRET" &&
      vinculo.periodo_escolar.nome === periodo.nome
  );
  const periodoEMEI = vinculos.find(
    (vinculo) =>
      vinculo.tipo_unidade_escolar.iniciais === "EMEI" &&
      vinculo.periodo_escolar.nome === periodo.nome
  );
  const [alimentoSelecionadoCEI, setAlimentoSelecionadoCEI] = useState([]);
  const [alimentoSelecionadoEMEI, setAlimentoSelecionadoEMEI] = useState([]);
  const [totalFrequenciaEMEI, setTotalFrequenciaEMEI] = useState(0);
  const [totalFrequenciaCEI, setTotalFrequenciaCEI] = useState(0);

  return (
    <>
      {((periodo.EMEI > 0 &&
        ["EMEI", "TODOS"].includes(values.alunos_cei_e_ou_emei)) ||
        (periodo.CEI.length > 0 &&
          periodo.CEI.some((obj) => obj.quantidade_alunos > 0) &&
          ["CEI", "TODOS"].includes(values.alunos_cei_e_ou_emei))) && (
        <div className="row">
          <div className="col-12">
            <label
              style={{
                background: periodo.background,
                border: `1px solid ${periodo.borderColor}`,
                borderRadius: "5px",
                margin: "1% 0px",
                width: "100%",
                padding: "8px 15px",
                height: "40px",
              }}
            >
              <Field
                component={"input"}
                type="checkbox"
                name={`substituicoes[${periodoIndice}][checked]`}
                disabled={
                  !values.alunos_cei_e_ou_emei ||
                  !values.motivo ||
                  !(values.alterar_dia || values.data_inicial)
                }
              />
              <OnChange name={`substituicoes[${periodoIndice}][checked]`}>
                {async () => {
                  form.change(
                    `substituicoes[${periodoIndice}][periodo_uuid]`,
                    periodoCEI.periodo_escolar.uuid
                  );
                }}
              </OnChange>
              <span
                className="checkbox-custom"
                data-cy={`checkbox-${periodo.nome}`}
              />
              {periodo.nome}
            </label>
          </div>
          <div className="col-12">
            <Field
              component={"input"}
              type="hidden"
              name={`substituicoes[${periodoIndice}][periodo_uuid]`}
            />
          </div>
        </div>
      )}

      {/* CEI */}

      {periodoCEI &&
        values.alunos_cei_e_ou_emei &&
        ["CEI", "TODOS"].includes(values.alunos_cei_e_ou_emei) &&
        values.substituicoes[periodoIndice] &&
        values.substituicoes[periodoIndice].checked &&
        totalMatriculados(periodo.CEI) > 0 && (
          <>
            <div className="row mt-2">
              <div className="col-4">
                <div className=" alunos-label">Alunos CEI</div>
              </div>
              <div className="col-4">
                {ehMotivoRPL(values) && (
                  <Field
                    label="Alterar alimentação de:"
                    component={Select}
                    name={`substituicoes[${periodoIndice}][cei][tipos_alimentacao_de]`}
                    options={agregarDefault(
                      alimentosCEI.find(
                        (v) => v.periodo_escolar.nome === periodo.nome
                      ).tipos_alimentacao
                    )}
                    naoDesabilitarPrimeiraOpcao
                    validate={totalFrequenciaCEI > 0 && required}
                    required
                  />
                )}
                {!ehMotivoRPL(values) && (
                  <Field
                    label="Alterar alimentação de:"
                    component={MultiSelect}
                    disableSearch
                    name={`substituicoes[${periodoIndice}][cei][tipos_alimentacao_de]`}
                    multiple
                    options={formatarParaMultiselect(
                      alimentosCEI.find(
                        (v) => v.periodo_escolar.nome === periodo.nome
                      ).tipos_alimentacao
                    )}
                    nomeDoItemNoPlural="Alimentos"
                    validate={totalFrequenciaCEI > 0 && required}
                    required
                  />
                )}
                <OnChange
                  name={`substituicoes[${periodoIndice}][cei][tipos_alimentacao_de]`}
                >
                  {async (value) => {
                    setAlimentoSelecionadoCEI(value);
                  }}
                </OnChange>
              </div>
              <div className="col-4">
                {!ehMotivoRPL(values) && (
                  <Field
                    label="Para alimentação:"
                    component={MultiSelect}
                    disableSearch
                    name={`substituicoes[${periodoIndice}][cei][tipos_alimentacao_para]`}
                    multiple
                    options={formatarParaMultiselect(
                      substitutosCEI
                        .find((v) => v.periodo_escolar.nome === periodo.nome)
                        .tipos_alimentacao.filter(
                          (ta) => !alimentoSelecionadoCEI.includes(ta.uuid)
                        )
                    )}
                    nomeDoItemNoPlural="Substitutos"
                    validate={totalFrequenciaCEI > 0 && required}
                    required
                  />
                )}
                {ehMotivoRPL(values) && (
                  <Field
                    label="Para alimentação:"
                    component={Select}
                    options={agregarDefault(
                      substitutosCEI
                        .find((v) => v.periodo_escolar.nome === periodo.nome)
                        .tipos_alimentacao.filter(
                          (ta) => !alimentoSelecionadoCEI.includes(ta.uuid)
                        )
                    )}
                    name={`substituicoes[${periodoIndice}][cei][tipos_alimentacao_para]`}
                    nomeDoItemNoPlural="Substitutos"
                    validate={totalFrequenciaCEI > 0 && required}
                    required
                  />
                )}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <table className="table faixas-etarias-cei-alteracao">
                  <thead>
                    <tr>
                      <th className="col-7">Faixa Etária</th>
                      <th className="col-3 text-center">Alunos matriculados</th>
                      <th className="col-2 text-center">
                        <span className="asterisco">* </span>Quantidade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {periodo.CEI.map((faixa, faixaIndice) => {
                      return (
                        faixa.inicio > 11 && (
                          <tr key={faixaIndice}>
                            <td className="col-7">{faixa.faixa}</td>
                            <td className="col-3 text-center">
                              {faixa.quantidade_alunos}
                            </td>
                            <td className="col-2 text-center">
                              <Field
                                component={InputText}
                                type="number"
                                name={`substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][quantidade_alunos]`}
                                validate={composeValidators(
                                  required,
                                  naoPodeSerZero,
                                  maxValue(parseInt(faixa.quantidade_alunos))
                                )}
                                max={parseInt(faixa.quantidade_alunos)}
                                min={0}
                                step="1"
                                className="input-quantidades"
                                required
                              />
                              <OnChange
                                name={`substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][quantidade_alunos]`}
                              >
                                {async () => {
                                  form.change(
                                    `substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][faixa_uuid]`,
                                    faixa.uuid
                                  );
                                  form.change(
                                    `substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][matriculados_quando_criado]`,
                                    parseInt(faixa.quantidade_alunos)
                                  );
                                  setTotalFrequenciaCEI(
                                    totalSolicitacao(values, periodoCEI)
                                  );
                                }}
                              </OnChange>
                              <Field
                                component={"input"}
                                type="hidden"
                                name={`substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][faixa_uuid]`}
                              />
                              <Field
                                component={"input"}
                                type="hidden"
                                name={`substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][matriculados_quando_criado]`}
                              />
                            </td>
                          </tr>
                        )
                      );
                    })}
                    <tr className="total-faixas-cei">
                      <td className="col-8 font-weight-bold">Total</td>
                      <td className="col-2 text-center">
                        {totalMatriculados(periodo.CEI)}
                      </td>
                      <td className="col-2 text-center">
                        {totalSolicitacao(values, periodoCEI)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      {/* EMEI */}

      {periodoEMEI &&
        values.alunos_cei_e_ou_emei &&
        ["EMEI", "TODOS"].includes(values.alunos_cei_e_ou_emei) &&
        values.substituicoes[periodoIndice] &&
        values.substituicoes[periodoIndice].checked &&
        parseInt(periodo.EMEI) > 0 && (
          <>
            <div className="row mt-2">
              <div className="col-4">
                <div className=" alunos-label">Alunos EMEI</div>
              </div>
              <div className="col-4">
                <Field
                  label="Alterar alimentação de:"
                  component={MultiSelect}
                  disableSearch
                  name={`substituicoes[${periodoIndice}][emei][tipos_alimentacao_de]`}
                  multiple
                  options={formatarParaMultiselect(
                    alimentosEMEI.find(
                      (v) => v.periodo_escolar.nome === periodo.nome
                    ).tipos_alimentacao
                  )}
                  nomeDoItemNoPlural="Alimentos"
                  validate={totalFrequenciaEMEI > 0 && required}
                  required
                />
                <OnChange
                  name={`substituicoes[${periodoIndice}][emei][tipos_alimentacao_de]`}
                >
                  {async (value) => {
                    setAlimentoSelecionadoEMEI(value);
                  }}
                </OnChange>
              </div>
              <div className="col-4">
                <Field
                  label="Para alimentação:"
                  component={MultiSelect}
                  disableSearch
                  name={`substituicoes[${periodoIndice}][emei][tipos_alimentacao_para]`}
                  multiple
                  options={formatarParaMultiselect(
                    substitutosEMEI
                      .find((v) => v.periodo_escolar.nome === periodo.nome)
                      .tipos_alimentacao.filter(
                        (ta) => !alimentoSelecionadoEMEI.includes(ta.uuid)
                      )
                  )}
                  nomeDoItemNoPlural="Substitutos"
                  validate={totalFrequenciaEMEI > 0 && required}
                  required
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <table className="table faixas-etarias-cei-alteracao">
                  <thead>
                    <tr>
                      <th className="col-8">
                        Alunos matriculados: {periodo.EMEI}
                      </th>
                      <th className="col-4">
                        <div className="row">
                          <div className="col-6 mt-2 text-center">
                            <span className="asterisco">* </span>
                            Quantidade
                          </div>
                          <div className="col-6">
                            <Field
                              component={InputText}
                              type="number"
                              name={`substituicoes[${periodoIndice}][emei][quantitade_alunos]`}
                              validate={composeValidators(
                                required,
                                naoPodeSerZero,
                                maxValue(parseInt(periodo.EMEI))
                              )}
                              max={parseInt(periodo.EMEI)}
                              min={0}
                              step="1"
                              className="input-quantidades"
                              required
                            />
                            <OnChange
                              name={`substituicoes[${periodoIndice}][emei][quantitade_alunos]`}
                            >
                              {async (value) => {
                                form.change(
                                  `substituicoes[${periodoIndice}][emei][matriculados_quando_criado]`,
                                  parseInt(periodo.EMEI)
                                );
                                setTotalFrequenciaEMEI(parseInt(value));
                              }}
                            </OnChange>
                            <Field
                              component={"input"}
                              type="hidden"
                              name={`substituicoes[${periodoIndice}][emei][matriculados_quando_criado]`}
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </>
        )}
    </>
  );
};
