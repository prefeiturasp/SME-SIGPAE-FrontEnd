import InputText from "src/components/Shareable/Input/InputText";
import Select from "src/components/Shareable/Select";
import {
  maxValue,
  naoPodeSerZero,
  required,
} from "src/helpers/fieldValidators";
import { agregarDefault, composeValidators } from "src/helpers/utilities";
import { useState } from "react";
import { Field } from "react-final-form";
import {
  agruparRefeicaoESobremesa,
  totalMatriculados,
  totalSolicitacao,
  validaQuantidadeFaixaCEI,
} from "../helpers";

const formatarOpcoes = (tiposAlimentacao) =>
  tiposAlimentacao.map((tipo) => ({ nome: tipo.nome, uuid: tipo.uuid }));

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
}) => {
  const periodoCEI = vinculos.find(
    (vinculo) =>
      vinculo.tipo_unidade_escolar.iniciais === "CEI DIRET" &&
      vinculo.periodo_escolar.nome === periodo.nome,
  );
  const periodoEMEI = vinculos.find(
    (vinculo) =>
      vinculo.tipo_unidade_escolar.iniciais === "EMEI" &&
      vinculo.periodo_escolar.nome === periodo.nome,
  );
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
          <div className="col-12" data-testid={`div-checkbox-${periodo.nome}`}>
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
              <span>
                <Field
                  component={"input"}
                  type="checkbox"
                  name={`substituicoes[${periodoIndice}][checked]`}
                  onClick={async () => {
                    await form.change(
                      `substituicoes[${periodoIndice}][periodo_uuid]`,
                      periodoCEI.periodo_escolar.uuid,
                    );
                  }}
                  disabled={
                    !values.alunos_cei_e_ou_emei ||
                    !values.motivo ||
                    !(values.alterar_dia || values.data_inicial)
                  }
                />
              </span>
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
                <Field
                  label="Alterar alimentação de:"
                  component={Select}
                  dataTestId="select-alterar-alimentacao-de-CEI"
                  name={`substituicoes[${periodoIndice}][cei][tipos_alimentacao_de]`}
                  options={agregarDefault(
                    agruparRefeicaoESobremesa(
                      formatarOpcoes(
                        alimentosCEI.find(
                          (v) => v.periodo_escolar.nome === periodo.nome,
                        ).tipos_alimentacao,
                      ),
                    ),
                  )}
                  naoDesabilitarPrimeiraOpcao
                  validate={totalFrequenciaCEI > 0 && required}
                  required
                />
              </div>
              <div className="col-4">
                <Field
                  label="Para alimentação:"
                  component={Select}
                  dataTestId="select-alterar-alimentacao-para-CEI"
                  name={`substituicoes[${periodoIndice}][cei][tipos_alimentacao_para]`}
                  options={agregarDefault(
                    formatarOpcoes(
                      substitutosCEI.find(
                        (v) => v.periodo_escolar.nome === periodo.nome,
                      ).tipos_alimentacao,
                    ),
                  )}
                  naoDesabilitarPrimeiraOpcao
                  validate={totalFrequenciaCEI > 0 && required}
                  required
                />
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
                                dataTestId={`substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][quantidade_alunos]`}
                                type="number"
                                name={`substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][quantidade_alunos]`}
                                validate={validaQuantidadeFaixaCEI({
                                  periodoIndice,
                                  max: Number.parseInt(faixa.quantidade_alunos),
                                })}
                                max={Number.parseInt(faixa.quantidade_alunos)}
                                min={0}
                                step="1"
                                className="input-quantidades"
                                inputOnChange={async () => {
                                  await form.change(
                                    `substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][faixa_uuid]`,
                                    faixa.uuid,
                                  );
                                  await form.change(
                                    `substituicoes[${periodoIndice}][cei][faixas_etarias][${faixaIndice}][matriculados_quando_criado]`,
                                    Number.parseInt(faixa.quantidade_alunos),
                                  );
                                  const values_ = form.getState().values;
                                  setTotalFrequenciaCEI(
                                    totalSolicitacao(values_, periodoCEI),
                                  );
                                }}
                              />
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
                      <td className="col-8 fw-bold">Total</td>
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
        Number.parseInt(periodo.EMEI) > 0 && (
          <>
            <div className="row mt-2">
              <div className="col-4">
                <div className=" alunos-label">Alunos EMEI</div>
              </div>
              <div className="col-4">
                <Field
                  component={Select}
                  label="Alterar alimentação de:"
                  name={`substituicoes[${periodoIndice}][emei][tipos_alimentacao_de]`}
                  dataTestId="select-alterar-alimentacao-de-EMEI"
                  options={agregarDefault(
                    agruparRefeicaoESobremesa(
                      formatarOpcoes(
                        alimentosEMEI.find(
                          (v) => v.periodo_escolar.nome === periodo.nome,
                        ).tipos_alimentacao,
                      ),
                    ),
                  )}
                  naoDesabilitarPrimeiraOpcao
                  validate={totalFrequenciaEMEI > 0 && required}
                  required
                />
              </div>
              <div className="col-4">
                <Field
                  component={Select}
                  label="Para alimentação:"
                  name={`substituicoes[${periodoIndice}][emei][tipos_alimentacao_para]`}
                  dataTestId="select-alterar-alimentacao-para-EMEI"
                  options={agregarDefault(
                    formatarOpcoes(
                      substitutosEMEI.find(
                        (v) => v.periodo_escolar.nome === periodo.nome,
                      ).tipos_alimentacao,
                    ),
                  )}
                  naoDesabilitarPrimeiraOpcao
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
                              name={`substituicoes[${periodoIndice}][emei][quantidade_alunos]`}
                              dataTestId={`substituicoes[${periodoIndice}][emei][quantidade_alunos]`}
                              validate={composeValidators(
                                required,
                                naoPodeSerZero,
                                maxValue(Number.parseInt(periodo.EMEI)),
                              )}
                              max={Number.parseInt(periodo.EMEI)}
                              min={0}
                              step="1"
                              className="input-quantidades"
                              required
                              inputOnChange={async () => {
                                const value_ =
                                  form.getState().values.substituicoes[
                                    periodoIndice
                                  ].emei.quantidade_alunos;
                                await form.change(
                                  `substituicoes[${periodoIndice}][emei][matriculados_quando_criado]`,
                                  Number.parseInt(periodo.EMEI),
                                );
                                setTotalFrequenciaEMEI(Number.parseInt(value_));
                              }}
                            />
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
