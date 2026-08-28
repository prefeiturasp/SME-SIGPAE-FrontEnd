import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { Field, Form } from "react-final-form";

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  onReabrir: (_unidades: string[]) => void;
  unidadesEducacionais: { label: string; value: string }[];
};

const ModalReabrirLancamentos = ({
  showModal,
  setShowModal,
  onReabrir,
  unidadesEducacionais,
}: Props) => {
  return (
    <>
      {showModal && <div className="modal-backdrop show" />}

      <Form
        onSubmit={() => {}}
        initialValues={{
          unidades_educacionais: [],
        }}
        render={({ values, form }) => (
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>Reabrir Lançamentos do Grupo</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <label className="mt-2">
                As medições deste grupo já foram aprovadas, ao reabrir o
                lançamento será possível solicitar novas correções às Unidades
                Educacionais e revisar os lançamentos.
              </label>

              <div className="row mt-2">
                <div className="col-12">
                  <Field
                    dataTestId="unidades_educacionais"
                    label="Selecione as unidades em que será possível solicitar correções:"
                    component={MultiselectRaw}
                    name="unidades_educacionais"
                    placeholder="Selecione as Unidades"
                    options={unidadesEducacionais}
                    selected={values.unidades_educacionais}
                    onSelectedChanged={(values_: any[]) => {
                      form.change(
                        "unidades_educacionais",
                        values_.map((v: any) => v.value),
                      );
                    }}
                    required
                  />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Botao
                dataTestId="botao-nao"
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                onClick={() => setShowModal(false)}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ms-3"
              />

              <Botao
                texto="Reabrir"
                type={BUTTON_TYPE.BUTTON}
                onClick={() => onReabrir(values.unidades_educacionais)}
                style={BUTTON_STYLE.GREEN}
                className="ms-3"
              />
            </Modal.Footer>
          </Modal>
        )}
      />
    </>
  );
};

export default ModalReabrirLancamentos;
