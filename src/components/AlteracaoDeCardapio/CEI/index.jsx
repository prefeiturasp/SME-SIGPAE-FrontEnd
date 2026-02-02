import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import CardMatriculados from "src/components/Shareable/CardMatriculados";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import ModalDataPrioritaria from "src/components/Shareable/ModalDataPrioritaria";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import Select from "src/components/Shareable/Select";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { STATUS_DRE_A_VALIDAR } from "src/configs/constants";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import arrayMutators from "final-form-arrays";
import {
  maxValue,
  naoPodeSerZero,
  peloMenosUmCaractere,
  required,
  textAreaRequired,
} from "src/helpers/fieldValidators";
import {
  agregarDefault,
  checaSeDataEstaEntre2e5DiasUteis,
  composeValidators,
  deepCopy,
  fimDoCalendario,
  getError,
} from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  escolaAlterarSolicitacaoDeAlteracaoCardapio,
  escolaCriarSolicitacaoDeAlteracaoCardapio,
  escolaExcluirSolicitacaoDeAlteracaoCardapio,
  escolaIniciarSolicitacaoDeAlteracaoDeCardapio,
  getAlunosPorFaixaEtariaNumaData,
  getRascunhosAlteracaoTipoAlimentacao,
} from "src/services/alteracaoDeCardapio";
import { Rascunhos } from "../Escola/components/Rascunhos";
import {
  formataPayload,
  totalAlunosInputPorPeriodo,
  totalAlunosPorPeriodo,
  validaForm,
} from "./helper";
import "./style.scss";

const { SOLICITACAO_CEI } = TIPO_SOLICITACAO;

