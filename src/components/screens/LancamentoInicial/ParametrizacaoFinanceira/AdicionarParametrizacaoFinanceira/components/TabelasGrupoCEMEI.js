import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TabelaAlimentacaoCEI } from "./TabelaAlimentacaoCEI";
import TabelaAlimentacao from "./TabelaAlimentacao";
import TabelaDietaTipoA from "./TabelaDietaTipoA";
import TabelaDietaTipoB from "./TabelaDietaTipoB";
import TabelaDietasCEI from "./TabelaDietasCEI";
export default ({
  form,
  faixasEtarias,
  tiposAlimentacao,
  grupoSelecionado,
}) => {
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
      _jsx(TabelaAlimentacao, {
        tiposAlimentacao: tiposAlimentacao,
        grupoSelecionado: grupoSelecionado,
        tipoTurma: "EMEI",
      }),
      _jsxs("div", {
        className: "d-flex flex-column gap-4",
        children: [
          _jsx(TabelaDietaTipoA, {
            form: form,
            tiposAlimentacao: tiposAlimentacao,
            grupoSelecionado: grupoSelecionado,
            nomeTabela: "Dietas Tipo A",
            tipoTurma: "EMEI",
          }),
          _jsx(TabelaDietaTipoA, {
            form: form,
            tiposAlimentacao: tiposAlimentacao,
            grupoSelecionado: grupoSelecionado,
            nomeTabela: "Dietas Tipo A Enteral",
            tipoTurma: "EMEI",
          }),
          _jsx(TabelaDietaTipoB, {
            form: form,
            tiposAlimentacao: tiposAlimentacao,
            grupoSelecionado: grupoSelecionado,
            tipoTurma: "EMEI",
          }),
        ],
      }),
      _jsx(TabelaDietasCEI, {
        form: form,
        faixasEtarias: faixasEtarias,
        nomeTabela: "Dietas Tipo A e Tipo A Enteral",
        periodo: "Integral",
        grupoSelecionado: grupoSelecionado,
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
