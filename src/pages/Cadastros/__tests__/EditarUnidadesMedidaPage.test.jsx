import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditarUnidadesMedidaPage from "../EditarUnidadesMedidaPage";

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
  "src/components/screens/Cadastros/UnidadesMedida/components/CadastroUnidadeMedida",
  () => () =>
    <div data-testid="cadastro-unidade-medida">Mock CadastroUnidadeMedida</div>
);

describe("EditarUnidadesMedidaPage", () => {
  afterEach(cleanup);

  test("renderiza o título, o breadcrumb e o componente de cadastro corretamente", () => {
    render(<EditarUnidadesMedidaPage />);

    expect(
      screen.getByText("Editar Cadastro de Unidade de Medida")
    ).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-unidade-medida")).toBeInTheDocument();
  });
});
