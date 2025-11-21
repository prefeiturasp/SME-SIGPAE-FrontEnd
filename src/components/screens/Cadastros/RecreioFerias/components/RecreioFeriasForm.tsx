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
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import { buildPayload, resetFormState, validateForm } from "../helper";
import "../style.scss";
import { ModalAdicionarUnidadeEducacional } from "./ModalAdicionarUnidadeEducacional";
import { TabelaUnidades } from "./TabelaUnidades";

const PAGE_SIZE = 10;

type RecreioFeriasFormProps = {
  mode: "create" | "edit";
  initialValues: any;
  onSubmitApi: (_: any) => Promise<void>;
  onAfterSuccess?: () => void;
};

export const RecreioFeriasForm = ({
  mode,
  initialValues,
  onSubmitApi,
  onAfterSuccess,
}: RecreioFeriasFormProps) => {
  const [showModalAdicionar, setShowModalAdicionar] = useState(false);
  const [showModalRemover, setShowModalRemover] = useState(false);
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
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
      await onSubmitApi(payload);

      if (mode === "create") {
        toastSuccess("Recreio nas Férias cadastrado com sucesso!");
        resetFormState(form, setExpandidos);
        setPage(1);
      } else {
        toastSuccess("Recreio nas Férias atualizado com sucesso!");
        onAfterSuccess?.();
      }
    } catch (error) {
      toastError(
        mode === "create" ? "Erro ao criar:" : "Erro ao atualizar:",
        error
      );
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

  const tituloBotao =
    mode === "create" ? "Salvar Recreio nas Férias" : "Salvar Alterações";

  return (
    <Form
      keepDirtyOnReinitialize
      onSubmit={onSubmit}
      validate={validateForm}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
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
              max={200}
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
                  maxDate={moment(values.periodo_realizacao_ate, "DD/MM/YYYY")}
                  required
                  validate={required}
                />
              </div>
              <div className="calendario esconde-asterisco">
                <Field
                  component={InputComData}
                  label="&nbsp;"
                  name="periodo_realizacao_ate"
                  placeholder="Até"
                  writable={false}
                  minDate={moment(values.periodo_realizacao_de, "DD/MM/YYYY")}
                  maxDate={null}
                  required
                  validate={required}
                />
              </div>
            </div>
          </div>

          <div className="space-between mb-2 mt-4">
            <span className="title">
              Unidades Participantes:{" "}
              {values.unidades_participantes?.length ?? 0}
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
              {({ fields }) => (
                <>
                  <TabelaUnidades
                    editable={true} // aqui edição/liberação da lixeira
                    fields={fields}
                    form={form}
                    page={page}
                    setPage={setPage}
                    pageSize={PAGE_SIZE}
                    expandidos={expandidos}
                    toggleExpandir={toggleExpandir}
                    openRemoverModal={openRemoverModal}
                    showModalRemover={showModalRemover}
                    closeRemoverModal={closeRemoverModal}
                    confirmRemover={() => confirmRemoverUnidade(fields)}
                  />
                </>
              )}
            </FieldArray>
          </Spin>

          <div className="row mt-4">
            <div className="col-12 text-end">
              <Botao
                texto={tituloBotao}
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
              />
            </div>
          </div>

          <ModalAdicionarUnidadeEducacional
            showModal={showModalAdicionar}
            closeModal={() => setShowModalAdicionar(false)}
            submitting={false}
            form={form}
          />
        </form>
      )}
    />
  );
};
