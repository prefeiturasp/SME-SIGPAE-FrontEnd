import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Field } from "react-final-form";
import moment from "moment";
import { NavLink } from "react-router-dom";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import { RECEBIMENTO, CADASTRO_FICHA_RECEBIMENTO } from "src/configs/constants";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { InputText } from "src/components/Shareable/Input/InputText";
import { InputComData } from "src/components/Shareable/DatePicker";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import Label from "src/components/Shareable/Label";
import { getListaCompletaProdutosLogistica } from "src/services/produto.service";
import { listaSimplesTerceirizadas } from "src/services/terceirizada.service";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import { dateDelta } from "src/helpers/utilities.jsx";
import "./styles.scss";
const Filtros = ({
  setFiltros,
  setFichasRecebimento,
  setConsultaRealizada,
}) => {
  const [produtos, setProdutos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const buscarListaProdutos = async () => {
    const response = await getListaCompletaProdutosLogistica();
    setProdutos(response.data.results);
  };
  const buscarListaEmpresas = async () => {
    const response = await listaSimplesTerceirizadas();
    setEmpresas(response.data.results);
  };
  const optionsCampoProdutos = (values) =>
    getListaFiltradaAutoCompleteSelect(
      produtos.map((e) => e.nome),
      values.nome_produto,
      true
    );
  const optionsCampoEmpresa = (values) =>
    getListaFiltradaAutoCompleteSelect(
      empresas.map((e) => e.nome_fantasia),
      values.nome_empresa,
      true
    );
  const onSubmit = (values) => {
    let filtros = { ...values };
    if (values.data_inicial)
      filtros.data_inicial = moment(values.data_inicial, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    if (values.data_final)
      filtros.data_final = moment(values.data_final, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    setFiltros(filtros);
  };
  const onClear = () => {
    setFichasRecebimento([]);
    setConsultaRealizada(false);
    setFiltros({});
  };
  useEffect(() => {
    buscarListaProdutos();
    buscarListaEmpresas();
  }, []);
  return _jsxs("div", {
    className: "filtros-ficha-recebimento",
    children: [
      _jsx(CollapseFiltros, {
        onSubmit: onSubmit,
        onClear: onClear,
        children: (values) =>
          _jsxs(_Fragment, {
            children: [
              _jsxs("div", {
                className: "row",
                children: [
                  _jsx("div", {
                    className: "col-6",
                    children: _jsx(Field, {
                      component: InputText,
                      label: "Filtrar por N\u00BA do Cronograma",
                      name: "numero_cronograma",
                      placeholder: "Digite o N\u00BA do Cronograma",
                    }),
                  }),
                  _jsx("div", {
                    className: "col-6",
                    children: _jsx(Field, {
                      component: AutoCompleteSelectField,
                      options: optionsCampoProdutos(values),
                      label: "Filtrar por Produto",
                      name: "nome_produto",
                      placeholder: "Selecione um Produto",
                    }),
                  }),
                ],
              }),
              _jsxs("div", {
                className: "row",
                children: [
                  _jsx("div", {
                    className: "col-6",
                    children: _jsx(Field, {
                      component: AutoCompleteSelectField,
                      options: optionsCampoEmpresa(values),
                      label: "Filtrar por Empresa",
                      name: "nome_empresa",
                      placeholder: "Selecione uma Empresa",
                    }),
                  }),
                  _jsxs("div", {
                    className: "col-6",
                    children: [
                      _jsx("div", {
                        className: "row",
                        children: _jsx(Label, {
                          content: "Filtrar por Per\u00EDodo",
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
      _jsx("div", {
        className: "pt-4 pb-4",
        children: _jsx(NavLink, {
          to: `/${RECEBIMENTO}/${CADASTRO_FICHA_RECEBIMENTO}`,
          children: _jsx(Botao, {
            texto: "Cadastrar Recebimento",
            type: BUTTON_TYPE.BUTTON,
            style: BUTTON_STYLE.GREEN,
            onClick: () => {},
          }),
        }),
      }),
    ],
  });
};
export default Filtros;
