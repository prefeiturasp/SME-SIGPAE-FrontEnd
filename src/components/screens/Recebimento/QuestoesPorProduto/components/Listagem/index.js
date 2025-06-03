import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Label from "src/components/Shareable/Label";
import {
  RECEBIMENTO,
  EDITAR_ATRIBUICAO_QUESTOES_CONFERENCIA,
  COPIAR_ATRIBUICAO_QUESTOES_CONFERENCIA,
} from "src/configs/constants";
import "./styles.scss";
const Listagem = ({ questoesPorProdutos }) => {
  const [collapseAberto, setCollapseAberto] = useState(-1);
  const accordionQuestoes = useRef();
  const trocarCollapseAberto = (index) =>
    collapseAberto === index ? setCollapseAberto(-1) : setCollapseAberto(index);
  useEffect(() => {
    setCollapseAberto(-1);
    fecharCollapsesQuestoes();
  }, [questoesPorProdutos]);
  const renderizarAcoes = (questao) => {
    const botaoEditar = _jsx(NavLink, {
      className: "float-start",
      to: `/${RECEBIMENTO}/${EDITAR_ATRIBUICAO_QUESTOES_CONFERENCIA}?uuid=${questao.uuid}`,
      children: _jsx("span", {
        className: "link-acoes px-2",
        children: _jsx("i", {
          title: "Editar",
          className: "fas fa-edit green",
        }),
      }),
    });
    const botaoCopiar = _jsx(NavLink, {
      className: "float-start",
      to: `/${RECEBIMENTO}/${COPIAR_ATRIBUICAO_QUESTOES_CONFERENCIA}?uuid=${
        questao.uuid
      }&copia=${true}`,
      children: _jsx("span", {
        className: "link-acoes px-2",
        children: _jsx("i", {
          title: "Fazer C\u00F3pia",
          className: "fas fa-copy green",
        }),
      }),
    });
    return _jsxs(_Fragment, { children: [botaoEditar, botaoCopiar] });
  };
  const fecharCollapsesQuestoes = () => {
    const collapses = Array.from(accordionQuestoes.current.children);
    collapses.forEach((collapse) => {
      collapse.querySelector(".show")?.classList.toggle("show");
    });
  };
  const renderizarQuestoes = (questoes) =>
    questoes.map((e, index) =>
      _jsx("div", { className: "p-1", children: e }, index)
    );
  const labelQuestoesPrimarias = _jsxs("span", {
    children: [
      "Quest\u00F5es Atribu\u00EDdas a",
      " ",
      _jsx("span", {
        className: "bold-verde",
        children: "Embalagem Prim\u00E1ria",
      }),
    ],
  });
  const labelQuestoesSecundarias = _jsxs("span", {
    children: [
      "Quest\u00F5es Atribu\u00EDdas a",
      " ",
      _jsx("span", {
        className: "bold-verde",
        children: "Embalagem Secund\u00E1ria",
      }),
    ],
  });
  return _jsxs("div", {
    className: "listagem-questoes-por-produtos",
    children: [
      _jsx("div", {
        className: "titulo-verde mt-2 mb-3",
        children: "Produtos com Quest\u00F5es Atribu\u00EDdas",
      }),
      _jsxs("article", {
        children: [
          _jsxs("div", {
            className: "grid-table header-table",
            children: [
              _jsx("div", { children: "Ficha T\u00E9cnica" }),
              _jsx("div", { children: "Produto" }),
              _jsx("div", { children: "Quest\u00F5es" }),
              _jsx("div", { children: "A\u00E7\u00F5es" }),
            ],
          }),
          _jsx("div", {
            className: "accordion accordion-flush",
            id: "accordionQuestoes",
            ref: accordionQuestoes,
            children: questoesPorProdutos.map((questao, index) =>
              _jsxs(
                "div",
                {
                  className: "accordion-item",
                  children: [
                    _jsxs("div", {
                      className: "grid-table body-table accordion-header",
                      id: `heading${questao.uuid}`,
                      children: [
                        _jsx("div", { children: questao.numero_ficha }),
                        _jsx("div", { children: questao.nome_produto }),
                        _jsx("div", {
                          children: _jsx("span", {
                            className: "botao-expandir-questoes collapsed",
                            onClick: () => trocarCollapseAberto(index),
                            "data-bs-toggle": "collapse",
                            "data-bs-target": `#collapse${questao.uuid}`,
                            "aria-expanded": "false",
                            "aria-controls": `collapse${questao.uuid}`,
                            children:
                              collapseAberto === index
                                ? "Fechar Questões Atribuídas"
                                : "Ver Questões Atribuídas",
                          }),
                        }),
                        _jsx("div", {
                          className: "coluna-acoes",
                          children: renderizarAcoes(questao),
                        }),
                      ],
                    }),
                    _jsx("div", {
                      id: `collapse${questao.uuid}`,
                      className: "accordion-collapse collapse",
                      "aria-labelledby": `heading${questao.uuid}`,
                      "data-bs-parent": "#accordionQuestoes",
                      children: _jsxs("div", {
                        className:
                          "row container-questoes pt-4 pb-5 px-4 accordion-body",
                        children: [
                          _jsxs("div", {
                            className: "col",
                            children: [
                              _jsx(Label, { content: labelQuestoesPrimarias }),
                              _jsx("div", {
                                className: "questoes",
                                children: renderizarQuestoes(
                                  questao.questoes_primarias
                                ),
                              }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "col",
                            children: [
                              _jsx(Label, {
                                content: labelQuestoesSecundarias,
                              }),
                              _jsx("div", {
                                className: "questoes",
                                children: renderizarQuestoes(
                                  questao.questoes_secundarias
                                ),
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                },
                questao.numero_ficha
              )
            ),
          }),
        ],
      }),
    ],
  });
};
export default Listagem;
