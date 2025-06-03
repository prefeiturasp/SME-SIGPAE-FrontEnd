import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Filtros } from "./components/Filtros/";
import { Paginacao } from "src/components/Shareable/Paginacao";
import {
  MEDICAO_INICIAL,
  CLAUSULAS_PARA_DESCONTOS,
  CADASTRO_DE_CLAUSULA,
  EDITAR_CLAUSULA,
} from "src/configs/constants";
import {
  deletaClausulaParaDesconto,
  getClausulasParaDescontos,
} from "src/services/medicaoInicial/clausulasParaDescontos.service";
import { getNumerosEditais } from "src/services/edital.service";
import "./styles.scss";
import { ModalExcluirClausula } from "./components/ModalExcluirClausula";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
export function ClausulasParaDescontos() {
  const [clausulas, setClausulas] = useState([]);
  const [responseClausulas, setResponseClausulas] = useState();
  const [editais, setEditais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroAPI, setErroAPI] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtros, setFiltros] = useState();
  const [exibirModal, setExibirModal] = useState(false);
  const [uuidClausula, setUuidClausula] = useState("");
  const [carregandoExclusao, setCarregandoExclusao] = useState(false);
  const getClausulasAsync = async (page = null, filtros = null) => {
    try {
      const { data } = await getClausulasParaDescontos(page, filtros);
      setClausulas(data.results);
      setResponseClausulas(data);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar cláusulas para descontos. Tente novamente mais tarde."
      );
    }
  };
  const getEditaisAsync = async () => {
    setCarregando(true);
    try {
      const { data } = await getNumerosEditais();
      setEditais(data.results);
    } catch (error) {
      setErroAPI("Erro ao carregar editais. Tente novamente mais tarde.");
    }
  };
  const excluirClausula = async (uuid) => {
    setCarregandoExclusao(true);
    try {
      await deletaClausulaParaDesconto(uuid);
      setClausulas((prevState) =>
        prevState.filter((clausula) => clausula.uuid !== uuid)
      );
      toastSuccess("Cláusula excluída com sucesso!");
    } catch (error) {
      toastError("Erro ao excluir cláusula. Tente novamente mais tarde.");
    } finally {
      setCarregandoExclusao(false);
      setExibirModal(false);
    }
  };
  const requisicoesPreRender = async () => {
    await Promise.all([getClausulasAsync(), getEditaisAsync()]).then(() => {
      setCarregando(false);
    });
  };
  useEffect(() => {
    setPaginaAtual(1);
    requisicoesPreRender();
  }, []);
  const formataValor = (value) => {
    return (
      `${value}`
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        .replace(/\.(?=\d{0,2}$)/g, ",")
        .replace(/,00/, "") + "%"
    );
  };
  const onChangePage = async (page, filtros) => {
    setPaginaAtual(page);
    setCarregando(true);
    await getClausulasAsync(page, filtros);
    setCarregando(false);
  };
  return _jsxs("div", {
    className: "clausulas-desconto",
    children: [
      erroAPI && _jsx("div", { children: erroAPI }),
      _jsxs(Spin, {
        tip: "Carregando...",
        spinning: carregando,
        children: [
          _jsx(ModalExcluirClausula, {
            uuid: uuidClausula,
            show: exibirModal,
            carregando: carregandoExclusao,
            handleClose: () => setExibirModal(false),
            handleConfirm: excluirClausula,
          }),
          _jsx("div", {
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
                  editais: editais,
                }),
                _jsxs("div", {
                  className: "mt-4",
                  children: [
                    _jsx(Link, {
                      to: `/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}/${CADASTRO_DE_CLAUSULA}/`,
                      className: "pt-4",
                      children: _jsx(Botao, {
                        texto: "Cadastrar Cl\u00E1usulas",
                        type: BUTTON_TYPE.BUTTON,
                        style: BUTTON_STYLE.GREEN,
                      }),
                    }),
                    clausulas.length === 0 && !carregando
                      ? _jsx("div", {
                          className: "text-center mt-4 mb-4",
                          children: "Nenhum resultado encontrado",
                        })
                      : _jsxs("div", {
                          className: "tabela-clausulas mt-4 mb-4",
                          children: [
                            _jsx("div", {
                              className: "titulo-tabela mt-5 mb-3",
                              children: "Cl\u00E1usulas Cadastradas",
                            }),
                            _jsxs("table", {
                              children: [
                                _jsx("thead", {
                                  children: _jsxs("tr", {
                                    className: "row",
                                    children: [
                                      _jsx("th", {
                                        className: "col-3",
                                        children: "N\u00BA do Edital",
                                      }),
                                      _jsx("th", {
                                        className: "col-2",
                                        children: "Cl\u00E1usula",
                                      }),
                                      _jsx("th", {
                                        className: "col-1",
                                        children: "Item",
                                      }),
                                      _jsx("th", {
                                        className: "col-4",
                                        children: "Descri\u00E7\u00E3o",
                                      }),
                                      _jsx("th", {
                                        className: "col-1",
                                        children: "% de Desconto",
                                      }),
                                      _jsx("th", {
                                        className: "col-1 text-center",
                                        children: "A\u00E7\u00F5es",
                                      }),
                                    ],
                                  }),
                                }),
                                _jsx("tbody", {
                                  children: clausulas.map((clausula) =>
                                    _jsxs(
                                      "tr",
                                      {
                                        className: "row",
                                        children: [
                                          _jsx("td", {
                                            className: "col-3",
                                            children: clausula.edital.numero,
                                          }),
                                          _jsx("td", {
                                            className: "col-2",
                                            children: clausula.numero_clausula,
                                          }),
                                          _jsx("td", {
                                            className: "col-1",
                                            children: clausula.item_clausula,
                                          }),
                                          _jsx("td", {
                                            className: "col-4",
                                            children: clausula.descricao,
                                          }),
                                          _jsx("td", {
                                            className: "col-1",
                                            children: formataValor(
                                              clausula.porcentagem_desconto
                                            ),
                                          }),
                                          _jsxs("td", {
                                            className:
                                              "col-1 d-flex justify-content-center",
                                            children: [
                                              _jsx(Link, {
                                                to: `/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}/${EDITAR_CLAUSULA}/?uuid=${clausula.uuid}`,
                                                children: _jsx("span", {
                                                  className: "px-2",
                                                  children: _jsx("i", {
                                                    title:
                                                      "Editar Cl\u00E1usula",
                                                    className:
                                                      "verde fas fa-edit",
                                                  }),
                                                }),
                                              }),
                                              _jsx(Botao, {
                                                titulo: "Excluir Cl\u00E1usula",
                                                type: BUTTON_TYPE.BUTTON,
                                                icon: BUTTON_ICON.TRASH,
                                                onClick: () => {
                                                  setUuidClausula(
                                                    clausula.uuid
                                                  );
                                                  setExibirModal(true);
                                                },
                                                className: "botao-excluir",
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      clausula.uuid
                                    )
                                  ),
                                }),
                              ],
                            }),
                            _jsx(Paginacao, {
                              onChange: (page) => onChangePage(page, filtros),
                              total: responseClausulas?.count,
                              pageSize: responseClausulas?.page_size,
                              current: paginaAtual,
                            }),
                          ],
                        }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
