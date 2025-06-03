import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
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
const VALORES_INICIAIS = {
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
  const [contratos, setContratos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erroAPI, setErroAPI] = useState("");
  const [editais, setEditais] = useState([]);
  const [valoresIniciais, setValoresInicias] = useState(VALORES_INICIAIS);
  const [uuidEmpenho, setUuidEmpenho] = useState("");
  const getContratos = async () => {
    setCarregando(true);
    try {
      const { data } = await getContratosVigentes();
      setContratos(data.results);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar contratos vigentes. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };
  const getEmpenhoAsync = async (uuid) => {
    setCarregando(true);
    try {
      const { data } = await getEmpenho(uuid);
      setValoresInicias(data);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar dados do empenho. Tente novamente mais tarde."
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
  const cadastrarEmpenho = async (values) => {
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
        "Ocorreu um erro ao cadastrar o empenho. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };
  const editarEmpenho = async (uuid, values) => {
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
        "Ocorreu um erro ao editar o empenho. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };
  const voltarPagina = () => navigate(`/${MEDICAO_INICIAL}/${EMPENHOS}`);
  return _jsxs("div", {
    className: "cadastro-de-empenhos",
    children: [
      erroAPI && _jsx("div", { children: erroAPI }),
      _jsx(Spin, {
        tip: "Carregando...",
        spinning: carregando,
        children:
          !erroAPI && !carregando
            ? _jsx("div", {
                className: "card mt-3",
                children: _jsx("div", {
                  className: "card-body",
                  children: _jsx(Form, {
                    onSubmit: (values) =>
                      uuidEmpenho
                        ? editarEmpenho(uuidEmpenho, values)
                        : cadastrarEmpenho(values),
                    initialValues: valoresIniciais,
                    render: ({ submitting, handleSubmit, form }) => {
                      const selecionaEdital = (value) => {
                        form.change("contrato", value);
                        const editais = contratos
                          .filter((contrato) => contrato.uuid === value)
                          .map((contrato) => contrato?.edital);
                        setEditais(editais);
                        form.change("edital", editais[0]?.uuid);
                      };
                      const selecionaTipoEmpenho = (value) => {
                        form.change("tipo_empenho", value);
                        form.change("valor_total", null);
                        form.change("status", null);
                      };
                      return _jsxs("form", {
                        onSubmit: handleSubmit,
                        children: [
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsxs("div", {
                                className: "col-4 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsx(Field, {
                                    name: "numero",
                                    label: "N\u00BA do Empenho",
                                    placeholder: "Digite o n\u00BA do empenho",
                                    autoComplete: "off",
                                    component: AInput,
                                    validate: required,
                                    disabled: uuidEmpenho,
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "col-4 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsxs(Field, {
                                    name: "contrato",
                                    label: "Contrato",
                                    component: ASelect,
                                    showSearch: true,
                                    validate: required,
                                    onChange: (value) => selecionaEdital(value),
                                    filterOption: (inputValue, option) =>
                                      option.props.children
                                        .toString()
                                        .toLowerCase()
                                        .includes(inputValue.toLowerCase()),
                                    disabled: uuidEmpenho,
                                    children: [
                                      _jsx(SelectAntd.Option, {
                                        value: "",
                                        children: "Selecione um contrato",
                                      }),
                                      contratos.map((contrato) =>
                                        _jsx(
                                          SelectAntd.Option,
                                          { children: contrato.numero },
                                          contrato.uuid
                                        )
                                      ),
                                    ],
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "col-4 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsxs(Field, {
                                    name: "edital",
                                    label: "Edital",
                                    component: ASelect,
                                    validate: required,
                                    disabled: true,
                                    children: [
                                      _jsx(SelectAntd.Option, {
                                        value: "",
                                        children: "N\u00BA do Edital",
                                      }),
                                      editais.map((edital) =>
                                        _jsx(
                                          SelectAntd.Option,
                                          { children: edital?.numero },
                                          edital?.uuid
                                        )
                                      ),
                                    ],
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "col-4 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsxs(Field, {
                                    name: "tipo_empenho",
                                    label: "Tipo de Empenho",
                                    component: ASelect,
                                    validate: required,
                                    onChange: (value) =>
                                      selecionaTipoEmpenho(value),
                                    children: [
                                      _jsx(SelectAntd.Option, {
                                        value: "",
                                        children: "Selecione um tipo",
                                      }),
                                      TIPOS_EMPENHOS.map((tipo) =>
                                        _jsx(
                                          SelectAntd.Option,
                                          { children: tipo },
                                          tipo.toUpperCase()
                                        )
                                      ),
                                    ],
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "col-4 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsx(Field, {
                                    name: "valor_total",
                                    label: "Valor Total do Empenho",
                                    placeholder: "Digite o valor do empenho",
                                    prefix: "R$",
                                    component: AInputNumber,
                                    min: 0,
                                    formatter: (value) =>
                                      formataValorDecimal(value),
                                    parser: (value) =>
                                      parserValorDecimal(value),
                                    validate: required,
                                    style: { width: "100%" },
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "col-4 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsxs(Field, {
                                    name: "status",
                                    label: "Status",
                                    component: ASelect,
                                    validate: required,
                                    children: [
                                      _jsx(SelectAntd.Option, {
                                        value: "",
                                        children: "Status",
                                      }),
                                      OPCOES_STATUS.map((tipo) =>
                                        _jsx(
                                          SelectAntd.Option,
                                          { children: tipo },
                                          tipo.toUpperCase()
                                        )
                                      ),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          _jsx("div", {
                            className: "row justify-content-end",
                            children: _jsxs("div", {
                              className: "col-4",
                              children: [
                                _jsx(Botao, {
                                  texto: "Salvar",
                                  type: BUTTON_TYPE.SUBMIT,
                                  style: BUTTON_STYLE.GREEN,
                                  className: "float-end ms-3",
                                  disabled: submitting,
                                }),
                                _jsx(Botao, {
                                  texto: "Cancelar",
                                  type: BUTTON_TYPE.BUTTON,
                                  style: BUTTON_STYLE.GREEN_OUTLINE,
                                  className: "float-end ms-3",
                                  onClick: () => voltarPagina(),
                                }),
                              ],
                            }),
                          }),
                        ],
                      });
                    },
                  }),
                }),
              })
            : null,
      }),
    ],
  });
}
