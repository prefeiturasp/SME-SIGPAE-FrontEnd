import React, { useState, useEffect } from "react";
import { Field, Form } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import CardMatriculados from "components/Shareable/CardMatriculados";
import Select from "components/Shareable/Select";
import { InputComData } from "components/Shareable/DatePicker";
import CKEditorField from "components/Shareable/CKEditorField";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { toastSuccess, toastError } from "components/Shareable/Toast/dialogs";
import { TabelaFaixasCEMEI } from "./componentes/TabelaFaixasCEMEI";
import { Rascunhos } from "./componentes/Rascunhos";
import { ModalLancheEmergencial } from "./componentes/ModalLancheEmergencial";
import {
  agregarDefault,
  deepCopy,
  getError,
  getDataObj,
  fimDoCalendario,
  checaSeDataEstaEntre2e5DiasUteis,
} from "helpers/utilities";
import { formatarPayload, validarSubmit } from "./helpers";
import {
  composeValidators,
  ehDiaUtil,
  required,
} from "helpers/fieldValidators";
import { STATUS_DRE_A_VALIDAR } from "configs/constants";
import {
  createAlteracaoCardapioCEMEI,
  getAlteracaoCEMEIRascunhos,
  deleteAlteracaoAlimentacaoCEMEI,
  updateAlteracaoCardapioCEMEI,
  iniciaFluxoAlteracaoAlimentacaoCEMEI,
} from "services/alteracaoDeCardapio/escola.service";
import "./style.scss";
import ModalDataPrioritaria from "components/Shareable/ModalDataPrioritaria";
import { formataValues } from "components/AlteracaoDeCardapio/helper";

