import { formataPeriodos } from "../../../SolicitacoesSimilaresInclusao/CEI/helper";

describe("formataPeriodos", () => {
  it("formata os períodos com as cores corretas", () => {
    const resultado = formataPeriodos([
      "MANHA",
      "TARDE",
      "NOITE",
      "INTEGRAL",
      "OUTRO",
    ]);

    expect(resultado).toEqual([
      {
        nome: "MANHA",
        background: "#fff7cb",
        borderColor: "#ffd79b",
      },
      {
        nome: "TARDE",
        background: "#ffeed6",
        borderColor: "#ffbb8a",
      },
      {
        nome: "NOITE",
        background: "#e4f1ff",
        borderColor: "#82b7e8",
      },
      {
        nome: "INTEGRAL",
        background: "#ebedff",
        borderColor: "#b2baff",
      },
      {
        nome: "OUTRO",
        background: "#eaffe3",
        borderColor: "#79cf91",
      },
    ]);
  });
});
