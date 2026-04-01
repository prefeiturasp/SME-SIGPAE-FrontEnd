import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioCEUGESTAO_NOVEMBRO24 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/diasCalendarioCEUGESTAO_NOVEMBRO24";
import { mockMeusDadosEscolaCEUGESTAO } from "src/mocks/meusDados/escolaCeuGestao";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO } from "src/mocks/services/cadastroTipoAlimentacao.service/CEUGESTAO/mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO";
import { mockGetEscolaSimplesCEUGESTAO } from "src/mocks/services/escola.service/CEUGESTAO/mockGetEscolaSimplesCEUGESTAO";
import { mockgetEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscola } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEUGESTAO/getEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscolaCEUGESTAO";
import { mockGetPeriodosInclusaoContinuaCEUGESTAO } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEUGESTAO/getPeriodosInclusaoContinuaCEUGESTAO";
import { mockGetSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEUGESTAO/getSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO";
import { mockGetQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CEUGESTAO/getQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO";
import { mockGetSolicitacaoMedicaoInicialCEUGESTAO } from "src/mocks/services/solicitacaoMedicaoInicial.service/CEUGESTAO/getSolicitacaoMedicaoInicialCEUGESTAO";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Finaliza Lançamento com Ocorrências", () => {
  const renderPage = async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          {" "}
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaCEUGESTAO,
              setMeusDados: jest.fn(),
            }}
          >
            <ToastContainer />
            <LancamentoMedicaoInicialPage />
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
      .reply(200, mockMeusDadosEscolaCEUGESTAO);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, []);
    mock
      .onGet("/escolas-simples/b11a2964-c9e0-488a-bb7f-6e11df2c903b/")
      .reply(200, mockGetEscolaSimplesCEUGESTAO);
    mock
      .onGet("/historico-escola/b11a2964-c9e0-488a-bb7f-6e11df2c903b/")
      .reply(200, {});
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/b11a2964-c9e0-488a-bb7f-6e11df2c903b/",
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO);
    mock.onGet("/medicao-inicial/recreio-nas-ferias/").reply(200, {
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, mockGetSolicitacaoMedicaoInicialCEUGESTAO);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEUGESTAO_NOVEMBRO24);
    mock
      .onGet("/periodos-escolares/inclusao-continua-por-mes/")
      .reply(200, mockGetPeriodosInclusaoContinuaCEUGESTAO);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, mockGetSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO);
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
        "/medicao-inicial/solicitacao-medicao-inicial/546505cb-eef1-4080-a8e8-7538faccf969/ceu-gestao-frequencias-dietas/",
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, mockGetQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO);
    mock
      .onGet(
        "/escola-solicitacoes/ceu-gestao-periodos-com-solicitacoes-autorizadas/",
      )
      .reply(
        200,
        mockgetEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscola,
      );
    mock
      .onGet(
        "/escola-solicitacoes/ultimo-dia-com-solicitacao-autorizada-no-mes/",
      )
      .reply(200, { ultima_data: "2024-11-29" });
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/546505cb-eef1-4080-a8e8-7538faccf969/ceu-gestao-frequencias-dietas/",
      )
      .reply(200, []);

    const search = `?mes=11&ano=2024`;
    window.history.pushState({}, "", search);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("nome_instituicao", `"CEU GESTAO INACIO MONTEIRO"`);
  });

  afterEach(() => {
    mock.reset();
    jest.useRealTimers();
  });

  it("Mantém botão Finalizar desabilitado para novembro de 2024", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-12-02T10:00:00Z"));
    await renderPage();

    expect(screen.getByText("Finalizar").closest("button")).toBeDisabled();
  });

  it("Não abre modal de avaliação quando Finalizar está desabilitado", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-12-02T10:00:00Z"));
    await renderPage();

    const botaoFinalizar = screen.getByText("Finalizar").closest("button");
    expect(botaoFinalizar).toBeDisabled();

    fireEvent.click(botaoFinalizar);

    expect(screen.queryByText("Avaliação do Serviço")).not.toBeInTheDocument();
  });
});
