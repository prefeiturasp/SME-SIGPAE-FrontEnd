import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import { PrimeiroAcesso } from "../components/PrimeiroAcesso";
import mock from "src/services/_mock";

describe("Testes página de Primeiro Acesso", () => {
  const mockSetComponenteRenderizado = jest.fn();
  const mockSetTexto = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    await act(async () => {
      render(
        <>
          <PrimeiroAcesso
            setComponenteRenderizado={mockSetComponenteRenderizado}
            setTexto={mockSetTexto}
          />
          <ToastContainer />
        </>
      );
    });

    localStorage.setItem("senhaAtual", "senha-antiga");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("deve renderizar o formulário corretamente", () => {
    expect(
      screen.getByText("Atualize sua senha de acesso:")
    ).toBeInTheDocument();
    expect(screen.getByText("Nova Senha")).toBeInTheDocument();
    expect(screen.getByText("Confirmação da Nova Senha")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });

  it("deve habilitar o botão quando a senha atender aos requisitos", () => {
    fireEvent.change(screen.getByTestId("senha"), {
      target: { value: "Senha123" },
    });
    fireEvent.change(screen.getByTestId("confirmar_senha"), {
      target: { value: "Senha123" },
    });

    expect(screen.getByRole("button", { name: /Confirmar/i })).toBeEnabled();
  });

  it("deve mostrar erro se as senhas não conferem", () => {
    fireEvent.change(screen.getByTestId("senha"), {
      target: { value: "Senha123" },
    });
    fireEvent.change(screen.getByTestId("confirmar_senha"), {
      target: { value: "SenhaErrada" },
    });

    expect(screen.getByText(/As senhas não conferem/i)).toBeInTheDocument();
  });

  it("deve atualizar a senha com sucesso", async () => {
    mock.onPatch("/usuarios/atualizar-senha/").reply(200, {});

    fireEvent.change(screen.getByTestId("senha"), {
      target: { value: "Senha123" },
    });
    fireEvent.change(screen.getByTestId("confirmar_senha"), {
      target: { value: "Senha123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Senha atualizada com sucesso!")
      ).toBeInTheDocument();
      expect(localStorage.getItem("senhaAtual")).toBeNull();
      expect(mockSetTexto).toHaveBeenCalledWith("");
      expect(mockSetComponenteRenderizado).toHaveBeenCalledWith("login");
    });
  });

  it("deve exibir erro se a atualização falhar", async () => {
    mock.onPatch("/usuarios/atualizar-senha/").reply(400, {});

    fireEvent.change(screen.getByTestId("senha"), {
      target: { value: "Senha123" },
    });
    fireEvent.change(screen.getByTestId("confirmar_senha"), {
      target: { value: "Senha123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Erro/i)).toBeInTheDocument();
    });
  });
});
