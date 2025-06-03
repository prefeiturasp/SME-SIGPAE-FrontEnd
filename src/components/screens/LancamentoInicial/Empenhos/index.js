import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Paginacao } from "src/components/Shareable/Paginacao";
import {
  getContratosVigentes,
  getEmpenhos,
} from "src/services/medicaoInicial/empenhos.service";
import {
  MEDICAO_INICIAL,
  EMPENHOS,
  CADASTRO_DE_EMPENHO,
  EDITAR_EMPENHO,
} from "src/configs/constants";
import "./styles.scss";
import { Filtros } from "./components/Filtros";
import { formataValorDecimal } from "../../helper.jsx";
export function Empenhos() {
  const [contratos, setContratos] = useState([]);
  const [editais, setEditais] = useState([]);
  const [empenhos, setEmpenhos] = useState([]);
  const [filtros, setFiltros] = useState();
  const [responseEmpenhos, setResponseEmpenhos] = useState();
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [erroAPI, setErroAPI] = useState("");
  const getContratosAsync = async () => {
    try {
      const { data } = await getContratosVigentes();
      const editais = data.results
        .filter((contrato) => contrato.edital)
        .map((contrato) => contrato.edital);
      setContratos(data.results);
      setEditais(editais);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar contratos vigentes. Tente novamente mais tarde."
      );
    }
  };
  const getEmpenhosAsync = async (page = null, filtros = null) => {
    try {
      const { data } = await getEmpenhos(page, filtros);
      setEmpenhos(data.results);
      setResponseEmpenhos(data);
    } catch (error) {
      setErroAPI("Erro ao carregar empenhos. Tente novamente mais tarde.");
    }
  };
  useEffect(() => {
    setPaginaAtual(1);
    requisicoesPreRender();
  }, []);
  const requisicoesPreRender = async () => {
    await Promise.all([getEmpenhosAsync(), getContratosAsync()]).then(() => {
      setCarregando(false);
    });
  };
  const capitalize = (value) => {
    const primeiraLetra = value[0].toUpperCase();
    const restoDoTexto = value.slice(1).toLowerCase();
    return primeiraLetra + restoDoTexto;
  };
  const onChangePage = async (page, filtros) => {
    setPaginaAtual(page);
    setCarregando(true);
    await getEmpenhosAsync(page, filtros);
    setCarregando(false);
  };
  return _jsxs("div", {
    className: "empenhos",
    children: [
      erroAPI && _jsx("div", { children: erroAPI }),
      _jsx(Spin, {
        tip: "Carregando...",
        spinning: carregando,
        children: !erroAPI
          ? _jsx("div", {
              className: "card mt-3",
              children: _jsxs("div", {
                className: "card-body",
                children: [
                  _jsx(Filtros, {
                    onSubmit: async (values) => {
                      setFiltros(values);
                      onChangePage(1, values);
                    },
                    onClear: () => {
                      setFiltros({});
                      onChangePage(1, {});
                    },
                    contratos: contratos,
                    editais: editais,
                  }),
                  _jsxs("div", {
                    className: "mt-4",
                    children: [
                      _jsx(Link, {
                        to: `/${MEDICAO_INICIAL}/${EMPENHOS}/${CADASTRO_DE_EMPENHO}/`,
                        className: "pt-4",
                        children: _jsx(Botao, {
                          texto: "Cadastrar Empenho",
                          type: BUTTON_TYPE.BUTTON,
                          style: BUTTON_STYLE.GREEN,
                        }),
                      }),
                      empenhos.length === 0 && !carregando
                        ? _jsx("div", {
                            className: "text-center mt-4 mb-4",
                            children: "Nenhum resultado encontrado",
                          })
                        : _jsxs("div", {
                            className: "tabela-empenhos mt-4 mb-4",
                            children: [
                              _jsx("div", {
                                className: "titulo-tabela mt-5 mb-3",
                                children: "Empenhos Cadastrados",
                              }),
                              _jsxs("table", {
                                children: [
                                  _jsx("thead", {
                                    children: _jsxs("tr", {
                                      className: "row",
                                      children: [
                                        _jsx("th", {
                                          className: "col-2",
                                          children: "N\u00BA do Empenho",
                                        }),
                                        _jsx("th", {
                                          className: "col-2",
                                          children: "N\u00BA do Contrato",
                                        }),
                                        _jsx("th", {
                                          className: "col-3",
                                          children: "Edital",
                                        }),
                                        _jsx("th", {
                                          className: "col-1",
                                          children: "Tipo",
                                        }),
                                        _jsx("th", {
                                          className: "col-2",
                                          children: "Valor do Empenho",
                                        }),
                                        _jsx("th", {
                                          className: "col-1",
                                          children: "Status",
                                        }),
                                        _jsx("th", {
                                          className: "col-1",
                                          children: "A\u00E7\u00F5es",
                                        }),
                                      ],
                                    }),
                                  }),
                                  _jsx("tbody", {
                                    children: empenhos.map((empenho) =>
                                      _jsxs(
                                        "tr",
                                        {
                                          className: "row",
                                          children: [
                                            _jsx("td", {
                                              className: "col-2",
                                              children: empenho.numero,
                                            }),
                                            _jsx("td", {
                                              className: "col-2",
                                              children: empenho.contrato,
                                            }),
                                            _jsx("td", {
                                              className: "col-3",
                                              children: empenho.edital,
                                            }),
                                            _jsx("td", {
                                              className: "col-1",
                                              children: capitalize(
                                                empenho.tipo_empenho
                                              ),
                                            }),
                                            _jsx("td", {
                                              className: "col-2",
                                              children: formataValorDecimal(
                                                empenho.valor_total
                                              ),
                                            }),
                                            _jsx("td", {
                                              className: "col-1",
                                              children: capitalize(
                                                empenho.status
                                              ),
                                            }),
                                            _jsx("td", {
                                              className:
                                                "col-1 d-flex justify-content-center align-item-center",
                                              children: _jsx(Link, {
                                                to: `/${MEDICAO_INICIAL}/${EMPENHOS}/${EDITAR_EMPENHO}/?uuid=${empenho.uuid}`,
                                                children: _jsx("span", {
                                                  className: "px-2",
                                                  children: _jsx("i", {
                                                    title: "Editar Empenho",
                                                    className:
                                                      "verde fas fa-edit",
                                                  }),
                                                }),
                                              }),
                                            }),
                                          ],
                                        },
                                        empenho.numero
                                      )
                                    ),
                                  }),
                                ],
                              }),
                              _jsx(Paginacao, {
                                onChange: (page) => onChangePage(page, filtros),
                                total: responseEmpenhos?.count,
                                pageSize: responseEmpenhos?.page_size,
                                current: paginaAtual,
                              }),
                            ],
                          }),
                    ],
                  }),
                ],
              }),
            })
          : null,
      }),
    ],
  });
}
