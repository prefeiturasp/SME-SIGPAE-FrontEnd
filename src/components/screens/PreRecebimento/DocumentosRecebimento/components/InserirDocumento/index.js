import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Field } from "react-final-form";
import InputFile from "src/components/Shareable/Input/InputFile";
import { DEZ_MB } from "../../../../../../constants/shared";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { textAreaRequired } from "src/helpers/fieldValidators";
import { OUTROS_DOCUMENTOS_OPTIONS } from "../../constants";
const InserirDocumento = ({
  setFiles,
  removeFile,
  tipoDocumento = "",
  arquivosIniciais = [],
  formatosAceitos = "PDF, PNG, JPG ou JPEG",
  multiplosArquivos = true,
  concatenarNovosArquivos = true,
}) => {
  const titulo = OUTROS_DOCUMENTOS_OPTIONS.find(
    (obj) => obj.value === tipoDocumento
  )?.label;
  return _jsxs(_Fragment, {
    children: [
      titulo &&
        _jsx("div", {
          className: "row mt-3",
          children: _jsx("div", {
            className: "col",
            children: _jsxs("div", {
              className: "subtitulo mb-0",
              children: [
                _jsx("span", { className: "asterisco", children: "* " }),
                titulo,
              ],
            }),
          }),
        }),
      tipoDocumento === "OUTROS" &&
        _jsx("div", {
          className: "mt-1",
          children: _jsx(Field, {
            component: TextArea,
            label: "Descri\u00E7\u00E3o dos Documentos",
            name: `descricao_documento`,
            placeholder: "Descreva o tipo de documento",
            required: true,
            validate: textAreaRequired,
          }),
        }),
      _jsxs("div", {
        className: "row",
        children: [
          _jsx(Field, {
            component: InputFile,
            arquivosPreCarregados: arquivosIniciais,
            className: "inputfile",
            texto: titulo ? "Anexar Documentos" : "Anexar Laudo",
            name: "files",
            accept: formatosAceitos,
            setFiles: setFiles,
            removeFile: removeFile,
            toastSuccess: "Documento incluído com sucesso!",
            alignLeft: true,
            multiple: multiplosArquivos,
            limiteTamanho: DEZ_MB,
            concatenarNovosArquivos: concatenarNovosArquivos,
          }),
          _jsxs("label", {
            className: "col-12 label-imagem",
            children: [
              _jsx("span", {
                className: "red",
                children: "* Campo Obrigat\u00F3rio: \u00A0",
              }),
              titulo
                ? "Envie um arquivo nos formatos: " +
                  formatosAceitos +
                  ", com até 10MB"
                : "Envie um arquivo no formato: " +
                  formatosAceitos +
                  " com até 10MB",
            ],
          }),
        ],
      }),
    ],
  });
};
export default InserirDocumento;
