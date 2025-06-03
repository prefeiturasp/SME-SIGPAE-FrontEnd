import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import CardListarSolicitacoesCronograma from "src/components/Shareable/CardListarSolicitacoesCronograma";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { debounce } from "lodash";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { formataItensVerMais } from "../PreRecebimento/PainelFichasTecnicas/helpers";
export const SolicitacoesFichaTecnicaStatusGenerico = ({
  getSolicitacoes,
  params,
  limit,
  titulo,
  icone,
  cardType,
  urlBaseItem,
}) => {
  const [solicitacoes, setSolicitacoes] = useState(null);
  const [filtrado, setFiltrado] = useState(false);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = limit || 10;
  const getSolicitacoesAsync = async (params) => {
    let parametros = gerarParametrosConsulta(params);
    let response = await getSolicitacoes(parametros);
    if (response.status === HTTP_STATUS.OK) {
      let solicitacoesFormatadas = formataItensVerMais(
        response.data.results.dados,
        urlBaseItem
      );
      setSolicitacoes(solicitacoesFormatadas);
      setCount(response.data.results.total);
    } else {
      toastError("Ocorreu um erro ao carregar o dashboard");
    }
    setLoading(false);
  };
  const filtrarRequisicao = debounce((values) => {
    const { nome_empresa, nome_produto, numero_ficha } = values;
    const podeFiltrar = [nome_empresa, nome_produto, numero_ficha].some(
      (value) => value && value.length > 2
    );
    if (podeFiltrar) {
      setLoading(true);
      let newParams = Object.assign({}, params, { ...values });
      setFiltrado(true);
      getSolicitacoesAsync(newParams);
    } else if (filtrado) {
      setLoading(true);
      setFiltrado(false);
      getSolicitacoesAsync(params);
    }
  }, 500);
  useEffect(() => {
    setCurrentPage(1);
    getSolicitacoesAsync(params);
  }, []);
  const onPageChanged = async (page) => {
    const paramsPage = { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE };
    let newParams = Object.assign({}, params, paramsPage);
    await getSolicitacoesAsync(newParams);
    setCurrentPage(page);
  };
  return _jsx("div", {
    className: "card mt-3",
    children: _jsx("div", {
      className: "card-body",
      children: _jsxs(Spin, {
        tip: "Carregando...",
        spinning: loading,
        children: [
          _jsx(Form, {
            initialValues: {
              nome_empresa: "",
              numero_cronograma: "",
              nome_produto: "",
            },
            onSubmit: () => {},
            children: ({ form }) =>
              _jsxs("div", {
                className: "row",
                children: [
                  _jsx("div", {
                    className: "col-4",
                    children: _jsx(Field, {
                      component: InputText,
                      name: "numero_ficha",
                      placeholder: "Filtrar por N\u00BA da Ficha T\u00E9cnica",
                      inputOnChange: () =>
                        filtrarRequisicao(form.getState().values),
                    }),
                  }),
                  _jsx("div", {
                    className: "col-4",
                    children: _jsx(Field, {
                      component: InputText,
                      name: "nome_produto",
                      placeholder: "Filtrar por Nome do Produto",
                      inputOnChange: () =>
                        filtrarRequisicao(form.getState().values),
                    }),
                  }),
                  _jsx("div", {
                    className: "col-4",
                    children: _jsx(Field, {
                      component: InputText,
                      name: "nome_empresa",
                      placeholder: "Filtrar por Nome do Fornecedor",
                      inputOnChange: () =>
                        filtrarRequisicao(form.getState().values),
                    }),
                  }),
                ],
              }),
          }),
          _jsx(CardListarSolicitacoesCronograma, {
            titulo: titulo,
            icone: icone,
            tipo: cardType,
            solicitacoes: solicitacoes,
            exibirTooltip: true,
          }),
          _jsx(Paginacao, {
            onChange: (page) => onPageChanged(page),
            total: count,
            pageSize: PAGE_SIZE,
            current: currentPage,
          }),
        ],
      }),
    }),
  });
};
