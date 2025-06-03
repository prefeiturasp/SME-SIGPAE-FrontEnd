import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import { Select } from "src/components/Shareable/Select";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import { getError } from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { useState } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { encerraContratoTerceirizada } from "src/services/terceirizada.service";
import { VIGENCIA_STATUS } from "../../../ConsultaEditaisContratos/constants";
import { ModalEncerrarContrato } from "../ModalEncerrarContrato.tsx";
export const FieldArrayContratos = ({
  form,
  values,
  push,
  lotes,
  DREs,
  empresas,
  getEditalContratoAsync,
}) => {
  const [showModalEncerrarContrato, setShowModalEncerrarContrato] =
    useState(false);
  const [contratoAEncerrar, setContratoAEncerrar] = useState(undefined);
  const renderizarLabelLote = (selected, options) => {
    if (selected.length === 0) {
      return "Selecione um ou mais lotes...";
    }
    if (selected.length === options.length) {
      return "Todos os lotes foram selecionados";
    }
    if (selected.length === 1) {
      return `${selected.length} lote selecionado`;
    }
    return `${selected.length} lotes selecionados`;
  };
  const renderizarDiretoriaRegional = (selected, options) => {
    if (selected.length === 0) {
      return "Selecione uma ou mais diretorias...";
    }
    if (selected.length === options.length) {
      return "Todas as diretorias foram selecionadas";
    }
    if (selected.length === 1) {
      return `${selected.length} diretoria selecionada`;
    }
    return `${selected.length} diretorias selecionadas`;
  };
  const removeContrato = (index_contratos) => {
    form.change(
      `contratos`,
      values.contratos.filter((_, i) => i !== index_contratos)
    );
  };
  const exibeBotaoRemoverVigencia = (indexVigencia, index_contratos) => {
    return (
      indexVigencia > 0 &&
      !values.contratos[index_contratos].encerrado &&
      (!values.contratos[index_contratos].vigencias[indexVigencia]?.uuid ||
        moment(
          values.contratos[index_contratos].vigencias[indexVigencia]
            ?.data_final,
          "DD/MM/YYYY"
        ).toDate() > new Date())
    );
  };
  const removeVigencia = (index_contratos, indexVigencia) => {
    form.change(
      `contratos[${index_contratos}].vigencias`,
      values.contratos[index_contratos].vigencias.filter(
        (_, i) => i !== indexVigencia
      )
    );
  };
  const exibeAvisoVigenciaVencida = (indexVigencia, index_contratos) => {
    return (
      indexVigencia ===
        values.contratos[index_contratos]?.vigencias.length - 1 &&
      values.contratos[index_contratos]?.vigencias[indexVigencia]?.status ===
        VIGENCIA_STATUS.VENCIDO
    );
  };
  const exibeAvisoContratoEncerrado = (indexVigencia, index_contratos) => {
    return (
      indexVigencia ===
        values.contratos[index_contratos]?.vigencias.length - 1 &&
      values.contratos[index_contratos].encerrado
    );
  };
  const encerrarContrato = async (contrato) => {
    const response = await encerraContratoTerceirizada(contrato.uuid);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Contrato encerrado com sucesso!");
      setShowModalEncerrarContrato(false);
      getEditalContratoAsync(values.uuid);
    } else {
      toastError(getError(response.data));
    }
  };
  const exibeRemoverContrato = (index_contratos) => {
    return (
      index_contratos > 0 &&
      (!values.contratos[index_contratos]?.uuid ||
        moment(
          values.contratos[index_contratos]?.vigencias[0]?.data_inicial,
          "DD/MM/YYYY"
        ).toDate() > new Date())
    );
  };
  const getMinDateDataInicial = (index_contratos, indexVigencia) => {
    return indexVigencia === 0
      ? null
      : moment(
          values.contratos[index_contratos].vigencias[indexVigencia - 1]
            ?.data_final,
          "DD/MM/YYYY"
        ).toDate();
  };
  const getMinDateDataFinal = (index_contratos, indexVigencia) => {
    return indexVigencia === 0
      ? moment(
          values.contratos[index_contratos].vigencias[indexVigencia]
            .data_inicial,
          "DD/MM/YYYY"
        ).toDate()
      : moment(
          values.contratos[index_contratos].vigencias[indexVigencia - 1]
            ?.data_final,
          "DD/MM/YYYY"
        ).toDate();
  };
  const getDataInicialDisabled = (index_contratos, indexVigencia) => {
    return (
      values.contratos[index_contratos].encerrado ||
      (values.contratos[index_contratos].vigencias[indexVigencia]?.uuid &&
        moment(
          values.contratos[index_contratos].vigencias[indexVigencia]
            ?.data_inicial,
          "DD/MM/YYYY"
        ).toDate() <= new Date())
    );
  };
  const getDataFinalDisabled = (index_contratos, indexVigencia) => {
    return (
      values.contratos[index_contratos].encerrado ||
      (values.contratos[index_contratos].vigencias[indexVigencia]?.uuid &&
        moment(
          values.contratos[index_contratos].vigencias[indexVigencia]
            ?.data_final,
          "DD/MM/YYYY"
        ).toDate() <= new Date())
    );
  };
  return _jsx(FieldArray, {
    name: "contratos",
    children: ({ fields }) =>
      fields.map((name_contratos, index_contratos) =>
        _jsxs(
          "div",
          {
            children: [
              _jsx("div", {
                className: "row mt-3 mb-3",
                children: _jsx("div", {
                  className: "col-12",
                  children: _jsxs("div", {
                    className: "title",
                    children: [
                      _jsx("span", {
                        className: `com-linha ${
                          exibeRemoverContrato(index_contratos)
                            ? "w-78"
                            : "w-100"
                        }`,
                        children: "Contratos Relacionados",
                      }),
                      exibeRemoverContrato(index_contratos) &&
                        _jsxs("span", {
                          onClick: () => {
                            removeContrato(index_contratos);
                          },
                          className: "remover float-end",
                          children: [
                            _jsx("i", { className: "fas fa-trash" }),
                            " Remover contrato",
                          ],
                        }),
                    ],
                  }),
                }),
              }),
              _jsxs("div", {
                className: "row",
                children: [
                  _jsx("div", {
                    className: "col-8",
                    children: _jsx(Field, {
                      name: `${name_contratos}.processo`,
                      label: "Processo administrativo do contrato",
                      placeholder:
                        "Digite o n\u00FAmero do processo administrativo",
                      component: InputText,
                      required: true,
                      validate: required,
                      max: 50,
                    }),
                  }),
                  _jsx("div", {
                    className: "col-4",
                    children: _jsx(Field, {
                      name: `${name_contratos}.data_proposta`,
                      label: "Data da proposta",
                      placeholder: "Selecione a data da proposta",
                      component: InputComData,
                      validate: required,
                      minDate: null,
                      required: true,
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
                      name: `${name_contratos}.numero`,
                      component: InputText,
                      label: "N\u00BA do Contrato",
                      placeholder: "Digite o n\u00FAmero do contrato",
                      required: true,
                      validate: required,
                    }),
                  }),
                  _jsx(FieldArray, {
                    name: `${name_contratos}.vigencias`,
                    children: ({ fields }) =>
                      fields.map((name_vigencias, indexVigencia) =>
                        _jsxs(_Fragment, {
                          children: [
                            _jsx("div", {
                              className: `col-4`,
                              children: _jsx(Field, {
                                component: InputComData,
                                label: `${
                                  indexVigencia > 0 ? "Nova " : ""
                                }Vigência`,
                                name: `${name_vigencias}.data_inicial`,
                                placeholder: "DE",
                                writable: false,
                                minDate: getMinDateDataInicial(
                                  index_contratos,
                                  indexVigencia
                                ),
                                maxDate: moment(
                                  values.contratos[index_contratos].vigencias[
                                    indexVigencia
                                  ]?.data_final,
                                  "DD/MM/YYYY"
                                ).toDate(),
                                required: true,
                                validate: required,
                                disabled: getDataInicialDisabled(
                                  index_contratos,
                                  indexVigencia
                                ),
                              }),
                            }),
                            _jsx("div", {
                              className: `col-4`,
                              children: _jsx(Field, {
                                component: InputComData,
                                label: "\u00A0",
                                name: `${name_vigencias}.data_final`,
                                placeholder: "AT\u00C9",
                                writable: false,
                                minDate: getMinDateDataFinal(
                                  index_contratos,
                                  indexVigencia
                                ),
                                maxDate: null,
                                disabled: getDataFinalDisabled(
                                  index_contratos,
                                  indexVigencia
                                ),
                              }),
                            }),
                            indexVigencia > 0 &&
                              !exibeBotaoRemoverVigencia(
                                indexVigencia,
                                index_contratos
                              ) &&
                              _jsx("div", { className: "col-2" }),
                            exibeBotaoRemoverVigencia(
                              indexVigencia,
                              index_contratos
                            ) &&
                              _jsx("div", {
                                className: "col-2 mt-auto mb-2",
                                children: _jsx(Botao, {
                                  texto: "Remover",
                                  type: BUTTON_TYPE.BUTTON,
                                  onClick: () =>
                                    removeVigencia(
                                      index_contratos,
                                      indexVigencia
                                    ),
                                  style: BUTTON_STYLE.RED_OUTLINE,
                                }),
                              }),
                            exibeAvisoVigenciaVencida(
                              indexVigencia,
                              index_contratos
                            ) &&
                              _jsx("div", {
                                className: "pt-3 pb-3",
                                style: {
                                  paddingLeft: "12px",
                                  paddingRight: "12px",
                                },
                                children: _jsxs("div", {
                                  className: "aviso vencido",
                                  children: [
                                    _jsx("b", { children: "Aviso:" }),
                                    " Contrato fora do prazo de vig\u00EAncia.",
                                  ],
                                }),
                              }),
                            exibeAvisoContratoEncerrado(
                              indexVigencia,
                              index_contratos
                            ) &&
                              _jsx("div", {
                                className: "pt-3 pb-3",
                                style: {
                                  paddingLeft: "12px",
                                  paddingRight: "12px",
                                },
                                children: _jsxs("div", {
                                  className: "aviso encerrado",
                                  children: [
                                    _jsx("b", { children: "Aviso:" }),
                                    " Contrato encerrado em",
                                    " ",
                                    values.contratos[index_contratos]
                                      .data_hora_encerramento,
                                  ],
                                }),
                              }),
                          ],
                        })
                      ),
                  }),
                ],
              }),
              !values.contratos[index_contratos].encerrado &&
                _jsx("div", {
                  className: "row mt-3",
                  children: _jsxs("div", {
                    className: "col-12",
                    children: [
                      _jsx(Botao, {
                        texto: "Adicionar Vig\u00EAncia",
                        onClick: () => push(`${name_contratos}.vigencias`),
                        style: BUTTON_STYLE.GREEN_OUTLINE,
                        type: BUTTON_TYPE.BUTTON,
                        disabled:
                          !values.contratos[index_contratos]?.vigencias[
                            values.contratos[index_contratos].vigencias.length -
                              1
                          ]?.data_final,
                      }),
                      values.uuid &&
                        _jsx(Botao, {
                          texto: "Encerrar contrato",
                          className: "ms-3",
                          onClick: () => {
                            setContratoAEncerrar(
                              values.contratos[index_contratos]
                            );
                            setShowModalEncerrarContrato(true);
                          },
                          style: BUTTON_STYLE.RED_OUTLINE,
                          type: BUTTON_TYPE.BUTTON,
                          disabled:
                            !values.contratos[index_contratos]?.vigencias[
                              values.contratos[index_contratos].vigencias
                                .length - 1
                            ]?.data_final,
                        }),
                      contratoAEncerrar &&
                        _jsx(ModalEncerrarContrato, {
                          showModal: showModalEncerrarContrato,
                          closeModal: () => setShowModalEncerrarContrato(false),
                          contrato: contratoAEncerrar,
                          encerrarContrato: async (contrato) =>
                            await encerrarContrato(contrato),
                        }),
                    ],
                  }),
                }),
              _jsxs("div", {
                className: "row mt-3",
                children: [
                  _jsxs("div", {
                    className: "col-6",
                    children: [
                      _jsxs("label", {
                        className: "label fw-normal",
                        children: [
                          _jsx("span", {
                            className: "required-asterisk",
                            children: "* ",
                          }),
                          "Lote",
                        ],
                      }),
                      _jsx(Field, {
                        component: StatefulMultiSelect,
                        name: `${name_contratos}.lotes`,
                        selected:
                          values.contratos[index_contratos]?.lotes || [],
                        options: lotes.map((lote) => ({
                          label: lote.nome,
                          value: lote.uuid,
                        })),
                        onSelectedChanged: (values_) => {
                          form.change(
                            `contratos[${index_contratos}].lotes`,
                            values_
                          );
                        },
                        overrideStrings: {
                          search: "Busca",
                          selectSomeItems: "Selecione",
                          allItemsAreSelected:
                            "Todos os lotes estão selecionados",
                          selectAll: "Todos",
                        },
                        valueRenderer: renderizarLabelLote,
                        validate: required,
                      }),
                      values.contratos[index_contratos]?.lotes?.length > 0 &&
                        _jsxs("div", {
                          className: "lotes-selecionados pt-3",
                          children: [
                            _jsx("div", {
                              className: "mb-3",
                              children: "Lotes selecionados:",
                            }),
                            lotes
                              .filter((lote) =>
                                values.contratos[
                                  index_contratos
                                ].lotes.includes(lote.uuid)
                              )
                              .map((lote, indice) => {
                                return _jsx(
                                  "span",
                                  {
                                    className: "value-selected-unities",
                                    children: `${lote.nome} | `,
                                  },
                                  indice
                                );
                              }),
                          ],
                        }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "col-6",
                    children: [
                      _jsxs("label", {
                        className: "label fw-normal",
                        children: [
                          _jsx("span", {
                            className: "required-asterisk",
                            children: "* ",
                          }),
                          "DRE",
                        ],
                      }),
                      _jsx(Field, {
                        component: StatefulMultiSelect,
                        name: `${name_contratos}.diretorias_regionais`,
                        selected:
                          values.contratos[index_contratos]
                            ?.diretorias_regionais || [],
                        options: DREs.map((dre) => ({
                          label: dre.nome,
                          value: dre.uuid,
                        })),
                        onSelectedChanged: (values_) => {
                          form.change(
                            `contratos[${index_contratos}].diretorias_regionais`,
                            values_
                          );
                        },
                        overrideStrings: {
                          search: "Busca",
                          selectSomeItems: "Selecione",
                          allItemsAreSelected:
                            "Todos as diretorias regionais estão selecionadas",
                          selectAll: "Todos",
                        },
                        valueRenderer: renderizarDiretoriaRegional,
                        validate: required,
                      }),
                      values.contratos[index_contratos]?.diretorias_regionais
                        ?.length > 0 &&
                        _jsxs("div", {
                          className: "lotes-selecionados pt-3",
                          children: [
                            _jsx("div", {
                              className: "mb-3",
                              children: "DREs selecionadas:",
                            }),
                            DREs.filter((dre) =>
                              values.contratos[
                                index_contratos
                              ]?.diretorias_regionais.includes(dre.uuid)
                            ).map((dre, indice) => {
                              return _jsx(
                                "div",
                                {
                                  className: "value-selected-unities",
                                  children: dre.nome,
                                },
                                indice
                              );
                            }),
                          ],
                        }),
                    ],
                  }),
                ],
              }),
              _jsx("div", {
                className: "row mt-3",
                children: _jsxs("div", {
                  className: "col-12",
                  children: [
                    _jsxs("label", {
                      className: "label fw-normal",
                      children: [
                        _jsx("span", {
                          className: "required-asterisk",
                          children: "* ",
                        }),
                        "Empresa",
                      ],
                    }),
                    _jsx(Field, {
                      component: Select,
                      name: `${name_contratos}.terceirizada`,
                      options: [
                        {
                          nome: "Selecione uma empresa",
                          uuid: "",
                        },
                      ].concat(
                        empresas.map((empresa) => {
                          return {
                            nome: empresa.nome_fantasia,
                            uuid: empresa.uuid,
                          };
                        })
                      ),
                      required: true,
                      validate: required,
                      naoDesabilitarPrimeiraOpcao: true,
                    }),
                  ],
                }),
              }),
            ],
          },
          name_contratos
        )
      ),
  });
};
