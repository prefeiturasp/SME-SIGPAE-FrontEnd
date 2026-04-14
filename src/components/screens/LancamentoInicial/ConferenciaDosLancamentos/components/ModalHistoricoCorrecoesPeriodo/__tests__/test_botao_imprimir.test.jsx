import React from "react";
import { act } from "@testing-library/react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalHistoricoCorrecoesPeriodo } from "src/components/screens/LancamentoInicial/ConferenciaDosLancamentos/components/ModalHistoricoCorrecoesPeriodo/index.jsx";
import * as service from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service.jsx";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";

jest.mock("src/services/medicaoInicial/solicitacaoMedicaoInicial.service.jsx");
jest.mock("src/components/Shareable/Toast/dialogs");
jest.mock("src/components/Shareable/ModalSolicitacaoDownload", () => () => (
  <div data-testid="modal-download">Modal Download Ativo</div>
));

describe("ModalHistoricoCorrecoesPeriodo - Botão Imprimir", () => {
  const mockSolicitacao = { uuid: "123-abc" };
  const mockHistoricos = [
    {
      acao: "MEDICAO_APROVADA_PELA_DRE",
      usuario: { nome: "Admin", email: "admin@teste.com" },
      criado_em: "2023-10-10 10:00:00",
    },
  ];

  const defaultProps = {
    showModal: true,
    setShowModal: jest.fn(),
    solicitacao: mockSolicitacao,
    historicos: mockHistoricos,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar o serviço de exportação com o UUID correto ao clicar em Imprimir", async () => {
    service.gerarRelatorioHistorioCorrecoes.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    render(<ModalHistoricoCorrecoesPeriodo {...defaultProps} />);

    const botaoImprimir = screen.getByText("Imprimir");
    fireEvent.click(botaoImprimir);

    expect(service.gerarRelatorioHistorioCorrecoes).toHaveBeenCalledWith(
      "123-abc",
    );
  });

  it("deve desabilitar o botão e mudar o estilo enquanto estiver processando o PDF", async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    service.gerarRelatorioHistorioCorrecoes.mockReturnValue(promise);

    render(<ModalHistoricoCorrecoesPeriodo {...defaultProps} />);

    const botaoImprimir = screen.getByRole("button", { name: /imprimir/i });

    fireEvent.click(botaoImprimir);

    expect(botaoImprimir).toBeDisabled();

    await act(async () => {
      resolvePromise({ status: HTTP_STATUS.OK });
    });

    await waitFor(() => {
      expect(botaoImprimir).not.toBeDisabled();
    });
  });

  it("deve exibir o ModalSolicitacaoDownload quando o status da resposta for OK", async () => {
    service.gerarRelatorioHistorioCorrecoes.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    render(<ModalHistoricoCorrecoesPeriodo {...defaultProps} />);

    fireEvent.click(screen.getByText("Imprimir"));

    const modalDownload = await screen.findByTestId("modal-download");
    expect(modalDownload).toBeInTheDocument();
  });

  it("deve exibir toast de erro quando a API falhar", async () => {
    service.gerarRelatorioHistorioCorrecoes.mockResolvedValue({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });

    render(<ModalHistoricoCorrecoesPeriodo {...defaultProps} />);

    fireEvent.click(screen.getByText("Imprimir"));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao baixar PDF. Tente novamente mais tarde",
      );
    });

    expect(screen.queryByTestId("modal-download")).not.toBeInTheDocument();
  });
});
