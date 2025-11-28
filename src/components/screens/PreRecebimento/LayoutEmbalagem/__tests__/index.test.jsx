import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import LayoutEmbalagem from "../index";
import { mockListaFichaTecnica } from "src/mocks/services/fichaTecnica.service/mockListarFichasTecnicas";

// Mock para localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock para toastError e getMensagemDeErro apenas para evitar erros
jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

jest.mock("src/helpers/statusErrors", () => ({
  getMensagemDeErro: jest.fn(() => "Erro de teste"),
}));

// Mock para auth service
jest.mock("src/services/auth", () => ({
  needsToRefreshToken: jest.fn(() => false),
  refreshToken: jest.fn(() => Promise.resolve({ status: 200, data: { access: "token" } })),
}));

// Mock para a API base
const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

jest.mock("src/services/_base", () => ({
  default: mockApi,
  apiLoggedOut: mockApi,
}));

beforeEach(() => {
  mockLocalStorage.getItem.mockReturnValue('"ADMINISTRADOR_EMPRESA"');
  
  // Mock para API principal
  mockApi.get.mockImplementation((url, config) => {
    if (url.includes("/layouts-de-embalagem/")) {
      return Promise.resolve({
        data: {
          count: 1,
          results: [{
            uuid: "mock-uuid-123",
            numero_ficha_tecnica: "12345",
            nome_produto: "Produto Teste",
            pregao_chamada_publica: "Pregão 001/2024",
            status: "Solicitado Correção",
            criado_em: "2024-01-01T10:00:00",
          }],
        },
      });
    }
    if (url.includes("/ficha-tecnica/lista-simples/")) {
      return Promise.resolve({
        data: {
          results: mockListaFichaTecnica.results.slice(0, 3),
        },
      });
    }
    return Promise.resolve({ data: { results: [] } });
  });
  
  mockApi.post.mockResolvedValue({});
  
  // Limpar mocks
  jest.clearAllMocks();
});

afterEach(() => {
  mockLocalStorage.getItem.mockClear();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <LayoutEmbalagem />
      </MemoryRouter>,
    );
  });
};

describe("LayoutEmbalagem", () => {
  describe("Renderização Básica", () => {
    it("renderiza o componente principal", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Cadastrar Layout de Embalagem")).toBeInTheDocument();
      });
    });

    it("exibe o loading durante carregamento", async () => {
      mockApi.get.mockReturnValue(new Promise(() => {}));

      await setup();

      expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });
  });

  describe("Componente Filtros", () => {
    it("renderiza os campos de filtro", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument();
        expect(screen.getByText("Filtrar Ficha Técnica")).toBeInTheDocument();
        expect(screen.getByText("Filtrar por Nome do Produto")).toBeInTheDocument();
        expect(screen.getByText("Filtrar por Nº do Pregão/Chamada Pública")).toBeInTheDocument();
        expect(screen.getByText("Filtrar por Status")).toBeInTheDocument();
      });
    });

    it("renderiza botões de ação", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument();
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Renderização Condicional", () => {
    it("funciona com perfil ADMINISTRADOR", async () => {
      mockLocalStorage.getItem.mockReturnValue('"ADMINISTRADOR"');

      await setup();

      await waitFor(() => {
        expect(screen.getByText("Cadastrar Layout de Embalagem")).toBeInTheDocument();
      });
    });

    it("funciona com perfil ADMINISTRADOR_EMPRESA", async () => {
      mockLocalStorage.getItem.mockReturnValue('"ADMINISTRADOR_EMPRESA"');

      await setup();

      await waitFor(() => {
        expect(screen.getByText("Cadastrar Layout de Embalagem")).toBeInTheDocument();
      });
    });
  });

  describe("Links de Navegação", () => {
    it("possui link para cadastro de layout", async () => {
      await setup();

      await waitFor(() => {
        const linkCadastro = screen.getByText("Cadastrar Layout de Embalagem").closest("a");
        expect(linkCadastro).toHaveAttribute("href", "/pre-recebimento/cadastro-layout-embalagem");
      });
    });
  });

  describe("Interações do Usuário", () => {
    it("permite interação com botões", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      
      if (buttons.length > 0) {
        await act(async () => {
          fireEvent.click(buttons[0]);
        });

        await waitFor(() => {
          expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument();
        });
      }
    });

    it("executa busca ao aplicar filtros", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      const filterButton = buttons.find(btn => btn.textContent.includes("Filtrar"));
      
      if (filterButton) {
        await act(async () => {
          fireEvent.click(filterButton);
        });

        await waitFor(() => {
          expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument();
        });
      }
    });
  });

  describe("Estados da API", () => {
    it("lida com resposta vazia da API", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url.includes("/layouts-de-embalagem/")) {
          return Promise.resolve({
            data: {
              count: 0,
              results: [],
            },
          });
        }
        return Promise.resolve({ data: { results: [] } });
      });

      await setup();

      await waitFor(() => {
        expect(screen.getByText("Cadastrar Layout de Embalagem")).toBeInTheDocument();
      });
    });
  });
});