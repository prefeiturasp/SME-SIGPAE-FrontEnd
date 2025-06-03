import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";
import TabelaDietasCEI from "./TabelaDietasCEI";
export default ({ form, faixasEtarias, grupoSelecionado }) => {
  return _jsxs("div", {
    className: "container-tabelas",
    children: [
      _jsx(TabelaAlimentacaoCEI, {
        faixasEtarias: faixasEtarias,
        grupoSelecionado: grupoSelecionado,
        periodo: "Integral",
      }),
      _jsx(TabelaAlimentacaoCEI, {
        faixasEtarias: faixasEtarias,
        grupoSelecionado: grupoSelecionado,
        periodo: "Parcial",
      }),
      _jsx(TabelaDietasCEI, {
        form: form,
        faixasEtarias: faixasEtarias,
        grupoSelecionado: grupoSelecionado,
        nomeTabela: "Dietas Tipo A e Tipo A Enteral",
        periodo: "Integral",
      }),
      _jsx(TabelaDietasCEI, {
        form: form,
        faixasEtarias: faixasEtarias,
        grupoSelecionado: grupoSelecionado,
        nomeTabela: "Dietas Tipo B",
        periodo: "Integral",
      }),
      _jsx(TabelaDietasCEI, {
        form: form,
        faixasEtarias: faixasEtarias,
        grupoSelecionado: grupoSelecionado,
        nomeTabela: "Dietas Tipo A e Tipo A Enteral",
        periodo: "Parcial",
      }),
      _jsx(TabelaDietasCEI, {
        form: form,
        faixasEtarias: faixasEtarias,
        grupoSelecionado: grupoSelecionado,
        nomeTabela: "Dietas Tipo B",
        periodo: "Parcial",
      }),
    ],
  });
};
