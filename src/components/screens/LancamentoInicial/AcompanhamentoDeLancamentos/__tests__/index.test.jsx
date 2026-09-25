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
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  MODULO_GESTAO,
  PERFIL,
  TIPO_PERFIL,
  TIPO_SERVICO,
} from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosDRE } from "src/mocks/meusDados/diretoria_regional";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockGetTiposUnidadeEscolar } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockGetLotesSimples } from "src/mocks/services/lote.service/mockGetLotesSimples";
import { mockDashboardResultados } from "src/mocks/services/medicaoInicial/dashboard.service/dashboardResultados";
import { mockGetDashboardMedicaoInicial } from "src/mocks/services/medicaoInicial/dashboard.service/mockGetDashboardMedicaoInicial";
import { mockGetDashboardMedicaoInicialNoresults } from "src/mocks/services/medicaoInicial/dashboard.service/mockGetDashboardMedicaoInicialNoResults";
import { mockGetMesesAnosSolicitacoesMedicaoinicial } from "src/mocks/services/medicaoInicial/dashboard.service/mockGetMesesAnosSolicitacoesMedicaoinicial";
import mock from "src/services/_mock";

const RECREIO_MARCO_UUID = "04753691-d8a3-40ce-a133-ee975115f258";
const SOLICITACAO_CORRIGIDA_UUID = "2debcde1-3af8-405e-8c5e-3336f5c10bdb";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  ...jest.requireActual("src/components/Shareable/Toast/dialogs"),
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

