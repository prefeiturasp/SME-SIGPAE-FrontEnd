import CardMatriculados from "src/components/Shareable/CardMatriculados";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import {
  createInclusaoAlimentacaoCEMEI,
  getInclusaoCEMEIRascunhos,
  iniciaFluxoInclusaoAlimentacaoCEMEI,
  deleteInclusaoDeAlimentacaoCEMEI,
  updateInclusaoAlimentacaoCEMEI,
  createInclusaoAlimentacao,
  updateInclusaoAlimentacao,
  iniciaFluxoInclusaoAlimentacao,
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao,
  escolaExcluirSolicitacaoDeInclusaoDeAlimentacao,
} from "src/services/inclusaoDeAlimentacao";
import { Rascunhos } from "./componentes/Rascunhos";
import Select from "src/components/Shareable/Select";
import { maxLength, required } from "src/helpers/fieldValidators";
import {
  agregarDefault,
  checaSeDataEstaEntre2e5DiasUteis,
  deepCopy,
  getError,
  composeValidators,
} from "src/helpers/utilities";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import ModalDataPrioritaria from "src/components/Shareable/ModalDataPrioritaria";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { STATUS_DRE_A_VALIDAR } from "src/configs/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  AdicionarDia,
  DataInclusaoNormal,
  OutroMotivo,
} from "src/components/InclusaoDeAlimentacao/Escola/Formulario/componentes/InclusaoNormal";
import { PeriodosCEIeouEMEI } from "./componentes/InclusaoNormal";
import { formataInclusaoCEMEI, validarSubmit } from "./helpers";
import {
  DatasInclusaoContinua,
  Recorrencia,
  RecorrenciaTabela,
} from "src/components/InclusaoDeAlimentacao/Escola/Formulario/componentes/InclusaoContinua";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import { validarSubmissaoContinua } from "src/components/InclusaoDeAlimentacao/Escola/Formulario/validacao";
import { formatarSubmissaoSolicitacaoContinua } from "src/components/InclusaoDeAlimentacao/helper";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";

