import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ModalConflito from "../../components/ModalConflito";

describe("Testes comportamento ModalConflito - Parametrização Financeira", () => {
  const mockSetConflito = jest.fn();
  const mockOnContinuar = jest.fn();

  const setup = async ({ conflito = true } = {}) => {
    await act(async () => {
      render(
        <ModalConflito
          conflito={conflito}
          setConflito={mockSetConflito}
          onContinuar={mockOnContinuar}
        />,
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar título, mensagem e opções quando conflito = true", async () => {
    await setup({ conflito: true });

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
    await setup({ conflito: true });

    const opcaoManter = screen.getByText(
      "Manter parametrização anterior vigente.",
    );

    fireEvent.click(opcaoManter);

    expect(
      screen.getByRole("radio", {
        name: /Manter parametrização anterior vigente/i,
      }),
    ).toBeChecked();
  });

  it('deve chamar onContinuar com a opção selecionada ao clicar em "Continuar"', async () => {
    await setup({ conflito: true });

    fireEvent.click(
      screen.getByText(
        "Encerrar parametrização anterior e copiar valores para a nova.",
      ),
    );

    fireEvent.click(screen.getByText("Continuar"));

    expect(mockOnContinuar).toHaveBeenCalledWith("encerrar_copiar");
    expect(mockSetConflito).toHaveBeenCalledWith(false);
  });

  it("deve desabilitar o botão continuar se nenhuma opção for selecionada", async () => {
    await setup({ conflito: true });

    const botao = screen.getByText("Continuar").closest("button");

    expect(botao).toBeDisabled();

    fireEvent.click(botao);

    expect(mockOnContinuar).not.toHaveBeenCalled();
  });

  it("não deve renderizar conteúdo quando conflito = false", async () => {
    await setup({ conflito: false });

    expect(
      screen.queryByText("Conflito no período de Vigência"),
    ).not.toBeInTheDocument();
  });
});
