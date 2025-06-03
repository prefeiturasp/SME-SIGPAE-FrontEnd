import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import Label from "src/components/Shareable/Label";
import { required, email } from "src/helpers/fieldValidators";
import { Spin, Tooltip } from "antd";
import { CATEGORIA_OPTIONS } from "../../constants";
import InputText from "src/components/Shareable/Input/InputText";
import MaskedInputText from "src/components/Shareable/Input/MaskedInputText";
import Collapse from "src/components/Shareable/Collapse";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../Shareable/Botao/constants";
import Botao from "../../../../../Shareable/Botao";
import { cepMask, cnpjMask, telefoneMask } from "src/constants/shared";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import FormPereciveisENaoPereciveis from "./components/FormPereciveisENaoPereciveis";
import TabelaNutricional from "src/components/Shareable/TabelaNutricional";
import Select from "src/components/Shareable/Select";
import ModalCadastrarItemIndividual from "src/components/Shareable/ModalCadastrarItemIndividual";
import { ModalAssinaturaUsuario } from "src/components/Shareable/ModalAssinaturaUsuario";
import InfoAcondicionamentoPereciveis from "./components/InfoAcondicionamentoPereciveis";
import InfoAcondicionamentoNaoPereciveis from "./components/InfoAcondicionamentoNaoPereciveis";
import {
  assinarEnviarFichaTecnica,
  carregaListaCompletaInformacoesNutricionais,
  carregarDadosCadastrar,
  carregarFabricantes,
  carregarMarcas,
  carregarProdutos,
  carregarUnidadesMedida,
  cepCalculator,
  formataPayloadCadastroFichaTecnica,
  gerenciaModalCadastroExterno,
  salvarRascunho,
  validaAssinarEnviar,
  validaProximo,
  validaRascunho,
} from "../../helpers";
import "./styles.scss";
import FormProponente from "./components/FormProponente";
import StepsSigpae from "src/components/Shareable/StepsSigpae";
const ITENS_STEPS = [
  {
    title: "Identificação do Produto",
  },
  {
    title: "Informações Nutricionais",
  },
  {
    title: "Informações de Acondicionamento",
  },
];
export default () => {
  const { meusDados } = useContext(MeusDadosContext);
  const [carregando, setCarregando] = useState(true);
  const [produtosOptions, setProdutosOptions] = useState([]);
  const [marcasOptions, setMarcasOptions] = useState([]);
  const [fabricantesOptions, setFabricantesOptions] = useState([]);
  const [unidadesMedidaOptions, setUnidadesMedidaOptions] = useState([]);
  const [proponente, setProponente] = useState({});
  const [desabilitaEndereco, setDesabilitaEndereco] = useState(true);
  const [collapse, setCollapse] = useState({});
  const [ficha, setFicha] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [stepAtual, setStepAtual] = useState(0);
  const listaCompletaInformacoesNutricionais = useRef([]);
  const listaInformacoesNutricionaisFichaTecnica = useRef([]);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [showModalAssinatura, setShowModalAssinatura] = useState(false);
  const [tipoCadastro, setTipoCadastro] = useState("");
  const [arquivo, setArquivo] = useState([]);
  const navigate = useNavigate();
  const atualizarDadosCarregados = async () => {
    setCarregando(true);
    await carregarProdutos(setProdutosOptions);
    await carregarMarcas(setMarcasOptions);
    await carregarFabricantes(setFabricantesOptions);
    setCarregando(false);
  };
  useEffect(() => {
    (async () => {
      await carregarProdutos(setProdutosOptions);
      await carregarMarcas(setMarcasOptions);
      await carregarFabricantes(setFabricantesOptions);
      await carregarUnidadesMedida(setUnidadesMedidaOptions);
      await carregaListaCompletaInformacoesNutricionais(
        listaCompletaInformacoesNutricionais
      );
      await carregarDadosCadastrar(
        listaInformacoesNutricionaisFichaTecnica,
        meusDados,
        setFicha,
        setInitialValues,
        setArquivo,
        setProponente,
        setCarregando
      );
    })();
  }, []);
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-cadastro-ficha-tecnica",
      children: _jsx("div", {
        className: "card-body cadastro-ficha-tecnica",
        children: _jsx(Form, {
          onSubmit: () => {},
          initialValues: initialValues,
          decorators: [cepCalculator(setDesabilitaEndereco)],
          render: ({ form, handleSubmit, values, errors }) =>
            _jsxs("form", {
              onSubmit: handleSubmit,
              children: [
                _jsx(StepsSigpae, { current: stepAtual, items: ITENS_STEPS }),
                _jsx("hr", {}),
                stepAtual === 0 &&
                  _jsxs(_Fragment, {
                    children: [
                      _jsx("div", {
                        className: "subtitulo",
                        children: "Identifica\u00E7\u00E3o do Produto",
                      }),
                      _jsxs("div", {
                        className: "row mt-4",
                        children: [
                          _jsx("div", {
                            className: "col-6",
                            children: _jsx(Field, {
                              component: AutoCompleteSelectField,
                              dataTestId: "produto",
                              options: getListaFiltradaAutoCompleteSelect(
                                produtosOptions.map((e) => e.nome),
                                values["produto"],
                                true
                              ),
                              label: "Produto",
                              name: `produto`,
                              placeholder: "Selecione um Produto",
                              className: "input-ficha-tecnica",
                              required: true,
                              validate: required,
                              tooltipText:
                                "Caso não localize o produto no seletor, faça o cadastro no botão Cadastrar Produto.",
                              onChange: (value) => {
                                if (form.getState().dirty) {
                                  form.restart({ produto: value });
                                }
                              },
                            }),
                          }),
                          _jsx("div", {
                            className: "col-2 cadastro-externo",
                            children: _jsx(Botao, {
                              dataTestId: "btnCadastrarProduto",
                              texto: "Cadastrar Produto",
                              type: BUTTON_TYPE.BUTTON,
                              style: BUTTON_STYLE.GREEN_OUTLINE,
                              className: "botao-cadastro-externo",
                              onClick: () =>
                                gerenciaModalCadastroExterno(
                                  "PRODUTO",
                                  setTipoCadastro,
                                  setShowModalCadastro
                                ),
                            }),
                          }),
                          _jsx("div", {
                            className: "col-4",
                            children: _jsx(Field, {
                              component: Select,
                              dataTestId: "categoria",
                              naoDesabilitarPrimeiraOpcao: true,
                              options: [
                                { nome: "Selecione uma Categoria", uuid: "" },
                                ...CATEGORIA_OPTIONS,
                              ],
                              label: "Categoria",
                              name: `categoria`,
                              className: "input-ficha-tecnica",
                              required: true,
                              validate: required,
                            }),
                          }),
                          _jsx("div", {
                            className: "col-6",
                            children: _jsx(Field, {
                              component: Select,
                              dataTestId: "marca",
                              naoDesabilitarPrimeiraOpcao: true,
                              options: [
                                { nome: "Selecione uma Marca", uuid: "" },
                                ...marcasOptions,
                              ],
                              label: "Marca",
                              name: `marca`,
                              className: "input-ficha-tecnica",
                              required: true,
                              validate: required,
                              tooltipText:
                                "Caso não localize a marca no seletor, faça o cadastro no botão Cadastrar Marca.",
                            }),
                          }),
                          _jsx("div", {
                            className: "col-2 cadastro-externo",
                            children: _jsx(Botao, {
                              texto: "Cadastrar Marca",
                              type: BUTTON_TYPE.BUTTON,
                              style: BUTTON_STYLE.GREEN_OUTLINE,
                              className: "botao-cadastro-externo",
                              onClick: () =>
                                gerenciaModalCadastroExterno(
                                  "MARCA",
                                  setTipoCadastro,
                                  setShowModalCadastro
                                ),
                            }),
                          }),
                          _jsx("div", {
                            className: "col-4",
                            children: _jsx(Field, {
                              component: InputText,
                              dataTestId: "pregao_chamada_publica",
                              label:
                                "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                              name: `pregao_chamada_publica`,
                              placeholder:
                                "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                              className: "input-ficha-tecnica",
                              required: true,
                              validate: required,
                              tooltipText:
                                "Deve ser informado o número do Edital do Pregão Eletrônico ou Chamada Pública referente ao Produto.",
                            }),
                          }),
                        ],
                      }),
                      _jsx("hr", {}),
                      _jsxs(Collapse, {
                        collapse: collapse,
                        setCollapse: setCollapse,
                        titulos: [
                          _jsxs(
                            "span",
                            {
                              children: [
                                "Empresa ou Organiza\u00E7\u00E3o",
                                " ",
                                _jsx("span", {
                                  className: "verde-escuro",
                                  children: "Proponente",
                                }),
                              ],
                            },
                            0
                          ),
                          _jsxs(
                            "span",
                            {
                              className: "fw-bold",
                              children: [
                                "Empresa ou Organiza\u00E7\u00E3o",
                                " ",
                                _jsx("span", {
                                  className: "verde-escuro",
                                  children: "Fabricante",
                                }),
                              ],
                            },
                            1
                          ),
                          _jsxs(
                            "span",
                            {
                              className: "fw-bold",
                              children: [
                                "Detalhes do",
                                " ",
                                _jsx("span", {
                                  className: "verde-escuro",
                                  children: "Produto",
                                }),
                              ],
                            },
                            1
                          ),
                        ],
                        id: "collapseFichaTecnica",
                        children: [
                          _jsx("section", {
                            id: "formProponente",
                            children: _jsx(FormProponente, {
                              proponente: proponente,
                            }),
                          }),
                          _jsxs("section", {
                            id: "formFabricante",
                            children: [
                              _jsxs("div", {
                                className: "row",
                                children: [
                                  _jsx("div", {
                                    className: "col-6",
                                    children: _jsx(Field, {
                                      component: AutoCompleteSelectField,
                                      dataTestId: "fabricante",
                                      options:
                                        getListaFiltradaAutoCompleteSelect(
                                          fabricantesOptions.map((e) => e.nome),
                                          values["fabricante"],
                                          true
                                        ),
                                      label: "Fabricantes",
                                      name: `fabricante`,
                                      placeholder: "Selecione um Fabricante",
                                      className: "input-ficha-tecnica",
                                      required: true,
                                      validate: required,
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-2 cadastro-externo",
                                    children: _jsx(Botao, {
                                      texto: "Cadastrar Fabricante",
                                      type: BUTTON_TYPE.BUTTON,
                                      style: BUTTON_STYLE.GREEN_OUTLINE,
                                      className: "botao-cadastro-externo",
                                      onClick: () =>
                                        gerenciaModalCadastroExterno(
                                          "FABRICANTE",
                                          setTipoCadastro,
                                          setShowModalCadastro
                                        ),
                                    }),
                                  }),
                                ],
                              }),
                              _jsx("div", {
                                className: "row",
                                children: _jsx("div", {
                                  className: "col-6",
                                  children: _jsx(Field, {
                                    component: MaskedInputText,
                                    mask: cnpjMask,
                                    label: "CNPJ",
                                    name: `cnpj_fabricante`,
                                    placeholder: "Digite o CNPJ",
                                    className: "input-ficha-tecnica",
                                  }),
                                }),
                              }),
                              _jsxs("div", {
                                className: "row",
                                children: [
                                  _jsx("div", {
                                    className: "col-4",
                                    children: _jsx(Field, {
                                      component: MaskedInputText,
                                      mask: cepMask,
                                      label: "CEP",
                                      name: `cep_fabricante`,
                                      placeholder: "Digite o CEP",
                                      className: "input-ficha-tecnica",
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-8",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Endere\u00E7o",
                                      name: `endereco_fabricante`,
                                      placeholder: "Digite o Endere\u00E7o",
                                      className: "input-ficha-tecnica",
                                      disabled: desabilitaEndereco,
                                    }),
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "row",
                                children: [
                                  _jsx("div", {
                                    className: "col-4",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "N\u00FAmero",
                                      name: `numero_fabricante`,
                                      placeholder: "Digite o N\u00FAmero",
                                      className: "input-ficha-tecnica",
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-4",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Complemento",
                                      name: `complemento_fabricante`,
                                      placeholder: "Digite o Complemento",
                                      className: "input-ficha-tecnica",
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-4",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Bairro",
                                      name: `bairro_fabricante`,
                                      placeholder: "Digite o Bairro",
                                      className: "input-ficha-tecnica",
                                      disabled: desabilitaEndereco,
                                    }),
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "row",
                                children: [
                                  _jsx("div", {
                                    className: "col-8",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Cidade",
                                      name: `cidade_fabricante`,
                                      placeholder: "Digite o Cidade",
                                      className: "input-ficha-tecnica",
                                      disabled: desabilitaEndereco,
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-4",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Estado",
                                      name: `estado_fabricante`,
                                      placeholder: "Digite o Estado",
                                      className: "input-ficha-tecnica",
                                      disabled: desabilitaEndereco,
                                    }),
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "row",
                                children: [
                                  _jsx("div", {
                                    className: "col-8",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "E-mail",
                                      name: `email_fabricante`,
                                      placeholder: "Digite o E-mail",
                                      className: "input-ficha-tecnica",
                                      validate: email,
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-4",
                                    children: _jsx(Field, {
                                      component: MaskedInputText,
                                      mask: telefoneMask,
                                      label: "Telefone",
                                      name: `telefone_fabricante`,
                                      placeholder: "Digite o Telefone",
                                      className: "input-ficha-tecnica",
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          _jsx("section", {
                            id: "formProduto",
                            children: _jsx(FormPereciveisENaoPereciveis, {
                              values: values,
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                stepAtual === 1 &&
                  _jsxs(_Fragment, {
                    children: [
                      _jsx("div", {
                        className: "subtitulo",
                        children: "Informa\u00E7\u00F5es Nutricionais",
                      }),
                      _jsxs("div", {
                        className: "row",
                        children: [
                          _jsx("div", {
                            className: "col-6",
                            children: _jsx(Label, {
                              content: "Por\u00E7\u00E3o",
                              required: true,
                            }),
                          }),
                          _jsx("div", {
                            className: "col-6",
                            children: _jsx(Label, {
                              content: "Unidade Caseira",
                              required: true,
                            }),
                          }),
                        ],
                      }),
                      _jsxs("div", {
                        className: "row",
                        children: [
                          _jsx("div", {
                            className: "col-3",
                            children: _jsx(Field, {
                              component: InputText,
                              name: `porcao`,
                              placeholder: "Quantidade Num\u00E9rica",
                              className: "input-ficha-tecnica",
                              required: true,
                              validate: required,
                            }),
                          }),
                          _jsx("div", {
                            className: "col-3",
                            children: _jsx(Field, {
                              component: Select,
                              dataTestId: "unidade_medida_porcao",
                              naoDesabilitarPrimeiraOpcao: true,
                              options: [
                                { nome: "Unidade de Medida", uuid: "" },
                                ...unidadesMedidaOptions,
                              ],
                              name: `unidade_medida_porcao`,
                              className: "input-ficha-tecnica",
                              required: true,
                              validate: required,
                            }),
                          }),
                          _jsx("div", {
                            className: "col-3",
                            children: _jsx(Field, {
                              component: InputText,
                              name: `valor_unidade_caseira`,
                              placeholder: "Quantidade Num\u00E9rica",
                              className: "input-ficha-tecnica",
                              required: true,
                              validate: required,
                            }),
                          }),
                          _jsx("div", {
                            className: "col-3",
                            children: _jsx(Field, {
                              component: InputText,
                              name: `unidade_medida_caseira`,
                              placeholder: "Unidade de Medida",
                              className: "input-ficha-tecnica",
                              required: true,
                              validate: required,
                            }),
                          }),
                        ],
                      }),
                      _jsxs("div", {
                        className: "aviso-tabela mt-4",
                        children: [
                          _jsx("span", {
                            className: "red",
                            children: "IMPORTANTE:",
                          }),
                          " ",
                          `Os campos abaixo são de preenchimento obrigatório, caso não haja valores nutricionais informar o valor "0" nos campos.`,
                        ],
                      }),
                      _jsx(TabelaNutricional, {
                        values: values,
                        listaCompletaInformacoesNutricionais:
                          listaCompletaInformacoesNutricionais.current,
                        informacoesNutricionaisCarregadas:
                          listaInformacoesNutricionaisFichaTecnica.current,
                      }),
                    ],
                  }),
                stepAtual === 2 &&
                  (values["categoria"] === "PERECIVEIS"
                    ? _jsx(InfoAcondicionamentoPereciveis, {
                        collapse: collapse,
                        setCollapse: setCollapse,
                        unidadesMedidaOptions: unidadesMedidaOptions,
                        arquivo: arquivo,
                        setArquivo: setArquivo,
                      })
                    : _jsx(InfoAcondicionamentoNaoPereciveis, {
                        collapse: collapse,
                        setCollapse: setCollapse,
                        unidadesMedidaOptions: unidadesMedidaOptions,
                        arquivo: arquivo,
                        setArquivo: setArquivo,
                        values: values,
                      })),
                _jsx("hr", {}),
                stepAtual === ITENS_STEPS.length - 1 &&
                  _jsx("div", {
                    className: "mt-4 mb-4",
                    children: _jsx(Tooltip, {
                      className: "float-end",
                      title: validaAssinarEnviar(values, errors, arquivo)
                        ? "Há campos de preenchimento obrigatório sem informação."
                        : undefined,
                      children: _jsx("div", {
                        children: _jsx(Botao, {
                          texto: "Assinar e Enviar",
                          type: BUTTON_TYPE.BUTTON,
                          style: BUTTON_STYLE.GREEN_OUTLINE,
                          className: "float-end ms-3",
                          onClick: () => setShowModalAssinatura(true),
                          disabled: validaAssinarEnviar(
                            values,
                            errors,
                            arquivo
                          ),
                        }),
                      }),
                    }),
                  }),
                stepAtual < ITENS_STEPS.length - 1 &&
                  _jsx("div", {
                    className: "mt-4 mb-4",
                    children: _jsx(Tooltip, {
                      className: "float-end",
                      title: validaProximo(values, errors, stepAtual)
                        ? "Há campos de preenchimento obrigatório sem informação."
                        : undefined,
                      children: _jsx("div", {
                        children: _jsx(Botao, {
                          texto: "Pr\u00F3ximo",
                          type: BUTTON_TYPE.BUTTON,
                          style: BUTTON_STYLE.GREEN_OUTLINE,
                          className: "float-end ms-3",
                          onClick: () => {
                            setStepAtual((stepAtual) => stepAtual + 1);
                            setCollapse({ 0: true });
                          },
                          disabled: validaProximo(values, errors, stepAtual),
                        }),
                      }),
                    }),
                  }),
                _jsx("div", {
                  className: "mt-4 mb-4",
                  children: _jsx(Tooltip, {
                    className: "float-end",
                    title: validaRascunho(values)
                      ? "Há campos de preenchimento obrigatório sem informação na seção de Identificação do Produto."
                      : undefined,
                    children: _jsx("div", {
                      children: _jsx(Botao, {
                        texto: "Salvar Rascunho",
                        type: BUTTON_TYPE.BUTTON,
                        style: BUTTON_STYLE.GREEN_OUTLINE,
                        className: "float-end ms-3",
                        onClick: () => {
                          const payload = formataPayloadCadastroFichaTecnica(
                            values,
                            proponente,
                            produtosOptions,
                            fabricantesOptions,
                            arquivo
                          );
                          salvarRascunho(
                            payload,
                            ficha,
                            setFicha,
                            setCarregando
                          );
                        },
                        disabled: validaRascunho(values),
                      }),
                    }),
                  }),
                }),
                stepAtual > 0 &&
                  _jsx("div", {
                    className: "mt-4 mb-4",
                    children: _jsx(Botao, {
                      texto: "Anterior",
                      type: BUTTON_TYPE.BUTTON,
                      style: BUTTON_STYLE.GREEN_OUTLINE,
                      className: "float-end ms-3",
                      onClick: () => {
                        setStepAtual((stepAtual) => stepAtual - 1);
                        setCollapse({});
                      },
                    }),
                  }),
                _jsx(ModalCadastrarItemIndividual, {
                  closeModal: () => setShowModalCadastro(false),
                  showModal: showModalCadastro,
                  atualizarDadosCarregados: () => atualizarDadosCarregados(),
                  tipoCadastro: tipoCadastro,
                  tipoCadastroVisualizacao:
                    tipoCadastro[0] + tipoCadastro.slice(1).toLowerCase(),
                }),
                _jsx(ModalAssinaturaUsuario, {
                  show: showModalAssinatura,
                  handleClose: () => setShowModalAssinatura(false),
                  handleSim: (password) => {
                    const payload = formataPayloadCadastroFichaTecnica(
                      values,
                      proponente,
                      produtosOptions,
                      fabricantesOptions,
                      arquivo,
                      password
                    );
                    assinarEnviarFichaTecnica(
                      payload,
                      ficha,
                      setCarregando,
                      navigate
                    );
                  },
                  loading: carregando,
                  titulo: "Assinar Ficha T\u00E9cnica",
                  texto:
                    "Voc\u00EA confirma o preenchimento correto de todas as\n                  informa\u00E7\u00F5es solicitadas na ficha t\u00E9cnica?",
                  textoBotao: "Sim, Assinar Ficha",
                }),
              ],
            }),
        }),
      }),
    }),
  });
};
