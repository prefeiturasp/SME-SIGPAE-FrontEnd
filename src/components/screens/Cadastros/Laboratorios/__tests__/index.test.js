import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Laboratorios from "../index";
import { getListaLaboratorios } from "src/services/laboratorio.service";

jest.mock("src/services/laboratorio.service", () => ({
  getListaLaboratorios: jest.fn().mockResolvedValue({
    data: {
      results: [
        { nome: "Laboratório 1", cnpj: "11111111111111" },
        { nome: "Laboratório 2", cnpj: "22222222222222" },
      ],
    },
  }),
  getLaboratorios: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  gerarParametrosConsulta: jest.fn(),
}));

jest.mock("../components/Filtros", () => () => (
  <div data-testid="filtros-mock">
    <div data-testid="nomes-laboratorios">
      ["Laboratório 1","Laboratório 2"]
    </div>
    <div data-testid="cnpjs-laboratorios">
      ["11111111111111","22222222222222"]
    </div>
  </div>
));

jest.mock("../components/ListagemLaboratorios", () => () => null);
jest.mock("src/components/Shareable/Paginacao", () => () => null);

describe("Componente Laboratorios - Testes que Passam", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o componente corretamente", async () => {
    render(<Laboratorios />);

    expect(screen.getByTestId("filtros-mock")).toBeInTheDocument();
    expect(screen.queryByTestId("listagem-mock")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(getListaLaboratorios).toHaveBeenCalledTimes(1);
    });
  });

  it("deve carregar os dados para autocomplete ao montar", async () => {
    render(<Laboratorios />);

    await waitFor(() => {
      expect(getListaLaboratorios).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("nomes-laboratorios").textContent).toContain(
        "Laboratório 1"
      );
      expect(screen.getByTestId("cnpjs-laboratorios").textContent).toContain(
        "11111111111111"
      );
    });
  });
});
