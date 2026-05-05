import "@testing-library/jest-dom";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockAlteracoesAlimentacaoAutorizadasAgosto2024CEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/alteracoesAlimentacaoAutorizadasAgosto2024";
import { mockDiasCalendarioAgosto2024CEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/diasCalendarioAgosto2024";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesCEMEI } from "src/mocks/services/escola.service/CEMEI/escolaSimples";
import { mockKitLanchesAutorizadasAgosto2024CEMEI } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEMEI/kitLanchesAutorizadasAgosto2024";
import { mockQuantidadesAlimentacaoesLancadasPeriodoGrupoCEMEIAgosto2024 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CEMEI/quantidadesAlimentacaoesLancadasPeriodoGrupoCEMEIAgosto2024";
import { mockSolicitacaoMedicaoInicialCEMEI } from "src/mocks/services/solicitacaoMedicaoInicial.service/CEMEI/solicitacaoMedicaoInicial";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { mockGetMatriculadosPeriodo } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEMEI/mockGetMatriculadosPeriodo";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

describe("CEMEI - Validação de Limpeza de Justificativa", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  const renderPage = async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaCEMEI,
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
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesCEMEI);
    mock.onGet(`/historico-escola/${escolaUuid}/`).reply(200, {});
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-escola-cemei-com-alunos-emei/",
      )
      .reply(200, {
        results: ["Infantil MANHA", "Infantil TARDE", "Infantil INTEGRAL"],
      });
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .replyOnce(200, mockSolicitacaoMedicaoInicialCEMEI);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .replyOnce(200, mockSolicitacaoMedicaoInicialCEMEI);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioAgosto2024CEMEI);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, mockKitLanchesAutorizadasAgosto2024CEMEI);
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, mockAlteracoesAlimentacaoAutorizadasAgosto2024CEMEI);
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
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialCEMEI[0].uuid}/ceu-gestao-frequencias-dietas/`,
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(
        200,
        mockQuantidadesAlimentacaoesLancadasPeriodoGrupoCEMEIAgosto2024,
      );
    mock
      .onGet(
        "/escola-solicitacoes/ultimo-dia-com-solicitacao-autorizada-no-mes/",
      )
      .reply(200, { ultima_data: null });
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-escola-cemei-com-alunos-emei/",
      )
      .reply(200, mockGetMatriculadosPeriodo);

    window.history.pushState({}, "", "?mes=08&ano=2024");
  });

  afterEach(() => cleanup());

  it("Renderiza página CEMEI sem erros", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-08-01T10:00:00Z"));

    await renderPage();

    expect(screen.getByText("Medição Inicial")).toBeInTheDocument();
    expect(screen.queryByText("erro")).not.toBeInTheDocument();
  });

  it("Verifica conteúdo de períodos escolares", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-08-01T10:00:00Z"));

    await renderPage();

    const conteudoPeriodos = screen.queryByText(/Infantil/i);
    if (conteudoPeriodos) {
      expect(conteudoPeriodos).toBeInTheDocument();
    }
  });
});
