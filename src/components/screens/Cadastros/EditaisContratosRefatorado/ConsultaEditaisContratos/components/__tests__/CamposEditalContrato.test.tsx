import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Switch } from "antd";
import React from "react";

import { CamposEditalContrato } from "../CamposEditalContrato";

jest.mock("antd", () => ({
  Switch: jest.fn(),
}));

const switchMock = Switch as unknown as jest.Mock;

const editalContratoMock = {
  eh_imr: false,
  objeto: "Prestação de serviços de alimentação escolar",
  contratos: [
    {
      numero: "CONTRATO-001",
      processo: "PROCESSO-001",
      data_proposta: "15/01/2026",
      vigencias: [
        {
          data_inicial: "01/01/2025",
          data_final: "31/12/2025",
          status: "vencido",
        },
        {
          data_inicial: "01/01/2026",
          data_final: "31/12/2026",
          status: "ativo",
        },
      ],
      lotes: [
        {
          nome: "Lote 01",
        },
        {
          nome: "Lote 02",
        },
      ],
      diretorias_regionais: [
        {
          nome: "DRE Norte",
        },
        {
          nome: "DRE Sul",
        },
      ],
      terceirizada: {
        nome_fantasia: "Empresa de Alimentação",
      },
    },
  ],
};

describe("CamposEditalContrato", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    switchMock.mockImplementation(({ checked, disabled, size }) => (
      <input
        type="checkbox"
        aria-label="Edital com IMR"
        checked={checked}
        disabled={disabled}
        data-size={size}
        readOnly
      />
    ));
  });

  it("renderiza os dados gerais do edital sem IMR", () => {
    render(<CamposEditalContrato editalContrato={editalContratoMock} />);

    expect(screen.getByText("Edital com IMR?")).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.queryByText("Sim")).not.toBeInTheDocument();

    expect(
      screen.getByText("Prestação de serviços de alimentação escolar"),
    ).toBeInTheDocument();

    const switchImr = screen.getByRole("checkbox", {
      name: "Edital com IMR",
    });

    expect(switchImr).not.toBeChecked();
    expect(switchImr).toBeDisabled();
    expect(switchImr).toHaveAttribute("data-size", "small");
  });
});
