import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { buscarOcorrenciasDiretor } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { ListaOcorrencias } from "../index";

jest.mock("src/constants/config", () => ({
  ...jest.requireActual("src/constants/config"),
  ENVIRONMENT: "production",
}));

jest.mock("src/services/imr/relatorioFiscalizacaoTerceirizadas", () => ({
  buscarOcorrenciasDiretor: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

describe("ListaOcorrencias em produção", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna antes de consultar as ocorrências e mantém a listagem oculta", () => {
    const parametros = new URLSearchParams({
      mes: "1",
      ano: "2026",
      editalUuid: "11111111-1111-4111-8111-111111111111",
      solicitacaoMedicaoInicialUuid: "22222222-2222-4222-8222-222222222222",
    });

    render(
      <MemoryRouter
        initialEntries={[
          `/lancamento-inicial/lancamento-medicao-inicial/registrar-ocorrencias?${parametros}`,
        ]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ListaOcorrencias />
      </MemoryRouter>,
    );

    expect(buscarOcorrenciasDiretor).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("region", { name: "Ocorrências Registradas" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Exportar Excel" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Registrar Nova Ocorrência" }),
    ).toBeEnabled();
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByRole("combobox")).toHaveValue("1/2026");
    expect(toastError).not.toHaveBeenCalled();
  });
});
