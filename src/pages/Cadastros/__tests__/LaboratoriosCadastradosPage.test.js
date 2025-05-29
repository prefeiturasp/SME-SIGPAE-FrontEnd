import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import LaboratoriosCadastradosPage from "../LaboratoriosCadastradosPage";

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

jest.mock("../../../components/screens/Cadastros/Laboratorios", () => () => (
  <div data-testid="laboratorios">Mock Laboratorios</div>
));

describe("LaboratoriosCadastradosPage", () => {
  afterEach(cleanup);

  test("deve renderizar corretamente o título, breadcrumb e o componente Laboratorios", () => {
    render(<LaboratoriosCadastradosPage />);

    expect(screen.getByText("Laboratórios")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("laboratorios")).toBeInTheDocument();
  });
});
