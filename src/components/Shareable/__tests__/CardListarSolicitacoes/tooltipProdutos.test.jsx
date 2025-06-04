import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import TooltipProdutos from "../../CardListarSolicitacoes/tooltipProdutos";

jest.mock("src/helpers/terceirizadas", () => ({
  conferidaClass: () => "conferida-mock",
}));

afterEach(cleanup);

describe("TooltipProdutos", () => {
  const solicitacaoMock = {
    link: "/detalhes-solicitacao",
    marca: "Marca Teste",
    editais: "Edital 123, Edital 456",
    text: "Produto Alimentício",
  };

  const cardTituloMock = "HOMOLOGADOS";

  test("Renderiza corretamente o link com o texto e tooltip", () => {
    render(
      <MemoryRouter>
        <TooltipProdutos
          solicitacao={solicitacaoMock}
          cardTitulo={cardTituloMock}
        />
      </MemoryRouter>
    );

    const textoProduto = screen.getByText("Produto Alimentício");
    expect(textoProduto).toBeInTheDocument();

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/detalhes-solicitacao"
    );

    expect(textoProduto.closest("span").getAttribute("title")).toBeNull();
  });
});
