import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import CadastrosPage from "../CadastrosPage";

jest.mock("../../../components/Shareable/Breadcrumb", () => () => (
  <nav data-testid="breadcrumb">
    <span>/</span>
    <span>Cadastros</span>
  </nav>
));

jest.mock(
  "../../../components/Shareable/Page/Page",
  () =>
    ({ children, ...props }) =>
      (
        <section data-testid="page">
          <h1>{props.titulo}</h1>
          {props.botaoVoltar && <button>Voltar</button>}
          {children}
        </section>
      )
);

jest.mock("../../../components/screens/Cadastros/Cadastros", () => () => (
  <div data-testid="cadastros-componente">Conteúdo da tela de cadastros</div>
));

afterEach(cleanup);

describe("CadastrosPage", () => {
  test("renderiza corretamente todos os elementos da página", () => {
    render(<CadastrosPage />);

    const titulos = screen.getAllByText("Cadastros");
    expect(titulos.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastros-componente")).toBeInTheDocument();
  });
});
