import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { Modal } from "react-bootstrap";
import { lastDayOfMonth } from "date-fns";
import { InputComData } from "src/components/Shareable/DatePicker";
import Botao from "src/components/Shareable/Botao";
import { toastSuccess } from "src/components/Shareable/Toast/dialogs";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { required } from "src/helpers/fieldValidators";

export const ModalAlunoParcial = ({ ...props }) => {
  const {
    closeModal,
    showModal,
    onSubmit,
    mes,
    ano,
    setAlunosParcialAlterado,
    adicionarOuExcluir,
    dataAdicionado,
  } = props;
  const [dataAlunoParcial, setDataAlunoParcial] = useState(null);

  const onClickSim = async () => {
    if (dataAlunoParcial) {
      await onSubmit(dataAlunoParcial);
      toastSuccess(
        `Aluno ${
          adicionarOuExcluir === "Adicionar" ? "adicionado" : "removido"
        } com Sucesso!`
      );
      closeModal();
      setAlunosParcialAlterado(true);
    }
    setDataAlunoParcial(null);
  };

  return (
    <Modal
      dialogClassName="modal-dialog-centered modal-lg"
      show={showModal}
      onHide={() => {
        closeModal();
        setDataAlunoParcial(null);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {adicionarOuExcluir === "Adicionar"
            ? "Adicionar Aluno no Período Parcial"
            : "Excluir Aluno"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="col-12 my-3 p-0">
          {adicionarOuExcluir === "Adicionar"
            ? "A partir de qual data o aluno adicionado deve constar em período parcial?"
            : "A partir de qual data o aluno não deve mais constar no período parcial?"}
        </p>
        <Form
          onSubmit={() => {}}
          render={() => (
            <div className="col-4">
              <Field
                component={InputComData}
                name="data"
                placeholder="Selecione"
                inputOnChange={(value) => setDataAlunoParcial(value)}
                required
                validate={required}
                usarDirty={true}
                minDate={
                  adicionarOuExcluir === "Adicionar"
                    ? new Date(ano, mes - 1, 1)
                    : new Date(
                        ano,
                        mes - 1,
                        Number(dataAdicionado.substring(0, 2))
                      )
                }
                maxDate={
                  new Date(
                    ano,
                    mes - 1,
                    lastDayOfMonth(new Date(ano, mes - 1, 1)).getUTCDate()
                  )
                }
              />
            </div>
          )}
        />
        <div className="msg-rodape">
          <span className="required-asterisk">*</span>
          <label>
            {`Ao ${
              adicionarOuExcluir === "Adicionar" ? "adicionar" : "excluir"
            } alunos os lançamentos já realizados nos períodos INTEGRAL e PARCIAL serão perdidos.`}
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="col-12">
          <Botao
            className="float-end"
            texto={"Salvar"}
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            onClick={() => onClickSim()}
            disabled={!dataAlunoParcial}
          />
          <Botao
            className="float-end me-2"
            texto="Cancelar"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => {
              closeModal();
              setDataAlunoParcial(null);
            }}
            style={BUTTON_STYLE.GREEN_OUTLINE}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
