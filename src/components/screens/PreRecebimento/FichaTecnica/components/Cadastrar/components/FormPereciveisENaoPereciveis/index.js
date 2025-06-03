import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { required } from "src/helpers/fieldValidators";
import InputText from "src/components/Shareable/Input/InputText";
const FormPereciveisENaoPereciveis = ({
  values,
  desabilitar = false,
  atualizacao = false,
}) => {
  return _jsxs("div", {
    children: [
      _jsxs("div", {
        className: "row",
        children: [
          _jsx("div", {
            className: "col-4",
            children: _jsx(Field, {
              component: InputText,
              dataTestId: "prazo_validade",
              label: "Prazo de Validade",
              name: `prazo_validade`,
              placeholder: "Informe o Prazo de Validade",
              className: "input-ficha-tecnica",
              required: true,
              validate: required,
              tooltipText:
                "Deve ser declarado o prazo em dias, meses ou anos a partir da data de fabricação.",
              disabled: desabilitar,
            }),
          }),
          _jsx("div", {
            className: "col-8",
            children: _jsx(Field, {
              component: InputText,
              dataTestId: "numero_registro",
              label:
                "N\u00BA do Registro do R\u00F3tulo do Produto e Nome do \u00D3rg\u00E3o Competente",
              name: `numero_registro`,
              placeholder:
                "Digite o N\u00FAmero do Registro do \u00D3rg\u00E3o Competente",
              className: "input-ficha-tecnica",
              disabled: desabilitar,
            }),
          }),
        ],
      }),
      _jsxs("div", {
        className: "row",
        children: [
          _jsxs("div", {
            className: "col-4",
            children: [
              _jsxs("p", {
                className: "label-radio",
                children: [
                  _jsx("span", {
                    className: "required-asterisk",
                    children: "*",
                  }),
                  "O Produto \u00E9 agroecol\u00F3gico?",
                ],
              }),
              _jsxs("label", {
                className: "container-radio",
                children: [
                  "N\u00E3o",
                  _jsx(Field, {
                    component: "input",
                    "data-testid": "agroecologico-nao",
                    type: "radio",
                    value: "0",
                    name: `agroecologico`,
                    validate: required,
                    disabled: desabilitar,
                  }),
                  _jsx("span", { className: "checkmark" }),
                ],
              }),
              _jsxs("label", {
                className: "container-radio",
                children: [
                  "Sim",
                  _jsx(Field, {
                    component: "input",
                    "data-testid": "agroecologico-sim",
                    type: "radio",
                    value: "1",
                    name: `agroecologico`,
                    validate: required,
                    disabled: desabilitar,
                  }),
                  _jsx("span", { className: "checkmark" }),
                ],
              }),
            ],
          }),
          _jsxs("div", {
            className: "col-4",
            children: [
              _jsxs("p", {
                className: "label-radio",
                children: [
                  _jsx("span", {
                    className: "required-asterisk",
                    children: "*",
                  }),
                  "O Produto \u00E9 org\u00E2nico?",
                ],
              }),
              _jsxs("label", {
                className: "container-radio",
                children: [
                  "N\u00E3o",
                  _jsx(Field, {
                    component: "input",
                    "data-testid": "organico-nao",
                    type: "radio",
                    value: "0",
                    name: `organico`,
                    validate: required,
                    disabled: desabilitar,
                  }),
                  _jsx("span", { className: "checkmark" }),
                ],
              }),
              _jsxs("label", {
                className: "container-radio",
                children: [
                  "Sim",
                  _jsx(Field, {
                    component: "input",
                    "data-testid": "organico-sim",
                    type: "radio",
                    value: "1",
                    name: `organico`,
                    validate: required,
                    disabled: desabilitar,
                  }),
                  _jsx("span", { className: "checkmark" }),
                ],
              }),
            ],
          }),
          values.organico === "1" &&
            _jsxs("div", {
              className: "col-4",
              children: [
                _jsxs("p", {
                  className: "label-radio",
                  children: [
                    _jsx("span", {
                      className: "required-asterisk",
                      children: "*",
                    }),
                    "Qual \u00E9 o mecanismo de controle?",
                  ],
                }),
                _jsxs("label", {
                  className: "container-radio",
                  children: [
                    "Certifica\u00E7\u00E3o",
                    _jsx(Field, {
                      component: "input",
                      type: "radio",
                      value: "CERTIFICACAO",
                      name: `mecanismo_controle`,
                      validate: required,
                      disabled: desabilitar,
                    }),
                    _jsx("span", { className: "checkmark" }),
                  ],
                }),
                _jsxs("label", {
                  className: "container-radio",
                  children: [
                    "OPAC",
                    _jsx(Field, {
                      component: "input",
                      type: "radio",
                      value: "OPAC",
                      name: `mecanismo_controle`,
                      validate: required,
                      disabled: desabilitar,
                    }),
                    _jsx("span", { className: "checkmark" }),
                  ],
                }),
                _jsxs("label", {
                  className: "container-radio",
                  children: [
                    "OCS",
                    _jsx(Field, {
                      component: "input",
                      type: "radio",
                      value: "OCS",
                      name: `mecanismo_controle`,
                      validate: required,
                      disabled: desabilitar,
                    }),
                    _jsx("span", { className: "checkmark" }),
                  ],
                }),
              ],
            }),
        ],
      }),
      _jsx("div", {
        className: "row",
        children: _jsx("div", {
          className: "col-12",
          children: _jsx(Field, {
            component: InputText,
            dataTestId: "componentes_produto",
            label: "Componentes do Produto",
            name: `componentes_produto`,
            placeholder:
              "Digite Todos os Componentes Utilizados na Composi\u00E7\u00E3o do Produto",
            className: "input-ficha-tecnica",
            required: true,
            validate: required,
            tooltipText:
              "Caso utilizado aditivos alimentares, deverá ser declarada a função principal, nome completo e número INS de todos.",
            disabled: desabilitar && !atualizacao,
          }),
        }),
      }),
      _jsx("div", {
        className: "row",
        children: _jsxs("div", {
          className: "col-12",
          children: [
            _jsxs("p", {
              className: "label-radio",
              children: [
                _jsx("span", { className: "required-asterisk", children: "*" }),
                "O Produto cont\u00E9m ou pode conter ingredientes/aditivos alerg\u00EAnicos?",
              ],
            }),
            _jsxs("label", {
              className: "container-radio",
              children: [
                "N\u00E3o",
                _jsx(Field, {
                  component: "input",
                  "data-testid": "alergenicos-nao",
                  type: "radio",
                  value: "0",
                  name: `alergenicos`,
                  validate: required,
                  disabled: desabilitar && !atualizacao,
                }),
                _jsx("span", { className: "checkmark" }),
              ],
            }),
            _jsxs("label", {
              className: "container-radio",
              children: [
                "Sim",
                _jsx(Field, {
                  component: "input",
                  "data-testid": "alergenicos-sim",
                  type: "radio",
                  value: "1",
                  name: `alergenicos`,
                  validate: required,
                  disabled: desabilitar && !atualizacao,
                }),
                _jsx("span", { className: "checkmark" }),
              ],
            }),
          ],
        }),
      }),
      values.alergenicos === "1" &&
        _jsx("div", {
          className: "row",
          children: _jsx("div", {
            className: "col-12",
            children: _jsx(Field, {
              component: InputText,
              label:
                "Quais ingredientes/aditivos alerg\u00EAnicos? Indicar conforme a RDC N\u00BA727/22, Anvisa.",
              name: `ingredientes_alergenicos`,
              className: "input-ficha-tecnica",
              required: true,
              validate: required,
              disabled: desabilitar && !atualizacao,
            }),
          }),
        }),
      _jsx("div", {
        className: "row",
        children: _jsxs("div", {
          className: "col-12",
          children: [
            _jsxs("p", {
              className: "label-radio",
              children: [
                _jsx("span", { className: "required-asterisk", children: "*" }),
                "O Produto cont\u00E9m gl\u00FAten? Indicar conforme Lei Federal N\u00BA 10.674/03, Anvisa.",
              ],
            }),
            _jsxs("label", {
              className: "container-radio",
              children: [
                "N\u00E3o cont\u00E9m gl\u00FAten",
                _jsx(Field, {
                  component: "input",
                  "data-testid": "gluten-nao",
                  type: "radio",
                  value: "0",
                  name: `gluten`,
                  validate: required,
                  disabled: desabilitar && !atualizacao,
                }),
                _jsx("span", { className: "checkmark" }),
              ],
            }),
            _jsxs("label", {
              className: "container-radio",
              children: [
                "Cont\u00E9m gl\u00FAten",
                _jsx(Field, {
                  component: "input",
                  "data-testid": "gluten-sim",
                  type: "radio",
                  value: "1",
                  name: `gluten`,
                  validate: required,
                  disabled: desabilitar && !atualizacao,
                }),
                _jsx("span", { className: "checkmark" }),
              ],
            }),
          ],
        }),
      }),
      _jsx("div", {
        className: "row",
        children: _jsxs("div", {
          className: "col-12",
          children: [
            _jsxs("p", {
              className: "label-radio",
              children: [
                _jsx("span", { className: "required-asterisk", children: "*" }),
                "O Produto cont\u00E9m lactose?",
              ],
            }),
            _jsxs("label", {
              className: "container-radio",
              children: [
                "N\u00E3o",
                _jsx(Field, {
                  component: "input",
                  "data-testid": "lactose-nao",
                  type: "radio",
                  value: "0",
                  name: `lactose`,
                  validate: required,
                  disabled: desabilitar,
                }),
                _jsx("span", { className: "checkmark" }),
              ],
            }),
            _jsxs("label", {
              className: "container-radio",
              children: [
                "Sim",
                _jsx(Field, {
                  component: "input",
                  "data-testid": "lactose-sim",
                  type: "radio",
                  value: "1",
                  name: `lactose`,
                  validate: required,
                  disabled: desabilitar,
                }),
                _jsx("span", { className: "checkmark" }),
              ],
            }),
          ],
        }),
      }),
      values.lactose === "1" &&
        _jsx("div", {
          className: "row",
          children: _jsx("div", {
            className: "col-12",
            children: _jsx(Field, {
              component: InputText,
              label: "Detalhar: Indicar conforme a RDC N\u00BA 727/22, Anvisa.",
              name: `lactose_detalhe`,
              className: "input-ficha-tecnica",
              required: true,
              validate: required,
              disabled: desabilitar,
            }),
          }),
        }),
    ],
  });
};
export default FormPereciveisENaoPereciveis;
