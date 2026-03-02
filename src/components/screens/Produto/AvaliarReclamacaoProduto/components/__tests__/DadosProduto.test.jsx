import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { DadosProduto } from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/DadosProduto";
import { formataInformacoesNutricionais } from "src/components/screens/Produto/Homologacao/helper";

jest.mock("src/components/screens/Produto/Homologacao/helper", () => ({
  formataInformacoesNutricionais: jest.fn(),
}));

jest.mock("react-collapse", () => ({
  Collapse: ({ isOpened, children }) =>
    isOpened ? <div data-testid="collapse-open">{children}</div> : null,
}));

jest.mock("src/components/Shareable/ToggleExpandir", () => ({
  ToggleExpandir: ({ onClick, ativo }) => (
    <button
      data-testid="toggle-expandir"
      data-ativo={String(ativo)}
      onClick={onClick}
    >
      Toggle
    </button>
  ),
}));

const mockProdutoCompleto = {
  eh_para_alunos_com_dieta: true,
  marca: { nome: "Marca Teste" },
  fabricante: { nome: "Fabricante Teste" },
  componentes: "Componente A",
  tem_aditivos_alergenicos: true,
  aditivos: "Glúten",
  porcao: "100g",
  unidade_caseira: "1 unidade",
  tipo: "Industrializado",
  embalagem: "Caixa",
  prazo_validade: "12 meses",
  info_armazenamento: "Local fresco",
  outras_informacoes: "Produto vegano",
  numero_registro: "REG-12345",
  imagens: [
    { arquivo: "http://img1.com/foto1.jpg" },
    { arquivo: "http://img2.com/foto2.jpg" },
  ],
};

const mockProdutoVazio = {
  eh_para_alunos_com_dieta: false,
  marca: null,
  fabricante: null,
  componentes: null,
  tem_aditivos_alergenicos: false,
  aditivos: null,
  porcao: "",
  unidade_caseira: "",
  tipo: null,
  embalagem: null,
  prazo_validade: null,
  info_armazenamento: null,
  outras_informacoes: null,
  numero_registro: null,
  imagens: [],
};

const mockInformacoesNutricionais = [
  {
    nome: "Grupo Vitaminas",
    active: false,
    valores: [
      {
        nome: "Vitamina C",
        quantidade_porcao: "50",
        medida: "mg",
        valor_diario: "100",
      },
      {
        nome: "Vitamina D",
        quantidade_porcao: "10",
        medida: "mcg",
        valor_diario: null,
      },
    ],
  },
];

const renderComponent = (produto = mockProdutoCompleto) =>
  render(<DadosProduto produto={produto} />);

describe("DadosProduto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    formataInformacoesNutricionais.mockReturnValue(mockInformacoesNutricionais);
  });

  it("deve chamar formataInformacoesNutricionais com o produto ao montar", () => {
    renderComponent();
    expect(formataInformacoesNutricionais).toHaveBeenCalledWith(
      expect.objectContaining({ marca: { nome: "Marca Teste" } }),
    );
  });

  it("deve exibir a seção 'Quais?' com aditivos quando tem_aditivos_alergenicos é true", () => {
    renderComponent();
    expect(screen.getByText("Quais?")).toBeInTheDocument();
    expect(screen.getByText("Glúten")).toBeInTheDocument();
  });

  it("deve exibir fallback de aditivos quando aditivos é nulo", () => {
    renderComponent({ ...mockProdutoCompleto, aditivos: null });
    expect(screen.getByText("Não possui aditivos")).toBeInTheDocument();
  });

  it("não deve exibir a seção 'Quais?' quando tem_aditivos_alergenicos é false", () => {
    renderComponent(mockProdutoVazio);
    expect(screen.queryByText("Quais?")).not.toBeInTheDocument();
  });

  it("deve exibir porção e unidade caseira", () => {
    renderComponent();
    expect(screen.getByText("100g")).toBeInTheDocument();
    expect(screen.getByText("1 unidade")).toBeInTheDocument();
  });

  it("deve exibir o nome do grupo e o ToggleExpandir", () => {
    renderComponent();
    expect(screen.getByText("Grupo Vitaminas")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-expandir")).toBeInTheDocument();
  });

  it("deve abrir o Collapse e exibir valores nutricionais ao clicar no toggle", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("toggle-expandir"));
    expect(screen.getByTestId("collapse-open")).toBeInTheDocument();
    expect(screen.getByText("Vitamina C")).toBeInTheDocument();
    expect(screen.getByText("100 %")).toBeInTheDocument();
  });

  it("não deve renderizar grupos nutricionais quando helper retorna null", () => {
    formataInformacoesNutricionais.mockReturnValue(null);
    renderComponent();
    expect(screen.queryByTestId("toggle-expandir")).not.toBeInTheDocument();
  });

  it("deve exibir todos os campos de classificação quando preenchidos", () => {
    renderComponent();
    expect(screen.getByText("Industrializado")).toBeInTheDocument();
    expect(screen.getByText("Caixa")).toBeInTheDocument();
    expect(screen.getByText("12 meses")).toBeInTheDocument();
    expect(screen.getByText("Local fresco")).toBeInTheDocument();
    expect(screen.getByText("Produto vegano")).toBeInTheDocument();
    expect(screen.getByText("REG-12345")).toBeInTheDocument();
  });

  it("deve exibir todos os fallbacks de classificação quando campos são nulos", () => {
    renderComponent(mockProdutoVazio);
    expect(screen.getByText("Sem tipo")).toBeInTheDocument();
    expect(screen.getByText("Sem embalagem")).toBeInTheDocument();
    expect(screen.getByText("Sem prazo validade")).toBeInTheDocument();
    expect(
      screen.getByText("Sem informações sobre armazenamento"),
    ).toBeInTheDocument();
    expect(screen.getByText("Sem mais informações")).toBeInTheDocument();
    expect(screen.getByText("Registro não encontrado")).toBeInTheDocument();
  });

  it("deve renderizar os links de anexo com href, target e rel corretos", () => {
    renderComponent();
    const link1 = screen.getByText("Anexo 1");
    const link2 = screen.getByText("Anexo 2");
    expect(link1).toHaveAttribute("href", "http://img1.com/foto1.jpg");
    expect(link1).toHaveAttribute("target", "_blank");
    expect(link1).toHaveAttribute("rel", "noopener noreferrer");
    expect(link2).toHaveAttribute("href", "http://img2.com/foto2.jpg");
  });

  it("não deve renderizar links quando imagens está vazio", () => {
    renderComponent(mockProdutoVazio);
    expect(screen.queryByText(/Anexo/)).not.toBeInTheDocument();
  });
});
