import axios from "../_base";
import {
  solicitarDownloadImagensHistoricoReclamacaoProduto,
  solicitarDownloadPdfHistoricoReclamacaoProduto,
} from "../historicoReclamacaoProduto.service";

jest.mock("../_base", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("historicoReclamacaoProduto.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("solicita o download do PDF da ação selecionada", async () => {
    jest.mocked(axios.post).mockResolvedValue({ status: 202 });

    await solicitarDownloadPdfHistoricoReclamacaoProduto(
      "uuid-reclamacao",
      "uuid-log",
    );

    expect(axios.post).toHaveBeenCalledWith(
      "/reclamacoes-produtos/uuid-reclamacao/historico/uuid-log/download-pdf/",
    );
  });

  it("solicita o download das imagens da ação selecionada", async () => {
    jest.mocked(axios.post).mockResolvedValue({ status: 202 });

    await solicitarDownloadImagensHistoricoReclamacaoProduto(
      "uuid-reclamacao",
      "uuid-log",
    );

    expect(axios.post).toHaveBeenCalledWith(
      "/reclamacoes-produtos/uuid-reclamacao/historico/uuid-log/download-imagens/",
    );
  });
});
