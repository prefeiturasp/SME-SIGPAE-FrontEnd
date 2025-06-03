import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Tooltip } from "antd";
import { truncarString } from "src/helpers/utilities";
import "./styles.scss";
const TAMANHO_MAXIMO = 30;
const Listagem = ({ objetos }) => {
  return _jsxs("div", {
    className: "listagem-fichas-recebimento",
    children: [
      _jsx("div", {
        className: "titulo-verde mt-4 mb-3",
        children: "Recebimentos Cadastrados",
      }),
      _jsxs("article", {
        children: [
          _jsxs("div", {
            className: "grid-table header-table",
            children: [
              _jsx("div", { children: "N\u00BA do Cronograma" }),
              _jsx("div", { children: "Nome do Produto" }),
              _jsx("div", { children: "Fornecedor" }),
              _jsx("div", {
                children: "N\u00BA do Preg\u00E3o / Chamada P\u00FAblica",
              }),
              _jsx("div", { children: "Data do Recebimento" }),
            ],
          }),
          objetos.map((objeto) => {
            return _jsx(_Fragment, {
              children: _jsxs(
                "div",
                {
                  className: "grid-table body-table",
                  children: [
                    _jsx("div", { children: objeto.numero_cronograma }),
                    _jsx("div", {
                      children: _jsx(Tooltip, {
                        title: objeto.nome_produto,
                        children: truncarString(
                          objeto.nome_produto,
                          TAMANHO_MAXIMO
                        ),
                      }),
                    }),
                    _jsx("div", {
                      children: _jsx(Tooltip, {
                        title: objeto.fornecedor,
                        children: truncarString(
                          objeto.fornecedor,
                          TAMANHO_MAXIMO
                        ),
                      }),
                    }),
                    _jsx("div", { children: objeto.pregao_chamada_publica }),
                    _jsx("div", { children: objeto.data_recebimento }),
                  ],
                },
                objeto.uuid
              ),
            });
          }),
        ],
      }),
    ],
  });
};
export default Listagem;
