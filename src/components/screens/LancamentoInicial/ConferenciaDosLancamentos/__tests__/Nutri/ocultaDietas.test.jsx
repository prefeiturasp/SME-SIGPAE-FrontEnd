import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMeusDadosNutriSupervisao } from "src/mocks/meusDados/nutri-supervisao";
import { mockGetVinculosTipoAlimentacaoPorEscola } from "src/mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";
import { mockPeriodosGruposMedicaoCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/periodosGruposMedicao";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import { mockValoresMedicaoComDietas } from "src/mocks/services/medicaoInicial/valoresMedicao.service/Setembro2025/valoresMedicaoComDietas";
import { mockValoresMedicaoSemDietas } from "src/mocks/services/medicaoInicial/valoresMedicao.service/Setembro2025/valoresMedicaoSemDietas";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => <textarea data-testid="ckeditor-mock" name="ckeditor-mock" />,
}));

jest.mock(
  "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/helper",
  () => ({
    ...jest.requireActual(
      "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/helper",
    ),
    getPermissoesLancamentosEspeciaisMesAnoPorPeriodoAsync: jest.fn(() =>
      Promise.resolve({
        alimentacoes_lancamentos_especiais: [
          { name: "ALMOÇO", uuid: "uuid-almoco" },
          { name: "LANCHE", uuid: "uuid-lanche" },
        ],
        data_inicio_permissoes: "2023-10-01",
      }),
    ),
  }),
);

describe("Teste de Filtragem de Tabelas de Dieta", () => {
  const escolaUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.escola_uuid;
  const solicitacaoUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.uuid;

  const setupMocks = (withDiets = true) => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosNutriSupervisao);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
      )
      .reply(200, mockPeriodosGruposMedicaoCMCTSetembro2025);
    mock
      .onGet(`/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`)
      .reply(200, mockSolicitacaoMedicaoInicialCMCTSetembro2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
      .reply(200, {
        results: [{ dia: "07", feriado: "Dia da Independência do Brasil" }],
      });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioSetembro2025CMCT);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscola);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock.onGet("/escola-solicitacoes/inclusoes-autorizadas/").reply(200, {
      results: [],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, {
        results: [],
      });
    mock.onGet("/escolas-solicitacoes/suspensoes-autorizadas/").reply(200, {
      results: [],
    });
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { TARDE: "20bd9ca9-d499-456a-bd86-fb8f297947d6" },
    });
    if (withDiets) {
      mock
        .onGet("/medicao-inicial/valores-medicao/")
        .reply(200, mockValoresMedicaoComDietas);
    } else {
      mock
        .onGet("/medicao-inicial/valores-medicao/")
        .reply(200, mockValoresMedicaoSemDietas);
    }
  };

  const renderComponent = async () => {
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: {
                ano: "2025",
                escolaUuid: escolaUuid,
                mes: "09",
              },
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSpatPath: true,
          }}
        >
          <ToastContainer />
          <ConferenciaDosLancamentosPage />
        </MemoryRouter>,
      );
    });

    await waitFor(() => {
      expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    });
  };

  beforeEach(() => {
    process.env.IS_TEST = true;
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.NUTRI);

    const search = `?uuid=${solicitacaoUuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });
  });

  afterEach(() => {
    mock.reset();
  });

  const waitForPeriodoMANHAToLoad = async () => {
    await waitFor(() => {
      expect(screen.getByText("MANHA")).toBeInTheDocument();
    });

    const visualizarLancamentosManha = screen.getByTestId(
      "visualizar-lancamento-MANHA",
    );

    await act(async () => {
      fireEvent.click(visualizarLancamentosManha);
    });

    await waitFor(() => {
      expect(screen.getByText("FECHAR")).toBeInTheDocument();
    });

    await waitFor(() => {
      const alimentacaoElement = screen.getByTestId("categoria-ALIMENTAÇÃO");
      expect(alimentacaoElement).toBeInTheDocument();
    });
  };

  it("deve exibir tabelas de dieta quando houver valores preenchidos", async () => {
    setupMocks(true);

    await renderComponent();
    await waitForPeriodoMANHAToLoad();

    await waitFor(() => {
      expect(screen.getByTestId("categoria-ALIMENTAÇÃO")).toBeInTheDocument();

      const dietaElements = screen.queryAllByText(/DIETA ESPECIAL/i, {
        exact: false,
      });

      expect(dietaElements.length).toBeGreaterThan(0);

      const tipoAElement = Array.from(dietaElements).find((el) =>
        /tipo a/i.test(el.textContent),
      );
      expect(tipoAElement).toBeInTheDocument();
    });
  });

  it("não deve exibir tabelas de dieta quando não houver valores preenchidos", async () => {
    setupMocks(false);

    await renderComponent();
    await waitForPeriodoMANHAToLoad();

    await waitFor(() => {
      expect(screen.queryByText("DIETA ESPECIAL")).not.toBeInTheDocument();
      expect(screen.queryByText("DIETA ENTERAL")).not.toBeInTheDocument();

      expect(screen.getByTestId("categoria-ALIMENTAÇÃO")).toBeInTheDocument();
    });
  });
});
