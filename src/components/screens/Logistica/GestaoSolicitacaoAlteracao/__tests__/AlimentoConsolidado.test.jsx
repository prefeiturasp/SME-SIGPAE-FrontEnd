import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AlimentosConsolidado from "src/components/screens/Logistica/GestaoSolicitacaoAlteracao/components/AlimentosConsolidado";
import { getConsolidadoAlimentos } from "src/services/logistica.service";

jest.mock("src/services/logistica.service");

const mockSolicitacao = {
  requisicao: { uuid: "499670b2-3915-40e2-b775-cb913de7c43d" },
};

const mockData = [
  {
    nome_alimento: "ARROZ",
    peso_total: 10.5,
    total_embalagens: [
      {
        tipo_embalagem: "FECHADA",
        qtd_volume: 2,
        capacidade_completa: "5kg",
        unidade_medida: "kg",
      },
      {
        tipo_embalagem: "FRACIONADA",
        qtd_volume: 1,
        capacidade_completa: "0.5kg",
        unidade_medida: "kg",
      },
    ],
  },
  {
    nome_alimento: "FEIJÃO",
    peso_total: 5,
    embalagens: [
      { tipo_embalagem: "OUTRO", qtd_volume: 1, capacidade_completa: "1kg" },
    ],
    total_embalagens: [{ tipo_embalagem: "OUTRA", unidade_medida: "kg" }],
  },
];

describe("Componente Consolidado de Alimentos - Gestão", () => {
  const renderComponent = () => {
    return render(<AlimentosConsolidado solicitacao={mockSolicitacao} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o loading e depois a tabela com dados", async () => {
    getConsolidadoAlimentos.mockResolvedValue({ data: mockData });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("ARROZ")).toBeInTheDocument();
    });
    expect(screen.getByText(/10,5 kg/i)).toBeInTheDocument();
    expect(screen.getByText("5kg")).toBeInTheDocument();
  });

  it("deve renderizar '--' quando não encontrar o tipo de embalagem", async () => {
    getConsolidadoAlimentos.mockResolvedValue({ data: mockData });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("FEIJÃO")).toBeInTheDocument();
    });
    const placeholders = screen.getAllByText("--");
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it("deve cobrir o caso onde 'alimentosConsolidado' já existe (useEffect branch)", async () => {
    getConsolidadoAlimentos.mockResolvedValue({ data: [] });
    const { rerender } = renderComponent();
    rerender();
    expect(getConsolidadoAlimentos).toHaveBeenCalledTimes(1);
  });
});
