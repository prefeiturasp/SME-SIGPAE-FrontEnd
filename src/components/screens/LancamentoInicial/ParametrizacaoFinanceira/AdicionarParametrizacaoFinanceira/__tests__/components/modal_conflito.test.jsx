import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockGetDadosParametrizacaoFinanceira } from "src/mocks/services/parametrizacao_financeira.service/mockGetDadosParametrizacaoFinanceira";
import { mockParametrizacoesFinanceiras } from "src/mocks/services/parametrizacao_financeira.service/mockGetParametrizacoesFinanceiras";
import ModalConflito from "../../components/ModalConflito";

describe("Testes comportamento ModalConflito - Parametrização Financeira", () => {
  const mockSetConflito = jest.fn();
  const mockOnContinuar = jest.fn();
  const uuid = mockGetDadosParametrizacaoFinanceira.uuid;

  const setup = async ({ conflito, rota = "/" } = {}) => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={[rota]}>
          <ModalConflito
            conflito={conflito}
            setConflito={mockSetConflito}
            onContinuar={mockOnContinuar}
          />
        </MemoryRouter>,
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

  it("oculta a opção de novos valores quando a tela veio de uma cópia", async () => {
    await setup({
      conflito: uuid,
      rota: `/?uuid_origem=${mockParametrizacoesFinanceiras.results[1].uuid}`,
    });

    expect(
      screen.queryByText(
        "Encerrar parametrização anterior e cadastrar novos valores.",
      ),
    ).not.toBeInTheDocument();
  });

  it("fecha o modal e segue sem callback quando onContinuar não é informado", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ModalConflito conflito={uuid} setConflito={mockSetConflito} />
        </MemoryRouter>,
      );
    });

    fireEvent.click(
      screen.getByText("Manter parametrização anterior vigente."),
    );
    fireEvent.click(screen.getByText("Continuar"));
    expect(mockSetConflito).toHaveBeenCalledWith(null);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(mockSetConflito).toHaveBeenCalledWith(null);
  });

  it("não deve renderizar conteúdo quando não houver conflito", async () => {
    await setup();

    expect(
      screen.queryByText("Conflito no período de Vigência"),
    ).not.toBeInTheDocument();
  });
});