export const InclusaoDeAlimentacaoCEMEI = ({ ...props }) => {
  const [rascunhos, setRascunhos] = useState(null);
  const [erroRascunhos, setErroRascunhos] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [motivoEspecifico, setMotivoEspecifico] = useState(false);
  const [carregandoRascunho, setCarregandoRascunho] = useState(false);

  const {
    meusDados,
    motivosSimples,
    motivosContinuos,
    proximosDoisDiasUteis,
    proximosCincoDiasUteis,
    periodos,
    periodosInclusaoContinua,
    vinculos,
    vinculosMotivoEspecifico,
    periodosMotivoEspecifico,
  } = props;

  useEffect(() => {
    getRascunhos();
  }, []);

  const resetForm = async (form) => {
    form.change("uuid_", undefined);
    form.change("id_externo_", undefined);
    form.change("inclusoes", [{ motivo: undefined }]);
    form.change("quantidades_periodo", undefined);
    form.change("dias_semana", undefined);
    form.change("tipos_alimentacao_selecionados", []);
    form.change("periodo_escolar");
    form.change("numero_alunos", undefined);
    setCarregandoRascunho(false);
  };

  const motivoSimplesSelecionado = (values) => {
    return (
      values.inclusoes &&
      values.inclusoes[0].motivo &&
      motivosSimples.find(
        (motivo) => motivo.uuid === values.inclusoes[0].motivo
      )
    );
  };

  const motivoContinuoSelecionado = (values) => {
    return (
      values.inclusoes &&
      values.inclusoes[0].motivo &&
      motivosContinuos.find(
        (motivo) => motivo.uuid === values.inclusoes[0].motivo
      )
    );
  };

  const outroMotivoSelecionado = (values, index) => {
    return (
      values.inclusoes &&
      values.inclusoes[index] &&
      values.inclusoes[index].motivo &&
      motivosSimples.find(
        (motivo) => motivo.uuid === values.inclusoes[index].motivo
      ) &&
      motivosSimples
        .find((motivo) => motivo.uuid === values.inclusoes[index].motivo)
        .nome.includes("Outro")
    );
  };

  const motivoEspecificoSelecionado = (values, index) => {
    return (
      values &&
      values.inclusoes &&
      values.inclusoes[index] &&
      values.inclusoes[index].motivo &&
      motivosSimples.find(
        (motivo) => motivo.uuid === values.inclusoes[index].motivo
      ) &&
      motivosSimples.find(
        (motivo) => motivo.uuid === values.inclusoes[index].motivo
      ).nome === "Evento Específico"
    );
  };

  const getRascunhos = async () => {
    const responseRascunhosNormais = await getInclusaoCEMEIRascunhos();
    const responseRascunhosContinuas =
      await obterMinhasSolicitacoesDeInclusaoDeAlimentacao(
        TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
      );
    if (
      responseRascunhosNormais.status === HTTP_STATUS.OK &&
      responseRascunhosContinuas.status === HTTP_STATUS.OK
    ) {
      setRascunhos(
        responseRascunhosNormais.data.results.concat(
          responseRascunhosContinuas.data.results
        )
      );
    } else {
      setErroRascunhos(true);
    }
  };

  const removerRascunho = async (id_externo, uuid, tipoSolicitacao, form) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      let response = "";
      if (tipoSolicitacao) {
        response = await escolaExcluirSolicitacaoDeInclusaoDeAlimentacao(
          uuid,
          tipoSolicitacao
        );
      } else {
        response = await deleteInclusaoDeAlimentacaoCEMEI(uuid);
      }
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

  const carregarRascunhoContinuo = (form, values, inclusao_) => {
    const quantidades_periodo_ = deepCopy(inclusao_.quantidades_periodo);
    quantidades_periodo_.forEach((qp) => {
      qp.dias_semana = qp.dias_semana.map(String);
      qp.periodo_escolar = qp.periodo_escolar.uuid;
      qp.tipos_alimentacao = qp.tipos_alimentacao.map((t) => t.uuid);
      delete qp.grupo_inclusao_normal;
      delete qp.inclusao_alimentacao_continua;
    });

    form.change("inclusoes", [
      {
        motivo: inclusao_.motivo.uuid,
        data_inicial: inclusao_.data_inicial,
        data_final: inclusao_.data_final,
      },
    ]);
    form.change("quantidades_periodo", quantidades_periodo_);
  };

  const carregarRascunho = async (form, values, inclusao) => {
    setCarregandoRascunho(true);
    const inclusao_ = deepCopy(inclusao);
    if (inclusao_.dias_motivos_da_inclusao_cemei) {
      carregarRascunhoNormal(form, inclusao_);
    } else {
      carregarRascunhoContinuo(form, values, inclusao_);
    }
    setCarregandoRascunho(false);
    form.change("uuid_", inclusao.uuid);
    form.change("id_externo_", inclusao.id_externo);
  };

  const buildFaixas = (values, inclusao) => {
    inclusao.quantidade_alunos_cei_da_inclusao_cemei.forEach((qtd_alunos) => {
      const periodo_nome = qtd_alunos.periodo_escolar.nome;
      const index = values.findIndex((qp) => qp.nome === periodo_nome);
      values[index].checked = true;
      if (!values[index].faixas) {
        values[index].faixas = {};
      }
      values[index].faixas[qtd_alunos.faixa_etaria.__str__] =
        qtd_alunos.quantidade_alunos;
    });
  };

  const buildAlunosEMEI = async (values, inclusao, form) => {
    inclusao.quantidade_alunos_emei_da_inclusao_cemei.forEach((qtd_alunos) => {
      const periodo_nome = qtd_alunos.periodo_escolar.nome;
      const index = values.findIndex((qp) => qp.nome === periodo_nome);
      values[index].checked = true;
      values[index].alunos_emei = qtd_alunos.quantidade_alunos;
      form.change(
        `quantidades_periodo[${index}].tipos_alimentacao_selecionados`,
        qtd_alunos.tipos_alimentacao.map((t) => t.uuid)
      );
    });
  };

  const carregarRascunhoNormal = async (form, inclusao_) => {
    const temMotivoEspecifico = inclusao_.dias_motivos_da_inclusao_cemei.some(
      (i) => i.motivo.nome.includes("Específico")
    );
    let periodos_ = deepCopy(periodos);
    if (temMotivoEspecifico) {
      periodos_ = deepCopy(periodosMotivoEspecifico);
    }
    inclusao_.dias_motivos_da_inclusao_cemei.forEach((i) => {
      i.motivo = i.motivo.uuid;
    });
    await form.change("inclusoes", inclusao_.dias_motivos_da_inclusao_cemei);
    buildFaixas(periodos_, inclusao_);
    await form.change(`quantidades_periodo`, periodos_);
    await buildAlunosEMEI(periodos_, inclusao_, form);
  };

  const refresh = (form) => {
    getRascunhos();
    resetForm(form);
  };

  const iniciarPedido = async (uuid, form) => {
    const response = await iniciaFluxoInclusaoAlimentacaoCEMEI(uuid);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Inclusão de Alimentação enviada com sucesso!");
      refresh(form);
    } else {
      toastError(getError(response.data));
    }
  };

  const iniciarPedidoInclusaoContinua = async (uuid, tipoInclusao, form) => {
    const response = await iniciaFluxoInclusaoAlimentacao(uuid, tipoInclusao);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Inclusão de Alimentação enviada com sucesso!");
      refresh(form);
    } else {
      toastError(getError(response.data));
    }
  };

  const fluxoInclusaoNormal = async (values, form) => {
    if (!values.uuid_) {
      let vinculosAlimentacao = vinculos;
      if (motivoEspecifico) {
        vinculosAlimentacao = vinculosMotivoEspecifico;
      }
      const response = await createInclusaoAlimentacaoCEMEI(
        formataInclusaoCEMEI(values, vinculosAlimentacao)
      );
      if (response.status === HTTP_STATUS.CREATED) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, form);
        } else {
          toastSuccess("Solicitação Rascunho criada com sucesso!");
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    } else {
      const response = await updateInclusaoAlimentacaoCEMEI(
        values.uuid_,
        formataInclusaoCEMEI(values, vinculos)
      );
      if (response.status === HTTP_STATUS.OK) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(values.uuid_, form);
        } else {
          toastSuccess("Rascunho atualizado com sucesso");
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    }
  };

  const fluxoInclusaoContinua = async (values, form) => {
    if (!values.uuid_) {
      const response = await createInclusaoAlimentacao(
        formatarSubmissaoSolicitacaoContinua(values),
        TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
      );
      if (response.status === HTTP_STATUS.CREATED) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedidoInclusaoContinua(
            response.data.uuid,
            TIPO_SOLICITACAO.SOLICITACAO_CONTINUA,
            form
          );
        } else {
          toastSuccess("Solicitação Rascunho criada com sucesso!");
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    } else {
      const response = await updateInclusaoAlimentacao(
        values.uuid_,
        formatarSubmissaoSolicitacaoContinua(values),
        TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
      );
      if (response.status === HTTP_STATUS.OK) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedidoInclusaoContinua(
            values.uuid_,
            TIPO_SOLICITACAO.SOLICITACAO_CONTINUA,
            form
          );
        } else {
          toastSuccess("Rascunho atualizado com sucesso");
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    }
  };

  const onSubmit = async (values, form) => {
    const values_ = deepCopy(values);
    const ehMotivoEspecifico = ehMotivoInclusaoEspecifico(values);
    const tipoSolicitacao = motivoSimplesSelecionado(values)
      ? TIPO_SOLICITACAO.SOLICITACAO_NORMAL
      : TIPO_SOLICITACAO.SOLICITACAO_CONTINUA;
    const erro =
      tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL
        ? validarSubmit(values_, meusDados, ehMotivoEspecifico)
        : validarSubmissaoContinua(values, meusDados, ehMotivoEspecifico);
    if (erro) {
      toastError(erro);
      return;
    }
    if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
      fluxoInclusaoNormal(values_, form);
    } else {
      fluxoInclusaoContinua(values_, form);
    }
  };

  const onDataChanged = (value) => {
    if (
      value &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        proximosDoisDiasUteis,
        proximosCincoDiasUteis
      )
    ) {
      setShowModal(true);
    }
  };

  const ehMotivoInclusaoEspecifico = (values) => {
    const motivos = motivoContinuoSelecionado(values)
      ? motivosContinuos
      : motivosSimples;
    return (
      values.inclusoes &&
      values.inclusoes[0].motivo &&
      motivos
        .find((motivo) => motivo.uuid === values.inclusoes[0].motivo)
        ?.nome.includes("Específico")
    );
  };

  const checaMotivoInclusaoEspecifico = (values, form, value) => {
    if (
      (ehMotivoInclusaoEspecifico(values) && !carregandoRascunho) ||
      (motivosSimples
        .find((motivo) => motivo.uuid === value)
        .nome.includes("Específico") &&
        carregandoRascunho)
    ) {
      setMotivoEspecifico(true);
      form.change("quantidades_periodo", undefined);
      form.change("quantidades_periodo", periodosMotivoEspecifico);
    } else {
      form.change("quantidades_periodo", periodos);
      setMotivoEspecifico(false);
    }
  };

  const getPeriodos = (values) => {
    return ehMotivoInclusaoEspecifico(values) ||
      (carregandoRascunho && motivoEspecifico)
      ? periodosMotivoEspecifico
      : motivoContinuoSelecionado(values)
      ? periodosInclusaoContinua
      : periodos;
  };

  return (
    <div>
      <div className="mt-3">
        <CardMatriculados
          meusDados={meusDados}
          numeroAlunos={
            meusDados.vinculo_atual.instituicao.quantidade_alunos || 0
          }
        />
      </div>
      {erroRascunhos && (
        <div className="card mt-3 mb-3">
          Erro ao carregar rascunhos de Inclusão de Alimentação.
        </div>
      )}
      <Form
        keepDirtyOnReinitialize
        mutators={{
          ...arrayMutators,
        }}
        initialValues={{
          escola: meusDados.vinculo_atual.instituicao.uuid,
          inclusoes: [{ motivo: undefined }],
        }}
        onSubmit={onSubmit}
      >
        {({
          handleSubmit,
          submitting,
          form,
          form: {
            mutators: { push },
          },
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            {rascunhos && rascunhos.length > 0 && (
              <div className="mt-3">
                <span className="page-title">Rascunhos</span>
                <Rascunhos
                  rascunhosInclusaoDeAlimentacao={rascunhos}
                  removerRascunho={removerRascunho}
                  carregarRascunho={carregarRascunho}
                  form={form}
                  values={values}
                />
              </div>
            )}
            <div className="mt-2 page-title">
              {values.uuid_
                ? `Solicitação # ${values.id_externo_}`
                : "Nova Solicitação"}
            </div>
            <div className="card solicitation mt-2">
              <div className="card-body">
                <div className="card-title fw-bold">
                  Descrição da Inclusão de Alimentação
                </div>
                <FieldArray name="inclusoes">
                  {({ fields }) =>
                    fields.map((name, index) => (
                      <div key={name}>
                        <div className="row">
                          <div className="col-6">
                            <Field
                              component={Select}
                              dataTestId={`select-motivo-${index}`}
                              name={`${name}.motivo`}
                              label="Motivo"
                              options={
                                values.inclusoes.length > 1
                                  ? agregarDefault(motivosSimples)
                                  : agregarDefault(motivosSimples).concat(
                                      motivosContinuos
                                    )
                              }
                              required
                              validate={required}
                              naoDesabilitarPrimeiraOpcao
                              onChangeEffect={async (e) => {
                                const value = e.target.value;
                                const values_ = form.getState().values;
                                if (
                                  value &&
                                  motivosSimples.find(
                                    (motivo) => motivo.uuid === value
                                  )
                                ) {
                                  form.change("quantidades_periodo", undefined);
                                  checaMotivoInclusaoEspecifico(
                                    values_,
                                    form,
                                    value
                                  );
                                  form.change("reload", !values_.reload);
                                }
                                if (
                                  value &&
                                  motivosContinuos.find(
                                    (motivo) => motivo.uuid === value
                                  )
                                ) {
                                  form.change("quantidades_periodo", undefined);
                                  form.change("reload", !values_.reload);
                                }
                              }}
                            />
                          </div>
                          {motivoSimplesSelecionado(values) && (
                            <DataInclusaoNormal
                              name={name}
                              onDataChanged={onDataChanged}
                              values={values}
                              index={index}
                              proximosDoisDiasUteis={proximosDoisDiasUteis}
                              form={form}
                            />
                          )}
                          {motivoContinuoSelecionado(values) && (
                            <DatasInclusaoContinua
                              onDataChanged={onDataChanged}
                              index={index}
                              name={name}
                              proximosDoisDiasUteis={proximosDoisDiasUteis}
                              values={values}
                            />
                          )}
                        </div>
                        {outroMotivoSelecionado(values, index) && (
                          <div className="mt-3">
                            <OutroMotivo name={name} />
                          </div>
                        )}
                        {motivoEspecificoSelecionado(values, index) && (
                          <div className="mb-3">
                            <Field
                              component={TextArea}
                              label="Descrição do Evento"
                              name={`${name}.descricao_evento`}
                              required
                              validate={composeValidators(
                                required,
                                maxLength(1500)
                              )}
                            />
                          </div>
                        )}
                        <hr />
                      </div>
                    ))
                  }
                </FieldArray>
                {motivoSimplesSelecionado(values) && (
                  <>
                    <div className="mt-3">
                      <AdicionarDia push={push} />
                    </div>
                    {values.quantidades_periodo && (
                      <PeriodosCEIeouEMEI
                        form={form}
                        values={values}
                        periodos={getPeriodos(values)}
                        motivoEspecifico={motivoEspecifico}
                        vinculos={vinculos}
                        meusDados={meusDados}
                      />
                    )}
                  </>
                )}
                {motivoContinuoSelecionado(values) && (
                  <>
                    <Recorrencia
                      values={values}
                      form={form}
                      periodos={getPeriodos(values)}
                      ehMotivoInclusaoEspecifico={ehMotivoInclusaoEspecifico(
                        values
                      )}
                      push={push}
                    />
                    {values.quantidades_periodo && (
                      <div className="mt-5">
                        <RecorrenciaTabela
                          values={values}
                          periodos={getPeriodos(values)}
                          form={form}
                          meusDados={meusDados}
                        />
                      </div>
                    )}
                  </>
                )}
                <div className="row float-end mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Cancelar"
                      onClick={() => {
                        resetForm(form);
                      }}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                    <Botao
                      texto={
                        values.uuid_ ? "Atualizar rascunho" : "Salvar rascunho"
                      }
                      className="ms-3"
                      disabled={submitting}
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                    <Botao
                      texto="Enviar inclusão"
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
              </div>
            </div>
            <ModalDataPrioritaria
              showModal={showModal}
              closeModal={() => setShowModal(false)}
            />
          </form>
        )}
      </Form>
    </div>
  );
};

export default InclusaoDeAlimentacaoCEMEI;
