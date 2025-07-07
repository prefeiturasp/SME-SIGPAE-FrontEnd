import React from "react";
import { render, screen } from "@testing-library/react";
import CadastroGeral from "../index";

jest.mock("antd", () => ({
  Spin: jest.fn(({ spinning, children }) => (
    <div data-testid="spin">
      {spinning ? "Loading" : "Not Loading"} {children}
    </div>
  )),
}));

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: () => <div data-testid="paginacao">Paginacao mock</div>,
}));

jest.mock(
  "src/components/screens/Cadastros/CadastroGeral/componentes/Filtros",
  () => ({
    __esModule: true,
    default: () => <div data-testid="filtros">Filtros mock</div>,
  })
);

jest.mock(
  "src/components/screens/Cadastros/CadastroGeral/componentes/Tabela",
  () => ({
    __esModule: true,
    default: () => <div data-testid="tabela">Tabela mock</div>,
  })
);

jest.mock("src/services/produto.service", () => ({
  getNomesItems: jest.fn().mockResolvedValue({ data: { results: [] } }),
  getTiposItems: jest.fn().mockResolvedValue({ data: [] }),
  consultaItems: jest
    .fn()
    .mockResolvedValue({ data: { results: [], count: 0 }, status: 200 }),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

describe("CadastroGeral", () => {
  it("deve renderizar sem erro e mostrar o Spin de carregamento inicialmente", async () => {
    render(<CadastroGeral />);
    expect(screen.getByTestId("spin")).toHaveTextContent("Loading");
    expect(screen.getByTestId("filtros")).toBeInTheDocument();
  });
});
