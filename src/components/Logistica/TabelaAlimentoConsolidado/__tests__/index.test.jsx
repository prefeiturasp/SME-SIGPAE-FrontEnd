import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TabelaAlimentoConsolidado from "../index";

describe("Componente TabelaAlimentoConsolidado", () => {
  const alimentosMock = [
    {
      nome_alimento: "Arroz",
      total_embalagens: [
        {
          tipo_embalagem: "FECHADA",
          qtd_volume: 10,
          capacidade_completa: "5kg",
          unidade_medida: "kg",
        },
        {
          tipo_embalagem: "FRACIONADA",
          qtd_volume: 5,
          capacidade_completa: "1kg",
          unidade_medida: "kg",
        },
      ],
      peso_total: 55.5,
    },
    {
      nome_alimento: "Feijão",
      total_embalagens: [
        {
          tipo_embalagem: "FECHADA",
          qtd_volume: 8,
          capacidade_completa: "2kg",
          unidade_medida: "kg",
        },
      ],
      peso_total: 16.0,
    },
  ];

  const alimentosSemFracionadaMock = [
    {
      nome_alimento: "Macarrão",
      total_embalagens: [
        {
          tipo_embalagem: "FECHADA",
          qtd_volume: 15,
          capacidade_completa: "3kg",
          unidade_medida: "kg",
        },
      ],
      peso_total: 45.0,
    },
  ];

  const alimentosSemPesoTotalMock = [
    {
      nome_alimento: "Açúcar",
      total_embalagens: [
        {
          tipo_embalagem: "FECHADA",
          qtd_volume: 20,
          capacidade_completa: "10kg",
          unidade_medida: "kg",
        },
      ],
    },
  ];

  it("deve renderizar corretamente com todos os dados", () => {
    render(
      <TabelaAlimentoConsolidado
        alimentosConsolidado={alimentosMock}
        mostrarPesoTotal={true}
      />
    );

    expect(screen.getByText("Nome do Alimento")).toBeInTheDocument();
    expect(screen.getByText("Embalagem Fechada")).toBeInTheDocument();
    expect(screen.getByText("Embalagem Fracionada")).toBeInTheDocument();
    expect(screen.getByText("Peso Total")).toBeInTheDocument();
    expect(screen.getAllByText("Quantidade Prevista")).toHaveLength(2);
    expect(screen.getAllByText("Capacidade")).toHaveLength(2);

    expect(screen.getByText("Arroz")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5kg")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("1kg")).toBeInTheDocument();
    expect(screen.getByText("55,5 kg")).toBeInTheDocument();

    expect(screen.getByText("Feijão")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("2kg")).toBeInTheDocument();
    expect(screen.getAllByText("--")).toHaveLength(2);
    expect(screen.getByText("16 kg")).toBeInTheDocument();
  });

  it("deve renderizar corretamente sem mostrar peso total", () => {
    render(
      <TabelaAlimentoConsolidado
        alimentosConsolidado={alimentosMock}
        mostrarPesoTotal={false}
      />
    );

    expect(screen.queryByText("Peso Total")).not.toBeInTheDocument();
    expect(screen.queryByText("55,5 kg")).not.toBeInTheDocument();
  });

  it("deve renderizar corretamente quando não há embalagem fracionada", () => {
    render(
      <TabelaAlimentoConsolidado
        alimentosConsolidado={alimentosSemFracionadaMock}
        mostrarPesoTotal={true}
      />
    );

    expect(screen.getByText("Macarrão")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("3kg")).toBeInTheDocument();
    expect(screen.getAllByText("--")).toHaveLength(2);
    expect(screen.getByText("45 kg")).toBeInTheDocument();
  });

  it("deve renderizar corretamente com className personalizado", () => {
    const { container } = render(
      <TabelaAlimentoConsolidado
        alimentosConsolidado={alimentosMock}
        mostrarPesoTotal={true}
        className="minha-classe"
      />
    );

    expect(container.querySelector(".minha-classe")).toBeInTheDocument();
  });

  it("deve substituir ponto por vírgula no peso total quando existir", () => {
    render(
      <TabelaAlimentoConsolidado
        alimentosConsolidado={alimentosMock}
        mostrarPesoTotal={true}
      />
    );

    expect(screen.getByText("55,5 kg")).toBeInTheDocument();
    expect(screen.getByText("16 kg")).toBeInTheDocument();
  });

  it("não deve quebrar quando não houver peso total", () => {
    render(
      <TabelaAlimentoConsolidado
        alimentosConsolidado={alimentosSemPesoTotalMock}
        mostrarPesoTotal={false}
      />
    );

    expect(screen.getByText("Açúcar")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("10kg")).toBeInTheDocument();
    expect(screen.queryByText("Peso Total")).not.toBeInTheDocument();
  });
});
