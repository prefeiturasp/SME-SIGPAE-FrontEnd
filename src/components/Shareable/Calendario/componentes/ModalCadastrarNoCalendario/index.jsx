import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { MultiSelect } from "../../../MultiSelect";
import { getError } from "helpers/utilities";
import { requiredMultiselect } from "helpers/fieldValidators";
import { getDDMMYYYfromDate, getYYYYMMDDfromDate } from "configs/helper";
import "./style.scss";

export const ModalCadastrarNoCalendario = ({ ...props }) => {
  const {
    tiposUnidades,
    editais,
    event,
    showModal,
    closeModal,
    getObjetosAsync,
    setObjetoAsync,
    objetos,
    nomeObjetoNoCalendario,
    nomeObjetoNoCalendarioMinusculo,
  } = props;

  const [cadastrosSalvosNoDia, setCadastrosSalvosNoDia] = useState([]);

  useEffect(() => {
    const cadastros_sobremesa_doce = [];
    objetos
      .filter((obj) => obj.data === getDDMMYYYfromDate(event.start))
      .forEach((obj) =>
        cadastros_sobremesa_doce.push({
          editais: obj.editais_uuids,
          tipo_unidades: [obj.tipo_unidade.uuid],
        })
      );
    setCadastrosSalvosNoDia(cadastros_sobremesa_doce);
  }, [event.start]);

  const onSubmit = async (values) => {
    const payload = {
      cadastros_sobremesa_doce: values.cadastros_sobremesa_doce,
      data: getYYYYMMDDfromDate(event.start),
    };
    const response = await setObjetoAsync(payload);
    if (response.status === HTTP_STATUS.CREATED) {
      if (cadastrosSalvosNoDia.length === 0) {
        toastSuccess(`Dia de ${nomeObjetoNoCalendario} criado com sucesso`);
      } else {
        toastSuccess(`Dia de ${nomeObjetoNoCalendario} atualizado com sucesso`);
      }
      closeModal();
      getObjetosAsync();
    } else {
      toastError(getError(response.data));
    }
  };

  const DEFAULT_CADASTROS_SOBREMESA_DOCE = {
    editais: undefined,
    tipo_unidades: undefined,
  };

  return (
    <Modal
      dialogClassName="modal-cadastrar-sobremesa modal-50w"
      show={showModal}
    >
      <Form
        initialValues={{
          cadastros_sobremesa_doce: cadastrosSalvosNoDia.length
            ? cadastrosSalvosNoDia
            : [DEFAULT_CADASTROS_SOBREMESA_DOCE],
        }}
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
        }}
      >
        {({
          handleSubmit,
          form,
          submitting,
          values,
          form: {
            mutators: { push },
          },
        }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header>
              <Modal.Title>{`${
                cadastrosSalvosNoDia.length ? "Atualizar" : "Cadastrar"
              } dia de ${nomeObjetoNoCalendario}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <p>
                  Cadastro de {nomeObjetoNoCalendarioMinusculo} para o dia{" "}
                  <strong>{getDDMMYYYfromDate(event.start)}</strong>:
                </p>
              </div>
              <FieldArray name="cadastros_sobremesa_doce">
                {({ fields }) =>
                  fields.map((name, index) => (
                    <div key={name}>
                      <div className="row mb-3">
                        <div className="col-5">
                          <Field
                            component={MultiSelect}
                            name={`${name}.editais`}
                            selected={
                              (values.cadastros_sobremesa_doce &&
                                values.cadastros_sobremesa_doce[index]
                                  .editais) ||
                              []
                            }
                            options={editais.map((edital) => ({
                              label: edital.numero,
                              value: edital.uuid,
                            }))}
                            onSelectedChange={(values_) => {
                              form.change(`${name}.editais`, values_);
                            }}
                            overrideStrings={{
                              selectSomeItems: "Selecionar editais",
                              allItemsAreSelected:
                                "Todos os editais estão selecionados",
                              selectAll: "Todos",
                            }}
                            validate={requiredMultiselect}
                          />
                        </div>
                        <div className="col-5">
                          <Field
                            component={MultiSelect}
                            name={`${name}.tipo_unidades`}
                            selected={
                              (values.cadastros_sobremesa_doce &&
                                values.cadastros_sobremesa_doce[index]
                                  .tipo_unidades) ||
                              []
                            }
                            options={tiposUnidades.map((tipoUnidade) => ({
                              label: tipoUnidade.iniciais,
                              value: tipoUnidade.uuid,
                            }))}
                            onSelectedChange={(values_) => {
                              form.change(`${name}.tipo_unidades`, values_);
                            }}
                            overrideStrings={{
                              selectSomeItems: "Selecionar unidades",
                              allItemsAreSelected:
                                "Todos os tipos de unidade estão selecionados",
                              selectAll: "Todos",
                            }}
                            disabled={
                              !(
                                values.cadastros_sobremesa_doce &&
                                values.cadastros_sobremesa_doce[index].editais
                                  ?.length > 0
                              )
                            }
                            validate={requiredMultiselect}
                          />
                        </div>
                        <div className="col-2">
                          {index > 0 && (
                            <Botao
                              texto="Remover"
                              onClick={() =>
                                form.change(
                                  "cadastros_sobremesa_doce",
                                  values["cadastros_sobremesa_doce"].filter(
                                    (_, i) => i !== index
                                  )
                                )
                              }
                              icon={BUTTON_ICON.TRASH}
                              style={BUTTON_STYLE.RED_OUTLINE}
                              className="ms-3 botao-excluir"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </FieldArray>
              <div className="text-center">
                <Botao
                  texto="Adicionar"
                  onClick={() =>
                    push(
                      "cadastros_sobremesa_doce",
                      DEFAULT_CADASTROS_SOBREMESA_DOCE
                    )
                  }
                  icon={BUTTON_ICON.PLUS}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="botao-adicionar"
                />
              </div>
            </Modal.Body>
            <div className="footer">
              <Botao
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                onClick={closeModal}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ms-3"
              />
              <Botao
                texto={cadastrosSalvosNoDia.length ? "Atualizar" : "Cadastrar"}
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                disabled={submitting}
                className="ms-3"
              />
            </div>
          </form>
        )}
      </Form>
    </Modal>
  );
};
