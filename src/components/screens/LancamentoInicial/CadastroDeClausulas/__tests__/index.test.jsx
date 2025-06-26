import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CadastroDeClausulas } from "../index";
import mock from "src/services/_mock";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockClausulaParaDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasParaDescontos";
import { mockClausulasDeDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasDeDescontos";

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Spin: ({ spinning, children }) =>
    spinning ? (
      <div data-testid="loading-spinner">Carregando...</div>
    ) : (
      children
    ),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("src/services/medicaoInicial/clausulasParaDescontos.service", () => ({
  getNumerosEditais: jest.fn(),
  cadastraClausulaParaDesconto: jest.fn(),
  getClausulaParaDesconto: jest.fn(),
  editaClausulaParaDesconto: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

describe("Componente CadastroDeClausulas", () => {
  const mockNavigate = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);
    jest
      .spyOn(require("react-router-dom"), "useSearchParams")
      .mockReturnValue([mockSearchParams]);
    mock.onGet("/clausulas-de-descontos/").reply(200, mockClausulasDeDesconto);
    mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);
    mock
      .onGet(
        "/medicao-inicial/clausulas-de-descontos/3bf3c3c1-0651-48f9-ad53-73d8495d30c8/"
      )
      .reply(200, mockClausulaParaDesconto);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente no modo de cadastro", async () => {
    render(<CadastroDeClausulas />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      expect(screen.getByText("Nº do Edital")).toBeInTheDocument();
      expect(screen.getByText("Nº da Cláusula")).toBeInTheDocument();
      expect(screen.getByText("Item da Cláusula")).toBeInTheDocument();
      expect(screen.getByText("% de Desconto")).toBeInTheDocument();
      expect(screen.getByText("Descrição")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Salvar" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancelar" })
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        "Erro ao carregar editais. Tente novamente mais tarde."
      )
    ).not.toBeInTheDocument();
  });

  it("deve dar erro ao carregar editais", async () => {
    mock.onGet("/editais/lista-numeros/").reply(500, []);
    render(<CadastroDeClausulas />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          "Erro ao carregar editais. Tente novamente mais tarde."
        )
      ).toBeInTheDocument();
    });
  });
});
