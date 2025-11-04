import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import Select from "src/components/Shareable/Select";
import { required } from "src/helpers/fieldValidators";
import { getLotesAsync } from "src/services/lote.service";
import "../../style.scss";

interface ModalAdicionarUnidadeEducacionalInterface {
  showModal: boolean;
  closeModal: () => void;
  submitting: boolean;
}

export const ModalAdicionarUnidadeEducacional = ({
  showModal,
  closeModal,
  submitting,
}: ModalAdicionarUnidadeEducacionalInterface) => {
  const [lotes, setLotes] = useState([]);

  useEffect(() => {
    getLotesAsync(setLotes, "uuid", "nome");
  }, []);

  return (
    <Modal
      dialogClassName="modal-adicionar-unidades-educacionais"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-cadastro-edital">
          Adicionar Unidades Educacionais
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          keepDirtyOnReinitialize
          onSubmit={() => {}}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="w-50">
                  <Field
                    component={Select}
                    label="DREs/LOTE"
                    name="dres_lote"
                    options={[
                      {
                        nome: "Selecione a DRE/Lote",
                        uuid: "",
                      },
                    ].concat(lotes)}
                    required
                    validate={required}
                  />
                </div>
                <div className="w-50">
                  <Field
                    component={Select}
                    label="Tipos de Unidades"
                    name="tipos_unidades"
                    options={[
                      {
                        nome: "Selecione o Tipo de Unidade",
                        uuid: "",
                      },
                    ]}
                    required
                    validate={required}
                  />
                </div>
              </div>

              <div className="row">
                <Field
                  component={MultiselectRaw}
                  label="Unidades Educacionais"
                  name="unidades_educacionais"
                  selected={[]}
                  options={[
                    {
                      nome: "Selecione as Unidades Educacionais",
                      uuid: "",
                    },
                  ]}
                  required
                  validate={required}
                  disabled
                />
              </div>

              <div className="row">
                <div className="w-50">
                  <Field
                    component={Select}
                    label="Tipos de Alimentações para Inscritos"
                    name="tipos_alimentacao_inscritos"
                    options={[
                      {
                        nome: "Selecione os Tipos de Alimentações",
                        uuid: "",
                      },
                    ]}
                    required
                    validate={required}
                    disabled
                  />
                </div>
                <div className="w-50">
                  <Field
                    component={Select}
                    label="Tipos de Alimentações para Colaboradores"
                    name="tipos_alimentacao_colaboradores"
                    options={[
                      {
                        nome: "Selecione os Tipos de Alimentações",
                        uuid: "",
                      },
                    ]}
                    disabled
                  />
                </div>
              </div>
            </form>
          )}
        />
      </Modal.Body>

      <Modal.Footer>
        <Botao
          texto="Cancelar"
          type={BUTTON_TYPE.BUTTON}
          onClick={closeModal}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Adicionar"
          type={BUTTON_TYPE.BUTTON}
          disabled={submitting}
          onClick={() => {
            // onSubmit(values);
          }}
          style={BUTTON_STYLE.GREEN}
        />
      </Modal.Footer>
    </Modal>
  );
};
