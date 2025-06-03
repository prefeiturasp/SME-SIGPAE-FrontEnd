import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import InputText from "src/components/Shareable/Input/InputText";
import ArquivosTipoRecebimento from "../ArquivosTipoDocumento";
import { OUTROS_DOCUMENTOS_OPTIONS } from "../../constants";
import "./styles.scss";
const OutrosDocumentos = ({ documento }) => {
  const retornaTextoTipoDocumento = (tipoDocumento) => {
    return OUTROS_DOCUMENTOS_OPTIONS.find((x) => x.value === tipoDocumento)
      .label;
  };
  return _jsxs(_Fragment, {
    children: [
      _jsx("div", { className: "subtitulo", children: "Outros Documentos" }),
      _jsx("ul", {
        className: "secao-tipo-documento",
        children: documento.tipos_de_documentos?.map((tipo, index) =>
          _jsxs(
            "li",
            {
              children: [
                _jsx("div", {
                  className: "subtitulo-documento",
                  children: retornaTextoTipoDocumento(tipo.tipo_documento),
                }),
                tipo.tipo_documento === "OUTROS" &&
                  _jsx(InputText, {
                    label: "Descri\u00E7\u00E3o do documento",
                    valorInicial: tipo.descricao_documento,
                    required: true,
                    disabled: true,
                  }),
                _jsx(ArquivosTipoRecebimento, { lista: tipo }),
              ],
            },
            index
          )
        ),
      }),
    ],
  });
};
export default OutrosDocumentos;
