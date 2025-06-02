import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import FaixasEtariasPage from "../FaixasEtariasPage";

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

jest.mock("../../../components/screens/Cadastros/FaixasEtarias", () => () => (
  <div data-testid="faixas-etarias">Mock FaixasEtarias</div>
));

describe("FaixasEtariasPage", () => {
  afterEach(cleanup);

  test("deve renderizar corretamente a página com todos os componentes esperados", () => {
    render(<FaixasEtariasPage />);

    expect(screen.getByText("Cadastro de Faixas Etárias")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("faixas-etarias")).toBeInTheDocument();
  });
});
