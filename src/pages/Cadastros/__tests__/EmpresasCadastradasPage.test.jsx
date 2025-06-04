import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmpresasCadastradasPage from "../EmpresasCadastradasPage";

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
  "../../../components/screens/Cadastros/CadastroEmpresa/EmpresasCadastradas",
  () => () =>
    <div data-testid="empresas-cadastradas">Mock EmpresasCadastradas</div>
);

describe("EmpresasCadastradasPage", () => {
  afterEach(cleanup);

  test("renderiza corretamente todos os elementos da página", () => {
    render(<EmpresasCadastradasPage />);

    expect(screen.getByText("Empresas Cadastradas")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("empresas-cadastradas")).toBeInTheDocument();
  });
});
