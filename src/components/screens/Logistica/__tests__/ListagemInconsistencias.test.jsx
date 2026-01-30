import React from "react";
import { render, screen } from "@testing-library/react";
import ListagemInconsistencias from "src/components/screens/Logistica/ConferenciaInconsistencias/ListagemInconsistencias";

const mockGuias = [
  {
    numero_guia: "2024/001",
    codigo_unidade: "123456",
    nome_unidade: "CEI EXEMPLO I",
  },
  {
    numero_guia: "2024/002",
    codigo_unidade: "789012",
    nome_unidade: "EMEF EXEMPLO II",
  },
];

const renderComponent = (guias) => {
  return render(<ListagemInconsistencias guias={guias} />);
};

describe("Teste do componente ListagemInconsistencias", () => {
  it("deve exibir o título da seção e o cabeçalho da tabela", () => {
    renderComponent(mockGuias);

    expect(
      screen.getByText(/Guias de Remessa com Inconsistência/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nº da Guia de Remessa/i)).toBeInTheDocument();
    expect(screen.getByText(/Código CODAE/i)).toBeInTheDocument();
    expect(screen.getByText(/Nome da UE/i)).toBeInTheDocument();
  });

  it("deve renderizar a quantidade correta de guias passadas via props", () => {
    renderComponent(mockGuias);
    expect(screen.getByText("2024/001")).toBeInTheDocument();
    expect(screen.getByText("CEI EXEMPLO I")).toBeInTheDocument();
    expect(screen.getByText("2024/002")).toBeInTheDocument();
    expect(screen.getByText("EMEF EXEMPLO II")).toBeInTheDocument();
  });

  it("deve aplicar a classe 'desativar-borda' em todas as células da tabela", () => {
    renderComponent(mockGuias);

    const celulas = screen.getAllByText(/2024/);

    celulas.forEach((celula) => {
      expect(celula).toHaveClass("desativar-borda");
    });
  });

  it("não deve quebrar e não deve renderizar linhas se a lista de guias for vazia", () => {
    renderComponent([]);
    expect(
      screen.getByText(/Guias de Remessa com Inconsistência/i),
    ).toBeInTheDocument();
    const numeroGuia = screen.queryByText(/2024/);
    expect(numeroGuia).not.toBeInTheDocument();
  });
});
