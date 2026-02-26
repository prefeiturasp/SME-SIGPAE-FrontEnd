import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { DadosEmpresa } from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/DadosEmpresa";

const mockProduto = {
  ultima_homologacao: {
    rastro_terceirizada: {
      nome_fantasia: "Empresa Teste LTDA",
      contatos: [{ telefone: "(11) 99999-9999", email: "empresa@teste.com" }],
    },
    reclamacoes: [{}],
  },
};

describe("DadosEmpresa", () => {
  it("deve renderizar o nome fantasia da terceirizada", () => {
    render(<DadosEmpresa produto={mockProduto} />);
    expect(screen.getByText("Empresa Teste LTDA")).toBeInTheDocument();
  });

  it("deve renderizar o e-mail da terceirizada", () => {
    render(<DadosEmpresa produto={mockProduto} />);
    expect(screen.getByText("empresa@teste.com")).toBeInTheDocument();
  });

  it("deve renderizar o telefone quando reclamacoes está preenchido", () => {
    render(<DadosEmpresa produto={mockProduto} />);
    expect(screen.getByText("(11) 99999-9999")).toBeInTheDocument();
  });

  it("não deve renderizar o telefone quando reclamacoes é null", () => {
    const produtoSemReclamacoes = {
      ultima_homologacao: {
        ...mockProduto.ultima_homologacao,
        reclamacoes: null,
      },
    };
    render(<DadosEmpresa produto={produtoSemReclamacoes} />);
    expect(screen.queryByText("(11) 99999-9999")).not.toBeInTheDocument();
  });
});
