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
import { mockDiasCalendarioCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockDiasCalendarioCEI";
import {
  mockLocationStateGrupoColaboradores,
  mockLocationStateGrupoRecreioNasFerias,
} from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/mockStateRecreio";
import { mockValoresMedicaoCEI as mockValoresMedicaoCEINormal } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockValoresMedicaoCEI";
import {
  mockValoresMedicaoCEI as mockValoresMedicaoCEIRecreio,
  mockValoresMedicaoCEIColaboradores,
} from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/mockValoresMedicaoCEI";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => <textarea data-testid="ckeditor-mock" name="ckeditor-mock" />,
}));

const mockVinculosTipoAlimentacaoCEI = {
  results: [
    {
      periodo_escolar: {
        uuid: "periodo-integral",
        nome: "INTEGRAL",
        posicao: 1,
      },
      tipo_unidade_escolar: {
        iniciais: "CEI",
      },
      tipos_alimentacao: [],
    },
  ],
};

const mockPeriodosGruposMedicaoRecreioCEI = {
  results: [
    {
      uuid_medicao_periodo_grupo: "recre12345-1111-2222-3333-444444444444",
      nome_periodo_grupo: "Recreio nas Férias",
      periodo_escolar: "INTEGRAL",
      status: "MEDICAO_ENVIADA_PELA_UE",
      logs: [],
    },
    {
      uuid_medicao_periodo_grupo: "colab12345-1111-2222-3333-444444444444",
      nome_periodo_grupo: "Colaboradores",
      periodo_escolar: "INTEGRAL",
      status: "MEDICAO_ENVIADA_PELA_UE",
      logs: [],
    },
  ],
};

const mockPeriodosGruposMedicaoCEINormal = {
  results: [
    {
      uuid_medicao_periodo_grupo: "integ12345-1111-2222-3333-444444444444",
      nome_periodo_grupo: "INTEGRAL",
      periodo_escolar: "INTEGRAL",
      status: "MEDICAO_ENVIADA_PELA_UE",
      logs: [],
    },
  ],
};

const mockSolicitacaoRecreioCEI = {
  ...mockLocationStateGrupoRecreioNasFerias.solicitacaoMedicaoInicial,
  uuid: "solicitacao-recreio-cei",
  status: "MEDICAO_ENVIADA_PELA_UE",
};

const mockSolicitacaoCEINormal = {
  ...mockLocationStateGrupoRecreioNasFerias.solicitacaoMedicaoInicial,
  uuid: "solicitacao-cei-normal",
  status: "MEDICAO_ENVIADA_PELA_UE",
  ano: "2024",
  mes: "11",
  recreio_nas_ferias: null,
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
  mock.onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/").reply(200, {
    results: [],
  });
  mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioCEI);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${solicitacao.escola_uuid}/`,
    )
    .reply(200, mockVinculosTipoAlimentacaoCEI);
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

describe("Teste Conferência de Lançamentos - CEI - Recreio nas Férias", () => {
  afterEach(() => {
    mock.reset();
  });

  it("renderiza Participantes e faixas etárias no grupo de recreio da CEI", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoRecreioCEI,
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEI,
      valoresMedicao: mockValoresMedicaoCEIRecreio,
    });

    await abrirLancamento("Recreio nas Férias");

    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Participantes")).toBeInTheDocument();
    expect(screen.queryByText("Matriculados")).not.toBeInTheDocument();
    expect(screen.getAllByText("00 meses").length).toBeGreaterThan(0);
    expect(screen.getAllByText("01 a 03 meses").length).toBeGreaterThan(0);
    expect(screen.queryByText("Semana 4")).not.toBeInTheDocument();

    expect(
      screen.getByTestId(
        "participantes__faixa_null__dia_01__categoria_1__uuid_medicao_periodo_grupo_recre",
      ),
    ).toHaveAttribute("value", "100");

    expect(
      screen.getByTestId(
        "frequencia__faixa_1b77202d-fd0b-46b7-b4ec-04eb262efece__dia_01__categoria_1__uuid_medicao_periodo_grupo_recre",
      ),
    ).toHaveAttribute("value", "14");
  });

  it("renderiza Participantes e tipos de alimentação no grupo de colaboradores do recreio", async () => {
    await setupConferencia({
      solicitacao: {
        ...mockSolicitacaoRecreioCEI,
        recreio_nas_ferias:
          mockLocationStateGrupoColaboradores.solicitacaoMedicaoInicial
            .recreio_nas_ferias,
      },
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioCEI,
      valoresMedicao: mockValoresMedicaoCEIColaboradores,
    });

    await abrirLancamento("Colaboradores");

    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Participantes")).toBeInTheDocument();
    expect(screen.queryByText("Matriculados")).not.toBeInTheDocument();
    expect(screen.getByText("Lanche 4h")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();

    expect(
      screen.getByTestId(
        "participantes__dia_01__categoria_1__uuid_medicao_periodo_grupo_colab",
      ),
    ).toHaveAttribute("value", "15");

    expect(
      screen.getByTestId(
        "lanche_4h__dia_01__categoria_1__uuid_medicao_periodo_grupo_colab",
      ),
    ).toHaveAttribute("value", "15");
  });

  it("mantém o comportamento de CEI normal com a linha de matriculados", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoCEINormal,
      periodosGruposMedicao: mockPeriodosGruposMedicaoCEINormal,
      valoresMedicao: mockValoresMedicaoCEINormal,
    });

    await abrirLancamento("INTEGRAL");

    fireEvent.click(screen.getByText("Semana 4"));

    expect(screen.getAllByText("Matriculados").length).toBeGreaterThan(0);
    expect(screen.queryByText("Participantes")).not.toBeInTheDocument();
    expect(
      screen.getAllByText("01 ano a 03 anos e 11 meses").length,
    ).toBeGreaterThan(0);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "matriculados__faixa_802ffeb0-3d70-4be9-97fe-20992ee9c0ff__dia_18__categoria_1__uuid_medicao_periodo_grupo_integ",
        ),
      ).toHaveAttribute("value", "2");
    });
  });
});
