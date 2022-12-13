import CardMatriculados from "components/Shareable/CardMatriculados";
import HTTP_STATUS from "http-status-codes";
import arrayMutators from "final-form-arrays";
import React, { useState } from "react";
import { useEffect } from "react";
import { Field, Form } from "react-final-form";
import {
  getRascunhosAlteracaoTipoAlimentacao,
  getAlunosPorFaixaEtariaNumaData,
  escolaCriarSolicitacaoDeAlteracaoCardapio,
  escolaExcluirSolicitacaoDeAlteracaoCardapio,
  escolaAlterarSolicitacaoDeAlteracaoCardapio,
  escolaIniciarSolicitacaoDeAlteracaoDeCardapio
} from "services/alteracaoDeCardapio";
import { TIPO_SOLICITACAO } from "constants/shared";
import { Rascunhos } from "../Rascunhos";
import Select from "components/Shareable/Select";
import moment from "moment";
import { InputComData } from "components/Shareable/DatePicker";
import {
  maxValue,
  naoPodeSerZero,
  peloMenosUmCaractere,
  required,
  textAreaRequired
} from "helpers/fieldValidators";
import {
  agregarDefault,
  checaSeDataEstaEntre2e5DiasUteis,
  composeValidators,
  deepCopy,
  getError
} from "helpers/utilities";
import ModalDataPrioritaria from "components/Shareable/ModalDataPrioritaria";
import { OnChange } from "react-final-form-listeners";
import { FieldArray } from "react-final-form-arrays";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import "./style.scss";
import CKEditorField from "components/Shareable/CKEditorField";
import InputText from "components/Shareable/Input/InputText";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { Spin } from "antd";
import {
  formataPayload,
  totalAlunosInputPorPeriodo,
  totalAlunosPorPeriodo,
  validaForm
} from "./helper";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { STATUS_DRE_A_VALIDAR } from "configs/constants";

const { SOLICITACAO_CEI } = TIPO_SOLICITACAO;

