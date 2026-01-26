import React from "react";
import { render, screen } from "@testing-library/react";
import { TabelaDietasCEI } from "../../components/Tabelas/TabelaDietasCEI";

describe("Teste de comportamentos componente - TabelaDietasCEI", () => {
  const faixasEtariasMock = [
    {
      uuid: "2f6e3d4b-9a2a-4c63-b4c4-1c9e6e8f7a01",
      __str__: "00 meses",
    },
    {
      uuid: "8c3c2e91-7d64-4d9e-b6f1-4c3a0e2c9d55",
      __str__: "04 anos a 06 anos",
    },
  ];

  const tabelasMock = [
    {
      nome: "DIETA ESPECIAL - TIPO A",
      periodo_escolar: "INTEGRAL",
      valores: [
        {
          faixa_etaria: {
            uuid: "2f6e3d4b-9a2a-4c63-b4c4-1c9e6e8f7a01",
          },
          tipo_valor: "UNITARIO",
          valor: "10",
        },
        {
          faixa_etaria: {
            uuid: "2f6e3d4b-9a2a-4c63-b4c4-1c9e6e8f7a01",
          },
          tipo_valor: "ACRESCIMO",
          valor: "20",
        },
        {
          faixa_etaria: {
            uuid: "8c3c2e91-7d64-4d9e-b6f1-4c3a0e2c9d55",
          },
          tipo_valor: "UNITARIO",
          valor: "20",
        },
        {
          faixa_etaria: {
            uuid: "8c3c2e91-7d64-4d9e-b6f1-4c3a0e2c9d55",
          },
          tipo_valor: "ACRESCIMO",
          valor: "50",
        },
      ],
    },
    {
      nome: "DIETA ESPECIAL - TIPO A",
      periodo_escolar: "PARCIAL",
      valores: [
        {
          faixa_etaria: {
            uuid: "2f6e3d4b-9a2a-4c63-b4c4-1c9e6e8f7a01",
          },
          tipo_valor: "UNITARIO",
          valor: "5",
        },
        {
          faixa_etaria: {
            uuid: "2f6e3d4b-9a2a-4c63-b4c4-1c9e6e8f7a01",
          },
          tipo_valor: "ACRESCIMO",
          valor: "10",
        },
        {
          faixa_etaria: {
            uuid: "8c3c2e91-7d64-4d9e-b6f1-4c3a0e2c9d55",
          },
          tipo_valor: "UNITARIO",
          valor: "10",
        },
        {
          faixa_etaria: {
            uuid: "8c3c2e91-7d64-4d9e-b6f1-4c3a0e2c9d55",
          },
          tipo_valor: "ACRESCIMO",
          valor: "20",
        },
      ],
    },
  ];

  const totaisConsumoMock = {
    "DIETA ESPECIAL - TIPO A - INTEGRAL": {
      "00 meses": 2,
      "04 anos a 06 anos": 3,
    },
    "DIETA ESPECIAL - TIPO A - PARCIAL": {
      "00 meses": 4,
      "04 anos a 06 anos": 1,
    },
  };

  it("renderiza faixas, períodos e total corretamente", () => {
    render(
      <TabelaDietasCEI
        tabelas={tabelasMock}
        tipoDieta="TIPO A"
        faixasEtarias={faixasEtariasMock}
        totaisConsumo={totaisConsumoMock}
        ordem="B"
      />,
    );

    expect(screen.getByText("DIETA ESPECIAL - TIPO A")).toBeInTheDocument();

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

    expect(screen.getAllByText("R$ 10,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 20,00").length).toBeGreaterThan(0);

    expect(screen.getAllByText("% 20,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("% 50,00").length).toBeGreaterThan(0);

    expect(screen.getAllByText("R$ 12,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 30,00").length).toBeGreaterThan(0);

    expect(screen.getAllByText("R$ 24,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 90,00").length).toBeGreaterThan(0);

    expect(screen.getByText("TOTAL (B)")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("R$ 148,00")).toBeInTheDocument();
  });
});
