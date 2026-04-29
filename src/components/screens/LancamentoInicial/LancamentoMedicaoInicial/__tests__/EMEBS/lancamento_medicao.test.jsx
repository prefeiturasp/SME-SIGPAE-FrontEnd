import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioMarco2025EMEBS } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/diasCalendarioMarco2025";
import { mockMeusDadosEscolaEMEBS } from "src/mocks/meusDados/escola/EMEBS";
import { mockGetVinculosTipoAlimentacaoPorEscolaEMEBS } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEBS/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesEMEBS } from "src/mocks/services/escola.service/EMEBS/escolaSimples";
import { mockQuantidadesAlimentacaoesLancadasPeriodoGrupoMarco2025EMEBS } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEBS/quantidadesAlimentacaoesLancadasPeriodoGrupoAgosto2024";
import { mockSolicitacaoMedicaoInicialEMEBS } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEBS/solicitacaoMedicaoInicial";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

const escolaUuid = mockMeusDadosEscolaEMEBS.vinculo_atual.instituicao.uuid;

const renderLancamentoMedicaoEMEBS = async ({
  systemTime,
  initialUrl = "?mes=03&ano=2025",
} = {}) => {
  mock.reset();

  if (systemTime) {
    jest.useFakeTimers();
    jest.setSystemTime(systemTime);
  }

  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaEMEBS);
  mock.onGet("/notificacoes/").reply(200, { results: [] });
  mock.onGet("/notificacoes/quantidade-nao-lidos/").reply(200, {
    quantidade_nao_lidos: 0,
  });
  mock
    .onGet(`/escolas-simples/${escolaUuid}/`)
    .reply(200, mockEscolaSimplesEMEBS);
  mock
    .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
    .reply(200, []);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaEMEBS);
  mock
    .onGet(
      "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
    )
    .reply(200, { results: [] });
  mock
    .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
    .reply(200, mockSolicitacaoMedicaoInicialEMEBS);
  mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioMarco2025EMEBS);
  mock
    .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
    .reply(200, mockGetTiposDeContagemAlimentacao);
  mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
    periodos: { MANHA: "5067e137-e5f3-4876-a63f-7f58cce93f33" },
  });
  mock.onGet("/escola-solicitacoes/kit-lanches-autorizadas/").reply(200, {
    results: [
      { dia: "24", numero_alunos: 100, kit_lanche_id_externo: "28125" },
    ],
  });
  mock
    .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
    .reply(200, {
      results: [
        {
          dia: "24",
          numero_alunos: 38,
          inclusao_id_externo: "BDBFB",
          motivo: "Lanche Emergencial",
        },
      ],
    });
  mock.onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/").reply(200, {
    results: [],
  });
  mock
    .onGet(
      "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
    )
    .reply(200, []);
  mock
    .onGet(
      `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialEMEBS[0].uuid}/ceu-gestao-frequencias-dietas/`,
    )
    .reply(200, []);
  mock
    .onGet(
      "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
    )
    .reply(200, mockQuantidadesAlimentacaoesLancadasPeriodoGrupoMarco2025EMEBS);

  window.history.pushState({}, "", initialUrl);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("nome_instituicao", `"EMEBS HELEN KELLER"`);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={[window.location.pathname + window.location.search]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {" "}
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosEscolaEMEBS,
            setMeusDados: jest.fn(),
          }}
        >
          <LancamentoMedicaoInicialPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });

  if (systemTime) {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
  }
};

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEBS", () => {
  beforeEach(async () => {
    await renderLancamentoMedicaoEMEBS();
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("Renderiza períodos escolares", () => {
    expect(screen.getByText("Integral")).toBeInTheDocument();
    expect(screen.getByText("Manhã")).toBeInTheDocument();
    expect(screen.getByText("Tarde")).toBeInTheDocument();
    expect(screen.getByText("Noite")).toBeInTheDocument();
  });

  it("Renderiza período `Programas e Projetos`", () => {
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Renderiza período `Solicitações de Alimentação`", () => {
    expect(screen.getByText("Solicitações de Alimentação")).toBeInTheDocument();
  });

  it("Verifica a ordem dos cards", () => {
    const textos = [
      "Manhã",
      "Tarde",
      "Integral",
      "Noite",
      "Programas e Projetos",
      "Solicitações de Alimentação",
    ];

    const elementos = textos.map((texto) => screen.getByText(texto));

    for (let i = 0; i < elementos.length - 1; i++) {
      const posicao = elementos[i].compareDocumentPosition(elementos[i + 1]);
      expect(posicao & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
  });
});

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEBS - Período antigo", () => {
  beforeEach(async () => {
    await renderLancamentoMedicaoEMEBS({
      systemTime: new Date("2026-04-10T10:00:00Z"),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("mantém o período antigo da URL e das requisições", async () => {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(window.location.search).toBe("?mes=03&ano=2025");

    const ehEndpoint = (url, endpoint) => url?.replace(/^\//, "") === endpoint;

    const requisicaoSolicitacao = mock.history.get
      .filter((request) =>
        ehEndpoint(request.url, "medicao-inicial/solicitacao-medicao-inicial/"),
      )
      .at(-1);
    const requisicaoDiasCalendario = mock.history.get
      .filter((request) => ehEndpoint(request.url, "dias-calendario/"))
      .at(-1);

    expect(requisicaoSolicitacao?.params).toEqual(
      expect.objectContaining({
        escola_uuid: escolaUuid,
        mes: "03",
        ano: "2025",
      }),
    );
    expect(requisicaoDiasCalendario?.params).toEqual(
      expect.objectContaining({
        escola_uuid: escolaUuid,
        mes: "03",
        ano: "2025",
      }),
    );
  });
});

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEBS - Sem query string", () => {
  beforeEach(async () => {
    await renderLancamentoMedicaoEMEBS({
      initialUrl: "/lancamento-inicial/lancamento-medicao-inicial",
    });
  });

  it("mantém a URL vazia e não seleciona período automaticamente", () => {
    expect(window.location.search).toBe("");
    expect(screen.getByText("Selecione...")).toBeInTheDocument();

    const requisicoesSolicitacao = mock.history.get.filter(
      (request) =>
        request.url?.replace(/^\//, "") ===
        "medicao-inicial/solicitacao-medicao-inicial/",
    );

    expect(requisicoesSolicitacao).toHaveLength(0);
  });
});