export const AlteracaoDoTipoDeAlimentacaoCEI = ({ ...props }) => {
  const {
    meusDados,
    motivos,
    periodos,
    proximosCincoDiasUteis,
    proximosDoisDiasUteis,
    vinculos
  } = props;

  const [rascunhos, setRascunhos] = useState(null);
  const [erroAPI, setErroAPI] = useState("");
  const [showModalDataPrioritaria, setShowModalDataPrioritaria] = useState(
    false
  );
  const [solicitacao, setSolicitacao] = useState(null);

  const getRascunhos = async () => {
    const response = await getRascunhosAlteracaoTipoAlimentacao(
      TIPO_SOLICITACAO.SOLICITACAO_CEI
    );
    if (response.status === HTTP_STATUS.OK) {
      setRascunhos(response.data.results);
    } else {
      setErroAPI("Erro ao carregar rascunhos");
    }
  };

  useEffect(() => {
    getRascunhos();
  }, []);

  const onAlterarDiaChanged = value => {
    if (
      value &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        proximosDoisDiasUteis,
        proximosCincoDiasUteis
      )
    ) {
      setShowModalDataPrioritaria(true);
    }
  };

  const iniciarPedido = async (uuid, form) => {
    const response = await escolaIniciarSolicitacaoDeAlteracaoDeCardapio(
      uuid,
      SOLICITACAO_CEI
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Alteração do tipo de alimentação enviada com sucesso!");
      refresh(form);
    } else {
      toastError(getError(response.data));
    }
  };

  const onSubmit = async (values, form) => {
    const erro = validaForm(values);
    if (erro) {
      toastError(erro);
      return;
    }
    if (!values.uuid) {
      const response = await escolaCriarSolicitacaoDeAlteracaoCardapio(
        formataPayload(values),
        SOLICITACAO_CEI
      );
      if (response.status === HTTP_STATUS.CREATED) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, form);
        } else {
          toastSuccess("Alteração do tipo de alimentação criada com sucesso!");
        }
        refresh(form);
      }
    } else {
      const response = await escolaAlterarSolicitacaoDeAlteracaoCardapio(
        values.uuid,
        formataPayload(values),
        SOLICITACAO_CEI
      );
      if (response.status === HTTP_STATUS.OK) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, form);
        } else {
          toastSuccess(
            "Alteração do tipo de alimentação alterada com sucesso!"
          );
        }
        refresh(form);
      }
    }
  };

  const getPeriodo = (values, indice) => {
    return values && values.substituicoes[indice];
  };

  const getFaixasEtariasPorPeriodo = async (periodo, data, index, form) => {
    form.change(`substituicoes[${index}].loading_faixas`, true);
    const response = await getAlunosPorFaixaEtariaNumaData(periodo, data);
    if (response.status === HTTP_STATUS.OK) {
      await form.change(
        `substituicoes[${index}].faixas_etarias`,
        response.data.results.filter(
          faixas => faixas.faixa_etaria.inicio > 11 && faixas.count > 0
        )
      );
      if (solicitacao) {
        const faixasQuantidades = {};
        solicitacao.substituicoes[index].faixas_etarias.forEach(faixa => {
          faixasQuantidades[faixa.faixa_etaria.uuid] = faixa.quantidade;
        });
        await form.change(`substituicoes[${index}].faixas`, faixasQuantidades);
        await form.change(`substituicoes[${index}].loading_faixas`, false);
        setSolicitacao(null);
      }
    } else {
      toastError(getError(response.data));
    }
    await form.change(`substituicoes[${index}].loading_faixas`, false);
  };

  const ehMotivoRPL = values => {
    return (
      motivos.find(
        motivo => motivo.nome.toUpperCase() === "RPL - REFEIÇÃO POR LANCHE"
      ) &&
      motivos.find(
        motivo => motivo.nome.toUpperCase() === "RPL - REFEIÇÃO POR LANCHE"
      ).uuid === values.motivo
    );
  };

  const ehMotivoLPR = values => {
    return (
      motivos.find(
        motivo => motivo.nome.toUpperCase() === "LPR - LANCHE POR REFEIÇÃO"
      ) &&
      motivos.find(
        motivo => motivo.nome.toUpperCase() === "LPR - LANCHE POR REFEIÇÃO"
      ).uuid === values.motivo
    );
  };

  const refresh = form => {
    getRascunhos();
    setTimeout(() => {
      form.reset();
    }, 100);
  };

  const getTiposAlimentacaoDe = values => {
    const tipos_alimentacao_de = vinculos.find(
      vinculo => vinculo.periodo_escolar.nome === "INTEGRAL"
    ).tipos_alimentacao;
    if (ehMotivoRPL(values)) {
      return agregarDefault(
        tipos_alimentacao_de
          .filter(tipo_alimentacao =>
            ["Refeição da tarde", "Almoço"].includes(tipo_alimentacao.nome)
          )
          .map(tipo_alimentacao => ({
            nome: tipo_alimentacao.nome,
            uuid: tipo_alimentacao.uuid
          }))
      );
    } else if (ehMotivoLPR(values)) {
      return tipos_alimentacao_de
        .filter(tipo_alimentacao => ["Lanche"].includes(tipo_alimentacao.nome))
        .map(tipo_alimentacao => ({
          label: tipo_alimentacao.nome,
          value: tipo_alimentacao.uuid
        }));
    } else {
      return tipos_alimentacao_de.map(tipo_alimentacao => ({
        label: tipo_alimentacao.nome,
        value: tipo_alimentacao.uuid
      }));
    }
  };

  const getTiposAlimentacaoPara = (values, index) => {
    const tipos_alimentacao_de = vinculos.find(
      vinculo => vinculo.periodo_escolar.nome === "INTEGRAL"
    ).tipos_alimentacao;
    if (ehMotivoRPL(values)) {
      return agregarDefault(
        tipos_alimentacao_de
          .filter(tipo_alimentacao =>
            ["Lanche"].includes(tipo_alimentacao.nome)
          )
          .map(tipo_alimentacao => ({
            nome: tipo_alimentacao.nome,
            uuid: tipo_alimentacao.uuid
          }))
      );
    } else if (ehMotivoLPR(values)) {
      return agregarDefault(
        tipos_alimentacao_de
          .filter(tipo_alimentacao =>
            ["Refeição da tarde", "Almoço"].includes(tipo_alimentacao.nome)
          )
          .map(tipo_alimentacao => ({
            nome: tipo_alimentacao.nome,
            uuid: tipo_alimentacao.uuid
          }))
      );
    } else {
      return agregarDefault(
        tipos_alimentacao_de
          .filter(tipo_alimentacao =>
            values.substituicoes[index].tipos_alimentacao_de_selecionados
              ? !values.substituicoes[
                  index
                ].tipos_alimentacao_de_selecionados.includes(
                  tipo_alimentacao.uuid
                )
              : tipo_alimentacao.uuid !==
                values.substituicoes[index].tipo_alimentacao_para
          )
          .map(tipo_alimentacao => ({
            nome: tipo_alimentacao.nome,
            uuid: tipo_alimentacao.uuid
          }))
      );
    }
  };

  const carregarRascunho = async (solicitacao, form, values) => {
    const substituicoes = deepCopy(values.substituicoes);
    setSolicitacao(solicitacao);
    await form.change("motivo", solicitacao.motivo.uuid);
    await form.change("escola", solicitacao.escola.uuid);
    await form.change("uuid", solicitacao.uuid);
    solicitacao.substituicoes.forEach(substituicao => {
      const index = substituicoes.findIndex(
        subs => subs.uuid === substituicao.periodo_escolar.uuid
      );
      substituicoes[index].checked = true;
      substituicoes[index].tipo_alimentacao_para =
        substituicao.tipo_alimentacao_para.uuid;
      substituicoes[index].tipos_alimentacao_de =
        solicitacao.motivo.nome.includes("RPL") &&
        substituicao.tipos_alimentacao_de[0].uuid;
      substituicoes[index].tipos_alimentacao_de_selecionados =
        !solicitacao.motivo.nome.includes("RPL") &&
        substituicao.tipos_alimentacao_de.map(ta => ta.uuid);
    });
    await form.change("substituicoes", substituicoes);
    await form.change("data", solicitacao.data);
    await form.change("uuid", solicitacao.uuid);
    await form.change("id_externo", solicitacao.id_externo);
    await form.change("observacao", solicitacao.observacao);
  };

  const removerRascunho = async (id_externo, uuid, form) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      const response = await escolaExcluirSolicitacaoDeAlteracaoCardapio(
        uuid,
        SOLICITACAO_CEI
      );
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
        refresh(form);
      } else {
        toastError(
          `Houve um erro ao excluir o rascunho: ${getError(response.data)}`
        );
      }
    }
  };

  return (
    <>
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && (
        <div className="form-alteracao-cei mt-3">
          <Form
            initialValues={{
              substituicoes: periodos,
              escola: meusDados.vinculo_atual.instituicao.uuid
            }}
            mutators={{
              ...arrayMutators
            }}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, form, values, submitting }) => (
              <form onSubmit={handleSubmit}>
                <CardMatriculados
                  meusDados={meusDados}
                  numeroAlunos={
                    meusDados.vinculo_atual.instituicao.quantidade_alunos
                  }
                />
                <Spin tip="Carregando rascunhos..." spinning={!rascunhos}>
                  {rascunhos && rascunhos.length > 0 && (
                    <section className="mt-3">
                      <span className="page-title">Rascunhos</span>
                      <Rascunhos
                        alteracaoCardapioList={rascunhos}
                        removerRascunho={removerRascunho}
                        resetForm={() => form.reset()}
                        carregarRascunho={carregarRascunho}
                        form={form}
                        values={values}
                      />
                    </section>
                  )}
                </Spin>
                <div className="mt-3 page-title">
                  {values.uuid
                    ? `Solicitação # ${values.id_externo}`
                    : "Nova Solicitação"}
                </div>
                <div className="card mt-3 mh-60">
                  <div className="card-body">
                    <Field component="input" type="hidden" name="uuid" />
                    <Field component="input" type="hidden" name="escola" />
                    <div className="card-title font-weight-bold descricao">
                      Descrição da Alteração do Tipo de Alimentação
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-8">
                        <Field
                          component={Select}
                          name="motivo"
                          label="Motivo"
                          options={motivos.filter(
                            ({ nome }) =>
                              nome.toUpperCase() !==
                              "Lanche emergencial".toUpperCase()
                          )}
                          validate={required}
                        />
                        <OnChange name="motivo">
                          {async value => {
                            if (value) {
                              const data_ = values.data;
                              form.reset();
                              form.change("motivo", value);
                              form.change("data", data_);
                            }
                          }}
                        </OnChange>
                      </div>
                      <div className="col-12 col-sm-4">
                        <Field
                          component={InputComData}
                          name="data"
                          minDate={proximosDoisDiasUteis}
                          maxDate={moment()
                            .endOf("year")
                            .toDate()}
                          label="Alterar dia"
                          required
                          validate={required}
                        />
                        <OnChange name="data">
                          {value => {
                            if (value) {
                              onAlterarDiaChanged(value);
                              values.substituicoes.forEach(
                                (substituicao, indice) => {
                                  if (substituicao.checked) {
                                    getFaixasEtariasPorPeriodo(
                                      values.substituicoes[indice].uuid,
                                      value
                                        .split("/")
                                        .reverse()
                                        .join("-"),
                                      indice,
                                      form
                                    );
                                  }
                                }
                              );
                            }
                          }}
                        </OnChange>
                      </div>
                    </div>
                    {values.motivo && values.data && (
                      <>
                        <div className="row mt-3">
                          <div className="col-4">Período</div>
                          <div className="col-4">Alterar alimentação de</div>
                          <div className="col-4">Para alimentação</div>
                        </div>
                        <FieldArray name="substituicoes">
                          {({ fields }) =>
                            fields.map((name, indice) => (
                              <div className="mt-1" key={indice}>
                                <div className="row">
                                  <div className="col-4">
                                    <div
                                      className={`period-quantity number-${indice} pl-5 pt-2 pb-2`}
                                    >
                                      <label
                                        htmlFor="check"
                                        className="checkbox-label"
                                      >
                                        <Field
                                          component={"input"}
                                          type="checkbox"
                                          name={`${name}.checked`}
                                        />
                                        <span
                                          onClick={async () => {
                                            await form.change(
                                              `${name}.checked`,
                                              !values.substituicoes[indice][
                                                `checked`
                                              ]
                                            );
                                            await form.change(
                                              `${name}.multiselect`,
                                              !values.substituicoes[indice][
                                                `checked`
                                              ]
                                                ? "multiselect-wrapper-enabled"
                                                : "multiselect-wrapper-disabled"
                                            );
                                          }}
                                          className="checkbox-custom"
                                          data-cy={`checkbox-${
                                            getPeriodo(values, indice).nome
                                          }`}
                                          validate={
                                            getPeriodo(values, indice)
                                              .checked && required
                                          }
                                          required={
                                            getPeriodo(values, indice).checked
                                          }
                                          disabled={
                                            !getPeriodo(values, indice).checked
                                          }
                                        />{" "}
                                        {getPeriodo(values, indice).nome}
                                      </label>
                                      <OnChange name={`${name}.checked`}>
                                        {value => {
                                          if (!value) {
                                            form.change(
                                              `substituicoes[${indice}].tipos_alimentacao_de`,
                                              undefined
                                            );
                                            form.change(
                                              `substituicoes[${indice}].tipos_alimentacao_de_selecionados`,
                                              undefined
                                            );
                                            form.change(
                                              `substituicoes[${indice}].tipo_alimentacao_para`,
                                              undefined
                                            );
                                          } else {
                                            getFaixasEtariasPorPeriodo(
                                              values.substituicoes[indice].uuid,
                                              values.data
                                                .split("/")
                                                .reverse()
                                                .join("-"),
                                              indice,
                                              form
                                            );
                                          }
                                        }}
                                      </OnChange>
                                    </div>
                                  </div>
                                  {ehMotivoRPL(values) && (
                                    <div className="col-4">
                                      <Field
                                        component={Select}
                                        name={`${name}.tipos_alimentacao_de`}
                                        options={getTiposAlimentacaoDe(values)}
                                        validate={
                                          getPeriodo(values, indice).checked &&
                                          required
                                        }
                                        required={
                                          getPeriodo(values, indice).checked
                                        }
                                        disabled={
                                          !getPeriodo(values, indice).checked
                                        }
                                      />
                                    </div>
                                  )}
                                  {!ehMotivoRPL(values) && (
                                    <div className="col-4">
                                      <Field
                                        component={StatefulMultiSelect}
                                        name={`${name}.tipos_alimentacao_de`}
                                        selected={
                                          values.substituicoes[indice]
                                            .tipos_alimentacao_de_selecionados ||
                                          []
                                        }
                                        options={getTiposAlimentacaoDe(values)}
                                        onSelectedChanged={values_ => {
                                          form.change(
                                            `substituicoes[${indice}].tipos_alimentacao_de_selecionados`,
                                            values_
                                          );
                                        }}
                                        disableSearch={true}
                                        overrideStrings={{
                                          selectSomeItems:
                                            "Selecione um tipo de alimentação",
                                          allItemsAreSelected:
                                            "Todos os tipos de alimentação estão selecionados",
                                          selectAll: "Todos"
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div className="col-4">
                                    <Field
                                      component={Select}
                                      name={`${name}.tipo_alimentacao_para`}
                                      options={getTiposAlimentacaoPara(
                                        values,
                                        indice
                                      )}
                                      validate={
                                        getPeriodo(values, indice).checked &&
                                        required
                                      }
                                      required={
                                        getPeriodo(values, indice).checked
                                      }
                                      disabled={
                                        !getPeriodo(values, indice).checked
                                      }
                                    />
                                  </div>
                                </div>
                                {values.substituicoes[indice][`checked`] && (
                                  <Spin
                                    tip="Carregando faixas etárias..."
                                    spinning={
                                      values.substituicoes[indice][
                                        "loading_faixas"
                                      ]
                                    }
                                  >
                                    <table className="faixas-etarias-cei mt-3">
                                      <thead>
                                        <tr className="row">
                                          <th className="col-8">
                                            Faixa Etária
                                          </th>
                                          <th className="col-2 text-center">
                                            Alunos matriculados
                                          </th>
                                          <th className="col-2 text-center">
                                            Quantidade
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {values.substituicoes[indice]
                                          .faixas_etarias &&
                                          !values.substituicoes[indice]
                                            .loading_faixas &&
                                          values.substituicoes[
                                            indice
                                          ].faixas_etarias.map((faixa, key) => {
                                            return (
                                              <tr key={key} className="row">
                                                <td className="col-8">
                                                  {faixa.faixa_etaria.__str__}
                                                </td>
                                                <td className="col-2 text-center">
                                                  {faixa.count}
                                                </td>
                                                <td className="col-2 text-center">
                                                  <Field
                                                    component={InputText}
                                                    type="number"
                                                    name={`${name}.faixas.${
                                                      faixa.faixa_etaria.uuid
                                                    }`}
                                                    validate={
                                                      getPeriodo(values, indice)
                                                        .checked &&
                                                      composeValidators(
                                                        naoPodeSerZero,
                                                        maxValue(faixa.count)
                                                      )
                                                    }
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        <tr className="row">
                                          <td className="col-8 font-weight-bold">
                                            Total
                                          </td>
                                          <td className="col-2 text-center">
                                            {totalAlunosPorPeriodo(
                                              values,
                                              indice
                                            )}
                                          </td>
                                          <td className="col-2 text-center">
                                            {totalAlunosInputPorPeriodo(
                                              values,
                                              indice
                                            )}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </Spin>
                                )}
                              </div>
                            ))
                          }
                        </FieldArray>
                      </>
                    )}
                    <div className="mt-3">
                      <Field
                        component={CKEditorField}
                        label="Observações"
                        name="observacao"
                        required
                        validate={composeValidators(
                          textAreaRequired,
                          peloMenosUmCaractere
                        )}
                      />
                    </div>
                    <div className="row float-right mt-4">
                      <div className="col-12">
                        <Botao
                          texto="Cancelar"
                          onClick={() => {
                            form.reset();
                          }}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                        <Botao
                          texto={
                            values.uuid
                              ? "Atualizar rascunho"
                              : "Salvar rascunho"
                          }
                          className="ml-3"
                          disabled={submitting}
                          type={BUTTON_TYPE.SUBMIT}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                        <Botao
                          texto="Enviar"
                          type={BUTTON_TYPE.BUTTON}
                          disabled={submitting}
                          onClick={() => {
                            values["status"] = STATUS_DRE_A_VALIDAR;
                            handleSubmit(values => onSubmit(values, form));
                          }}
                          style={BUTTON_STYLE.GREEN}
                          className="ml-3"
                        />
                      </div>
                    </div>
                    <ModalDataPrioritaria
                      showModal={showModalDataPrioritaria}
                      closeModal={() => setShowModalDataPrioritaria(false)}
                    />
                  </div>
                </div>
              </form>
            )}
          </Form>
        </div>
      )}
    </>
  );
};
