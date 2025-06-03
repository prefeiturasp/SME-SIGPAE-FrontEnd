import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field } from "react-final-form";
import Collapse from "src/components/Shareable/Collapse";
import InputText from "src/components/Shareable/Input/InputText";
import Label from "src/components/Shareable/Label";
import InputFile from "src/components/Shareable/Input/InputFile";
import Select from "src/components/Shareable/Select";
import CheckboxComBorda from "src/components/Shareable/CheckboxComBorda";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  required,
  composeValidators,
  inteiroOuDecimalComVirgula,
} from "src/helpers/fieldValidators";
import {
  inserirArquivoFichaAssinadaRT,
  removerArquivoFichaAssinadaRT,
} from "src/components/screens/PreRecebimento/FichaTecnica/helpers";
const COLLAPSE_CONFIG_INFO_ACONDICIONAMENTO = [
  {
    titulo: _jsx("span", {
      className: "verde-escuro",
      children: "Conserva\u00E7\u00E3o",
    }),
    camposObrigatorios: true,
  },
  {
    titulo: _jsx("span", {
      className: "verde-escuro",
      children: "Armazenamento",
    }),
    camposObrigatorios: true,
  },
  {
    titulo: _jsx("span", {
      className: "verde-escuro",
      children: "Embalagem e Rotulagem",
    }),
    camposObrigatorios: true,
  },
  {
    titulo: _jsx("span", {
      className: "verde-escuro",
      children: "Respons\u00E1vel T\u00E9cnico e Anexos",
    }),
    camposObrigatorios: true,
  },
  {
    titulo: _jsx("span", {
      className: "verde-escuro",
      children: "Modo de Preparo",
    }),
    camposObrigatorios: false,
  },
  {
    titulo: _jsx("span", {
      className: "verde-escuro",
      children: "Outras Informa\u00E7\u00F5es",
    }),
    camposObrigatorios: false,
  },
];
export default ({
  collapse,
  setCollapse,
  unidadesMedidaOptions,
  arquivo,
  setArquivo,
  values,
}) => {
  return _jsxs(Collapse, {
    collapse: collapse,
    setCollapse: setCollapse,
    id: "collapseFichaTecnica",
    collapseConfigs: COLLAPSE_CONFIG_INFO_ACONDICIONAMENTO,
    children: [
      _jsx("section", {
        id: "formConservacao",
        children: _jsx("div", {
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
            }),
          }),
        }),
      }),
      _jsxs("section", {
        id: "formArmazenamento",
        children: [
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
              }),
            }),
          }),
        ],
      }),
      _jsxs("section", {
        id: "formEmbalagemRotulagem",
        children: [
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
                dataTestId: "embalagens_de_acordo_com_anexo",
                component: CheckboxComBorda,
                label:
                  "Declaro que as embalagens prim\u00E1ria e secund\u00E1ria em que\n              ser\u00E3o entregues o produto estar\u00E3o de acordo com as\n              especifica\u00E7\u00F5es do Anexo I do Edital.",
              }),
            }),
          }),
          _jsx("div", {
            className: "row mt-3",
            children: _jsx("div", {
              className: "col",
              children: _jsx(Field, {
                component: TextArea,
                label: "Descreva o material de embalagem prim\u00E1ria:",
                name: `material_embalagem_primaria`,
                className: "textarea-ficha-tecnica",
                placeholder:
                  "Digite as informa\u00E7\u00F5es da embalagem prim\u00E1ria",
                required: true,
                validate: required,
              }),
            }),
          }),
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
                      required: true,
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
                            }),
                            _jsx("span", { className: "checkmark" }),
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
                            }),
                            _jsx("span", { className: "checkmark" }),
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
                        required: true,
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
                          }),
                        }),
                        _jsx("div", {
                          className: "col",
                          children: _jsx(Field, {
                            component: Select,
                            naoDesabilitarPrimeiraOpcao: true,
                            options: [
                              { nome: "Unidade de Medida", uuid: "" },
                              ...unidadesMedidaOptions,
                            ],
                            name: `unidade_medida_volume_primaria`,
                            className: "input-ficha-tecnica",
                            required: true,
                            validate: required,
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
                      required: true,
                    }),
                  }),
                  _jsx("div", {
                    className: "col-6",
                    children: _jsx(Label, {
                      content:
                        "Peso L\u00EDquido do Produto na Embalagem Secund\u00E1ria:",
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
                      name: `peso_liquido_embalagem_primaria`,
                      placeholder: "Digite o Peso",
                      className: "input-ficha-tecnica",
                      required: true,
                      validate: composeValidators(
                        required,
                        inteiroOuDecimalComVirgula
                      ),
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
                      content: "Peso da Embalagem Prim\u00E1ria Vazia:",
                      required: true,
                    }),
                  }),
                  _jsx("div", {
                    className: "col-6",
                    children: _jsx(Label, {
                      content: "Peso da Embalagem Secund\u00E1ria Vazia:",
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
                      name: `peso_embalagem_primaria_vazia`,
                      placeholder: "Digite o Peso",
                      className: "input-ficha-tecnica",
                      required: true,
                      validate: composeValidators(
                        required,
                        inteiroOuDecimalComVirgula
                      ),
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
                    }),
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
                dataTestId: "rotulo_legivel",
                component: CheckboxComBorda,
                label:
                  "Declaro que no r\u00F3tulo da embalagem prim\u00E1ria e, se for o\n              caso, da secund\u00E1ria, constar\u00E3o, de forma leg\u00EDvel e indel\u00E9vel,\n              todas as informa\u00E7\u00F5es solicitadas do Anexo I do Edital.",
              }),
            }),
          }),
        ],
      }),
      _jsxs("section", {
        id: "formResponsavelTecnico",
        children: [
          _jsx("div", {
            className: "row",
            children: _jsx("div", {
              className: "col",
              children: _jsx(Field, {
                component: InputText,
                label: "Nome completo do Respons\u00E1vel T\u00E9cnico:",
                name: `nome_responsavel_tecnico`,
                placeholder: "Digite o nome completo",
                className: "input-ficha-tecnica",
                required: true,
                validate: required,
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
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(Field, {
                  component: InputText,
                  label: "N\u00BA do Registro em \u00D3rg\u00E3o Competente:",
                  name: `numero_registro_orgao`,
                  placeholder: "Digite o n\u00FAmero do registro",
                  className: "input-ficha-tecnica",
                  required: true,
                  validate: required,
                }),
              }),
            ],
          }),
          _jsxs("div", {
            className: "row mt-3",
            children: [
              _jsx(Field, {
                component: InputFile,
                arquivosPreCarregados: arquivo,
                className: "inputfile",
                dataTestId: "arquivo",
                texto: "Anexar Ficha Assinada pelo RT",
                name: "arquivo",
                accept: "PDF",
                setFiles: (files) =>
                  inserirArquivoFichaAssinadaRT(files, setArquivo),
                removeFile: () => removerArquivoFichaAssinadaRT(setArquivo),
                toastSuccess: "Arquivo incluído com sucesso!",
                alignLeft: true,
              }),
              _jsxs("label", {
                className: "col-12 label-input",
                children: [
                  _jsx("span", {
                    className: "red",
                    children: "* Campo Obrigat\u00F3rio: \u00A0",
                  }),
                  "Envie um arquivo no formato: PDF, com at\u00E9 10MB",
                ],
              }),
            ],
          }),
        ],
      }),
      _jsx("section", {
        id: "formModoPreparo",
        children: _jsx("div", {
          className: "row",
          children: _jsx("div", {
            className: "col",
            children: _jsx(Field, {
              component: TextArea,
              label: "Descreva o modo de preparo do produto:",
              name: `modo_de_preparo`,
              className: "textarea-ficha-tecnica",
              placeholder:
                "Insira aqui as informa\u00E7\u00F5es de modo de preparo",
            }),
          }),
        }),
      }),
      _jsx("section", {
        id: "formOutrasInfos",
        children: _jsx("div", {
          className: "row",
          children: _jsx("div", {
            className: "col",
            children: _jsx(Field, {
              component: TextArea,
              label: "Informa\u00E7\u00F5es Adicionais:",
              name: `informacoes_adicionais`,
              className: "textarea-ficha-tecnica",
              placeholder:
                "Insira aqui as informa\u00E7\u00F5es adicionais sobre o produto",
            }),
          }),
        }),
      }),
    ],
  });
};
