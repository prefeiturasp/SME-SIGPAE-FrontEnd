import reducer, {
  setRequisicoes,
  setRequisicoesCount,
  setAtivosRequisicao,
  setFiltrosRequisicao,
  setPageRequisicao,
  resetRequisicao,
} from "../buscaRequisicaoDilog";

describe("buscaRequisicaoDilog reducer", () => {
  const initialState = {
    requisicoes: undefined,
    requisicoesCount: undefined,
    ativos: undefined,
    filtros: undefined,
    page: undefined,
  };

  it("deve retornar o estado inicial quando nenhuma action é despachada", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe("SET_REQUISICOES action", () => {
    it("deve atualizar corretamente o estado com a lista de requisições", () => {
      const mockRequisicoes = [
        { id: 1, nome: "Req 1" },
        { id: 2, nome: "Req 2" },
      ];
      const action = setRequisicoes(mockRequisicoes);

      const expectedState = {
        ...initialState,
        requisicoes: mockRequisicoes,
      };

      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it("deve substituir completamente a lista de requisições existente", () => {
      const existingState = {
        ...initialState,
        requisicoes: [{ id: 1, nome: "Req Antiga" }],
      };

      const mockRequisicoes = [{ id: 2, nome: "Req Nova" }];
      const action = setRequisicoes(mockRequisicoes);

      const expectedState = {
        ...existingState,
        requisicoes: mockRequisicoes,
      };

      expect(reducer(existingState, action)).toEqual(expectedState);
    });
  });

  describe("SET_REQUISICOES_COUNT action", () => {
    it("deve atualizar corretamente a contagem de requisições", () => {
      const mockCount = 42;
      const action = setRequisicoesCount(mockCount);

      const expectedState = {
        ...initialState,
        requisicoesCount: mockCount,
      };

      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe("SET_ATIVOS action", () => {
    it("deve atualizar corretamente os ativos no estado", () => {
      const mockAtivos = { campo1: true, campo2: false };
      const action = setAtivosRequisicao(mockAtivos);

      const expectedState = {
        ...initialState,
        ativos: mockAtivos,
      };

      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe("SET_FILTROS action", () => {
    it("deve atualizar corretamente os filtros no estado", () => {
      const mockFiltros = { filtro1: "valor1", filtro2: "valor2" };
      const action = setFiltrosRequisicao(mockFiltros);

      const expectedState = {
        ...initialState,
        filtros: mockFiltros,
      };

      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe("SET_PAGE action", () => {
    it("deve atualizar corretamente a página no estado", () => {
      const mockPage = 3;
      const action = setPageRequisicao(mockPage);

      const expectedState = {
        ...initialState,
        page: mockPage,
      };

      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe("RESET action", () => {
    it("deve resetar todos os valores para undefined, mantendo o page", () => {
      const existingState = {
        requisicoes: [{ id: 1, nome: "Req 1" }],
        requisicoesCount: 10,
        ativos: { campo: true },
        filtros: { filtro: "valor" },
        page: 2,
      };

      const action = resetRequisicao();

      expect(reducer(existingState, action)).toEqual({
        ...initialState,
        page: 2,
      });
    });

    it("deve manter o estado inicial quando já está resetado", () => {
      const action = resetRequisicao();
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });

  describe("action creators", () => {
    it("setRequisicoes deve criar a action correta", () => {
      const payload = [{ id: 1 }];
      const expectedAction = {
        type: "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_REQUISICOES",
        payload,
      };
      expect(setRequisicoes(payload)).toEqual(expectedAction);
    });

    it("setRequisicoesCount deve criar a action correta", () => {
      const payload = 10;
      const expectedAction = {
        type: "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_REQUISICOES_COUNT",
        payload,
      };
      expect(setRequisicoesCount(payload)).toEqual(expectedAction);
    });

    it("setAtivosRequisicao deve criar a action correta", () => {
      const payload = { ativo: true };
      const expectedAction = {
        type: "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_ATIVOS",
        payload,
      };
      expect(setAtivosRequisicao(payload)).toEqual(expectedAction);
    });

    it("setFiltrosRequisicao deve criar a action correta", () => {
      const payload = { filtro: "valor" };
      const expectedAction = {
        type: "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_FILTROS",
        payload,
      };
      expect(setFiltrosRequisicao(payload)).toEqual(expectedAction);
    });

    it("setPageRequisicao deve criar a action correta", () => {
      const payload = 2;
      const expectedAction = {
        type: "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_PAGE",
        payload,
      };
      expect(setPageRequisicao(payload)).toEqual(expectedAction);
    });

    it("resetRequisicao deve criar a action correta", () => {
      const expectedAction = {
        type: "SME-SIGPAE-Frontend/buscaRequisicaoDilog/RESET",
      };
      expect(resetRequisicao()).toEqual(expectedAction);
    });
  });
});
