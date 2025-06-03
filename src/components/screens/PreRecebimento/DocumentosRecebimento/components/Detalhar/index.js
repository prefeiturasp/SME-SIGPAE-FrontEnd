import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import {
  DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  ATUALIZAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO,
} from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import BotaoVoltar from "src/components/Shareable/Page/BotaoVoltar";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import { detalharDocumentoRecebimento } from "src/services/documentosRecebimento.service";
import InputText from "src/components/Shareable/Input/InputText";
import ArquivosTipoRecebimento from "../ArquivosTipoDocumento";
import OutrosDocumentos from "../OutrosDocumentos";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { STATUS_DOCUMENTOS_DE_RECEBIMENTO } from "src/constants/shared";
export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [objeto, setObjeto] = useState({});
  const [laudo, setLaudo] = useState();
  const voltarPagina = () => {
    const link = usuarioEhEmpresaFornecedor()
      ? `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`
      : `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`;
    navigate(link);
  };
  const showBotaoAtualizarDocumento = () => {
    return (
      usuarioEhEmpresaFornecedor() &&
      objeto.status === STATUS_DOCUMENTOS_DE_RECEBIMENTO.APROVADO
    );
  };
  const goToAtualizarFornecedorDocumentosRecebimentoPage = () => {
    navigate(
      `/${PRE_RECEBIMENTO}/${ATUALIZAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO}?uuid=${objeto.uuid}`
    );
  };
  const carregarDados = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharDocumentoRecebimento(uuid);
    const objeto = response.data;
    const laudoIndex = objeto.tipos_de_documentos.findIndex(
      (tipo) => tipo.tipo_documento === "LAUDO"
    );
    if (laudoIndex !== -1) {
      const laudo = objeto.tipos_de_documentos.splice(laudoIndex, 1)[0];
      setLaudo(laudo);
    }
    setObjeto(objeto);
  };
  useEffect(() => {
    (async () => {
      setCarregando(true);
      await carregarDados();
      setCarregando(false);
    })();
  }, []);
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-detalhar-documentos-recebimento",
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
            className: "row",
            children: [
              _jsxs("div", {
                className: "col-6",
                children: [
                  "Data da Cria\u00E7\u00E3o:",
                  _jsxs("span", {
                    className: "green-bold",
                    children: [" ", objeto.criado_em],
                  }),
                ],
              }),
              _jsxs("div", {
                className: "col-6",
                children: [
                  "Status:",
                  _jsxs("span", {
                    className: "green-bold",
                    children: [" ", objeto.status],
                  }),
                ],
              }),
            ],
          }),
          _jsx("hr", {}),
          _jsx("div", { className: "subtitulo", children: "Dados do Laudo" }),
          _jsxs("div", {
            className: "row",
            children: [
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Cronograma",
                  valorInicial: objeto.numero_cronograma,
                  required: true,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                  valorInicial: objeto.pregao_chamada_publica,
                  required: true,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "Nome do Produto",
                  valorInicial: objeto.nome_produto,
                  required: true,
                  disabled: true,
                }),
              }),
              _jsx("div", {
                className: "col-6",
                children: _jsx(InputText, {
                  label: "N\u00BA do Laudo",
                  valorInicial: objeto.numero_laudo,
                  required: true,
                  disabled: true,
                }),
              }),
            ],
          }),
          _jsx(ArquivosTipoRecebimento, { lista: laudo }),
          _jsx("hr", {}),
          _jsx(OutrosDocumentos, { documento: objeto }),
          _jsx("hr", {}),
          _jsxs("div", {
            className: "my-5",
            children: [
              showBotaoAtualizarDocumento()
                ? _jsx(Botao, {
                    texto: "Atualizar Documentos",
                    type: BUTTON_TYPE.BUTTON,
                    style: BUTTON_STYLE.GREEN,
                    className: "float-end ms-3",
                    onClick: goToAtualizarFornecedorDocumentosRecebimentoPage,
                  })
                : null,
              _jsx(BotaoVoltar, { onClick: voltarPagina }),
            ],
          }),
        ],
      }),
    }),
  });
};
