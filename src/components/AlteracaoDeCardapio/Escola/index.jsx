import { Spin } from "antd";
import { Botao } from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import CardMatriculados from "components/Shareable/CardMatriculados";
import CKEditorField from "components/Shareable/CKEditorField";
import { InputComData } from "components/Shareable/DatePicker";
import { InputText } from "components/Shareable/Input/InputText";
import ModalDataPrioritaria from "components/Shareable/ModalDataPrioritaria";
import { MultiselectRaw } from "components/Shareable/MultiselectRaw";
import { Select } from "components/Shareable/Select";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { STATUS_DRE_A_VALIDAR } from "configs/constants";
import { TIPO_SOLICITACAO } from "constants/shared";
import arrayMutators from "final-form-arrays";
import {
  composeValidators,
  maxValue,
  naoPodeSerZero,
  peloMenosUmCaractere,
  required,
  textAreaRequired,
} from "helpers/fieldValidators";
import {
  checaSeDataEstaEntre2e5DiasUteis,
  deepCopy,
  fimDoCalendario,
  getError,
  usuarioEhEscolaCeuGestao,
  usuarioEhEscolaCMCT,
} from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  escolaAlterarSolicitacaoDeAlteracaoCardapio,
  escolaCriarSolicitacaoDeAlteracaoCardapio,
  escolaExcluirSolicitacaoDeAlteracaoCardapio,
  escolaIniciarSolicitacaoDeAlteracaoDeCardapio,
  getRascunhosAlteracaoTipoAlimentacao,
} from "services/alteracaoDeCardapio";
import { getDiasUteis } from "services/diasUteis.service";
import { formataValues } from "../helper";
import ModalConfirmaAlteracao from "../ModalConfirmaAlteracao";
import { Rascunhos } from "../Rascunhos";
import { validateSubmit } from "../validacao";
import "./style.scss";

