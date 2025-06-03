import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Field } from "react-final-form";
import {
  ASelect,
  AInput,
  AInputNumber,
} from "src/components/Shareable/MakeField";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { Select as SelectAntd, Spin } from "antd";
import { required } from "src/helpers/fieldValidators";
import { getNumerosEditais } from "src/services/edital.service";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import {
  MEDICAO_INICIAL,
  CLAUSULAS_PARA_DESCONTOS,
} from "src/configs/constants";
import "./styles.scss";
import {
  cadastraClausulaParaDesconto,
  getClausulaParaDesconto,
  editaClausulaParaDesconto,
} from "src/services/medicaoInicial/clausulasParaDescontos.service";
import { formataValorDecimal, parserValorDecimal } from "../../helper.jsx";
import { getError } from "src/helpers/utilities";
const VALORES_INICIAIS = {
  edital: null,
  numero_clausula: null,
  item_clausula: null,
  porcentagem_desconto: null,
  descricao: null,
};
export function CadastroDeClausulas() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [editais, setEditais] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erroAPI, setErroAPI] = useState("");
  const [valoresIniciais, setValoresInicias] = useState(VALORES_INICIAIS);
  const uuidClausula = searchParams.get("uuid");
  const getEditaisAsync = async () => {
    setCarregando(true);
    try {
      const response = await getNumerosEditais();
      setEditais(response.data.results);
    } catch (error) {
      setErroAPI("Erro ao carregar editais. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  };
  const cadastrarClausulaParaDesconto = async (values) => {
    setCarregando(true);
    try {
      await cadastraClausulaParaDesconto(values);
      toastSuccess("Cláusula cadastrada com sucesso!");
      voltarPagina();
    } catch ({ response }) {
      toastError(getError(response.data));
    } finally {
      setCarregando(false);
    }
  };
  const editarClausulaParaDesconto = async (uuid, values) => {
    setCarregando(true);
    try {
      await editaClausulaParaDesconto(uuid, values);
      toastSuccess("Cláusula atualizada com sucesso!");
      voltarPagina();
    } catch ({ response }) {
      toastError(getError(response.data));
    } finally {
      setCarregando(false);
    }
  };
  const getClausulaParaDescontoAsync = async (uuid) => {
    setCarregando(true);
    try {
      const { data } = await getClausulaParaDesconto(uuid);
      const dadosClausula = {
        edital: data.edital.uuid,
        numero_clausula: data.numero_clausula,
        item_clausula: data.item_clausula,
        porcentagem_desconto: data.porcentagem_desconto,
        descricao: data.descricao,
      };
      setValoresInicias(dadosClausula);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar dados da cláusula. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };
  const voltarPagina = () =>
    navigate(`/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}`);
  useEffect(() => {
    if (uuidClausula) {
      getClausulaParaDescontoAsync(uuidClausula);
    }
    getEditaisAsync();
  }, []);
  return _jsxs("div", {
    className: "cadastro-de-clausulas",
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
                      uuidClausula
                        ? editarClausulaParaDesconto(uuidClausula, values)
                        : cadastrarClausulaParaDesconto(values),
                    initialValues: valoresIniciais,
                    render: ({ submitting, handleSubmit, form }) => {
                      return _jsxs("form", {
                        onSubmit: handleSubmit,
                        children: [
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsxs("div", {
                                className: "col-3 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsxs(Field, {
                                    name: "edital",
                                    label: "N\u00BA do Edital",
                                    component: ASelect,
                                    showSearch: true,
                                    validate: required,
                                    onChange: (value) =>
                                      form.change("edital", value),
                                    filterOption: (inputValue, option) =>
                                      option.props.children
                                        .toString()
                                        .toLowerCase()
                                        .includes(inputValue.toLowerCase()),
                                    children: [
                                      _jsx(SelectAntd.Option, {
                                        value: "",
                                        children: "Selecione o edital",
                                      }),
                                      editais.map((edital) =>
                                        _jsx(
                                          SelectAntd.Option,
                                          { children: edital.numero },
                                          edital.uuid
                                        )
                                      ),
                                    ],
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "col-3 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsx(Field, {
                                    name: "numero_clausula",
                                    label: "N\u00BA da Cl\u00E1usula",
                                    placeholder: "Ex. 7.1.1",
                                    autoComplete: "off",
                                    component: AInput,
                                    validate: required,
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "col-3 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsx(Field, {
                                    name: "item_clausula",
                                    label: "Item da Cl\u00E1usula",
                                    placeholder: "Ex. a",
                                    autoComplete: "off",
                                    component: AInput,
                                    validate: required,
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "col-3 d-flex",
                                children: [
                                  _jsx("span", {
                                    className: "required-asterisk",
                                    children: "*",
                                  }),
                                  _jsx(Field, {
                                    name: "porcentagem_desconto",
                                    label: "% de Desconto",
                                    placeholder: "Apenas n\u00FAmeros",
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
                              _jsx("div", {
                                className: "col-12 d-flex",
                                children: _jsx(Field, {
                                  name: "descricao",
                                  label: "Descri\u00E7\u00E3o",
                                  placeholder: "Texto da cl\u00E1usula",
                                  required: true,
                                  component: TextArea,
                                  validate: required,
                                  height: "200",
                                }),
                              }),
                            ],
                          }),
                          _jsx("div", {
                            className: "row justify-content-end mt-5",
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
