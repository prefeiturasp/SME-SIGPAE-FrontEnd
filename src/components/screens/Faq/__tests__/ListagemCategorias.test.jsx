import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import ListagemCategorias from "../CadastroCategoria/Listagem";
import {
  buscarCategoriasFaq,
  excluirCategoriaFaq,
} from "src/services/faq.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("src/services/faq.service", () => ({
  buscarCategoriasFaq: jest.fn(),
  excluirCategoriaFaq: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/components/Shareable/Page/PageNoSidebar", () => ({
  __esModule: true,
  default: ({ children, breadcrumb }) => (
    <div>
      {breadcrumb}
      {children}
    </div>
  ),
}));

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: () => <div>Breadcrumb</div>,
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick }) => (
    <button type="button" onClick={onClick}>
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/SigpaeLogoLoader", () => ({
  SigpaeLogoLoader: () => <div>Carregando...</div>,
}));

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: ({ current, onChange }) => (
    <div>
      <span>Página {current}</span>

      <button type="button" onClick={() => onChange(2)}>
        Próxima página
      </button>
    </div>
  ),
}));

jest.mock("src/components/Shareable/ModalGenerico", () => ({
  __esModule: true,
  default: ({ show, titulo, texto, handleClose, handleSim, loading }) => {
    if (!show) {
      return null;
    }

    return (
      <div>
        <h2>{titulo}</h2>

        <div>{texto}</div>

        <button type="button" onClick={handleClose}>
          Não
        </button>

        <button type="button" onClick={handleSim} data-loading={loading}>
          Sim
        </button>
      </div>
    );
  },
}));

const mockNavigate = jest.fn();

const categorias = [
  {
    uuid: "11111111-1111-1111-1111-111111111111",
    nome: "Dieta Especial",
  },
  {
    uuid: "22222222-2222-2222-2222-222222222222",
    nome: "Gestão de Produto",
  },
];

const respostaCategorias = {
  data: {
    count: 2,
    results: categorias,
  },
};

describe("Página de listagem de categorias", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);
    buscarCategoriasFaq.mockResolvedValue(respostaCategorias);
  });

  it("deve acessar a edição da categoria selecionada", async () => {
    render(<ListagemCategorias />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Editar categoria Dieta Especial",
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/ajuda/cadastro-categoria/11111111-1111-1111-1111-111111111111/editar",
    );
  });

  it("deve cancelar a exclusão da categoria", async () => {
    render(<ListagemCategorias />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir categoria Dieta Especial",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Não",
      }),
    );

    expect(screen.queryByText("Excluir Categoria")).not.toBeInTheDocument();

    expect(excluirCategoriaFaq).not.toHaveBeenCalled();

    expect(screen.getByText("Dieta Especial")).toBeInTheDocument();
  });

  it("deve excluir a categoria e atualizar a listagem", async () => {
    buscarCategoriasFaq
      .mockResolvedValueOnce(respostaCategorias)
      .mockResolvedValueOnce({
        data: {
          count: 1,
          results: [categorias[1]],
        },
      });

    excluirCategoriaFaq.mockResolvedValue({
      status: 204,
    });

    render(<ListagemCategorias />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir categoria Dieta Especial",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sim",
      }),
    );

    await waitFor(() => {
      expect(excluirCategoriaFaq).toHaveBeenCalledWith(
        "11111111-1111-1111-1111-111111111111",
      );
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      "Categoria Excluída com Sucesso!",
    );

    await waitFor(() => {
      expect(screen.queryByText("Dieta Especial")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Gestão de Produto")).toBeInTheDocument();

    expect(buscarCategoriasFaq).toHaveBeenCalledTimes(2);
  });

  it("deve exibir mensagem de erro quando ocorrer erro na exclusão", async () => {
    excluirCategoriaFaq.mockRejectedValue(
      new Error("Erro ao excluir categoria"),
    );

    render(<ListagemCategorias />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir categoria Dieta Especial",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sim",
      }),
    );

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Houve um erro ao excluir a categoria",
      );
    });

    expect(toastSuccess).not.toHaveBeenCalled();
  });

  it("deve buscar a página selecionada na paginação", async () => {
    buscarCategoriasFaq.mockResolvedValue({
      data: {
        count: 11,
        results: categorias,
      },
    });

    render(<ListagemCategorias />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Próxima página",
      }),
    );

    await waitFor(() => {
      expect(buscarCategoriasFaq).toHaveBeenLastCalledWith({
        page: 2,
        page_size: 10,
      });
    });
  });

  it("deve voltar para a página anterior ao excluir a única categoria da página atual", async () => {
    const categoriaUltimaPagina = {
      uuid: "33333333-3333-3333-3333-333333333333",
      nome: "Medição",
    };

    buscarCategoriasFaq
      .mockResolvedValueOnce({
        data: {
          count: 11,
          results: categorias,
        },
      })
      .mockResolvedValueOnce({
        data: {
          count: 11,
          results: [categoriaUltimaPagina],
        },
      })
      .mockResolvedValueOnce({
        data: {
          count: 10,
          results: categorias,
        },
      });

    excluirCategoriaFaq.mockResolvedValue({
      status: 204,
    });

    render(<ListagemCategorias />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Próxima página",
      }),
    );

    await waitFor(() => {
      expect(buscarCategoriasFaq).toHaveBeenLastCalledWith({
        page: 2,
        page_size: 10,
      });
    });

    expect(await screen.findByText("Medição")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Excluir categoria Medição",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sim",
      }),
    );

    await waitFor(() => {
      expect(excluirCategoriaFaq).toHaveBeenCalledWith(
        "33333333-3333-3333-3333-333333333333",
      );
    });

    await waitFor(() => {
      expect(buscarCategoriasFaq).toHaveBeenLastCalledWith({
        page: 1,
        page_size: 10,
      });
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      "Categoria Excluída com Sucesso!",
    );

    expect(buscarCategoriasFaq).toHaveBeenCalledTimes(3);
  });

  it("não deve executar nova exclusão enquanto uma exclusão estiver em andamento", async () => {
    let resolverExclusao;

    excluirCategoriaFaq.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolverExclusao = resolve;
        }),
    );

    render(<ListagemCategorias />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir categoria Dieta Especial",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sim",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Sim",
        }),
      ).toHaveAttribute("data-loading", "true");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sim",
      }),
    );

    expect(excluirCategoriaFaq).toHaveBeenCalledTimes(1);

    resolverExclusao({
      status: 204,
    });

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith(
        "Categoria Excluída com Sucesso!",
      );
    });

    expect(excluirCategoriaFaq).toHaveBeenCalledTimes(1);
  });
});
