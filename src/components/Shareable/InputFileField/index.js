import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Field } from "react-final-form";
import InputFile from "src/components/Shareable/Input/InputFile";
import { DEZ_MB } from "src/constants/shared";
import "./styles.scss";
const InputFileField = ({
  name,
  textoBotao,
  toastSuccess,
  setFiles,
  removeFile,
  required,
  helpText,
  labelClassName,
  arquivosIniciais = [],
  formatosAceitos = "PDF, PNG, JPG ou JPEG",
  limiteTamanho = DEZ_MB,
  multiplosArquivos = true,
  concatenarNovosArquivos = true,
}) => {
  return _jsxs(_Fragment, {
    children: [
      _jsx(Field, {
        component: InputFile,
        arquivosPreCarregados: arquivosIniciais,
        className: "inputfile",
        texto: textoBotao,
        name: name,
        accept: formatosAceitos,
        setFiles: setFiles,
        removeFile: removeFile,
        toastSuccess: toastSuccess,
        alignLeft: true,
        multiple: multiplosArquivos,
        limiteTamanho: limiteTamanho,
        concatenarNovosArquivos: concatenarNovosArquivos,
      }),
      (required || helpText) &&
        _jsxs("label", {
          className: `col-12 input-file-field-label ${labelClassName}`,
          children: [
            required &&
              _jsx("span", {
                className: "red",
                children: "* Campo Obrigat\u00F3rio",
              }),
            required && helpText && ": ",
            helpText,
          ],
        }),
    ],
  });
};
export default InputFileField;
