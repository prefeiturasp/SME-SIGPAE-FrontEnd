import { Spin } from "antd";
import arrayMutators from "final-form-arrays";
import moment from "moment";
import { useState } from "react";
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
import { required } from "src/helpers/fieldValidators";
import { cadastrarRecreioNasFerias } from "../../../../services/recreioFerias.service";
import { LinhaUnidade } from "./components/LinhaUnidade";
import { ModalAdicionarUnidadeEducacional } from "./components/ModalAdicionarUnidadeEducacional";
import { ModalRemoverUnidadeEducacional } from "./components/ModalRemoverUnidadeEducacional";
import { buildPayload, resetFormState, validateForm } from "./helper";
import "./style.scss";

const PAGE_SIZE = 10;

export const RecreioFerias = () => {
  const [showModalAdicionar, setShowModalAdicionar] = useState(false);
  const [showModalRemover, setShowModalRemover] = useState(false);
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [unidadesParticipantes, setUnidadesParticipantes] = useState([]);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);

  const toggleExpandir = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const confirmRemoverUnidade = (fields) => {
    if (!selectedUnidadeId) return;

    const indexToRemove = fields.value.findIndex(
      (u) => u.id === selectedUnidadeId
    );

    if (indexToRemove > -1) {
      fields.remove(indexToRemove);
      setUnidadesParticipantes((prev) =>
        prev.filter((u) => u.id !== selectedUnidadeId)
      );
      toastSuccess("Unidade Educacional removida com sucesso!");
    }

    setSelectedUnidadeId(null);
    setShowModalRemover(false);
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

  const attemptSave = (event, values, form, handleSubmit) => {
    event?.preventDefault();

    const unidades = values?.unidades_participantes || [];

    if (unidades.length === 0) {
      toastError(
        "Não é possível salvar o Recreio nas Férias sem Unidades Participantes. Adicione pelo menos uma unidade."
      );
      return;
    }

    const errors = validateForm(values);

    if (errors?.unidades_participantes) {
      const firstInvalidIndex =
        errors.unidades_participantes.findIndex(Boolean);

      if (firstInvalidIndex > -1) {
        setPage(Math.floor(firstInvalidIndex / PAGE_SIZE) + 1);
      }

      form.submit();
      return;
    }

    handleSubmit(event);
  };

  const getPaginatedIndices = () => {
    const currentPage = Math.min(
      Math.max(1, page),
      Math.ceil(unidadesParticipantes.length / PAGE_SIZE) || 1
    );
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return { startIndex, endIndex };
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
          mutators={{ ...arrayMutators }}
          initialValues={{ unidades_participantes: unidadesParticipantes }}
          render={({ handleSubmit, form, values }) => (
            <form onSubmit={(e) => attemptSave(e, values, form, handleSubmit)}>
              <div className="row">
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

              <Spin tip="Carregando..." spinning={false}>
                <FieldArray name="unidades_participantes">
                  {({ fields }) => {
                    const { startIndex, endIndex } = getPaginatedIndices();
                    const total = fields.value?.length || 0;

                    return (
                      <>
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
                              if (index < startIndex || index >= endIndex)
                                return null;

                              const participante = fields.value[index];

                              return (
                                <LinhaUnidade
                                  key={name}
                                  name={name}
                                  index={index}
                                  participante={participante}
                                  aberto={!!expandidos[participante.id]}
                                  toggleExpandir={toggleExpandir}
                                  openRemoverModal={openRemoverModal}
                                  fields={fields}
                                />
                              );
                            })}
                          </tbody>
                        </table>

                        <Paginacao
                          className="mt-3 mb-3"
                          current={page}
                          total={total}
                          showSizeChanger={false}
                          onChange={setPage}
                          pageSize={PAGE_SIZE}
                        />

                        <ModalRemoverUnidadeEducacional
                          showModal={showModalRemover}
                          closeModal={closeRemoverModal}
                          handleRemoverUnidade={() =>
                            confirmRemoverUnidade(fields)
                          }
                        />
                      </>
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
          )}
        />
      </div>
    </div>
  );
};
