import { retornaTituloCardPendencias } from "../helper";

describe("Helper.jsx - retornaTituloCardPendencias", () => {
  it("deve retornar 'Solicitações' quando o parâmetro for undefined", () => {
    expect(retornaTituloCardPendencias(undefined)).toBe("Solicitações");
  });

  it("deve retornar 'Solicitação' quando o parâmetro for 1", () => {
    expect(retornaTituloCardPendencias(1)).toBe("Solicitação");
  });

  it("deve retornar 'Solicitações' quando o parâmetro for diferente de 1", () => {
    expect(retornaTituloCardPendencias(3)).toBe("Solicitações");
    expect(retornaTituloCardPendencias(0)).toBe("Solicitações");
    expect(retornaTituloCardPendencias(10)).toBe("Solicitações");
  });
});
