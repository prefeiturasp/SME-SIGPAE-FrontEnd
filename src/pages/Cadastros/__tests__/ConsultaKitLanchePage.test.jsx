import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { ConsultaKitLanchePage } from "../ConsultaKitLanchePage";

jest.mock("../../../components/Shareable/Breadcrumb", () => () => (
  <nav data-testid="breadcrumb">
    <span>/</span>
    <span>Consulta de Kits</span>
  </nav>
));

jest.mock(
  "../../../components/Shareable/Page/Page",
  () =>
    ({ children, ...props }) => (
      <section data-testid="page">
        <h1>{props.titulo}</h1>
        {props.botaoVoltar && <button>Voltar</button>}
        {children}
      </section>
    ),
);

jest.mock(
  "../../../components/screens/Cadastros/ConsultaKitLanche",
  () => () => (
    <div data-testid="consulta-kit-lanche">
      Conteúdo da tela de Consulta de Kits
    </div>
  ),
);

afterEach(cleanup);

describe("ConsultaKitLanchePage", () => {
  test("renderiza corretamente todos os elementos da página", () => {
    render(<ConsultaKitLanchePage />);

    const titulos = screen.getAllByText("Consulta de Kits");
    expect(titulos.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("consulta-kit-lanche")).toBeInTheDocument();
  });
});
