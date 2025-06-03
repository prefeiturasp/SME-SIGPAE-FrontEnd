import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import "./styles.scss";
const Listagem = ({ objetos, ativos, setAtivos }) => {
  return _jsxs("div", {
    className: "listagem-relatorio-cronograma",
    children: [
      _jsx("div", {
        className: "titulo-verde mt-4 mb-3",
        children: "Resultado da Pesquisa",
      }),
      _jsxs("article", {
        children: [
          _jsxs("div", {
            className: "grid-table header-table",
            children: [
              _jsx("div", { children: "N\u00BA do Cronograma" }),
              _jsx("div", { children: "Produto" }),
              _jsx("div", { children: "Empresa" }),
              _jsx("div", { children: "Quantidade" }),
              _jsx("div", { children: "Armaz\u00E9m" }),
              _jsx("div", { children: "Status" }),
              _jsx("div", {}),
            ],
          }),
          objetos.map((cronograma) => {
            const icone =
              ativos && ativos.includes(cronograma.uuid)
                ? "chevron-up"
                : "chevron-down";
            return _jsxs(_Fragment, {
              children: [
                _jsxs(
                  "div",
                  {
                    className: "grid-table body-table",
                    children: [
                      _jsx("div", { children: cronograma.numero }),
                      _jsx("div", { children: cronograma.produto }),
                      _jsx("div", { children: cronograma.empresa }),
                      _jsx("div", {
                        children: cronograma.qtd_total_programada,
                      }),
                      _jsx("div", { children: cronograma.armazem }),
                      _jsx("div", { children: cronograma.status }),
                      _jsx("div", {
                        children: _jsx("i", {
                          className: `fas fa-${icone} expand`,
                          "data-testid": "icone-expandir",
                          onClick: () => {
                            ativos && ativos.includes(cronograma.uuid)
                              ? setAtivos(
                                  ativos.filter((el) => el !== cronograma.uuid)
                                )
                              : setAtivos(
                                  ativos
                                    ? [...ativos, cronograma.uuid]
                                    : [cronograma.uuid]
                                );
                          },
                        }),
                      }),
                    ],
                  },
                  cronograma.uuid
                ),
                ativos &&
                  ativos.includes(cronograma.uuid) &&
                  _jsxs("div", {
                    className: "sub-item",
                    children: [
                      _jsxs("div", {
                        className: "row",
                        children: [
                          _jsxs("div", {
                            className: "col-6",
                            children: [
                              _jsx("span", {
                                className: "fw-bold me-1",
                                children: "Marca:",
                              }),
                              _jsx("span", { children: cronograma.marca }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "col-6",
                            children: [
                              _jsx("span", {
                                className: "fw-bold me-1",
                                children: "Custo Unit\u00E1rio:",
                              }),
                              _jsx("span", {
                                children: cronograma.custo_unitario_produto,
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsxs("article", {
                        className: "mt-3",
                        children: [
                          _jsxs("div", {
                            className: "grid-table header-table",
                            children: [
                              _jsx("div", { children: "Etapa" }),
                              _jsx("div", { children: "Parte" }),
                              _jsx("div", { children: "Data programada" }),
                              _jsx("div", { children: "Quantidade" }),
                              _jsx("div", { children: "Total de Embalagens" }),
                              _jsx("div", { children: "Situa\u00E7\u00E3o" }),
                            ],
                          }),
                          cronograma.etapas.map((etapa) => {
                            return _jsx(_Fragment, {
                              children: _jsxs(
                                "div",
                                {
                                  className: "grid-table body-table",
                                  children: [
                                    _jsx("div", { children: etapa.etapa }),
                                    _jsx("div", { children: etapa.parte }),
                                    _jsx("div", {
                                      children: etapa.data_programada,
                                    }),
                                    _jsx("div", { children: etapa.quantidade }),
                                    _jsx("div", {
                                      children: etapa.total_embalagens,
                                    }),
                                    _jsx("div", {}),
                                  ],
                                },
                                etapa.uuid
                              ),
                            });
                          }),
                        ],
                      }),
                    ],
                  }),
              ],
            });
          }),
        ],
      }),
    ],
  });
};
export default Listagem;
