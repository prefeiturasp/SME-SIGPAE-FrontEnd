import { act, renderHook, waitFor } from "@testing-library/react";
import {
  extractDreUuid,
  useAlimentacao,
  useLotes,
  useTiposUnidade,
  useUnidadesEducacionais,
} from "../hooks/useModalUnidades";
import {
  getTiposUnidadeEscolar,
  getVinculosTipoAlimentacaoPorTipoUnidadeEscolar,
} from "src/services/cadastroTipoAlimentacao.service";
import { getEscolasTercTotal } from "src/services/escola.service";
import { getLotesAsync } from "src/services/lote.service";

jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/escola.service");
jest.mock("src/services/lote.service");

const mockTipos = getTiposUnidadeEscolar as jest.Mock;
const mockVinculos =
  getVinculosTipoAlimentacaoPorTipoUnidadeEscolar as jest.Mock;
const mockEscolas = getEscolasTercTotal as jest.Mock;

describe("useModalUnidades hooks", () => {
  beforeEach(() => jest.resetAllMocks());

  it("extractDreUuid percorre todos os fallbacks", () => {
    expect(extractDreUuid({ dre: "d" })).toBe("d");
    expect(extractDreUuid(undefined)).toBeUndefined();
  });

  it("useLotes carrega lotes e prefixa a opção 'Selecione'", async () => {
    (getLotesAsync as jest.Mock).mockImplementation((set) =>
      set([{ uuid: "l1", nome: "Lote 1" }]),
    );

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.lotes).toHaveLength(1));
    expect(result.current.lotesOpts).toEqual([
      { uuid: "", nome: "Selecione a DRE/Lote" },
      { uuid: "l1", nome: "Lote 1" },
    ]);
  });

  describe("useTiposUnidade", () => {
    const lotes = [
      { uuid: "l1", nome: "Lote 1", dre_uuid: "dre-1" },
      { uuid: "l2", nome: "Lote 2" },
    ] as any[];

    it("não busca sem DRE/Lote selecionado nem quando o lote não tem DRE", () => {
      const { result, rerender } = renderHook(
        ({ lote }) => useTiposUnidade(lote, lotes),
        { initialProps: { lote: "" } },
      );
      expect(result.current.tiposOpts).toEqual([
        { uuid: "", nome: "Selecione o Tipo de Unidade" },
      ]);

      rerender({ lote: "l2" });

      expect(mockTipos).not.toHaveBeenCalled();
    });

    it("busca com grupo, formata e monta tiposMap", async () => {
      mockTipos.mockResolvedValue({
        data: { results: [{ iniciais: "CEI", uuid: "t1" }] },
      });

      const { result } = renderHook(() =>
        useTiposUnidade("l1", lotes, "Grupo 4"),
      );

      await waitFor(() => expect(result.current.tipos).toHaveLength(1));
      expect(mockTipos).toHaveBeenCalledWith({
        dre: "dre-1",
        grupo: "Grupo 4",
      });
      expect(result.current.tiposMap).toEqual({
        CEI: { nome: "CEI", uuid: "t1" },
      });
    });

    it("busca sem grupo e tolera resposta vazia", async () => {
      mockTipos.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTiposUnidade("l1", lotes));

      await waitFor(() =>
        expect(mockTipos).toHaveBeenCalledWith({ dre: "dre-1" }),
      );
      expect(result.current.tipos).toEqual([]);
    });
  });

  describe("useAlimentacao", () => {
    it("não carrega sem tipo de unidade nem sem results na resposta", async () => {
      mockVinculos.mockResolvedValue(undefined);
      const { result } = renderHook(() => useAlimentacao());

      await act(() => result.current.loadAlimentacao(""));
      expect(mockVinculos).not.toHaveBeenCalled();

      await act(() => result.current.loadAlimentacao("tipo-1"));
      expect(result.current.participantes).toEqual([]);
    });

    it("carrega, deduplica, ignora itens sem nome e reseta", async () => {
      mockVinculos.mockResolvedValue({
        results: [
          {
            tipos_alimentacao: [
              { uuid: "a1", nome: "Almoço" },
              { uuid: "a2", nome: "Almoço" },
              { uuid: "a3" },
            ],
          },
          {},
        ],
      });
      const { result } = renderHook(() => useAlimentacao());

      await act(() => result.current.loadAlimentacao("tipo-1"));
      expect(result.current.participantes).toEqual([
        { value: "a1", label: "Almoço" },
      ]);

      act(() => result.current.reset());
      expect(result.current.participantes).toEqual([]);
    });
  });

  describe("useUnidadesEducacionais", () => {
    const criarForm = (values: any) =>
      ({ getState: () => ({ values }) }) as any;

    it("não altera unidades com params faltando ou status diferente de 200", async () => {
      mockEscolas.mockResolvedValue({ status: 500, data: [] });
      const { result } = renderHook(() =>
        useUnidadesEducacionais(criarForm({})),
      );

      await act(() => result.current.fetchUnidades("", "tipo-1"));
      await act(() => result.current.fetchUnidades("dre-1", ""));
      expect(mockEscolas).not.toHaveBeenCalled();

      await act(() => result.current.fetchUnidades("dre-1", "tipo-1"));
      expect(result.current.unidades).toEqual([]);
    });

    it("carrega, filtra as já adicionadas e reseta", async () => {
      mockEscolas.mockResolvedValue({
        status: 200,
        data: [
          { uuid: "ue-1", nome: "Unidade 1" },
          { uuid: "ue-2", nome: "Unidade 2" },
        ],
      });
      const form = criarForm({
        unidades_participantes: [{ unidadeEducacionalUuid: "ue-1" }],
      });
      const { result } = renderHook(() => useUnidadesEducacionais(form));

      await act(() => result.current.fetchUnidades("dre-1", "tipo-1"));
      expect(mockEscolas).toHaveBeenCalledWith({
        dre: "dre-1",
        tipo_unidade: "tipo-1",
      });
      expect(result.current.unidadesFiltradas).toEqual([
        { value: "ue-2", label: "Unidade 2" },
      ]);

      act(() => result.current.resetUnidades());
      expect(result.current.unidades).toEqual([]);
    });
  });
});
