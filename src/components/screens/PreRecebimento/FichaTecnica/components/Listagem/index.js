import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import {
  PRE_RECEBIMENTO,
  CADASTRAR_FICHA_TECNICA,
  DETALHAR_FICHA_TECNICA,
  ALTERAR_FICHA_TECNICA,
} from "src/configs/constants";
import "./styles.scss";
import { Tooltip } from "antd";
import { truncarString } from "../../../../../../helpers/utilities";
import { imprimirFicha } from "../../helpers";
const Listagem = ({ objetos, setCarregando }) => {
  const renderizarStatus = (status) =>
    status === "Enviada para Correção"
      ? _jsx("span", {
          className: "orange",
          children: "Solicita\u00E7\u00E3o de Altera\u00E7\u00E3o",
        })
      : status;
  const baixarPDFFichaTecnica = (ficha) => {
    setCarregando(true);
    imprimirFicha(ficha.uuid, ficha.numero, setCarregando);
  };
  const renderizarAcoes = (objeto) => {
    const botaoContinuarCadastro = _jsx(NavLink, {
      className: "float-start",
      to: `/${PRE_RECEBIMENTO}/${CADASTRAR_FICHA_TECNICA}?uuid=${objeto.uuid}`,
      children: _jsx("span", {
        className: "link-acoes px-2",
        children: _jsx("i", {
          title: "Continuar Cadastro",
          className: "fas fa-edit green",
        }),
      }),
    });
    const botaoDetalhar = _jsx(NavLink, {
      className: "float-start",
      to: `/${PRE_RECEBIMENTO}/${DETALHAR_FICHA_TECNICA}?uuid=${objeto.uuid}`,
      children: _jsx("span", {
        className: "link-acoes px-2",
        children: _jsx("i", {
          title: "Detalhar",
          className: "fas fa-eye green",
        }),
      }),
    });
    const botaoAlterar = _jsx(NavLink, {
      className: "float-start",
      to: `/${PRE_RECEBIMENTO}/${ALTERAR_FICHA_TECNICA}?uuid=${objeto.uuid}`,
      children: _jsx("span", {
        className: "link-acoes px-2",
        children: _jsx("i", {
          title: "Alterar",
          className: "fas fa-edit orange",
        }),
      }),
    });
    const botaoImprimir = _jsx("span", {
      className: "float-start ms-1 link-acoes green",
      onClick: () => baixarPDFFichaTecnica(objeto),
      "data-testid": "btnImprimir",
      children: _jsx("i", { className: "fas fa-print", title: "Ficha em PDF" }),
    });
    return _jsxs("div", {
      className: "d-flex",
      children: [
        objeto.status === "Rascunho" && botaoContinuarCadastro,
        ["Enviada para Análise", "Aprovada"].includes(objeto.status) &&
          botaoDetalhar,
        objeto.status === "Enviada para Correção" && botaoAlterar,
        ["Enviada para Análise", "Aprovada"].includes(objeto.status) &&
          botaoImprimir,
      ],
    });
  };
  return _jsxs("div", {
    className: "listagem-fichas-tecnicas",
    children: [
      _jsx("header", {
        children: _jsxs("div", {
          className: "row mt-3",
          children: [
            _jsx("div", {
              className: "col-5 px-0",
              children: _jsx("div", {
                className: "titulo-verde",
                children: "Fichas T\u00E9cnicas Cadastradas",
              }),
            }),
            _jsx("div", {
              className: "col-7 px-0 text-end",
              children: _jsxs("p", {
                className: "mb-0",
                children: [
                  _jsx("i", { className: "fa fa-info-circle me-2" }),
                  "Veja a descri\u00E7\u00E3o do produto passando o mouse sobre o nome.",
                ],
              }),
            }),
          ],
        }),
      }),
      _jsxs("article", {
        children: [
          _jsxs("div", {
            className: "grid-table header-table",
            children: [
              _jsx("div", { children: "N\u00BA da Ficha" }),
              _jsx("div", { children: "Nome do Produto" }),
              _jsx("div", {
                children: "N\u00BA Preg\u00E3o/Chamada P\u00FAblica",
              }),
              _jsx("div", { children: "Data do Cadastro" }),
              _jsx("div", { children: "Status" }),
              _jsx("div", { children: "A\u00E7\u00F5es" }),
            ],
          }),
          objetos.map((objeto) => {
            return _jsx(_Fragment, {
              children: _jsxs(
                "div",
                {
                  className: "grid-table body-table",
                  children: [
                    _jsx("div", { children: objeto.numero }),
                    _jsx("div", {
                      children: _jsx(Tooltip, {
                        color: "#42474a",
                        overlayStyle: {
                          maxWidth: "320px",
                          fontSize: "12px",
                          fontWeight: "700",
                        },
                        title: objeto.nome_produto,
                        children: truncarString(objeto.nome_produto, 30),
                      }),
                    }),
                    _jsx("div", { children: objeto.pregao_chamada_publica }),
                    _jsx("div", { children: objeto.criado_em }),
                    _jsx("div", { children: renderizarStatus(objeto.status) }),
                    _jsx("div", {
                      className: "p-0",
                      children: renderizarAcoes(objeto),
                    }),
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
