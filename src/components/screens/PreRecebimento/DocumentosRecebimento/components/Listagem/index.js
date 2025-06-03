import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import "./styles.scss";
import {
  PRE_RECEBIMENTO,
  DETALHAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO,
  CORRIGIR_DOCUMENTOS_RECEBIMENTO,
} from "../../../../../../configs/constants";
import { downloadArquivoLaudoAssinado } from "src/services/documentosRecebimento.service";
import { Tooltip } from "antd";
import { truncarString } from "../../../../../../helpers/utilities";
const Listagem = ({ objetos, setCarregando }) => {
  const renderizarStatus = (status) => {
    const perfilFornecedor =
      JSON.parse(localStorage.getItem("perfil")) === "ADMINISTRADOR_EMPRESA";
    return perfilFornecedor && status === "Enviado para Correção"
      ? _jsx("span", {
          className: "orange",
          children: "Solicitada Corre\u00E7\u00E3o",
        })
      : status;
  };
  const renderizarAcoes = (objeto) => {
    const botaoDetalharVerde = _jsx(NavLink, {
      className: "float-start",
      to: `/${PRE_RECEBIMENTO}/${DETALHAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO}?uuid=${objeto.uuid}`,
      children: _jsx("span", {
        className: "link-acoes px-2",
        children: _jsx("i", {
          title: "Detalhar",
          className: "fas fa-eye green",
        }),
      }),
    });
    const botaoBaixarLaudo = _jsx("span", {
      className: "link-acoes px-2",
      children: _jsx("button", {
        onClick: () => baixarArquivoLaudo(objeto),
        children: _jsx("i", {
          title: "Baixar Laudo",
          className: "fas fa-file-download green",
        }),
      }),
    });
    const botaoCorrigirLaranja = _jsx(NavLink, {
      className: "float-start",
      to: `/${PRE_RECEBIMENTO}/${CORRIGIR_DOCUMENTOS_RECEBIMENTO}?uuid=${objeto.uuid}`,
      children: _jsx("span", {
        className: "link-acoes px-2",
        children: _jsx("i", {
          title: "Corrigir",
          className: "fas fa-edit orange",
        }),
      }),
    });
    return _jsxs(_Fragment, {
      children: [
        ["Enviado para Análise", "Aprovado"].includes(objeto.status) &&
          botaoDetalharVerde,
        objeto.status === "Enviado para Correção" && botaoCorrigirLaranja,
        objeto.status === "Aprovado" && botaoBaixarLaudo,
      ],
    });
  };
  const baixarArquivoLaudo = async (objeto) => {
    setCarregando(true);
    try {
      downloadArquivoLaudoAssinado(objeto.uuid, objeto.numero_cronograma);
    } finally {
      setCarregando(false);
    }
  };
  return _jsxs("div", {
    className: "listagem-documentos-recebimento",
    children: [
      _jsx("header", {
        children: _jsxs("div", {
          className: "row mt-3",
          children: [
            _jsx("div", {
              className: "col-5 px-0",
              children: _jsx("div", {
                className: "titulo-verde",
                children: "Documentos Cadastrados",
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
              _jsx("div", { children: "N\u00BA do Cronograma" }),
              _jsx("div", { children: "N\u00BA do Laudo" }),
              _jsx("div", {
                children: "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
              }),
              _jsx("div", { children: "Nome do Produto" }),
              _jsx("div", { children: "Data de Cadastro" }),
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
                    _jsx("div", { children: objeto.numero_cronograma }),
                    _jsx("div", { children: objeto.numero_laudo }),
                    _jsx("div", { children: objeto.pregao_chamada_publica }),
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
                    _jsx("div", { children: objeto.criado_em }),
                    _jsx("div", { children: renderizarStatus(objeto.status) }),
                    _jsx("div", {
                      className: "actions",
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