const renderComponent = async (
  mockMeusDados = mockMeusDadosSuperUsuarioMedicao,
  initialEntries,
) => {
  let resultado;
  await act(async () => {
    resultado = render(
      <MemoryRouter initialEntries={initialEntries}>
        <MeusDadosContext.Provider value={{ meusDados: mockMeusDados }}>
          <AcompanhamentoDeLancamentos />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
  return resultado;
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

const setupMocks = ({
  totalHistorico = 100,
  totalRecreio = 7,
  totalizadores = mockGetDashboardMedicaoInicial,
  resultados = mockDashboardResultados,
} = {}) => {
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
    .reply(200, totalizadores);
  mock
    .onGet("/medicao-inicial/historico-acesso-ue/total-por-dre/")
    .reply(200, totalHistorico);
  mock
    .onGet("/medicao-inicial/recreio-nas-ferias/total-por-dre/")
    .reply(200, totalRecreio);
  mock
    .onGet("/medicao-inicial/solicitacao-medicao-inicial/dashboard-resultados/")
    .reply(200, resultados);
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
    jest.clearAllMocks();
    setupMocks();
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
    await renderComponent();
  });

  afterEach(() => {
    mock.reset();
    localStorage.clear();
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
      cleanup();
      setupErrorMocks(
        "/medicao-inicial/solicitacao-medicao-inicial/meses-anos/",
      );
      await renderComponent();
      await selecionarDRE();
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

      const divMesReferencia = screen.getByTestId("div-select-mes-referencia");
      const selectMesReferencia = divMesReferencia.querySelector("select");
      await act(async () => {
        fireEvent.change(selectMesReferencia, {
          target: { value: "03_2025" },
        });
      });

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

    it("deve retornar erro quando falhar ao obter os resultados do dashboard", async () => {
      setupErrorMocks(
        "/medicao-inicial/solicitacao-medicao-inicial/dashboard-resultados/",
      );

      await selecionarDRE();

      const divMesReferencia = screen.getByTestId("div-select-mes-referencia");
      const selectMesReferencia = divMesReferencia.querySelector("select");
      await act(async () => {
        fireEvent.change(selectMesReferencia, {
          target: { value: "03_2025" },
        });
      });

      await waitFor(() =>
        expect(
          screen.getByText(
            "Erro ao carregados dashboard de medição inicial. Tente novamente mais tarde.",
          ),
        ).toBeInTheDocument(),
      );
    });
  });

  describe("Interações com a interface", () => {
    const solicitacaoCorrigida = {
      uuid: SOLICITACAO_CORRIGIDA_UUID,
      escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
      escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
      mes: "03",
      ano: "2025",
      mes_ano: "Março 2025",
      tipo_unidade: "EMEF",
      status: "Corrigido para CODAE",
      pendente_acao_dre: true,
      log_mais_recente: "20/03/2025 10:00",
      dre_ciencia_correcao_data: null,
      todas_medicoes_e_ocorrencia_aprovados_por_medicao: true,
      escola_cei_com_inclusao_parcial_autorizada: false,
      sem_lancamentos: false,
    };

    const prepararCenarioCienciaDRE = async (statusResposta, dadosResposta) => {
      cleanup();
      mock.reset();
      setupMocks({
        totalizadores: {
          results: [
            {
              status: "MEDICAO_CORRIGIDA_PARA_CODAE",
              label: "Corrigido para CODAE",
              total: 1,
              dados: [solicitacaoCorrigida],
              total_pendentes_acao_dre: 1,
              possui_pendencias_acao_dre: true,
            },
          ],
        },
        resultados: {
          results: {
            total: 1,
            dados: [solicitacaoCorrigida],
          },
        },
      });
      mock.onGet("/grupos-unidade-escolar/por-dre/").reply(200, { grupos: [] });
      mock
        .onPatch(
          `/medicao-inicial/solicitacao-medicao-inicial/${SOLICITACAO_CORRIGIDA_UUID}/`,
        )
        .reply(statusResposta, dadosResposta);
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
      const resultadoRenderizacao = await renderComponent(mockMeusDadosDRE);

      const seletorMes = screen
        .getByTestId("div-select-mes-referencia")
        .querySelector("select");
      await act(async () => {
        fireEvent.change(seletorMes, { target: { value: "03_2025" } });
      });

      const card = await screen.findByTestId("MEDICAO_CORRIGIDA_PARA_CODAE");
      fireEvent.click(card);

      await act(async () => {
        fireEvent.click(screen.getByText("Filtrar"));
      });

      await screen.findByText("EMEF PERICLES EUGENIO DA SILVA RAMOS");
      return resultadoRenderizacao.container
        .querySelector(".fa-edit")
        .closest("button");
    };

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

          const divMesReferencia = screen.getByTestId(
            "div-select-mes-referencia",
          );
          const selectMesReferencia = divMesReferencia.querySelector("select");
          await act(async () => {
            fireEvent.change(selectMesReferencia, {
              target: { value: "03_2025" },
            });
          });

          await waitFor(() =>
            expect(screen.getByText("Aprovado pela DRE")).toBeInTheDocument(),
          );
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

    it("deve exibir a label com total de unidades da DRE ao selecionar DRE e mês", async () => {
      await selecionarDRE();
      setMesReferencia();

      await waitFor(() =>
        expect(
          screen.getByText("Total de Unidades da DRE: 100"),
        ).toBeInTheDocument(),
      );
    });

    it("deve exibir a label com total de unidades com recreio nas férias da DRE", async () => {
      await selecionarDRE();

      await waitFor(() => {
        expect(
          screen.getByRole("option", { name: "recreio março" }),
        ).toBeInTheDocument();
      });

      const divMesReferencia = screen.getByTestId("div-select-mes-referencia");
      const selectMesReferencia = divMesReferencia.querySelector("select");

      mock.resetHistory();

      await act(async () => {
        fireEvent.change(selectMesReferencia, {
          target: { value: `03_2025|${RECREIO_MARCO_UUID}` },
        });
      });

      await waitFor(() =>
        expect(
          screen.getByText(
            "Total de Unidades com Recreio nas Férias da DRE: 7",
          ),
        ).toBeInTheDocument(),
      );

      const requisicoesTotalRecreio = mock.history.get.filter((request) =>
        request.url.includes(
          "medicao-inicial/recreio-nas-ferias/total-por-dre/",
        ),
      );
      const requisicoesTotalHistorico = mock.history.get.filter((request) =>
        request.url.includes(
          "medicao-inicial/historico-acesso-ue/total-por-dre/",
        ),
      );

      expect(requisicoesTotalRecreio).toHaveLength(1);
      expect(requisicoesTotalHistorico).toHaveLength(0);
      expect(requisicoesTotalRecreio[0].params).toEqual(
        expect.objectContaining({
          recreio_nas_ferias_uuid: RECREIO_MARCO_UUID,
          dre_uuid: "3972e0e9-2d8e-472a-9dfa-30cd219a6d9a",
        }),
      );
    });

    it("não deve exibir a label quando o total do recreio nas férias for zero", async () => {
      cleanup();
      mock.reset();
      setupMocks({ totalRecreio: 0 });
      await renderComponent();

      await selecionarDRE();

      await waitFor(() => {
        expect(
          screen.getByRole("option", { name: "recreio março" }),
        ).toBeInTheDocument();
      });

      const divMesReferencia = screen.getByTestId("div-select-mes-referencia");
      const selectMesReferencia = divMesReferencia.querySelector("select");

      await act(async () => {
        fireEvent.change(selectMesReferencia, {
          target: { value: `03_2025|${RECREIO_MARCO_UUID}` },
        });
      });

      await waitFor(() =>
        expect(screen.getByTestId("TODOS_OS_LANCAMENTOS")).toBeInTheDocument(),
      );

      expect(
        screen.queryByText(/Total de Unidades da DRE:/),
      ).not.toBeInTheDocument();
    });

    it("não deve requisitar total de unidades da DRE para usuário escola sem seletor de DRE", async () => {
      cleanup();
      mock.reset();
      setupMocks();
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
      localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
      localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

      await renderComponent(mockMeusDadosEscolaEMEFPericles);

      await waitFor(() =>
        expect(
          screen.getByTestId("MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE"),
        ).toBeInTheDocument(),
      );

      expect(
        screen.queryByText(/Total de Unidades da DRE:/),
      ).not.toBeInTheDocument();
      expect(
        mock.history.get.filter((request) =>
          request.url.includes(
            "/medicao-inicial/historico-acesso-ue/total-por-dre/",
          ),
        ),
      ).toHaveLength(0);
    });

    it("deve exibir a label com total de unidades da DRE para usuário DRE ao selecionar mês", async () => {
      cleanup();
      mock.reset();
      setupMocks();
      mock.onGet("/grupos-unidade-escolar/por-dre/").reply(200, { grupos: [] });
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
      await renderComponent(mockMeusDadosDRE);

      await waitFor(() =>
        expect(
          screen.getByTestId("div-select-mes-referencia"),
        ).toBeInTheDocument(),
      );

      const divMesReferencia = screen.getByTestId("div-select-mes-referencia");
      const selectMesReferencia = divMesReferencia.querySelector("select");
      await act(async () => {
        fireEvent.change(selectMesReferencia, {
          target: { value: "03_2025" },
        });
      });

      await waitFor(() =>
        expect(
          screen.getByText("Total de Unidades da DRE: 100"),
        ).toBeInTheDocument(),
      );

      const requisicoesTotal = mock.history.get.filter((request) =>
        request.url.includes(
          "medicao-inicial/historico-acesso-ue/total-por-dre/",
        ),
      );
      expect(requisicoesTotal.length).toBeGreaterThan(0);
      expect(requisicoesTotal[0].params).toEqual(
        expect.objectContaining({
          dre_uuid: "3972e0e9-2d8e-472a-9dfa-30cd219a6d9a",
        }),
      );
    });

    it("deve sinalizar e filtrar itens pendentes de ação da DRE", async () => {
      cleanup();
      mock.reset();
      setupMocks({
        totalizadores: {
          results: [
            {
              status: "MEDICAO_CORRIGIDA_PARA_CODAE",
              label: "Corrigido para CODAE",
              total: 1,
              total_pendentes_acao_dre: 1,
              possui_pendencias_acao_dre: true,
            },
          ],
        },
        resultados: {
          results: {
            total: 1,
            dados: [
              {
                uuid: "2debcde1-3af8-405e-8c5e-3336f5c10bdb",
                escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
                escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
                mes: "03",
                ano: "2025",
                mes_ano: "Março 2025",
                tipo_unidade: "EMEF",
                status: "Corrigido para CODAE",
                pendente_acao_dre: true,
                log_mais_recente: "20/03/2025 10:00",
                dre_ciencia_correcao_data: null,
                todas_medicoes_e_ocorrencia_aprovados_por_medicao: true,
                escola_cei_com_inclusao_parcial_autorizada: false,
                sem_lancamentos: false,
              },
            ],
          },
        },
      });
      mock.onGet("/grupos-unidade-escolar/por-dre/").reply(200, { grupos: [] });
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
      await renderComponent(mockMeusDadosDRE);

      const seletorMes = screen
        .getByTestId("div-select-mes-referencia")
        .querySelector("select");
      await act(async () => {
        fireEvent.change(seletorMes, { target: { value: "03_2025" } });
      });

      const card = await screen.findByTestId("MEDICAO_CORRIGIDA_PARA_CODAE");
      expect(
        screen.getByText("Existem itens pendentes de ação"),
      ).toBeInTheDocument();
      expect(
        card.querySelector(".icone-warning-pendencia"),
      ).toBeInTheDocument();

      fireEvent.click(card);
      const checkbox = await screen.findByRole("checkbox", {
        name: "Exibir itens pendentes de ação",
      });
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      fireEvent.click(screen.getByText("Filtrar"));

      await waitFor(() => {
        const requisicoes = mock.history.get.filter((request) =>
          request.url.includes("dashboard-resultados"),
        );
        const ultimaRequisicao = requisicoes[requisicoes.length - 1];
        expect(ultimaRequisicao.params).toEqual(
          expect.objectContaining({ somente_pendentes_acao_dre: true }),
        );
      });
      expect(
        await screen.findByText("EMEF PERICLES EUGENIO DA SILVA RAMOS"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Item pendente de ação"),
      ).toBeInTheDocument();

      fireEvent.click(screen.getByText("Limpar"));
      await waitFor(() => expect(checkbox).not.toBeChecked());
    });

    it("deve confirmar a ciência das correções pela DRE", async () => {
      const botaoCiencia = await prepararCenarioCienciaDRE(200, {});

      await act(async () => {
        fireEvent.click(botaoCiencia);
      });

      await waitFor(() =>
        expect(toastSuccess).toHaveBeenCalledWith(
          "Assinatura confirmada com sucesso!",
        ),
      );
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe(
        `medicao-inicial/solicitacao-medicao-inicial/${SOLICITACAO_CORRIGIDA_UUID}/`,
      );
    });

    it("deve exibir erro quando não for possível confirmar a ciência pela DRE", async () => {
      const botaoCiencia = await prepararCenarioCienciaDRE(400, {
        detail: "Não foi possível confirmar a ciência.",
      });

      await act(async () => {
        fireEvent.click(botaoCiencia);
      });

      await waitFor(() =>
        expect(toastError).toHaveBeenCalledWith(
          "Não foi possível confirmar a ciência.",
        ),
      );
      expect(toastSuccess).not.toHaveBeenCalled();
    });

    it("deve exibir a label com total de unidades da DRE para usuário Terceirizada ao selecionar DRE e mês", async () => {
      cleanup();
      mock.reset();
      setupMocks();
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
      localStorage.setItem("perfil", PERFIL.USUARIO_EMPRESA);
      localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);
      await renderComponent(mockMeusDadosTerceirizada);

      await selecionarDRE();

      const divMesReferencia = screen.getByTestId("div-select-mes-referencia");
      const selectMesReferencia = divMesReferencia.querySelector("select");
      await act(async () => {
        fireEvent.change(selectMesReferencia, {
          target: { value: "03_2025" },
        });
      });

      await waitFor(() =>
        expect(
          screen.getByText("Total de Unidades da DRE: 100"),
        ).toBeInTheDocument(),
      );
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
      setMesReferencia();

      await waitFor(() =>
        expect(screen.getByTestId("TODOS_OS_LANCAMENTOS")).toBeInTheDocument(),
      );
      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

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
      setMesReferencia();

      await waitFor(() =>
        expect(screen.getByTestId("TODOS_OS_LANCAMENTOS")).toBeInTheDocument(),
      );
      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

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

    it("nao deve limpar o mes_ano ao clicar no botão Limpar", async () => {
      await selecionarDRE();
      const selectMes = setMesReferencia();

      await waitFor(() =>
        expect(screen.getByTestId("TODOS_OS_LANCAMENTOS")).toBeInTheDocument(),
      );
      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);

      const botaoLimpar = screen.getByText("Limpar");
      await act(async () => {
        fireEvent.click(botaoLimpar);
      });

      expect(selectMes.value).toBe("03_2025");
    });

    const setOcorrencias = (value = "true") => {
      const divOcorrencias = screen.getByTestId("div-select-ocorrencias");
      const select = within(divOcorrencias).getByRole("combobox");
      fireEvent.change(select, { target: { value: value } });
      return select;
    };

    it("deve selecionar 'Com ocorrências' e depois limpar o campo", async () => {
      await selecionarDRE();
      setMesReferencia();

      await waitFor(() =>
        expect(screen.getByTestId("TODOS_OS_LANCAMENTOS")).toBeInTheDocument(),
      );
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

    it("deve filtrar os resultados com ocorrências", async () => {
      await selecionarDRE();
      setMesReferencia();

      await waitFor(() =>
        expect(screen.getByTestId("TODOS_OS_LANCAMENTOS")).toBeInTheDocument(),
      );
      const statusCard = screen.getByTestId("TODOS_OS_LANCAMENTOS");
      fireEvent.click(statusCard);
      setOcorrencias("true");
      mock.resetHistory();

      const botaoFiltrar = screen.getByText("Filtrar");
      await act(async () => {
        fireEvent.click(botaoFiltrar);
      });

      await waitFor(() => {
        const requisicaoResultados = mock.history.get.find((request) =>
          request.url.includes("dashboard-resultados"),
        );
        expect(requisicaoResultados.params).toEqual(
          expect.objectContaining({
            ocorrencias: "true",
          }),
        );
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

    it("não deve reconstruir o mês quando o Recreio nas Férias da URL não existir", async () => {
      const recreioInexistenteUUID = "91ce7c10-2708-4a29-a358-8dfb5b16b43c";
      cleanup();
      mock.reset();
      setupMocks();
      mock.onGet("/grupos-unidade-escolar/por-dre/").reply(200, { grupos: [] });
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);

      await renderComponent(mockMeusDadosDRE, [
        `/?recreio_nas_ferias=${recreioInexistenteUUID}`,
      ]);

      const seletorMes = screen
        .getByTestId("div-select-mes-referencia")
        .querySelector("select");

      await waitFor(() =>
        expect(
          screen.getByRole("option", { name: "recreio março" }),
        ).toBeInTheDocument(),
      );
      expect(seletorMes.value).toBe("");
      expect(
        mock.history.get.filter((request) =>
          request.url.includes("dashboard-resultados"),
        ),
      ).toHaveLength(0);
    });

    it("deve requisitar o dashboard com recreio_nas_ferias e manter o recreio selecionado", async () => {
      await selecionarDRE();

      await waitFor(() => {
        expect(
          screen.getByRole("option", { name: "recreio março" }),
        ).toBeInTheDocument();
      });

      const divMesReferencia = screen.getByTestId("div-select-mes-referencia");
      const selectMesReferencia = divMesReferencia.querySelector("select");

      mock.resetHistory();

      await act(async () => {
        fireEvent.change(selectMesReferencia, {
          target: { value: `03_2025|${RECREIO_MARCO_UUID}` },
        });
      });

      await waitFor(() => {
        const requisicaoTotalizadores = mock.history.get.find((request) =>
          request.url.includes(
            "medicao-inicial/solicitacao-medicao-inicial/dashboard-totalizadores/",
          ),
        );
        const requisicaoResultados = mock.history.get.find((request) =>
          request.url.includes(
            "medicao-inicial/solicitacao-medicao-inicial/dashboard-resultados/",
          ),
        );

        expect(requisicaoTotalizadores).toBeDefined();
        expect(requisicaoResultados).toBeDefined();
      });

      const requisicaoTotalizadores = mock.history.get.find((request) =>
        request.url.includes(
          "medicao-inicial/solicitacao-medicao-inicial/dashboard-totalizadores/",
        ),
      );
      const requisicaoResultados = mock.history.get.find((request) =>
        request.url.includes(
          "medicao-inicial/solicitacao-medicao-inicial/dashboard-resultados/",
        ),
      );

      expect(requisicaoTotalizadores.params).toEqual(
        expect.objectContaining({
          dre: "3972e0e9-2d8e-472a-9dfa-30cd219a6d9a",
          mes_ano: "03_2025",
          recreio_nas_ferias: RECREIO_MARCO_UUID,
        }),
      );
      expect(requisicaoResultados.params).toEqual(
        expect.objectContaining({
          dre: "3972e0e9-2d8e-472a-9dfa-30cd219a6d9a",
          mes_ano: "03_2025",
          recreio_nas_ferias: RECREIO_MARCO_UUID,
        }),
      );
      expect(selectMesReferencia.value).toBe(`03_2025|${RECREIO_MARCO_UUID}`);
      expect(
        within(selectMesReferencia).getByRole("option", {
          name: "recreio março",
        }).selected,
      ).toBe(true);
    });
  });
});
