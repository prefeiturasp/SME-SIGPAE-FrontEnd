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
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
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
import { mockSolicitacaoMedicaoInicialCEUGESTAOComOcorrenciaExcluida } from "src/mocks/services/solicitacaoMedicaoInicial.service/CEUGESTAO/solicitacaoMedicaoInicialCEUGESTAOComOcorrencia";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { DetalhamentoDoLancamentoPage } from "src/pages/LancamentoMedicaoInicial/DetalhamentoDoLancamentoPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Histórico", () => {
  const solicitacaoMedicaoInicialUUID =
    mockSolicitacaoMedicaoInicialCEUGESTAOComOcorrenciaExcluida[0].uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaCEUGESTAO);
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, []);
    mock
      .onGet("/escolas-simples/b11a2964-c9e0-488a-bb7f-6e11df2c903b/")
      .reply(200, mockGetEscolaSimplesCEUGESTAO);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/b11a2964-c9e0-488a-bb7f-6e11df2c903b/",
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, mockSolicitacaoMedicaoInicialCEUGESTAOComOcorrenciaExcluida);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEUGESTAO_NOVEMBRO24);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/periodos-escolares/inclusao-continua-por-mes/")
      .reply(200, mockGetPeriodosInclusaoContinuaCEUGESTAO);
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
        `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoMedicaoInicialUUID}/ceu-gestao-frequencias-dietas/`,
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
        `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoMedicaoInicialUUID}/ceu-gestao-frequencias-dietas/`,
      )
      .reply(200, []);

    const search = `?mes=11&ano=2024`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });

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
            <DetalhamentoDoLancamentoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Deve renderizar label `Detalhamento do Lançamento da Medição Inicial`", async () => {
    expect(
      screen.getByText("Detalhamento do Lançamento da Medição Inicial"),
    ).toBeInTheDocument();
  });

  it("Deve renderizar o histórico de ocorrências com a ocorrência excluída", async () => {
    expect(
      screen.getByText("Ocorrência excluída pela escola"),
    ).toBeInTheDocument();
    const botaoHistorico = screen.getByText("Histórico");
    fireEvent.click(botaoHistorico);

    await waitFor(() => {
      expect(
        screen.getByText("Histórico do Formulário de Ocorrências"),
      ).toBeInTheDocument();
    });

    const logItemEnviadoPelaUE = screen.getByTestId("log-item-0");
    fireEvent.click(logItemEnviadoPelaUE);

    await waitFor(() => {
      expect(screen.getByText("Formulário PDF")).toBeInTheDocument();
      expect(screen.getByText("Formulário Excel")).toBeInTheDocument();
    });
  });
});
