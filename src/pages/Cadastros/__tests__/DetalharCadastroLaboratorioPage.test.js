import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import DetalharCadastroLaboratorioPage from "../DetalharCadastroLaboratorioPage";

jest.mock("../../../components/Shareable/Breadcrumb", () => () => (
  <nav data-testid="breadcrumb">
    <span>/</span>
    <span>Laboratórios</span>
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
  "../../../components/screens/Cadastros/Laboratorios/components/CadastroLaboratorio",
  () =>
    ({ naoEditavel }) =>
      (
        <div data-testid="cadastro-laboratorio">
          Componente Laboratório {naoEditavel && "(modo somente leitura)"}
        </div>
      )
);

afterEach(cleanup);

describe("DetalharCadastroLaboratorioPage", () => {
  test("renderiza todos os elementos corretamente", () => {
    render(<DetalharCadastroLaboratorioPage />);

    expect(
      screen.getByText("Detalhar Cadastro de Laboratório")
    ).toBeInTheDocument();

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-laboratorio")).toHaveTextContent(
      "modo somente leitura"
    );
  });
});
