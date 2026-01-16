import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DadosReclamacaoProduto } from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/DadosReclamacao";

jest.mock(
  "src/components/screens/Produto/AvaliarReclamacaoProduto/components/DadosEmpresa",
  () => ({
    DadosEmpresa: () => (
      <div data-testid="dados-empresa-mock">Dados da Empresa</div>
    ),
  }),
);

describe("Testa o componente DadosReclamacaoProduto", () => {
  const mockProduto = {
    ultima_homologacao: {
      reclamacoes: [
        {
          escola: {
            nome: "EMEF Pericles",
            codigo_eol: "123456",
          },
          reclamante_nome: "Maria Silva",
          reclamante_registro_funcional: "RF99988",
          reclamante_cargo: "Diretora",
          reclamacao: "<b>Texto da reclamação com HTML</b>",
          anexos: [
            { arquivo: "http://link1.com" },
            { arquivo: "http://link2.com" },
          ],
        },
      ],
    },
  };

  it("deve renderizar todos os dados da reclamação corretamente", () => {
    render(
      <DadosReclamacaoProduto produto={mockProduto} paginaInteira={true} />,
    );
    expect(screen.getByText("EMEF Pericles")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("Maria Silva")).toBeInTheDocument();
    expect(screen.getByText("RF99988")).toBeInTheDocument();
    expect(screen.getByText("Diretora")).toBeInTheDocument();
    const labelReclamacao = screen.getByText("Reclamação");
    const valorReclamacao = labelReclamacao.nextElementSibling;

    expect(valorReclamacao.innerHTML).toContain(
      "<b>Texto da reclamação com HTML</b>",
    );
    expect(screen.getByText("Anexo 1")).toHaveAttribute(
      "href",
      "http://link1.com",
    );
    expect(screen.getByText("Anexo 2")).toHaveAttribute(
      "href",
      "http://link2.com",
    );
  });

  it("deve exibir DadosEmpresa apenas quando paginaInteira for false", () => {
    const { rerender } = render(
      <DadosReclamacaoProduto produto={mockProduto} paginaInteira={true} />,
    );
    expect(screen.queryByTestId("dados-empresa-mock")).not.toBeInTheDocument();

    rerender(
      <DadosReclamacaoProduto produto={mockProduto} paginaInteira={false} />,
    );
    expect(screen.getByTestId("dados-empresa-mock")).toBeInTheDocument();
  });

  it("deve lidar com a ausência de reclamações ou dados aninhados para garantir cobertura das guardas (&&)", () => {
    const produtoSemDados = {
      ultima_homologacao: {
        reclamacoes: null,
      },
    };
    render(
      <DadosReclamacaoProduto produto={produtoSemDados} paginaInteira={true} />,
    );
    expect(screen.getByText("Nome do reclamante")).toBeInTheDocument();
    const values = document.querySelectorAll(".value");
    values.forEach((v) => expect(v.textContent).toBe(""));
  });
});
