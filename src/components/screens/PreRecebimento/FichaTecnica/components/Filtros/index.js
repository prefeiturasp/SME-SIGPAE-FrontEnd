import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import moment from "moment";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  CADASTRAR_FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "../../../../../../configs/constants";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import { getListaCompletaProdutosLogistica } from "../../../../../../services/produto.service";
import { getListaFiltradaAutoCompleteSelect } from "../../../../../../helpers/autoCompleteSelect";
const Filtros = ({ setFiltros, setFichas, setConsultaRealizada }) => {
  const [listaProdutos, setListaProdutos] = useState([]);
  const buscarListaProdutos = async () => {
    const response = await getListaCompletaProdutosLogistica();
    setListaProdutos(response.data.results);
  };
  const opcoesStatus = [
    {
      label: "Rascunho",
      value: "RASCUNHO",
    },
    {
      label: "Aprovada",
      value: "APROVADA",
    },
    {
      label: "Enviada para Análise",
      value: "ENVIADA_PARA_ANALISE",
    },
    {
      label: "Solicitação de Alteração",
      value: "ENVIADA_PARA_CORRECAO",
    },
  ];
  const onSubmit = async (values) => {
    let filtros = { ...values };
    if (values.data_criacao) {
      delete filtros.data_criacao;
      filtros.data_cadastro = moment(values.data_criacao, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }
    setFiltros(filtros);
  };
  useEffect(() => {
    buscarListaProdutos();
  }, []);
  return _jsx("div", {
    className: "filtros-fichas-tecnicas",
    children: _jsx(Form, {
      onSubmit: onSubmit,
      initialValues: {},
      render: ({ form, handleSubmit, values }) =>
        _jsxs("form", {
          onSubmit: handleSubmit,
          children: [
            _jsxs("div", {
              className: "row",
              children: [
                _jsx("div", {
                  className: "col-6 mt-2",
                  children: _jsx(Field, {
                    component: InputText,
                    label: "Filtrar por N\u00B0 da Ficha",
                    dataTestId: "numero_ficha",
                    name: "numero_ficha",
                    placeholder: "Digite o N\u00BA da Ficha",
                    className: "input-busca-ficha",
                    toUppercaseActive: true,
                  }),
                }),
                _jsx("div", {
                  className: "col-6 mt-2",
                  children: _jsx(Field, {
                    component: AutoCompleteSelectField,
                    options: getListaFiltradaAutoCompleteSelect(
                      listaProdutos.map((e) => e.nome),
                      values.nome_produto,
                      true
                    ),
                    label: "Filtrar por Produto",
                    name: "nome_produto",
                    placeholder: "Selecione um Produto",
                  }),
                }),
                _jsx("div", {
                  className: "col-4 mt-2",
                  children: _jsx(Field, {
                    component: InputText,
                    label: "Filtrar por Preg\u00E3o/Chamada P\u00FAblica",
                    name: "pregao_chamada_publica",
                    placeholder:
                      "Digite o N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                    className: "input-busca-ficha",
                  }),
                }),
                _jsx("div", {
                  className: "col-4 mt-2",
                  children: _jsx(Field, {
                    component: MultiSelect,
                    disableSearch: true,
                    options: opcoesStatus,
                    label: "Filtrar por Status",
                    name: "status",
                    nomeDoItemNoPlural: "Status",
                    placeholder: "Selecione os Status",
                  }),
                }),
                _jsx("div", {
                  className: "col-4 mt-2",
                  children: _jsx(Field, {
                    component: InputComData,
                    className: "input-data",
                    label: "Filtrar por Data do Cadastro",
                    name: "data_criacao",
                    placeholder: "Selecione a Data do Cadastro",
                    writable: false,
                    minDate: null,
                    maxDate: null,
                  }),
                }),
              ],
            }),
            _jsxs("div", {
              className: "pt-4 pb-4",
              children: [
                _jsx(NavLink, {
                  to: `/${PRE_RECEBIMENTO}/${CADASTRAR_FICHA_TECNICA}`,
                  children: _jsx(Botao, {
                    texto: "Cadastrar Ficha T\u00E9cnica",
                    type: BUTTON_TYPE.BUTTON,
                    style: BUTTON_STYLE.GREEN,
                  }),
                }),
                _jsx(Botao, {
                  texto: "Filtrar",
                  type: BUTTON_TYPE.SUBMIT,
                  style: BUTTON_STYLE.GREEN,
                  className: "float-end ms-3",
                }),
                _jsx(Botao, {
                  texto: "Limpar Filtros",
                  type: BUTTON_TYPE.BUTTON,
                  style: BUTTON_STYLE.GREEN_OUTLINE,
                  className: "float-end ms-3",
                  onClick: () => {
                    form.reset({});
                    setFichas([]);
                    setConsultaRealizada(false);
                    setFiltros({});
                  },
                }),
              ],
            }),
          ],
        }),
    }),
  });
};
export default Filtros;
