import { Spin } from "antd";
import CardMatriculados from "components/Shareable/CardMatriculados";
import { InputComData } from "components/Shareable/DatePicker";
import ModalDataPrioritaria from "components/Shareable/ModalDataPrioritaria";
import { MultiselectRaw } from "components/Shareable/MultiselectRaw";
import { Select } from "components/Shareable/Select";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { TIPO_SOLICITACAO } from "constants/shared";
import { required } from "helpers/fieldValidators";
import arrayMutators from "final-form-arrays";
import {
  checaSeDataEstaEntre2e5DiasUteis,
  fimDoCalendario,
} from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  escolaExcluirSolicitacaoDeAlteracaoCardapio,
  getRascunhosAlteracaoTipoAlimentacao,
} from "services/alteracaoDeCardapio";
import { getVinculosTipoAlimentacaoPorEscola } from "services/cadastroTipoAlimentacao.service";
import { getDiasUteis } from "services/diasUteis.service";
import { Rascunhos } from "../Rascunhos";
import "./style.scss";

export const AlteracaoCardapio = ({ ...props }) => {
  const [rascunhos, setRascunhos] = useState();
  const [limiteDataInicial, setLimiteDataInicial] = useState();
  const [limiteDataFinal, setLimiteDataFinal] = useState();
  const [vinculos, setVinculos] = useState();

  const [showModalDiasUteis, setShowModalDiasUteis] = useState(false);

  const [erro, setErro] = useState("");

  const {
    meusDados,
    motivos,
    //periodos,
    proximosCincoDiasUteis,
    proximosDoisDiasUteis,
    //feriadosAno,
  } = props;

  const onSubmit = () => {};

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

  const getVinculosAsync = async () => {
    const escolaUuid = meusDados.vinculo_atual.instituicao.uuid;
    const response = await getVinculosTipoAlimentacaoPorEscola(escolaUuid);

    if (response.status === HTTP_STATUS.OK) {
      setVinculos(response.data.results);
      console.log(response.data.results);
    } else {
      setErro(
        "Erro ao carregar vinculos dos períodos escolares da escola. Tente novamente mais tarde."
      );
    }
  };

  useEffect(() => {
    getRascunhosAsync();
    getVinculosAsync();
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
  };

  const ehMotivoLancheEmergencial = (values) => {
    return (
      motivos.find((motivo) => motivo.uuid === values.motivo)?.nome ===
      "Lanche Emergencial"
    );
  };

  const onAlterarDiaChanged = (value, values) => {
    if (
      value &&
      !ehMotivoLancheEmergencial(values) &&
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
    return vinculos[index];
  };

  return (
    <>
      {erro && <div>{erro}</div>}
      {!erro && (
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, form, values }) => (
            <form onSubmit={handleSubmit}>
              <CardMatriculados meusDados={meusDados} />
              <Spin tip="Carregando rascunhos..." spinning={!rascunhos}>
                {rascunhos?.length > 0 && (
                  <section className="mt-3">
                    <span className="page-title">Rascunhos</span>
                    <Rascunhos
                      rascunhos={rascunhos}
                      removerRascunho={handleDelete}
                      resetForm={() => resetForm(form)}
                      carregarRascunho={async () => {
                        //await this.onChangeMotivo(params.motivo.uuid);
                        //await this.OnEditButtonClicked(params);
                      }}
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
                      onChangeEffect={() => {
                        //this.onChangeMotivo(evt.target.value);
                      }}
                    />
                  </section>
                  <section className="section-form-datas mt-4">
                    <Field
                      component={InputComData}
                      inputOnChange={(value) =>
                        onAlterarDiaChanged(value, values)
                      }
                      name="alterar_dia"
                      minDate={
                        ehMotivoLancheEmergencial(values)
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
                          ehMotivoLancheEmergencial(values)
                            ? moment().toDate()
                            : proximosDoisDiasUteis
                        }
                        maxDate={fimDoCalendario()}
                        disabled={
                          values.alterar_dia ||
                          !values.motivo ||
                          !ehMotivoLancheEmergencial(values)
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
                    <header className="descricao-periodos-alimentacao">
                      <div>Período</div>
                      <div>Alterar alimentação de:</div>
                      <div>Para alimentação:</div>
                      <div>Nº de Alunos</div>
                    </header>
                    <FieldArray name="substituicoes">
                      {({ fields }) =>
                        fields.map((name, index) => (
                          <div
                            className="row item-periodo-alimentacao"
                            key={index}
                          >
                            <Fragment>
                              <label
                                htmlFor="check"
                                className="checkbox-label"
                                style={{
                                  background:
                                    getPeriodo(index).style.background,
                                  border: `1px solid ${
                                    getPeriodo(index).style.borderColor
                                  }`,
                                }}
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
                                      !values.substituicoes[index]["check"]
                                    );
                                  }}
                                  className="checkbox-custom"
                                  data-cy={`checkbox-${getPeriodo(index).nome}`}
                                />
                                <div className="">
                                  {" "}
                                  {getPeriodo(index).nome}
                                </div>
                              </label>
                            </Fragment>
                            <Field
                              component={MultiselectRaw}
                              name={`${name}.tipos_alimentacao_de`}
                              selected={
                                values.substituicoes[index]
                                  .tipos_alimentacao_de_selecionados || []
                              }
                              options={vinculos[index].tipos_alimentacao}
                              onSelectedChanged={(values_) => {
                                form.change(
                                  `substituicoes[${index}].tipos_alimentacao_de_selecionados`,
                                  values_.map((value_) => value_.value)
                                );
                              }}
                              placeholder="Selecione tipos de alimentação"
                            />
                          </div>
                        ))
                      }
                    </FieldArray>
                  </section>
                </div>
              </div>
              <ModalDataPrioritaria
                showModal={showModalDiasUteis}
                closeModal={() => setShowModalDiasUteis(false)}
              />
            </form>
          )}
        </Form>
      )}
    </>
  );
};