export const AlteracaoDoTipoDeAlimentacaoCEI = ({ ...props }) => {
  const {
    meusDados,
    motivos,
    periodos,
    proximosCincoDiasUteis,
    proximosDoisDiasUteis,
    vinculos,
  } = props;

  const [rascunhos, setRascunhos] = useState(null);
  const [erroAPI, setErroAPI] = useState("");
  const [showModalDataPrioritaria, setShowModalDataPrioritaria] =
    useState(false);
  const [solicitacao, setSolicitacao] = useState(null);

  const getRascunhos = async () => {
    const response = await getRascunhosAlteracaoTipoAlimentacao(
      TIPO_SOLICITACAO.SOLICITACAO_CEI,
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

  const onAlterarDiaChanged = (value) => {
    if (
      value &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        proximosDoisDiasUteis,
        proximosCincoDiasUteis,
      )
    ) {
      setShowModalDataPrioritaria(true);
    }
  };

  const iniciarPedido = async (uuid, form) => {
    const response = await escolaIniciarSolicitacaoDeAlteracaoDeCardapio(
      uuid,
      SOLICITACAO_CEI,
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
        SOLICITACAO_CEI,
      );
      if (response.status === HTTP_STATUS.CREATED) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, form);
        } else {
          toastSuccess("Alteração do tipo de alimentação criada com sucesso!");
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    } else {
      const response = await escolaAlterarSolicitacaoDeAlteracaoCardapio(
        values.uuid,
        formataPayload(values),
        SOLICITACAO_CEI,
      );
      if (response.status === HTTP_STATUS.OK) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, form);
        } else {
          toastSuccess(
            "Alteração do tipo de alimentação alterada com sucesso!",
          );
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    }
  };

  const getPeriodo = (values, indice) => {
    return values && values.substituicoes[indice];
  };

  const encontrarIndiceSubstituicao = (
    periodoEscolarUuid,
    solicitacao_ = solicitacao,
  ) => {
    for (let index = 0; index < solicitacao_.substituicoes.length; index++) {
      const substituicao = solicitacao_.substituicoes[index];
      if (substituicao.periodo_escolar.uuid === periodoEscolarUuid) {
        return index;
      }
    }
    return -1;
  };

  const getFaixasEtariasPorPeriodo = async (
    periodo,
    data,
    index,
    form,
    solicitacao_ = solicitacao,
  ) => {
    form.change(`substituicoes[${index}].loading_faixas`, true);
    const response = await getAlunosPorFaixaEtariaNumaData(periodo, data);
    if (response.status === HTTP_STATUS.OK) {
      await form.change(
        `substituicoes[${index}].faixas_etarias`,
        response.data.results.filter(
          (faixas) => faixas.faixa_etaria.inicio > 11 && faixas.count > 0,
        ),
      );
      if (solicitacao_) {
        const faixasQuantidades = {};

        const periodoEscolarUuid = periodo;
        const indiceSubstituicao = encontrarIndiceSubstituicao(
          periodoEscolarUuid,
          solicitacao_,
        );

        solicitacao_.substituicoes[indiceSubstituicao] &&
          solicitacao_.substituicoes[indiceSubstituicao].faixas_etarias.forEach(
            (faixa) => {
              faixasQuantidades[faixa.faixa_etaria.uuid] = faixa.quantidade;
            },
          );
        await form.change(`substituicoes[${index}].faixas`, faixasQuantidades);
        await form.change(`substituicoes[${index}].loading_faixas`, false);
        setSolicitacao(null);
      }
    } else {
      toastError(getError(response.data));
    }
    await form.change(`substituicoes[${index}].loading_faixas`, false);
  };

  const ehMotivoRPL = (values) => {
    return (
      motivos.find(
        (motivo) => motivo.nome.toUpperCase() === "RPL - REFEIÇÃO POR LANCHE",
      ) &&
      motivos.find(
        (motivo) => motivo.nome.toUpperCase() === "RPL - REFEIÇÃO POR LANCHE",
      ).uuid === values.motivo
    );
  };

  const ehMotivoLPR = (values) => {
    return (
      motivos.find(
        (motivo) => motivo.nome.toUpperCase() === "LPR - LANCHE POR REFEIÇÃO",
      ) &&
      motivos.find(
        (motivo) => motivo.nome.toUpperCase() === "LPR - LANCHE POR REFEIÇÃO",
      ).uuid === values.motivo
    );
  };

  const refresh = (form) => {
    getRascunhos();
    setTimeout(() => {
      form.reset();
    }, 100);
  };

  const getTiposAlimentacaoDe = (values) => {
    const tipos_alimentacao_de = vinculos.find(
      (vinculo) => vinculo.periodo_escolar.nome === "INTEGRAL",
    ).tipos_alimentacao;
    if (ehMotivoRPL(values)) {
      return agregarDefault(
        tipos_alimentacao_de
          .filter((tipo_alimentacao) =>
            ["Refeição da tarde", "Almoço"].includes(tipo_alimentacao.nome),
          )
          .map((tipo_alimentacao) => ({
            nome: tipo_alimentacao.nome,
            uuid: tipo_alimentacao.uuid,
          })),
      );
    } else if (ehMotivoLPR(values)) {
      return tipos_alimentacao_de
        .filter((tipo_alimentacao) =>
          ["Lanche"].includes(tipo_alimentacao.nome),
        )
        .map((tipo_alimentacao) => ({
          label: tipo_alimentacao.nome,
          value: tipo_alimentacao.uuid,
        }));
    } else {
      return tipos_alimentacao_de.map((tipo_alimentacao) => ({
        label: tipo_alimentacao.nome,
        value: tipo_alimentacao.uuid,
      }));
    }
  };

  const getTiposAlimentacaoPara = (values, index) => {
    const tipos_alimentacao_de = vinculos.find(
      (vinculo) => vinculo.periodo_escolar.nome === "INTEGRAL",
    ).tipos_alimentacao;
    if (ehMotivoRPL(values)) {
      return agregarDefault(
        tipos_alimentacao_de
          .filter((tipo_alimentacao) =>
            ["Lanche"].includes(tipo_alimentacao.nome),
          )
          .map((tipo_alimentacao) => ({
            nome: tipo_alimentacao.nome,
            uuid: tipo_alimentacao.uuid,
          })),
      );
    } else if (ehMotivoLPR(values)) {
      return agregarDefault(
        tipos_alimentacao_de
          .filter((tipo_alimentacao) =>
            ["Refeição da tarde", "Almoço"].includes(tipo_alimentacao.nome),
          )
          .map((tipo_alimentacao) => ({
            nome: tipo_alimentacao.nome,
            uuid: tipo_alimentacao.uuid,
          })),
      );
    } else {
      return agregarDefault(
        tipos_alimentacao_de
          .filter((tipo_alimentacao) =>
            values.substituicoes[index].tipos_alimentacao_de_selecionados
              ? !values.substituicoes[
                  index
                ].tipos_alimentacao_de_selecionados.includes(
                  tipo_alimentacao.uuid,
                )
              : tipo_alimentacao.uuid !==
                values.substituicoes[index].tipo_alimentacao_para,
          )
          .map((tipo_alimentacao) => ({
            nome: tipo_alimentacao.nome,
            uuid: tipo_alimentacao.uuid,
          })),
      );
    }
  };

  const carregarRascunho = async (solicitacao, form, values) => {
    const substituicoes = deepCopy(values.substituicoes);
    setSolicitacao(solicitacao);
    await form.change("motivo", solicitacao.motivo.uuid);
    await form.change("escola", solicitacao.escola.uuid);
    await form.change("uuid", solicitacao.uuid);
    solicitacao.substituicoes.forEach((substituicao) => {
      const index = substituicoes.findIndex(
        (subs) => subs.uuid === substituicao.periodo_escolar.uuid,
      );
      substituicoes[index].checked = true;
      substituicoes[index].tipo_alimentacao_para =
        substituicao.tipo_alimentacao_para.uuid;
      substituicoes[index].tipos_alimentacao_de =
        solicitacao.motivo.nome.includes("RPL") &&
        substituicao.tipos_alimentacao_de[0].uuid;
      substituicoes[index].tipos_alimentacao_de_selecionados =
        !solicitacao.motivo.nome.includes("RPL") &&
        substituicao.tipos_alimentacao_de.map((ta) => ta.uuid);
      substituicao.faixas_etarias.forEach(async (faixa) => {
        await getFaixasEtariasPorPeriodo(
          substituicao.periodo_escolar.uuid,
          solicitacao.data.split("/").reverse().join("-"),
          index,
          form,
          solicitacao,
        );
        substituicoes[index][`faixas.${faixa.faixa_etaria.uuid}`] =
          faixa.quantidade;
      });
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
        SOLICITACAO_CEI,
      );
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
        refresh(form);
      } else {
        toastError(
          `Houve um erro ao excluir o rascunho: ${getError(response.data)}`,
        );
      }
    }
  };

  const handlePeriodoOnClick = async (form, name, indice, values) => {
    await form.change(
      `${name}.checked`,
      !values.substituicoes[indice][`checked`],
    );
    await form.change(
      `${name}.multiselect`,
      !values.substituicoes[indice][`checked`]
        ? "multiselect-wrapper-enabled"
        : "multiselect-wrapper-disabled",
    );
    if (values.substituicoes[indice][`checked`]) {
      form.change(`substituicoes[${indice}].tipos_alimentacao_de`, undefined);
      form.change(
        `substituicoes[${indice}].tipos_alimentacao_de_selecionados`,
        undefined,
      );
      form.change(`substituicoes[${indice}].tipo_alimentacao_para`, undefined);
    } else {
      getFaixasEtariasPorPeriodo(
        values.substituicoes[indice].uuid,
        values.data.split("/").reverse().join("-"),
        indice,
        form,
      );
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
              escola: meusDados.vinculo_atual.instituicao.uuid,
            }}
            mutators={{
              ...arrayMutators,
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
                        rascunhos={rascunhos}
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
                    <div className="card-title fw-bold descricao">
                      Descrição da Alteração do Tipo de Alimentação
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-8">
                        <Field
                          component={Select}
                          name="motivo"
                          dataTestId={`select-motivo`}
                          label="Motivo"
                          options={motivos.filter(
                            ({ nome }) =>
                              nome.toUpperCase() !==
                              "Lanche emergencial".toUpperCase(),
                          )}
                          validate={required}
                          onChangeEffect={async (e) => {
                            const value = e.target.value;
                            if (value) {
                              const data_ = form.getState().values.data;
                              form.reset();
                              form.change("motivo", value);
                              form.change("data", data_);
                            }
                          }}
                        />
                      </div>
                      <div className="col-12 col-sm-4">
                        <Field
                          component={InputComData}
                          name="data"
                          dataTestId={`data-alterar-dia`}
                          minDate={proximosDoisDiasUteis}
                          maxDate={fimDoCalendario()}
                          label="Alterar dia"
                          required
                          validate={composeValidators(required)}
                          usarDirty={true}
                          inputOnChange={(value) => {
                            if (value) {
                              const values_ = form.getState().values;
                              onAlterarDiaChanged(value);
                              values_.substituicoes.forEach(
                                (substituicao, indice) => {
                                  if (substituicao.checked) {
                                    getFaixasEtariasPorPeriodo(
                                      values_.substituicoes[indice].uuid,
                                      value.split("/").reverse().join("-"),
                                      indice,
                                      form,
                                    );
                                  }
                                },
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                    {values.motivo && values.data && (
                      <>
                        <div className="row tabela-header-periodos mt-3">
                          <div className="col-4">Período</div>
                          <div className="col-4">Alterar alimentação de:</div>
                          <div className="col-4">Para alimentação:</div>
                        </div>
                        <FieldArray name="substituicoes">
                          {({ fields }) =>
                            fields.map((name, indice) => (
                              <div className="mt-1" key={indice}>
                                <div className="row">
                                  <div className="col-4">
                                    <div
                                      className={`period-quantity number-${indice} ps-5 pt-2 pb-2`}
                                      data-testid={`div-checkbox-${
                                        getPeriodo(values, indice).nome
                                      }`}
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
                                          role="checkbox"
                                          tabIndex={0}
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Enter" ||
                                              e.key === " "
                                            ) {
                                              e.preventDefault();
                                              handlePeriodoOnClick(
                                                form,
                                                name,
                                                indice,
                                                values,
                                              );
                                            }
                                          }}
                                          aria-checked={
                                            values.substituicoes[indice].checked
                                          }
                                          aria-disabled={
                                            !getPeriodo(values, indice).checked
                                          }
                                          onClick={async () => {
                                            handlePeriodoOnClick(
                                              form,
                                              name,
                                              indice,
                                              values,
                                            );
                                          }}
                                          className="checkbox-custom"
                                          data-cy={`checkbox-${
                                            getPeriodo(values, indice).nome
                                          }`}
                                        />{" "}
                                        {getPeriodo(values, indice).nome}
                                      </label>
                                    </div>
                                  </div>
                                  {ehMotivoRPL(values) && (
                                    <div className="col-4">
                                      <Field
                                        component={Select}
                                        dataTestId={`select-tipos-alimentacao-de`}
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
                                        component={MultiselectRaw}
                                        name={`${name}.tipos_alimentacao_de`}
                                        dataTestId={`select-tipos-alimentacao-de`}
                                        selected={
                                          values.substituicoes[indice]
                                            .tipos_alimentacao_de_selecionados ||
                                          []
                                        }
                                        options={getTiposAlimentacaoDe(values)}
                                        onSelectedChanged={(values_) => {
                                          form.change(
                                            `substituicoes[${indice}].tipos_alimentacao_de_selecionados`,
                                            values_.map(
                                              (value_) => value_.value,
                                            ),
                                          );
                                        }}
                                        placeholder="Selecione tipos de alimentação"
                                      />
                                    </div>
                                  )}
                                  <div className="col-4">
                                    <Field
                                      component={Select}
                                      dataTestId={`select-tipos-alimentacao-para`}
                                      name={`${name}.tipo_alimentacao_para`}
                                      options={getTiposAlimentacaoPara(
                                        values,
                                        indice,
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
                                                    dataTestIdDiv={`${name}.faixas.${faixa.faixa_etaria.uuid}`}
                                                    name={`${name}.faixas.${faixa.faixa_etaria.uuid}`}
                                                    validate={
                                                      getPeriodo(values, indice)
                                                        .checked &&
                                                      composeValidators(
                                                        naoPodeSerZero,
                                                        maxValue(faixa.count),
                                                      )
                                                    }
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        <tr className="row">
                                          <td className="col-8 fw-bold">
                                            Total
                                          </td>
                                          <td className="col-2 text-center">
                                            {totalAlunosPorPeriodo(
                                              values,
                                              indice,
                                            )}
                                          </td>
                                          <td className="col-2 text-center">
                                            {totalAlunosInputPorPeriodo(
                                              values,
                                              indice,
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
                        required={!process.env.IS_TEST}
                        validate={
                          !process.env.IS_TEST &&
                          composeValidators(
                            textAreaRequired,
                            peloMenosUmCaractere,
                          )
                        }
                      />
                    </div>
                    <div className="row float-end mt-4">
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
                          className="ms-3"
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
                            handleSubmit((values) => onSubmit(values, form));
                          }}
                          style={BUTTON_STYLE.GREEN}
                          className="ms-3"
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
