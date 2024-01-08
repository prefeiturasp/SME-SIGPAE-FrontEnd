import CardMatriculados from "components/Shareable/CardMatriculados";
import { InputComData } from "components/Shareable/DatePicker";
import InputText from "components/Shareable/Input/InputText";
import ModalDataPrioritaria from "components/Shareable/ModalDataPrioritaria";
import Select from "components/Shareable/Select";
import { maxLength, required } from "helpers/fieldValidators";
import {
  checaSeDataEstaEntre2e5DiasUteis,
  composeValidators,
  deepCopy,
  fimDoCalendario,
  getError,
} from "helpers/utilities";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import CKEditorField from "components/Shareable/CKEditorField";
import Botao from "components/Shareable/Botao";
import HTTP_STATUS from "http-status-codes";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { STATUS_DRE_A_VALIDAR } from "configs/constants";
import {
  createSolicitacaoKitLancheCEMEI,
  deleteSolicitacaoKitLancheCEMEI,
  getSolicitacaoKitLancheCEMEIRascunhos,
  iniciaFluxoSolicitacaoKitLancheCEMEI,
  updateSolicitacaoKitLancheCEMEI,
} from "services/kitLanche";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { Rascunhos } from "./componentes/Rascunhos";
import {
  AlunosDietaEspecial,
  Kits,
  QuantidadeAlunosEMEI,
  TabelaFaixasEtariasCEI,
  TempoPasseio,
} from "./componentes";
import { getAlunosPorFaixaEtariaNumaData } from "services/alteracaoDeCardapio";
import { formataSubmit, getNumeroTotalKits } from "./helpers";

