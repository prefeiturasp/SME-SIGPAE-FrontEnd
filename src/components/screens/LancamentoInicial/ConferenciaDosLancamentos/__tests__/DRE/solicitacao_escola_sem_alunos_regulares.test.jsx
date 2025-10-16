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
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMedicaoMANHAAprovadaCMCTSetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/medicaoMANHAAprovada";
import { mockPermissoesLancamentosEspeciaisCMCTSetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/permissoesLancamentosEspeciais";
import { mockValoresMedicaoCMCTMANHASetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/valoresMedicaoMANHA";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "src/mocks/services/cadastroTipoAlimentacao.service/CMCT/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { mockPeriodosGruposMedicaoCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/periodosGruposMedicao";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

describe("Teste Conferência de Lançamentos - Usuário DRE - Solicitação CMCT (Escola sem alunos regulares)", () => {
  const escolaUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.escola_uuid;
  const solicitacaoUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.uuid;
  const MANHAuuid = mockPeriodosGruposMedicaoCMCTSetembro2025.results.find(
    (periodo) => periodo.nome_periodo_grupo === "MANHA",
  ).uuid_medicao_periodo_grupo;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
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
      .reply(200, ["2025-09-02"]);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: {
                ano: "2025",
                escolaUuid: "f206b315-fa30-4768-9fa6-07b952800284",
                mes: "09",
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

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

    const search = `?uuid=${solicitacaoUuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });
  });

  const carregaMedicaoManha = () => {
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicaoCMCTMANHASetembro2025);
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/",
      )
      .reply(200, mockPermissoesLancamentosEspeciaisCMCTSetembro2025);
    mock.onGet("/escola-solicitacoes/inclusoes-autorizadas/").reply(200, {
      results: [
        {
          dia: "02",
          periodo: "MANHA",
          alimentacoes: "lanche_4h, lanche, sobremesa",
          numero_alunos: 100,
          dias_semana: [],
          inclusao_id_externo: "E1351",
        },
      ],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escolas-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
  };

  it("Renderiza título da página `Conferência dos Lançamentos`", () => {
    expect(screen.getAllByText("Conferência dos Lançamentos").length).toBe(2);
  });

  it("renderiza valor `Setembro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Setembro / 2025");
  });

  it("Renderiza label `Mês do Lançamento`", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("Renderiza status de progresso `Recebido para análise`", () => {
    expect(screen.getByText("Recebido para análise")).toBeInTheDocument();
  });

  it("Renderiza medições da solicitação", () => {
    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText("NOITE")).toBeInTheDocument();
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
    expect(screen.getByText("Solicitações de Alimentação")).toBeInTheDocument();
  });

  it("Visualiza `MANHA` com campo `Número de Alunos` renderizado", async () => {
    const visualizarLancamentosManha = screen.getByTestId(
      "visualizar-lancamento-MANHA",
    );

    carregaMedicaoManha();

    await act(async () => {
      fireEvent.click(visualizarLancamentosManha);
    });

    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Número de Alunos")).toBeInTheDocument();
    expect(screen.getByText("2ª Refeição 1ª oferta")).toBeInTheDocument();
  });

  it("Aprova período `MANHA`", async () => {
    const visualizarLancamentosManha = screen.getByTestId(
      "visualizar-lancamento-MANHA",
    );

    carregaMedicaoManha();

    await act(async () => {
      fireEvent.click(visualizarLancamentosManha);
    });

    const botaoAprovarPeriodo = screen
      .getByText("Aprovar Período")
      .closest("button");
    fireEvent.click(botaoAprovarPeriodo);

    await waitFor(() => {
      expect(screen.getByText("Sim")).toBeInTheDocument();
    });

    const botaoSim = screen.getByText("Sim").closest("button");

    mock
      .onPatch(`/medicao-inicial/medicao/${MANHAuuid}/dre-aprova-medicao/`)
      .reply(200, mockMedicaoMANHAAprovadaCMCTSetembro2025);

    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(
        screen.getByText("Período Manhã aprovado com sucesso!"),
      ).toBeInTheDocument();
    });
  });
});
