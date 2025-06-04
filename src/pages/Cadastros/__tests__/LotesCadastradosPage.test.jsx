import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import LotesCadastradosPage from "../LotesCadastradosPage";

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

jest.mock(
  "../../../components/screens/Cadastros/CadastroLote/components/LotesCadastrados",
  () => () => <div data-testid="lotes-cadastrados">Mock Lotes Cadastrados</div>
);

describe("LotesCadastradosPage", () => {
  afterEach(cleanup);

  test("deve renderizar título, breadcrumb e componente LotesCadastrados", () => {
    render(<LotesCadastradosPage />);

    expect(screen.getByText("Lotes Cadastrados")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("lotes-cadastrados")).toBeInTheDocument();
  });
});
