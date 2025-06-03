import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formataValorDecimal } from "../../../../helper.jsx";
export function TabelaAlimentacaoCEI({ tabelas }) {
  return _jsxs("table", {
    children: [
      _jsx("thead", {
        children: _jsxs("tr", {
          className: "row",
          children: [
            _jsx("th", {
              className: "col-6 text-center",
              children: "TIPO DE ATENDIMENTO - SEM DIETA",
            }),
            _jsx("th", {
              className: "col-2 text-center",
              children: "VALOR UNIT\u00C1RIO",
            }),
            _jsx("th", {
              className: "col-2 text-center",
              children: "VALOR UNIT\u00C1RIO REAJUSTE",
            }),
            _jsx("th", {
              className: "col-2 text-center",
              children: "VALOR UNIT\u00C1RIO TOTAL",
            }),
          ],
        }),
      }),
      _jsx("tbody", {
        children: tabelas
          .filter((tabela) => tabela.nome.includes("Preço das Alimentações"))
          .map((tabela) => {
            const periodo = tabela.nome.split("Período ")[1];
            return tabela.valores.map((valor) =>
              _jsxs(
                "tr",
                {
                  className: "row",
                  children: [
                    _jsx("td", {
                      className: "col-6 text-center",
                      children: `${periodo} ${valor.faixa_etaria.__str__}`,
                    }),
                    _jsx("td", {
                      className: "col-2 text-center",
                      children: `R$ ${formataValorDecimal(
                        valor.valor_colunas.valor_unitario
                      )}`,
                    }),
                    _jsx("td", {
                      className: "col-2 text-center",
                      children: `R$ ${formataValorDecimal(
                        valor.valor_colunas.valor_unitario_reajuste
                      )}`,
                    }),
                    _jsx("td", {
                      className: "col-2 text-center",
                      children: `R$ ${formataValorDecimal(
                        valor.valor_colunas.valor_unitario +
                          valor.valor_colunas.valor_unitario_reajuste
                      )}`,
                    }),
                  ],
                },
                `${valor.faixa_etaria.__str__}_${periodo}`
              )
            );
          }),
      }),
    ],
  });
}
