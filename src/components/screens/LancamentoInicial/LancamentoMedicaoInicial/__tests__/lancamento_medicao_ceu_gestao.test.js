import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "configs/constants";
import { MeusDadosContext } from "context/MeusDadosContext";
import { APIMockVersion } from "mocks/apiVersionMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaCEUGESTAO } from "mocks/meusDados/escolaCeuGestao";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO } from "mocks/services/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO";
import { mockGetEscolaSimplesCEUGESTAO } from "mocks/services/escola.service/mockGetEscolaSimplesCEUGESTAO";
import { mockGetCEUGESTAOPeriodosSolicitacoesAutorizadasEscola } from "mocks/services/medicaoInicial/periodoLancamentoMedicao.service/getCEUGESTAOPeriodosSolicitacoesAutorizadasEscolaCEUGESTAO";
import { mockGetPeriodosInclusaoContinuaCEUGESTAO } from "mocks/services/medicaoInicial/periodoLancamentoMedicao.service/getPeriodosInclusaoContinuaCEUGESTAO";
import { mockGetSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO } from "mocks/services/medicaoInicial/periodoLancamentoMedicao.service/getSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO";
import { mockGetQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO } from "mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/getQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO";
import { mockGetSolicitacaoMedicaoInicialCEUGESTAO } from "mocks/services/solicitacaoMedicaoInicial.service/getSolicitacaoMedicaoInicialCEUGESTAO";
import { mockGetTiposDeContagemAlimentacao } from "mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário CEU GESTAO", () => {
  beforeEach(async () => {
    mock.onGet("/api-version/").reply(200, APIMockVersion);
    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
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
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/b11a2964-c9e0-488a-bb7f-6e11df2c903b/"
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, mockGetSolicitacaoMedicaoInicialCEUGESTAO);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
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
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/"
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/546505cb-eef1-4080-a8e8-7538faccf969/ceu-gestao-frequencias-dietas/"
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/"
      )
      .reply(200, mockGetQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO);
    mock
      .onGet(
        "/escola-solicitacoes/ceu-gestao-periodos-com-solicitacoes-autorizadas/"
      )
      .reply(200, mockGetCEUGESTAOPeriodosSolicitacoesAutorizadasEscola);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/546505cb-eef1-4080-a8e8-7538faccf969/ceu-gestao-frequencias-dietas/"
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
            <LancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getByText("Lançamento Medição Inicial")).toBeInTheDocument();
  });

  it("Renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("Renderiza período `TARDE`", () => {
    expect(screen.getByText("TARDE")).toBeInTheDocument();
  });

  it("Renderiza período `Programas e Projetos`", () => {
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Renderiza período `Solicitações de Alimentação`", () => {
    expect(screen.getByText("Solicitações de Alimentação")).toBeInTheDocument();
  });
});
