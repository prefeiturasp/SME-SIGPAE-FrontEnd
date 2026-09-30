import React from "react";
import { render, screen } from "@testing-library/react";
import PaginaRelatorioProduto from "../RelatorioProduto";

const mockPage = jest.fn();

jest.mock("../../../components/Shareable/Page/Page", () => {
  return function Page(props) {
    mockPage(props);

    return (
      <div>
        <h1>{props.titulo}</h1>
        {props.children}
      </div>
    );
  };
});

jest.mock("../../../components/Shareable/Breadcrumb", () => {
  return function Breadcrumb() {
    return <div data-testid="breadcrumb" />;
  };
});

jest.mock(
  "../../../components/screens/Produto/BuscaAvancada/components/RelatorioProduto",
  () => {
    return function RelatorioProduto() {
      return <div data-testid="relatorio-produto" />;
    };
  },
);

describe("Página RelatorioProduto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza a página com o título Visualizar Produto fora do ambiente de produção", () => {
    render(<PaginaRelatorioProduto />);

    expect(
      screen.getByRole("heading", {
        name: "Visualizar Produto",
      }),
    ).toBeInTheDocument();

    expect(mockPage).toHaveBeenCalledWith(
      expect.objectContaining({
        titulo: "Visualizar Produto",
        botaoVoltar: true,
      }),
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("relatorio-produto")).toBeInTheDocument();
  });
});
