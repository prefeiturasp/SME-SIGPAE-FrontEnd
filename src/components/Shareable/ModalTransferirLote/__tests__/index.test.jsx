import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ModalTransferirLote from "../";

describe("Testes comportamento ModalTransferirLote", () => {
  const mockCloseModalNao = jest.fn();
  const mockCloseModalSim = jest.fn();

  const loteMock = {
    nome: "Lote 01",
    terceirizada: {
      nome_fantasia: "Empresa Teste",
    },
  };

  const setup = async ({ showModal }) => {
    await act(async () => {
      render(
        <ModalTransferirLote
          showModal={showModal}
          closeModalNao={mockCloseModalNao}
          closeModalSim={mockCloseModalSim}
          lote={loteMock}
        />,
      );
    });
  };

  it("deve renderizar título, mensagem e botões quando showModal = true", async () => {
    await setup({ showModal: true });

    expect(screen.getByText("Transferência de Lote")).toBeInTheDocument();

    expect(
      screen.getByText(
        /O lote Lote 01 está associado à empresa Empresa Teste/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it('deve chamar closeModalNao passando o lote ao clicar em "Não"', async () => {
    await setup({ showModal: true });

    fireEvent.click(screen.getByText("Não"));

    expect(mockCloseModalNao).toHaveBeenCalledWith(loteMock);
  });

  it('deve chamar closeModalSim ao clicar em "Sim"', async () => {
    await setup({ showModal: true });

    fireEvent.click(screen.getByText("Sim"));

    expect(mockCloseModalSim).toHaveBeenCalled();
  });

  it("não deve renderizar nada quando showModal = false", async () => {
    await setup({ showModal: false });

    expect(screen.queryByText("Transferência de Lote")).not.toBeInTheDocument();
  });
});
