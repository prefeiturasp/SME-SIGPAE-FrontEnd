import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { Filtros } from "./components/Filtros/Index";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { MESES } from "src/constants/shared";
import { STATUS_RELATORIO_FINANCEIRO } from "../constants";
import {
  MEDICAO_INICIAL,
  RELATORIO_FINANCEIRO,
  RELATORIO_CONSOLIDADO,
} from "src/configs/constants";
import "./styles.scss";
import useView from "./view";
export function RelatorioFinanceiro() {
  const [filtros, setFiltros] = useState({});
  const view = useView({ filtros });
  const onChangePage = async (page, filtros) => {
    view.setPaginaAtual(page);
    view.setCarregando(true);
    await view.getRelatoriosFinanceirosAsync(page, filtros);
    view.setCarregando(false);
  };
  return _jsx("div", {
    className: "relatorio-financeiro",
    children: _jsx(Spin, {
      tip: "Carregando...",
      spinning: view.carregando,
      children: _jsx("div", {
        className: "card mt-3",
        children: _jsxs("div", {
          className: "card-body",
          children: [
            _jsx(Filtros, {
              onSubmit: (values) => {
                setFiltros(values);
                onChangePage(1, values);
              },
              onClear: () => {
                setFiltros({});
                onChangePage(1, {});
              },
              lotes: view.lotes,
              gruposUnidadeEscolar: view.gruposUnidadeEscolar,
              mesesAnos: view.mesesAnos,
            }),
            _jsx("div", {
              className: "mt-4",
              children:
                view.relatoriosFinanceiros.length === 0 && !view.carregando
                  ? _jsx("div", {
                      className: "text-center mt-4 mb-4",
                      children: "Nenhum resultado encontrado",
                    })
                  : _jsxs("div", {
                      className: "tabela-relatorios-financeiros mt-4 mb-4",
                      children: [
                        _jsx("div", {
                          className: "titulo-tabela mt-5 mb-3",
                          children: "Resultados da Pesquisa",
                        }),
                        _jsxs("table", {
                          children: [
                            _jsx("thead", {
                              children: _jsxs("tr", {
                                className: "row",
                                children: [
                                  _jsx("th", {
                                    className: "col-3",
                                    children: "DRE",
                                  }),
                                  _jsx("th", {
                                    className: "col-3",
                                    children: "Tipo de UE",
                                  }),
                                  _jsx("th", {
                                    className: "col-1 text-center",
                                    children: "Lote",
                                  }),
                                  _jsx("th", {
                                    className: "col-2 text-center",
                                    children: "M\u00EAs de Refer\u00EAncia",
                                  }),
                                  _jsx("th", {
                                    className: "col-2 text-center",
                                    children: "Status",
                                  }),
                                  _jsx("th", {
                                    className: "col-1 text-center",
                                    children: "A\u00E7\u00F5es",
                                  }),
                                ],
                              }),
                            }),
                            _jsx("tbody", {
                              children: view.relatoriosFinanceiros.map(
                                (relatorioFinanceiro) =>
                                  _jsxs(
                                    "tr",
                                    {
                                      className: "row",
                                      children: [
                                        _jsx("td", {
                                          className: "col-3",
                                          children:
                                            relatorioFinanceiro.lote
                                              .diretoria_regional.nome,
                                        }),
                                        _jsx("td", {
                                          className: "col-3",
                                          children:
                                            relatorioFinanceiro.grupo_unidade_escolar.tipos_unidades
                                              .map(
                                                (unidade) => unidade.iniciais
                                              )
                                              .join(", "),
                                        }),
                                        _jsx("td", {
                                          className: "col-1 text-center",
                                          children:
                                            relatorioFinanceiro.lote.nome,
                                        }),
                                        _jsx("td", {
                                          className: "col-2 text-center",
                                          children: `${
                                            MESES[
                                              parseInt(
                                                relatorioFinanceiro.mes
                                              ) - 1
                                            ]
                                          } de ${relatorioFinanceiro.ano}`,
                                        }),
                                        _jsx("td", {
                                          className: "col-2 text-center",
                                          children:
                                            STATUS_RELATORIO_FINANCEIRO[
                                              relatorioFinanceiro.status
                                            ],
                                        }),
                                        _jsx("td", {
                                          className: "col-1 text-center",
                                          children: _jsx(Link, {
                                            to: `/${MEDICAO_INICIAL}/${RELATORIO_FINANCEIRO}/${RELATORIO_CONSOLIDADO}/?uuid=${relatorioFinanceiro.uuid}`,
                                            children: _jsx("span", {
                                              className: "px-2",
                                              children: _jsx("i", {
                                                title:
                                                  "Visualizar Relat\u00F3rio Consolidado",
                                                className: "fas fa-eye green",
                                              }),
                                            }),
                                          }),
                                        }),
                                      ],
                                    },
                                    relatorioFinanceiro.uuid
                                  )
                              ),
                            }),
                          ],
                        }),
                        _jsx(Paginacao, {
                          onChange: (page) => onChangePage(page, filtros),
                          total: view.relatoriosFinanceirosResponse?.count,
                          pageSize:
                            view.relatoriosFinanceirosResponse?.page_size,
                          current: view.paginaAtual,
                        }),
                      ],
                    }),
            }),
          ],
        }),
      }),
    }),
  });
}
