import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import CadastroTipoEmbalagemPage from "../CadastroTipoEmbalagemPage";

jest.mock("../../../components/Shareable/Breadcrumb", () => () => (
  <nav data-testid="breadcrumb">
    <span>/</span>
    <span>Cadastros</span>
    <span>Tipos de Embalagens</span>
    <span>Cadastro de Tipo de Embalagem</span>
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
  "../../../components/screens/Cadastros/TiposEmbalagens/components/CadastroTipoEmbalagem",
  () => () =>
    (
      <div data-testid="cadastro-tipo-embalagem">
        Componente de Cadastro de Tipo de Embalagem
      </div>
    )
);

afterEach(cleanup);

describe("CadastroTipoEmbalagemPage", () => {
  test("renderiza corretamente todos os elementos da página", () => {
    render(<CadastroTipoEmbalagemPage />);

    const titulos = screen.getAllByText("Cadastro de Tipo de Embalagem");
    expect(titulos.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-tipo-embalagem")).toBeInTheDocument();
  });
});
