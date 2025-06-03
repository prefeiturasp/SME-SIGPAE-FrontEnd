import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import InputFileField from "src/components/Shareable/InputFileField";
import { downloadAndConvertToBase64 } from "src/components/Shareable/Input/InputFile/helper";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
const FORMATOS_ARQUIVOS = "PDF, XLS, XLSX, XLSXM, PNG, JPG ou JPEG";
export const Anexos = ({ ...props }) => {
  const { setAnexos, anexos, anexosIniciais, somenteLeitura } = props;
  const [arquivosIniciais, setArquivosIniciais] = useState();
  useEffect(() => {
    if (anexosIniciais && anexosIniciais.length > 0) {
      formatAnexosIniciais();
    }
  }, [anexosIniciais]);
  const formatAnexosIniciais = async () => {
    const anexosIniciaisFormatados = await Promise.all(
      anexosIniciais.map(async (anexo) => {
        return {
          nome: anexo.nome,
          base64: await downloadAndConvertToBase64(anexo.anexo_url),
        };
      })
    );
    setArquivosIniciais(anexosIniciaisFormatados);
    setFiles(anexosIniciaisFormatados);
  };
  const setFiles = (files) => {
    const arquivosAtualizados = files.map((arquivo) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });
    setAnexos(arquivosAtualizados);
  };
  const removeFiles = (index) => {
    let newFiles = [...anexos];
    newFiles.splice(index, 1);
    setAnexos(newFiles);
  };
  return _jsx(_Fragment, {
    children: _jsxs("div", {
      className: "anexos",
      children: [
        _jsx("div", {
          className: "row",
          children: _jsx("div", {
            className: "col-12 pb-2",
            children: _jsx("span", {
              className: "titulo-anexo",
              children: "ANEXOS",
            }),
          }),
        }),
        !somenteLeitura &&
          _jsx("div", {
            className: "row mt-3",
            children: _jsx(InputFileField, {
              name: "anexos",
              arquivosIniciais: arquivosIniciais,
              setFiles: setFiles,
              removeFile: removeFiles,
              formatosAceitos: FORMATOS_ARQUIVOS,
              toastSuccess: "Anexo inclu\u00EDdo com sucesso!",
              textoBotao: "Anexar Arquivos",
              helpText:
                "Envie o(s) arquivo(s) no formato PDF, PNG, JPG, JPEG e Excel (Todos os formatos), com at\u00E9 10MB.",
            }),
          }),
        somenteLeitura &&
          _jsx(_Fragment, {
            children: anexosIniciais?.map((arquivo, index) => {
              return _jsx(
                "div",
                {
                  className: "row mt-2",
                  children: _jsx("div", {
                    className: "col-2",
                    children: _jsx(BotaoAnexo, { urlAnexo: arquivo.anexo_url }),
                  }),
                },
                index
              );
            }),
          }),
      ],
    }),
  });
};
