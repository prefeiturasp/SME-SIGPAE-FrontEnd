import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { RecuperarSenha } from "../components/RecuperarSenha";
import mock from "src/services/_mock";

describe("Testes página de Recuperar Senha", () => {
  const mockSetComponenteRenderizado = jest.fn();
  const mockSetTexto = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    await act(async () => {
      render(
        <RecuperarSenha
          setComponenteRenderizado={mockSetComponenteRenderizado}
          setTexto={mockSetTexto}
        />
      );
    });
  });

  it("deve renderizar o formulário corretamente", () => {
    expect(screen.getByText(/Servidor Municipal/i)).toBeInTheDocument();
    expect(screen.getByText(/Fornecedor ou Distribuidor/i)).toBeInTheDocument();
    expect(screen.getByText(/Rede Parceira/i)).toBeInTheDocument();
    expect(screen.getByText("Usuário")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Continuar")).toBeInTheDocument();
  });

  it("deve chamar setTexto e setComponenteRenderizado ao clicar em Cancelar", () => {
    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockSetTexto).toHaveBeenCalledWith("");
    expect(mockSetComponenteRenderizado).toHaveBeenCalledWith("login");
  });

  it("deve exibir mensagem de sucesso quando a recuperação funcionar", async () => {
    mock
      .onGet(`/cadastro/recuperar-senha/1234567/`)
      .reply(200, { email: "teste@teste.com" });

    fireEvent.change(screen.getByTestId("recuperar-login"), {
      target: { value: "1234567" },
    });

    fireEvent.click(screen.getByText("Continuar").closest("button"));

    await waitFor(() => {
      expect(
        screen.getByText(/E-mail de recuperação enviado com sucesso/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/O link de recuperação de senha foi enviado para/i)
      ).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de erro quando o usuário não for encontrado", async () => {
    mock.onGet(`/cadastro/recuperar-senha/9999999/`).reply(400, {});

    fireEvent.change(screen.getByTestId("recuperar-login"), {
      target: { value: "9999999" },
    });

    fireEvent.click(screen.getByText("Continuar").closest("button"));

    await waitFor(() => {
      expect(screen.getByText(/Usuário não encontrado/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /Não encontramos o usuário informado. Procure o responsável pelo sistema/i
        )
      ).toBeInTheDocument();
    });
  });

  it("deve voltar ao login ao clicar em 'Voltar ao Início' nas telas de sucesso ou erro", async () => {
    mock
      .onGet(`/cadastro/recuperar-senha/1234567/`)
      .reply(200, { email: "teste@teste.com" });

    fireEvent.change(screen.getByTestId("recuperar-login"), {
      target: { value: "1234567" },
    });

    fireEvent.click(screen.getByText("Continuar").closest("button"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("Voltar ao Início"));
      expect(mockSetComponenteRenderizado).toHaveBeenCalledWith("login");
    });
  });
});
