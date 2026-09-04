import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  solicitarDownloadImagensHistoricoReclamacaoProduto,
  solicitarDownloadPdfHistoricoReclamacaoProduto,
} from "src/services/historicoReclamacaoProduto.service";

import AcoesDownloadHistoricoReclamacao from "../index";

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, disabled, dataTestId }: any) => (
    <button data-testid={dataTestId} disabled={disabled} onClick={onClick}>
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/ModalSolicitacaoDownload", () => ({
  __esModule: true,
  default: () => <div data-testid="modal-central-downloads" />,
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

jest.mock("src/services/historicoReclamacaoProduto.service", () => ({
  solicitarDownloadImagensHistoricoReclamacaoProduto: jest.fn(),
  solicitarDownloadPdfHistoricoReclamacaoProduto: jest.fn(),
}));

const uuidReclamacao = "598f4d19-5bc7-48b4-9c7a-543f87f49d96";
const uuidLog = "2b166c5d-86a9-45a0-853f-283909fae165";

const renderizarComArquivos = (possuiPdf: boolean, quantidadeImagens: number) =>
  render(
    <AcoesDownloadHistoricoReclamacao
      uuidReclamacao={uuidReclamacao}
      logSelecionado={{
        uuid: uuidLog,
        arquivos_disponiveis: {
          possui_pdf: possuiPdf,
          quantidade_imagens: quantidadeImagens,
        },
      }}
    />,
  );

describe("AcoesDownloadHistoricoReclamacao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não renderiza ações quando não existem arquivos disponíveis", () => {
    const { container } = renderizarComArquivos(false, 0);

    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza somente o botão de PDF quando existe apenas documento", () => {
    renderizarComArquivos(true, 0);

    expect(
      screen.getByTestId("download-pdf-historico-reclamacao"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("download-imagens-historico-reclamacao"),
    ).not.toBeInTheDocument();
  });

  it("renderiza somente o botão de imagens quando existem apenas imagens", () => {
    renderizarComArquivos(false, 1);

    expect(
      screen.queryByTestId("download-pdf-historico-reclamacao"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("download-imagens-historico-reclamacao"),
    ).toBeInTheDocument();
  });

  it("renderiza os dois botões quando existem PDF e imagens", () => {
    renderizarComArquivos(true, 1);

    expect(
      screen.getByTestId("download-pdf-historico-reclamacao"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("download-imagens-historico-reclamacao"),
    ).toBeInTheDocument();
  });

  it("solicita o PDF da ação e abre a Central de Downloads", async () => {
    jest
      .mocked(solicitarDownloadPdfHistoricoReclamacaoProduto)
      .mockResolvedValue({ status: 202 } as never);
    renderizarComArquivos(true, 0);

    fireEvent.click(screen.getByTestId("download-pdf-historico-reclamacao"));

    await waitFor(() => {
      expect(
        solicitarDownloadPdfHistoricoReclamacaoProduto,
      ).toHaveBeenCalledWith(uuidReclamacao, uuidLog);
    });
    expect(
      await screen.findByTestId("modal-central-downloads"),
    ).toBeInTheDocument();
  });

  it("solicita as imagens da ação e abre a Central de Downloads", async () => {
    jest
      .mocked(solicitarDownloadImagensHistoricoReclamacaoProduto)
      .mockResolvedValue({ status: 202 } as never);
    renderizarComArquivos(false, 1);

    fireEvent.click(
      screen.getByTestId("download-imagens-historico-reclamacao"),
    );

    await waitFor(() => {
      expect(
        solicitarDownloadImagensHistoricoReclamacaoProduto,
      ).toHaveBeenCalledWith(uuidReclamacao, uuidLog);
    });
    expect(
      await screen.findByTestId("modal-central-downloads"),
    ).toBeInTheDocument();
  });

  it("exibe erro quando a solicitação de PDF falha", async () => {
    jest
      .mocked(solicitarDownloadPdfHistoricoReclamacaoProduto)
      .mockRejectedValue(new Error("Falha na API"));
    renderizarComArquivos(true, 0);

    fireEvent.click(screen.getByTestId("download-pdf-historico-reclamacao"));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao solicitar o download do PDF.",
      );
    });
    expect(
      screen.queryByTestId("modal-central-downloads"),
    ).not.toBeInTheDocument();
  });
});
