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
import { gerarParametrosConsulta } from "../../../helpers/utilities";
export const SolicitacoesDocumentoStatusGenerico = ({
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
  const formataCardDocumento = (itens) => {
    return itens.map((item) => ({
      texto: `${item.numero_cronograma} - ${item.nome_produto} - ${item.nome_empresa}`,
      data: item.log_mais_recente.slice(0, 10),
      link: `${urlBaseItem}?uuid=${item.uuid}`,
    }));
  };
  const getSolicitacoesAsync = async (params) => {
    let parametros = gerarParametrosConsulta(params);
    let response = await getSolicitacoes(parametros);
    if (response.status === HTTP_STATUS.OK) {
      let solicitacoes_new = formataCardDocumento(response.data.results.dados);
      setSolicitacoes(solicitacoes_new);
      setCount(response.data.results.total);
    } else {
      toastError("Ocorreu um erro ao carregar o dashboard!");
    }
    setLoading(false);
  };
  const filtrarRequisicao = debounce((values) => {
    const { nome_fornecedor, nome_produto, numero_cronograma } = values;
    const podeFiltrar = [nome_fornecedor, nome_produto, numero_cronograma].some(
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
              nome_fornecedor: "",
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
                      name: "numero_cronograma",
                      placeholder: "Filtrar por N\u00BA do Cronograma",
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
                      name: "nome_fornecedor",
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