export const AlteracaoCardapio = ({ ...props }) => {
  const [rascunhos, setRascunhos] = useState();
  const [limiteDataInicial, setLimiteDataInicial] = useState();
  const [limiteDataFinal, setLimiteDataFinal] = useState();

  const [showModalDiasUteis, setShowModalDiasUteis] = useState(false);
  const [showModalConfirmarAlteracao, setShowModalConfirmarAlteracao] =
    useState(false);

  const [erro, setErro] = useState("");

  const {
    meusDados,
    motivos,
    periodos,
    proximosCincoDiasUteis,
    proximosDoisDiasUteis,
  } = props;

  const enviaAlteracaoCardapio = async (uuid, form) => {
    const response = await escolaIniciarSolicitacaoDeAlteracaoDeCardapio(
      uuid,
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Alteração do Tipo de Alimentação enviada com sucesso");
      getRascunhosAsync();
      resetForm(form);
    } else {
      toastError(
        "Houve um erro ao enviar a Alteração do Tipo de Alimentação. Tente novamente mais tarde."
      );
    }
  };

  const onSubmit = async (values, form) => {
    let values_ = deepCopy(values);
    const status = values_.status;
    delete values_.status;
    const erros = validateSubmit(values_, meusDados);
    if (!erros) {
      values_ = formataValues(values_, ehMotivoPorNome("RPL"));
      if (!values_.uuid) {
        const response = await escolaCriarSolicitacaoDeAlteracaoCardapio(
          values_,
          TIPO_SOLICITACAO.SOLICITACAO_NORMAL
        );
        if (response.status === HTTP_STATUS.CREATED) {
          if (status === STATUS_DRE_A_VALIDAR) {
            await enviaAlteracaoCardapio(response.data.uuid, form);
          } else {
            toastSuccess("Alteração do Tipo de Alimentação salva com sucesso");
            getRascunhosAsync();
            resetForm(form);
          }
        } else {
          toastError(getError(response.data));
        }
      } else {
        const response = await escolaAlterarSolicitacaoDeAlteracaoCardapio(
          values_.uuid,
          values_,
          TIPO_SOLICITACAO.SOLICITACAO_NORMAL
        );
        if (response.status === HTTP_STATUS.OK) {
          if (status === STATUS_DRE_A_VALIDAR) {
            await enviaAlteracaoCardapio(response.data.uuid, form);
            getRascunhosAsync();
          } else {
            toastSuccess("Alteração do Tipo de Alimentação salva com sucesso");
            getRascunhosAsync();
          }
        } else {
          toastError(
            `Houve um erro ao enviar ao salvar alteração do tipo de alimentação. Tente novamente mais tarde.`
          );
        }
      }
    } else {
      toastError(erros);
    }
  };

  const carregarRascunho = async (alteracaoDeCardapio, form) => {
    form.change("uuid", alteracaoDeCardapio.uuid);
    form.change("id_externo", alteracaoDeCardapio.id_externo);
    form.change("motivo", alteracaoDeCardapio.motivo.uuid);
    if (alteracaoDeCardapio.data_inicial !== alteracaoDeCardapio.data_final) {
      form.change("data_inicial", alteracaoDeCardapio.data_inicial);
      form.change("data_final", alteracaoDeCardapio.data_final);
    } else {
      form.change("alterar_dia", alteracaoDeCardapio.data_inicial);
    }

    const substituicoesValue = deepCopy(periodos);

    for (const substituicao of alteracaoDeCardapio.substituicoes) {
      const substituicaoValue = substituicoesValue.find(
        (subs) => subs.nome === substituicao.periodo_escolar.nome
      );
      substituicaoValue.check = true;
      substituicaoValue.tipos_alimentacao_de_selecionados =
        substituicao.tipos_alimentacao_de.map((tp) => tp.uuid);
      substituicaoValue.tipos_alimentacao_para_selecionados =
        substituicao.tipos_alimentacao_para.map((tp) => tp.uuid);
      substituicaoValue.qtd_alunos = substituicao.qtd_alunos;
    }

    await form.change("substituicoes", substituicoesValue);
    form.change("observacao", alteracaoDeCardapio.observacao);
  };

  const getRascunhosAsync = async () => {
    const response = await getRascunhosAlteracaoTipoAlimentacao(
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL
    );
    if (response.status === HTTP_STATUS.OK) {
      setRascunhos(response.data.results);
    } else {
      setErro("Erro ao carregar rascunhos. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    getRascunhosAsync();
  }, []);

  const handleDelete = async (id_externo, uuid) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      const response = await escolaExcluirSolicitacaoDeAlteracaoCardapio(
        uuid,
        TIPO_SOLICITACAO.SOLICITACAO_NORMAL
      );
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
        await getRascunhosAsync();
      } else {
        toastError("Houve um erro ao excluir o rascunho");
      }
    }
  };

  const resetForm = (form) => {
    form.reset();
    form.change("substituicoes", periodos);
  };

  const ehMotivoPorNome = (nome, values) => {
    if (!values) return false;
    return motivos
      .find((motivo) => motivo.uuid === values.motivo)
      ?.nome.includes(nome);
  };

  const onAlterarDiaChanged = (value, values) => {
    if (
      value &&
      !ehMotivoPorNome("Lanche Emergencial", values) &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        proximosDoisDiasUteis,
        proximosCincoDiasUteis
      )
    ) {
      setShowModalDiasUteis(true);
    }
  };

  const obtemDataInicial = async (value) => {
    setLimiteDataInicial(moment(value, "DD/MM/YYYY").add(1, "days")["_d"]);
    const response = await getDiasUteis({ data: value });
    if (response.status === HTTP_STATUS.OK) {
      setLimiteDataFinal(
        moment(response.data.data_apos_quatro_dias_uteis, "YYYY-MM-DD")._d
      );
    } else {
      setErro(
        "Erro ao carregar limite da data final da Alteração de dia de Cardápio"
      );
    }
  };

  const getPeriodo = (index) => {
    return periodos[index];
  };

  const handleNumeroAlunosValidate = (index) => {
    return usuarioEhEscolaCeuGestao() || usuarioEhEscolaCMCT()
      ? composeValidators(naoPodeSerZero, required)
      : composeValidators(
          naoPodeSerZero,
          required,
          maxValue(getPeriodo(index).maximo_alunos)
        );
  };

  return (
    <>
      {erro && <div>{erro}</div>}
      {!erro && (
        <div className="formulario-alteracao-cardapio">
          <Form
            mutators={{
              ...arrayMutators,
            }}
            initialValues={{
              substituicoes: periodos,
              escola: meusDados.vinculo_atual.instituicao.uuid,
            }}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, form, values, submitting }) => (
              <form onSubmit={handleSubmit}>
                <CardMatriculados meusDados={meusDados} />
                <Spin tip="Carregando rascunhos..." spinning={!rascunhos}>
                  {rascunhos?.length > 0 && (
                    <section className="mt-3">
                      <span className="page-title">Rascunhos</span>
                      <Rascunhos
                        rascunhos={rascunhos}
                        removerRascunho={handleDelete}
                        form={form}
                        carregarRascunho={carregarRascunho}
                      />
                    </section>
                  )}
                </Spin>
                <div className="mt-2 page-title">
                  {values.uuid
                    ? `Solicitação # ${values.id_externo}`
                    : "Nova Solicitação"}
                </div>
                <div className="card mt-3">
                  <div className="card-body">
                    <div className="card-title fw-bold descricao">
                      Descrição da Alteração
                    </div>
                    <section className="section-form-motivo mt-3">
                      <Field
                        component={Select}
                        name="motivo"
                        label="Tipo de Alteração"
                        options={motivos}
                        validate={required}
                        required
                        /*onChangeEffect={() => {
                          //this.onChangeMotivo(evt.target.value);
                        }}*/
                      />
                    </section>
                    <section className="section-form-datas mt-2">
                      <Field
                        component={InputComData}
                        inputOnChange={(value) =>
                          onAlterarDiaChanged(value, values)
                        }
                        name="alterar_dia"
                        minDate={
                          ehMotivoPorNome("Lanche Emergencial", values)
                            ? moment().toDate()
                            : proximosDoisDiasUteis
                        }
                        maxDate={fimDoCalendario()}
                        label="Alterar dia"
                        disabled={values.data_inicial || values.data_final}
                        usarDirty
                      />
                      <>
                        <div className="opcao-data">Ou</div>
                        <Field
                          component={InputComData}
                          name="data_inicial"
                          label="De"
                          minDate={
                            ehMotivoPorNome("Lanche Emergencial", values)
                              ? moment().toDate()
                              : proximosDoisDiasUteis
                          }
                          maxDate={fimDoCalendario()}
                          disabled={
                            values.alterar_dia ||
                            !values.motivo ||
                            !ehMotivoPorNome("Lanche Emergencial", values)
                          }
                          inputOnChange={async (value) => {
                            await obtemDataInicial(value);
                            onAlterarDiaChanged(value, values);
                          }}
                        />
                        <Field
                          component={InputComData}
                          name="data_final"
                          label="Até"
                          disabled={!values.data_inicial || values.alterar_dia}
                          minDate={limiteDataInicial}
                          maxDate={limiteDataFinal}
                        />
                      </>
                    </section>

                    <section>
                      <div className="row mt-3 mb-3 g-0">
                        <div className="col-3 pe-3">Período</div>
                        <div className="col-3 pe-3">
                          Alterar alimentação de:
                        </div>
                        <div className="col-3 pe-3">Para alimentação:</div>
                        <div className="col-3">Nº de Alunos</div>
                      </div>
                      <FieldArray name="substituicoes">
                        {({ fields }) =>
                          fields.map((name, index) => (
                            <div className="row g-0" key={index}>
                              <div className="col-3 pe-3">
                                <div
                                  className={`period-quantity number-${index} ps-5 pt-2 pb-2`}
                                >
                                  <Fragment>
                                    <label
                                      htmlFor="check"
                                      className="checkbox-label"
                                    >
                                      <Field
                                        component={"input"}
                                        type="checkbox"
                                        name={`${name}.check`}
                                      />
                                      <span
                                        onClick={() => {
                                          form.change(
                                            `${name}.check`,
                                            !values.substituicoes[index][
                                              "check"
                                            ]
                                          );
                                        }}
                                        className="checkbox-custom"
                                        data-cy={`checkbox-${
                                          getPeriodo(index).nome
                                        }`}
                                      />
                                      <div className="">
                                        {" "}
                                        {getPeriodo(index).nome}
                                      </div>
                                    </label>
                                  </Fragment>
                                </div>
                              </div>
                              <div className="col-3 pe-3">
                                <Field
                                  component={MultiselectRaw}
                                  name={`${name}.tipos_alimentacao_de`}
                                  selected={
                                    form.getState().values.substituicoes[index]
                                      .tipos_alimentacao_de_selecionados || []
                                  }
                                  options={getPeriodo(
                                    index
                                  ).tipos_alimentacao.map(
                                    (tipo_alimentacao) => ({
                                      label: tipo_alimentacao.nome,
                                      value: tipo_alimentacao.uuid,
                                    })
                                  )}
                                  onSelectedChanged={(values_) => {
                                    form.change(
                                      `substituicoes[${index}].tipos_alimentacao_de_selecionados`,
                                      values_.map((value_) => value_.value)
                                    );
                                  }}
                                  placeholder="Selecione tipos de alimentação"
                                  disabled={
                                    !values.substituicoes[index]["check"]
                                  }
                                  required={
                                    values.substituicoes[index]["check"]
                                  }
                                />
                              </div>
                              <div className="col-3 pe-3">
                                <Field
                                  component={MultiselectRaw}
                                  name={`${name}.tipos_alimentacao_para`}
                                  selected={
                                    values.substituicoes[index]
                                      .tipos_alimentacao_para_selecionados || []
                                  }
                                  required={
                                    values.substituicoes[index]["check"]
                                  }
                                  options={getPeriodo(
                                    index
                                  ).tipos_alimentacao.map(
                                    (tipo_alimentacao) => ({
                                      label: tipo_alimentacao.nome,
                                      value: tipo_alimentacao.uuid,
                                    })
                                  )}
                                  onSelectedChanged={(values_) => {
                                    form.change(
                                      `substituicoes[${index}].tipos_alimentacao_para_selecionados`,
                                      values_.map((value_) => value_.value)
                                    );
                                  }}
                                  placeholder="Selecione tipos de alimentação"
                                  disabled={
                                    !values.substituicoes[index]["check"]
                                  }
                                />
                              </div>
                              <div className="col-3">
                                <Field
                                  component={InputText}
                                  disabled={
                                    !values.substituicoes[index]["check"]
                                  }
                                  type="number"
                                  name={`${name}.qtd_alunos`}
                                  min="0"
                                  step="1"
                                  required={
                                    values.substituicoes[index]["check"]
                                  }
                                  validate={
                                    values.substituicoes[index]["check"] &&
                                    handleNumeroAlunosValidate(index)
                                  }
                                />
                              </div>
                            </div>
                          ))
                        }
                      </FieldArray>
                    </section>
                    <hr />
                    <Field
                      component={CKEditorField}
                      label="Motivo/Justificativa"
                      name="observacao"
                      required
                      validate={composeValidators(
                        textAreaRequired,
                        peloMenosUmCaractere
                      )}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-12 text-end">
                      <Botao
                        texto="Cancelar"
                        onClick={() => resetForm(form)}
                        disabled={submitting}
                        className="me-3"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                      <Botao
                        disabled={submitting}
                        texto={
                          values.uuid ? "Atualizar rascunho" : "Salvar rascunho"
                        }
                        type={BUTTON_TYPE.SUBMIT}
                        className="me-3"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                      <Botao
                        texto="Enviar"
                        className="me-2"
                        disabled={submitting}
                        type={BUTTON_TYPE.BUTTON}
                        onClick={async () => {
                          values["status"] = STATUS_DRE_A_VALIDAR;
                          await handleSubmit(values, form);
                        }}
                        style={BUTTON_STYLE.GREEN}
                      />
                    </div>
                  </div>
                </div>
                <ModalDataPrioritaria
                  showModal={showModalDiasUteis}
                  closeModal={() => setShowModalDiasUteis(false)}
                />
                <ModalConfirmaAlteracao
                  showModal={showModalConfirmarAlteracao}
                  closeModal={() => setShowModalConfirmarAlteracao(true)}
                  values={values}
                  onSubmit={onSubmit}
                />
              </form>
            )}
          </Form>
        </div>
      )}
    </>
  );
};
