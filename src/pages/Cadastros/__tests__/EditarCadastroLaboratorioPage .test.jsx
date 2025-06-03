import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import EditarCadastroLaboratorioPage from "../EditarCadastroLaboratorioPage .jsx";

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
  "src/components/screens/Cadastros/Laboratorios/components/CadastroLaboratorio",
  () => () =>
    <div data-testid="cadastro-laboratorio">Mock CadastroLaboratorio</div>
);

describe("EditarCadastroLaboratorioPage", () => {
  afterEach(cleanup);

  test("renderiza corretamente o título, breadcrumb e o componente CadastroLaboratorio", () => {
    render(<EditarCadastroLaboratorioPage />);

    expect(
      screen.getByText("Editar Cadastro de Laboratório")
    ).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-laboratorio")).toBeInTheDocument();
  });
});
