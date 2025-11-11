import { Spin, Switch, Tooltip } from "antd";
import arrayMutators from "final-form-arrays";
import moment from "moment";
import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import { Paginacao } from "src/components/Shareable/Paginacao";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { ToggleExpandir } from "src/components/Shareable/ToggleExpandir";
import { required } from "src/helpers/fieldValidators";
import { truncarString } from "src/helpers/utilities";
import { cadastrarRecreioNasFerias } from "../../../../services/recreioFerias.service";
import { ModalAdicionarUnidadeEducacional } from "./components/ModalAdicionarUnidadeEducacional";
import { ModalRemoverUnidadeEducacional } from "./components/ModalRemoverUnidadeEducacional";
import { buildPayload, resetFormState } from "./helper";
import "./style.scss";

export const RecreioFerias = () => {
  const [showModalAdicionar, setShowModalAdicionar] = useState<boolean>(false);
  const [showModalRemover, setShowModalRemover] = useState<boolean>(false);
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [unidadesParticipantes, setUnidadesParticipantes] = useState([]);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const toggleExpandir = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const confirmRemoverUnidade = (fields) => {
    if (selectedUnidadeId) {
      const indexToRemove = fields.value.findIndex(
        (u) => u.id === selectedUnidadeId
      );
      if (indexToRemove > -1) {
        fields.remove(indexToRemove);
      }
      setUnidadesParticipantes((prev) =>
        prev.filter((u) => u.id !== selectedUnidadeId)
      );
      setSelectedUnidadeId(null);
      setShowModalRemover(false);
      toastSuccess("Unidade Educacional removida com sucesso!");
    }
  };

  const openRemoverModal = (id: string) => {
    setSelectedUnidadeId(id);
    setShowModalRemover(true);
  };

  const closeRemoverModal = () => {
    setSelectedUnidadeId(null);
    setShowModalRemover(false);
  };

  const onSubmit = async (values: any, form: any) => {
    try {
      const payload = buildPayload(values);
      await cadastrarRecreioNasFerias(payload);

      toastSuccess("Recreio nas Férias cadastrado com sucesso!");
      resetFormState(form, setUnidadesParticipantes, setExpandidos);
      setPage(1);
    } catch (error) {
      toastError("Erro ao criar:", error);
    }
  };

  const validateForm = (values: any) => {
    const errors: any = {};
    const unidades = values?.unidades_participantes || [];
    if (unidades.length > 0) {
      const unidadesErrors = unidades.map((u: any) => {
        const e: any = {};
        if (!u?.num_inscritos || Number(u.num_inscritos) <= 0) {
          e.num_inscritos = "Informe o nº de inscritos (maior que 0)";
        }
        if (!u?.num_colaboradores || Number(u.num_colaboradores) <= 0) {
          e.num_colaboradores = "Informe o nº de colaboradores (maior que 0)";
        }
        return Object.keys(e).length ? e : undefined;
      });

      if (unidadesErrors.some(Boolean)) {
        errors.unidades_participantes = unidadesErrors;
      }
    }
    return errors;
  };

  return (
    <div className="card recreio-nas-ferias-container">
      <div className="card-body">
        <div className="row mt-3 mb-3">
          <div className="col-6">
            <div className="title">Informe o Período do Recreio nas Férias</div>
          </div>
        </div>

        <Form
          keepDirtyOnReinitialize
          onSubmit={onSubmit}
          validate={validateForm}
          mutators={{
            ...arrayMutators,
          }}
          initialValues={{
            unidades_participantes: unidadesParticipantes,
          }}
          render={({ handleSubmit, form, values }) => {
            const attemptSave = (event) => {
              event && event.preventDefault();
              const errors = validateForm(values);
              if (errors && errors.unidades_participantes) {
                const firstInvalidIndex =
                  errors.unidades_participantes.findIndex(Boolean);
                if (firstInvalidIndex > -1) {
                  const targetPage =
                    Math.floor(firstInvalidIndex / pageSize) + 1;
                  setPage(targetPage);
                }
                form.submit();
                return;
              }
              handleSubmit(event);
            };

            return (
              <form onSubmit={attemptSave}>
                <div className="row">
                  <div className="">
                    <Field
                      component={InputText}
                      label="Título"
                      name="titulo_cadastro"
                      placeholder="Título para o cadastro (ex. Recreio nas Férias - JAN 2026)"
                      required
                      validate={required}
                      max={50}
                    />
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="row">
                    <div className="calendario">
                      <Field
                        component={InputComData}
                        label="Período de Realização"
                        name="periodo_realizacao_de"
                        placeholder="De"
                        writable={false}
                        minDate={null}
                        maxDate={moment(
                          values.periodo_realizacao_ate,
                          "DD/MM/YYYY"
                        )}
                        required
                        validate={required}
                      />
                    </div>
                    <div className="calendario">
                      <Field
                        component={InputComData}
                        label="&nbsp;"
                        name="periodo_realizacao_ate"
                        placeholder="Até"
                        writable={false}
                        minDate={moment(
                          values.periodo_realizacao_de,
                          "DD/MM/YYYY"
                        )}
                        maxDate={null}
                      />
                    </div>
                  </div>

                  <div className="space-between mb-2 mt-4">
                    <span className="title">
                      Unidades Participantes: {unidadesParticipantes.length}
                    </span>
                    <Botao
                      className="text-end"
                      texto="+ Adicionar Unidades"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      onClick={() => setShowModalAdicionar(true)}
                    />
                  </div>
                </div>

                <Spin tip="Carregando..." spinning={false}>
                  <FieldArray name="unidades_participantes">
                    {({ fields }) => {
                      const pageSize = 10;
                      const total = (fields.value && fields.value.length) || 0;
                      const totalPages = Math.max(
                        1,
                        Math.ceil(total / pageSize)
                      );
                      const currentPage = Math.min(
                        Math.max(1, page),
                        totalPages
                      );
                      const startIndex = (currentPage - 1) * pageSize;
                      const endIndex = startIndex + pageSize;

                      return (
                        <table className="tabela-unidades-participantes">
                          <thead>
                            <tr className="row">
                              <th className="col-1 text-center">DRE/LOTE</th>

                              <th className="col-3 text-center">
                                Unidade Educacional
                              </th>
                              <th className="col-2 text-center">
                                <span className="required-asterisk">*</span> Nº
                                de Inscritos
                              </th>
                              <th className="col-2 text-center">
                                <span className="required-asterisk">*</span> Nº
                                de Colaboradores
                              </th>
                              <th className="col-2 text-center">
                                Liberar Medição?
                              </th>
                              <th className="action-column col-1 text-center"></th>
                              <th className="action-column col-1 text-center"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {fields.map((name, index) => {
                              if (index < startIndex || index >= endIndex) {
                                return null;
                              }

                              const participante = fields.value[index];
                              const aberto = !!expandidos[participante.id];
                              let unidadeEducacionalNome =
                                participante.unidadeEducacional;

                              if (participante.ceiOuEmei === "EMEI") {
                                unidadeEducacionalNome =
                                  unidadeEducacionalNome + " - INFANTIL";
                              } else if (participante.ceiOuEmei === "CEI") {
                                unidadeEducacionalNome =
                                  unidadeEducacionalNome + " - CEI";
                              }

                              return (
                                <React.Fragment key={`${name}`}>
                                  <tr className="row">
                                    <td className="col-1">
                                      {participante.dreLoteNome}
                                    </td>
                                    <td className="col-3">
                                      <Tooltip title={unidadeEducacionalNome}>
                                        {truncarString(
                                          unidadeEducacionalNome,
                                          35
                                        )}
                                      </Tooltip>
                                    </td>
                                    <td className="col-2">
                                      <Field
                                        component={InputText}
                                        name={`${name}.num_inscritos`}
                                        type="number"
                                        required
                                        validate={required}
                                      />
                                    </td>
                                    <td className="col-2">
                                      <Field
                                        component={InputText}
                                        name={`${name}.num_colaboradores`}
                                        type="number"
                                        required
                                        validate={required}
                                      />
                                    </td>
                                    <td className="col-2">
                                      {participante.liberarMedicao}
                                      <label
                                        className={`col-form-label ${
                                          !participante.liberarMedicao &&
                                          "preto"
                                        }`}
                                      >
                                        Não
                                      </label>
                                      <Switch
                                        size="small"
                                        className="mx-2"
                                        checked={!!participante.liberarMedicao}
                                        onChange={(checked) => {
                                          fields.update(index, {
                                            ...participante,
                                            liberarMedicao: checked,
                                          });
                                        }}
                                      />
                                      <label
                                        className={`col-form-label ${
                                          participante.liberarMedicao
                                            ? "verde"
                                            : ""
                                        }`}
                                      >
                                        Sim
                                      </label>
                                    </td>
                                    <td className="action-column col-1">
                                      <Tooltip title="Remover Unidade">
                                        <button
                                          type="button"
                                          className="excluir-botao verde"
                                          data-testid="remover-unidade-botao"
                                          onClick={() =>
                                            openRemoverModal(participante.id)
                                          }
                                        >
                                          <i className="fas fa-trash" />
                                        </button>
                                      </Tooltip>
                                    </td>
                                    <td className="action-column col-1">
                                      <ToggleExpandir
                                        ativo={aberto}
                                        onClick={() =>
                                          toggleExpandir(participante.id)
                                        }
                                        dataTestId={`toggle-${participante.id}`}
                                      />
                                    </td>
                                  </tr>
                                  <Collapse isOpened={aberto}>
                                    <div className="collapse-container">
                                      <div>
                                        <strong>
                                          Tipos de Alimentação Inscritos
                                          {participante
                                            .alimentacaoInscritosInfantil
                                            .length > 0 && " CEI"}
                                          :{" "}
                                        </strong>
                                        <span>
                                          {participante.alimentacaoInscritos?.join(
                                            ", "
                                          )}
                                        </span>
                                      </div>

                                      {participante.alimentacaoInscritosInfantil
                                        .length > 0 && (
                                        <div>
                                          <strong>
                                            Tipos de Alimentação Inscritos -
                                            INFANTIL:{" "}
                                          </strong>
                                          <span>
                                            {participante.alimentacaoInscritosInfantil?.join(
                                              ", "
                                            )}
                                          </span>
                                        </div>
                                      )}

                                      <div>
                                        <strong>
                                          Tipos de Alimentação Colaboradores:{" "}
                                        </strong>
                                        <span>
                                          {participante.alimentacaoColaboradores?.join(
                                            ", "
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </Collapse>
                                </React.Fragment>
                              );
                            })}
                          </tbody>

                          <Paginacao
                            className="mt-3 mb-3"
                            current={page}
                            total={total}
                            showSizeChanger={false}
                            onChange={(p) => setPage(p)}
                            pageSize={pageSize}
                          />

                          <ModalRemoverUnidadeEducacional
                            showModal={showModalRemover}
                            closeModal={closeRemoverModal}
                            handleRemoverUnidade={() =>
                              confirmRemoverUnidade(fields)
                            }
                          />
                        </table>
                      );
                    }}
                  </FieldArray>
                </Spin>

                <div className="row mt-4">
                  <div className="col-12 text-end">
                    <Botao
                      texto="Salvar Recreio nas Férias"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                    />
                  </div>
                </div>

                <ModalAdicionarUnidadeEducacional
                  showModal={showModalAdicionar}
                  closeModal={() => setShowModalAdicionar(false)}
                  submitting={false}
                  setUnidadesParticipantes={setUnidadesParticipantes}
                  unidadesParticipantes={unidadesParticipantes}
                />
              </form>
            );
          }}
        />
      </div>
    </div>
  );
};
