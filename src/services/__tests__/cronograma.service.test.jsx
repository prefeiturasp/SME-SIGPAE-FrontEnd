import axios from "../_base";
import {
  abastecimentoAssinaCronograma,
  cadastraCronograma,
  codaeAssinaCronograma,
  cronogramaAssina,
  editaCronograma,
  fornecedorAssinaCronograma,
} from "../cronograma.service";

jest.mock("../_base", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("cronograma.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("envia skipAuthRefresh no cadastro e edicao quando informado", async () => {
    axios.post.mockResolvedValue({ status: 201 });
    axios.put.mockResolvedValue({ status: 200 });

    await cadastraCronograma({ password: "senha" }, { skipAuthRefresh: true });
    await editaCronograma({ password: "senha" }, "uuid-cronograma", {
      skipAuthRefresh: true,
    });

    expect(axios.post).toHaveBeenCalledWith(
      "/cronogramas/",
      { password: "senha" },
      { skipAuthRefresh: true },
    );
    expect(axios.put).toHaveBeenCalledWith(
      "/cronogramas/uuid-cronograma/",
      { password: "senha" },
      { skipAuthRefresh: true },
    );
  });

  it("nao tenta refresh automatico nas assinaturas de cronograma", async () => {
    axios.patch.mockResolvedValue({ status: 200 });

    await fornecedorAssinaCronograma("uuid-1", "senha");
    await cronogramaAssina("uuid-2", "senha");
    await abastecimentoAssinaCronograma("uuid-3", "senha");
    await codaeAssinaCronograma("uuid-4", "senha");

    expect(axios.patch).toHaveBeenNthCalledWith(
      1,
      "/cronogramas/uuid-1/fornecedor-assina-cronograma/",
      { password: "senha" },
      { skipAuthRefresh: true },
    );
    expect(axios.patch).toHaveBeenNthCalledWith(
      2,
      "/cronogramas/uuid-2/cronograma-assina/",
      { password: "senha" },
      { skipAuthRefresh: true },
    );
    expect(axios.patch).toHaveBeenNthCalledWith(
      3,
      "/cronogramas/uuid-3/abastecimento-assina/",
      { password: "senha" },
      { skipAuthRefresh: true },
    );
    expect(axios.patch).toHaveBeenNthCalledWith(
      4,
      "/cronogramas/uuid-4/codae-assina/",
      { password: "senha" },
      { skipAuthRefresh: true },
    );
  });
});
