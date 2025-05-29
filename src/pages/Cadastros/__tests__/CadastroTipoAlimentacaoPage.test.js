import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import CadastroTipoAlimentacaoPage from "../CadastroTipoAlimentacaoPage";

jest.mock("../../../components/Shareable/Breadcrumb", () => () => (
  <nav data-testid="breadcrumb">
    <span>/</span>
    <span>Cadastros</span>
    <span>Cadastro de tipo de alimentação</span>
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
  "../../../components/screens/Cadastros/CadastroTipoAlimentacao/Container",
  () => () =>
    <div data-testid="container-mock">Container de Tipo de Alimentação</div>
);

afterEach(cleanup);

describe("CadastroTipoAlimentacaoPage", () => {
  test("renderiza corretamente todos os elementos da página", () => {
    render(<CadastroTipoAlimentacaoPage />);

    const elementos = screen.getAllByText("Cadastro de tipo de alimentação");
    expect(elementos.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("container-mock")).toBeInTheDocument();
  });
});
