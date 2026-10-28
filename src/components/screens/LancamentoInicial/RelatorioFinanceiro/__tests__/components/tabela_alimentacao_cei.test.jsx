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
  "ALIMENTAÇÃO - INTEGRAL": {
    "00 meses": 6,
    "01 a 03 meses": 6,
    "04 anos a 06 anos": 6,
  },
  "ALIMENTAÇÃO - PARCIAL": {
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
      screen.getAllByRole("columnheader").map((th) => th.textContent),
    ).toEqual([
      "ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETAS",
      "NÚMERO DE ATEND.",
      "VALOR UNITÁRIO",
      "VALOR TOTAL UNITÁRIO",
      "VALOR DO REAJUSTE",
      "VALOR TOTAL DO REAJUSTE",
      "VALOR UNITÁRIO REAJUSTADO",
      "VALOR TOTAL",
    ]);

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

    const linhaIntegral = screen
      .getByText(
        (_, el) => el?.textContent === "Período Integral - 04 anos a 06 anos",
      )
      .closest("tr");

    expect(
      Array.from(linhaIntegral.cells).map((celula) => celula.textContent),
    ).toEqual([
      "Período Integral - 04 anos a 06 anos",
      "6",
      "R$ 3,00",
      "R$ 18,00",
      "R$ 5,00",
      "R$ 30,00",
      "R$ 8,00",
      "R$ 48,00",
    ]);

    expect(screen.getAllByText("R$ 0,00").length).toBeGreaterThan(0);
    expect(screen.getByText("R$ 14,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 84,00")).toBeInTheDocument();

    expect(screen.getByText("TOTAL (A)")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();
    expect(screen.getByText("R$ 132,00")).toBeInTheDocument();
  });
});

describe("Tabela Alimentação CEI - apresentação conforme possui_reajuste", () => {
  const COLUNAS_COM_REAJUSTE = [
    "ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETAS",
    "NÚMERO DE ATEND.",
    "VALOR UNITÁRIO",
    "VALOR TOTAL UNITÁRIO",
    "VALOR DO REAJUSTE",
    "VALOR TOTAL DO REAJUSTE",
    "VALOR UNITÁRIO REAJUSTADO",
    "VALOR TOTAL",
  ];

  const COLUNAS_SEM_REAJUSTE = [
    "ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETAS",
    "NÚMERO DE ATEND.",
    "VALOR UNITÁRIO",
    "VALOR TOTAL UNITÁRIO",
    "VALOR TOTAL",
  ];

  const cabecalhos = () =>
    screen.getAllByRole("columnheader").map((th) => th.textContent);

  const textosDaLinha = (texto) =>
    Array.from(
      screen.getByText((_, el) => el?.textContent === texto).closest("tr")
        .cells,
    ).map((celula) => celula.textContent);

  const tabela = (possuiReajuste) => (
    <TabelaAlimentacaoCEI
      tabelas={tabelas}
      faixasEtarias={faixasEtarias}
      totaisConsumo={totaisConsumo}
      ordem="A"
      possuiReajuste={possuiReajuste}
    />
  );

  it("exibe as oito colunas quando possui_reajuste é true", () => {
    render(tabela(true));

    expect(cabecalhos()).toEqual(COLUNAS_COM_REAJUSTE);
    expect(textosDaLinha("Período Integral - 04 anos a 06 anos")).toEqual([
      "Período Integral - 04 anos a 06 anos",
      "6",
      "R$ 3,00",
      "R$ 18,00",
      "R$ 5,00",
      "R$ 30,00",
      "R$ 8,00",
      "R$ 48,00",
    ]);
  });

  it("exibe somente as cinco colunas quando possui_reajuste é false", () => {
    render(tabela(false));

    expect(cabecalhos()).toEqual(COLUNAS_SEM_REAJUSTE);
    expect(
      screen.queryByRole("columnheader", { name: "VALOR DO REAJUSTE" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "VALOR TOTAL DO REAJUSTE" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "VALOR UNITÁRIO REAJUSTADO" }),
    ).not.toBeInTheDocument();
    expect(textosDaLinha("Período Integral - 04 anos a 06 anos")).toEqual([
      "Período Integral - 04 anos a 06 anos",
      "6",
      "R$ 3,00",
      "R$ 18,00",
      "R$ 18,00",
    ]);
    expect(textosDaLinha("TOTAL (A)")).toEqual([
      "TOTAL (A)",
      "36",
      "",
      "",
      "R$ 54,00",
    ]);
  });

  it("mantém as oito colunas quando a flag ainda não foi recebida", () => {
    render(
      <TabelaAlimentacaoCEI
        tabelas={tabelas}
        faixasEtarias={faixasEtarias}
        totaisConsumo={totaisConsumo}
        ordem="A"
      />,
    );

    expect(cabecalhos()).toEqual(COLUNAS_COM_REAJUSTE);
  });

  it("atualiza as colunas quando uma nova consulta traz outra flag", () => {
    const { rerender } = render(tabela(true));

    expect(cabecalhos()).toEqual(COLUNAS_COM_REAJUSTE);

    rerender(tabela(false));

    expect(cabecalhos()).toEqual(COLUNAS_SEM_REAJUSTE);
    expect(textosDaLinha("Período Integral - 04 anos a 06 anos")[4]).toBe(
      "R$ 18,00",
    );
  });
});
