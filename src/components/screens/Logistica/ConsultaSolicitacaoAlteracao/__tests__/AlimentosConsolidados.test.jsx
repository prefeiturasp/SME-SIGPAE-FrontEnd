import React from "react";
import { render, screen } from "@testing-library/react";
import AlimentosConsolidado from "src/components/screens/Logistica/ConsultaSolicitacaoAlteracao/components/AlimentosConsolidado"; // Ajuste o nome do import
import { getConsolidadoAlimentos } from "src/services/logistica.service";

jest.mock("src/services/logistica.service");

const mockSolicitacao = {
  requisicao: { uuid: "123-uuid" },
};

const mockData = [
  {
    nome_alimento: "Arroz",
    peso_total: 10.5,
    total_embalagens: [
      {
        tipo_embalagem: "FECHADA",
        qtd_volume: 2,
        capacidade_completa: "5kg",
        unidade_medida: "kg",
      },
      {
        tipo_embalagem: "fracionada",
        qtd_volume: 1,
        capacidade_completa: "0.5kg",
        unidade_medida: "kg",
      },
    ],
  },
  {
    nome_alimento: "Feijão",
    peso_total: 2,
    embalagens: [],
    total_embalagens: [{ tipo_embalagem: "OUTRO", unidade_medida: "kg" }],
  },
];

describe("Componente Consolidado de Alimentos", () => {
  const renderComponent = () => {
    return render(<AlimentosConsolidado solicitacao={mockSolicitacao} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir o Spin de carregamento e depois a tabela com dados", async () => {
    getConsolidadoAlimentos.mockResolvedValue({ data: mockData });

    renderComponent();
    expect(
      screen.getByText((content, element) => {
        return (
          element.classList.contains("ant-spin-spinning") ||
          content.includes("Carregando")
        );
      }),
    ).toBeInTheDocument();

    const nomeAlimento = await screen.findByText("Arroz");
    expect(nomeAlimento).toBeInTheDocument();
  });

  it("deve renderizar '--' quando não houver embalagens específicas", async () => {
    getConsolidadoAlimentos.mockResolvedValue({ data: mockData });
    renderComponent();

    const feijaoRow = await screen.findByText("Feijão");
    expect(feijaoRow).toBeInTheDocument();
    const fallbacks = screen.getAllByText("--");
    expect(fallbacks.length).toBeGreaterThan(0);
  });

  it("deve cobrir a lógica de filtraEmbalagemPorTipo com tipos inexistentes", async () => {
    const mockDataVazia = [
      {
        nome_alimento: "Vazio",
        peso_total: 0,
        total_embalagens: [{ tipo_embalagem: "OUTRO", unidade_medida: "g" }],
      },
    ];

    getConsolidadoAlimentos.mockResolvedValue({ data: mockDataVazia });
    renderComponent();

    expect(await screen.findByText("Vazio")).toBeInTheDocument();
  });
});
