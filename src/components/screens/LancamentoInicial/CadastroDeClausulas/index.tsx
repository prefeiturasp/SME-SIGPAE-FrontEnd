import { Select as SelectAntd, Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  AInput,
  AInputNumber,
  ASelect,
} from "src/components/Shareable/MakeField";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  CLAUSULAS_PARA_DESCONTOS,
  MEDICAO_INICIAL,
} from "src/configs/constants";
import { required } from "src/helpers/fieldValidators";
import { getError } from "src/helpers/utilities";
import { ClausulaPayload } from "src/interfaces/clausulas_para_descontos.interface";
import { getNumerosEditais } from "src/services/edital.service";
import {
  cadastraClausulaParaDesconto,
  editaClausulaParaDesconto,
  getClausulaParaDesconto,
} from "src/services/medicaoInicial/clausulasParaDescontos.service";
import { formataValorDecimal, parserValorDecimal } from "../../helper.jsx";
import "./styles.scss";

const VALORES_INICIAIS: ClausulaPayload = {
  edital: null,
  numero_clausula: null,
  item_clausula: null,
  porcentagem_desconto: null,
  descricao: null,
};

type Edital = {
  uuid: string;
  numero: string;
};

export function CadastroDeClausulas() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [editais, setEditais] = useState<Edital[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erroAPI, setErroAPI] = useState("");
  const [valoresIniciais, setValoresInicias] =
    useState<ClausulaPayload>(VALORES_INICIAIS);

  const uuidClausula = searchParams.get("uuid");

  const getEditaisAsync = async () => {
    setCarregando(true);
    const response = await getNumerosEditais();
    if (response.status === HTTP_STATUS.OK) {
      setEditais(response.data.results);
    } else {
      setErroAPI("Erro ao carregar editais. Tente novamente mais tarde.");
    }
    setCarregando(false);
  };

  const cadastrarClausulaParaDesconto = async (values: ClausulaPayload) => {
    setCarregando(true);
    const response = await cadastraClausulaParaDesconto(values);
    if (response.status === HTTP_STATUS.CREATED) {
      toastSuccess("Cláusula cadastrada com sucesso!");
      voltarPagina();
    } else {
      toastError(getError(response.data));
    }
    setCarregando(false);
  };

  const editarClausulaParaDesconto = async (
    uuid: string,
    values: ClausulaPayload
  ) => {
    setCarregando(true);
    const response = await editaClausulaParaDesconto(uuid, values);
    if (response.status === HTTP_STATUS.OK) {
      await editaClausulaParaDesconto(uuid, values);
      toastSuccess("Cláusula atualizada com sucesso!");
      voltarPagina();
    } else {
      toastError(getError(response.data));
    }
    setCarregando(false);
  };

  const getClausulaParaDescontoAsync = async (uuid: string) => {
    setCarregando(true);
    const response = await getClausulaParaDesconto(uuid);
    if (response.status === HTTP_STATUS.OK) {
      const data = response.data;
      const dadosClausula = {
        edital: data.edital.uuid,
        numero_clausula: data.numero_clausula,
        item_clausula: data.item_clausula,
        porcentagem_desconto: data.porcentagem_desconto,
        descricao: data.descricao,
      };
      setValoresInicias(dadosClausula);
    } else {
      setErroAPI(
        "Erro ao carregar dados da cláusula. Tente novamente mais tarde."
      );
    }
    setCarregando(false);
  };

  const voltarPagina = () =>
    navigate(`/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}`);

  useEffect(() => {
    if (uuidClausula) {
      getClausulaParaDescontoAsync(uuidClausula);
    }

    getEditaisAsync();
  }, []);

  return (
    <div className="cadastro-de-clausulas">
      {erroAPI && <div>{erroAPI}</div>}

      <Spin tip="Carregando..." spinning={carregando}>
        {!erroAPI && !carregando ? (
          <div className="card mt-3">
            <div className="card-body">
              <Form
                onSubmit={(values: ClausulaPayload) =>
                  uuidClausula
                    ? editarClausulaParaDesconto(uuidClausula, values)
                    : cadastrarClausulaParaDesconto(values)
                }
                initialValues={valoresIniciais}
                render={({ submitting, handleSubmit, form }) => {
                  return (
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-3 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="edital"
                            label="Nº do Edital"
                            component={ASelect}
                            showSearch
                            validate={required}
                            onChange={(value: string) =>
                              form.change("edital", value)
                            }
                            filterOption={(inputValue: string, option: any) =>
                              option.props.children
                                .toString()
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            }
                          >
                            <SelectAntd.Option value="">
                              Selecione o edital
                            </SelectAntd.Option>

                            {editais.map((edital) => (
                              <SelectAntd.Option key={edital.uuid}>
                                {edital.numero}
                              </SelectAntd.Option>
                            ))}
                          </Field>
                        </div>

                        <div className="col-3 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="numero_clausula"
                            label="Nº da Cláusula"
                            placeholder="Ex. 7.1.1"
                            autoComplete="off"
                            component={AInput}
                            validate={required}
                          />
                        </div>

                        <div className="col-3 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="item_clausula"
                            label="Item da Cláusula"
                            placeholder="Ex. a"
                            autoComplete="off"
                            component={AInput}
                            validate={required}
                          />
                        </div>

                        <div className="col-3 d-flex">
                          <span className="required-asterisk">*</span>
                          <Field
                            name="porcentagem_desconto"
                            label="% de Desconto"
                            placeholder="Apenas números"
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

                        <div className="col-12 d-flex">
                          <Field
                            name="descricao"
                            label="Descrição"
                            placeholder="Texto da cláusula"
                            required
                            component={TextArea}
                            validate={required}
                            height="200"
                          />
                        </div>
                      </div>

                      <div className="row justify-content-end mt-5">
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
