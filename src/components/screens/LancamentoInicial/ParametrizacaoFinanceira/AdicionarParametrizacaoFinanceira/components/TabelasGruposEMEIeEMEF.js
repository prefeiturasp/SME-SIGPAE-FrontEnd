import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import TabelaAlimentacao from "./TabelaAlimentacao";
import TabelaDietaTipoA from "./TabelaDietaTipoA";
import TabelaDietaTipoB from "./TabelaDietaTipoB";
export default ({ form, tiposAlimentacao, grupoSelecionado }) => {
  return _jsxs(
    "div",
    {
      children: [
        _jsx(TabelaAlimentacao, {
          tiposAlimentacao: tiposAlimentacao,
          grupoSelecionado: grupoSelecionado,
        }),
        _jsxs("div", {
          className: "d-flex gap-4",
          children: [
            _jsx(TabelaDietaTipoA, {
              form: form,
              tiposAlimentacao: tiposAlimentacao,
              nomeTabela: "Dietas Tipo A e Tipo A Enteral",
            }),
            _jsx(TabelaDietaTipoB, {
              form: form,
              tiposAlimentacao: tiposAlimentacao,
            }),
          ],
        }),
      ],
    },
    grupoSelecionado
  );
};
