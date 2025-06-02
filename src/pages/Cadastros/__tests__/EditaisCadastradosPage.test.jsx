import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditaisCadastradosPage from "../EditaisCadastradosPage";

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
  "../../../components/screens/Cadastros/EditaisContratosRefatorado/ConsultaEditaisContratos",
  () => ({
    ConsultaEditaisContratos: () => (
      <div data-testid="consulta-editais">Consulta de Editais Mock</div>
    ),
  })
);

afterEach(cleanup);

describe("EditaisCadastradosPage", () => {
  test("renderiza todos os elementos corretamente", () => {
    render(<EditaisCadastradosPage />);

    expect(
      screen.getByText("Editais e Contratos Cadastrados")
    ).toBeInTheDocument();

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("consulta-editais")).toBeInTheDocument();
  });
});
