import React from "react";
import { render, screen } from "@testing-library/react";
import { RelatorioConsolidado } from "src/components/screens/LancamentoInicial/RelatorioFinanceiro/RelatorioConsolidado";
import useView from "src/components/screens/LancamentoInicial/RelatorioFinanceiro/view";
import "@testing-library/jest-dom";

jest.mock("src/components/screens/LancamentoInicial/RelatorioFinanceiro/view");
jest.mock(
  "src/components/screens/LancamentoInicial/RelatorioFinanceiro/components/FormFields",
  () => ({
    FormFields: () => <div data-testid="form-fields" />,
  }),
);
jest.mock(
  "src/components/screens/LancamentoInicial/RelatorioFinanceiro/components/TabelaAlimentacaoCEI",
  () => ({
    TabelaAlimentacaoCEI: () => <div data-testid="tabela-alimentacao" />,
  }),
);
jest.mock(
  "src/components/screens/LancamentoInicial/RelatorioFinanceiro/components/TabelaDietasCEI",
  () => ({
    TabelaDietasCEI: ({ tipoDieta }) => (
      <div data-testid={`tabela-dietas-${tipoDieta}`} />
    ),
  }),
);

describe("Testa o componeten RelatorioConsolidado", () => {
  const baseViewMock = {
    carregando: false,
    valoresIniciais: {},
    lotes: [],
    gruposUnidadeEscolar: [],
    mesesAnos: [],
    relatorioConsolidado: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir o estado de loading (Spin) corretamente", () => {
    useView.mockReturnValue({ ...baseViewMock, carregando: true });
    render(<RelatorioConsolidado />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve renderizar o formulário e FormFields", () => {
    useView.mockReturnValue(baseViewMock);
    render(<RelatorioConsolidado />);

    expect(screen.getByTestId("form-fields")).toBeInTheDocument();
  });

  it("deve renderizar as tabelas quando o grupo for 'Grupo 1' e não estiver carregando", () => {
    useView.mockReturnValue({
      ...baseViewMock,
      relatorioConsolidado: {
        grupo_unidade_escolar: { nome: "Grupo 1" },
        tabelas: [],
      },
    });

    render(<RelatorioConsolidado />);
    expect(screen.getByTestId("tabela-alimentacao")).toBeInTheDocument();
    expect(
      screen.getByTestId("tabela-dietas-Dietas Tipo A e Tipo A Enteral"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("tabela-dietas-Dietas Tipo B"),
    ).toBeInTheDocument();
  });

  it("não deve renderizar as tabelas quando o grupo for diferente de 'Grupo 1'", () => {
    useView.mockReturnValue({
      ...baseViewMock,
      relatorioConsolidado: {
        grupo_unidade_escolar: { nome: "Grupo 2" },
        tabelas: [],
      },
    });

    render(<RelatorioConsolidado />);

    expect(screen.queryByTestId("tabela-alimentacao")).not.toBeInTheDocument();
  });

  it("não deve renderizar tabelas se relatorioConsolidado for null", () => {
    useView.mockReturnValue({ ...baseViewMock, relatorioConsolidado: null });
    render(<RelatorioConsolidado />);

    expect(screen.queryByTestId("tabela-alimentacao")).not.toBeInTheDocument();
  });
});
