import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditarProdutosLogisticaPage from "../EditarProdutosLogisticaPage";

jest.mock("components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb">Mock Breadcrumb</div>
));

jest.mock("components/Shareable/Page/Page", () => ({ children, titulo }) => (
  <div data-testid="page">
    <h1>{titulo}</h1>
    {children}
  </div>
));

jest.mock(
  "components/screens/Cadastros/CadastroProdutosLogistica",
  () => () =>
    (
      <div data-testid="cadastro-produtos-logistica">
        Mock CadastroProdutosLogistica
      </div>
    )
);

describe("EditarProdutosLogisticaPage", () => {
  afterEach(cleanup);

  test("renderiza corretamente o título, o breadcrumb e o componente de cadastro", () => {
    render(<EditarProdutosLogisticaPage />);

    expect(screen.getByText("Editar Cadastro de Produto")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(
      screen.getByTestId("cadastro-produtos-logistica")
    ).toBeInTheDocument();
  });
});
