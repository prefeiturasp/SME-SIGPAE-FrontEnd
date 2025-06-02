import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditarEmpresaPage from "../EditarEmpresaPage";

jest.mock("../../../components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb">Mock Breadcrumb</div>
));

jest.mock(
  "../../../components/Shareable/Page/Page",
  () =>
    ({ children, titulo }) =>
      (
        <div data-testid="page">
          <h1>{titulo}</h1>
          {children}
        </div>
      )
);

jest.mock(
  "components/screens/Cadastros/CadastroEmpresa/CadastroEmpresa",
  () => ({
    CadastroEmpresa: () => (
      <div data-testid="cadastro-empresa">Mock CadastroEmpresa</div>
    ),
  })
);

describe("EditarEmpresaPage", () => {
  afterEach(cleanup);

  test("renderiza corretamente título, breadcrumb e componente CadastroEmpresa", () => {
    render(<EditarEmpresaPage />);

    expect(screen.getByText("Editar Cadastro de Empresa")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-empresa")).toBeInTheDocument();
  });
});
