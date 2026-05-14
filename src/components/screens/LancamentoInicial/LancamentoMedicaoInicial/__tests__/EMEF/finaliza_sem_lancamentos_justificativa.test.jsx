import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasCalendarioEMEFMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Maio2025/diasCalendario";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesEMEF } from "src/mocks/services/escola.service/EMEF/escolaSimples";
import { quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Maio2025/quantidadesAlimentacaoesLancadasPeriodoGrupo";
import { mockSolicitacaoMedicaoInicialEMEFMaio2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEF/solicitacaoMedicaoInicialMaio2025";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("EMEF - Validação de Limpeza de Justificativa", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  const renderPage = async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  beforeEach(() => {
    mock.reset();
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesEMEF);
    mock.onGet(`/historico-escola/${escolaUuid}/`).reply(200, {});
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet("/medicao-inicial/recreio-nas-ferias/")
      .reply(200, { count: 0, next: null, previous: null, results: [] });
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .replyOnce(200, mockSolicitacaoMedicaoInicialEMEFMaio2025);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .replyOnce(200, mockSolicitacaoMedicaoInicialEMEFMaio2025);
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioEMEFMaio2025);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock
      .onGet("/periodos-escolares/inclusao-continua-por-mes/")
      .reply(200, {
        periodos: { MANHA: "5067e137-e5f3-4876-a63f-7f58cce93f33" },
      });
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
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
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialEMEFMaio2025[0].uuid}/ceu-gestao-frequencias-dietas/`,
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025);
    mock
      .onGet(
        "/escola-solicitacoes/ultimo-dia-com-solicitacao-autorizada-no-mes/",
      )
      .reply(200, { ultima_data: null });

    window.history.pushState({}, "", "?mes=05&ano=2025");
  });

  afterEach(() => cleanup());

  it("Renderiza períodos escolares de EMEF", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-06-01T10:00:00Z"));

    await renderPage();

    expect(screen.getByText("Manhã")).toBeInTheDocument();
    expect(screen.getByText("Tarde")).toBeInTheDocument();
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Botão Finalizar sem lançamentos desabilitado", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-06-01T10:00:00Z"));

    await renderPage();

    expect(
      screen.getByText("Finalizar sem lançamentos").closest("button"),
    ).toBeDisabled();
  });

  it("Não abre modal com botão desabilitado", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-06-01T10:00:00Z"));

    await renderPage();

    const botaoFinalizarSemLancamentos = screen
      .getByText("Finalizar sem lançamentos")
      .closest("button");
    expect(botaoFinalizarSemLancamentos).toBeDisabled();

    fireEvent.click(botaoFinalizarSemLancamentos);

    expect(
      screen.queryByText("Finalizar Medição Inicial sem Lançamentos"),
    ).not.toBeInTheDocument();
  });

  it("Botão Finalizar habilitado", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-06-01T10:00:00Z"));

    await renderPage();

    const botaoFinalizar = screen.getByText("Finalizar");
    expect(botaoFinalizar).toBeInTheDocument();
    expect(botaoFinalizar).not.toBeDisabled();
  });
});