export const SolicitacaoKitLancheCEMEI = ({ ...props }) => {
  const {
    meusDados,
    proximosDoisDiasUteis,
    proximosCincoDiasUteis,
    kits,
    alunosComDietaEspecial,
  } = props;

  const [rascunhos, setRascunhos] = useState(null);
  const [erroRascunhos, setErroRascunhos] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [faixasEtariasCEI, setFaixasEtariasCEI] = useState(null);

  useEffect(() => {
    getRascunhos();
  }, []);

  const getAlunosPorFaixaEtariaNumaDataAsync = async (data) => {
    const periodo =
      props.meusDados.vinculo_atual.instituicao.periodos_escolares.find(
        (p) => p.nome === "INTEGRAL"
      );
    const response = await getAlunosPorFaixaEtariaNumaData(
      periodo.uuid,
      data.split("/").reverse().join("-")
    );
    if (response.status === HTTP_STATUS.OK) {
      setFaixasEtariasCEI(response.data.results);
    } else {
      toastError("Faixas etárias indisponíveis");
    }
  };

  const onSubmit = async (values, form) => {
    const values_ = deepCopy(values);
    if (!values_.uuid) {
      const response = await createSolicitacaoKitLancheCEMEI(
        formataSubmit(values_, faixasEtariasCEI)
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
      const response = await updateSolicitacaoKitLancheCEMEI(
        values_.uuid,
        formataSubmit(values_, faixasEtariasCEI)
      );
      if (response.status === HTTP_STATUS.OK) {
        if (values_.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(values_.uuid, form);
        } else {
          toastSuccess("Rascunho atualizado com sucesso");
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    }
  };

  const iniciarPedido = async (uuid, form) => {
    const response = await iniciaFluxoSolicitacaoKitLancheCEMEI(uuid);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Solicitação de Kit Lanche enviada com sucesso!");
      refresh(form);
    } else {
      toastError(getError(response.data));
    }
  };

  const getRascunhos = async () => {
    const response = await getSolicitacaoKitLancheCEMEIRascunhos();
    if (response.status === HTTP_STATUS.OK) {
      setRascunhos(response.data.results);
    } else {
      setErroRascunhos(true);
    }
  };

  const removerRascunho = async (id_externo, uuid, form) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      const response = await deleteSolicitacaoKitLancheCEMEI(uuid);
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

  const buildFaixas = (form, solicitacao_kit_lanche) => {
    if (solicitacao_kit_lanche.solicitacao_cei) {
      const faixasQuantidades = {};
      solicitacao_kit_lanche.solicitacao_cei.faixas_quantidades.forEach(
        (faixa_quantidade) => {
          faixasQuantidades[faixa_quantidade.faixa_etaria.uuid] =
            faixa_quantidade.quantidade_alunos;
        }
      );
      form.change(`solicitacao_cei.faixas_quantidades`, faixasQuantidades);
    }
  };

  const carregarRascunho = async (form, values, solicitacao) => {
    //form.initialize(solicitacao);
    form.change("data", solicitacao.data);
    form.change("local", solicitacao.local);
    form.change("evento", solicitacao.evento);
    form.change("alunos_cei_e_ou_emei", solicitacao.alunos_cei_e_ou_emei);
    form.change("escola", solicitacao.escola);
    form.change("uuid", solicitacao.uuid);
    form.change("solicitacao_cei", solicitacao.solicitacao_cei || {});
    form.change("solicitacao_emei", solicitacao.solicitacao_emei || {});
    form.change("id_externo", solicitacao.id_externo);
    buildFaixas(form, solicitacao);
    form.change("observacao", solicitacao.observacao);
  };

  const refresh = (form) => {
    getRascunhos();
    resetForm(form);
  };

  const resetForm = (form) => {
    form.change("data", undefined);
    form.change("local", undefined);
    form.change("evento", undefined);
    form.change("alunos_cei_e_ou_emei", undefined);
    form.change("solicitacao_emei", {});
    form.change("solicitacao_cei", { faixas_quantidades: {} });
    form.change("observacao", undefined);
    form.change("id_externo", undefined);
    form.change("uuid", undefined);
    form.change("status", undefined);
  };

  const validaDiasUteis = (value) => {
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
        initialValues={{
          escola: meusDados.vinculo_atual.instituicao.uuid,
        }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, form, values, submitting }) => (
          <form onSubmit={handleSubmit}>
            {rascunhos && rascunhos.length > 0 && (
              <div className="mt-3">
                <span className="page-title">Rascunhos</span>
                <Rascunhos
                  rascunhosSolicitacoesKitLanche={rascunhos}
                  removerRascunho={removerRascunho}
                  carregarRascunho={carregarRascunho}
                  form={form}
                  values={values}
                />
              </div>
            )}
            <div className="mt-5 page-title">
              {values.uuid
                ? `Solicitação # ${values.id_externo}`
                : "Nova Solicitação"}
            </div>
            <div className="card solicitation periodos_cei_emei mt-2">
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-3">
                    <Field
                      component={InputComData}
                      label="Data do passeio"
                      name="data"
                      minDate={proximosDoisDiasUteis}
                      maxDate={fimDoCalendario()}
                      required
                      validate={required}
                    />
                    <OnChange name={`data`}>
                      {(value) => {
                        if (value) {
                          if (!values.solicitacao_cei) {
                            values.solicitacao_cei = {
                              faixas_quantidades: {},
                            };
                          }
                          if (!values.solicitacao_emei) {
                            values.solicitacao_emei = {};
                          }

                          validaDiasUteis(value);
                          getAlunosPorFaixaEtariaNumaDataAsync(value);
                        }
                      }}
                    </OnChange>
                  </div>
                  <div className="col-9">
                    <Field
                      component={InputText}
                      label="Local do passeio"
                      name="local"
                      required
                      validate={composeValidators(required, maxLength(160))}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <Field
                      component={Select}
                      disabled={!values.data}
                      label="Alunos"
                      name="alunos_cei_e_ou_emei"
                      options={[
                        { uuid: "", nome: "Selecione" },
                        { uuid: "TODOS", nome: "Todos" },
                        { uuid: "CEI", nome: "CEI" },
                        { uuid: "EMEI", nome: "EMEI" },
                      ]}
                      validate={required}
                    />
                  </div>
                  <div className="col-9">
                    <Field
                      component={InputText}
                      label="Evento/Atividade"
                      name="evento"
                      required
                      validate={required}
                    />
                  </div>
                </div>
                {["TODOS", "CEI"].includes(values.alunos_cei_e_ou_emei) && (
                  <>
                    <div className="alunos-label mt-3">Alunos CEI</div>
                    <TempoPasseio
                      name="solicitacao_cei.tempo_passeio"
                      nameKits="solicitacao_cei.kits"
                      form={form}
                    />
                    <Kits
                      name="solicitacao_cei.kits"
                      nameTempoPasseio="solicitacao_cei.tempo_passeio"
                      form={form}
                      kits={kits}
                      values={values}
                    />
                    {faixasEtariasCEI &&
                      values.solicitacao_cei.faixas_quantidades && (
                        <TabelaFaixasEtariasCEI
                          faixasEtariasCEI={faixasEtariasCEI}
                          values={values}
                        />
                      )}
                    <AlunosDietaEspecial
                      alunosComDietaEspecial={alunosComDietaEspecial.filter(
                        (aluno) =>
                          aluno.serie.includes("1") ||
                          aluno.serie.includes("2") ||
                          aluno.serie.includes("3") ||
                          aluno.serie.includes("4")
                      )}
                      solicitacao="solicitacao_cei"
                    />
                  </>
                )}
                {["TODOS", "EMEI"].includes(values.alunos_cei_e_ou_emei) && (
                  <>
                    <div className="alunos-label mt-3">Alunos EMEI</div>
                    <TempoPasseio
                      name="solicitacao_emei.tempo_passeio"
                      nameKits="solicitacao_emei.kits"
                      form={form}
                      ehEMEI
                    />
                    <Kits
                      name="solicitacao_emei.kits"
                      nameTempoPasseio="solicitacao_emei.tempo_passeio"
                      form={form}
                      kits={kits}
                      values={values}
                    />
                    <QuantidadeAlunosEMEI meusDados={meusDados} />
                    <AlunosDietaEspecial
                      alunosComDietaEspecial={alunosComDietaEspecial.filter(
                        (aluno) =>
                          !(
                            aluno.serie.includes("1") ||
                            aluno.serie.includes("2") ||
                            aluno.serie.includes("3") ||
                            aluno.serie.includes("4")
                          )
                      )}
                      solicitacao="solicitacao_emei"
                    />
                  </>
                )}
                <div className="label mt-5 mb-5">
                  Número total de kits: <b>{getNumeroTotalKits(values)}</b>
                </div>
                <Field
                  component={CKEditorField}
                  label="Observações"
                  name="observacao"
                  className="form-control"
                />
                <hr />
                <div className="row float-end mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Cancelar"
                      type="button"
                      onClick={() => resetForm(form)}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                    <Botao
                      texto={
                        values.uuid ? "Atualizar rascunho" : "Salvar rascunho"
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
