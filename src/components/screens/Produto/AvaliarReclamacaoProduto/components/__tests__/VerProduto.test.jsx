import React from "react";
import { render, screen } from "@testing-library/react";
import { VerProduto } from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/VerProduto";
import "@testing-library/jest-dom";

jest.mock(
  "src/components/screens/Produto/AvaliarReclamacaoProduto/components/DadosReclamacao",
  () => ({
    DadosReclamacaoProduto: () => <div data-testid="dados-reclamacao" />,
  }),
);
jest.mock(
  "src/components/screens/Produto/AvaliarReclamacaoProduto/components/DadosProduto",
  () => ({
    DadosProduto: () => <div data-testid="dados-produto" />,
  }),
);
jest.mock(
  "src/components/screens/Produto/AvaliarReclamacaoProduto/components/Botoes",
  () => ({
    Botoes: () => <div data-testid="botoes-component" />,
  }),
);
jest.mock(
  "src/components/screens/Produto/AvaliarReclamacaoProduto/components/DadosEmpresa",
  () => ({
    DadosEmpresa: () => <div data-testid="dados-empresa" />,
  }),
);

jest.mock(
  "src/components/screens/Produto/AvaliarReclamacaoProduto/components/TabelaProdutos_old/helpers",
  () => ({
    NOME_STATUS: {
      1: "Aprovado",
      2: "Pendente",
    },
  }),
);

describe("Testa componente VerProduto", () => {
  const macarrao = {
    nome: "Macarrão",
    marca: { nome: "Vilma" },
    fabricante: { nome: "Vilma S.A" },
    ultima_homologacao: { status: 1 },
  };
  const mockProps = {
    setPropsPageProduto: jest.fn(),
    produto: macarrao,
  };

  const renderComponent = (mockProps) => {
    return render(<VerProduto {...mockProps} />);
  };

  it("deve renderizar as informações básicas do produto corretamente", () => {
    renderComponent(mockProps);

    expect(screen.getByText("Nome do produto")).toBeInTheDocument();
    expect(screen.getByText(macarrao.nome)).toBeInTheDocument();

    expect(screen.getByText("Marca")).toBeInTheDocument();
    expect(screen.getByText(macarrao.marca.nome)).toBeInTheDocument();

    expect(screen.getByText("Fabricante")).toBeInTheDocument();
    expect(screen.getByText(macarrao.fabricante.nome)).toBeInTheDocument();
  });

  it("deve mapear o status corretamente usando o helper NOME_STATUS", () => {
    renderComponent(mockProps);

    expect(screen.getByText("Aprovado")).toBeInTheDocument();
  });

  it("deve renderizar todos os subcomponentes filhos", () => {
    renderComponent(mockProps);
    expect(screen.getAllByTestId("botoes-component")).toHaveLength(2);
    expect(screen.getByTestId("dados-reclamacao")).toBeInTheDocument();
    expect(screen.getByTestId("dados-empresa")).toBeInTheDocument();
    expect(screen.getByTestId("dados-produto")).toBeInTheDocument();
  });

  it("deve lidar com campos opcionais (marca, fabricante, status) nulos", () => {
    const propsIncompletas = {
      ...mockProps,
      produto: {
        nome: "Feijão Carioca",
        marca: null,
        fabricante: undefined,
        ultima_homologacao: null,
      },
    };

    renderComponent(propsIncompletas);

    expect(screen.getByText("Feijão Carioca")).toBeInTheDocument();

    const valores = screen.getAllByText("", { selector: ".value" });

    expect(valores.length).toBeGreaterThan(0);
  });

  it("deve exibir os títulos das seções corretamente", () => {
    renderComponent(mockProps);

    expect(screen.getByText("Informação de reclamante")).toBeInTheDocument();
    expect(
      screen.getByText("Informação de empresa solicitante (Terceirizada)"),
    ).toBeInTheDocument();
  });
});
