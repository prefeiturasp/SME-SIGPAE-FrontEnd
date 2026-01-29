import React from "react";
import { render, screen } from "@testing-library/react";
import { TabelaAlimentacaoCEI } from "../../components/Tabelas/TabelaAlimentacaoCEI";

const faixasEtarias = [
  {
    __str__: "00 meses",
    uuid: "1b77202d-fd0b-46b7-b4ec-04eb262efece",
    inicio: 0,
    fim: 0,
  },
  {
    __str__: "01 a 03 meses",
    uuid: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
    inicio: 1,
    fim: 3,
  },
  {
    __str__: "04 anos a 06 anos",
    uuid: "2e14cd6e-33e6-4168-b1ce-449f686d1e7d",
    inicio: 48,
    fim: 72,
  },
];

const tabelas = [
  {
    nome: "Preço das Alimentações",
    periodo_escolar: "INTEGRAL",
    valores: [
      {
        faixa_etaria: { uuid: "2e14cd6e-33e6-4168-b1ce-449f686d1e7d" },
        tipo_valor: "UNITARIO",
        valor: "3",
      },
      {
        faixa_etaria: { uuid: "2e14cd6e-33e6-4168-b1ce-449f686d1e7d" },
        tipo_valor: "REAJUSTE",
        valor: "5",
      },
    ],
  },
  {
    nome: "Preço das Alimentações",
    periodo_escolar: "PARCIAL",
    valores: [
      {
        faixa_etaria: { uuid: "2e14cd6e-33e6-4168-b1ce-449f686d1e7d" },
        tipo_valor: "UNITARIO",
        valor: "6",
      },
      {
        faixa_etaria: { uuid: "2e14cd6e-33e6-4168-b1ce-449f686d1e7d" },
        tipo_valor: "REAJUSTE",
        valor: "8",
      },
    ],
  },
];

const totaisConsumo = {
  INTEGRAL: {
    "00 meses": 6,
    "01 a 03 meses": 6,
    "04 anos a 06 anos": 6,
  },
  PARCIAL: {
    "00 meses": 6,
    "01 a 03 meses": 6,
    "04 anos a 06 anos": 6,
  },
};

describe("Teste de comportamentos componente - TabelaAlimentacaoCEI", () => {
  it("renderiza faixas, períodos e total corretamente", () => {
    render(
      <TabelaAlimentacaoCEI
        tabelas={tabelas}
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
        ordem="A"
      />,
    );

    expect(
      screen.getByText("ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETAS"),
    ).toBeInTheDocument();
    expect(screen.getByText("VALOR UNITÁRIO")).toBeInTheDocument();
    expect(screen.getByText("VALOR DO REAJUSTE")).toBeInTheDocument();
    expect(screen.getByText("NÚMERO DE ATENDIMENTO")).toBeInTheDocument();
    expect(screen.getByText("VALOR TOTAL")).toBeInTheDocument();

    expect(
      screen.getAllByText((_, el) =>
        el?.textContent?.includes("Período Integral - 00 meses"),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText((_, el) =>
        el?.textContent?.includes("Período Parcial - 04 anos a 06 anos"),
      ).length,
    ).toBeGreaterThan(0);

    expect(screen.getAllByText("R$ 0,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 8,00").length).toBeGreaterThan(0);
    expect(screen.getByText("R$ 48,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 14,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 84,00")).toBeInTheDocument();

    expect(screen.getByText("TOTAL (A)")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();
    expect(screen.getByText("R$ 132,00")).toBeInTheDocument();
  });
});
