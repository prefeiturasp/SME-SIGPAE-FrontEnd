import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
const ArquivosTipoRecebimento = ({ lista, textoBotoes }) => {
  return _jsx(_Fragment, {
    children: lista?.arquivos?.map((arquivo, index) => {
      return _jsx(
        "div",
        {
          className: "row mt-2",
          children: _jsx("div", {
            className: "col-4",
            children: _jsx(BotaoAnexo, {
              urlAnexo: arquivo.arquivo,
              textoBotao: textoBotoes,
            }),
          }),
        },
        index
      );
    }),
  });
};
export default ArquivosTipoRecebimento;
