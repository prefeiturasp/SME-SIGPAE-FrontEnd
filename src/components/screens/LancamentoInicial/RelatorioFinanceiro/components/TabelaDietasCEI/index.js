import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { formataValorDecimal } from "../../../../helper.jsx";
export function TabelaDietasCEI({ tabelas, tipoDieta }) {
  const grupoDieta = tipoDieta.includes("Tipo A") ? "GRUPO A" : "GRUPO B";
  return _jsxs("table", {
    className: "mt-4",
    children: [
      _jsx("thead", {
        children: _jsxs("tr", {
          className: "row",
          children: [
            _jsxs("th", {
              className: "col-6 text-center",
              children: ["TIPO DE ATENDIMENTO - DIETA ESPECIAL ", grupoDieta],
            }),
            _jsx("th", {
              className: "col-2 text-center",
              children: "VALOR UNIT\u00C1RIO",
            }),
            _jsx("th", {
              className: "col-2 text-center",
              children: "% de ACR\u00C9SCIMO",
            }),
            _jsx("th", {
              className: "col-2 text-center",
              children: "VALOR UNIT\u00C1RIO COM ACR\u00C9SCIMO",
            }),
          ],
        }),
      }),
      _jsx("tbody", {
        children: tabelas
          .filter((tabela) => tabela.nome.includes(tipoDieta))
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
                      children: `${formataValorDecimal(
                        valor.valor_colunas.percentual_acrescimo
                      )} %`,
                    }),
                    _jsx("td", {
                      className: "col-2 text-center",
                      children: `R$ ${formataValorDecimal(
                        valor.valor_colunas.valor_unitario_total
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
