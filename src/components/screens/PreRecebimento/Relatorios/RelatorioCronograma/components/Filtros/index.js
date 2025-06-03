import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Field } from "react-final-form";
import moment from "moment";
import "./styles.scss";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { InputComData } from "src/components/Shareable/DatePicker";
import { getListaCompletaProdutosLogistica } from "../../../../../../../services/produto.service";
import { getListaFiltradaAutoCompleteSelect } from "../../../../../../../helpers/autoCompleteSelect";
import { getListaCronogramasPraCadastro } from "../../../../../../../services/cronograma.service";
import { getEmpresasCronograma } from "src/services/terceirizada.service";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { montarOptionsStatus } from "../../../../CronogramaEntrega/components/Filtros/utils";
const Filtros = ({
  setFiltros,
  setCarregando,
  setCronogramas,
  setConsultaRealizada,
}) => {
  const [fornecedores, setFornecedores] = useState([]);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [dadosCronogramas, setDadosCronogramas] = useState([]);
  const buscaFornecedores = async () => {
    const response = await getEmpresasCronograma();
    setFornecedores(
      response.data.results.map((fornecedor) => ({
        value: fornecedor.uuid,
        label: fornecedor.nome_fantasia,
      }))
    );
  };
  const buscarListaProdutos = async () => {
    const response = await getListaCompletaProdutosLogistica();
    setListaProdutos(response.data.results);
  };
  const buscarDadosCronogramas = async () => {
    const response = await getListaCronogramasPraCadastro();
    setDadosCronogramas(response.data.results);
  };
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
    setCronogramas([]);
    setConsultaRealizada(false);
    setFiltros({});
  };
  useEffect(() => {
    (async () => {
      setCarregando(true);
      await Promise.all([
        buscaFornecedores(),
        buscarListaProdutos(),
        buscarDadosCronogramas(),
      ]);
      setCarregando(false);
    })();
  }, []);
  return _jsx("div", {
    className: "filtros-documentos-recebimento",
    children: _jsx(CollapseFiltros, {
      onSubmit: onSubmit,
      onClear: onClear,
      children: (values) =>
        _jsxs("div", {
          className: "row",
          children: [
            _jsx("div", {
              className: "col-6 mt-2",
              children: _jsx(Field, {
                label: "Empresa",
                component: MultiSelect,
                name: "empresa",
                multiple: true,
                nomeDoItemNoPlural: "empresas",
                options: fornecedores,
                placeholder: "Selecione uma ou mais Empresas",
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
              className: "col-3 mt-2",
              children: _jsx(Field, {
                component: AutoCompleteSelectField,
                options: getListaFiltradaAutoCompleteSelect(
                  dadosCronogramas.map((e) => e.numero),
                  values.numero,
                  true
                ),
                label: "Filtrar por N\u00BA do Cronograma",
                name: "numero",
                placeholder: "Selecione um cronograma",
              }),
            }),
            _jsx("div", {
              className: "col-3 mt-2",
              children: _jsx(Field, {
                component: MultiSelect,
                disableSearch: true,
                options: montarOptionsStatus(),
                label: "Filtrar por Status",
                name: "status",
                nomeDoItemNoPlural: "Status",
                placeholder: "Selecione os Status",
              }),
            }),
            _jsx("div", {
              className: "col-3 mt-2",
              children: _jsx(Field, {
                component: InputComData,
                label: "Filtrar por Per\u00EDodo",
                name: "data_inicial",
                className: "data-field-cronograma",
                placeholder: "DE",
                minDate: null,
                maxDate: values.data_final
                  ? moment(values.data_final, "DD/MM/YYYY").toDate()
                  : null,
              }),
            }),
            _jsx("div", {
              className: "col-3 mt-2",
              children: _jsx(Field, {
                component: InputComData,
                label: "\u00A0",
                name: "data_final",
                className: "data-field-cronograma",
                popperPlacement: "bottom-end",
                placeholder: "AT\u00C9",
                minDate: values.data_inicial
                  ? moment(values.data_inicial, "DD/MM/YYYY").toDate()
                  : null,
                maxDate: null,
              }),
            }),
          ],
        }),
    }),
  });
};
export default Filtros;
