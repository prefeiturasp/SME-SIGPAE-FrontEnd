import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { required } from "src/helpers/fieldValidators";
import React, { useEffect } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { AdicionarResposta } from "./components/BotaoAdicionar";
import { Ocorrencia } from "./components/Ocorrencia";
import { OcorrenciaNaoSeAplica } from "./components/OcorrenciaNaoSeAplica";
export const Formulario = ({ ...props }) => {
  const {
    tiposOcorrencia,
    form,
    values,
    escolaSelecionada,
    respostasOcorrencias,
    respostasOcorrenciaNaoSeAplica,
    push,
    somenteLeitura,
  } = props;
  const exibeBotaoAdicionar = (tipoOcorrencia) => {
    return (
      !somenteLeitura &&
      tipoOcorrencia.aceita_multiplas_respostas &&
      tipoOcorrencia.parametrizacoes.length > 0
    );
  };
  const setRespostas = (respostas) => {
    respostas.forEach((_resposta) => {
      form.change(
        `grupos_${_resposta.parametrizacao.tipo_ocorrencia}[${
          _resposta.grupo - 1
        }].tipoocorrencia_${
          _resposta.parametrizacao.tipo_ocorrencia
        }_parametrizacao_${_resposta.parametrizacao.uuid}_uuid_${
          _resposta.uuid
        }`,
        _resposta.resposta
      );
    });
  };
  useEffect(() => {
    if (respostasOcorrencias.length || respostasOcorrenciaNaoSeAplica.length) {
      tiposOcorrencia.forEach((tipoOcorrencia) => {
        const _respostas = respostasOcorrencias.filter(
          (_ocorr) =>
            _ocorr.parametrizacao.tipo_ocorrencia === tipoOcorrencia.uuid
        );
        const _respostaNaoSeAplica = respostasOcorrenciaNaoSeAplica.find(
          (_ocorr) => _ocorr.tipo_ocorrencia === tipoOcorrencia.uuid
        );
        if (_respostas.length > 0) {
          form.change(`ocorrencia_${tipoOcorrencia.uuid}`, "nao");
          setRespostas(_respostas);
        } else if (_respostaNaoSeAplica) {
          form.change(`ocorrencia_${tipoOcorrencia.uuid}`, "nao_se_aplica");
          form.change(
            `descricao_${tipoOcorrencia.uuid}`,
            _respostaNaoSeAplica.descricao
          );
        } else {
          form.change(`ocorrencia_${tipoOcorrencia.uuid}`, "sim");
        }
      });
    } else {
      tiposOcorrencia.forEach((tipoOcorrencia) => {
        form.change(`ocorrencia_${tipoOcorrencia.uuid}`, "sim");
      });
    }
  }, [escolaSelecionada, respostasOcorrencias, respostasOcorrenciaNaoSeAplica]);
  let currentIndex = 0;
  let prevPosition;
  let prevCategoria;
  const getIndicePosicao = (tipoOcorrencia) => {
    if (
      tipoOcorrencia.categoria.uuid !== prevCategoria ||
      tipoOcorrencia.posicao !== prevPosition
    ) {
      currentIndex++;
    }
    prevCategoria = tipoOcorrencia.categoria.uuid;
    prevPosition = tipoOcorrencia.posicao;
    return currentIndex;
  };
  const getRowSpanTiposOcorrenciaMesmaPosicao = (tipoOcorrencia) => {
    const tiposOcorrenciaMesmaPosicao = tiposOcorrencia.filter(
      (tipoOcorrencia_) =>
        tipoOcorrencia_.categoria.uuid === tipoOcorrencia.categoria.uuid &&
        tipoOcorrencia_.posicao === tipoOcorrencia.posicao
    );
    let rowSpan = tiposOcorrenciaMesmaPosicao.length;
    tiposOcorrenciaMesmaPosicao.forEach((tipoOcorrencia_) => {
      if (
        values[`ocorrencia_${tipoOcorrencia_.uuid}`] === "nao" ||
        values[`ocorrencia_${tipoOcorrencia_.uuid}`] === "nao_se_aplica"
      ) {
        rowSpan += 1;
        if (
          exibeBotaoAdicionar(tipoOcorrencia_) &&
          values[`ocorrencia_${tipoOcorrencia_.uuid}`] === "nao"
        )
          rowSpan += values[`grupos_${tipoOcorrencia_.uuid}`].length;
      }
    });
    return rowSpan;
  };
  const getRowSpan = (tipoOcorrencia) => {
    if (
      tiposOcorrencia.filter(
        (tipoOcorrencia_) =>
          tipoOcorrencia_.categoria.uuid === tipoOcorrencia.categoria.uuid &&
          tipoOcorrencia_.posicao === tipoOcorrencia.posicao
      ).length > 1
    ) {
      return getRowSpanTiposOcorrenciaMesmaPosicao(tipoOcorrencia);
    }
    let rowSpan = 1;
    if (
      values[`ocorrencia_${tipoOcorrencia.uuid}`] === "nao" ||
      values[`ocorrencia_${tipoOcorrencia.uuid}`] === "nao_se_aplica"
    ) {
      rowSpan = 2;
      if (
        exibeBotaoAdicionar(tipoOcorrencia) &&
        values[`ocorrencia_${tipoOcorrencia.uuid}`] === "nao"
      )
        rowSpan += values[`grupos_${tipoOcorrencia.uuid}`].length;
    }
    return rowSpan;
  };
  const exibeColunaIndice = (tipoOcorrencia, index) => {
    return (
      index === 0 ||
      tipoOcorrencia.categoria.uuid !==
        tiposOcorrencia[index - 1].categoria.uuid ||
      tipoOcorrencia.posicao !== tiposOcorrencia[index - 1].posicao
    );
  };
  return _jsxs("div", {
    className: "formulario",
    children: [
      _jsx("div", {
        className: "row mt-3 mb-3",
        children: _jsxs("div", {
          className: "col-12 text-center",
          children: [
            _jsx("h2", {
              children:
                "ITENS AVALIADOS NA VISITA E DE RESPONSABILIDADE DA EMPRESA PRESTADORA DE SERVI\u00C7O",
            }),
            _jsx("div", {
              className: "subtitle",
              children:
                "Caso a presta\u00E7\u00E3o de servi\u00E7os tenha apresentado ocorr\u00EAncias sinalize nos itens correspondentes abaixo",
            }),
          ],
        }),
      }),
      _jsx("div", {
        className: "row",
        children: _jsx("div", {
          className: "col-12",
          children: _jsx("table", {
            children: tiposOcorrencia.map((tipoOcorrencia, index) => {
              return _jsxs(
                React.Fragment,
                {
                  children: [
                    (index === 0 ||
                      tipoOcorrencia.categoria.nome !==
                        tiposOcorrencia[index - 1].categoria.nome) &&
                      _jsxs(_Fragment, {
                        children: [
                          _jsx("tr", {
                            className: "categoria",
                            children: _jsx("th", {
                              className: "pb-3",
                              colSpan: 3,
                              children: tipoOcorrencia.categoria.nome,
                            }),
                          }),
                          tipoOcorrencia.categoria.gera_notificacao &&
                            _jsx("tr", {
                              className: "frequencia",
                              children: _jsxs("th", {
                                className: "pb-3",
                                colSpan: 3,
                                children: [
                                  "Maior Frequ\u00EAncia Registrada:",
                                  values.maior_frequencia_no_periodo &&
                                    _jsxs("span", {
                                      className: "highlight",
                                      children: [
                                        " ",
                                        values.maior_frequencia_no_periodo,
                                        " alunos",
                                      ],
                                    }),
                                ],
                              }),
                            }),
                        ],
                      }),
                    _jsxs("tr", {
                      className: "tipo-ocorrencia",
                      children: [
                        exibeColunaIndice(tipoOcorrencia, index) &&
                          _jsx("td", {
                            rowSpan: getRowSpan(tipoOcorrencia),
                            className: "fw-bold text-center",
                            children: getIndicePosicao(tipoOcorrencia),
                          }),
                        _jsxs("td", {
                          className: "p-3",
                          children: [
                            _jsxs("div", {
                              children: [
                                _jsxs("b", {
                                  children: [tipoOcorrencia.titulo, ":"],
                                }),
                                " ",
                                tipoOcorrencia.descricao,
                              ],
                            }),
                            _jsx("div", {
                              children: _jsxs("b", {
                                children: [
                                  "Penalidade:",
                                  " ",
                                  tipoOcorrencia.penalidade.numero_clausula,
                                  " Obriga\u00E7\u00E3o:",
                                  " ",
                                  tipoOcorrencia.penalidade.obrigacoes.toString(),
                                ],
                              }),
                            }),
                          ],
                        }),
                        _jsx("td", {
                          children: _jsxs("div", {
                            className: "ms-3 my-3",
                            children: [
                              _jsx(Field, {
                                name: `ocorrencia_${tipoOcorrencia.uuid}`,
                                component: "input",
                                type: "radio",
                                value: "sim",
                                id: `sim_${tipoOcorrencia.uuid}`,
                                required: true,
                                validate: required,
                                disabled: somenteLeitura,
                              }),
                              _jsx("label", {
                                className: "ms-2",
                                htmlFor: `sim_${tipoOcorrencia.uuid}`,
                                children: "Sim",
                              }),
                              _jsxs("div", {
                                className: "mt-2",
                                children: [
                                  _jsx(Field, {
                                    name: `ocorrencia_${tipoOcorrencia.uuid}`,
                                    component: "input",
                                    type: "radio",
                                    value: "nao",
                                    id: `nao_${tipoOcorrencia.uuid}`,
                                    required: true,
                                    validate: required,
                                    disabled: somenteLeitura,
                                  }),
                                  _jsx("label", {
                                    className: "ms-2",
                                    htmlFor: `nao_${tipoOcorrencia.uuid}`,
                                    children: "N\u00E3o",
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "mt-2",
                                children: [
                                  _jsx(Field, {
                                    name: `ocorrencia_${tipoOcorrencia.uuid}`,
                                    component: "input",
                                    type: "radio",
                                    value: "nao_se_aplica",
                                    id: `nao_se_aplica_${tipoOcorrencia.uuid}`,
                                    required: true,
                                    validate: required,
                                    disabled: somenteLeitura,
                                  }),
                                  _jsx("label", {
                                    className: "ms-2",
                                    htmlFor: `nao_se_aplica_${tipoOcorrencia.uuid}`,
                                    children: "N\u00E3o se aplica",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                    values[`ocorrencia_${tipoOcorrencia.uuid}`] ===
                      "nao_se_aplica" &&
                      _jsx(OcorrenciaNaoSeAplica, {
                        tipoOcorrencia: tipoOcorrencia,
                        somenteLeitura: somenteLeitura,
                      }),
                    values[`ocorrencia_${tipoOcorrencia.uuid}`] === "nao" &&
                      _jsxs(_Fragment, {
                        children: [
                          _jsx(FieldArray, {
                            name: `grupos_${tipoOcorrencia.uuid}`,
                            children: ({ fields }) =>
                              fields.map((name, indexFieldArray) =>
                                _jsx(
                                  React.Fragment,
                                  {
                                    children: _jsx(
                                      Ocorrencia,
                                      {
                                        name_grupos: name,
                                        tipoOcorrencia: tipoOcorrencia,
                                        form: form,
                                        escolaSelecionada: escolaSelecionada,
                                        indexFieldArray: indexFieldArray,
                                        respostasOcorrencias:
                                          respostasOcorrencias,
                                        somenteLeitura: somenteLeitura,
                                      },
                                      indexFieldArray
                                    ),
                                  },
                                  indexFieldArray
                                )
                              ),
                          }),
                          exibeBotaoAdicionar(tipoOcorrencia) &&
                            _jsx("tr", {
                              className: "adicionar text-center",
                              children: _jsx("td", {
                                colSpan: 2,
                                className: "py-3",
                                children: _jsx(AdicionarResposta, {
                                  push: push,
                                  nameFieldArray: `grupos_${tipoOcorrencia.uuid}`,
                                }),
                              }),
                            }),
                        ],
                      }),
                  ],
                },
                index
              );
            }),
          }),
        }),
      }),
    ],
  });
};
