import Botao from "components/Shareable/Botao";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { getDDMMYYYfromDate, getYYYYMMDDfromDate } from "configs/helper";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import "./style.scss";
import { setDiaSobremesaDoce } from "services/medicaoInicial/diaSobremesaDoce.service";
import HTTP_STATUS from "http-status-codes";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { getError } from "helpers/utilities";
import { useEffect } from "react";

export const ModalCadastrarSobremesa = ({ ...props }) => {
  const {
    tiposUnidades,
    event,
    showModal,
    closeModal,
    getDiasSobremesaDoceAsync,
    diasSobremesaDoce
  } = props;

  const [tipoUnidadesSalvoNoDia, setTipoUnidadesSalvoNoDia] = useState([]);

  useEffect(() => {
    setTipoUnidadesSalvoNoDia(
      diasSobremesaDoce
        .filter(
          diaSobremesa => diaSobremesa.data === getDDMMYYYfromDate(event.start)
        )
        .map(diaSobremesa => diaSobremesa.tipo_unidade.uuid)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.start]);

  const onSubmit = async values => {
    const payload = {
      tipo_unidades: values.tipo_unidades,
      data: getYYYYMMDDfromDate(event.start)
    };
    const response = await setDiaSobremesaDoce(payload);
    if (response.status === HTTP_STATUS.CREATED) {
      if (tipoUnidadesSalvoNoDia.length === 0) {
        toastSuccess("Dia de sobremesa criado com sucesso");
      } else {
        toastSuccess("Dia de sobremesa atualizado com sucesso");
      }
      closeModal();
      getDiasSobremesaDoceAsync();
    } else {
      toastError(getError(response.data));
    }
  };

  return (
    <Modal
      dialogClassName="modal-cadastrar-sobremesa modal-50w"
      show={showModal}
      onHide={closeModal}
    >
      <Form
        initialValues={{
          tipo_unidades: tipoUnidadesSalvoNoDia
        }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, form, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{`${
                tipoUnidadesSalvoNoDia.length ? "Atualizar" : "Cadastrar"
              } Sobremesa Doce`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Cadastro de sobremesa doce para o dia{" "}
                <strong>{getDDMMYYYfromDate(event.start)}</strong>, selecione o
                tipo de unidade:
              </p>
              <Field
                component={StatefulMultiSelect}
                name="tipo_unidades"
                selected={values.tipo_unidades || []}
                options={tiposUnidades.map(tipoUnidade => ({
                  label: tipoUnidade.iniciais,
                  value: tipoUnidade.uuid
                }))}
                onSelectedChanged={values_ => {
                  form.change("tipo_unidades", values_);
                }}
                overrideStrings={{
                  selectSomeItems: "Selecione",
                  allItemsAreSelected:
                    "Todos os tipos de unidade estão selecionados",
                  selectAll: "Todos"
                }}
              />
            </Modal.Body>
            <div className="footer">
              <Botao
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                onClick={closeModal}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ml-3"
              />
              <Botao
                texto={
                  tipoUnidadesSalvoNoDia.length ? "Atualizar" : "Cadastrar"
                }
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                disabled={submitting}
                className="ml-3"
              />
            </div>
          </form>
        )}
      </Form>
    </Modal>
  );
};
