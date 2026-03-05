import { corrigeLinkAnexo } from "../../utilities";

//TODO: fazer iterando valores
describe("Teste corrigeLinkAnexo", () => {
  const urlHttp = "http://example.com";
  it("retorna a própria URL se window.location.href começar com http://", () => {
    expect(corrigeLinkAnexo(urlHttp)).toBe(urlHttp);
  });
});
