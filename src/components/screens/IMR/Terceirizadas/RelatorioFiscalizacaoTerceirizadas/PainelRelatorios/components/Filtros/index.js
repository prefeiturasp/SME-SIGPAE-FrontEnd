import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { useEffect, useState } from "react";
import { Field } from "react-final-form";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { InputComData } from "src/components/Shareable/DatePicker";
import Label from "src/components/Shareable/Label";
import Select from "src/components/Shareable/Select";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import { dateDelta } from "src/helpers/utilities.jsx";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { getEscolasTercTotal } from "src/services/escola.service";
import "./styles.scss";
import { getListNomesNutricionistas } from "src/services/imr/painelGerencial";
export const Filtros = ({
  filtros,
  setFiltros,
  setRelatoriosVisita,
  setConsultaRealizada,
  buscarResultados,
  form_,
  setForm,
  perfilNutriSupervisao,
}) => {
  const [diretoriasRegionais, setDiretoriasRegionais] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [loadingEscolas, setLoadingEscolas] = useState(false);
  const [nutricionistas, setNutricionistas] = useState([]);
  const buscarListaDREsAsync = async () => {
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
    }
  };
  const buscarListaEscolas = async (dreUuid) => {
    setLoadingEscolas(true);
    const response = await getEscolasTercTotal({ dre: dreUuid });
    if (response.status === HTTP_STATUS.OK) {
      setEscolas(
        response.data.map((escola) => {
          return {
            nome: `${escola.codigo_eol} - ${escola.nome}`,
            uuid: escola.uuid,
          };
        })
      );
    }
    setLoadingEscolas(false);
  };
  const buscarListaNutricionistas = async () => {
    const response = await getListNomesNutricionistas();
    if (response.status === HTTP_STATUS.OK) {
      setNutricionistas(
        response.data.results.map((nutri) => {
          return {
            value: nutri,
            label: nutri.toUpperCase(),
          };
        })
      );
    }
  };
  const optionsCampoUnidade = (values) =>
    getListaFiltradaAutoCompleteSelect(
      escolas.map((e) => e.nome),
      values.unidade_educacional,
      true
    );
  const optionsCampoNutricionista = (values) =>
    getListaFiltradaAutoCompleteSelect(
      nutricionistas.map((e) => e.label),
      values.nome_nutricionista,
      true
    );
  const onSubmit = async (values) => {
    let filtros_ = {
      diretoria_regional: values.diretoria_regional ?? "",
      unidade_educacional:
        escolas.find(buscarEscolaPeloNome(values))?.uuid ?? "",
      nome_nutricionista:
        nutricionistas.find(buscarNutriPeloNome(values))?.value ?? "",
      data_inicial: values.data_inicial ?? "",
      data_final: values.data_final ?? "",
    };
    if (filtros.status) filtros_["status"] = filtros.status;
    await setFiltros({ ...filtros_ });
    await buscarResultados(filtros_, 1);
  };
  const buscarEscolaPeloNome =
    (values) =>
    ({ nome }) =>
      nome === values.unidade_educacional;
  const buscarNutriPeloNome =
    (values) =>
    ({ label }) =>
      label === values.nome_nutricionista;
  const onClear = () => {
    setRelatoriosVisita([]);
    setFiltros({ status: filtros.status });
    setConsultaRealizada(false);
  };
  const requisicoesPreRender = async () => {
    await Promise.all([buscarListaDREsAsync(), buscarListaNutricionistas()]);
  };
  useEffect(() => {
    requisicoesPreRender();
  }, []);
  const LOADING = !diretoriasRegionais;
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: LOADING,
    children: _jsx("div", {
      className: "filtros-relatorios-visita",
      children: _jsx(CollapseFiltros, {
        onSubmit: onSubmit,
        onClear: onClear,
        titulo: "Filtrar Resultados",
        desabilitarBotoes: loadingEscolas,
        children: (values, form) =>
          _jsxs(_Fragment, {
            children: [
              !form_ && setForm(form),
              _jsxs("div", {
                className: "row",
                children: [
                  _jsx("div", {
                    className: "col-6",
                    children: _jsx(Field, {
                      component: Select,
                      options: [
                        { nome: "Selecione uma DRE", uuid: "" },
                        ...diretoriasRegionais,
                      ],
                      disabled: loadingEscolas,
                      naoDesabilitarPrimeiraOpcao: true,
                      name: "diretoria_regional",
                      label: "Diretoria Regional de Educa\u00E7\u00E3o",
                      onChangeEffect: (e) => {
                        const value = e.target.value;
                        if (value) {
                          buscarListaEscolas(value);
                        } else {
                          setEscolas([]);
                        }
                      },
                    }),
                  }),
                  _jsx("div", {
                    className: "col-6",
                    children: _jsx(Spin, {
                      tip: "Carregando...",
                      spinning: loadingEscolas,
                      children: _jsx(Field, {
                        component: AutoCompleteSelectField,
                        options: optionsCampoUnidade(values),
                        label: "Filtrar por Unidade Educacional",
                        name: "unidade_educacional",
                        placeholder: "Selecione uma Unidade",
                        disabled: !values.diretoria_regional || loadingEscolas,
                      }),
                    }),
                  }),
                ],
              }),
              _jsxs("div", {
                className: "row",
                children: [
                  !perfilNutriSupervisao &&
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(Field, {
                        component: AutoCompleteSelectField,
                        options: optionsCampoNutricionista(values),
                        label: "Filtrar por Nutricionista",
                        name: "nome_nutricionista",
                        placeholder: "Digite o nome da supervis\u00E3o",
                      }),
                    }),
                  _jsxs("div", {
                    className: "col-6",
                    children: [
                      _jsx("div", {
                        className: "row",
                        children: _jsx(Label, {
                          content: "Filtrar por Data da Visita",
                          className: "p-0",
                        }),
                      }),
                      _jsxs("div", {
                        className: "row",
                        children: [
                          _jsx("div", {
                            className: "col ps-0",
                            children: _jsx(Field, {
                              component: InputComData,
                              className: "input-data",
                              name: "data_inicial",
                              placeholder: "DE",
                              minDate: null,
                              maxDate: values.data_final
                                ? moment(
                                    values.data_final,
                                    "DD/MM/YYYY"
                                  ).toDate()
                                : dateDelta(0),
                            }),
                          }),
                          _jsx("div", {
                            className: "col pe-0",
                            children: _jsx(Field, {
                              component: InputComData,
                              className: "input-data",
                              name: "data_final",
                              placeholder: "AT\u00C9",
                              minDate: values.data_inicial
                                ? moment(
                                    values.data_inicial,
                                    "DD/MM/YYYY"
                                  ).toDate()
                                : null,
                              maxDate: dateDelta(0),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
      }),
    }),
  });
};
