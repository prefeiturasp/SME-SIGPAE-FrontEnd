import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spin } from "antd";
import { Paginacao } from "src/components/Shareable/Paginacao";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { Form } from "react-final-form";
import { getEditaisContratos } from "src/services/edital.service";
import { CamposEditalContrato } from "./components/CamposEditalContrato";
import { Header } from "./components/Header";
import { LinhaEditalContrato } from "./components/ListaContratoEdital";
import "./style.scss";
export const ConsultaEditaisContratos = () => {
  const [editaisContratos, setEditaisContratos] = useState(undefined);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const getEditaisContratosAsync = async (params = null) => {
    const response = await getEditaisContratos(params);
    if (response.status === HTTP_STATUS.OK) {
      setEditaisContratos(
        response.data.results.map((edital) => {
          return {
            ativo: false,
            ...edital,
          };
        })
      );
      setCount(response.data.count);
    } else {
      setErro(
        "Erro ao carregar editais e contratos. Tente novamente mais tarde."
      );
    }
  };
  useEffect(() => {
    requisicoesPreRender();
  }, []);
  const requisicoesPreRender = async () => {
    await Promise.all([getEditaisContratosAsync()]).then(() => {
      setLoading(false);
    });
  };
  const nextPage = async ({ page, values }) => {
    setPage(page);
    setLoading(true);
    await getEditaisContratosAsync({ page: page, buscar: values.buscar });
    setLoading(false);
  };
  const onSubmit = () => {};
  const REQUISICOES_FINALIZADAS = !loading && editaisContratos;
  return _jsx("div", {
    className: "consulta-editais-contratos mt-3",
    children: _jsxs(Spin, {
      tip: "Carregando...",
      spinning: !REQUISICOES_FINALIZADAS,
      children: [
        erro && _jsx("div", { className: "mt-3", children: erro }),
        !erro &&
          editaisContratos &&
          _jsx(Form, {
            keepDirtyOnReinitialize: true,
            onSubmit: onSubmit,
            children: ({ handleSubmit, values }) =>
              _jsx("form", {
                onSubmit: handleSubmit,
                children: _jsxs("div", {
                  className: "card",
                  children: [
                    _jsx(Header, {
                      getEditaisContratosAsync: getEditaisContratosAsync,
                      setLoading: setLoading,
                      page: page,
                      setPage: setPage,
                    }),
                    _jsx("hr", { className: "header" }),
                    editaisContratos.map((editalContrato, index) => {
                      return _jsxs(
                        "div",
                        {
                          className: "p-1",
                          children: [
                            _jsx(LinhaEditalContrato, {
                              editalContrato: editalContrato,
                              setEditaisContratos: setEditaisContratos,
                              editaisContratos: editaisContratos,
                              index: index,
                            }),
                            _jsx("hr", {}),
                            _jsx(Collapse, {
                              isOpened: editalContrato.ativo,
                              children: _jsx(CamposEditalContrato, {
                                editalContrato: editalContrato,
                              }),
                            }),
                          ],
                        },
                        index
                      );
                    }),
                    _jsx(Paginacao, {
                      className: "mt-3 mb-3",
                      current: page,
                      total: count,
                      showSizeChanger: false,
                      onChange: (page) => {
                        nextPage({ page, values });
                      },
                      pageSize: 10,
                    }),
                  ],
                }),
              }),
          }),
      ],
    }),
  });
};
