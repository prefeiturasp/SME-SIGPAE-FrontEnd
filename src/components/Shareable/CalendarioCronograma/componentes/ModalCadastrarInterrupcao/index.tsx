import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Spin } from "antd";
import { toastError, toastSuccess } from "../../../Toast/dialogs";
import Botao from "../../../Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "../../../Botao/constants";

import {
  getMotivosInterrupcao,
  cadastraInterrupcaoProgramada,
} from "../../../../../services/cronograma.service";

import {
  ModalCadastrarInterrupcaoProps,
  FormInterrupcaoValues,
  TIPO_CALENDARIO_OPTIONS,
  initialValues,
} from "./interfaces";

import "./style.scss";
import Select from "../../../Select";
import InputText from "../../../Input/InputText";
import { required as requiredValidator } from "../../../../../helpers/fieldValidators";

export const ModalCadastrarInterrupcao: React.FC<
  ModalCadastrarInterrupcaoProps
> = ({ showModal, closeModal, dataSelecionada, onSave }) => {
  const [carregando, setCarregando] = useState(false);
  const [opcoesMotivo, setOpcoesMotivo] = useState<
    { uuid: string; nome: string }[]
  >([]);
  const [carregandoMotivos, setCarregandoMotivos] = useState(false);

  useEffect(() => {
    const carregarMotivos = async () => {
      setCarregandoMotivos(true);
      try {
        const response = await getMotivosInterrupcao();
        if (response?.data) {
          const options = response.data.map(
            (item: { value: string; label: string }) => ({
              uuid: item.value,
              nome: item.label,
            }),
          );
          setOpcoesMotivo(options);
        }
      } catch {
        toastError("Erro ao carregar motivos de interrupção");
      } finally {
        setCarregandoMotivos(false);
      }
    };

    if (showModal) {
      carregarMotivos();
    }
  }, [showModal]);

  const formatarData = (data: Date): string => {
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  };

  const aoSubmeter = async (values: FormInterrupcaoValues) => {
    setCarregando(true);
    try {
      const payload = {
        data: format(dataSelecionada, "yyyy-MM-dd"),
        motivo: values.motivo,
        descricao_motivo: values.descricao_motivo || "",
        tipo_calendario: values.tipo_calendario,
      };

      await cadastraInterrupcaoProgramada(payload);
      toastSuccess("Interrupção programada cadastrada com sucesso!");
      onSave();
      closeModal();
    } catch (error) {
      const err = error as { response?: { data?: { data?: string[] } } };
      if (err.response?.data?.data) {
        toastError(err.response.data.data[0]);
      } else {
        toastError("Erro ao cadastrar interrupção programada");
      }
    } finally {
      setCarregando(false);
    }
  };

  const validar = (values: FormInterrupcaoValues) => {
    const errors: Partial<Record<keyof FormInterrupcaoValues, string>> = {};
    if (values.motivo === "OUTROS" && !values.descricao_motivo?.trim()) {
      errors.descricao_motivo =
        "Descrição é obrigatória quando motivo é 'Outros'";
    }
    return errors;
  };

  return (
    <Modal
      show={showModal}
      onHide={closeModal}
      centered
      className="modal-cadastrar-interrupcao"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">
          Interrupção Programada de Entregas
        </Modal.Title>
      </Modal.Header>

      <Form<FormInterrupcaoValues>
        onSubmit={aoSubmeter}
        initialValues={initialValues}
        validate={validar}
        render={({ handleSubmit, values, submitting, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <Spin spinning={carregandoMotivos} tip="Carregando...">
                <p className="modal-subtitle">
                  Cadastro de interrupção de entregas para o dia{" "}
                  <strong>{formatarData(dataSelecionada)}</strong>:
                </p>

                <div className="row">
                  <div className="col-12">
                    <Field
                      component={Select}
                      options={[
                        { uuid: "", nome: "Selecione o motivo da interrupção" },
                        ...opcoesMotivo,
                      ]}
                      label="Motivo da Interrupção"
                      name="motivo"
                      id="motivo"
                      required
                      validate={requiredValidator}
                      naoDesabilitarPrimeiraOpcao
                    />
                  </div>
                </div>

                {values.motivo === "OUTROS" && (
                  <div className="row mt-2">
                    <div className="col-12">
                      <Field
                        component={InputText}
                        label="Descrição do Motivo"
                        name="descricao_motivo"
                        id="descricao_motivo"
                        required
                        placeholder="Descreva o motivo da interrupção"
                        maxLength={500}
                      />
                    </div>
                  </div>
                )}

                <div className="row mt-2">
                  <div className="col-12">
                    <Field
                      component={Select}
                      options={TIPO_CALENDARIO_OPTIONS}
                      label="Tipo de Calendário"
                      name="tipo_calendario"
                      id="tipo_calendario"
                      required
                      validate={requiredValidator}
                      naoDesabilitarPrimeiraOpcao
                    />
                  </div>
                </div>
              </Spin>
            </Modal.Body>

            <Modal.Footer>
              <Botao
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="btn-cancelar"
                onClick={closeModal}
                disabled={carregando}
              />
              <Botao
                texto="Cadastrar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="btn-cadastrar"
                disabled={submitting || invalid || carregando}
              />
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};

export default ModalCadastrarInterrupcao;
