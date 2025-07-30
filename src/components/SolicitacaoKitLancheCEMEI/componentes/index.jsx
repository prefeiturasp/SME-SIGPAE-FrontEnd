import InputText from "src/components/Shareable/Input/InputText";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import {
  maxValue,
  naoPodeSerZero,
  required,
} from "src/helpers/fieldValidators";
import { composeValidators } from "src/helpers/utilities";
import React, { useState } from "react";
import { Field } from "react-final-form";
import { Collapse } from "react-collapse";

export const TempoPasseio = ({ form, ehEMEI, name, nameKits }) => {
  const selecionaTempoPasseio = (value) => {
    if (value) {
      form.change(nameKits || `kits`, undefined);
    }
  };

  return (
    <div className="tour-time">
      <div className="label mt-3 mb-3">Tempo previsto do passeio</div>
      <div className="d-inline-flex">
        <label className="container-radio">
          até 4 horas (1 Kit)
          <Field
            component={"input"}
            type="radio"
            value="0"
            data-cy="radio-4h"
            name={name || `tempo_passeio`}
            validate={required}
          />
          <span
            className="checkmark"
            onClick={(e) => selecionaTempoPasseio(e.target.value)}
          />
        </label>
        <label className="container-radio">
          de 5 a 7 horas (2 Kits)
          <Field
            component={"input"}
            type="radio"
            value="1"
            data-cy="radio-5-7h"
            name={name || `tempo_passeio`}
            validate={required}
          />
          <span
            className="checkmark"
            onClick={(e) => selecionaTempoPasseio(e.target.value)}
          />
        </label>
        {ehEMEI && (
          <label className="container-radio">
            8 horas ou mais (3 Kits)
            <Field
              component={"input"}
              type="radio"
              value="2"
              data-cy="radio-8h"
              name={name || `tempo_passeio`}
              validate={required}
            />
            <span
              className="checkmark"
              onClick={(e) => selecionaTempoPasseio(e.target.value)}
            />
          </label>
        )}
      </div>
      <div className="row">
        <div className="col-12">
          <div className="explanation border rounded mt-3 p-3">
            <label>
              <b>Até 4 horas:</b> 1 Kit lanche/aluno: Escolher 1 Kit entre os
              modelos estabelecidos contratualmente;
            </label>
            <br />
            <label>
              <b>De 5 a 7 horas:</b> 2 Kit lanche/aluno: Escolher 2 Kits
              distintos entre os modelos estabelecidos contratualmente;
            </label>
            {ehEMEI && (
              <>
                <br />
                <label>
                  <b>8 horas ou mais:</b> 3 Kit lanche/aluno: Escolher 3 Kits
                  distintos entre os modelos estabelecidos contratualmente;
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Kits = ({ kits, values, name, nameTempoPasseio }) => {
  const valuesTempoPasseio =
    values[nameTempoPasseio.split(".")[0]][nameTempoPasseio.split(".")[1]];
  const valuesKits = values[name.split(".")[0]][name.split(".")[1]];
  return (
    <>
      <div className="label mt-3">Selecione a opção desejada</div>
      <div className="row mt-3">
        {kits
          .filter((kit) => kit.status === "Ativo")
          .map((kit, indice) => {
            const CARD_DISABLED =
              !valuesTempoPasseio ||
              (valuesKits &&
                valuesKits.length === parseInt(valuesTempoPasseio) + 1 &&
                !valuesKits.includes(kit.uuid));
            return (
              <div
                className={`col-2 offset-${
                  indice % 3 === 0 ? "1" : "2"
                } mt-3 d-flex`}
                key={indice}
              >
                <div
                  className={`card card-kits w-100 ${
                    CARD_DISABLED && "card-disabled"
                  }`}
                >
                  <div className="card-body p-2">
                    <div className="row">
                      <div className="col-6">
                        <span className="nome-kit">{kit.nome}</span>
                      </div>
                      <div className="col-6 form-check">
                        <Field
                          component={"input"}
                          type="checkbox"
                          required
                          validate={required}
                          value={kit.uuid}
                          className="float-end"
                          name={name}
                          disabled={CARD_DISABLED}
                          data-testid={`kit-cemei-${indice + 1}`}
                        />
                        <span className="checkmark" />
                      </div>
                      <div className="col-12 kit-itens mt-3">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: kit.descricao,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export const QuantidadeAlunosEMEI = ({ meusDados }) => {
  return (
    <table className="faixas-etarias-cei mt-3">
      <thead>
        <tr className="row">
          <th className="col-8 my-auto">
            <Field
              component="input"
              type="hidden"
              defaultValue={
                meusDados.vinculo_atual.instituicao
                  .quantidade_alunos_emei_da_cemei
              }
              name="solicitacao_emei.matriculados_quando_criado"
            />
            Alunos matriculados:{" "}
            <span className="fw-normal">
              {
                meusDados.vinculo_atual.instituicao
                  .quantidade_alunos_emei_da_cemei
              }
            </span>
          </th>
          <th className="col-4 d-flex justify-content-center">
            <span className="my-auto">Quantidade</span>
            <Field
              className="ms-3"
              component={InputText}
              type="number"
              name="solicitacao_emei.quantidade_alunos"
              validate={composeValidators(
                naoPodeSerZero,
                maxValue(
                  meusDados.vinculo_atual.instituicao
                    .quantidade_alunos_emei_da_cemei
                ),
                required
              )}
              max={parseInt(
                meusDados.vinculo_atual.instituicao
                  .quantidade_alunos_emei_da_cemei
              )}
              min={0}
              step="1"
            />
          </th>
        </tr>
      </thead>
    </table>
  );
};

export const AlunosDietaEspecial = ({
  alunosComDietaEspecial,
  solicitacao,
}) => {
  const [collapseAlunos, setCollapseAlunos] = useState(false);

  return (
    <>
      <div className="label mt-3">Selecionar alunos com dieta especial</div>
      <div className="card card-history mt-3 seletor-alunos-dieta-especial">
        <div className="card-header">
          <div className="row">
            <div className="col-2">{"Código EOL"}</div>
            <div className="col-8">{"Nome do Aluno"}</div>
            <div className="ps-5 col-1 toggle-right">
              <ToggleExpandir
                onClick={() => setCollapseAlunos(!collapseAlunos)}
                ativo={collapseAlunos}
              />
            </div>
          </div>
        </div>
        <Collapse isOpened={collapseAlunos}>
          <table className="table">
            <tbody>
              {alunosComDietaEspecial.map((aluno, key) => {
                return (
                  <tr key={key}>
                    <td>
                      <Field
                        component="input"
                        type="checkbox"
                        value={aluno.uuid}
                        name={`${solicitacao}.alunos_com_dieta_especial_participantes`}
                      />
                    </td>
                    <td>{aluno.codigo_eol}</td>
                    <td>{aluno.nome}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Collapse>
      </div>
    </>
  );
};

export const TabelaFaixasEtariasCEI = ({ faixasEtariasCEI, values }) => {
  let totalMatriculados = 0;
  let totalQuantidadeAlunos = 0;

  return (
    <table className="faixas-etarias-cei mt-5">
      <thead>
        <tr className="row">
          <th className="col-8">Faixa Etária</th>
          <th className="col-2 text-center">Alunos matriculados</th>
          <th className="col-2 text-center">Quantidade</th>
        </tr>
      </thead>
      <tbody>
        {faixasEtariasCEI.map((faixa, key) => {
          return (
            faixa.faixa_etaria.inicio > 11 && (
              <tr key={key} className="row">
                <td className="col-8">{faixa.faixa_etaria.__str__}</td>
                <td className="col-2 text-center">{faixa.count}</td>
                <td className="col-2 text-center">
                  <Field
                    component={InputText}
                    type="number"
                    name={`solicitacao_cei.faixas_quantidades.${faixa.faixa_etaria.uuid}`}
                    validate={composeValidators(
                      naoPodeSerZero,
                      maxValue(faixa.count)
                    )}
                    max={parseInt(faixa.count)}
                    min={0}
                    step="1"
                  />
                </td>
              </tr>
            )
          );
        })}
        <tr className="row">
          <td className="col-8 fw-bold">Total</td>
          <td className="col-2 text-center">
            {faixasEtariasCEI
              .filter((faixa) => faixa.faixa_etaria.inicio > 11)
              .reduce(function (total, faixa) {
                return total + faixa.count;
              }, totalMatriculados)}
          </td>
          <td className="col-2 text-center">
            {Object.values(values.solicitacao_cei.faixas_quantidades).reduce(
              function (total, faixa) {
                return total + (faixa ? parseInt(faixa) : 0);
              },
              totalQuantidadeAlunos
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
