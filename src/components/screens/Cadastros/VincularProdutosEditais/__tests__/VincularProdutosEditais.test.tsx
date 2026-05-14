import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import VincularProdutosEditais from "src/components/screens/Cadastros/VincularProdutosEditais";
import mock from "src/services/_mock";

import {
  filtrarPorEditalNomeTipo,
  filtrosVincularProdutoEdital,
} from "src/services/produto.service";

jest.mock("src/services/produto.service", () => ({
  filtrosVincularProdutoEdital: jest.fn(),
  filtrarPorEditalNomeTipo: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock(
  "src/components/screens/Cadastros/VincularProdutosEditais/componentes/ModalVincularProdutosEditais",
  () => () => null,
);

jest.mock(
  "src/components/screens/Cadastros/VincularProdutosEditais/componentes/ModalAtivarInativar",
  () => () => null,
);

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: ({ onChange }) => (
    <button type="button" onClick={() => onChange(2)}>
      mock-paginacao
    </button>
  ),
}));

const mockFiltros = {
  status: 200,
  data: {
    produtos: [{ produto__nome: "Produto A" }, { produto__nome: "Produto B" }],
    editais: [{ numero: "Edital 001" }, { numero: "Edital 002" }],
    editais_destino: [],
  },
};

const mockResultado = {
  status: 200,
  data: {
    results: [
      {
        uuid: "item-uuid-001",
        produto: { nome: "Produto A" },
        marca: { nome: "Marca X" },
        tipo_produto: "Comum",
        edital: { numero: "Edital 001" },
        ativo: true,
        outras_informacoes: "Nenhuma",
      },
    ],
    count: 1,
  },
};

function renderComponent() {
  return render(<VincularProdutosEditais />);
}

describe("VincularProdutosEditais", () => {
  beforeEach(() => {
    mock.reset();
    filtrosVincularProdutoEdital.mockReset();
    filtrarPorEditalNomeTipo.mockReset();
    filtrosVincularProdutoEdital.mockResolvedValue(mockFiltros);
  });

  afterEach(() => {
    cleanup();
  });

  it("deve chamar filtrosVincularProdutoEdital na montagem do componente", async () => {
    renderComponent();

    await waitFor(() => {
      expect(filtrosVincularProdutoEdital).toHaveBeenCalledTimes(1);
    });
  });

  it("deve exibir os campos de filtro após carregar", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar por Produto")).toBeInTheDocument();
      expect(screen.getByText("Filtrar por Edital")).toBeInTheDocument();
      expect(
        screen.getByText("Filtrar por Tipo de Produto"),
      ).toBeInTheDocument();
    });
  });

  it("deve exibir os botões Filtrar, Limpar e Selecionar Produtos", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
      expect(screen.getByText("Limpar")).toBeInTheDocument();
      expect(screen.getByText("Selecionar Produtos")).toBeInTheDocument();
    });
  });

  it("não deve exibir a tabela antes de filtrar", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    expect(
      screen.queryByText("Produtos vinculados aos editais:"),
    ).not.toBeInTheDocument();
  });

  it("deve exibir a tabela com resultados após filtrar", async () => {
    const user = userEvent.setup();
    filtrarPorEditalNomeTipo.mockResolvedValue(mockResultado);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Filtrar"));

    await waitFor(() => {
      expect(
        screen.getByText("Produtos vinculados aos editais:"),
      ).toBeInTheDocument();
      expect(screen.getByText("Produto A")).toBeInTheDocument();
      expect(screen.getByText("Marca X")).toBeInTheDocument();
      expect(screen.getByText("Edital 001")).toBeInTheDocument();
      expect(screen.getByText("Ativo")).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de lista vazia quando filtro não retornar resultados", async () => {
    const user = userEvent.setup();
    filtrarPorEditalNomeTipo.mockResolvedValue({
      status: 200,
      data: { results: [], count: 0 },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Filtrar"));

    await waitFor(() => {
      expect(
        screen.getByText("Não existem dados para filtragem informada."),
      ).toBeInTheDocument();
    });
  });

  it("deve limpar a tabela ao clicar em Limpar", async () => {
    const user = userEvent.setup();
    filtrarPorEditalNomeTipo.mockResolvedValue(mockResultado);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Filtrar"));

    await waitFor(() => {
      expect(screen.getByText("Produto A")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Limpar"));

    await waitFor(() => {
      expect(
        screen.queryByText("Produtos vinculados aos editais:"),
      ).not.toBeInTheDocument();
    });
  });

  it("deve exibir cabeçalhos corretos na tabela", async () => {
    const user = userEvent.setup();
    filtrarPorEditalNomeTipo.mockResolvedValue(mockResultado);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Filtrar"));

    await waitFor(() => {
      expect(screen.getByText("Produto")).toBeInTheDocument();
      expect(screen.getByText("Marca")).toBeInTheDocument();
      expect(screen.getByText("Tipo de produto")).toBeInTheDocument();
      expect(screen.getByText("Edital")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Ações")).toBeInTheDocument();
    });
  });

  it("deve exibir botão 'Inativar' para item ativo na tabela", async () => {
    const user = userEvent.setup();
    filtrarPorEditalNomeTipo.mockResolvedValue(mockResultado);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Filtrar"));

    await waitFor(() => {
      expect(screen.getByText("Inativar")).toBeInTheDocument();
    });
  });

  it("deve exibir botão 'Ativar' para item inativo na tabela", async () => {
    const user = userEvent.setup();
    filtrarPorEditalNomeTipo.mockResolvedValue({
      status: 200,
      data: {
        results: [
          {
            ...mockResultado.data.results[0],
            ativo: false,
          },
        ],
        count: 1,
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Filtrar"));

    await waitFor(() => {
      expect(screen.getByText("Ativar")).toBeInTheDocument();
      expect(screen.getByText("Inativo")).toBeInTheDocument();
    });
  });

  it("deve chamar filtrarPorEditalNomeTipo com page e page_size ao trocar de página", async () => {
    const user = userEvent.setup();

    filtrarPorEditalNomeTipo.mockResolvedValue({
      status: 200,
      data: {
        results: [mockResultado.data.results[0]],
        count: 25,
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Filtrar"));

    await waitFor(() => {
      expect(screen.getByText("Produto A")).toBeInTheDocument();
      expect(screen.getByText("mock-paginacao")).toBeInTheDocument();
    });

    await user.click(screen.getByText("mock-paginacao"));

    await waitFor(() => {
      expect(filtrarPorEditalNomeTipo).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 2,
          page_size: 10,
        }),
      );
    });
  });
});
