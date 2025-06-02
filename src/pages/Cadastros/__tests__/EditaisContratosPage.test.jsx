import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditaisContratosPage from "../EditaisContratosPage";

jest.mock("../../../components/Shareable/Breadcrumb", () => () => (
  <nav data-testid="breadcrumb">
    <span>Breadcrumb Mock</span>
  </nav>
));

jest.mock(
  "../../../components/Shareable/Page/Page",
  () =>
    ({ children, titulo, botaoVoltar, voltarPara }) =>
      (
        <section data-testid="page">
          <h1>{titulo}</h1>
          {botaoVoltar && <button data-testid="voltar-button">Voltar</button>}
          <p data-testid="voltar-para">{voltarPara}</p>
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

describe("EditaisContratosPage", () => {
  test("renderiza corretamente todos os elementos da página", () => {
    render(<EditaisContratosPage />);

    expect(screen.getByText("Editais e Contratos")).toBeInTheDocument();

    expect(screen.getByTestId("voltar-button")).toBeInTheDocument();

    expect(screen.getByTestId("voltar-para")).toHaveTextContent(
      "/configuracoes/cadastros"
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-editais")).toBeInTheDocument();
  });
});
