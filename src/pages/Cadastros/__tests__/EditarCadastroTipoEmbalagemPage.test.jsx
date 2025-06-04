import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditarCadastroTipoEmbalagemPage from "../EditarCadastroTipoEmbalagemPage";

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
  "src/components/screens/Cadastros/TiposEmbalagens/components/CadastroTipoEmbalagem",
  () => () =>
    <div data-testid="cadastro-tipo-embalagem">Mock CadastroTipoEmbalagem</div>
);

describe("EditarCadastroTipoEmbalagemPage", () => {
  afterEach(cleanup);

  test("renderiza corretamente o título, breadcrumb e CadastroTipoEmbalagem", () => {
    render(<EditarCadastroTipoEmbalagemPage />);

    expect(
      screen.getByText("Editar Cadastro de Tipo de Embalagem")
    ).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-tipo-embalagem")).toBeInTheDocument();
  });
});
