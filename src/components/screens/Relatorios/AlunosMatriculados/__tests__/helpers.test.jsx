import { formataPeriodoEscolar } from "src/components/screens/Relatorios/AlunosMatriculados/helpers.jsx";

describe("formataPeriodoEscolar", () => {
  test("retorna o nome do período sem mudança quando escola NÃO é CEI", () => {
    const resultado = formataPeriodoEscolar({ nome: "EMEF PERICLES" }, "MANHA");
    expect(resultado).toBe("MANHA");
  });

  test("formata MANHA para 'Infantil Manhã' quando é CEI", () => {
    const resultado = formataPeriodoEscolar({ nome: "CEI MENINOS" }, "MANHA");
    expect(resultado).toBe("Infantil Manhã");
  });

  test("formata TARDE para 'Infantil Tarde' quando é CEI", () => {
    const resultado = formataPeriodoEscolar({ nome: "CCI MONUMENTO" }, "TARDE");
    expect(resultado).toBe("Infantil Tarde");
  });

  test("retorna o nome original quando CEI mas período não está mapeado", () => {
    const resultado = formataPeriodoEscolar({ nome: "CEI MENINOS" }, "NOITE");
    expect(resultado).toBe("NOITE");
  });
});
