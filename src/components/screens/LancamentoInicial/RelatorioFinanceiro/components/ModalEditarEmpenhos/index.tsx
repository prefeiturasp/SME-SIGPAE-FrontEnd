import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import {
  DadosLiquidacaoEmpenho,
  Escola,
} from "src/interfaces/relatorio_financeiro.interface";
import { cadastroDadosEmpenho } from "src/services/medicaoInicial/relatorioFinanceiro.service";
import { useEffect, useMemo, useState } from "react";
import { getEscolasParaFiltros } from "src/services/escola.service";
import InputText from "src/components/Shareable/Input/InputText";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";

const DEFAULT_EMPENHO: DadosLiquidacaoEmpenho = {
  numero_empenho: "",
  tipo_empenho: "",
  unidades_educacionais: [],
};

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  empenhos?: DadosLiquidacaoEmpenho[];
  lote: string;
  relatorioFinanceiro: string;
  onSave?: () => void;
  tiposUnidades: string[];
};

const ModalEditarEmpenhos = ({
  showModal,
  setShowModal,
  empenhos,
  lote,
  relatorioFinanceiro,
  onSave,
  tiposUnidades,
}: Props) => {
  const [unidadesEducacionais, setUnidadesEducacionais] = useState([]);

  const unidadesUuid = useMemo(
    () => tiposUnidades.join(","),
    [JSON.stringify(tiposUnidades)],
  );

  const onSubmit = async (values: {
    cadastros_empenho: DadosLiquidacaoEmpenho[];
  }) => {
    const payload = values?.cadastros_empenho ?? [];
    const response = await cadastroDadosEmpenho(payload, relatorioFinanceiro);

    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Empenhos registrados com sucesso");
      if (typeof onSave === "function") onSave();
      setShowModal(false);
    } else {
      toastError("Falha ao registrar empenhos.");
    }
  };

  const getEscolasAsync = async (): Promise<void> => {
    const response = await getEscolasParaFiltros({
      lote__uid: lote,
      tipo_unidade__uuid__in: unidadesUuid,
    });

    if (response.status === HTTP_STATUS.OK) {
      setUnidadesEducacionais(
        response.data.map((escola: Escola) => ({
          label: escola.nome,
          value: escola.uuid,
        })),
      );
    }
  };

  useEffect(() => {
    if (!lote || !unidadesUuid) return;
    getEscolasAsync();
  }, [lote, unidadesUuid]);

  const initialValues = useMemo(() => {
    return {
      cadastros_empenho:
        empenhos?.length > 0
          ? empenhos.map((empenho) => ({
              ...empenho,
              unidades_educacionais: empenho.unidades_educacionais.map(
                ({ uuid }) => uuid,
              ),
            }))
          : [DEFAULT_EMPENHO],
    };
  }, [empenhos]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cadastro de Empenhos</Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        mutators={{ ...arrayMutators }}
        render={({ handleSubmit, submitting, values, form }) => {
          return (
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
                                  dataTestId={`botao_remover_${index}`}
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
                                dataTestId={`numero_empenho_${index}`}
                                name={`${name}.numero_empenho`}
                                label="Nº do Empenho"
                                component={InputText}
                                placeholder="Digite o Nº do empenho"
                                validate={required}
                                required
                              />
                            </div>

                            <div className="col-7">
                              <Field
                                dataTestId={`tipo_empenho_${index}`}
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
                                dataTestId={`unidades_educacionais_${index}`}
                                label="Unidades Educacionais para pagamento neste empenho"
                                component={MultiselectRaw}
                                name={`${name}.unidades_educacionais`}
                                placeholder="Selecione as Unidades"
                                options={unidadesEducacionais}
                                selected={
                                  values.cadastros_empenho?.[index]
                                    ?.unidades_educacionais || []
                                }
                                onSelectedChanged={(values_: any) => {
                                  form.change(
                                    `${name}.unidades_educacionais`,
                                    values_.map((v: any) => v.value),
                                  );
                                }}
                                required
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
                  dataTestId="botao-cancelar"
                  texto="Cancelar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="ms-3"
                  onClick={() => setShowModal(false)}
                />

                <Botao
                  dataTestId="botao-salvar"
                  texto="Salvar Empenhos"
                  type={BUTTON_TYPE.SUBMIT}
                  style={BUTTON_STYLE.GREEN}
                  className="ms-3"
                  disabled={submitting}
                />
              </Modal.Footer>
            </form>
          );
        }}
      />
    </Modal>
  );
};

export default ModalEditarEmpenhos;
