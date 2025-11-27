import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DetalheDoProduto from "../../DetalheDoProduto/index";
import { mockHomologacao } from "src/mocks/Produto/Homologacao/mockHomologacao";
import { formataInformacoesNutricionais } from "src/components/screens/Produto/Homologacao/helper";

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

jest.mock("src/components/screens/Produto/Homologacao/helper", () => ({
  formataInformacoesNutricionais: jest.fn(),
}));

describe("DetalheDoProduto Component", () => {
  const mockProduto = mockHomologacao.produto;
  const mockReclamacao = mockProduto.ultima_homologacao.reclamacoes[0];
  const mockQuestionamento = mockProduto.ultima_homologacao.logs[0];

  const mockInfoNutricionais = [
    {
      nome: "Informações Básicas",
      valores: [
        {
          nome: "Calorias",
          quantidade_porcao: "100",
          medida: "kcal",
          valor_diario: "5",
        },
      ],
    },
  ];

  beforeEach(() => {
    formataInformacoesNutricionais.mockReturnValue(mockInfoNutricionais);
  });

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
      expect(
        screen.queryByTestId("informacao-reclamante"),
      ).not.toBeInTheDocument();
      expect(screen.queryAllByText(/^Nome do Reclamante$/)).toHaveLength(0);
    });

    it("renderiza InformacaoDeReclamante quando reclamacao é fornecida", () => {
      render(
        <DetalheDoProduto
          produto={mockProduto}
          reclamacao={mockReclamacao}
          questionamento={mockQuestionamento}
        />,
      );

      expect(screen.queryByTestId("informacao-reclamante")).toBeInTheDocument();

      expect(screen.getByText("Informação de reclamante")).toBeInTheDocument();
      expect(screen.getByText("Nome da Escola")).toBeInTheDocument();
      expect(
        screen.getByText("EMEF PERICLES EUGENIO DA SILVA RAMOS"),
      ).toBeInTheDocument();
      expect(screen.getByText("Código EOL")).toBeInTheDocument();
      expect(screen.getByText("XXXX")).toBeInTheDocument();
      expect(screen.getByText("Nome do Reclamante")).toBeInTheDocument();
      expect(screen.getByText("SUPER USUARIO ESCOLA EMEF")).toBeInTheDocument();
      expect(screen.getByText("RF/CRN/CFN")).toBeInTheDocument();
      expect(screen.getByText("8115257")).toBeInTheDocument();
      expect(screen.getByText("Cargo")).toBeInTheDocument();
      expect(
        screen.getByText("ANALISTA DE SAUDE NIVEL II"),
      ).toBeInTheDocument();
    });
  });

  describe("Editais vinculados", () => {
    it("renderiza editais não suspensos por padrão", () => {
      render(<DetalheDoProduto produto={mockProduto} />);
      expect(
        screen.queryAllByText(/^Produto Suspenso nos Editais$/),
      ).toHaveLength(0);
      expect(
        screen.getByText("Editais Vinculados ao Produto"),
      ).toBeInTheDocument();
      expect(screen.queryByText("78/SME/2016")).toBeInTheDocument();
    });

    it("renderiza editais suspensos quando status é suspenso", () => {
      render(<DetalheDoProduto produto={mockProduto} status="suspenso" />);
      expect(
        screen.getByText("Produto Suspenso nos Editais"),
      ).toBeInTheDocument();
      expect(
        screen.queryAllByText(/^Editais Vinculados ao Produto$/),
      ).toHaveLength(0);
      expect(screen.queryByText("78/SME/2016")).not.toBeInTheDocument();
    });

    it("renderiza editais suspensos quando prop suspenso é true", () => {
      render(<DetalheDoProduto produto={mockProduto} suspenso={true} />);

      expect(
        screen.getByText("Produto Suspenso nos Editais"),
      ).toBeInTheDocument();
      expect(
        screen.queryAllByText(/^Editais Vinculados ao Produto$/),
      ).toHaveLength(0);
      expect(screen.queryByText("78/SME/2016")).not.toBeInTheDocument();
    });
  });

  describe("Informações do produto", () => {
    it("renderiza informações básicas", () => {
      render(<DetalheDoProduto produto={mockProduto} />);
      expect(screen.getByText("Identificação do Produto")).toBeInTheDocument();
      expect(
        screen.getByText(
          "O produto se destina a alimentação de alunos com dieta especial?",
        ),
      ).toBeInTheDocument();
      expect(screen.getAllByText("Marca")).toHaveLength(2);
      expect(screen.getAllByText("ITALAC")).toHaveLength(2);
      expect(screen.getAllByText("Fabricante")).toHaveLength(2);
      expect(screen.getAllByText("NUTRI BRASIL SA")).toHaveLength(2);
      expect(screen.getByText("Componentes do produto")).toBeInTheDocument();
      expect(screen.getByText("WEFCSACSACSA")).toBeInTheDocument();
      expect(
        screen.getByText(
          "O produto contém ou pode conter ingredientes/aditivos alergênicos?",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Relacioná-los conforme dispõe a RDC nº 26 de 02/07/15",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("O produto contém glúten?")).toBeInTheDocument();
      expect(screen.getAllByText("NÃO")).toHaveLength(3);
    });

    it('renderiza "SIM" para alunos com dieta especial', () => {
      const produtoComDieta = {
        ...mockProduto,
        eh_para_alunos_com_dieta: true,
      };
      render(<DetalheDoProduto produto={produtoComDieta} />);
      expect(screen.getByTestId("produto-dieta-especial")).toHaveTextContent(
        "SIM",
      );
    });

    it('renderiza "SIM" para aditivos alergênicos', () => {
      const produtoComAditivos = {
        ...mockProduto,
        tem_aditivos_alergenicos: true,
        aditivos: "Glúten, Lactose",
      };
      render(<DetalheDoProduto produto={produtoComAditivos} />);
      expect(screen.getByTestId("produto-com-aditivos")).toHaveTextContent(
        "SIM",
      );
      expect(screen.getByText("Quais Alergênicos?")).toBeInTheDocument();
      expect(screen.getByText("Glúten, Lactose")).toBeInTheDocument();
    });

    it('renderiza "SIM" para glúten', () => {
      const produtoComGluten = {
        ...mockProduto,
        tem_gluten: true,
      };
      render(<DetalheDoProduto produto={produtoComGluten} />);
      expect(screen.getByTestId("produto-com-gluten")).toHaveTextContent("SIM");
    });

    it("produto sem fabricante", () => {
      const produtoSemFabricante = {
        ...mockProduto,
        fabricante: "",
      };

      render(<DetalheDoProduto produto={produtoSemFabricante} />);
      expect(screen.getByTestId("produto-fabricante")).toHaveTextContent(
        "Não possui fabricante",
      );
    });

    it("produto sem marca", () => {
      const produtoSemMarca = {
        ...mockProduto,
        marca: "",
      };

      render(<DetalheDoProduto produto={produtoSemMarca} />);
      expect(screen.getByTestId("produto-marca")).toHaveTextContent(
        "Não possui marca",
      );
    });

    it("produto sem componetes", () => {
      const produtoSemComponentes = {
        ...mockProduto,
        componentes: "",
      };

      render(<DetalheDoProduto produto={produtoSemComponentes} />);
      expect(screen.getByTestId("produto-componentes")).toHaveTextContent(
        "Não possui componentes",
      );
    });
  });

  describe("Informações nutricionais", () => {
    it("renderiza informações nutricionais formatadas", () => {
      render(<DetalheDoProduto produto={mockProduto} />);
      expect(formataInformacoesNutricionais).toHaveBeenCalledWith(mockProduto);
      expect(screen.getByText("Informações nutricionais")).toBeInTheDocument();
      expect(screen.getByText("Porção")).toBeInTheDocument();
      expect(screen.getByText("Unidade Caseira")).toBeInTheDocument();
    });

    it("renderiza toggle para expandir informações nutricionais", () => {
      render(<DetalheDoProduto produto={mockProduto} />);

      const toggles = screen.getAllByTestId("toggle-expandir");
      expect(toggles).toHaveLength(mockInfoNutricionais.length);
    });

    it("expande e recolhe informações nutricionais ao clicar no toggle", () => {
      render(<DetalheDoProduto produto={mockProduto} />);

      const toggle = screen.getAllByTestId("toggle-expandir")[0];
      expect(screen.queryByText("Calorias")).not.toBeInTheDocument();

      fireEvent.click(toggle);
      expect(screen.getByText("Título")).toBeInTheDocument();
      expect(screen.getByText("Calorias")).toBeInTheDocument();
      expect(screen.getByText("Quantidade por porção")).toBeInTheDocument();
      expect(screen.getByText("100 kcal")).toBeInTheDocument();
      expect(screen.getByText("%VD(*)")).toBeInTheDocument();
      expect(screen.getByText("5 %")).toBeInTheDocument();
      fireEvent.click(toggle);
      expect(screen.queryByText("Calorias")).not.toBeInTheDocument();
    });

    it("produto sem informações nutricionais", () => {
      formataInformacoesNutricionais.mockReturnValue(null);
      render(<DetalheDoProduto produto={mockProduto} />);
      expect(screen.queryByTestId("toggle-expandir")).not.toBeInTheDocument();
    });
  });

  describe("Informações adicionais do produto", () => {
    it("renderiza informações", () => {
      render(<DetalheDoProduto produto={mockProduto} />);

      expect(
        screen.getByText("Informação do Produto (classificação)"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Nº de registro do produto de órgão competente"),
      ).toBeInTheDocument();
      expect(screen.getByText("numero registro teste")).toBeInTheDocument();
      expect(screen.getByText("Prazo de validade")).toBeInTheDocument();
      expect(screen.getByText("Classificação de Grãos")).toBeInTheDocument();
      expect(screen.getByText("Sem classificação")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Informações referentes ao volume e unidade de medida",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Condições de armazenamento, conservação e prazo máximo para consumo após abertura da embalagem",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Outras informações que empresa julgar necessário"),
      ).toBeInTheDocument();
      expect(screen.getByText("Sem mais informações")).toBeInTheDocument();
      expect(screen.getByText("Fotos do produto")).toBeInTheDocument();
      expect(screen.getByText("Volume")).toBeInTheDocument();
      expect(screen.getByText("Unidade de Medida")).toBeInTheDocument();
      expect(screen.getByText("CAIXA")).toBeInTheDocument();
      expect(screen.getByText("Embalagem")).toBeInTheDocument();
      expect(screen.getByText("BIG BAG")).toBeInTheDocument();
    });

    it("renderiza tabela de especificações quando não há embalagem", () => {
      render(<DetalheDoProduto produto={mockProduto} />);
      expect(screen.getByTestId("produto-tabela")).toBeInTheDocument();
      expect(
        screen.queryByTestId("produto-com-embalagem"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Volume")).toBeInTheDocument();
      expect(screen.getByText("Unidade de Medida")).toBeInTheDocument();
      expect(screen.getByText("CAIXA")).toBeInTheDocument();
      expect(screen.getByText("Embalagem")).toBeInTheDocument();
      expect(screen.getByText("BIG BAG")).toBeInTheDocument();
      expect(screen.queryAllByText(/^Embalagem primária$/)).toHaveLength(0);
    });

    it("renderiza embalagem quando disponível", () => {
      const produtoComEmbalagem = {
        ...mockProduto,
        embalagem: "Madeira",
      };

      render(<DetalheDoProduto produto={produtoComEmbalagem} />);
      expect(screen.getByTestId("produto-com-embalagem")).toBeInTheDocument();
      expect(screen.queryByTestId("produto-tabela")).not.toBeInTheDocument();
      expect(screen.getByText("Embalagem primária")).toBeInTheDocument();
      expect(screen.getByText("Madeira")).toBeInTheDocument();
      expect(screen.queryAllByText(/^Unidade de Medida$/)).toHaveLength(0);
    });
  });

  describe("Anexos", () => {
    it("renderiza links para as imagens do produto", () => {
      const produtoComImagens = {
        ...mockProduto,
        imagens: [
          { arquivo: "http://teste.com/imagem1.jpg" },
          { arquivo: "http://teste.com/imagem2.jpg" },
        ],
      };
      render(<DetalheDoProduto produto={produtoComImagens} />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);

      expect(links[0]).toHaveAttribute("href", "http://teste.com/imagem1.jpg");
      expect(links[0]).toHaveTextContent("Anexo 1");

      expect(links[1]).toHaveAttribute("href", "http://teste.com/imagem2.jpg");
      expect(links[1]).toHaveTextContent("Anexo 2");
    });

    it("abre links em nova aba", () => {
      const produtoComImagens = {
        ...mockProduto,
        imagens: [
          { arquivo: "http://teste.com/imagem1.jpg" },
          { arquivo: "http://teste.com/imagem2.jpg" },
        ],
      };
      render(<DetalheDoProduto produto={produtoComImagens} />);

      const link = screen.getAllByRole("link")[0];
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("produto sem imagens", () => {
    render(<DetalheDoProduto produto={mockProduto} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
