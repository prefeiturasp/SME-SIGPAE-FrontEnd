import React, { ChangeEvent, useEffect, useState } from "react";
import CardMatriculados from "components/Shareable/CardMatriculados";
import HTTP_STATUS from "http-status-codes";
import { TIPO_SOLICITACAO } from "constants/shared";
import { Field, Form } from "react-final-form";
import {
  updateInclusaoAlimentacao,
  createInclusaoAlimentacao,
  escolaExcluirSolicitacaoDeInclusaoDeAlimentacao,
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao,
  iniciaFluxoInclusaoAlimentacao,
} from "services/inclusaoDeAlimentacao";
import { Rascunhos } from "./componentes/Rascunhos";
import Select from "components/Shareable/Select";
import { required } from "helpers/fieldValidators";
import {
  agregarDefault,
  usuarioEhEscolaCMCT,
  checaSeDataEstaEntre2e5DiasUteis,
  deepCopy,
  getError,
} from "helpers/utilities";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import {
  AdicionarDia,
  DataInclusaoNormal,
  EventoEspecifico,
  OutroMotivo,
  PeriodosInclusaoNormal,
} from "./componentes/InclusaoNormal";
import ModalDataPrioritaria from "components/Shareable/ModalDataPrioritaria";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { STATUS_DRE_A_VALIDAR } from "configs/constants";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import {
  validarSubmissaoNormal,
  validarSubmissaoContinua,
} from "components/InclusaoDeAlimentacao/Escola/Formulario/validacao";
import {
  formatarSubmissaoSolicitacaoContinua,
  formatarSubmissaoSolicitacaoNormal,
} from "components/InclusaoDeAlimentacao/helper";
import {
  DatasInclusaoContinua,
  Recorrencia,
  RecorrenciaTabela,
} from "./componentes/InclusaoContinua";
import {
  MotivoContinuoInterface,
  MotivoInterface,
  MotivoSimplesInterface,
  RascunhosInclusaoDeAlimentacaoContinuaInterface,
  RascunhosInclusaoDeAlimentacaoInterface,
  RascunhosInclusaoDeAlimentacaoNormalInterface,
  ValuesFormInclusaoDeAlimentacaoInterface,
} from "./interfaces";
import { FormApi } from "final-form";

