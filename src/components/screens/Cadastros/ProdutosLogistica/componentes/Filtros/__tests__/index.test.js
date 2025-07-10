import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Filtros from "../index";
import {
  CADASTROS,
  CADASTRO_PRODUTOS,
  CONFIGURACOES,
} from "src/configs/constants";

const mockSetResultado = jest.fn();
const mockSetFiltros = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockNomes = [
  "Arroz Integral",
  "Feijão Carioca",
  "Macarrão Integral",
  "Óleo de Soja",
];

describe("Componente Filtros", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza corretamente e interage com todos os elementos", async () => {
    render(
      <Filtros
        setResultado={mockSetResultado}
        nomes={mockNomes}
        setFiltros={mockSetFiltros}
      />
    );

    expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Nome do Produto")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Status")).toBeInTheDocument();
    expect(
      screen.getByText("Filtrar por Data do Cadastro")
    ).toBeInTheDocument();
    expect(screen.getByText("Cadastrar Produto")).toBeInTheDocument();

    const statusSelect = document.querySelector(
      'select[data-cy="Filtrar por Status"]'
    );
    await userEvent.selectOptions(statusSelect, "Ativo");
    expect(statusSelect.value).toBe("Ativo");

    const cadastrarButton = screen.getByText("Cadastrar Produto");
    await userEvent.click(cadastrarButton);
    expect(mockNavigate).toHaveBeenCalledWith(
      `/${CONFIGURACOES}/${CADASTROS}/${CADASTRO_PRODUTOS}`
    );

    const filtrarButton = screen.getByTestId("botao-filtrar");
    await userEvent.click(filtrarButton);
    expect(mockSetFiltros).toHaveBeenCalled();

    const limparButton = screen.getByText("Limpar Filtros");
    await userEvent.click(limparButton);
    expect(mockSetResultado).toHaveBeenCalledWith(undefined);
  });

  test("filtra nomes de produtos corretamente", async () => {
    render(
      <Filtros
        setResultado={mockSetResultado}
        nomes={mockNomes}
        setFiltros={mockSetFiltros}
      />
    );

    const nomeInput = document.querySelector('input[type="search"]');

    await userEvent.type(nomeInput, "Arroz");
    expect(nomeInput.value).toBe("Arroz");

    await userEvent.clear(nomeInput);
    await userEvent.type(nomeInput, "feijão");
    expect(nomeInput.value).toBe("feijão");

    await userEvent.clear(nomeInput);
    await userEvent.type(nomeInput, "inte");
    expect(nomeInput.value).toBe("inte");
  });
});
