import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ModalConflito from "../../components/ModalConflito";

describe("Testes comportamento ModalConflito - Parametrização Financeira", () => {
  const mockSetShowModal = jest.fn();
  const mockOnContinuar = jest.fn();

  const setup = async ({ showModal = true } = {}) => {
    await act(async () => {
      render(
        <ModalConflito
          showModal={showModal}
          setShowModal={mockSetShowModal}
          onContinuar={mockOnContinuar}
        />,
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar título, mensagem e opções quando showModal = true", async () => {
    await setup({ showModal: true });

    expect(
      screen.getByText("Conflito no período de Vigência"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Já existe uma parametrização vigente para este/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Manter parametrização anterior vigente."),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Encerrar parametrização anterior e copiar valores para a nova.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Encerrar parametrização anterior e cadastrar novos valores.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Continuar")).toBeInTheDocument();
  });

  it("deve alterar a opção selecionada ao clicar em um radio", async () => {
    await setup({ showModal: true });

    const opcaoManter = screen.getByText(
      "Manter parametrização anterior vigente.",
    );

    fireEvent.click(opcaoManter);

    expect(
      screen.getByRole("radio", { name: /Manter parametrização anterior/i }),
    ).toBeChecked();
  });

  it('deve chamar onContinuar com a opção selecionada ao clicar em "Continuar"', async () => {
    await setup({ showModal: true });

    fireEvent.click(
      screen.getByText(
        "Encerrar parametrização anterior e copiar valores para a nova.",
      ),
    );

    fireEvent.click(screen.getByText("Continuar"));

    expect(mockOnContinuar).toHaveBeenCalledWith("encerrar_copiar");
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
  });

  it("deve proibir clicar no botão continuar se nenhuma for selecionada", async () => {
    await setup({ showModal: true });

    const botao = screen.getByText("Continuar").closest("button");
    expect(botao).toBeDisabled();
    fireEvent.click(botao);

    expect(mockOnContinuar).not.toHaveBeenCalled();
  });

  it("não deve renderizar conteúdo quando showModal = false", async () => {
    await setup({ showModal: false });

    expect(
      screen.queryByText("Conflito no período de Vigência"),
    ).not.toBeInTheDocument();
  });
});
