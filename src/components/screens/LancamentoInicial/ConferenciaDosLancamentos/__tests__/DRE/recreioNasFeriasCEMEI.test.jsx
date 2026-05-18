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

  it("renderiza as informações da tela", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoRecreioCEMEI,
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEMEI,
      valoresMedicao: [],
    });

    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
    expect(screen.getByTestId("input-mes-lancamento")).toHaveValue(
      "Recreio nas Férias - JAN 2026",
    );
    expect(screen.getByText("Unidade Educacional")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Unidade Educacional")).toHaveValue(
      "CEMEI SUZANA CAMPOS TAUIL",
    );
    expect(
      screen.getByText("Progresso de validação de refeições informadas"),
    ).toBeInTheDocument();
    const el = screen.getByText(/status de progresso:/i);
    expect(el).toHaveTextContent("Recebido para análise");
    expect(
      screen.getByText("Acompanhamento do lançamento"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Recreio nas Férias - de 0 a 3 anos e 11 meses"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Recreio nas Férias - 4 a 14 anos"),
    ).toBeInTheDocument();
    expect(screen.getByText("Colaboradores")).toBeInTheDocument();

    expect(screen.getAllByText("Pendente de Análise")).toHaveLength(3);
    expect(screen.getAllByText("VISUALIZAR")).toHaveLength(3);

    const buttonExportarPdf = document.querySelector(
      '[data-cy="Exportar PDF"]',
    );
    expect(buttonExportarPdf).toBeInTheDocument();
    expect(buttonExportarPdf).not.toBeDisabled();

    const buttonSolicitarCorrecao = document.querySelector(
      '[data-cy="Solicitar Correção"]',
    );
    expect(buttonSolicitarCorrecao).toBeInTheDocument();
    expect(buttonSolicitarCorrecao).toBeDisabled();

    const buttonEnviarParaCodae = document.querySelector(
      '[data-cy="Enviar para CODAE"]',
    );
    expect(buttonEnviarParaCodae).toBeInTheDocument();
    expect(buttonEnviarParaCodae).toBeDisabled();

    const buttonCienteCorrecoes = document.querySelector(
      '[data-cy="Ciente das Correções"]',
    );
    expect(buttonCienteCorrecoes).toBeInTheDocument();
    expect(buttonCienteCorrecoes).toBeDisabled();
  });

  it("renderiza Recreio nas Férias - de 0 a 3 anos e 11 meses", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoRecreioCEMEI,
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEMEI,
      valoresMedicao: mockValoresMedicoaRecreioCEIdaCEMEI,
    });

    await abrirLancamento("Recreio nas Férias - de 0 a 3 anos e 11 meses");

    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Participantes")).toBeInTheDocument();
    expect(screen.queryByText("Matriculados")).not.toBeInTheDocument();
    expect(screen.getAllByText("00 meses").length).toBeGreaterThan(0);
    expect(screen.getAllByText("01 a 03 meses").length).toBeGreaterThan(0);
    expect(screen.getAllByText("04 a 05 meses").length).toBeGreaterThan(0);
    expect(screen.getAllByText("06 meses").length).toBeGreaterThan(0);
    expect(screen.getAllByText("07 a 11 meses").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("01 ano a 03 anos e 11 meses").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("04 anos a 06 anos").length).toBeGreaterThan(0);
    expect(screen.queryByText("Semana 4")).not.toBeInTheDocument();

    expect(
      screen.getByTestId(
        "participantes__faixa_null__dia_01__categoria_1__uuid_medicao_periodo_grupo_68f54",
      ),
    ).toHaveAttribute("value", "50");

    expect(
      screen.getByTestId(
        "participantes__faixa_null__dia_02__categoria_1__uuid_medicao_periodo_grupo_68f54",
      ),
    ).toHaveAttribute("value", "42");

    expect(
      screen.getByTestId(
        "frequencia__faixa_1b77202d-fd0b-46b7-b4ec-04eb262efece__dia_02__categoria_1__uuid_medicao_periodo_grupo_68f54",
      ),
    ).toHaveAttribute("value", "7");
  });

  it("renderiza Recreio nas Férias - 4 a 14 anos", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoRecreioCEMEI,
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEMEI,
      valoresMedicao: mockValoresMedicoaRecreioEMEIdaCEMEI,
    });

    await abrirLancamento("Recreio nas Férias - 4 a 14 anos");

    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Participantes")).toBeInTheDocument();
    expect(screen.queryByText("Matriculados")).not.toBeInTheDocument();
    expect(screen.getByText("Refeição 1ª Oferta")).toBeInTheDocument();
    expect(screen.getByText("Repetição Refeição")).toBeInTheDocument();
    expect(screen.getByText("Sobremesa 1º Oferta")).toBeInTheDocument();
    expect(screen.getByText("Repetição Sobremesa")).toBeInTheDocument();

    expect(screen.getAllByText("Lanche 4h").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Lanche").length).toBeGreaterThan(0);

    expect(
      screen.getByTestId(
        "participantes__dia_02__categoria_1__uuid_medicao_periodo_grupo_4ddc0",
      ),
    ).toHaveAttribute("value", "150");

    expect(
      screen.getByTestId(
        "frequencia__dia_02__categoria_1__uuid_medicao_periodo_grupo_4ddc0",
      ),
    ).toHaveAttribute("value", "150");

    expect(
      screen.getByTestId(
        "lanche__dia_02__categoria_1__uuid_medicao_periodo_grupo_4ddc0",
      ),
    ).toHaveAttribute("value", "100");
  });

  it("renderiza Recreio nas Férias - Colaboradores", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoRecreioCEMEI,
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEMEI,
      valoresMedicao: mockValoresMedicoaRecreioColaboradores,
    });

    await abrirLancamento("Colaboradores");

    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Participantes")).toBeInTheDocument();
    expect(screen.queryByText("Matriculados")).not.toBeInTheDocument();
    expect(screen.getByText("Lanche 4h")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();
    expect(screen.getByText("Refeição 1ª Oferta")).toBeInTheDocument();
    expect(screen.getByText("Repetição Refeição")).toBeInTheDocument();
    expect(screen.getByText("Sobremesa 1º Oferta")).toBeInTheDocument();
    expect(screen.getByText("Repetição Sobremesa")).toBeInTheDocument();

    expect(
      screen.getByTestId(
        "participantes__dia_02__categoria_1__uuid_medicao_periodo_grupo_b6c65",
      ),
    ).toHaveAttribute("value", "27");

    expect(
      screen.getByTestId(
        "frequencia__dia_02__categoria_1__uuid_medicao_periodo_grupo_b6c65",
      ),
    ).toHaveAttribute("value", "25");

    expect(
      screen.getByTestId(
        "lanche_4h__dia_02__categoria_1__uuid_medicao_periodo_grupo_b6c65",
      ),
    ).toHaveAttribute("value", "24");
  });
});
