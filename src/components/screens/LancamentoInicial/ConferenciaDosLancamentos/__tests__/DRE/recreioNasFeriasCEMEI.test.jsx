import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import { mockSolicitacaoRecreioCEMEI } from "src/mocks/medicaoInicial/ConferenciaDosLancamentos/RecreioNasFeriasCEMEI/solicitacaoRecreioJaneiro2026";
import { mockDiasLetivosRecreio } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/diasLetivosRecreio";
import {
  mockValoresMedicoaRecreioCEIdaCEMEI,
  mockValoresMedicoaRecreioEMEIdaCEMEI,
  mockValoresMedicoaRecreioColaboradores,
} from "src/mocks/medicaoInicial/ConferenciaDosLancamentos/RecreioNasFeriasCEMEI/valoresMedicaoRecreioJaneiro2026";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";

import mock from "src/services/_mock";
import preview from "jest-preview";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => <textarea data-testid="ckeditor-mock" name="ckeditor-mock" />,
}));

const mockPeriodosGruposMedicaoRecreioCEMEI = {
  results: [
    {
      uuid_medicao_periodo_grupo: "68f54fa0-738c-472f-879d-15d679351d9e",
      nome_periodo_grupo: "Recreio nas Férias - de 0 a 3 anos e 11 meses",
      periodo_escolar: null,
      grupo: "Recreio nas Férias - de 0 a 3 anos e 11 meses",
      status: "MEDICAO_ENVIADA_PELA_UE",
      logs: [],
    },
    {
      uuid_medicao_periodo_grupo: "4ddc032a-aafb-437d-a40e-84ecefae1993",
      nome_periodo_grupo: "Recreio nas Férias - 4 a 14 anos",
      periodo_escolar: null,
      grupo: "Recreio nas Férias - 4 a 14 anos",
      status: "MEDICAO_ENVIADA_PELA_UE",
      logs: [],
    },
    {
      uuid_medicao_periodo_grupo: "b6c65ac0-138f-4299-a762-debf9bd38336",
      nome_periodo_grupo: "Colaboradores",
      periodo_escolar: null,
      grupo: "Colaboradores",
      status: "MEDICAO_ENVIADA_PELA_UE",
      logs: [],
    },
  ],
};

const setupConferencia = async ({
  solicitacao,
  periodosGruposMedicao,
  valoresMedicao,
}) => {
  process.env.IS_TEST = true;

  mock.reset();
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
  mock.onGet("/notificacoes/").reply(200, { results: [] });
  mock.onGet("/notificacoes/quantidade-nao-lidos/").reply(200, {
    quantidade_nao_lidos: 0,
  });
  mock
    .onGet(
      "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
    )
    .reply(200, periodosGruposMedicao);
  mock
    .onGet(`/medicao-inicial/solicitacao-medicao-inicial/${solicitacao.uuid}/`)
    .reply(200, solicitacao);

  mock.onGet(`/medicao-inicial/dias-sobremesa-doce/lista-dias/`).reply(200, []);

  mock.onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/").reply(200, {
    results: [
      {
        dia: "01",
        feriado: "Ano novo",
      },
      {
        dia: "25",
        feriado: "Aniversário da cidade de São Paulo",
      },
    ],
  });
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${solicitacao.escola_uuid}/`,
    )
    .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);

  mock
    .onGet("/medicao-inicial/recreio-nas-ferias/dias-letivos/")
    .reply(200, mockDiasLetivosRecreio);

  mock
    .onGet(
      "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
    )
    .reply(200, []);
  mock
    .onGet("/medicao-inicial/categorias-medicao/")
    .reply(200, mockCategoriasMedicao);
  mock.onGet("/medicao-inicial/valores-medicao/").reply(200, valoresMedicao);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
  localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

  window.history.pushState({}, "", `?uuid=${solicitacao.uuid}`);

  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/",
            state: {
              ano: solicitacao.ano,
              escolaUuid: solicitacao.escola_uuid,
              mes: solicitacao.mes,
            },
          },
        ]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ToastContainer />
        <ConferenciaDosLancamentosPage />
      </MemoryRouter>,
    );
  });

  await waitFor(() => {
    expect(screen.getAllByText("Conferência dos Lançamentos").length).toBe(2);
  });
};

const abrirLancamento = async (nomePeriodo) => {
  const visualizarLancamento = screen.getByTestId(
    `visualizar-lancamento-${nomePeriodo}`,
  );

  await act(async () => {
    fireEvent.click(visualizarLancamento);
  });

  await waitFor(() => {
    expect(screen.getByText("FECHAR")).toBeInTheDocument();
  });
};

describe("Teste Conferência de Lançamentos - CEMEI - Recreio nas Férias", () => {
  afterEach(() => {
    mock.reset();
  });

  it("renderiza dados iniciais", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoRecreioCEMEI,
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEMEI,
      valoresMedicao: [],
    });

    preview.debug();
  });

  describe("Recreio nas Férias - de 0 a 3 anos e 11 meses", () => {
    it("renderiza Participantes e faixas etárias", async () => {
      await setupConferencia({
        solicitacao: mockSolicitacaoRecreioCEMEI,
        periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEMEI,
        valoresMedicao: mockValoresMedicoaRecreioCEIdaCEMEI,
      });

      await abrirLancamento("Recreio nas Férias - de 0 a 3 anos e 11 meses");
      preview.debug();
    });
  });

  describe("Recreio nas Férias - 4 a 14 anos", () => {
    it("renderiza Participantes e alimentações", async () => {
      await setupConferencia({
        solicitacao: mockSolicitacaoRecreioCEMEI,
        periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEMEI,
        valoresMedicao: mockValoresMedicoaRecreioEMEIdaCEMEI,
      });

      await abrirLancamento("Recreio nas Férias - 4 a 14 anos");
      preview.debug();
    });
  });

  describe("Colaboradores", () => {
    it("renderiza Participantes e alimentações", async () => {
      await setupConferencia({
        solicitacao: mockSolicitacaoRecreioCEMEI,
        periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEMEI,
        valoresMedicao: mockValoresMedicoaRecreioColaboradores,
      });

      await abrirLancamento("Colaboradores");
      preview.debug();
    });
  });
});
