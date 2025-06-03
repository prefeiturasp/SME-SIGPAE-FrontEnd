import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import Label from "src/components/Shareable/Label";
import { Spin } from "antd";
import InputText from "src/components/Shareable/Input/InputText";
import Collapse from "src/components/Shareable/Collapse";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import Select from "src/components/Shareable/Select";
import {
  required,
  composeValidators,
  inteiroOuDecimalComVirgula,
  inteiroOuDecimalPositivoOuNegativo,
} from "src/helpers/fieldValidators";
import FormPereciveisENaoPereciveis from "../Cadastrar/components/FormPereciveisENaoPereciveis";
import FormProponente from "../Cadastrar/components/FormProponente";
import TabelaNutricional from "src/components/Shareable/TabelaNutricional";
import CheckboxComBorda from "src/components/Shareable/CheckboxComBorda";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
import { ModalAssinaturaUsuario } from "src/components/Shareable/ModalAssinaturaUsuario";
import ModalVoltar from "src/components/Shareable/Page/ModalVoltar";
import { PRE_RECEBIMENTO, FICHA_TECNICA } from "src/configs/constants";
import {
  assinarCorrigirFichaTecnica,
  carregaListaCompletaInformacoesNutricionais,
  carregarDadosCorrgir,
  carregarUnidadesMedida,
  formataPayloadCorrecaoFichaTecnica,
} from "../../helpers";
import "./styles.scss";
const idCollapse = "collapseAnalisarFichaTecnica";
export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [showModalAssinatura, setShowModalAssinatura] = useState(false);
  const [showModalVoltar, setShowModalVoltar] = useState(false);
  const [unidadesMedidaOptions, setUnidadesMedidaOptions] = useState([]);
  const [collapse, setCollapse] = useState({});
  const [ficha, setFicha] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [conferidos, setConferidos] = useState({});
  const listaCompletaInformacoesNutricionais = useRef([]);
  const listaInformacoesNutricionaisFichaTecnica = useRef([]);
  const [proponente, setProponente] = useState({});
  useEffect(() => {
    (async () => {
      await carregarUnidadesMedida(setUnidadesMedidaOptions);
      await carregaListaCompletaInformacoesNutricionais(
        listaCompletaInformacoesNutricionais
      );
      await carregarDadosCorrgir(
        listaInformacoesNutricionaisFichaTecnica,
        setFicha,
        setInitialValues,
        setConferidos,
        setProponente,
        setCarregando
      );
    })();
  }, []);
  const obterCollapseConfigs = (ehPerecivel) => [
    {
      titulo: _jsx("span", {
        className: "verde-escuro",
        children: "Proponente e Fabricante",
      }),
    },
    {
      titulo: _jsx("span", {
        className: "verde-escuro",
        children: "Detalhes do Produto",
      }),
      tag: true,
    },
    {
      titulo: _jsx("span", {
        className: "verde-escuro",
        children: "Informa\u00E7\u00F5es Nutricionais",
      }),
      tag: true,
    },
    {
      titulo: _jsx("span", {
        className: "verde-escuro",
        children: "Conserva\u00E7\u00E3o",
      }),
      tag: true,
    },
    ...(ehPerecivel
      ? [
          {
            titulo: _jsx("span", {
              className: "verde-escuro",
              children: "Temperatura e Transporte",
            }),
            tag: true,
          },
        ]
      : []),
    {
      titulo: _jsx("span", {
        className: "verde-escuro",
        children: "Armazenamento",
      }),
      tag: true,
    },
    {
      titulo: _jsx("span", {
        className: "verde-escuro",
        children: "Embalagem e Rotulagem",
      }),
      tag: true,
    },
    {
      titulo: _jsx("span", {
        className: "verde-escuro",
        children: "Respons\u00E1vel T\u00E9cnico e Anexos",
      }),
      tag: true,
    },
    {
      titulo: _jsx("span", {
        className: "verde-escuro",
        children: "Modo de Preparo",
      }),
      tag: true,
    },
    {
      titulo: _jsx("span", {
        className: "verde-escuro",
        children: "Outras Informa\u00E7\u00F5es",
      }),
      tag: true,
    },
  ];
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-alterar-ficha-tecnica",
      children: _jsx("div", {
        className: "card-body alterar-ficha-tecnica",
        children: _jsx(Form, {
          onSubmit: () => {},
          initialValues: initialValues,
          render: ({ handleSubmit, values, errors }) => {
            const ehPerecivel = values["categoria"] === "Perecíveis";
            const ehNaoPerecivel = values["categoria"] === "Não Perecíveis";
            return _jsxs("form", {
              onSubmit: handleSubmit,
              children: [
                _jsxs("div", {
                  className: "flex-header",
                  children: [
                    _jsxs("div", {
                      className: "subtitulo",
                      children: ["Ficha T\u00E9cnica ", ficha.numero],
                    }),
                    _jsxs("div", {
                      className: "status correcao",
                      children: [
                        _jsx("i", { className: "fas fa-exclamation-triangle" }),
                        "Solicitada Altera\u00E7\u00E3o em ",
                        ficha.log_mais_recente,
                      ],
                    }),
                  ],
                }),
                _jsxs("div", {
                  className: "row mt-4",
                  children: [
                    _jsx("div", {
                      className: "col-8",
                      children: _jsx(Field, {
                        component: InputText,
                        label: "Produto",
                        name: `produto`,
                        className: "input-ficha-tecnica",
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-4",
                      children: _jsx(Field, {
                        component: InputText,
                        label: "Categoria",
                        name: `categoria`,
                        className: "input-ficha-tecnica",
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-8",
                      children: _jsx(Field, {
                        component: InputText,
                        naoDesabilitarPrimeiraOpcao: true,
                        label: "Marca",
                        name: `marca`,
                        className: "input-ficha-tecnica",
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-4",
                      children: _jsx(Field, {
                        component: InputText,
                        label: "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                        name: `pregao_chamada_publica`,
                        className: "input-ficha-tecnica",
                        disabled: true,
                      }),
                    }),
                  ],
                }),
                _jsx("hr", {}),
                _jsxs(Collapse, {
                  collapse: collapse,
                  setCollapse: setCollapse,
                  collapseConfigs: obterCollapseConfigs(ehPerecivel),
                  id: idCollapse,
                  state: conferidos,
                  children: [
                    _jsxs("section", {
                      id: "proponenteFabricante",
                      children: [
                        _jsx("div", {
                          className: "row",
                          children: _jsx("div", {
                            className: "subtitulo",
                            children: "Proponente",
                          }),
                        }),
                        _jsx(FormProponente, { proponente: proponente }),
                        _jsx("hr", {}),
                        _jsx("div", {
                          className: "row",
                          children: _jsx("div", {
                            className: "subtitulo",
                            children: "Fabricante",
                          }),
                        }),
                        _jsx("div", {
                          className: "row",
                          children: _jsx("div", {
                            className: "col-8",
                            children: _jsx(Field, {
                              component: InputText,
                              label: "Nome da Empresa/Organiza\u00E7\u00E3o",
                              name: `fabricante`,
                              className: "input-ficha-tecnica",
                              disabled: true,
                            }),
                          }),
                        }),
                        _jsx("div", {
                          className: "row",
                          children: _jsx("div", {
                            className: "col-6",
                            children: _jsx(Field, {
                              component: InputText,
                              label: "CNPJ",
                              name: `cnpj_fabricante`,
                              className: "input-ficha-tecnica",
                              disabled: true,
                            }),
                          }),
                        }),
                        _jsxs("div", {
                          className: "row",
                          children: [
                            _jsx("div", {
                              className: "col-4",
                              children: _jsx(Field, {
                                component: InputText,
                                label: "CEP",
                                name: `cep_fabricante`,
                                className: "input-ficha-tecnica",
                                disabled: true,
                              }),
                            }),
                            _jsx("div", {
                              className: "col-8",
                              children: _jsx(Field, {
                                component: InputText,
                                label: "Endere\u00E7o",
                                name: `endereco_fabricante`,
                                className: "input-ficha-tecnica",
                                disabled: true,
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
                                className: "input-ficha-tecnica",
                                disabled: true,
                              }),
                            }),
                            _jsx("div", {
                              className: "col-4",
                              children: _jsx(Field, {
                                component: InputText,
                                label: "Complemento",
                                name: `complemento_fabricante`,
                                className: "input-ficha-tecnica",
                                disabled: true,
                              }),
                            }),
                            _jsx("div", {
                              className: "col-4",
                              children: _jsx(Field, {
                                component: InputText,
                                label: "Bairro",
                                name: `bairro_fabricante`,
                                className: "input-ficha-tecnica",
                                disabled: true,
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
                                className: "input-ficha-tecnica",
                                disabled: true,
                              }),
                            }),
                            _jsx("div", {
                              className: "col-4",
                              children: _jsx(Field, {
                                component: InputText,
                                label: "Estado",
                                name: `estado_fabricante`,
                                className: "input-ficha-tecnica",
                                disabled: true,
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
                                className: "input-ficha-tecnica",
                                disabled: true,
                              }),
                            }),
                            _jsx("div", {
                              className: "col-4",
                              children: _jsx(Field, {
                                component: InputText,
                                label: "Telefone",
                                name: `telefone_fabricante`,
                                className: "input-ficha-tecnica",
                                disabled: true,
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    _jsxs("section", {
                      id: "detalhes_produto",
                      children: [
                        !conferidos.detalhes_produto &&
                          _jsx("div", {
                            className: "row campo-correcao mb-4",
                            children: _jsx("div", {
                              className: "col-12",
                              children: _jsx(TextArea, {
                                label:
                                  "Indica\u00E7\u00F5es de Corre\u00E7\u00F5es CODAE",
                                valorInicial:
                                  ficha?.analise?.detalhes_produto_correcoes,
                                disabled: true,
                              }),
                            }),
                          }),
                        _jsx(FormPereciveisENaoPereciveis, {
                          values: values,
                          desabilitar: conferidos.detalhes_produto,
                        }),
                      ],
                    }),
                    _jsxs("section", {
                      id: "informacoes_nutricionais",
                      children: [
                        !conferidos.informacoes_nutricionais &&
                          _jsx("div", {
                            className: "row campo-correcao mb-4",
                            children: _jsx("div", {
                              className: "col-12",
                              children: _jsx(TextArea, {
                                label:
                                  "Indica\u00E7\u00F5es de Corre\u00E7\u00F5es CODAE",
                                valorInicial:
                                  ficha?.analise
                                    ?.informacoes_nutricionais_correcoes,
                                disabled: true,
                              }),
                            }),
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
                                disabled: conferidos.informacoes_nutricionais,
                              }),
                            }),
                            _jsx("div", {
                              className: "col-3",
                              children: _jsx(Field, {
                                component: Select,
                                naoDesabilitarPrimeiraOpcao: true,
                                options: [
                                  { nome: "Unidade de Medida", uuid: "" },
                                  ...unidadesMedidaOptions,
                                ],
                                name: `unidade_medida_porcao`,
                                className: "input-ficha-tecnica",
                                required: true,
                                validate: required,
                                disabled: conferidos.informacoes_nutricionais,
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
                                disabled: conferidos.informacoes_nutricionais,
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
                                disabled: conferidos.informacoes_nutricionais,
                              }),
                            }),
                          ],
                        }),
                        _jsx(TabelaNutricional, {
                          values: values,
                          listaCompletaInformacoesNutricionais:
                            listaCompletaInformacoesNutricionais.current,
                          informacoesNutricionaisCarregadas:
                            listaInformacoesNutricionaisFichaTecnica.current,
                          desabilitar: conferidos.informacoes_nutricionais,
                        }),
                      ],
                    }),
                    _jsxs("section", {
                      id: "conservacao",
                      children: [
                        !conferidos.conservacao &&
                          _jsx("div", {
                            className: "row campo-correcao mb-4",
                            children: _jsx("div", {
                              className: "col-12",
                              children: _jsx(TextArea, {
                                label:
                                  "Indica\u00E7\u00F5es de Corre\u00E7\u00F5es CODAE",
                                valorInicial:
                                  ficha?.analise?.conservacao_correcoes,
                                disabled: true,
                              }),
                            }),
                          }),
                        ehPerecivel &&
                          _jsx("div", {
                            className: "row",
                            children: _jsx("div", {
                              className: "col",
                              children: _jsx(Field, {
                                component: InputText,
                                label:
                                  "Prazo de Validade ap\u00F3s o descongelamento e mantido sob refrigera\u00E7\u00E3o:",
                                name: `prazo_validade_descongelamento`,
                                placeholder: "Digite o prazo de validade",
                                className: "input-ficha-tecnica",
                                required: true,
                                validate: required,
                                disabled: conferidos.conservacao,
                              }),
                            }),
                          }),
                        _jsx("div", {
                          className: "row mt-3",
                          children: _jsx("div", {
                            className: "col",
                            children: _jsx(Field, {
                              component: TextArea,
                              label:
                                "Condi\u00E7\u00F5es de conserva\u00E7\u00E3o e Prazo m\u00E1ximo para consumo ap\u00F3s a abertura da embalagem prim\u00E1ria:",
                              name: `condicoes_de_conservacao`,
                              placeholder:
                                "Descreva as condi\u00E7\u00F5es de conserva\u00E7\u00E3o e o prazo m\u00E1ximo de consumo",
                              className: "textarea-ficha-tecnica",
                              required: true,
                              validate: required,
                              disabled: conferidos.conservacao,
                            }),
                          }),
                        }),
                      ],
                    }),
                    ehPerecivel &&
                      _jsxs("section", {
                        id: "temperatura_e_transporte",
                        children: [
                          !conferidos.temperatura_e_transporte &&
                            _jsx("div", {
                              className: "row campo-correcao mb-4",
                              children: _jsx("div", {
                                className: "col-12",
                                children: _jsx(TextArea, {
                                  label:
                                    "Indica\u00E7\u00F5es de Corre\u00E7\u00F5es CODAE",
                                  valorInicial:
                                    ficha?.analise
                                      ?.temperatura_e_transporte_correcoes,
                                  disabled: true,
                                }),
                              }),
                            }),
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-5",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label:
                                    "Temperatura de Congelamento do Produto:",
                                  name: `temperatura_congelamento`,
                                  placeholder:
                                    "Digite a temperatura de congelamento",
                                  className: "input-ficha-tecnica",
                                  tooltipText:
                                    "No processo de fabrica\u00E7\u00E3o",
                                  required: true,
                                  validate: composeValidators(
                                    required,
                                    inteiroOuDecimalPositivoOuNegativo
                                  ),
                                  disabled: conferidos.temperatura_e_transporte,
                                }),
                              }),
                              _jsx("div", {
                                className:
                                  "col-1 label-unidade-medida label-unidade-medida-bottom",
                                children: _jsx("span", { children: "\u00BAC" }),
                              }),
                              _jsx("div", {
                                className: "col-5",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label:
                                    "Temperatura Interna do Ve\u00EDculo para Transporte:",
                                  name: `temperatura_veiculo`,
                                  placeholder:
                                    "Digite a temperatura de transporte",
                                  className: "input-ficha-tecnica",
                                  required: true,
                                  validate: composeValidators(
                                    required,
                                    inteiroOuDecimalPositivoOuNegativo
                                  ),
                                  disabled: conferidos.temperatura_e_transporte,
                                }),
                              }),
                              _jsx("div", {
                                className:
                                  "col-1 label-unidade-medida label-unidade-medida-bottom",
                                children: _jsx("span", { children: "\u00BAC" }),
                              }),
                            ],
                          }),
                          _jsx("div", {
                            className: "row mt-3",
                            children: _jsx("div", {
                              className: "col",
                              children: _jsx(Field, {
                                component: TextArea,
                                label: "Condi\u00E7\u00F5es de Transporte:",
                                name: `condicoes_de_transporte`,
                                className: "textarea-ficha-tecnica",
                                required: true,
                                validate: required,
                                disabled: conferidos.temperatura_e_transporte,
                              }),
                            }),
                          }),
                        ],
                      }),
                    _jsxs("section", {
                      id: "armazenamento",
                      children: [
                        !conferidos.armazenamento &&
                          _jsx("div", {
                            className: "row campo-correcao mb-4",
                            children: _jsx("div", {
                              className: "col-12",
                              children: _jsx(TextArea, {
                                label:
                                  "Indica\u00E7\u00F5es de Corre\u00E7\u00F5es CODAE",
                                valorInicial:
                                  ficha?.analise?.armazenamento_correcoes,
                                disabled: true,
                              }),
                            }),
                          }),
                        _jsx("div", {
                          className: "row",
                          children: _jsx("div", {
                            className: "col",
                            children:
                              "Informa\u00E7\u00F5es que constar\u00E3o da rotulagem das embalagens prim\u00E1ria e secund\u00E1ria, fechadas.",
                          }),
                        }),
                        _jsx("div", {
                          className: "row mt-3",
                          children: _jsx("div", {
                            className: "col",
                            children: _jsx(Field, {
                              component: TextArea,
                              label: "Embalagem Prim\u00E1ria:",
                              name: `embalagem_primaria`,
                              className: "textarea-ficha-tecnica",
                              placeholder:
                                "Digite as informa\u00E7\u00F5es de armazenamento para embalagem prim\u00E1ria",
                              required: true,
                              validate: required,
                              disabled: conferidos.armazenamento,
                            }),
                          }),
                        }),
                        _jsx("div", {
                          className: "row mt-3",
                          children: _jsx("div", {
                            className: "col",
                            children: _jsx(Field, {
                              component: TextArea,
                              label: "Embalagem Secund\u00E1ria:",
                              name: `embalagem_secundaria`,
                              className: "textarea-ficha-tecnica",
                              placeholder:
                                "Digite as informa\u00E7\u00F5es de armazenamento para embalagem secund\u00E1ria",
                              required: true,
                              validate: required,
                              disabled: conferidos.armazenamento,
                            }),
                          }),
                        }),
                      ],
                    }),
                    _jsxs("section", {
                      id: "embalagem_e_rotulagem",
                      children: [
                        !conferidos.embalagem_e_rotulagem &&
                          _jsx("div", {
                            className: "row campo-correcao mb-4",
                            children: _jsx("div", {
                              className: "col-12",
                              children: _jsx(TextArea, {
                                label:
                                  "Indica\u00E7\u00F5es de Corre\u00E7\u00F5es CODAE",
                                valorInicial:
                                  ficha?.analise
                                    ?.embalagem_e_rotulagem_correcoes,
                                disabled: true,
                              }),
                            }),
                          }),
                        _jsx("div", {
                          className: "row",
                          children: _jsx("div", {
                            className: "subtitulo",
                            children: "Embalagem",
                          }),
                        }),
                        _jsx("div", {
                          className: "row mt-3",
                          children: _jsx("div", {
                            className: "col",
                            children: _jsx(Field, {
                              name: `embalagens_de_acordo_com_anexo`,
                              component: CheckboxComBorda,
                              label:
                                "Declaro que as embalagens prim\u00E1ria e secund\u00E1ria em que\n                            ser\u00E3o entregues o produto estar\u00E3o de acordo com as\n                            especifica\u00E7\u00F5es do Anexo I do Edital.",
                              disabled: true,
                            }),
                          }),
                        }),
                        _jsx("div", {
                          className: "row mt-3",
                          children: _jsx("div", {
                            className: "col",
                            children: _jsx(Field, {
                              component: TextArea,
                              label:
                                "Descreva o material de embalagem prim\u00E1ria:",
                              name: `material_embalagem_primaria`,
                              className: "textarea-ficha-tecnica",
                              placeholder:
                                "Digite as informa\u00E7\u00F5es da embalagem prim\u00E1ria",
                              required: true,
                              validate: required,
                              disabled: conferidos.embalagem_e_rotulagem,
                            }),
                          }),
                        }),
                        ehNaoPerecivel &&
                          _jsxs("div", {
                            className: "row mt-3",
                            children: [
                              _jsxs("div", {
                                className: "col-6 px-0",
                                children: [
                                  _jsx("div", {
                                    className: "row",
                                    children: _jsx(Label, {
                                      content: "O produto \u00E9 l\u00EDquido?",
                                      disabled: true,
                                    }),
                                  }),
                                  _jsxs("div", {
                                    className: "row",
                                    children: [
                                      _jsx("div", {
                                        className: "col-2",
                                        children: _jsxs("label", {
                                          className: "container-radio",
                                          children: [
                                            "N\u00E3o",
                                            _jsx(Field, {
                                              component: "input",
                                              type: "radio",
                                              value: "0",
                                              name: `produto_eh_liquido`,
                                              validate: required,
                                              disabled:
                                                conferidos.embalagem_e_rotulagem,
                                            }),
                                            _jsx("span", {
                                              className: "checkmark",
                                            }),
                                          ],
                                        }),
                                      }),
                                      _jsx("div", {
                                        className: "col-2",
                                        children: _jsxs("label", {
                                          className: "container-radio",
                                          children: [
                                            "Sim",
                                            _jsx(Field, {
                                              component: "input",
                                              type: "radio",
                                              value: "1",
                                              name: `produto_eh_liquido`,
                                              validate: required,
                                              disabled:
                                                conferidos.embalagem_e_rotulagem,
                                            }),
                                            _jsx("span", {
                                              className: "checkmark",
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              values.produto_eh_liquido === "1" &&
                                _jsxs("div", {
                                  className: "col-6 px-0",
                                  children: [
                                    _jsx("div", {
                                      className: "row",
                                      children: _jsx(Label, {
                                        content:
                                          "Volume do Produto na Embalagem Prim\u00E1ria:",
                                      }),
                                    }),
                                    _jsxs("div", {
                                      className: "row",
                                      children: [
                                        _jsx("div", {
                                          className: "col",
                                          children: _jsx(Field, {
                                            component: InputText,
                                            name: `volume_embalagem_primaria`,
                                            placeholder: "Digite o Volume",
                                            className: "input-ficha-tecnica",
                                            required: true,
                                            validate: composeValidators(
                                              required,
                                              inteiroOuDecimalComVirgula
                                            ),
                                            disabled:
                                              conferidos.embalagem_e_rotulagem,
                                          }),
                                        }),
                                        _jsx("div", {
                                          className: "col",
                                          children: _jsx(Field, {
                                            component: Select,
                                            naoDesabilitarPrimeiraOpcao: true,
                                            options: [
                                              {
                                                nome: "Unidade de Medida",
                                                uuid: "",
                                              },
                                              ...unidadesMedidaOptions,
                                            ],
                                            name: `unidade_medida_volume_primaria`,
                                            className: "input-ficha-tecnica",
                                            required: true,
                                            validate: required,
                                            disabled:
                                              conferidos.embalagem_e_rotulagem,
                                          }),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                            ],
                          }),
                        _jsxs("div", {
                          className: "row mt-3",
                          children: [
                            _jsxs("div", {
                              className: "row",
                              children: [
                                _jsx("div", {
                                  className: "col-6",
                                  children: _jsx(Label, {
                                    content:
                                      "Peso L\u00EDquido do Produto na Embalagem Prim\u00E1ria:",
                                  }),
                                }),
                                _jsx("div", {
                                  className: "col-6",
                                  children: _jsx(Label, {
                                    content:
                                      "Peso L\u00EDquido do Produto na Embalagem Secund\u00E1ria:",
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
                                    name: `peso_liquido_embalagem_primaria`,
                                    placeholder: "Digite o Peso",
                                    className: "input-ficha-tecnica",
                                    required: true,
                                    validate: composeValidators(
                                      required,
                                      inteiroOuDecimalComVirgula
                                    ),
                                    disabled: conferidos.embalagem_e_rotulagem,
                                  }),
                                }),
                                _jsx("div", {
                                  className: "col-3",
                                  children: _jsx(Field, {
                                    component: Select,
                                    naoDesabilitarPrimeiraOpcao: true,
                                    options: [
                                      { nome: "Unidade de Medida", uuid: "" },
                                      ...unidadesMedidaOptions,
                                    ],
                                    name: `unidade_medida_primaria`,
                                    className: "input-ficha-tecnica",
                                    required: true,
                                    validate: required,
                                    disabled: conferidos.embalagem_e_rotulagem,
                                  }),
                                }),
                                _jsx("div", {
                                  className: "col-3",
                                  children: _jsx(Field, {
                                    component: InputText,
                                    name: `peso_liquido_embalagem_secundaria`,
                                    placeholder: "Digite o Peso",
                                    className: "input-ficha-tecnica",
                                    required: true,
                                    validate: composeValidators(
                                      required,
                                      inteiroOuDecimalComVirgula
                                    ),
                                    disabled: conferidos.embalagem_e_rotulagem,
                                  }),
                                }),
                                _jsx("div", {
                                  className: "col-3",
                                  children: _jsx(Field, {
                                    component: Select,
                                    naoDesabilitarPrimeiraOpcao: true,
                                    options: [
                                      { nome: "Unidade de Medida", uuid: "" },
                                      ...unidadesMedidaOptions,
                                    ],
                                    name: `unidade_medida_secundaria`,
                                    className: "input-ficha-tecnica",
                                    required: true,
                                    validate: required,
                                    disabled: conferidos.embalagem_e_rotulagem,
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                        _jsxs("div", {
                          className: "row mt-3",
                          children: [
                            _jsxs("div", {
                              className: "row",
                              children: [
                                _jsx("div", {
                                  className: "col-6",
                                  children: _jsx(Label, {
                                    content:
                                      "Peso da Embalagem Prim\u00E1ria Vazia:",
                                  }),
                                }),
                                _jsx("div", {
                                  className: "col-6",
                                  children: _jsx(Label, {
                                    content:
                                      "Peso da Embalagem Secund\u00E1ria Vazia:",
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
                                    name: `peso_embalagem_primaria_vazia`,
                                    placeholder: "Digite o Peso",
                                    className: "input-ficha-tecnica",
                                    required: true,
                                    validate: composeValidators(
                                      required,
                                      inteiroOuDecimalComVirgula
                                    ),
                                    disabled: conferidos.embalagem_e_rotulagem,
                                  }),
                                }),
                                _jsx("div", {
                                  className: "col-3",
                                  children: _jsx(Field, {
                                    component: Select,
                                    naoDesabilitarPrimeiraOpcao: true,
                                    options: [
                                      { nome: "Unidade de Medida", uuid: "" },
                                      ...unidadesMedidaOptions,
                                    ],
                                    name: `unidade_medida_primaria_vazia`,
                                    className: "input-ficha-tecnica",
                                    required: true,
                                    validate: required,
                                    disabled: conferidos.embalagem_e_rotulagem,
                                  }),
                                }),
                                _jsx("div", {
                                  className: "col-3",
                                  children: _jsx(Field, {
                                    component: InputText,
                                    name: `peso_embalagem_secundaria_vazia`,
                                    placeholder: "Digite o Peso",
                                    className: "input-ficha-tecnica",
                                    required: true,
                                    validate: composeValidators(
                                      required,
                                      inteiroOuDecimalComVirgula
                                    ),
                                    disabled: conferidos.embalagem_e_rotulagem,
                                  }),
                                }),
                                _jsx("div", {
                                  className: "col-3",
                                  children: _jsx(Field, {
                                    component: Select,
                                    naoDesabilitarPrimeiraOpcao: true,
                                    options: [
                                      { nome: "Unidade de Medida", uuid: "" },
                                      ...unidadesMedidaOptions,
                                    ],
                                    name: `unidade_medida_secundaria_vazia`,
                                    className: "input-ficha-tecnica",
                                    required: true,
                                    validate: required,
                                    disabled: conferidos.embalagem_e_rotulagem,
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                        ehPerecivel &&
                          _jsxs("div", {
                            className: "row mt-3",
                            children: [
                              _jsx("div", {
                                className: "row",
                                children: _jsx("div", {
                                  className: "col-6",
                                  children: _jsx(Label, {
                                    content:
                                      "Varia\u00E7\u00E3o Porcentual do Peso do Produto ao Descongelar:",
                                    disabled: true,
                                  }),
                                }),
                              }),
                              _jsxs("div", {
                                className: "row",
                                children: [
                                  _jsx("div", {
                                    className: "col-2",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      name: `variacao_percentual`,
                                      placeholder: "Digite % do Peso",
                                      className: "input-ficha-tecnica",
                                      required: true,
                                      validate: composeValidators(
                                        required,
                                        inteiroOuDecimalComVirgula
                                      ),
                                      disabled:
                                        conferidos.embalagem_e_rotulagem,
                                    }),
                                  }),
                                  _jsx("div", {
                                    className:
                                      "col-1 label-unidade-medida label-unidade-medida-top",
                                    children: _jsx("span", { children: "%" }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        _jsx("div", {
                          className: "row mt-3",
                          children: _jsx("div", {
                            className: "col",
                            children: _jsx(Field, {
                              component: TextArea,
                              label:
                                "Descrever o Sistema de Veda\u00E7\u00E3o da Embalagem Secund\u00E1ria:",
                              name: `sistema_vedacao_embalagem_secundaria`,
                              className: "textarea-ficha-tecnica",
                              placeholder:
                                "Digite as informa\u00E7\u00F5es da embalagem secund\u00E1ria",
                              required: true,
                              validate: required,
                              disabled: conferidos.embalagem_e_rotulagem,
                            }),
                          }),
                        }),
                        _jsx("hr", {}),
                        _jsx("div", {
                          className: "row",
                          children: _jsx("div", {
                            className: "subtitulo",
                            children: "Rotulagem",
                          }),
                        }),
                        _jsx("div", {
                          className: "row mt-3",
                          children: _jsx("div", {
                            className: "col",
                            children: _jsx(Field, {
                              name: `rotulo_legivel`,
                              component: CheckboxComBorda,
                              label:
                                "Declaro que no r\u00F3tulo da embalagem prim\u00E1ria e, se for o\n                            caso, da secund\u00E1ria, constar\u00E3o, de forma leg\u00EDvel e indel\u00E9vel,\n                            todas as informa\u00E7\u00F5es solicitadas do Anexo I do Edital.",
                              disabled: true,
                            }),
                          }),
                        }),
                      ],
                    }),
                    _jsxs("section", {
                      id: "responsavel_tecnico",
                      children: [
                        _jsx("div", {
                          className: "row",
                          children: _jsx("div", {
                            className: "col",
                            children: _jsx(Field, {
                              component: InputText,
                              label:
                                "Nome completo do Respons\u00E1vel T\u00E9cnico:",
                              name: `nome_responsavel_tecnico`,
                              placeholder: "Digite o nome completo",
                              className: "input-ficha-tecnica",
                              required: true,
                              validate: required,
                              disabled: conferidos.responsavel_tecnico,
                            }),
                          }),
                        }),
                        _jsxs("div", {
                          className: "row mt-3",
                          children: [
                            _jsx("div", {
                              className: "col-6",
                              children: _jsx(Field, {
                                component: InputText,
                                label: "Habilita\u00E7\u00E3o:",
                                name: `habilitacao`,
                                placeholder: "Digite a habilita\u00E7\u00E3o",
                                className: "input-ficha-tecnica",
                                required: true,
                                validate: required,
                                disabled: conferidos.responsavel_tecnico,
                              }),
                            }),
                            _jsx("div", {
                              className: "col-6",
                              children: _jsx(Field, {
                                component: InputText,
                                label:
                                  "N\u00BA do Registro em \u00D3rg\u00E3o Competente:",
                                name: `numero_registro_orgao`,
                                placeholder: "Digite o n\u00FAmero do registro",
                                className: "input-ficha-tecnica",
                                required: true,
                                validate: required,
                                disabled: conferidos.responsavel_tecnico,
                              }),
                            }),
                          ],
                        }),
                        _jsx("div", {
                          className: "row mt-3",
                          children: _jsx("div", {
                            className: "col-4",
                            children: _jsx(BotaoAnexo, {
                              urlAnexo: ficha.arquivo,
                            }),
                          }),
                        }),
                      ],
                    }),
                    _jsx("section", {
                      id: "modo_preparo",
                      children: _jsx("div", {
                        className: "row",
                        children: _jsx("div", {
                          className: "col",
                          children: _jsx(Field, {
                            component: TextArea,
                            label: "Descreva o modo de preparo do produto:",
                            name: `modo_de_preparo`,
                            className: "textarea-ficha-tecnica",
                            disabled: true,
                          }),
                        }),
                      }),
                    }),
                    _jsx("section", {
                      id: "outras_informacoes",
                      children: _jsx("div", {
                        className: "row",
                        children: _jsx("div", {
                          className: "col",
                          children: _jsx(Field, {
                            component: TextArea,
                            label: "Informa\u00E7\u00F5es Adicionais:",
                            name: `informacoes_adicionais`,
                            className: "textarea-ficha-tecnica",
                            disabled: true,
                          }),
                        }),
                      }),
                    }),
                  ],
                }),
                _jsxs("div", {
                  className: "my-5",
                  children: [
                    _jsx(Botao, {
                      texto: "Salvar e Enviar",
                      type: BUTTON_TYPE.BUTTON,
                      style: BUTTON_STYLE.GREEN,
                      className: "float-end ms-3",
                      onClick: () => setShowModalAssinatura(true),
                      disabled: Object.keys(errors).length !== 0,
                    }),
                    _jsx(Botao, {
                      texto: "Voltar",
                      type: BUTTON_TYPE.BUTTON,
                      style: BUTTON_STYLE.GREEN_OUTLINE,
                      className: "float-end ms-3",
                      onClick: () => {
                        setShowModalVoltar(true);
                      },
                    }),
                  ],
                }),
                _jsx(ModalAssinaturaUsuario, {
                  show: showModalAssinatura,
                  handleClose: () => setShowModalAssinatura(false),
                  handleSim: (password) => {
                    const payload = formataPayloadCorrecaoFichaTecnica(
                      values,
                      conferidos,
                      ficha.categoria === "PERECIVEIS",
                      password
                    );
                    assinarCorrigirFichaTecnica(
                      payload,
                      ficha,
                      setCarregando,
                      navigate
                    );
                  },
                  loading: carregando,
                  titulo:
                    "Salvar e Enviar as Altera\u00E7\u00F5es na Ficha T\u00E9cnica",
                  texto: `Deseja Salvar e Enviar as alterações da Ficha Técnica ${ficha.numero}?`,
                  textoBotao: "Sim",
                }),
                _jsx(ModalVoltar, {
                  modalVoltar: showModalVoltar,
                  voltarPara: `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
                  setModalVoltar: setShowModalVoltar,
                }),
              ],
            });
          },
        }),
      }),
    }),
  });
};
