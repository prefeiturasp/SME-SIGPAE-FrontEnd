import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import CadastroUnidadeMedidaPage from "../CadastroUnidadeMedidaPage";

jest.mock("../../../components/Shareable/Breadcrumb", () => () => (
  <nav data-testid="breadcrumb">
    <span>/</span>
    <span>Cadastros</span>
    <span>Unidades de Medida</span>
    <span>Cadastro de Unidade de Medida</span>
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

jest.mock(
  "../../../components/screens/Cadastros/UnidadesMedida/components/CadastroUnidadeMedida",
  () => () =>
    (
      <div data-testid="cadastro-unidade-medida">
        Componente de Cadastro de Unidade de Medida
      </div>
    )
);

afterEach(cleanup);

describe("CadastroUnidadeMedidaPage", () => {
  test("renderiza corretamente todos os elementos da página", () => {
    render(<CadastroUnidadeMedidaPage />);

    const titulos = screen.getAllByText("Cadastro de Unidade de Medida");
    expect(titulos.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-unidade-medida")).toBeInTheDocument();
  });
});
