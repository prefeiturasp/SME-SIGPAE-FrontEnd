import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ADICIONAR_PARAMETRIZACAO_FINANCEIRA,
  MEDICAO_INICIAL,
  PARAMETRIZACAO_FINANCEIRA,
  EDITAR_PARAMETRIZACAO_FINANCEIRA,
} from "src/configs/constants";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Spin } from "antd";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import Filtros from "./AdicionarParametrizacaoFinanceira/components/Filtros";
import { Paginacao } from "src/components/Shareable/Paginacao";
import ParametrizacaoFinanceiraService from "src/services/medicaoInicial/parametrizacao_financeira.service";
import "./styles.scss";
export default () => {
  const navigate = useNavigate();
  const [responseParametrizacoes, setResponseParametrizacoes] = useState();
  const [parametrizacoes, setParametrizacoes] = useState([]);
  const [erroAPI, setErroAPI] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtros, setFiltros] = useState();
  const [carregando, setCarregando] = useState(false);
  const getParametrizacoes = async (page = null, filtros = null) => {
    setCarregando(true);
    try {
      const response =
        await ParametrizacaoFinanceiraService.getParametrizacoesFinanceiras(
          page,
          filtros
        );
      setResponseParametrizacoes(response);
      setParametrizacoes(response.results);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar parametrizações financeiras. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };
  const formataTiposUnidades = (tiposUnidades) => {
    return tiposUnidades.map((tipoUnidade) => tipoUnidade.iniciais).join(", ");
  };
  const onChangePage = async (page, filtros) => {
    setPaginaAtual(page);
    await getParametrizacoes(page, filtros);
  };
  useEffect(() => {
    getParametrizacoes();
  }, []);
  return _jsxs("div", {
    className: "parametrizacao-financeira",
    children: [
      erroAPI && _jsx("div", { children: erroAPI }),
      _jsx(Spin, {
        tip: "Carregando...",
        spinning: carregando,
        children: _jsx("div", {
          className: "card mt-4",
          children: _jsxs("div", {
            className: "card-body",
            children: [
              _jsx(CollapseFiltros, {
                onSubmit: async (values) => {
                  setFiltros(values);
                  onChangePage(1, values);
                },
                onClear: () => {
                  setFiltros({});
                  onChangePage(1, {});
                },
                titulo: "Filtrar Resultados",
                children: () => _jsx(Filtros, {}),
              }),
              _jsxs("div", {
                className: "mt-4",
                children: [
                  _jsx(Botao, {
                    texto: "Adicionar Parametriza\u00E7\u00E3o",
                    titulo: "Adicionar Parametriza\u00E7\u00E3o",
                    className: "mt-4",
                    onClick: () =>
                      navigate(ADICIONAR_PARAMETRIZACAO_FINANCEIRA),
                    style: BUTTON_STYLE.GREEN,
                    type: BUTTON_TYPE.BUTTON,
                  }),
                  parametrizacoes.length === 0 && !carregando
                    ? _jsx("div", {
                        className: "text-center mt-4 mb-4",
                        children: "Nenhum resultado encontrado",
                      })
                    : _jsxs("div", {
                        className: "tabela mt-4 mb-4",
                        children: [
                          _jsx("div", {
                            className: "titulo-tabela mt-5 mb-3",
                            children: "Parametriza\u00E7\u00F5es Cadastradas",
                          }),
                          _jsxs("table", {
                            children: [
                              _jsx("thead", {
                                children: _jsxs("tr", {
                                  className: "row",
                                  children: [
                                    _jsx("th", {
                                      className: "col-3",
                                      children: "Edital",
                                    }),
                                    _jsx("th", {
                                      className: "col-4",
                                      children: "DRE",
                                    }),
                                    _jsx("th", {
                                      className: "col-1",
                                      children: "Lote",
                                    }),
                                    _jsx("th", {
                                      className: "col-3",
                                      children: "Tipo de Unidade",
                                    }),
                                    _jsx("th", { className: "col-1" }),
                                  ],
                                }),
                              }),
                              _jsx("tbody", {
                                children: parametrizacoes.map(
                                  (parametrizacao) =>
                                    _jsxs(
                                      "tr",
                                      {
                                        className: "row",
                                        children: [
                                          _jsx("td", {
                                            className: "col-3",
                                            children:
                                              parametrizacao.edital.numero,
                                          }),
                                          _jsx("td", {
                                            className: "col-4",
                                            children: parametrizacao.dre,
                                          }),
                                          _jsx("td", {
                                            className: "col-1",
                                            children: parametrizacao.lote.nome,
                                          }),
                                          _jsx("td", {
                                            className: "col-3",
                                            children: formataTiposUnidades(
                                              parametrizacao.tipos_unidades
                                            ),
                                          }),
                                          _jsx("td", {
                                            className:
                                              "col-1 d-flex justify-content-center align-item-center",
                                            children: _jsx(Link, {
                                              to: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/${EDITAR_PARAMETRIZACAO_FINANCEIRA}/?uuid=${parametrizacao.uuid}`,
                                              children: _jsx("span", {
                                                className: "px-2",
                                                children: _jsx("i", {
                                                  title:
                                                    "Editar Parametriza\u00E7\u00E3o",
                                                  className:
                                                    "verde fas fa-edit",
                                                }),
                                              }),
                                            }),
                                          }),
                                        ],
                                      },
                                      parametrizacao.uuid
                                    )
                                ),
                              }),
                            ],
                          }),
                          _jsx(Paginacao, {
                            onChange: (page) => onChangePage(page, filtros),
                            total: responseParametrizacoes?.count,
                            pageSize: responseParametrizacoes?.page_size,
                            current: paginaAtual,
                          }),
                        ],
                      }),
                ],
              }),
            ],
          }),
        }),
      }),
    ],
  });
};
