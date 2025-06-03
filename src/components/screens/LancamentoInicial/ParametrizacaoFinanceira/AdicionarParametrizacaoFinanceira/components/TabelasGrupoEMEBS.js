import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import TabelaAlimentacao from "./TabelaAlimentacao";
import TabelaDietaTipoA from "./TabelaDietaTipoA";
import TabelaDietaTipoB from "./TabelaDietaTipoB";
export default ({ form, tiposAlimentacao, grupoSelecionado }) => {
  return _jsxs("div", {
    className: "container-tabelas",
    children: [
      _jsx(TabelaAlimentacao, {
        grupoSelecionado: grupoSelecionado,
        tiposAlimentacao: tiposAlimentacao,
        tipoTurma: "EMEBS Fundamental",
      }),
      _jsx(TabelaAlimentacao, {
        grupoSelecionado: grupoSelecionado,
        tiposAlimentacao: tiposAlimentacao,
        tipoTurma: "EMEBS Infantil",
      }),
      _jsx(TabelaDietaTipoA, {
        form: form,
        tiposAlimentacao: tiposAlimentacao,
        grupoSelecionado: grupoSelecionado,
        nomeTabela:
          "Dietas Tipo A e Tipo A Enteral/Restri\u00E7\u00E3o de Amino\u00E1cidos",
        tipoTurma: "EMEBS Fundamental",
      }),
      _jsx(TabelaDietaTipoB, {
        form: form,
        tiposAlimentacao: tiposAlimentacao,
        grupoSelecionado: grupoSelecionado,
        tipoTurma: "EMEBS Fundamental",
      }),
      _jsx(TabelaDietaTipoA, {
        form: form,
        tiposAlimentacao: tiposAlimentacao,
        grupoSelecionado: grupoSelecionado,
        nomeTabela:
          "Dietas Tipo A e Tipo A Enteral/Restri\u00E7\u00E3o de Amino\u00E1cidos",
        tipoTurma: "EMEBS Infantil",
      }),
      _jsx(TabelaDietaTipoB, {
        form: form,
        tiposAlimentacao: tiposAlimentacao,
        grupoSelecionado: grupoSelecionado,
        tipoTurma: "EMEBS Infantil",
      }),
    ],
  });
};
