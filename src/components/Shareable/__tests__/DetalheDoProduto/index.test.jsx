import React from "react";
import { render, screen } from "@testing-library/react";
import DetalheDoProduto from "../../DetalheDoProduto/index";
import { mockHomologacao } from "src/mocks/Produto/Homologacao/mockHomologacao";
import { formataInformacoesNutricionais } from "src/components/screens/Produto/Homologacao/helper";
import preview from "jest-preview";

jest.mock("react-collapse", () => ({
  Collapse: ({ children, isOpened }) => (isOpened ? children : null),
}));

jest.mock("src/components/Shareable/ToggleExpandir", () => ({
  ToggleExpandir: ({ onClick, ativo, className }) => (
    <button
      data-testid="toggle-expandir"
      onClick={onClick}
      className={className}
      data-ativo={ativo}
    >
      Toggle
    </button>
  ),
}));

jest.mock("src/components/Shareable/InformacaoDeReclamante", () => ({
  __esModule: true,
  default: ({ reclamacao, questionamento, showTitle }) => (
    <div data-testid="informacao-reclamante">
      InformaçãoReclamante - {reclamacao} - {questionamento} -{" "}
      {showTitle ? "com titulo" : "sem titulo"}
    </div>
  ),
}));

jest.mock("../../TabelaEspecificacoesProduto", () => ({
  __esModule: true,
  default: (produto) => (
    <div data-testid="tabela-especificacoes">
      TabelaEspecificacoes - {produto.nome}
    </div>
  ),
}));

jest.mock("src/components/screens/Produto/Homologacao/helper", () => ({
  formataInformacoesNutricionais: jest.fn(),
}));

describe("DetalheDoProduto Component", () => {
  beforeEach(() => {
    formataInformacoesNutricionais.mockReturnValue(
      mockHomologacao.informacoes_nutricionais,
    );
  });
  const mockProduto = mockHomologacao.produto;
  const mockReclamacao = mockProduto.ultima_homologacao.reclamacoes[0];
  const mockQuestionamento = mockProduto.ultima_homologacao.logs[0];
  //  log.status_evento_explicacao === "CODAE pediu análise da reclamação"

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização básica", () => {
    it("renderiza o componente com informações básicas do produto", () => {
      render(<DetalheDoProduto produto={mockProduto} />);
      expect(
        screen.getByText(
          "AD VITAE ILLUM POSSIMUS SIT ANIMI DOLOR SAPIENTE INVENTORE VELIT PRAESENTIUM ET COMMODI RATIONE A",
        ),
      ).toBeInTheDocument();
      expect(screen.getAllByText("ITALAC")).toHaveLength(2);
      expect(screen.getAllByText("NUTRI BRASIL SA")).toHaveLength(2);
      expect(screen.getByText("COMUM")).toBeInTheDocument();
      expect(screen.getByText("07/10/2022")).toBeInTheDocument();

      expect(
        screen.getByText("ALIMENTAR GESTÃO DE SERVIÇOS LTDA"),
      ).toBeInTheDocument();
      expect(screen.getByText("11 42339311")).toBeInTheDocument();
      expect(screen.getByText("terceirizada@admin.com")).toBeInTheDocument();
    });
  });

  describe("Renderização condicional - Status", () => {
    it("não renderiza seção de status quando status não é fornecido", () => {
      render(<DetalheDoProduto produto={mockProduto} />);
      expect(screen.queryByText("Status do produto")).not.toBeInTheDocument();
    });

    it("renderiza status quando fornecido", () => {
      render(<DetalheDoProduto produto={mockProduto} status="ativo" />);
      expect(screen.getByText("Status do produto")).toBeInTheDocument();
      expect(screen.getByText("ativo")).toBeInTheDocument();
    });

    it("renderiza informações de suspensão quando status é suspenso", () => {
      render(
        <DetalheDoProduto
          produto={mockProduto}
          status="suspenso"
          suspenso={true}
        />,
      );
      preview.debug();
      expect(screen.getByText("Status do produto")).toBeInTheDocument();
      expect(screen.getByText("suspenso")).toBeInTheDocument();
      expect(screen.getByText("Motivo da supensão")).toBeInTheDocument();
      expect(screen.getByText("rer")).toBeInTheDocument();
      expect(screen.getAllByText("Data")).toHaveLength(2);
      expect(screen.getByText("07/02/2024")).toBeInTheDocument();
    });
  });

  describe("Renderização condicional - Reclamação", () => {
    it("não renderiza InformacaoDeReclamante quando reclamacao não é fornecida", () => {
      render(<DetalheDoProduto produto={mockProduto} />);
      preview.debug();
      expect(
        screen.queryByTestId("informacao-reclamante"),
      ).not.toBeInTheDocument();
    });

    it("renderiza InformacaoDeReclamante quando reclamacao é fornecida", () => {
      render(
        <DetalheDoProduto
          produto={mockProduto}
          reclamacao={mockReclamacao}
          questionamento={mockQuestionamento}
        />,
      );
      preview.debug();
      const infoReclamante = screen.getByTestId("informacao-reclamante");
      expect(infoReclamante).toBeInTheDocument();
      expect(infoReclamante).toHaveTextContent("com titulo");
    });
  });
});
