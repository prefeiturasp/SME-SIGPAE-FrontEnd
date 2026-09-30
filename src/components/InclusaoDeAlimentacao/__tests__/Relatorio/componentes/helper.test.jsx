import {
  formataMotivosDias,
  formataMotivosDiasComOutros,
  formataPeriodos,
} from "src/components/InclusaoDeAlimentacao/Relatorio/componentes/helper";

describe("formataMotivosDias", () => {
  it("agrupa os dias por motivo e exclui Outro e Evento Específico", () => {
    const inclusoes = [
      { motivo: { nome: "Reposição de aula" }, data: "02/04/2025" },
      { motivo: { nome: "Reposição de aula" }, data: "03/04/2025" },
      { motivo: { nome: "Dia da família" }, data: "04/04/2025" },
      { motivo: { nome: "Outro" }, data: "05/04/2025" },
      { motivo: { nome: "Evento Específico" }, data: "06/04/2025" },
    ];

    const resultado = formataMotivosDias(inclusoes);

    expect(resultado).toEqual({
      "Reposição de aula": ["02/04/2025", "03/04/2025"],
      "Dia da família": ["04/04/2025"],
    });
  });
});

describe("formataMotivosDiasComOutros", () => {
  it("agrupa os dias por motivo incluindo Outro e Evento Específico", () => {
    const inclusoes = [
      { motivo: { nome: "Outro" }, data: "05/04/2025" },
      { motivo: { nome: "Evento Específico" }, data: "06/04/2025" },
      { motivo: { nome: "Outro" }, data: "07/04/2025" },
    ];

    const resultado = formataMotivosDiasComOutros(inclusoes);

    expect(resultado).toEqual({
      Outro: ["05/04/2025", "07/04/2025"],
      "Evento Específico": ["06/04/2025"],
    });
  });
});

describe("formataPeriodos", () => {
  it("aplica os estilos de cada período", () => {
    const resultado = formataPeriodos([
      "MANHA",
      "TARDE",
      "NOITE",
      "INTEGRAL",
      "OUTRO",
    ]);

    expect(resultado).toEqual([
      { nome: "MANHA", background: "#fff7cb", borderColor: "#ffd79b" },
      { nome: "TARDE", background: "#ffeed6", borderColor: "#ffbb8a" },
      { nome: "NOITE", background: "#e4f1ff", borderColor: "#82b7e8" },
      { nome: "INTEGRAL", background: "#ebedff", borderColor: "#b2baff" },
      { nome: "OUTRO", background: "#eaffe3", borderColor: "#79cf91" },
    ]);
  });
});
