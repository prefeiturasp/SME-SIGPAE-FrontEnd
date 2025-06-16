import { corrigeLinkAnexo } from "../../utilities";

//TODO: fazer iterando valores
describe("Teste corrigeLinkAnexo", () => {
  const urlHttp = "http://example.com";
  const urlHttps = "https://example.com";
  it("retorna a própria URL se window.location.href começar com http://", () => {
    expect(corrigeLinkAnexo(urlHttp)).toBe(urlHttp);
  });

  it("retorna a URL com HTTPS se window.location.href começar com https://", () => {
    // eslint-disable-next-line no-undef
    global.window = Object.create(window);
    const url = "https://localhost";
    Object.defineProperty(window, "location", {
      value: {
        href: url,
      },
      writable: true,
    });
    expect(corrigeLinkAnexo(urlHttp)).toBe(urlHttps);
  });
});
