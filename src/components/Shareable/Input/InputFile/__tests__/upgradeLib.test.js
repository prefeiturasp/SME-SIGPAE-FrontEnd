import { readerFile, downloadAndConvertToBase64, openFile } from "../helper";
import axios from "src/services/_base";

jest.mock("src/services/_base", () => ({
  get: jest.fn(),
}));

describe("helper.jsx", () => {
  it("deve ler um arquivo e retornar base64", async () => {
    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const result = await readerFile(file);

    expect(result).toHaveProperty("arquivo");
    expect(result).toHaveProperty("nome", "test.txt");
    expect(result.arquivo).toContain("data:text/plain;base64,");
  });

  it("deve fazer download e converter para base64", async () => {
    const mockData = new ArrayBuffer(8);
    axios.get.mockResolvedValue({
      status: 200,
      data: mockData,
      headers: { "content-type": "text/plain" },
    });

    const base64 = await downloadAndConvertToBase64(
      "http://example.com/file.txt",
    );
    expect(base64).toContain("data:text/plain;base64,");
  });

  it("deve lançar erro ao falhar no download", async () => {
    axios.get.mockResolvedValue({
      status: 404,
    });

    await expect(
      downloadAndConvertToBase64("http://example.com/file.txt"),
    ).rejects.toThrow("Falha ao baixar arquivo.");
  });
});

describe("openFile", () => {
  const blobUrl = "blob:http://localhost/fake-blob";
  let openSpy;
  let createObjectURLSpy;
  let revokeObjectURLSpy;

  beforeEach(() => {
    openSpy = jest.spyOn(window, "open").mockImplementation(() => ({}));
    createObjectURLSpy = jest.fn().mockReturnValue(blobUrl);
    revokeObjectURLSpy = jest.fn();
    URL.createObjectURL = createObjectURLSpy;
    URL.revokeObjectURL = revokeObjectURLSpy;
  });

  afterEach(() => {
    openSpy.mockRestore();
    delete URL.createObjectURL;
    delete URL.revokeObjectURL;
    jest.useRealTimers();
  });

  it("abre URL http em nova aba sem janela vazia", () => {
    openFile({
      nome: "layout.pdf",
      arquivo:
        "http://sigpae.sme.prefeitura.sp.gov.br/media/layouts_de_embalagens/arquivo.pdf",
    });

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith(
      "http://sigpae.sme.prefeitura.sp.gov.br/media/layouts_de_embalagens/arquivo.pdf",
      "_blank",
      "noopener,noreferrer",
    );
    expect(openSpy).not.toHaveBeenCalledWith("");
  });

  it("abre data URL via blob em vez de iframe", () => {
    jest.useFakeTimers();

    openFile({
      nome: "layout.pdf",
      base64: "data:application/pdf;base64,JVBERi0x",
    });

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(
      blobUrl,
      "_blank",
      "noopener,noreferrer",
    );
    expect(openSpy).not.toHaveBeenCalledWith("");

    jest.advanceTimersByTime(60_000);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(blobUrl);
  });

  it("nao abre janela quando nao ha arquivo", () => {
    openFile({ nome: "layout.pdf" });
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("faz download de arquivo doc", () => {
    const clickSpy = jest.fn();
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = jest
      .spyOn(document, "createElement")
      .mockImplementation((tag) => {
        if (tag === "a") {
          return { click: clickSpy, href: "", download: "" };
        }
        return originalCreateElement(tag);
      });

    openFile({
      nome: "documento.docx",
      base64: "data:application/msword;base64,AAA",
    });

    expect(clickSpy).toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
    createElementSpy.mockRestore();
  });
});
