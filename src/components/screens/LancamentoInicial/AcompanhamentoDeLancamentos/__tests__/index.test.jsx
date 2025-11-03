import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AcompanhamentoDeLancamentos } from "src/components/screens/LancamentoInicial/AcompanhamentoDeLancamentos";
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockGetTiposUnidadeEscolar } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockGetLotesSimples } from "src/mocks/services/lote.service/mockGetLotesSimples";
import { mockDashboardResultados } from "src/mocks/services/medicaoInicial/dashboard.service/dashboardResultados";
import { mockGetDashboardMedicaoInicial } from "src/mocks/services/medicaoInicial/dashboard.service/mockGetDashboardMedicaoInicial";
import { mockGetDashboardMedicaoInicialNoresults } from "src/mocks/services/medicaoInicial/dashboard.service/mockGetDashboardMedicaoInicialNoResults";
import { mockGetMesesAnosSolicitacoesMedicaoinicial } from "src/mocks/services/medicaoInicial/dashboard.service/mockGetMesesAnosSolicitacoesMedicaoinicial";
import mock from "src/services/_mock";

const renderComponent = async (
  mockMeusDados = mockMeusDadosSuperUsuarioMedicao,
) => {
  await act(async () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider value={{ meusDados: mockMeusDados }}>
          <AcompanhamentoDeLancamentos />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const selecionarDRE = async () => {
  await act(async () => {
    fireEvent.mouseDown(
      screen
        .getByTestId("select-diretoria-regional")
        .querySelector(".ant-select-selection-search-input"),
    );
  });

  await waitFor(() => screen.getByText("IPIRANGA"));
  await act(async () => {
    fireEvent.click(screen.getByText("IPIRANGA"));
  });
};

const setupMocks = () => {
  mock
    .onGet("/diretorias-regionais-simplissima/")
    .reply(200, mockDiretoriaRegionalSimplissima);
  mock.onGet("/tipos-unidade-escolar/").reply(200, mockGetTiposUnidadeEscolar);
  mock
    .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
    .reply(200, mockGetMesesAnosSolicitacoesMedicaoinicial);
  mock
    .onGet("/usuarios/meus-dados/")
    .reply(200, mockMeusDadosSuperUsuarioMedicao);
  mock
    .onGet(
      "/medicao-inicial/solicitacao-medicao-inicial/dashboard-totalizadores/",
    )
    .reply(200, mockGetDashboardMedicaoInicial);
  mock
    .onGet("/medicao-inicial/solicitacao-medicao-inicial/dashboard-resultados/")
    .reply(200, mockDashboardResultados);
  mock
    .onGet("/escolas-simplissima-com-dre-unpaginated/terc-total/")
    .reply(200, mockGetEscolaTercTotal);
  mock.onGet("/lotes-simples/").reply(200, mockGetLotesSimples);
};

const setupErrorMocks = (endpoint) => {
  mock.onGet(endpoint).reply(500);
};

describe("AcompanhamentoDeLancamentos", () => {
  beforeEach(async () => {
    setupMocks();
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
    await renderComponent();
  });

  afterEach(() => {
    mock.reset();
    cleanup();
  });

  describe("Erros de API", () => {
    it("deve retornar erro quando falhar ao obter diretorias regionais", async () => {
      setupErrorMocks("/diretorias-regionais-simplissima/");
      await renderComponent();
      await waitFor(() => screen.getByText("Erro ao carregar DREs"));
      expect(screen.getByText("Erro ao carregar DREs")).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter tipos de unidade escolar", async () => {
      setupErrorMocks("/tipos-unidade-escolar/");
      await renderComponent();
      await waitFor(() =>
        screen.getByText(
          "Erro ao carregar tipos de unidades. Tente novamente mais tarde.",
        ),
      );
      expect(
        screen.getByText(
          "Erro ao carregar tipos de unidades. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter meses e anos para solicitação de medição inicial", async () => {
      setupErrorMocks(
        "/medicao-inicial/solicitacao-medicao-inicial/meses-anos/",
      );
      await renderComponent();
      await waitFor(() =>
        screen.getByText(
          "Erro ao carregar meses/anos das solicitações de medição inicial. Tente novamente mais tarde.",
        ),
      );
      expect(
        screen.getByText(
          "Erro ao carregar meses/anos das solicitações de medição inicial. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter escolas simplificadas com DRE", async () => {
      setupErrorMocks("/escolas-simplissima-com-dre-unpaginated/terc-total/");

      await selecionarDRE();

      await waitFor(() =>
        screen.getByText(
          /Erro ao carregar escolas. Tente novamente mais tarde./,
        ),
      );
      expect(
        screen.getByText(
          /Erro ao carregar escolas. Tente novamente mais tarde./,
        ),
      ).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter lotes simples", async () => {
      setupErrorMocks("/lotes-simples/");

      await selecionarDRE();

      await waitFor(() =>
        screen.getByText(/Erro ao carregar lotes. Tente novamente mais tarde./),
      );
      expect(
        screen.getByText(/Erro ao carregar lotes. Tente novamente mais tarde./),
      ).toBeInTheDocument();
    });

    it("deve retornar erro quando falhar ao obter dashboard de medição inicial", async () => {
      setupErrorMocks(
        "/medicao-inicial/solicitacao-medicao-inicial/dashboard-totalizadores/",
      );

      await selecionarDRE();

      await waitFor(() =>
        screen.getByText(
          /Erro ao carregados dashboard de medição inicial. Tente novamente mais tarde./,
        ),
      );
      expect(
        screen.getByText(
          /Erro ao carregados dashboard de medição inicial. Tente novamente mais tarde./,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Interações com a interface", () => {
    describe("selecionar DRE Ipiranga com diferentes perfis", () => {
      const perfis = [
        {
          nome: "Medicao",
          localStorage: {
            tipo_perfil: TIPO_PERFIL.MEDICAO,
          },
        },
        {
          nome: "Terceirizada",
          localStorage: {
            tipo_perfil: TIPO_PERFIL.TERCEIRIZADA,
            perfil: PERFIL.USUARIO_EMPRESA,
            tipo_servico: TIPO_SERVICO.TERCEIRIZADA,
          },
        },
        {
          nome: "SupervisaoNutri",
          localStorage: {
            tipo_perfil: TIPO_PERFIL.SUPERVISAO_NUTRICAO,
            perfil: PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO,
          },
        },
      ];

      it.each(perfis)(
        "selecionar DRE Ipiranga - Perfil $nome",
        async ({ localStorage: ls }) => {
          cleanup();
          Object.entries(ls).forEach(([key, value]) =>
            localStorage.setItem(key, value),
          );
          await renderComponent();

          await selecionarDRE();

          expect(screen.getByText("Aprovado pela DRE")).toBeInTheDocument();
          expect(
            screen.getByText(
              "Selecione os status acima para visualizar a listagem detalhada",
            ),
          ).toBeInTheDocument();
        },
      );
    });

    it("não deve encontrar o seletor caso use um Perfil não permitido", async () => {
      cleanup();
      localStorage.setItem("tipo_perfil", "PERFIL_SEM_PERMISSAO");
      localStorage.setItem("perfil", "PERFIL_SEM_PERMISSAO");
      localStorage.setItem("tipo_servico", "SERVICO_SEM_PERMISSAO");
      await renderComponent();

      const seletor = screen.queryByTestId("select-diretoria-regional");

      expect(seletor).not.toBeInTheDocument();
    });

    const setMesReferencia = () => {
      const divMesReferencia = screen.getByTestId("div-select-mes-referencia");
      const selectMesReferencia = divMesReferencia.querySelector("select");
      fireEvent.change(selectMesReferencia, {
        target: { value: "03_2025" },
      });
      return selectMesReferencia;
    };

    it("deve exibir o modal filtragem com resultados", async () => {
      await selecionarDRE();

      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

      setMesReferencia();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      await waitFor(() => screen.getByText("Resultados"));
      expect(screen.getByText("Resultados")).toBeInTheDocument();
      expect(screen.getByText("Nome da UE")).toBeInTheDocument();
    });

    it("deve exibir o modal filtragem sem resultados", async () => {
      await selecionarDRE();

      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

      setMesReferencia();

      mock
        .onGet(
          "/medicao-inicial/solicitacao-medicao-inicial/dashboard-totalizadores/",
        )
        .reply(200, mockGetDashboardMedicaoInicialNoresults);
      mock
        .onGet(
          "/medicao-inicial/solicitacao-medicao-inicial/dashboard-resultados/",
        )
        .reply(200, { results: { total: 0, dados: [] } });

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      await waitFor(() => screen.getByText("Nenhum resultado encontrado."));
      expect(
        screen.getByText("Nenhum resultado encontrado."),
      ).toBeInTheDocument();
    });

    it("deve limpar os filtros ao clicar no botão Limpar", async () => {
      await selecionarDRE();

      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

      const selectMes = setMesReferencia();

      const botaoLimpar = screen.getByText("Limpar");
      await act(async () => {
        fireEvent.click(botaoLimpar);
      });

      expect(selectMes.value).toBe("");
    });

    const setOcorrencias = (value = "true") => {
      const divOcorrencias = screen.getByTestId("div-select-ocorrencias");
      const select = within(divOcorrencias).getByRole("combobox");
      fireEvent.change(select, { target: { value: value } });
      return select;
    };

    it("deve selecionar 'Com ocorrências' e depois limpar o campo", async () => {
      await selecionarDRE();

      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

      const selectOcorrencias = setOcorrencias();
      expect(
        within(selectOcorrencias).getByRole("option", {
          name: "Com ocorrências",
        }).selected,
      ).toBe(true);

      const botaoLimpar = screen.getByText("Limpar");
      await act(async () => {
        fireEvent.click(botaoLimpar);
      });

      expect(selectOcorrencias.value).toBe("");
      expect(
        within(selectOcorrencias).getByRole("option", {
          name: "Selecione a Avaliação do Serviço",
        }).selected,
      ).toBe(true);
    });

    it("deve preencher mes e ocorrencias, filtrar e verificar resultados", async () => {
      await selecionarDRE();

      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

      setMesReferencia();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      await waitFor(async () => {
        expect(
          await screen.findAllByText("CEI DIRET OLGA BENARIO PRESTES"),
        ).toHaveLength(7);
        expect(await screen.findAllByText("EMEF M BOI MIRIM I")).toHaveLength(
          1,
        );
      });
    });
  });
});
