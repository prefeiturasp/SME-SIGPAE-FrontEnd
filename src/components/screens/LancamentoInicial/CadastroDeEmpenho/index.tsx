import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import {
  ContratoInterface,
  EmpenhoInterface,
  EmpenhoPayload,
} from "src/interfaces/empenhos.interface";
import {
  getContratosVigentes,
  cadastraEmpenho,
  getEmpenho,
  editaEmpenho,
} from "src/services/medicaoInicial/empenhos.service";
import { MEDICAO_INICIAL, EMPENHOS } from "src/configs/constants";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import {
  ASelect,
  AInput,
  AInputNumber,
} from "src/components/Shareable/MakeField";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { Select as SelectAntd, Spin } from "antd";
import { required } from "src/helpers/fieldValidators.jsx";
import { formataValorDecimal, parserValorDecimal } from "../../helper.jsx";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

type NovoEmpenho = {
  numero: string | null;
  contrato: string | null;
  edital: string | null;
  tipo_empenho: string | null;
  status: string | null;
  valor_total: number | null;
};

type Edital = {
  uuid: string;
  numero: string;
};

const VALORES_INICIAIS: EmpenhoInterface = {
  numero: null,
  contrato: null,
  edital: null,
  tipo_empenho: null,
  status: null,
  valor_total: null,
};

const OPCOES_STATUS = ["Ativo", "Inativo"];
const TIPOS_EMPENHOS = ["Principal", "Reajuste"];

