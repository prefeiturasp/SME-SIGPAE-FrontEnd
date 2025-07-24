import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Tabela from "../index";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Componente Tabela", () => {
  const mockProdutos = [
    {
      uuid: "1",
      nome: "Produto Teste 1",
      status: "Ativo",
      criado_em: "2023-01-01",
    },
    {
      uuid: "2",
      nome: "Produto Teste 2",
      status: "Inativo",
      criado_em: "2023-01-02",
    },
  ];

  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("1. Renderiza corretamente o título da seção", () => {
    render(<Tabela produtos={[]} />);

    expect(screen.getByText("Produtos Cadastrados")).toBeInTheDocument();
    expect(screen.getByText("Produtos Cadastrados")).toHaveClass(
      "titulo-verde"
    );
  });

  test("2. Renderiza os cabeçalhos da tabela corretamente", () => {
    render(<Tabela produtos={[]} />);

    expect(screen.getByText("Nome do Produto")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Data do Cadastro")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  test("3. Renderiza a lista de produtos corretamente", () => {
    render(<Tabela produtos={mockProdutos} />);

    expect(screen.getByText("Produto Teste 1")).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();

    expect(screen.getByText("Produto Teste 2")).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();
    expect(screen.getByText("2023-01-02")).toBeInTheDocument();

    const editIcons = document.querySelectorAll(".fa-edit");
    expect(editIcons.length).toBe(2);
    editIcons.forEach((icon) => {
      expect(icon).toHaveClass("verde");
      expect(icon).toHaveClass("fas");
    });
  });

  test("4. Chama a função de navegação ao clicar no ícone de edição", () => {
    render(<Tabela produtos={mockProdutos} />);

    const editIcons = document.querySelectorAll(".fa-edit");

    fireEvent.click(editIcons[0]);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("/configuracoes/cadastros/edicao-produtos"),
      {
        state: {
          produto: mockProdutos[0],
        },
      }
    );

    fireEvent.click(editIcons[1]);

    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("/configuracoes/cadastros/edicao-produtos"),
      {
        state: {
          produto: mockProdutos[1],
        },
      }
    );
  });

  test("5. Não quebra quando a lista de produtos está vazia", () => {
    render(<Tabela produtos={[]} />);

    expect(screen.getByText("Nome do Produto")).toBeInTheDocument();
    expect(screen.queryByText("Produto Teste 1")).not.toBeInTheDocument();
  });
});
