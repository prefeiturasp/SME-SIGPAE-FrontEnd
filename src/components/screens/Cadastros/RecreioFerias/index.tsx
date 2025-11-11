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
    } catch (error) {
      toastError("Erro ao criar:", error);
    }
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
          mutators={{
            ...arrayMutators,
          }}
          initialValues={{
            unidades_participantes: unidadesParticipantes,
          }}
          render={({ handleSubmit, form, values }) => (
            <form onSubmit={(event) => handleSubmit(event, form)}>
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
                    // disabled={submitting}
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() => setShowModalAdicionar(true)}
                  />
                </div>
              </div>

              <Spin tip="Carregando..." spinning={false}>
                <FieldArray name="unidades_participantes">
                  {({ fields }) => (
                    <table className="tabela-unidades-participantes">
                      <thead>
                        <tr className="row">
                          <th className="col-1 text-center">DRE/LOTE</th>

                          <th className="col-3 text-center">
                            Unidade Educacional
                          </th>
                          <th className="col-2 text-center">
                            <span className="required-asterisk">*</span> Nº de
                            Inscritos
                          </th>
                          <th className="col-2 text-center">
                            <span className="required-asterisk">*</span> Nº de
                            Colaboradores
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
                                    {truncarString(unidadeEducacionalNome, 35)}
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
                                      !participante.liberarMedicao && "preto"
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
                                      participante.liberarMedicao ? "verde" : ""
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
                                      {participante.alimentacaoInscritosInfantil
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
                      <ModalRemoverUnidadeEducacional
                        showModal={showModalRemover}
                        closeModal={closeRemoverModal}
                        handleRemoverUnidade={() =>
                          confirmRemoverUnidade(fields)
                        }
                      />
                    </table>
                  )}
                </FieldArray>
              </Spin>

              <div className="row mt-4">
                <div className="col-12 text-end">
                  <Botao
                    texto="Salvar Recreio nas Férias"
                    // disabled={submitting}
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
          )}
        />
      </div>
    </div>
  );
};
