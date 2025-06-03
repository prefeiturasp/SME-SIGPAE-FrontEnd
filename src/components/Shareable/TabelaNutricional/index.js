import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import "./styles.scss";
import { Field } from "react-final-form";
import {
  required,
  composeValidators,
  inteiroOuDecimalComVirgula,
} from "src/helpers/fieldValidators";
import InputText from "src/components/Shareable/Input/InputText";
import SelectSelecione from "src/components/Shareable/SelectSelecione";
const TAXA_CONVERSAO_KCAL_KJ = 4.2;
const TabelaNutricional = ({
  values,
  listaCompletaInformacoesNutricionais,
  informacoesNutricionaisCarregadas,
  desabilitar,
}) => {
  const [
    informacoesNutricionaisAdicionais,
    setInformacoesNutricionaisAdicionais,
  ] = useState(
    informacoesNutricionaisCarregadas.filter(({ eh_fixo }) => !eh_fixo)
  );
  useEffect(() => {
    setInformacoesNutricionaisAdicionais(
      informacoesNutricionaisCarregadas.filter(({ eh_fixo }) => !eh_fixo)
    );
  }, [informacoesNutricionaisCarregadas]);
  const adicionarInformacaoNutricional = () => {
    const informacoesAtualizadas = [...informacoesNutricionaisAdicionais];
    informacoesAtualizadas.push({
      uuid: "",
      nome: "",
      medida: "",
      eh_fixo: false,
      eh_dependente: false,
      tipo_nutricional: { uuid: "", nome: "" },
    });
    setInformacoesNutricionaisAdicionais(informacoesAtualizadas);
  };
  const removerInformacaoNutricional = (index) => {
    const uuid_deletado = informacoesNutricionaisAdicionais[index].uuid;
    for (let i = index; i < informacoesNutricionaisAdicionais.length; i++) {
      values[`informacao_adicional_${i}`] =
        values[`informacao_adicional_${i + 1}`];
    }
    delete values[`quantidade_por_100g_${uuid_deletado}`];
    delete values[`quantidade_porcao_${uuid_deletado}`];
    delete values[`valor_diario_${uuid_deletado}`];
    const informacoesAtualizadas = [...informacoesNutricionaisAdicionais];
    informacoesAtualizadas.splice(index, 1);
    setInformacoesNutricionaisAdicionais(informacoesAtualizadas);
  };
  const gerarOptionsInformacoes = (informacao) => {
    const removeFixos = ({ eh_fixo }) => !eh_fixo;
    const removeJaSelecionados = ({ uuid }) =>
      !informacoesNutricionaisAdicionais.map(({ uuid }) => uuid).includes(uuid);
    const transformaEmOption = ({ nome, uuid }) => {
      return { nome, uuid };
    };
    const options = listaCompletaInformacoesNutricionais
      .filter(removeFixos)
      .filter(removeJaSelecionados)
      .map(transformaEmOption);
    informacao.uuid &&
      options.push({ uuid: informacao.uuid, nome: informacao.nome });
    options.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    return options;
  };
  const converterDeKcalParaKj = (valor) =>
    ((Number(valor?.replace(",", ".")) || 0) * TAXA_CONVERSAO_KCAL_KJ)
      .toFixed(2)
      .replace(".", ",");
  return _jsxs("div", {
    className: "tabela-nutricional",
    children: [
      _jsxs("article", {
        children: [
          _jsxs("div", {
            className: "grid-table header-table",
            children: [
              _jsx("div", { children: "Informa\u00E7\u00E3o Nutricional" }),
              _jsx("div", { children: "Quantidade por 100g ou 100 ml" }),
              _jsx("div", { children: "Quantidade por por\u00E7\u00E3o" }),
              _jsx("div", { children: "% VD(*)" }),
            ],
          }),
          listaCompletaInformacoesNutricionais
            ?.filter(({ eh_fixo }) => eh_fixo)
            .map((informacao) =>
              _jsxs(
                "div",
                {
                  className: "grid-table body-table",
                  children: [
                    _jsx("div", {
                      className: "table-cell",
                      children: _jsx("span", {
                        className: `${
                          informacao.eh_dependente && "informacao-recuada"
                        }`,
                        children: informacao.nome,
                      }),
                    }),
                    _jsxs("div", {
                      className: "table-cell",
                      children: [
                        _jsx(Field, {
                          component: InputText,
                          proibeLetras: true,
                          name: `quantidade_por_100g_${informacao.uuid}`,
                          className: "input-tabela-nutricional",
                          required: true,
                          validate: composeValidators(
                            required,
                            inteiroOuDecimalComVirgula
                          ),
                          disabled: desabilitar,
                        }),
                        _jsx("span", { children: informacao.medida }),
                      ],
                    }),
                    _jsxs("div", {
                      className: "table-cell",
                      children: [
                        _jsx(Field, {
                          component: InputText,
                          proibeLetras: true,
                          name: `quantidade_porcao_${informacao.uuid}`,
                          className: "input-tabela-nutricional",
                          required: true,
                          validate: composeValidators(
                            required,
                            inteiroOuDecimalComVirgula
                          ),
                          disabled: desabilitar,
                        }),
                        _jsx("span", { children: informacao.medida }),
                        informacao.nome.toUpperCase() === "VALOR ENERGÉTICO" &&
                          _jsxs(_Fragment, {
                            children: [
                              _jsx("span", { children: "=" }),
                              _jsx(InputText, {
                                className: "input-tabela-nutricional",
                                valorInicial: converterDeKcalParaKj(
                                  values[`quantidade_porcao_${informacao.uuid}`]
                                ),
                                disabled: true,
                              }),
                              _jsx("span", { children: "KJ" }),
                            ],
                          }),
                      ],
                    }),
                    _jsxs("div", {
                      className: "table-cell",
                      children: [
                        _jsx(Field, {
                          component: InputText,
                          proibeLetras: true,
                          name: `valor_diario_${informacao.uuid}`,
                          className: "input-tabela-nutricional",
                          required: true,
                          validate: composeValidators(
                            required,
                            inteiroOuDecimalComVirgula
                          ),
                          disabled: desabilitar,
                        }),
                        _jsx("span", { children: "%" }),
                      ],
                    }),
                  ],
                },
                informacao.uuid
              )
            ),
          informacoesNutricionaisAdicionais?.map((informacao, index) =>
            _jsxs(
              "div",
              {
                className: "grid-table body-table",
                children: [
                  _jsx("div", {
                    className: "table-cell",
                    children: _jsx(Field, {
                      component: SelectSelecione,
                      options: gerarOptionsInformacoes(informacao),
                      name: `informacao_adicional_${index}`,
                      placeholder: "Selecione uma informa\u00E7\u00E3o",
                      className: "input-tabela-nutricional",
                      disabled: desabilitar,
                      onChangeEffect: (e) => {
                        const dadosInformacao =
                          listaCompletaInformacoesNutricionais
                            .filter(({ uuid }) => uuid === e.target.value)
                            .pop();
                        const informacoesAtualizadas = [
                          ...informacoesNutricionaisAdicionais,
                        ];
                        informacoesAtualizadas[index] = dadosInformacao;
                        setInformacoesNutricionaisAdicionais(
                          informacoesAtualizadas
                        );
                      },
                    }),
                  }),
                  informacao.uuid
                    ? _jsxs(_Fragment, {
                        children: [
                          _jsxs("div", {
                            className: "table-cell",
                            children: [
                              _jsx(Field, {
                                component: InputText,
                                proibeLetras: true,
                                name: `quantidade_por_100g_${informacao.uuid}`,
                                className: "input-tabela-nutricional",
                                required: true,
                                validate: composeValidators(
                                  required,
                                  inteiroOuDecimalComVirgula
                                ),
                                disabled: desabilitar,
                              }),
                              _jsx("span", { children: informacao.medida }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "table-cell",
                            children: [
                              _jsx(Field, {
                                component: InputText,
                                proibeLetras: true,
                                name: `quantidade_porcao_${informacao.uuid}`,
                                className: "input-tabela-nutricional",
                                required: true,
                                validate: composeValidators(
                                  required,
                                  inteiroOuDecimalComVirgula
                                ),
                                disabled: desabilitar,
                              }),
                              _jsx("span", { children: informacao.medida }),
                              informacao.nome.toUpperCase() ===
                                "VALOR ENERGÉTICO" &&
                                _jsxs(_Fragment, {
                                  children: [
                                    _jsx("span", { children: "=" }),
                                    _jsx(Field, {
                                      component: InputText,
                                      proibeLetras: true,
                                      name: `quantidade_porcao_kj_${informacao.uuid}`,
                                      className: "input-tabela-nutricional",
                                      valorInicial: converterDeKcalParaKj(
                                        values[
                                          `quantidade_porcao_${informacao.uuid}`
                                        ]
                                      ),
                                      disabled: true,
                                    }),
                                    _jsx("span", { children: "KJ" }),
                                  ],
                                }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "table-cell",
                            children: [
                              _jsx(Field, {
                                component: InputText,
                                proibeLetras: true,
                                name: `valor_diario_${informacao.uuid}`,
                                className: "input-tabela-nutricional",
                                required: true,
                                validate: composeValidators(
                                  required,
                                  inteiroOuDecimalComVirgula
                                ),
                                disabled: desabilitar,
                              }),
                              _jsx("span", { children: "%" }),
                              !desabilitar &&
                                _jsx("span", {
                                  className: "botao-remover-informacao",
                                  children: _jsx("button", {
                                    onClick: () =>
                                      removerInformacaoNutricional(index),
                                    children: _jsx("i", {
                                      title: "Remover",
                                      className: "fas fa-times",
                                    }),
                                  }),
                                }),
                            ],
                          }),
                        ],
                      })
                    : _jsxs(_Fragment, {
                        children: [
                          _jsx("div", { className: "table-cell" }),
                          _jsx("div", { className: "table-cell" }),
                          _jsx("div", {
                            className: "table-cell",
                            children: _jsx("span", {
                              className: "botao-remover-informacao",
                              children: _jsx("button", {
                                onClick: () =>
                                  removerInformacaoNutricional(index),
                                children: _jsx("i", {
                                  title: "Remover",
                                  className: "fas fa-times",
                                }),
                              }),
                            }),
                          }),
                        ],
                      }),
                ],
              },
              informacao.uuid
            )
          ),
          !desabilitar &&
            _jsx("div", {
              className: "grid-table body-table",
              children: _jsx("div", {
                className: "table-cell",
                children: _jsx("button", {
                  onClick: adicionarInformacaoNutricional,
                  children:
                    "+ Adicionar Outra Informa\u00E7\u00E3o Nutricional",
                }),
              }),
            }),
        ],
      }),
      _jsxs("p", {
        className: "obs-tabela-nutricional",
        children: [
          "* Percentual de valores di\u00E1rios fornecidos pela por\u00E7\u00E3o.",
          _jsx("br", {}),
          '** VD n\u00E3o estabelecidos (valores com a informa\u00E7\u00E3o "0" na tabela nutricional).',
        ],
      }),
    ],
  });
};
export default TabelaNutricional;
