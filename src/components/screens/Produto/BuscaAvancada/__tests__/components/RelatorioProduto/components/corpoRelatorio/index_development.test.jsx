import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { getRelatorioProduto } from "src/services/relatorios";
import CorpoRelatorioDesenvolvimento from "../../../../../components/RelatorioProduto/components/corpoRelatorio/index_development";

const mockFluxoDeStatus = jest.fn();

jest.mock("src/services/relatorios", () => ({
  getRelatorioProduto: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  truncarString: jest.fn((texto) => texto),
}));

jest.mock("src/components/Shareable/FluxoDeStatus", () => ({
  FluxoDeStatus: (props) => {
    mockFluxoDeStatus(props);

    return <div data-testid="fluxo-de-status" />;
  },
}));

jest.mock("src/components/Shareable/FluxoDeStatus/helper", () => ({
  fluxoPartindoTerceirizada: [
    {
      titulo: "Produto cadastrado",
    },
  ],
}));

jest.mock("src/components/Shareable/Botao", () => {
  return function Botao({ texto, onClick }) {
    return (
      <button type="button" onClick={onClick}>
        {texto || "Imprimir"}
      </button>
    );
  };
});

jest.mock("antd", () => ({
  Modal: ({ visible, title, children, onOk, onCancel }) =>
    visible ? (
      <div role="dialog" aria-label={title}>
        {children}

        <button type="button" onClick={onOk}>
          Confirmar modal
        </button>

        <button type="button" onClick={onCancel}>
          Cancelar modal
        </button>
      </div>
    ) : null,
}));

const uuidNutrienteMock = "00000000-0000-4000-8000-000000000001";

const informacoesNutricionaisMock = [
  {
    nome: "Macronutrientes",
    ativo: true,
    informacoes_nutricionais: [
      {
        uuid: uuidNutrienteMock,
        nome: "Proteínas",
        medida: "g",
      },
    ],
  },
  {
    nome: "Vitaminas",
    ativo: true,
    informacoes_nutricionais: [
      {
        uuid: "00000000-0000-4000-8000-000000000002",
        nome: "Vitamina C",
        medida: "mg",
      },
    ],
  },
];

const historicoMock = {
  logs: [],
};

const criarProdutoMock = () => ({
  nome: "Produto Teste",
  marca: {
    nome: "Marca Teste",
  },
  fabricante: {
    nome: "Fabricante Teste",
  },
  eh_para_alunos_com_dieta: false,
  componentes: "Arroz, feijão e legumes",
  tem_aditivos_alergenicos: false,
  aditivos: "",
  porcao: "100 g",
  unidade_caseira: "1 unidade",
  tipo: "Congelado",
  embalagem: "Pacote plástico",
  prazo_validade: "12 meses",
  informacoes_nutricionais: [
    {
      informacao_nutricional: {
        uuid: uuidNutrienteMock,
      },
      quantidade_porcao: "10",
      valor_diario: "20",
    },
  ],
  especificacoes: [
    {
      volume: "1",
      unidade_de_medida: {
        nome: "Quilograma",
      },
      embalagem_produto: {
        nome: "Caixa",
      },
    },
  ],
  info_armazenamento: "Manter congelado",
  outras_informacoes: "Sem informações adicionais",
  numero_registro: "REG-001",
  imagens: [
    {
      arquivo: "https://exemplo.com/produto.pdf",
    },
  ],
  todos_logs: [
    {
      ativo: false,
      status_evento_explicacao: "Produto cadastrado",
      criado_em: "01/07/2026 10:30",
      justificativa: "<p>Cadastro realizado</p>",
      usuario: {
        nome: "João Silva",
        tipo_usuario: "terceirizada",
        registro_funcional: "1234567",
      },
    },
  ],
  ultima_homologacao: {
    data_cadastro: "01/07/2026",
    rastro_terceirizada: {
      nome_fantasia: "Empresa Teste",
      contatos: [
        {
          telefone: "(11) 99999-9999",
          email: "empresa@teste.com",
        },
      ],
    },
  },
});

describe("CorpoRelatorioDesenvolvimento", () => {
  let produtoMock;

  const renderizarComponente = () =>
    render(
      <CorpoRelatorioDesenvolvimento
        produto={produtoMock}
        historico={historicoMock}
        informacoesNutricionais={informacoesNutricionaisMock}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    produtoMock = criarProdutoMock();
  });

  it("solicita a geração do relatório ao clicar no botão de impressão", () => {
    renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Imprimir",
      }),
    );

    expect(getRelatorioProduto).toHaveBeenCalledTimes(1);
    expect(getRelatorioProduto).toHaveBeenCalledWith(produtoMock);
  });

  it("abre e fecha o modal de histórico pelas ações de confirmação e cancelamento", () => {
    renderizarComponente();

    expect(
      screen.queryByRole("dialog", {
        name: "Histórico",
      }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Histórico",
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: "Histórico",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirmar modal",
      }),
    );

    expect(
      screen.queryByRole("dialog", {
        name: "Histórico",
      }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Histórico",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancelar modal",
      }),
    );

    expect(
      screen.queryByRole("dialog", {
        name: "Histórico",
      }),
    ).not.toBeInTheDocument();
  });

  it("alterna a exibição das informações nutricionais", () => {
    renderizarComponente();

    expect(screen.getByText("Proteínas")).toBeInTheDocument();
    expect(screen.getByText("10 g")).toBeInTheDocument();
    expect(screen.getByText("20 %")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Macronutrientes"));

    expect(screen.queryByText("Proteínas")).not.toBeInTheDocument();
    expect(screen.queryByText("10 g")).not.toBeInTheDocument();
    expect(screen.queryByText("20 %")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Macronutrientes"));

    expect(screen.getByText("Proteínas")).toBeInTheDocument();
    expect(screen.getByText("10 g")).toBeInTheDocument();
    expect(screen.getByText("20 %")).toBeInTheDocument();
  });

  it("seleciona e desmarca um log no histórico", () => {
    renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Histórico",
      }),
    );

    expect(screen.getByText("JS")).toBeInTheDocument();
    expect(screen.getByText("TERCEIRIZADA")).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("Produto cadastrado"));

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("RF: 1234567")).toBeInTheDocument();
    expect(screen.getByText("Justificativa:")).toBeInTheDocument();
    expect(screen.getByText("Cadastro realizado")).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("Produto cadastrado"));

    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
    expect(screen.queryByText("RF: 1234567")).not.toBeInTheDocument();
    expect(screen.queryByText("Justificativa:")).not.toBeInTheDocument();
  });
});