export function CadastroDeEmpenho() {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState<ContratoInterface[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erroAPI, setErroAPI] = useState("");
  const [editais, setEditais] = useState<Edital[]>([]);
  const [valoresIniciais, setValoresInicias] =
    useState<EmpenhoInterface>(VALORES_INICIAIS);
  const [uuidEmpenho, setUuidEmpenho] = useState("");

  const getContratos = async () => {
    setCarregando(true);
    try {
      const { data } = await getContratosVigentes();

      setContratos(data.results);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar contratos vigentes. Tente novamente mais tarde. " +
          error.toString()
      );
    } finally {
      setCarregando(false);
    }
  };

  const getEmpenhoAsync = async (uuid: string) => {
    setCarregando(true);
    try {
      const { data } = await getEmpenho(uuid);

      setValoresInicias(data);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar dados do empenho. Tente novamente mais tarde. " +
          error.toString()
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    if (uuid) {
      setUuidEmpenho(uuid);
      getEmpenhoAsync(uuid);
    }
    getContratos();
  }, []);

  const cadastrarEmpenho = async (values: NovoEmpenho) => {
    setCarregando(true);
    try {
      const response = await cadastraEmpenho(values);
      if (response.status === 201 || response.status === 200) {
        toastSuccess("Empenho cadastrado com sucesso!");
        voltarPagina();
      } else {
        toastError(
          "Ocorreu um erro ao cadastrar o empenho. Tente novamente mais tarde."
        );
      }
    } catch (error) {
      toastError(
        "Ocorreu um erro ao cadastrar o empenho. Tente novamente mais tarde. " +
          error.toString()
      );
    } finally {
      setCarregando(false);
    }
  };

  const editarEmpenho = async (uuid: string, values: EmpenhoPayload) => {
    setCarregando(true);
    try {
      const payload = {
        tipo_empenho: values.tipo_empenho,
        status: values.status,
        valor_total: values.valor_total,
      };

      const response = await editaEmpenho(uuid, payload);

      if (response.status === 200) {
        toastSuccess("Empenho editado com sucesso!");
        voltarPagina();
      } else {
        toastError(
          "Ocorreu um erro ao editar o empenho. Tente novamente mais tarde."
        );
      }
    } catch (error) {
      toastError(
        "Ocorreu um erro ao editar o empenho. Tente novamente mais tarde." +
          error.toString()
      );
    } finally {
      setCarregando(false);
    }
  };

  const voltarPagina = () => navigate(`/${MEDICAO_INICIAL}/${EMPENHOS}`);

  return (
    <div className="cadastro-de-empenhos">
      {erroAPI && <div>{erroAPI}</div>}

      <Spin tip="Carregando..." spinning={carregando}>
        {!erroAPI && !carregando ? (
          <div className="card mt-3">
            <div className="card-body">
              <Form
                onSubmit={(values: NovoEmpenho) =>
                  uuidEmpenho
                    ? editarEmpenho(uuidEmpenho, values)
                    : cadastrarEmpenho(values)
                }
                initialValues={valoresIniciais}
                render={({ submitting, handleSubmit, form }) => {
                  const selecionaEdital = (value: string) => {
                    form.change("contrato", value);

                    const editais = contratos
                      .filter((contrato) => contrato.uuid === value)
                      .map((contrato) => contrato?.edital);

                    setEditais(editais);

                    form.change("edital", editais[0]?.uuid);
                  };

                  const selecionaTipoEmpenho = (value: string) => {
                    form.change("tipo_empenho", value);
                    form.change("valor_total", null);
                    form.change("status", null);
                  };

                  return (
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-4 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="numero"
                            label="Nº do Empenho"
                            placeholder="Digite o nº do empenho"
                            autoComplete="off"
                            component={AInput}
                            validate={required}
                            disabled={uuidEmpenho}
                          />
                        </div>

                        <div className="col-4 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="contrato"
                            label="Contrato"
                            component={ASelect}
                            showSearch
                            validate={required}
                            onChange={(value: string) => selecionaEdital(value)}
                            filterOption={(inputValue: string, option: any) =>
                              option.props.children
                                .toString()
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            }
                            disabled={uuidEmpenho}
                          >
                            <SelectAntd.Option value="">
                              Selecione um contrato
                            </SelectAntd.Option>

                            {contratos.map((contrato) => (
                              <SelectAntd.Option key={contrato.uuid}>
                                {contrato.numero}
                              </SelectAntd.Option>
                            ))}
                          </Field>
                        </div>

                        <div className="col-4 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="edital"
                            label="Edital"
                            component={ASelect}
                            validate={required}
                            disabled={true}
                          >
                            <SelectAntd.Option value="">
                              Nº do Edital
                            </SelectAntd.Option>

                            {editais.map((edital) => (
                              <SelectAntd.Option key={edital?.uuid}>
                                {edital?.numero}
                              </SelectAntd.Option>
                            ))}
                          </Field>
                        </div>

                        <div className="col-4 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="tipo_empenho"
                            label="Tipo de Empenho"
                            component={ASelect}
                            validate={required}
                            onChange={(value: string) =>
                              selecionaTipoEmpenho(value)
                            }
                          >
                            <SelectAntd.Option value="">
                              Selecione um tipo
                            </SelectAntd.Option>

                            {TIPOS_EMPENHOS.map((tipo) => (
                              <SelectAntd.Option key={tipo.toUpperCase()}>
                                {tipo}
                              </SelectAntd.Option>
                            ))}
                          </Field>
                        </div>

                        <div className="col-4 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="valor_total"
                            label="Valor Total do Empenho"
                            placeholder="Digite o valor do empenho"
                            prefix="R$"
                            component={AInputNumber}
                            min={0}
                            formatter={(value: string) =>
                              formataValorDecimal(value)
                            }
                            parser={(value: string) =>
                              parserValorDecimal(value)
                            }
                            validate={required}
                            style={{ width: "100%" }}
                          />
                        </div>

                        <div className="col-4 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="status"
                            label="Status"
                            component={ASelect}
                            validate={required}
                          >
                            <SelectAntd.Option value="">
                              Status
                            </SelectAntd.Option>

                            {OPCOES_STATUS.map((tipo) => (
                              <SelectAntd.Option key={tipo.toUpperCase()}>
                                {tipo}
                              </SelectAntd.Option>
                            ))}
                          </Field>
                        </div>
                      </div>
                      <div className="row justify-content-end">
                        <div className="col-4">
                          <Botao
                            texto="Salvar"
                            type={BUTTON_TYPE.SUBMIT}
                            style={BUTTON_STYLE.GREEN}
                            className="float-end ms-3"
                            disabled={submitting}
                          />
                          <Botao
                            texto="Cancelar"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            className="float-end ms-3"
                            onClick={() => voltarPagina()}
                          />
                        </div>
                      </div>
                    </form>
                  );
                }}
              />
            </div>
          </div>
        ) : null}
      </Spin>
    </div>
  );
}
