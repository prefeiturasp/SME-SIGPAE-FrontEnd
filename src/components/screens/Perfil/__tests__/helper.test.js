import { formatarTipoPerfil } from "../helper";

describe("Testes helper.jsx - formatarTipoPerfil", () => {
  it("deve substituir underscores por espaços", () => {
    expect(formatarTipoPerfil("USUARIO_CODAE")).toBe("USUARIO CODAE");
    expect(formatarTipoPerfil("GESTOR_ESCOLAR")).toBe("GESTOR ESCOLAR");
  });
});
