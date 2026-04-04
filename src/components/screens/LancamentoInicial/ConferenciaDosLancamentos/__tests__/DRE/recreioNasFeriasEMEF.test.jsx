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
import { mockDiasCalendarioEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/diasCalendario";
import {
  mockSolicitacaoRecreioEMEF,
  mockSolicitacaoNormalEMEF,
} from "src/mocks/medicaoInicial/ConferenciaDosLancamentos/RecreioNasFeriasEMEF/mockSolicitacaoRecreioEMEF";
import {
  mockValoresMedicaoRecreioEMEF,
  mockValoresMedicaoColaboradoresEMEF,
  mockValoresMedicaoNormalEMEF,
} from "src/mocks/medicaoInicial/ConferenciaDosLancamentos/RecreioNasFeriasEMEF/mockValoresMedicaoEMEF";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => <textarea data-testid="ckeditor-mock" name="ckeditor-mock" />,
}));

const mockVinculosTipoAlimentacaoEMEF = {
  results: [
    {
      uuid: "emef-vinculo-manha",
      tipo_unidade_escolar: {
        iniciais: "EMEF",
        ativo: true,
        uuid: "tipo-emef-uuid",
        tem_somente_integral_e_parcial: false,
        pertence_relatorio_solicitacoes_alimentacao: false,
      },
      periodo_escolar: {
        possui_alunos_regulares: null,
        nome: "MANHA",
        uuid: "periodo-manha-uuid",
        posicao: 2,
        tipo_turno: 1,
      },
      tipos_alimentacao: [
        {
          nome: "Lanche",
          uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
          posicao: 2,
        },
        {
          nome: "Refeição",
          uuid: "65f11f11-630b-4629-bb17-07c875c548f1",
          posicao: 3,
        },
        {
          nome: "Sobremesa",
          uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4",
          posicao: 4,
        },
        {
          nome: "Lanche Emergencial",
          uuid: "c4255a14-85fd-412f-b35f-30828215e4d5",
          posicao: null,
        },
      ],
    },
  ],
};

const mockPeriodosGruposMedicaoRecreioEMEF = {
  results: [
    {
      uuid_medicao_periodo_grupo: "recre12345-emef-2222-3333-444444444444",
      nome_periodo_grupo: "Recreio nas Férias",
      periodo_escolar: "MANHA",
      status: "MEDICAO_ENVIADA_PELA_UE",
      logs: [],
    },
    {
      uuid_medicao_periodo_grupo: "colab12345-emef-2222-3333-444444444444",
      nome_periodo_grupo: "Colaboradores",
      periodo_escolar: "MANHA",
      status: "MEDICAO_ENVIADA_PELA_UE",
      logs: [],
    },
  ],
};

const mockPeriodosGruposMedicaoNormalEMEF = {
  results: [
    {
      uuid_medicao_periodo_grupo: "manha12345-emef-2222-3333-444444444444",
      nome_periodo_grupo: "MANHA",
      periodo_escolar: "MANHA",
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
  mock.onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/").reply(200, {
    results: [],
  });
  mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioEMEFJaneiro2026);
  mock.onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/").reply(200, []);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${solicitacao.escola_uuid}/`,
    )
    .reply(200, mockVinculosTipoAlimentacaoEMEF);
  mock
    .onGet(
      "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
    )
    .reply(200, []);
  mock
    .onGet("/medicao-inicial/categorias-medicao/")
    .reply(200, mockCategoriasMedicao);
  mock.onGet("/medicao-inicial/valores-medicao/").reply(200, valoresMedicao);
  mock
    .onGet(
      "medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/",
    )
    .reply(200, {
      results: {
        alimentacoes_lancamentos_especiais: [],
        data_inicio_permissoes: null,
      },
    });
  mock
    .onGet("/medicao-inicial/medicao/inclusoes-autorizadas-por-dia/")
    .reply(200, { results: [] });
  mock
    .onGet("/medicao-inicial/medicao/alteracoes-alimentacao-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet("/medicao-inicial/medicao/suspensoes-autorizadas/")
    .reply(200, { results: [] });

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

describe("Teste Conferência de Lançamentos - EMEF - Recreio nas Férias", () => {
  afterEach(() => {
    mock.reset();
  });

  it("renderiza Participantes e tipos de alimentação dos inscritos no grupo de recreio da EMEF", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoRecreioEMEF,
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioEMEF,
      valoresMedicao: mockValoresMedicaoRecreioEMEF,
    });

    await abrirLancamento("Recreio nas Férias");

    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Participantes")).toBeInTheDocument();
    expect(screen.queryByText("Matriculados")).not.toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();
    expect(screen.getByText("Refeição 1ª Oferta")).toBeInTheDocument();
    expect(screen.getByText("Sobremesa 1º Oferta")).toBeInTheDocument();

    expect(
      screen.getByTestId(
        "participantes__dia_02__categoria_1__uuid_medicao_periodo_grupo_recre",
      ),
    ).toHaveAttribute("value", "80");

    expect(
      screen.getByTestId(
        "frequencia__dia_02__categoria_1__uuid_medicao_periodo_grupo_recre",
      ),
    ).toHaveAttribute("value", "75");
  });

  it("renderiza Participantes e tipos de alimentação dos colaboradores no grupo de colaboradores da EMEF", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoRecreioEMEF,
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioEMEF,
      valoresMedicao: mockValoresMedicaoColaboradoresEMEF,
    });

    await abrirLancamento("Colaboradores");

    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Participantes")).toBeInTheDocument();
    expect(screen.queryByText("Matriculados")).not.toBeInTheDocument();
    expect(screen.getByText("Lanche 4h")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();

    expect(
      screen.getByTestId(
        "participantes__dia_02__categoria_1__uuid_medicao_periodo_grupo_colab",
      ),
    ).toHaveAttribute("value", "10");

    expect(
      screen.getByTestId(
        "lanche_4h__dia_02__categoria_1__uuid_medicao_periodo_grupo_colab",
      ),
    ).toHaveAttribute("value", "10");
  });

  it("renderiza semanas corretamente para recreio nas férias (02/01 a 15/01)", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoRecreioEMEF,
      periodosGruposMedicao: mockPeriodosGruposMedicaoRecreioEMEF,
      valoresMedicao: mockValoresMedicaoRecreioEMEF,
    });

    await abrirLancamento("Recreio nas Férias");

    expect(screen.getByText("Semana 1")).toBeInTheDocument();
    expect(screen.getByText("Semana 2")).toBeInTheDocument();
    expect(screen.getByText("Semana 3")).toBeInTheDocument();
  });

  it("mantém o comportamento de EMEF normal com a linha de matriculados", async () => {
    await setupConferencia({
      solicitacao: mockSolicitacaoNormalEMEF,
      periodosGruposMedicao: mockPeriodosGruposMedicaoNormalEMEF,
      valoresMedicao: mockValoresMedicaoNormalEMEF,
    });

    await abrirLancamento("MANHA");

    expect(screen.getAllByText("Matriculados").length).toBeGreaterThan(0);
    expect(screen.queryByText("Participantes")).not.toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "matriculados__dia_02__categoria_1__uuid_medicao_periodo_grupo_manha",
        ),
      ).toHaveAttribute("value", "200");
    });
  });
});
