import { render, screen } from "@testing-library/react";
import React from "react";
import { DadosEmpresa } from "../../components/DadosEmpresa";

describe("DadosEmpresa", () => {
  const mockProduto = {
    ultima_homologacao: {
      rastro_terceirizada: {
        nome_fantasia: "Empresa Teste LTDA",
        contatos: [
          {
            telefone: "(11) 98765-4321",
            email: "contato@empresateste.com.br",
          },
        ],
      },
      reclamacoes: true,
    },
  };

  it("deve renderizar o telefone quando reclamacoes for true", () => {
    render(<DadosEmpresa produto={mockProduto} />);

    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("(11) 98765-4321")).toBeInTheDocument();
  });

  it("não deve renderizar o telefone quando reclamacoes for false", () => {
    const produtoSemReclamacoes = {
      ...mockProduto,
      ultima_homologacao: {
        ...mockProduto.ultima_homologacao,
        reclamacoes: false,
      },
    };

    render(<DadosEmpresa produto={produtoSemReclamacoes} />);

    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.queryByText("(11) 98765-4321")).not.toBeInTheDocument();
  });

  it("deve renderizar todos os elementos quando dados completos são fornecidos", () => {
    render(<DadosEmpresa produto={mockProduto} />);

    expect(
      screen.getByText("Empresa solicitante (Terceirizada)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Empresa Teste LTDA")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("(11) 98765-4321")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("contato@empresateste.com.br")).toBeInTheDocument();
  });
});
