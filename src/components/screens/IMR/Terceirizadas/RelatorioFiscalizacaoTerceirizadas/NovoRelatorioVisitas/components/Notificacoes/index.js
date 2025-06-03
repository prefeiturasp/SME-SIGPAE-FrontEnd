import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Botao from "src/components/Shareable/Botao";
import { downloadAndConvertToBase64 } from "src/components/Shareable/Input/InputFile/helper";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import InputFileField from "src/components/Shareable/InputFileField";
export const Notificacoes = ({ ...props }) => {
  const {
    onClickBaixarNotificacoes,
    setNotificacoesAssinadas,
    notificacoesAssinadas,
    notificacoesIniciais,
    somenteLeitura,
    disabledBaixarNotificacoes,
  } = props;
  const [arquivosIniciais, setArquivosIniciais] = useState();
  useEffect(() => {
    if (notificacoesIniciais && notificacoesIniciais.length > 0) {
      formatNotificacoesIniciais();
    }
  }, [notificacoesIniciais]);
  const formatNotificacoesIniciais = async () => {
    const notificacoesIniciaisFormatadas = await Promise.all(
      notificacoesIniciais.map(async (notificacao_assinada) => {
        return {
          nome: notificacao_assinada.nome,
          base64: await downloadAndConvertToBase64(
            notificacao_assinada.anexo_url
          ),
        };
      })
    );
    setArquivosIniciais(notificacoesIniciaisFormatadas);
    setFiles(notificacoesIniciaisFormatadas);
  };
  const setFiles = (files) => {
    const arquivosAtualizados = files.map((arquivo) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });
    setNotificacoesAssinadas(arquivosAtualizados);
  };
  const removeFiles = (index) => {
    let newFiles = [...notificacoesAssinadas];
    newFiles.splice(index, 1);
    setNotificacoesAssinadas(newFiles);
  };
  return _jsx(_Fragment, {
    children:
      !somenteLeitura &&
      _jsxs("div", {
        className: "anexos",
        children: [
          _jsx("div", {
            className: "row",
            children: _jsx("div", {
              className: "col-12 pb-2",
              children: _jsx("span", {
                className: "titulo-anexo",
                children: "NOTIFICA\u00C7\u00D5ES",
              }),
            }),
          }),
          _jsxs("div", {
            className: "row mt-3",
            children: [
              _jsx("div", {
                className: "col-2",
                children: _jsx(Botao, {
                  texto: "Baixar Notifica\u00E7\u00F5es",
                  type: BUTTON_TYPE.BUTTON,
                  style: BUTTON_STYLE.GREEN,
                  icon: BUTTON_ICON.DOWNLOAD,
                  iconPosition: "left",
                  onClick: onClickBaixarNotificacoes,
                  disabled: disabledBaixarNotificacoes,
                }),
              }),
              _jsx("div", {
                className: "col-10",
                children: _jsx(InputFileField, {
                  name: "notificacoes_assinadas",
                  arquivosIniciais: arquivosIniciais,
                  setFiles: setFiles,
                  removeFile: removeFiles,
                  formatosAceitos: "PDF",
                  toastSuccess:
                    "Notifica\u00E7\u00E3o inclu\u00EDda com sucesso!",
                  textoBotao: "Anexar Notifica\u00E7\u00F5es Assinadas",
                  helpText:
                    "Envie o(s) arquivo(s) no formato PDF com at\u00E9 10MB.",
                  required: true,
                }),
              }),
            ],
          }),
        ],
      }),
  });
};
