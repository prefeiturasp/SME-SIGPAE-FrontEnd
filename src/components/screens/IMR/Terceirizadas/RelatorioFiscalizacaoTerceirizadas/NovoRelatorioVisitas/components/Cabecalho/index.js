import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Spin } from "antd";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import Select from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  maxValueMaiorFrequenciaNoPeriodoIMR,
  required,
} from "src/helpers/fieldValidators";
import {
  composeValidators,
  converterDDMMYYYYparaYYYYMMDD,
} from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { useEffect, useState } from "react";
import { Field } from "react-final-form";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import {
  getEscolasTercTotal,
  getQuantidadeAlunosMatriculadosPorData,
} from "src/services/escola.service";
import {
  exportarPDFRelatorioFiscalizacao,
  getPeriodosVisita,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
export const Cabecalho = ({ ...props }) => {
  const [diretoriasRegionais, setDiretoriasRegionais] = useState();
  const [escolas, setEscolas] = useState([]);
  const [periodosVisita, setPeriodosVisita] = useState();
  const [loadingEscolas, setLoadingEscolas] = useState(false);
  const [loadingTotalMatriculadosPorData, setLoadingTotalMatriculadosPorData] =
    useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [imprimindoPDF, setImprimindoPDF] = useState(false);
  const [erroAPI, setErroAPI] = useState("");
  const {
    form,
    values,
    setEscolaSelecionada,
    getTiposOcorrenciaPorEditalNutrisupervisaoAsync,
    setTiposOcorrencia,
    somenteLeitura,
    isEditing,
  } = props;
  const initialValues = form.getState().initialValues;
  const getDiretoriasRegionaisAsync = async () => {
    const response = await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      setDiretoriasRegionais(
        response.data.results.map((dre) => {
          return {
            nome: dre.nome,
            uuid: dre.uuid,
          };
        })
      );
    } else {
      setErroAPI("Erro ao carregar DREs. Tente novamente mais tarde.");
    }
  };
  const getEscolasTercTotalAsync = async (dreUuid) => {
    setLoadingEscolas(true);
    const response = await getEscolasTercTotal({
      dre: dreUuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setEscolas(
        response.data.map((escola) => {
          return {
            label: `${escola.codigo_eol} - ${escola.nome}`,
            value: `${escola.codigo_eol} - ${escola.nome}`,
            uuid: escola.uuid,
            lote_nome: escola.lote_obj?.nome,
            edital: escola.lote_obj?.contratos_do_lote.find(
              (lote) => !lote.encerrado
            )?.edital,
            terceirizada: escola.terceirizada,
          };
        })
      );
    } else {
      setErroAPI("Erro ao carregar escolas. Tente novamente mais tarde.");
    }
    setLoadingEscolas(false);
  };
  const setEscolaInitialValues = async (initialValues) => {
    const _escola = initialValues.escola;
    if (_escola) {
      form.change("escola", `${_escola.codigo_eol} - ${_escola.nome}`);
      form.change("lote", _escola?.lote);
      form.change("terceirizada", _escola?.terceirizada);
      setEscolaSelecionada(_escola);
      await getTiposOcorrenciaPorEditalNutrisupervisaoAsync(form, _escola);
      await getTotalAlunosMatriculadosPorData(values.data, _escola.uuid);
    }
  };
  const getTotalAlunosMatriculadosPorData = async (data, escolaUUID) => {
    setLoadingTotalMatriculadosPorData(true);
    const response = await getQuantidadeAlunosMatriculadosPorData({
      escola_uuid: escolaUUID,
      data: converterDDMMYYYYparaYYYYMMDD(data),
    });
    if (response.status === HTTP_STATUS.OK) {
      form.change("total_matriculados_por_data", response.data);
    } else {
      setErroAPI(
        "Erro ao carregar quantidade alunos matriculados por data. Tente novamente mais tarde."
      );
    }
    setLoadingTotalMatriculadosPorData(false);
  };
  const exportarPDF = async () => {
    setImprimindoPDF(true);
    const response = await exportarPDFRelatorioFiscalizacao({
      uuid: values.uuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao baixar PDF. Tente novamente mais tarde");
    }
    setImprimindoPDF(false);
  };
  const getPeriodosVisitaAsync = async () => {
    const response = await getPeriodosVisita();
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosVisita(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar Períodos de Visita. Tente novamente mais tarde."
      );
    }
  };
  const requisicoesPreRender = async () => {
    await Promise.all([
      getDiretoriasRegionaisAsync(),
      getPeriodosVisitaAsync(),
    ]);
  };
  useEffect(() => {
    requisicoesPreRender();
  }, []);
  useEffect(() => {
    if (initialValues && initialValues.escola) {
      setEscolaInitialValues(initialValues);
    }
  }, [initialValues]);
  const LOADING = !diretoriasRegionais || !periodosVisita;
  return _jsxs(_Fragment, {
    children: [
      erroAPI && _jsx("div", { children: erroAPI }),
      !erroAPI &&
        _jsxs(Spin, {
          tip: "Carregando...",
          spinning: LOADING,
          children: [
            !LOADING &&
              _jsxs("div", {
                className: "cabecalho",
                children: [
                  _jsxs("div", {
                    className: "row",
                    children: [
                      _jsx("div", {
                        className: "col-11",
                        children: _jsx("h2", {
                          className: "mt-2 mb-4",
                          children: "Dados da Unidade Educacional",
                        }),
                      }),
                      values.status &&
                        values.status !== "EM_PREENCHIMENTO" &&
                        _jsx("div", {
                          className: "col-1 text-end",
                          children: _jsx(Botao, {
                            style: imprimindoPDF
                              ? BUTTON_STYLE.GREEN_OUTLINE
                              : BUTTON_STYLE.GREEN,
                            icon: imprimindoPDF
                              ? BUTTON_ICON.LOADING
                              : BUTTON_ICON.FILE_PDF,
                            disabled: imprimindoPDF,
                            onClick: () => exportarPDF(),
                          }),
                        }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "row",
                    children: [
                      _jsx("div", {
                        className: "col-5",
                        children: _jsx(Field, {
                          component: Select,
                          options: [
                            { nome: "Selecione uma DRE", uuid: "" },
                            ...diretoriasRegionais,
                          ],
                          name: "diretoria_regional",
                          label: "Diretoria Regional de Educa\u00E7\u00E3o",
                          validate: required,
                          required: true,
                          disabled: isEditing || somenteLeitura,
                          onChangeEffect: (e) => {
                            const value = e.target.value;
                            setTiposOcorrencia(undefined);
                            form.change("escola", undefined);
                            form.change("lote", undefined);
                            form.change("terceirizada", undefined);
                            form.change(
                              "total_matriculados_por_data",
                              undefined
                            );
                            form.change(
                              "maior_frequencia_no_periodo",
                              undefined
                            );
                            getEscolasTercTotalAsync(value);
                          },
                        }),
                      }),
                      _jsx("div", {
                        className: "col-7",
                        children: _jsx(Spin, {
                          tip: "Carregando...",
                          spinning: loadingEscolas,
                          children: _jsx(Field, {
                            component: AutoCompleteField,
                            options: escolas,
                            filterOption: (inputValue, option) =>
                              option.label
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1,
                            name: "escola",
                            label: "Unidade Educacional",
                            placeholder: "Selecione uma Unidade",
                            required: true,
                            disabled:
                              !values.diretoria_regional ||
                              loadingEscolas ||
                              isEditing ||
                              somenteLeitura,
                            inputOnChange: async (value) => {
                              setTiposOcorrencia(undefined);
                              const _escola = escolas.find(
                                (e) => e.value === value
                              );
                              if (_escola) {
                                form.change(
                                  "total_matriculados_por_data",
                                  undefined
                                );
                                form.change(
                                  "maior_frequencia_no_periodo",
                                  undefined
                                );
                                form.change("lote", _escola?.lote_nome);
                                form.change(
                                  "terceirizada",
                                  _escola?.terceirizada
                                );
                                await setEscolaSelecionada(_escola);
                                await getTiposOcorrenciaPorEditalNutrisupervisaoAsync(
                                  form,
                                  _escola
                                );
                                if (values.data && _escola) {
                                  await getTotalAlunosMatriculadosPorData(
                                    values.data,
                                    _escola.uuid
                                  );
                                }
                              } else {
                                setEscolaSelecionada(undefined);
                              }
                            },
                          }),
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
                          label: "Lote",
                          name: "lote",
                          placeholder: "Lote da Unidade",
                          required: true,
                          validate: required,
                          disabled: true,
                        }),
                      }),
                      _jsx("div", {
                        className: "col-8",
                        children: _jsx(Field, {
                          component: InputText,
                          label: "Empresa Terceirizada",
                          name: "terceirizada",
                          required: true,
                          validate: required,
                          placeholder:
                            "Nome da Empresa Prestadora de Servi\u00E7o",
                          disabled: true,
                        }),
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "row",
                    children: _jsxs("div", {
                      className: "col-12",
                      children: [
                        _jsx("hr", {}),
                        _jsx("h2", {
                          className: "mt-2 mb-4",
                          children: "Dados da Visita",
                        }),
                      ],
                    }),
                  }),
                  _jsxs("div", {
                    className: "row",
                    children: [
                      _jsx("div", {
                        className: "col-4",
                        children: _jsx(Field, {
                          component: InputComData,
                          name: "data",
                          label: "Data da Visita",
                          placeholder: "Selecione uma data",
                          minDate: null,
                          maxDate: moment().toDate(),
                          required: true,
                          validate: required,
                          disabled: somenteLeitura,
                          inputOnChange: (value) => {
                            form.change(
                              "total_matriculados_por_data",
                              undefined
                            );
                            form.change(
                              "maior_frequencia_no_periodo",
                              undefined
                            );
                            if (props.escolaSelecionada) {
                              getTotalAlunosMatriculadosPorData(
                                value,
                                props.escolaSelecionada.uuid
                              );
                            }
                          },
                        }),
                      }),
                      _jsx("div", {
                        className: "col-4",
                        children: _jsx(Field, {
                          component: Select,
                          options: [
                            { nome: "Selecione um Período", uuid: "" },
                            ...periodosVisita,
                          ],
                          naoDesabilitarPrimeiraOpcao: true,
                          name: "periodo_visita",
                          label: "Per\u00EDodo de Visita",
                          validate: required,
                          required: true,
                          disabled: somenteLeitura,
                        }),
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "row",
                    children: [
                      _jsx("div", {
                        className: "col-4",
                        children: _jsx(Spin, {
                          tip: "Carregando...",
                          spinning: loadingTotalMatriculadosPorData,
                          children: _jsx(Field, {
                            component: InputText,
                            type: "number",
                            label: "N\u00BA de Matriculados da Unidade",
                            name: "total_matriculados_por_data",
                            required: true,
                            disabled: true,
                          }),
                        }),
                      }),
                      _jsx("div", {
                        className: "col-4",
                        children: _jsx(Field, {
                          component: InputText,
                          type: "number",
                          label: "Maior N\u00BA de Frequentes no Per\u00EDodo",
                          name: "maior_frequencia_no_periodo",
                          tooltipText: "Refer\u00EAncia do m\u00EAs anterior",
                          required: true,
                          validate: composeValidators(
                            required,
                            maxValueMaiorFrequenciaNoPeriodoIMR(
                              values.total_matriculados_por_data
                            )
                          ),
                          min: 0,
                          placeholder: "Informe a quantidade",
                          disabled:
                            values.total_matriculados_por_data === null ||
                            values.total_matriculados_por_data === undefined ||
                            loadingTotalMatriculadosPorData ||
                            somenteLeitura,
                        }),
                      }),
                    ],
                  }),
                  _jsxs("section", {
                    className: "nutri-acompanhou-visita",
                    children: [
                      _jsx("div", {
                        className: "row mt-3 mb-3",
                        children: _jsx("div", {
                          className: "col-12",
                          children:
                            "Nutricionista RT da Empresa acompanhou a Visita?",
                        }),
                      }),
                      _jsxs("div", {
                        className: "row",
                        children: [
                          _jsxs("div", {
                            className: "col-2",
                            children: [
                              _jsx(Field, {
                                name: "acompanhou_visita",
                                component: "input",
                                type: "radio",
                                value: "sim",
                                id: "sim",
                                required: true,
                                validate: required,
                                disabled: somenteLeitura,
                              }),
                              _jsx("label", {
                                htmlFor: "sim",
                                children: "Sim",
                              }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "col-2",
                            children: [
                              _jsx(Field, {
                                name: "acompanhou_visita",
                                component: "input",
                                type: "radio",
                                value: "nao",
                                id: "nao",
                                required: true,
                                validate: required,
                                disabled: somenteLeitura,
                              }),
                              _jsx("label", {
                                htmlFor: "nao",
                                children: "N\u00E3o estava presente",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  values.acompanhou_visita === "sim" &&
                    _jsx("div", {
                      className: "row mt-3 mb-3",
                      children: _jsx("div", {
                        className: "col-8",
                        children: _jsx(Field, {
                          component: InputText,
                          label: "Nome da Nutricionista RT da Empresa",
                          name: "nome_nutricionista_empresa",
                          placeholder:
                            "Digite o Nome da Nutricionista da Empresa",
                          required: true,
                          validate: required,
                          disabled: somenteLeitura,
                        }),
                      }),
                    }),
                ],
              }),
            _jsx(ModalSolicitacaoDownload, {
              show: exibirModalCentralDownloads,
              setShow: setExibirModalCentralDownloads,
            }),
          ],
        }),
    ],
  });
};
