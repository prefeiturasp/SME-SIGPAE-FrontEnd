import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Field } from "react-final-form";
import moment from "moment";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  CADASTRO_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "../../../../../../configs/constants";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputComData } from "src/components/Shareable/DatePicker";
import { getListaCronogramasPraCadastro } from "../../../../../../services/cronograma.service";
import { getListaCompletaProdutosLogistica } from "../../../../../../services/produto.service";
import { getListaFiltradaAutoCompleteSelect } from "../../../../../../helpers/autoCompleteSelect";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
const Filtros = ({ setFiltros, setDocumentos, setConsultaRealizada }) => {
  const [dadosCronogramas, setDadosCronogramas] = useState([]);
  const [listaProdutos, setListaProdutos] = useState([]);
  const buscarListaProdutos = async () => {
    const response = await getListaCompletaProdutosLogistica();
    setListaProdutos(response.data.results);
  };
  const buscarDadosCronogramas = async () => {
    const response = await getListaCronogramasPraCadastro();
    setDadosCronogramas(response.data.results);
  };
  const opcoesStatus = [
    {
      label: "Enviado para Análise",
      value: "ENVIADO_PARA_ANALISE",
    },
    {
      label: "Solicitada Correção",
      value: "ENVIADO_PARA_CORRECAO",
    },
    {
      label: "Aprovado",
      value: "APROVADO",
    },
  ];
  const onSubmit = (values) => {
    let filtros = { ...values };
    if (values.data_criacao) {
      delete filtros.data_criacao;
      filtros.data_cadastro = moment(values.data_criacao, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }
    setFiltros(filtros);
  };
  const onClear = () => {
    setDocumentos([]);
    setConsultaRealizada(false);
    setFiltros({});
  };
  useEffect(() => {
    buscarDadosCronogramas();
    buscarListaProdutos();
  }, []);
  return _jsxs("div", {
    className: "filtros-documentos-recebimento",
    children: [
      _jsx(CollapseFiltros, {
        onSubmit: onSubmit,
        onClear: onClear,
        children: (values) =>
          _jsxs("div", {
            className: "row",
            children: [
              _jsx("div", {
                className: "col-6 mt-2",
                children: _jsx(Field, {
                  component: AutoCompleteSelectField,
                  options: getListaFiltradaAutoCompleteSelect(
                    listaProdutos.map((e) => e.nome),
                    values.nome_produto,
                    true
                  ),
                  label: "Filtrar por Nome do Produto",
                  name: "nome_produto",
                  placeholder: "Selecione um Produto",
                }),
              }),
              _jsx("div", {
                className: "col-6 mt-2",
                children: _jsx(Field, {
                  component: AutoCompleteSelectField,
                  options: getListaFiltradaAutoCompleteSelect(
                    dadosCronogramas.map((e) => e.numero),
                    values.numero_cronograma
                  ),
                  label: "Filtrar por N\u00BA do Cronograma",
                  name: "numero_cronograma",
                  placeholder: "Digite o N\u00BA do Cronograma",
                }),
              }),
              _jsx("div", {
                className: "col-6 mt-2",
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
                className: "col-6 mt-2",
                children: _jsx(Field, {
                  component: InputComData,
                  className: "input-data",
                  label: "Filtrar por Data da Cria\u00E7\u00E3o",
                  name: "data_criacao",
                  placeholder: "Selecione a Data de Cria\u00E7\u00E3o",
                  writable: false,
                  minDate: null,
                  maxDate: null,
                }),
              }),
            ],
          }),
      }),
      _jsx("div", {
        className: "pt-4 pb-4",
        children: _jsx(NavLink, {
          to: `/${PRE_RECEBIMENTO}/${CADASTRO_DOCUMENTOS_RECEBIMENTO}`,
          children: _jsx(Botao, {
            texto: "Cadastrar Documentos",
            type: BUTTON_TYPE.BUTTON,
            style: BUTTON_STYLE.GREEN,
          }),
        }),
      }),
    ],
  });
};
export default Filtros;
