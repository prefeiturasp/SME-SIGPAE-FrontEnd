import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginComponent, { Login as LoginSemRedux } from "../index";
import * as authService from "src/services/auth";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("services/auth", () => ({
  login: jest.fn(),
  getToken: jest.fn(() => "fake-token"),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("redux-form", () => {
  const original = jest.requireActual("redux-form");
  return {
    ...original,
    reduxForm: jest.fn(() => (component) => component),
    Field: (props) => (
      <div data-testid={`field-${props.name}`}>Field: {props.name}</div>
    ),
  };
});

jest.mock("src/components/Shareable/Botao", () => ({
  Botao: (props) => (
    <button
      data-testid={`botao-${props.texto}`}
      disabled={props.disabled}
      onClick={props.onClick}
      type={props.type || "button"}
    >
      {props.texto}
    </button>
  ),
}));

jest.mock("components/Shareable/Input/InputText", () => ({
  InputText: (props) => (
    <input
      data-testid={`input-${props.name}`}
      value={props.input?.value || ""}
      onChange={(e) => props.input?.onChange?.(e)}
      placeholder={props.placeholder}
    />
  ),
}));

jest.mock("components/Shareable/Input/InputPassword", () => ({
  InputPassword: (props) => (
    <input
      data-testid={`input-password-${props.name}`}
      type="password"
      value={props.input?.value || ""}
      onChange={(e) => props.input?.onChange?.(e)}
      placeholder={props.placeholder}
    />
  ),
}));

const mockStore = configureStore([]);

describe("Login - renderLogin", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      form: {
        login: {
          values: {
            login: "",
            password: "",
          },
        },
      },
    });

    jest.clearAllMocks();
  });

  it("deve renderizar os campos de login, senha e botões", () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginComponent handleSubmit={jest.fn()} />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId("field-login")).toBeInTheDocument();
    expect(screen.getByTestId("field-password")).toBeInTheDocument();
    expect(screen.getByTestId("botao-Acessar")).toBeInTheDocument();
    expect(screen.getByText("Esqueci minha senha")).toBeInTheDocument();
  });

  it("deve abrir o modal 'Como Acessar' ao clicar", async () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginComponent handleSubmit={jest.fn()} />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByText("Como Acessar?"));

    expect(
      await screen.findByText("Como acessar o SIGPAE")
    ).toBeInTheDocument();
  });

  it("deve chamar o authService.login ao submeter com dados válidos", async () => {
    const handleSubmitMock = (callback) => async (e) => {
      e.preventDefault();
      await callback({ login: "user", password: "pass" });
    };

    authService.login.mockResolvedValueOnce({ status: 200 });

    render(
      <Provider store={store}>
        <Router>
          <LoginSemRedux handleSubmit={handleSubmitMock} />
        </Router>
      </Provider>
    );

    const botao = screen.getByTestId("botao-Acessar");
    const form = botao.closest("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith("user", "pass");
    });
  });

  it("deve mudar para tela de recuperação ao clicar em 'Esqueci minha senha'", async () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginComponent handleSubmit={jest.fn()} />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByText("Esqueci minha senha"));

    await waitFor(() => {
      expect(screen.getByText("Servidor Municipal:")).toBeInTheDocument();
      expect(screen.getByText("Rede Parceira:")).toBeInTheDocument();
    });
  });
});
