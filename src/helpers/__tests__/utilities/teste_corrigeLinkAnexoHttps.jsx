/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://localhost"}
 */
import { corrigeLinkAnexo } from "../../utilities";

describe("Teste corrigeLinkAnexo - HTTPS", () => {
  it("retorna a URL com HTTPS se window.location.href começar com https://", () => {
    expect(corrigeLinkAnexo("http://example.com")).toBe("https://example.com");
  });
});
