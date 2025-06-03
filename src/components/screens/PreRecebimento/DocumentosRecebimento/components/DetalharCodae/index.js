import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import {
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import BotaoVoltar from "src/components/Shareable/Page/BotaoVoltar";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import {
  detalharDocumentoParaAnalise,
  downloadArquivoLaudoAssinado,
} from "src/services/documentosRecebimento.service";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import OutrosDocumentos from "../OutrosDocumentos";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [objeto, setObjeto] = useState({});
  const [aprovado, setAprovado] = useState(true);
  const voltarPaginaPainel = () =>
    navigate(`/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`);
  const carregarDados = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharDocumentoParaAnalise(uuid);
    const objeto = response.data;
    const laudoIndex = objeto.tipos_de_documentos.findIndex(
      (tipo) => tipo.tipo_documento === "LAUDO"
    );
    objeto.tipos_de_documentos.splice(laudoIndex, 1)[0];
    setObjeto(objeto);
    setAprovado(objeto.status === "Aprovado");
  };
  useEffect(() => {
    (async () => {
      setCarregando(true);
      await carregarDados();
      setCarregando(false);
    })();
  }, []);
  const baixarArquivoLaudo = async (objeto) => {
    setCarregando(true);
    try {
      await downloadArquivoLaudoAssinado(objeto.uuid, objeto.numero_cronograma);
    } finally {
      setCarregando(false);
    }
  };
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-detalhar-documentos-recebimento-codae",
      children: _jsxs("div", {
        className: "card-body",
        children: [
          objeto.logs &&
            _jsx("div", {
              className: "row my-4",
              children: _jsx(FluxoDeStatusPreRecebimento, {
                listaDeStatus: objeto.logs,
              }),
            }),
          _jsxs("div", {
            className: "flex-header",
            children: [
              _jsx("div", { className: "subtitulo", children: "Dados Gerais" }),
              aprovado
                ? _jsxs("div", {
                    className: "status aprovado",
                    children: [
                      _jsx("i", { className: "fas fa-check-circle" }),
                      "Documentos aprovados em ",
                      objeto?.logs?.slice(-1)[0].criado_em,
                    ],
                  })
                : _jsxs("div", {
                    className: "status correcao",
                    children: [
                      _jsx("i", { className: "fas fa-exclamation-triangle" }),
                      "Solicitada Corre\u00E7\u00E3o em ",
                      objeto?.logs?.slice(-1)[0].criado_em,
                    ],
                  }),
            ],
          }),
          _jsxs("div", {
            className: "row",
            children: [
              _jsx("div", {
                className: "col-12",
                children: _jsx(InputText, {
                  label: "Fornecedor",
                  valorInicial: objeto.fornecedor,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Cronograma",
                  valorInicial: objeto.numero_cronograma,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                  valorInicial: objeto.pregao_chamada_publica,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "Nome do Produto",
                  valorInicial: objeto.nome_produto,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Processo SEI",
                  valorInicial: objeto.numero_sei,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Laudo",
                  valorInicial: objeto.numero_laudo,
                  disabled: true,
                }),
              }),
            ],
          }),
          _jsx("div", {
            className: "subtitulo-documento",
            children: "Laudo enviado pelo Fornecedor:",
          }),
          _jsx("div", {
            className: "row mt-2",
            children: _jsx("div", {
              className: "col-4",
              children: _jsx(BotaoAnexo, {
                textoBotao: "Laudo Analisado",
                onClick: () => baixarArquivoLaudo(objeto),
              }),
            }),
          }),
          _jsx("hr", {}),
          aprovado === false &&
            _jsxs(_Fragment, {
              children: [
                _jsx("div", {
                  className: "subtitulo laranja",
                  children: "Solicita\u00E7\u00E3o de Corre\u00E7\u00E3o",
                }),
                _jsxs("div", {
                  className: "row",
                  children: [
                    _jsxs("div", {
                      className: "col-6",
                      children: [
                        "Data da Solicita\u00E7\u00E3o:",
                        _jsxs("strong", {
                          children: [
                            " ",
                            objeto?.logs?.slice(-1)[0].criado_em.split(" ")[0],
                          ],
                        }),
                      ],
                    }),
                    _jsxs("div", {
                      className: "col-6",
                      children: [
                        "Solicitado por:",
                        _jsxs("strong", {
                          children: [
                            " ",
                            objeto?.logs?.slice(-1)[0].usuario.nome,
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                _jsx("div", {
                  className: "row",
                  children: _jsx("div", {
                    className: "col-12",
                    children: _jsx(TextArea, {
                      label: "Corre\u00E7\u00F5es Necess\u00E1rias",
                      valorInicial: objeto.correcao_solicitada,
                      disabled: true,
                    }),
                  }),
                }),
                _jsx("hr", {}),
              ],
            }),
          _jsx("div", { className: "subtitulo", children: "Dados do Laudo" }),
          _jsx("div", {
            className: "row",
            children: _jsx("div", {
              className: "col-6",
              children: _jsx(InputText, {
                label: "Nome do Laborat\u00F3rio",
                valorInicial: objeto.laboratorio?.nome,
                disabled: true,
              }),
            }),
          }),
          _jsxs("div", {
            className: "row",
            children: [
              _jsx("div", {
                className: "col-4",
                children: _jsx(InputText, {
                  label: "Quantidade do Laudo",
                  valorInicial: objeto.quantidade_laudo,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-4",
                children: _jsx(InputText, {
                  label: "Unidade de Medida",
                  valorInicial: objeto.unidade_medida?.nome,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-4",
                children: _jsx(InputText, {
                  label: "Saldo do Laudo",
                  valorInicial: objeto.saldo_laudo,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-4",
                children: _jsx(InputText, {
                  label: "Data Final do Laudo",
                  valorInicial: objeto.data_final_lote,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-8",
                children: _jsx(InputText, {
                  label: "N\u00BA do(s) Lote(s) do(s) Laudo(s)",
                  valorInicial: objeto.numero_lote_laudo,
                  disabled: true,
                }),
              }),
              objeto.datas_fabricacao_e_prazos?.map((prazo, index) =>
                _jsxs(
                  "div",
                  {
                    className: "row",
                    children: [
                      _jsx("div", {
                        className: "col",
                        children: _jsx(InputText, {
                          label: "Data de Fabrica\u00E7\u00E3o",
                          valorInicial: prazo.data_fabricacao,
                          disabled: true,
                        }),
                      }),
                      _jsx("div", {
                        className: "col",
                        children: _jsx(InputText, {
                          label: "Data de Validade",
                          valorInicial: prazo.data_validade,
                          disabled: true,
                        }),
                      }),
                      _jsx("div", {
                        className: "col",
                        children: _jsx(InputText, {
                          label: "Prazo M\u00E1ximo de Recebimento",
                          valorInicial: prazo.prazo_maximo_recebimento,
                          disabled: true,
                        }),
                      }),
                      prazo.prazo_maximo_recebimento !== "OUTRO" &&
                        _jsx("div", {
                          className: "col",
                          children: _jsx(InputText, {
                            label: "Data M\u00E1xima de Recebimento",
                            valorInicial: prazo.data_maxima_recebimento,
                            disabled: true,
                          }),
                        }),
                      prazo.prazo_maximo_recebimento === "OUTRO" &&
                        _jsx("div", {
                          className: "col-12",
                          children: _jsx(InputText, {
                            label:
                              "Justifique Outro prazo m\u00E1ximo para Recebimento",
                            valorInicial: prazo.justificativa,
                            disabled: true,
                          }),
                        }),
                    ],
                  },
                  index
                )
              ),
            ],
          }),
          _jsx("hr", {}),
          _jsx(OutrosDocumentos, { documento: objeto }),
          _jsx("hr", {}),
          _jsx(BotaoVoltar, { onClick: voltarPaginaPainel }),
        ],
      }),
    }),
  });
};
