import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ListagemLayouts from "src/components/screens/PreRecebimento/LayoutEmbalagem/components/Listagem";

jest.mock("src/helpers/utilities.jsx", () => ({
  truncarString: (str, num) => {
    if (!str) return "";
    return str.length > num ? str.slice(0, num) + "..." : str;
  },
}));

const mockObjetos = [
  {
    uuid: "0126ef35-3cab-4335-a430-d47693d1e955",
    numero_ficha_tecnica: "FT-001",
    nome_produto: "Produto Muito Longo Para Testar Truncate",
    pregao_chamada_publica: "01/2024",
    status: "Enviado para Análise",
    criado_em: "2024-01-01T10:00:00",
    programa: "LEVE_LEITE",
  },
  {
    uuid: "07d22068-d0a7-4a4a-bce2-2ca990c70d2d",
    numero_ficha_tecnica: "FT-002",
    nome_produto: "Produto 2",
    pregao_chamada_publica: "02/2024",
    status: "Solicitado Correção",
    criado_em: "2024-02-01T10:00:00",
    programa: "OUTRO",
  },
  {
    uuid: "8e60b28c-6b0a-46f5-a3f9-9c5a8b79279b",
    numero_ficha_tecnica: "FT-003",
    nome_produto: "Produto 3",
    pregao_chamada_publica: "03/2024",
    status: "Aprovado",
    criado_em: "2024-03-01T10:00:00",
    programa: "OUTRO",
  },
];

describe("Componente Listagem Layouts de Embalagens", () => {
  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <ListagemLayouts objetos={mockObjetos} {...props} />
      </BrowserRouter>,
    );
  };

  it("deve renderizar o cabeçalho e os títulos da tabela corretamente", () => {
    renderComponent();
    expect(
      screen.getByText("Layouts de Embalagens Cadastrados"),
    ).toBeInTheDocument();
    expect(screen.getByText("Nº da Ficha Técnica")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  it("deve renderizar a TagLeveLeite apenas para o programa LEVE_LEITE", () => {
    renderComponent();
    expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
  });

  it("deve truncar o nome do produto e mostrar tooltip", () => {
    renderComponent();
    expect(
      screen.getByText(/Produto Muito Longo Para Testa.../i),
    ).toBeInTheDocument();
  });

  it("deve renderizar o botão 'Detalhar' (olho verde) quando status é 'Enviado para Análise'", () => {
    renderComponent();
    const link = screen.getByTitle("Detalhar").closest("a");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("uuid=0126ef35-3cab-4335-a430-d47693d1e955"),
    );
    expect(screen.getByText("Enviado para Análise")).toBeInTheDocument();
  });

  it("deve renderizar o botão 'Corrigir' (edit laranja) quando status é 'Solicitado Correção'", () => {
    renderComponent();
    const link = screen.getByTitle("Corrigir").closest("a");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("uuid=07d22068-d0a7-4a4a-bce2-2ca990c70d2d"),
    );
  });

  it("deve mostrar 'Pendente de Correção' em laranja se perfilFornecedor for true e status 'Solicitado Correção'", () => {
    renderComponent({ perfilFornecedor: true });
    expect(screen.getByText("Pendente de Correção")).toBeInTheDocument();
    expect(screen.getByText("Pendente de Correção")).toHaveClass("orange");
  });

  it("deve renderizar o botão 'Atualizar Layout' quando status é 'Aprovado'", () => {
    renderComponent();
    const link = screen.getByTitle("Atualizar Layout").closest("a");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("uuid=8e60b28c-6b0a-46f5-a3f9-9c5a8b79279b"),
    );
  });

  it("deve formatar a data de cadastro corretamente (slice 0, 10)", () => {
    renderComponent();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
    expect(screen.getByText("2024-02-01")).toBeInTheDocument();
  });
});
