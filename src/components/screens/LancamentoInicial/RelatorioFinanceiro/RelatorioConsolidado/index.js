import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { Form } from "react-final-form";
import { Spin } from "antd";
import { FormFields } from "../components/FormFields";
import { TabelaAlimentacaoCEI } from "../components/TabelaAlimentacaoCEI";
import { TabelaDietasCEI } from "../components/TabelaDietasCEI";
import useView from "../view";
import "./styles.scss";
export function RelatorioConsolidado() {
  const view = useView({});
  const exibeTabelasCEI = view.relatorioConsolidado?.tipos_unidades.find(
    (tipoUnidade) => ["CEI", "CEI CEU", "CCI"].includes(tipoUnidade.iniciais)
  );
  return _jsx("div", {
    className: "relatorio-consolidado",
    children: _jsx(Spin, {
      tip: "Carregando...",
      spinning: view.carregando,
      children: _jsx("div", {
        className: "card mt-3",
        children: _jsxs("div", {
          className: "card-body",
          children: [
            _jsx(Form, {
              onSubmit: () => {},
              initialValues: view.valoresIniciais,
              children: () =>
                _jsx("form", {
                  children: _jsx(FormFields, {
                    lotes: view.lotes,
                    gruposUnidadeEscolar: view.gruposUnidadeEscolar,
                    mesesAnos: view.mesesAnos,
                  }),
                }),
            }),
            !view.carregando && view.relatorioConsolidado
              ? _jsx("div", {
                  className: "tabelas-relatorio-consolidado mt-5 mb-4",
                  children: exibeTabelasCEI
                    ? _jsxs(_Fragment, {
                        children: [
                          _jsx(TabelaAlimentacaoCEI, {
                            tabelas: view.relatorioConsolidado.tabelas,
                          }),
                          _jsx(TabelaDietasCEI, {
                            tabelas: view.relatorioConsolidado.tabelas,
                            tipoDieta: "Dietas Tipo A e Tipo A Enteral",
                          }),
                          _jsx(TabelaDietasCEI, {
                            tabelas: view.relatorioConsolidado.tabelas,
                            tipoDieta: "Dietas Tipo B",
                          }),
                        ],
                      })
                    : null,
                })
              : null,
          ],
        }),
      }),
    }),
  });
}
