import { act, renderHook, waitFor } from "@testing-library/react";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { formatarParaMultiselect } from "src/helpers/utilities";
import { buscarOpcoesCategoriasFaq } from "src/services/faq.service";
import { getPerfilListagem } from "src/services/perfil.service";
import { useOpcoesCadastroDuvida } from "../DuvidasFrequentes/hooks/useOpcoesCadastroDuvida";

jest.mock("src/services/faq.service", () => ({
  buscarOpcoesCategoriasFaq: jest.fn(),
}));

jest.mock("src/services/perfil.service", () => ({
  getPerfilListagem: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  formatarParaMultiselect: jest.fn(),
}));

const UUID_CATEGORIA = "389e0274-9adf-45c6-bdb0-c249bfb08bfa";
const UUID_PERFIL = "d3de8a14-ac78-4ed4-a4bc-97b9266a8461";

describe("useOpcoesCadastroDuvida", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("carrega categorias e perfis de acesso", async () => {
    const categorias = [
      { uuid: UUID_CATEGORIA, nome: "Gestão de Alimentação" },
    ];
    const perfis = [{ uuid: UUID_PERFIL, nome: "Escola" }];
    const opcoesPerfis = [{ value: UUID_PERFIL, label: "Escola" }];

    buscarOpcoesCategoriasFaq.mockResolvedValue({ data: categorias });
    getPerfilListagem.mockResolvedValue({ data: { results: perfis } });
    formatarParaMultiselect.mockReturnValue(opcoesPerfis);

    const { result } = renderHook(() => useOpcoesCadastroDuvida());

    expect(result.current.carregandoCategorias).toBe(true);
    expect(result.current.carregandoPerfis).toBe(true);

    await waitFor(() => {
      expect(result.current.carregandoCategorias).toBe(false);
      expect(result.current.carregandoPerfis).toBe(false);
    });

    expect(result.current.categorias).toEqual(categorias);
    expect(result.current.opcoesPerfisAcesso).toEqual(opcoesPerfis);
    expect(formatarParaMultiselect).toHaveBeenCalledWith(perfis);
  });

  it("notifica falhas ao carregar categorias e perfis", async () => {
    buscarOpcoesCategoriasFaq.mockRejectedValue(new Error("Falha categorias"));
    getPerfilListagem.mockRejectedValue(new Error("Falha perfis"));

    const { result } = renderHook(() => useOpcoesCadastroDuvida());

    await waitFor(() => {
      expect(result.current.carregandoCategorias).toBe(false);
      expect(result.current.carregandoPerfis).toBe(false);
    });

    expect(toastError).toHaveBeenCalledWith(
      "Não foi possível carregar as categorias.",
    );
    expect(toastError).toHaveBeenCalledWith(
      "Não foi possível carregar os perfis de acesso.",
    );
  });

  it("ignora respostas concluídas depois da desmontagem", async () => {
    let resolverCategorias;
    let resolverPerfis;

    buscarOpcoesCategoriasFaq.mockReturnValue(
      new Promise((resolver) => {
        resolverCategorias = resolver;
      }),
    );
    getPerfilListagem.mockReturnValue(
      new Promise((resolver) => {
        resolverPerfis = resolver;
      }),
    );

    const { result, unmount } = renderHook(() => useOpcoesCadastroDuvida());
    const estadoInicial = result.current;

    unmount();

    await act(async () => {
      resolverCategorias({
        data: [{ uuid: UUID_CATEGORIA, nome: "Gestão de Alimentação" }],
      });
      resolverPerfis({
        data: { results: [{ uuid: UUID_PERFIL, nome: "Escola" }] },
      });
      await Promise.resolve();
    });

    expect(estadoInicial.categorias).toEqual([]);
    expect(estadoInicial.opcoesPerfisAcesso).toEqual([]);
    expect(formatarParaMultiselect).not.toHaveBeenCalled();
  });
});
