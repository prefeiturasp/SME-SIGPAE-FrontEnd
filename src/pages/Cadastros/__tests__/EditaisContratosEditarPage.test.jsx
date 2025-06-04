import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditaisContratosEditarPage from "../EditaisContratosEditarPage";

jest.mock("../../../components/Shareable/Breadcrumb", () => () => (
  <nav data-testid="breadcrumb">
    <span>Breadcrumb mock</span>
  </nav>
));

jest.mock(
  "../../../components/Shareable/Page/Page",
  () =>
    ({ children, titulo, botaoVoltar }) =>
      (
        <section data-testid="page">
          <h1>{titulo}</h1>
          {botaoVoltar && <button>Voltar</button>}
          {children}
        </section>
      )
);

jest.mock(
  "../../../components/screens/Cadastros/EditaisContratosRefatorado/Cadastro",
  () => ({
    EditaisContratosRefatorado: () => (
      <div data-testid="cadastro-editais">Cadastro de Editais Mock</div>
    ),
  })
);

afterEach(cleanup);

describe("EditaisContratosEditarPage", () => {
  test("renderiza todos os elementos corretamente", () => {
    render(<EditaisContratosEditarPage />);

    expect(
      screen.getByText("Editais e Contratos - Edição")
    ).toBeInTheDocument();

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-editais")).toBeInTheDocument();
  });
});