export const InclusaoDeAlimentacao = ({ ...props }) => {
  const [rascunhos, setRascunhos] = useState<
    Array<RascunhosInclusaoDeAlimentacaoInterface> | undefined
  >(undefined);
  const [erroRascunhos, setErroRascunhos] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [motivoEspecifico, setMotivoEspecifico] = useState(false);
  const [carregandoRascunho, setCarregandoRascunho] = useState(false);
  const [uuid, setUuid] = useState<string | undefined>(undefined);
  const [idExterno, setIdExterno] = useState<string | undefined>(undefined);

  const {
    meusDados,
    motivosSimples,
    motivosContinuos,
    proximosDoisDiasUteis,
    proximosCincoDiasUteis,
    periodos,
    periodoNoite,
    periodosMotivoEspecifico,
  } = props;

  useEffect(() => {
    getRascunhos();
  }, []);

  const resetForm = (form: FormApi<any, Partial<any>>): void => {
    form.change("uuid", undefined);
    form.change("id_externo", undefined);
    form.change("inclusoes", [{ motivo: undefined }]);
    form.change("quantidades_periodo", undefined);
    form.change("dias_semana", undefined);
    form.change("tipos_alimentacao_selecionados", []);
    form.change("periodo_escolar");
    form.change("numero_alunos", undefined);
    setCarregandoRascunho(false);
    setUuid(undefined);
    setIdExterno(undefined);
  };

  const motivoSimplesSelecionado = (
    values: ValuesFormInclusaoDeAlimentacaoInterface
  ): boolean => {
    return (
      values.inclusoes &&
      values.inclusoes[0].motivo &&
      motivosSimples.find(
        (motivo: MotivoSimplesInterface) =>
          motivo.uuid === values.inclusoes[0].motivo
      )
    );
  };

  const motivoContinuoSelecionado = (
    values: ValuesFormInclusaoDeAlimentacaoInterface
  ): boolean => {
    return (
      values.inclusoes &&
      values.inclusoes[0].motivo &&
      motivosContinuos.find(
        (motivo: MotivoContinuoInterface) =>
          motivo.uuid === values.inclusoes[0].motivo
      )
    );
  };

  const motivoETECSelecionado = (
    values: ValuesFormInclusaoDeAlimentacaoInterface
  ): boolean => {
    return (
      values.inclusoes &&
      values.inclusoes[0].motivo &&
      motivosContinuos.find(
        (motivo: MotivoContinuoInterface) =>
          motivo.uuid === values.inclusoes[0].motivo
      ) &&
      motivosContinuos.find(
        (motivo: MotivoContinuoInterface) =>
          motivo.uuid === values.inclusoes[0].motivo
      ).nome === "ETEC"
    );
  };

  const outroMotivoSelecionado = (
    values: ValuesFormInclusaoDeAlimentacaoInterface,
    index: number
  ): boolean => {
    return (
      values.inclusoes &&
      values.inclusoes[index] &&
      values.inclusoes[index].motivo &&
      motivosSimples.find(
        (motivo: MotivoSimplesInterface) =>
          motivo.uuid === values.inclusoes[index].motivo
      ) &&
      motivosSimples
        .find(
          (motivo: MotivoSimplesInterface) =>
            motivo.uuid === values.inclusoes[index].motivo
        )
        .nome.includes("Outro")
    );
  };

  const eventoEspecificoSelecionado = (
    values: ValuesFormInclusaoDeAlimentacaoInterface,
    index: number
  ): boolean => {
    return (
      values.inclusoes &&
      values.inclusoes[index] &&
      values.inclusoes[index].motivo &&
      motivosSimples.find(
        (motivo: MotivoSimplesInterface) =>
          motivo.uuid === values.inclusoes[index].motivo
      ) &&
      motivosSimples
        .find(
          (motivo: MotivoSimplesInterface) =>
            motivo.uuid === values.inclusoes[index].motivo
        )
        .nome.includes("Evento Específico")
    );
  };

  const getRascunhos = async (): Promise<void> => {
    const responseRascunhosNormais =
      await obterMinhasSolicitacoesDeInclusaoDeAlimentacao(
        TIPO_SOLICITACAO.SOLICITACAO_NORMAL
      );
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

  const removerRascunho = async (
    id_externo: string,
    uuid: string,
    tipoSolicitacao:
      | TIPO_SOLICITACAO.SOLICITACAO_NORMAL
      | TIPO_SOLICITACAO.SOLICITACAO_CONTINUA,
    form: FormApi<any, Partial<any>>
  ): Promise<void> => {
    if (window.confirm("Deseja remover este rascunho?")) {
      const response = await escolaExcluirSolicitacaoDeInclusaoDeAlimentacao(
        uuid,
        tipoSolicitacao
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

  const carregarRascunho = async (
    form: FormApi<any, Partial<any>>,
    values: ValuesFormInclusaoDeAlimentacaoInterface,
    inclusao:
      | RascunhosInclusaoDeAlimentacaoNormalInterface
      | RascunhosInclusaoDeAlimentacaoContinuaInterface
  ): Promise<void> => {
    setCarregandoRascunho(true);
    setUuid(inclusao.uuid);
    setIdExterno(inclusao.id_externo);
    form.change("uuid", inclusao.uuid);
    form.change("id_externo", inclusao.id_externo);
    const inclusao_ = deepCopy(inclusao);
    if (inclusao_.inclusoes) {
      carregarRascunhoNormal(form, inclusao_);
    } else {
      carregarRascunhoContinuo(form, values, inclusao_);
    }
    setCarregandoRascunho(false);
  };

  const carregarRascunhoNormal = async (
    form: FormApi<any, Partial<any>>,
    inclusao_: any
  ): Promise<void> => {
    if (
      inclusao_.inclusoes &&
      inclusao_.inclusoes[0].motivo &&
      motivosSimples
        .find(
          (motivo: MotivoSimplesInterface) =>
            motivo.uuid === inclusao_.inclusoes[0].motivo.uuid
        )
        .nome.includes("Específico")
    ) {
      setMotivoEspecifico(true);
      form.change("quantidades_periodo", periodosMotivoEspecifico);
    } else {
      setMotivoEspecifico(false);
      form.change("quantidades_periodo", periodos);
    }
    inclusao_.inclusoes.forEach((i) => {
      i.motivo = i.motivo.uuid;
    });
    form.change("inclusoes", inclusao_.inclusoes);
    inclusao_.quantidades_periodo.forEach(async (qp: any) => {
      let index: number;
      if (
        inclusao_.inclusoes &&
        inclusao_.inclusoes[0].motivo &&
        motivosSimples
          .find(
            (motivo: MotivoSimplesInterface) =>
              motivo.uuid === inclusao_.inclusoes[0].motivo
          )
          .nome.includes("Específico")
      ) {
        setMotivoEspecifico(true);
        index = periodosMotivoEspecifico.findIndex(
          (qp_) => qp_.nome === qp.periodo_escolar.nome
        );
      } else {
        setMotivoEspecifico(false);
        index = periodos.findIndex(
          (qp_) => qp_.nome === qp.periodo_escolar.nome
        );
      }
      form.change(`quantidades_periodo[${index}].checked`, true);
      form.change(
        `quantidades_periodo[${index}].multiselect`,
        "multiselect-wrapper-enabled"
      );

      // TODO
      // console.log(qp.tipos_alimentacao.map((t) => t.uuid))

      if (usuarioEhEscolaCMCT()) {
        // carregar um single uuid OU se for refeição e sobremesa carregar o valor refeicao_e_sobremesa
      } else {
        form.change(
          `quantidades_periodo[${index}].tipos_alimentacao_selecionados`,
          qp.tipos_alimentacao.map((t) => t.uuid)
        );
      }
      form.change(
        `quantidades_periodo[${index}].numero_alunos`,
        qp.numero_alunos
      );
    });
  };

  const carregarRascunhoContinuo = async (
    form: FormApi<any, Partial<any>>,
    values: ValuesFormInclusaoDeAlimentacaoInterface,
    inclusao_: any
  ): Promise<void> => {
    const quantidades_periodo_ = deepCopy(inclusao_.quantidades_periodo);
    if (inclusao_.motivo.nome === "ETEC") {
      quantidades_periodo_.forEach((qp) => {
        qp.checked = true;
        qp.nome = qp.periodo_escolar.nome;
        qp.tipos_alimentacao_selecionados = qp.tipos_alimentacao.map(
          (t) => t.uuid
        );
        qp.tipos_alimentacao = qp.periodo_escolar.tipos_alimentacao.filter(
          (tipo_alimentacao) =>
            ["Lanche 4h", "Refeição", "Sobremesa"].includes(
              tipo_alimentacao.nome
            )
        );
        qp.periodo_escolar = qp.periodo_escolar.uuid;
      });
    } else {
      quantidades_periodo_.forEach((qp) => {
        qp.dias_semana = qp.dias_semana.map(String);
        qp.periodo_escolar = qp.periodo_escolar.uuid;
        qp.tipos_alimentacao = qp.tipos_alimentacao.map((t) => t.uuid);
        delete qp.grupo_inclusao_normal;
        delete qp.inclusao_alimentacao_continua;
      });
    }

    form.change("inclusoes", [
      {
        motivo: inclusao_.motivo.uuid,
        data_inicial: inclusao_.data_inicial,
        data_final: inclusao_.data_final,
      },
    ]);
    form.change("quantidades_periodo", quantidades_periodo_);
  };

  const refresh = (form: FormApi<any, Partial<any>>): void => {
    getRascunhos();
    resetForm(form);
  };

  const iniciarPedido = async (
    uuid: string,
    tipoInclusao:
      | TIPO_SOLICITACAO.SOLICITACAO_NORMAL
      | TIPO_SOLICITACAO.SOLICITACAO_CONTINUA,
    form: FormApi<any, Partial<any>>
  ): Promise<void> => {
    const response = await iniciaFluxoInclusaoAlimentacao(uuid, tipoInclusao);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Inclusão de Alimentação enviada com sucesso!");
      refresh(form);
    } else {
      toastError(getError(response.data));
    }
  };

  const ehMotivoInclusaoEspecifico = (
    values: ValuesFormInclusaoDeAlimentacaoInterface
  ): boolean => {
    const motivos = motivoContinuoSelecionado(values)
      ? motivosContinuos
      : motivosSimples;
    return (
      values.inclusoes &&
      values.inclusoes[0].motivo &&
      motivos
        .find(
          (motivo: MotivoInterface) =>
            motivo.uuid === values.inclusoes[0].motivo
        )
        .nome.includes("Específico")
    );
  };

  const onSubmit = async (
    values: ValuesFormInclusaoDeAlimentacaoInterface,
    form: FormApi<any, Partial<any>>
  ): Promise<void> => {
    const ehMotivoEspecifico = ehMotivoInclusaoEspecifico(values);
    const values_ = deepCopy(values);
    const tipoSolicitacao = motivoSimplesSelecionado(values)
      ? TIPO_SOLICITACAO.SOLICITACAO_NORMAL
      : TIPO_SOLICITACAO.SOLICITACAO_CONTINUA;
    const erro =
      tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL
        ? validarSubmissaoNormal(values, meusDados, ehMotivoEspecifico)
        : validarSubmissaoContinua(values, meusDados, ehMotivoEspecifico);
    if (erro) {
      toastError(erro);
      return;
    }
    if (!uuid) {
      const response = await createInclusaoAlimentacao(
        tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL
          ? formatarSubmissaoSolicitacaoNormal(values_)
          : motivoETECSelecionado(values)
          ? formatarSubmissaoSolicitacaoNormal(
              formatarSubmissaoSolicitacaoContinua(values_)
            )
          : formatarSubmissaoSolicitacaoContinua(values_),
        tipoSolicitacao
      );
      if (response.status === HTTP_STATUS.CREATED) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, tipoSolicitacao, form);
        } else {
          toastSuccess("Solicitação Rascunho criada com sucesso!");
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    } else {
      const response = await updateInclusaoAlimentacao(
        uuid,
        tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL
          ? formatarSubmissaoSolicitacaoNormal(values_)
          : motivoETECSelecionado(values)
          ? formatarSubmissaoSolicitacaoNormal(
              formatarSubmissaoSolicitacaoContinua(values_)
            )
          : formatarSubmissaoSolicitacaoContinua(values_),
        tipoSolicitacao
      );
      if (response.status === HTTP_STATUS.OK) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(uuid, tipoSolicitacao, form);
        } else {
          toastSuccess("Rascunho atualizado com sucesso");
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    }
  };

  const onDataChanged = (value: string): void => {
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

  const checaMotivoInclusaoEspecifico = (
    values: ValuesFormInclusaoDeAlimentacaoInterface,
    form: FormApi<any, Partial<any>>,
    value: string
  ): void => {
    if (
      (ehMotivoInclusaoEspecifico(values) && !carregandoRascunho) ||
      (motivosSimples
        .find((motivo: MotivoSimplesInterface) => motivo.uuid === value)
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
          <form
            onSubmit={handleSubmit}
            data-testid="formulario-inclusao-alimentacao"
          >
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
              {uuid ? `Solicitação # ${idExterno}` : "Nova Solicitação"}
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
                                  ? motivoEspecifico
                                    ? agregarDefault(motivosSimples).filter(
                                        (motivo: MotivoSimplesInterface) =>
                                          motivo.nome.includes("Selecione") ||
                                          motivo.nome.includes("Específico")
                                      )
                                    : agregarDefault(motivosSimples).filter(
                                        (motivo: MotivoSimplesInterface) =>
                                          !motivo.nome.includes("Específico")
                                      )
                                  : agregarDefault(motivosSimples).concat(
                                      motivosContinuos
                                    )
                              }
                              required
                              validate={required}
                              naoDesabilitarPrimeiraOpcao
                              onChangeEffect={async (
                                e: ChangeEvent<HTMLInputElement>
                              ) => {
                                const value = e.target.value;
                                const values_ = form.getState().values;
                                if (value) {
                                  if (
                                    motivosSimples.find(
                                      (motivo: MotivoSimplesInterface) =>
                                        motivo.uuid === value
                                    )
                                  ) {
                                    form.change(
                                      "quantidades_periodo",
                                      undefined
                                    );
                                    form.change("reload", !values_.reload);
                                    await checaMotivoInclusaoEspecifico(
                                      values_,
                                      form,
                                      value
                                    );
                                  } else if (
                                    motivosContinuos.find(
                                      (motivo: MotivoContinuoInterface) =>
                                        motivo.uuid === value
                                    ).nome === "ETEC"
                                  ) {
                                    form.change(
                                      "quantidades_periodo",
                                      undefined
                                    );
                                    form.change(
                                      "quantidades_periodo",
                                      periodoNoite
                                    );
                                    form.change("reload", !values_.reload);
                                  } else if (
                                    motivosContinuos.find(
                                      (motivo: MotivoContinuoInterface) =>
                                        motivo.uuid === value
                                    )
                                  ) {
                                    form.change("dias_semana", undefined);
                                    form.change(
                                      "tipos_alimentacao_selecionados",
                                      []
                                    );
                                    form.change("periodo_escolar", undefined);
                                    form.change("numero_alunos", undefined);
                                    form.change("observacao", undefined);
                                    form.change(
                                      "quantidades_periodo",
                                      undefined
                                    );
                                  } else {
                                    form.change(
                                      "quantidades_periodo",
                                      undefined
                                    );
                                  }
                                }
                                if (uuid && idExterno) {
                                  form.change("uuid", uuid);
                                  form.change("id_externo", idExterno);
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

                        {eventoEspecificoSelecionado(values, index) && (
                          <div className="mt-3">
                            <EventoEspecifico name={name} />
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
                      <PeriodosInclusaoNormal
                        form={form}
                        values={values}
                        periodos={
                          ehMotivoInclusaoEspecifico(values) ||
                          (carregandoRascunho && motivoEspecifico)
                            ? periodosMotivoEspecifico
                            : periodos
                        }
                        motivoEspecifico={motivoEspecifico}
                        uuid={uuid}
                        idExterno={idExterno}
                      />
                    )}
                  </>
                )}
                {motivoETECSelecionado(values) &&
                  values.quantidades_periodo &&
                  values.quantidades_periodo.length === periodoNoite.length && (
                    <PeriodosInclusaoNormal
                      form={form}
                      values={values}
                      periodos={periodoNoite}
                      ehETEC
                    />
                  )}
                {motivoContinuoSelecionado(values) &&
                  !motivoETECSelecionado(values) && (
                    <>
                      <Recorrencia
                        values={form.getState().values}
                        form={form}
                        periodos={
                          ehMotivoInclusaoEspecifico(form.getState().values) ||
                          (carregandoRascunho && motivoEspecifico)
                            ? periodosMotivoEspecifico
                            : periodos
                        }
                        push={push}
                        ehMotivoInclusaoEspecifico={ehMotivoInclusaoEspecifico(
                          form.getState().values
                        )}
                        uuid={uuid}
                        idExterno={idExterno}
                      />
                      {values.quantidades_periodo && (
                        <div className="mt-5">
                          <RecorrenciaTabela
                            values={values}
                            periodos={
                              ehMotivoInclusaoEspecifico(values) ||
                              (carregandoRascunho && motivoEspecifico)
                                ? periodosMotivoEspecifico
                                : periodos
                            }
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
                      texto={uuid ? "Atualizar rascunho" : "Salvar rascunho"}
                      dataTestId="botao-salvar-rascunho"
                      className="ms-3"
                      disabled={submitting}
                      type={BUTTON_TYPE.BUTTON}
                      onClick={async () => {
                        await handleSubmit(values);
                      }}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                    <Botao
                      texto="Enviar inclusão"
                      dataTestId="botao-enviar-inclusao"
                      type={BUTTON_TYPE.BUTTON}
                      disabled={
                        submitting ||
                        (values &&
                          motivoETECSelecionado(values) &&
                          values.quantidades_periodo &&
                          values.quantidades_periodo.some(
                            (q) =>
                              q.tipos_alimentacao_selecionados &&
                              !q.tipos_alimentacao_selecionados.length
                          ))
                      }
                      onClick={async () => {
                        values["status"] = STATUS_DRE_A_VALIDAR;
                        await handleSubmit(values);
                      }}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
                    />
                  </div>
                </div>
              </div>
            </div>
            {showModal && (
              <ModalDataPrioritaria
                showModal={showModal}
                closeModal={() => setShowModal(false)}
                dataTestId="botao-ok-modal-data-prioritaria"
              />
            )}
          </form>
        )}
      </Form>
    </div>
  );
};

export default InclusaoDeAlimentacao;
