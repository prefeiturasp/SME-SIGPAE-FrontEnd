import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ModalConflito from "../../components/ModalConflito";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [new URLSearchParams()],
}));

describe("Testes comportamento ModalConflito - Parametrização Financeira", () => {
  const mockSetConflito = jest.fn();
  const mockOnContinuar = jest.fn();
  const uuid = "123e4567-e89b-12d3-a456-426614174000";

  const setup = async ({ conflito = uuid } = {}) => {
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

  it("deve renderizar título, mensagem e opções quando conflito existir", async () => {
    await setup({ conflito: uuid });

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
    await setup({ conflito: uuid });

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
    await setup({ conflito: uuid });

    fireEvent.click(
      screen.getByText(
        "Encerrar parametrização anterior e copiar valores para a nova.",
      ),
    );

    fireEvent.click(screen.getByText("Continuar"));

    expect(mockOnContinuar).toHaveBeenCalledWith("encerrar_copiar");
    expect(mockSetConflito).toHaveBeenCalledWith(null);
  });

  it("deve desabilitar o botão continuar se nenhuma opção for selecionada", async () => {
    await setup({ conflito: uuid });

    const botao = screen.getByText("Continuar").closest("button");

    expect(botao).toBeDisabled();

    fireEvent.click(botao);

    expect(mockOnContinuar).not.toHaveBeenCalled();
  });
});
