import { Spin } from "antd";
import arrayMutators from "final-form-arrays";
import moment from "moment";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import Weekly from "src/components/Shareable/Weekly/Weekly";
import { toastSuccess } from "src/components/Shareable/Toast/dialogs";
import { required, requiredMultiselect } from "src/helpers/fieldValidators";
import { TabelaUnidades } from "./TabelaUnidades";
import { ModalAdicionarUnidadeEducacional } from "./ModalAdicionarUnidadeEducacional";
// import { buildPayload, resetFormState, validateForm } from "../helper";

const PAGE_SIZE = 10;

type RecreioFeriasFormProps = {
  mode: "create" | "edit";
  initialValues: any;
  onSubmitApi: (_: any) => Promise<void>;
  onAfterSuccess?: () => void;
};

export const EscolaAbertaForm = ({
  mode,
  initialValues,
}: RecreioFeriasFormProps) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showModalAdicionar, setShowModalAdicionar] = useState(false);
  const [showModalRemover, setShowModalRemover] = useState(false);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | null>(
    null,
  );

  const onSubmit = () => {};
  const handleSubmitSave = () => {};

  const openRemoverModal = (id: string) => {
    setSelectedUnidadeId(id);
    setShowModalRemover(true);
  };

  const closeRemoverModal = () => {
    setSelectedUnidadeId(null);
    setShowModalRemover(false);
  };

  const confirmRemoverUnidade = (fields) => {
    if (!selectedUnidadeId) return;

    const indexToRemove = fields.value.findIndex(
      (u) => u.id === selectedUnidadeId,
    );

    if (indexToRemove > -1) {
      fields.remove(indexToRemove);
      toastSuccess("Unidade Educacional removida com sucesso!");
    }

    setSelectedUnidadeId(null);
    setShowModalRemover(false);
  };

  return (
    <Form
      // keepDirtyOnReinitialize
      onSubmit={onSubmit}
      // validate={validateForm}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      render={({ form, values }) => (
        <form onSubmit={handleSubmitSave}>
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
                  showMonthDropdown={true}
                  showYearDropdown={true}
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
                  showMonthDropdown={true}
                  showYearDropdown={true}
                />
              </div>
              <div className="dias-semana">
                <Field
                  component={Weekly}
                  name="recorrencias.dias_semana"
                  label="Repetir"
                  required
                  validate={requiredMultiselect}
                  dataTestId="weekly-dias-semana"
                  arrayDiasSemana={values.recorrencias?.dias_semana || []}
                  handleWeekly={(value: string) => {
                    const dias = values.recorrencias?.dias_semana || [];
                    const atualizado = dias.includes(value)
                      ? dias.filter((d: string) => d !== value)
                      : [...dias, value];
                    form.change("recorrencias.dias_semana", atualizado);
                  }}
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
                    editable={true}
                    fields={fields}
                    form={form}
                    page={page}
                    setPage={setPage}
                    pageSize={PAGE_SIZE}
                    openRemoverModal={openRemoverModal}
                    showModalRemover={showModalRemover}
                    closeRemoverModal={closeRemoverModal}
                    confirmRemover={() => confirmRemoverUnidade(fields)}
                    // participantes={participantes}
                  />
                </>
              )}
            </FieldArray>
          </Spin>

          <div className="row mt-4">
            <div className="col-12 text-end">
              {mode !== "create" && (
                <Botao
                  texto="Cancelar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="me-2"
                  onClick={() =>
                    navigate(
                      "/configuracoes/cadastros/recreio-nas-ferias-cadastrados",
                    )
                  }
                />
              )}
              <Botao
                texto={"Salvar Escola Aberta"}
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
