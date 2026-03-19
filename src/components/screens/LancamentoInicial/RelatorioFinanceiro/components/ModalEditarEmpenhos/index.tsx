import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { toastSuccess } from "src/components/Shareable/Toast/dialogs";
import { required, requiredMultiselect } from "src/helpers/fieldValidators";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import InputText from "src/components/Shareable/Input/InputText";
import arrayMutators from "final-form-arrays";
import { DadosLiquidacaoEmpenho } from "src/interfaces/relatorio_financeiro.interface";

const DEFAULT_EMPENHO: DadosLiquidacaoEmpenho = {
  numero_empenho: "",
  tipo_empenho: "",
  unidades_educacionais: [],
};

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  empenhos?: DadosLiquidacaoEmpenho[];
};

const ModalEditarEmpenhos = ({ showModal, setShowModal, empenhos }: Props) => {
  const onSubmit = (values: {
    cadastros_empenho: DadosLiquidacaoEmpenho[];
  }) => {
    const payload = values?.cadastros_empenho ?? [];
    if (payload) toastSuccess("Empenhos cadastrados com sucesso");
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cadastro de Empenhos</Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={onSubmit}
        initialValues={{
          cadastros_empenho:
            empenhos?.length > 0 ? empenhos : [DEFAULT_EMPENHO],
        }}
        mutators={{
          ...arrayMutators,
        }}
        render={({ handleSubmit, submitting, values, form }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              {empenhos?.length === 0 && (
                <label>
                  Não encontramos empenhos cadastrados para este relatório
                  financeiro, para prosseguir é necessário relacionar ao menos
                  um empenho a este relatório.
                </label>
              )}

              <FieldArray name="cadastros_empenho">
                {({ fields }) => (
                  <>
                    {fields.map((name, index) => (
                      <div key={name}>
                        {fields.length > 1 && (
                          <div className="position-relative mb-3 mt-4">
                            <hr className="m-0" />
                            <div
                              style={{
                                position: "absolute",
                                right: 0,
                                top: "-14px",
                                background: "#fff",
                                paddingLeft: "8px",
                              }}
                            >
                              <Botao
                                icon={BUTTON_ICON.TRASH}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                                type={BUTTON_TYPE.BUTTON}
                                onClick={() => fields.remove(index)}
                              />
                            </div>
                          </div>
                        )}

                        <div className="row mt-2">
                          <div className="col-5">
                            <Field
                              name={`${name}.numero_empenho`}
                              label="Nº do Empenho"
                              component={InputText}
                              placeholder="Digite o Nº do empenho"
                              validate={required}
                              required
                              apenasNumeros
                            />
                          </div>

                          <div className="col-7">
                            <Field
                              name={`${name}.tipo_empenho`}
                              label="Tipo de Empenho"
                              component={InputText}
                              placeholder="Informe o tipo de empenho"
                              validate={required}
                              required
                            />
                          </div>
                        </div>

                        <div className="row mt-2">
                          <div className="col-12">
                            <Field
                              label="Unidades Educacionais para pagamento neste empenho"
                              component={MultiselectRaw}
                              validate={requiredMultiselect}
                              name={`${name}.unidades_educacionais`}
                              placeholder="Selecione as Unidades"
                              options={[]}
                              selected={
                                values.cadastros_empenho?.[index]
                                  ?.unidades_educacionais_selecionadas || []
                              }
                              onSelectedChanged={(values_: any) => {
                                form.change(
                                  `${name}.unidades_educacionais_selecionadas`,
                                  values_.map((v: any) => v.value),
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="row mt-4 justify-content-center">
                      <div className="col-auto">
                        <Botao
                          texto="Adicionar Empenho"
                          icon={BUTTON_ICON.PLUS}
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          onClick={() => fields.push(DEFAULT_EMPENHO)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </FieldArray>
            </Modal.Body>

            <Modal.Footer>
              <Botao
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ms-3"
                onClick={() => setShowModal(false)}
              />

              <Botao
                texto="Salvar Empenhos"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="ms-3"
                disabled={submitting}
              />
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};

export default ModalEditarEmpenhos;
