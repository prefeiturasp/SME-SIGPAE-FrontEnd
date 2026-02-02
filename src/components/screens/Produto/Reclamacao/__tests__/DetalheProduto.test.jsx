import React from "react";
import { render, screen } from "@testing-library/react";
import DetalheProduto from "src/components/screens/Produto/Reclamacao/components/DetalheProduto";

const mockProduto = {
  componentes: "Farinha de trigo, açúcar, ovos",
  tem_aditivos_alergenicos: true,
  aditivos: "Glúten, Lactose",
  prazo_validade: "12 meses",
  info_armazenamento: "Local seco e arejado",
  outras_informacoes: "Informação extra importante",
  homologacoes: [
    { rastro_terceirizada: { nome_fantasia: "Empresa Velha" } },
    {
      rastro_terceirizada: {
        nome_fantasia: "Empresa Atual",
        contatos: [
          {
            telefone: "(11) 1111-1111",
            email: "contato@atual.com",
          },
          {
            celular: "(11) 99999-9999",
          },
        ],
      },
    },
  ],
};

describe("Teste do componente DetalheProduto", () => {
  it("deve renderizar os dados da ÚLTIMA homologação da lista", () => {
    render(<DetalheProduto produto={mockProduto} />);
    expect(screen.getByText("Empresa Atual")).toBeInTheDocument();
    expect(screen.queryByText("Empresa Velha")).not.toBeInTheDocument();
  });

  it("deve renderizar múltiplos contatos (telefones e e-mails)", () => {
    render(<DetalheProduto produto={mockProduto} />);

    expect(screen.getByText("(11) 1111-1111")).toBeInTheDocument();
    expect(screen.getByText("(11) 99999-9999")).toBeInTheDocument();
    expect(screen.getByText("contato@atual.com")).toBeInTheDocument();
  });

  it("deve exibir a seção 'Quais?' quando tem_aditivos_alergenicos for true", () => {
    render(<DetalheProduto produto={mockProduto} />);

    expect(screen.getByText("SIM")).toBeInTheDocument();
    expect(screen.getByText("Quais?")).toBeInTheDocument();
    expect(screen.getByText("Glúten, Lactose")).toBeInTheDocument();
  });

  it("deve exibir 'NÃO' e esconder a seção 'Quais?' quando não houver alergênicos", () => {
    const produtoSemAlergia = {
      ...mockProduto,
      tem_aditivos_alergenicos: false,
      aditivos: "",
    };
    render(<DetalheProduto produto={produtoSemAlergia} />);

    expect(screen.getByText("NÃO")).toBeInTheDocument();
    expect(screen.queryByText("Quais?")).not.toBeInTheDocument();
  });

  it("não deve renderizar a div de 'Outras informações' se o campo estiver vazio", () => {
    const produtoSemInfo = { ...mockProduto, outras_informacoes: null };
    render(<DetalheProduto produto={produtoSemInfo} />);

    const labelExtra = screen.queryByText(
      /Outras informações que a empresa julgar necessário/i,
    );
    expect(labelExtra).not.toBeInTheDocument();
  });
});
