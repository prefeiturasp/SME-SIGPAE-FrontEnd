import { readerFile, downloadAndConvertToBase64 } from "../helper";
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
      "http://example.com/file.txt"
    );
    expect(base64).toContain("data:text/plain;base64,");
  });

  it("deve lançar erro ao falhar no download", async () => {
    axios.get.mockResolvedValue({
      status: 404,
    });

    await expect(
      downloadAndConvertToBase64("http://example.com/file.txt")
    ).rejects.toThrow("Falha ao baixar arquivo.");
  });
});
