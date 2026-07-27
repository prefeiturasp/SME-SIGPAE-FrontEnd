import React from "react";
import { render, screen } from "@testing-library/react";
import PaginaRelatorioProduto from "../RelatorioProduto";

const mockVerificaAmbienteProducao = jest.fn();
const mockPage = jest.fn();

jest.mock("src/constants/config", () => ({
  ENVIRONMENT: {
    includes: (...args) => mockVerificaAmbienteProducao(...args),
  },
}));

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
    mockVerificaAmbienteProducao.mockReturnValue(false);

    render(<PaginaRelatorioProduto />);

    expect(
      screen.getByRole("heading", {
        name: "Visualizar Produto",
      }),
    ).toBeInTheDocument();

    expect(mockVerificaAmbienteProducao).toHaveBeenCalledWith("production");

    expect(mockPage).toHaveBeenCalledWith(
      expect.objectContaining({
        titulo: "Visualizar Produto",
        botaoVoltar: true,
      }),
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("relatorio-produto")).toBeInTheDocument();
  });

  it("renderiza a página com o título Consultar Produto em produção", () => {
    mockVerificaAmbienteProducao.mockReturnValue(true);

    render(<PaginaRelatorioProduto />);

    expect(
      screen.getByRole("heading", {
        name: "Consultar Produto",
      }),
    ).toBeInTheDocument();

    expect(mockPage).toHaveBeenCalledWith(
      expect.objectContaining({
        titulo: "Consultar Produto",
        botaoVoltar: true,
      }),
    );
  });
});
