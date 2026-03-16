import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as utilities from "src/helpers/utilities";
import * as produtoService from "src/services/produto.service";
import ProdutosLogistica from "../index";

jest.mock("src/services/produto.service");
jest.mock("src/helpers/utilities");

const mockResultados = [
  { uuid: "1", nome: "Produto A" },
  { uuid: "2", nome: "Produto B" },
];

const mockNomes = [{ uuid: "1", nome: "Produto A" }];

describe("ProdutosLogistica", () => {
  const mockGetListaProdutos = produtoService.getListaProdutosLogistica;
  const mockGetNomesProdutos = produtoService.getNomesProdutosLogistica;
  const mockGerarParametros = utilities.gerarParametrosConsulta;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGerarParametros.mockImplementation((p) => p);
    mockGetNomesProdutos.mockResolvedValue({ data: { results: mockNomes } });
    mockGetListaProdutos.mockResolvedValue({
      data: {
        results: mockResultados,
        count: 25,
      },
    });
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ProdutosLogistica />
        </MemoryRouter>,
      );
    });
  };

  const aplicarFiltros = async () => {
    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-filtrar"));
    });
  };

  it("deve renderizar o componente corretamente", async () => {
    await renderComponent();
    expect(screen.getByTestId("botao-filtrar")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar Produto")).toBeInTheDocument();
  });

  it("deve carregar os nomes dos produtos ao montar o componente", async () => {
    await renderComponent();
    expect(mockGetNomesProdutos).toHaveBeenCalledTimes(1);
  });

  it("não deve exibir tabela e paginação antes de aplicar filtros", async () => {
    await renderComponent();
    expect(screen.queryByText("Produto A")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum resultado encontrado"),
    ).not.toBeInTheDocument();
  });

  it("deve buscar produtos ao clicar em Filtrar", async () => {
    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(mockGetListaProdutos).toHaveBeenCalledTimes(1);
    });
    expect(mockGerarParametros).toHaveBeenCalledWith({ page: 1 });
  });

  it("deve exibir os produtos na tabela após filtrar", async () => {
    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(screen.getByText("Produto A")).toBeInTheDocument();
      expect(screen.getByText("Produto B")).toBeInTheDocument();
    });
  });

  it("deve exibir a paginação após filtrar", async () => {
    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  it("deve navegar para próxima página ao clicar na paginação", async () => {
    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /right/i }),
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /right/i }));
    });

    await waitFor(() => {
      expect(mockGetListaProdutos).toHaveBeenCalledTimes(2);
    });
    expect(mockGerarParametros).toHaveBeenLastCalledWith({ page: 2 });
  });

  it("deve exibir mensagem de nenhum resultado quando total for zero", async () => {
    mockGetListaProdutos.mockResolvedValue({
      data: { results: [], count: 0 },
    });

    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum resultado encontrado"),
      ).toBeInTheDocument();
    });
  });

  it("deve limpar os resultados ao clicar em Limpar Filtros", async () => {
    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(screen.getByText("Produto A")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Limpar Filtros"));
    });

    await waitFor(() => {
      expect(screen.queryByText("Produto A")).not.toBeInTheDocument();
    });
  });
});