export const AlteracaoDeCardapioCEMEI = ({ ...props }) => {
  const {
    meusDados,
    motivos,
    periodos,
    vinculos,
    proximosDoisDiasUteis,
    proximosCincoDiasUteis,
    feriadosAno,
  } = props;

  useEffect(() => {
    getRascunhos();
  }, []);

  const [uuid, setUuid] = useState(null);
  const [rascunhos, setRascunhos] = useState(null);
  const [erroRascunhos, setErroRascunhos] = useState(false);
  const [desabilitarAlterarDia, setDesabilitarAlterarDia] = useState(false);
  const [desabilitarDeAte, setDesabilitarDeAte] = useState(false);
  const [maximo5DiasUteis, setMaximo5DiasUteis] = useState(false);
  const [showModalLancheEmergencial, setShowModalLancheEmergencial] =
    useState(false);
  const [showModalDataPrioritaria, setShowModalDataPrioritaria] =
    useState(false);
  const [alimentosCEI, setAlimentosCEI] = useState(
    vinculos.filter(
      (vinculo) => vinculo.tipo_unidade_escolar.iniciais === "CEI DIRET"
    )
  );
  const [substitutosCEI, setSubstitutosCEI] = useState(
    vinculos.filter(
      (vinculo) => vinculo.tipo_unidade_escolar.iniciais === "CEI DIRET"
    )
  );
  const [alimentosEMEI, setAlimentosEMEI] = useState(
    vinculos.filter(
      (vinculo) => vinculo.tipo_unidade_escolar.iniciais === "EMEI"
    )
  );
  const [substitutosEMEI, setSubstitutosEMEI] = useState(
    vinculos.filter(
      (vinculo) => vinculo.tipo_unidade_escolar.iniciais === "EMEI"
    )
  );

  const iniciarPedido = async (uuid, form) => {
    const response = await iniciaFluxoAlteracaoAlimentacaoCEMEI(uuid);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Alteração de Alimentação enviada com sucesso!");
      refresh(form);
    } else {
      toastError(getError(response.data));
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
      setShowModalDataPrioritaria(true);
    }
  };

  const ehMotivoRPL = (values) => {
    return (
      motivos.find(
        (motivo) => motivo.nome.toUpperCase() === "RPL - REFEIÇÃO POR LANCHE"
      ) &&
      motivos.find(
        (motivo) => motivo.nome.toUpperCase() === "RPL - REFEIÇÃO POR LANCHE"
      ).uuid === values.motivo
    );
  };

  const onSubmit = async (values, form) => {
    const values_ = deepCopy(values);
    const erro = validarSubmit(values_);
    if (erro) {
      toastError(erro);
      return;
    }
    const formatedValues = formatarPayload(values_, meusDados);
    if (!uuid) {
      const response = await createAlteracaoCardapioCEMEI(
        formataValues(formatedValues)
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
      const response = await updateAlteracaoCardapioCEMEI(
        uuid,
        formataValues(formatedValues)
      );
      if (response.status === HTTP_STATUS.OK) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(uuid, form);
        } else {
          toastSuccess("Rascunho atualizado com sucesso");
        }
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    }
  };

  const modificarOpcoesAlimentos = async (motivo) => {
    let _alimentosCEI = vinculos.filter(
      (v) => v.tipo_unidade_escolar.iniciais === "CEI DIRET"
    );
    let _substitutosCEI = vinculos.filter(
      (v) => v.tipo_unidade_escolar.iniciais === "CEI DIRET"
    );
    let _alimentosEMEI = vinculos.filter(
      (v) => v.tipo_unidade_escolar.iniciais === "EMEI"
    );
    let _substitutosEMEI = vinculos.filter(
      (v) => v.tipo_unidade_escolar.iniciais === "EMEI"
    );

    if (motivo) {
      switch (motivo.nome) {
        case "RPL - Refeição por Lanche":
          _alimentosCEI = _alimentosCEI.map((v) => {
            const taCEI = v.tipos_alimentacao.filter((ta) =>
              ["Refeição da tarde", "Almoço"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: taCEI,
            };
          });
          _substitutosCEI = _substitutosCEI.map((v) => {
            const subCEI = v.tipos_alimentacao.filter((ta) =>
              ["Lanche"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: subCEI,
            };
          });
          _alimentosEMEI = _alimentosEMEI.map((v) => {
            const taEMEI = v.tipos_alimentacao.filter((ta) =>
              ["Refeição", "Sobremesa"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: taEMEI,
            };
          });
          _substitutosEMEI = _substitutosEMEI.map((v) => {
            const subEMEI = v.tipos_alimentacao.filter((ta) =>
              ["Lanche"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: subEMEI,
            };
          });
          break;

        case "LPR - Lanche por Refeição":
          _alimentosCEI = _alimentosCEI.map((v) => {
            const taCEI = v.tipos_alimentacao.filter((ta) =>
              ["Lanche"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: taCEI,
            };
          });
          _substitutosCEI = _substitutosCEI.map((v) => {
            const subCEI = v.tipos_alimentacao.filter((ta) =>
              ["Refeição da tarde", "Almoço"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: subCEI,
            };
          });
          _alimentosEMEI = _alimentosEMEI.map((v) => {
            const taEMEI = v.tipos_alimentacao.filter((ta) =>
              ["Lanche"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: taEMEI,
            };
          });
          _substitutosEMEI = _substitutosEMEI.map((v) => {
            const subEMEI = v.tipos_alimentacao.filter((ta) =>
              ["Refeição", "Sobremesa"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: subEMEI,
            };
          });
          break;

        case "Lanche Emergencial":
          _alimentosEMEI = _alimentosEMEI.map((v) => {
            const taEMEI = v.tipos_alimentacao.filter(
              (ta) => !["Lanche Emergencial"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: taEMEI,
            };
          });
          _substitutosEMEI = _substitutosEMEI.map((v) => {
            const subEMEI = v.tipos_alimentacao.filter((ta) =>
              ["Lanche Emergencial"].includes(ta.nome)
            );
            return {
              ...v,
              tipos_alimentacao: subEMEI,
            };
          });
          break;

        default:
          break;
      }
    }
    setAlimentosCEI(_alimentosCEI);
    setAlimentosEMEI(_alimentosEMEI);
    setSubstitutosCEI(_substitutosCEI);
    setSubstitutosEMEI(_substitutosEMEI);
  };

  const buildSubstituicoes = async (periodos_, alteracao_) => {
    let substituicoes = [];
    periodos_.forEach((periodo, periodoIndice) => {
      const subsCEI = alteracao_.substituicoes_cemei_cei_periodo_escolar.find(
        (sub) => sub.periodo_escolar.nome === periodo.nome
      );
      const subsEMEI = alteracao_.substituicoes_cemei_emei_periodo_escolar.find(
        (sub) => sub.periodo_escolar.nome === periodo.nome
      );
      substituicoes[periodoIndice] = { checked: false };
      if (subsCEI) {
        substituicoes[periodoIndice] = { checked: true };
        substituicoes[periodoIndice]["periodo_uuid"] =
          subsCEI.periodo_escolar.uuid;
        substituicoes[periodoIndice]["cei"] = {
          tipos_alimentacao_de: subsCEI.tipos_alimentacao_de.map(
            (ta) => ta.uuid
          ),
          tipos_alimentacao_para: subsCEI.tipos_alimentacao_para.map(
            (ta) => ta.uuid
          ),
          faixas_etarias: [],
        };
        periodo.CEI.forEach((faixa, faixaIndice) => {
          substituicoes[periodoIndice]["cei"]["faixas_etarias"][faixaIndice] =
            {};
          const faixaRascunho = subsCEI.faixas_etarias.find(
            (f) => f.faixa_etaria.__str__ === faixa.faixa
          );
          if (faixaRascunho) {
            substituicoes[periodoIndice]["cei"]["faixas_etarias"][faixaIndice] =
              {
                faixa_uuid: faixaRascunho.faixa_etaria.uuid,
                quantidade_alunos: faixaRascunho.quantidade,
              };
          }
        });
      }
      if (subsEMEI) {
        substituicoes[periodoIndice]["checked"] = true;
        substituicoes[periodoIndice]["periodo_uuid"] =
          subsEMEI.periodo_escolar.uuid;
        substituicoes[periodoIndice]["emei"] = {};
        substituicoes[periodoIndice]["emei"]["tipos_alimentacao_de"] =
          subsEMEI.tipos_alimentacao_de.map((ta) => ta.uuid);
        substituicoes[periodoIndice]["emei"]["tipos_alimentacao_para"] =
          subsEMEI.tipos_alimentacao_para.map((ta) => ta.uuid);
        substituicoes[periodoIndice]["emei"]["quantitade_alunos"] =
          subsEMEI.qtd_alunos;
      }
    });
    return substituicoes;
  };

  const refresh = (form) => {
    getRascunhos();
    resetForm(form);
  };

  const getRascunhos = async () => {
    const response = await getAlteracaoCEMEIRascunhos();
    if (response.status === HTTP_STATUS.OK) {
      setRascunhos(response.data.results);
    } else {
      setErroRascunhos(true);
    }
  };

  const removerRascunho = async (id_externo, uuid, form) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      const response = await deleteAlteracaoAlimentacaoCEMEI(uuid);
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

  const carregarRascunhoNormal = async (form, alteracao_) => {
    const periodos_ = deepCopy(periodos);
    await form.change("uuid", alteracao_.uuid);
    await form.change("escola", alteracao_.escola.uuid);
    await form.change("motivo", alteracao_.motivo.uuid);
    await form.change("criado_por", alteracao_.criado_por);
    await form.change("alterar_dia", alteracao_.alterar_dia);
    await form.change("data_inicial", alteracao_.data_inicial);
    await form.change("data_final", alteracao_.data_final);
    await form.change("alunos_cei_e_ou_emei", alteracao_.alunos_cei_e_ou_emei);
    let substituicoes = await buildSubstituicoes(periodos_, alteracao_);
    await form.change("substituicoes", substituicoes);
    await form.change("observacao", alteracao_.observacao);
  };

  const carregarRascunho = async (form, alteracao) => {
    const alteracao_ = deepCopy(alteracao);
    await carregarRascunhoNormal(form, alteracao_);
    await form.change("id_externo", alteracao.id_externo);
    setUuid(alteracao.uuid);
  };

  const resetForm = async (form) => {
    await form.change("uuid", undefined);
    await form.change("criado_por", meusDados.uuid);
    await form.change("escola", meusDados.vinculo_atual.instituicao.uuid);
    await form.change("alunos_cei_e_ou_emei", undefined);
    await form.change("motivo", undefined);
    await form.change("alterar_dia", undefined);
    await form.change("data_inicial", undefined);
    await form.change("data_final", undefined);
    await form.change("substituicoes", []);
    await form.change("observacao", undefined);
    setUuid(null);
  };

  const limparCampos = async (motivo, form) => {
    await form.change("alterar_dia", undefined);
    await form.change("data_inicial", undefined);
    await form.change("data_final", undefined);
    if (motivo) {
      switch (motivo.nome) {
        case "RPL - Refeição por Lanche":
          setDesabilitarDeAte(true);
          setDesabilitarAlterarDia(false);
          break;

        case "LPR - Lanche por Refeição":
          setDesabilitarDeAte(true);
          setDesabilitarAlterarDia(false);
          break;

        case "Lanche Emergencial":
          setDesabilitarDeAte(false);
          setDesabilitarAlterarDia(false);
          setMaximo5DiasUteis(true);
          break;

        default:
          setDesabilitarDeAte(false);
          setDesabilitarAlterarDia(false);
          break;
      }
    }
    form.change("substituicoes", []);
    form.change("observacao", undefined);
  };

  const checarLancheCampoTipoAlteracao = async (values, motivo) => {
    values.alunos_cei_e_ou_emei &&
      values.alunos_cei_e_ou_emei !== "EMEI" &&
      motivo &&
      motivo.nome === "Lanche Emergencial" &&
      setShowModalLancheEmergencial(true);
  };

  const checarLancheCampoAlunos = async (values, value) => {
    value &&
      value !== "EMEI" &&
      values.motivo &&
      motivos.find((m) => m.uuid === values.motivo).nome ===
        "Lanche Emergencial" &&
      setShowModalLancheEmergencial(true);
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
          criado_por: meusDados.uuid,
          escola: meusDados.vinculo_atual.instituicao.uuid,
          substituicoes: [],
        }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, submitting, form, values }) => (
          <form onSubmit={handleSubmit}>
            {rascunhos && rascunhos.length > 0 && (
              <div className="mt-3">
                <span className="page-title">Rascunhos</span>
                <Rascunhos
                  rascunhosAlteracaoCardapio={rascunhos}
                  removerRascunho={removerRascunho}
                  carregarRascunho={carregarRascunho}
                  form={form}
                />
              </div>
            )}
            <div className="mt-2 page-title">
              {values.uuid
                ? `Solicitação # ${values.id_externo}`
                : "Nova Solicitação"}
            </div>
            <div className="card solicitation mt-2">
              <div className="card-body">
                <div className="card-title font-weight-bold">
                  Descrição da Alteração
                </div>
                <div className="row">
                  <div className="col-4">
                    <Field
                      component={Select}
                      label="Alunos"
                      name="alunos_cei_e_ou_emei"
                      options={[
                        { uuid: "", nome: "Selecione" },
                        { uuid: "TODOS", nome: "Todos" },
                        { uuid: "CEI", nome: "CEI" },
                        { uuid: "EMEI", nome: "EMEI" },
                      ]}
                      validate={required}
                      required
                    />
                    <OnChange name="alunos_cei_e_ou_emei">
                      {async (value) => checarLancheCampoAlunos(values, value)}
                    </OnChange>
                  </div>
                  <div className="col-8">
                    <Field
                      component={Select}
                      name="motivo"
                      label="Tipo de Alteração"
                      options={agregarDefault(motivos)}
                      naoDesabilitarPrimeiraOpcao
                      validate={required}
                      required
                    />
                    <OnChange name="motivo">
                      {async (value) => {
                        let motivo = motivos.find((m) => m.uuid === value);
                        modificarOpcoesAlimentos(motivo);
                        limparCampos(motivo, form);
                        checarLancheCampoTipoAlteracao(values, motivo);
                      }}
                    </OnChange>
                  </div>
                </div>
                <div className="row">
                  <div className="col-5">
                    <Field
                      component={InputComData}
                      name="alterar_dia"
                      minDate={
                        values.motivo &&
                        motivos.find((m) => m.uuid === values.motivo) &&
                        motivos.find((m) => m.uuid === values.motivo).nome ===
                          "Lanche Emergencial"
                          ? moment().toDate()
                          : proximosDoisDiasUteis
                      }
                      maxDate={fimDoCalendario()}
                      label="Alterar dia"
                      disabled={values.data_inicial || desabilitarAlterarDia}
                      validate={
                        values.data_inicial
                          ? ehDiaUtil(values, motivos, feriadosAno)
                          : composeValidators(
                              required,
                              ehDiaUtil(values, motivos, feriadosAno)
                            )
                      }
                      usarDirty={true}
                    />
                    <OnChange name="alterar_dia">
                      {(value) => {
                        if (value) {
                          onDataChanged(value);
                        }
                      }}
                    </OnChange>
                  </div>
                  <div className="col-1 text-center date-options">
                    <span>ou</span>
                  </div>
                  <div className="col-3">
                    <Field
                      component={InputComData}
                      name="data_inicial"
                      label="De"
                      disabled={values.alterar_dia || desabilitarDeAte}
                      minDate={
                        maximo5DiasUteis
                          ? moment().toDate()
                          : proximosDoisDiasUteis
                      }
                      maxDate={fimDoCalendario()}
                    />
                    <OnChange name="data_inicial">
                      {(value) => {
                        if (value) {
                          onDataChanged(value);
                        }
                      }}
                    </OnChange>
                  </div>
                  <div className="col-3">
                    <Field
                      component={InputComData}
                      name="data_final"
                      label="Até"
                      disabled={
                        values.data_inicial === undefined ||
                        values.data_inicial === null ||
                        values.alterar_dia ||
                        desabilitarDeAte
                      }
                      minDate={
                        values.data_inicial && getDataObj(values.data_inicial)
                      }
                      maxDate={fimDoCalendario()}
                    />
                    <OnChange name="data_final">
                      {(value) => {
                        if (value) {
                          onDataChanged(value);
                        }
                      }}
                    </OnChange>
                  </div>
                </div>
                {periodos.map((periodo, periodoIndice) => {
                  return (
                    <TabelaFaixasCEMEI
                      key={periodoIndice}
                      values={values}
                      form={form}
                      periodo={periodo}
                      periodoIndice={periodoIndice}
                      vinculos={vinculos}
                      alimentosCEI={alimentosCEI}
                      alimentosEMEI={alimentosEMEI}
                      substitutosCEI={substitutosCEI}
                      substitutosEMEI={substitutosEMEI}
                      ehMotivoRPL={ehMotivoRPL}
                    />
                  );
                })}
                <div className="row mt-4">
                  <div className="col-12">
                    <Field
                      component={CKEditorField}
                      label="Motivo/Justificativa"
                      name="observacao"
                    />
                  </div>
                </div>
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
                        handleSubmit((values) => onSubmit(values, form));
                      }}
                      style={BUTTON_STYLE.GREEN}
                      className="ml-3"
                    />
                  </div>
                </div>
              </div>
            </div>
            <ModalLancheEmergencial
              closeModal={() => setShowModalLancheEmergencial(false)}
              showModal={showModalLancheEmergencial}
              form={form}
              resetForm={() => resetForm(form)}
            />
            <ModalDataPrioritaria
              showModal={showModalDataPrioritaria}
              closeModal={() => setShowModalDataPrioritaria(false)}
            />
          </form>
        )}
      </Form>
    </div>
  );
};

export default AlteracaoDeCardapioCEMEI;
