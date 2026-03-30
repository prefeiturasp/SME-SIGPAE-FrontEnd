import React from "react";
import { render, screen } from "@testing-library/react";
import DetalheProduto from "src/components/screens/Produto/BuscaProdutoAnaliseSensorial/components/DetalheProduto";

const mockHomologacao = {
  produto: {
    eh_para_alunos_com_dieta: true,
    componentes: "Arroz, feijão",
    tem_aditivos_alergenicos: true,
    aditivos: "GLÚTEN, LACTOSE",
    embalagem: "Plástica",
    prazo_validade: "12 meses",
    info_armazenamento: "Local seco",
    outras_informacoes: "Nenhuma",
    imagens: [{ arquivo: "link1.jpg" }, { arquivo: "link2.jpg" }],
  },
  logs: [
    { justificativa: "Primeiro log" },
    { justificativa: "<strong>Justificativa Final</strong>" },
  ],
  protocolo_analise_sensorial: "PROT-2024",
};

const mockSemAlergenicos = {
  ...mockHomologacao,
  produto: {
    ...mockHomologacao.produto,
    tem_aditivos_alergenicos: false,
    eh_para_alunos_com_dieta: false,
  },
};

describe("DetalheProduto Component", () => {
  const renderComponent = (homologacao) => {
    render(<DetalheProduto homologacao={homologacao} />);
  };

  it("deve renderizar todas as informações incluindo aditivos alergenicos", () => {
    renderComponent(mockHomologacao);
    const simResponses = screen.getAllByText("SIM");
    expect(simResponses.length).toBe(2);
    expect(simResponses[0]).toBeInTheDocument();
    expect(screen.getByText("Arroz, feijão")).toBeInTheDocument();
    expect(screen.getByText("GLÚTEN, LACTOSE")).toBeInTheDocument();

    expect(screen.getByText("Justificativa Final")).toBeInTheDocument();

    expect(screen.getByText("Anexo 1")).toHaveAttribute("href", "link1.jpg");
    expect(screen.getByText("Anexo 2")).toHaveAttribute("href", "link2.jpg");
  });

  it("não deve exibir a seção de aditivos quando tem_aditivos_alergenicos for false", () => {
    renderComponent(mockSemAlergenicos);
    const naoResponses = screen.getAllByText("NÃO");
    expect(naoResponses.length).toBe(2);
    expect(screen.queryByText("Quais?")).not.toBeInTheDocument();
  });

  it("deve testar a função exibir_protocolo_dieta isoladamente para cobertura 100%", () => {
    const instance = new DetalheProduto({ homologacao: mockHomologacao });
    const lista = [{ nome: "Dieta A" }, { nome: "Dieta B" }];

    const resultMeio = instance.exibir_protocolo_dieta(lista[0], 0, lista);
    render(resultMeio);
    expect(screen.getByText("Dieta A;")).toBeInTheDocument();

    const resultFim = instance.exibir_protocolo_dieta(lista[1], 1, lista);
    render(resultFim);
    expect(screen.getByText("Dieta B.")).toBeInTheDocument();
  });
});
