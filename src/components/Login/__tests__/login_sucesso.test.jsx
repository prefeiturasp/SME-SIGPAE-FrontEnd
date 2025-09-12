import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { App } from "src/App";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockLogin } from "src/mocks/services/auth.service/login";
import mock from "src/services/_mock";

jest.mock("moment/dist/locale/pt-br", () => {});

describe("Teste Login com sucesso", () => {
  beforeEach(async () => {
    process.env.IS_TEST = true;

    await act(async () => {
      render(<App />);
    });
  });

  it("Renderiza tela de login", async () => {
    expect(screen.getByText("Como Acessar?")).toBeInTheDocument();

    expect(screen.getByText("Usuário")).toBeInTheDocument();
    expect(screen.getByText("Senha")).toBeInTheDocument();

    expect(screen.getByText("Acessar")).toBeInTheDocument();
    expect(screen.getByText("Esqueci minha senha")).toBeInTheDocument();
  });

  it("Loga no sistema com sucesso", async () => {
    mock.onPost("/login/").reply(200, mockLogin);
    mock.onGet("/usuarios/atualizar-cargo/").reply(200, {});
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/downloads/quantidade-nao-vistos/").reply(200, {});

    const inputLogin = screen
      .getByTestId("div-input-login")
      .querySelector("input");
    fireEvent.change(inputLogin, {
      target: { value: "1234567" },
    });

    const inputPassword = screen
      .getByTestId("div-input-password")
      .querySelector("input");
    fireEvent.change(inputPassword, {
      target: { value: "password" },
    });

    const botaoAcessar = screen.getByText("Acessar").closest("button");
    fireEvent.click(botaoAcessar);

    await waitFor(() => {
      expect(screen.getByText("Início")).toBeInTheDocument();
    });
  });
});
