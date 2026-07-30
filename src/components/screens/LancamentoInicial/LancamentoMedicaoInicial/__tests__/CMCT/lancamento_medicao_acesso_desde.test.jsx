import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMeusDadosEscolaCMCT } from "src/mocks/meusDados/escolaCMCT";

const comAcessoDesde = (data) => ({
  ...mockMeusDadosEscolaCMCT,
  vinculo_atual: {
    ...mockMeusDadosEscolaCMCT.vinculo_atual,
    instituicao: {
      ...mockMeusDadosEscolaCMCT.vinculo_atual.instituicao,
      acesso_desde: data,
    },
  },
});
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "src/mocks/services/cadastroTipoAlimentacao.service/CMCT/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { mockEscolaSimplesCMCT } from "src/mocks/services/escola.service/CMCT/escolaSimples";
import { mockEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscolaCMCT } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CMCT/periodosSolicitacoesAutorizadasEscola";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

const escolaUuid = mockMeusDadosEscolaCMCT.vinculo_atual.instituicao.uuid;
const solicitacaoMedicaoInicialUuid =
  mockSolicitacaoMedicaoInicialCMCTSetembro2025[0].uuid;

const setupDefaultMocks = () => {
  mock.onGet("/notificacoes/").reply(200, {
    next: null,
    previous: null,
    count: 0,
    page_size: 4,
    results: [],
  });
  mock
    .onGet("/notificacoes/quantidade-nao-lidos/")
    .reply(200, { quantidade_nao_lidos: 0 });
  mock
    .onGet(`/escolas-simples/${escolaUuid}/`)
    .reply(200, mockEscolaSimplesCMCT);
  mock
    .onGet("/medicao-inicial/recreio-nas-ferias/")
    .reply(200, { results: [] });
  mock
    .onGet(
      "/medicao-inicial/solicitacao-medicao-inicial/solicitacoes-lancadas/",
    )
    .reply(200, []);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
  mock
    .onGet(
      "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano",
    )
    .reply(200, []);
  mock
    .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
    .reply(200, mockSolicitacaoMedicaoInicialCMCTSetembro2025);
  mock
    .onGet("/dias-calendario/")
    .reply(200, mockDiasCalendarioSetembro2025CMCT);
  mock
    .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
    .reply(200, mockGetTiposDeContagemAlimentacao);
  mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
    periodos: { TARDE: "20bd9ca9-d499-456a-bd86-fb8f297947d6" },
  });
  mock.onGet("/escola-solicitacoes/kit-lanches-autorizadas/").reply(200, {
    results: [
      { dia: "02", numero_alunos: 100, kit_lanche_id_externo: "2EB2A" },
    ],
  });
  mock
    .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
    .reply(200, {
      results: [
        {
          dia: "02",
          numero_alunos: 100,
          inclusao_id_externo: "6DA39",
          motivo: "Lanche Emergencial",
        },
      ],
    });
  mock
    .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet(
      "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
    )
    .reply(200, []);
  mock
    .onGet(
      `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoMedicaoInicialUuid}/ceu-gestao-frequencias-dietas/`,
    )
    .reply(200, []);
  mock
    .onGet(
      "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
    )
    .reply(200, { results: [] });
  mock
    .onGet(
      "/escola-solicitacoes/ceu-gestao-periodos-com-solicitacoes-autorizadas/",
    )
    .reply(
      200,
      mockEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscolaCMCT,
    );
};

describe("Teste <LancamentoMedicaoInicial> - Filtro acesso_desde", () => {
  const renderComponent = async ({ meusDados, search } = {}) => {
    cleanup();
    mock.reset();
    setupDefaultMocks();

    mock.onGet("/usuarios/meus-dados/").reply(200, meusDados);

    window.history.pushState({}, "", search || "");

    Object.defineProperty(global, "localStorage", { value: localStorageMock });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId("select-periodo-lancamento"),
      ).not.toBeDisabled();
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-28T10:00:00Z"));
    cleanup();
    mock.reset();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  const openSelect = async () => {
    await act(async () => {
      const select = screen.getByTestId("select-periodo-lancamento");
      fireEvent.click(select);
      fireEvent.mouseDown(
        select.querySelector(".ant-select-selection-search-input"),
      );
    });
  };

  it("Exibe todos os períodos quando acesso_desde não está definido", async () => {
    await renderComponent({
      meusDados: mockMeusDadosEscolaCMCT,
      search: "?mes=07&ano=2026",
    });

    await openSelect();

    await waitFor(() => {
      expect(screen.getAllByText("Julho / 2026").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Junho / 2026").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Maio / 2026").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Abril / 2026").length).toBeGreaterThan(0);
    });
  });

  it("Não exibe períodos anteriores à data de acesso_desde (15/05/2026)", async () => {
    await renderComponent({
      meusDados: comAcessoDesde("15/05/2026"),
      search: "?mes=07&ano=2026",
    });

    await openSelect();

    await waitFor(() => {
      expect(screen.getAllByText("Julho / 2026").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Junho / 2026").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Maio / 2026").length).toBeGreaterThan(0);
    });

    expect(screen.queryByText("Abril / 2026")).toBeNull();
  });

  it("Não exibe períodos anteriores à data de acesso_desde (30/06/2026)", async () => {
    await renderComponent({
      meusDados: comAcessoDesde("30/06/2026"),
      search: "?mes=07&ano=2026",
    });

    await openSelect();

    await waitFor(() => {
      expect(screen.getAllByText("Julho / 2026").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Junho / 2026").length).toBeGreaterThan(0);
    });

    expect(screen.queryByText("Maio / 2026")).toBeNull();
    expect(screen.queryByText("Abril / 2026")).toBeNull();
  });

  it("Exibe apenas o mês atual quando acesso_desde é o mês atual", async () => {
    await renderComponent({
      meusDados: comAcessoDesde("01/07/2026"),
      search: "?mes=07&ano=2026",
    });

    await openSelect();

    await waitFor(() => {
      expect(screen.getAllByText("Julho / 2026").length).toBeGreaterThan(0);
    });

    expect(screen.queryByText("Junho / 2026")).toBeNull();
    expect(screen.queryByText("Maio / 2026")).toBeNull();
  });

  it("Não afeta períodos de Recreio nas Férias quando acesso_desde está definido", async () => {
    cleanup();
    mock.reset();
    setupDefaultMocks();

    const meusDadosComAcesso = comAcessoDesde("01/07/2026");

    const mockRecreio = {
      results: [
        {
          uuid: "recreio-uuid-1",
          titulo: "Recreio nas Férias - Jul 26",
          data_inicio: "01/07/2026",
          data_fim: "31/07/2026",
          unidades_participantes: ["escola-1"],
        },
        {
          uuid: "recreio-uuid-2",
          titulo: "Recreio nas Férias - Dez 25",
          data_inicio: "01/12/2025",
          data_fim: "31/12/2025",
          unidades_participantes: ["escola-1"],
        },
      ],
    };

    mock.onGet("/usuarios/meus-dados/").reply(200, meusDadosComAcesso);
    mock.onGet("/medicao-inicial/recreio-nas-ferias/").reply(200, mockRecreio);

    window.history.pushState({}, "", "?mes=07&ano=2026");

    Object.defineProperty(global, "localStorage", { value: localStorageMock });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: meusDadosComAcesso,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
    });

    await openSelect();

    await waitFor(() => {
      expect(
        screen.getByText("Recreio nas Férias - Dez 25"),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Junho / 2026")).toBeNull();
    expect(screen.queryByText("Maio / 2026")).toBeNull();
  });
});
