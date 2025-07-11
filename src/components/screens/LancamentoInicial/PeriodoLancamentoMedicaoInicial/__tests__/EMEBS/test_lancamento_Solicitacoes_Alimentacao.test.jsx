import "@testing-library/jest-dom";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import React from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioMarco2025EMEBS } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/diasCalendarioMarco2025";
import { mockStateSolicitacoesDeAlimentacaoMarco2025EMEBS } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/stateSolicitacoesDeAlimentacaoMarco2025";
import { mockValoresMedicaoSolicitacoesAlimentacaoMarco2025EMEBS } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/valoresMedicaoSolicitacoesAlimentacaoMarco2025";
import { mockMeusDadosEscolaEMEBS } from "src/mocks/meusDados/escola/EMEBS";
import { mockGetVinculosTipoAlimentacaoPorEscolaEMEBS } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEBS/vinculosTipoAlimentacaoPeriodoEscolar";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - Solicitações de Alimentação - Usuário EMEBS", () => {
  const escolaUuid = mockMeusDadosEscolaEMEBS.vinculo_atual.instituicao.uuid;

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
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaEMEBS);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaEMEBS);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicaoSolicitacoesAlimentacaoMarco2025EMEBS);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
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
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioMarco2025EMEBS);
    mock.onGet("/medicao-inicial/medicao/feriados-no-mes/").reply(200, {
      results: ["04"],
    });

    const search = `?uuid=916a9e70-d853-4c19-bbfb-63b35b66d185&ehGrupoSolicitacoesDeAlimentacao=true&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateSolicitacoesDeAlimentacaoMarco2025EMEBS,
            },
          ]}
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
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Mês do Lançamento` e seu valor", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Março / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Março / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Solicitações de Alimentação` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute(
      "value",
      "Solicitações de Alimentação"
    );
  });

  it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
    expect(
      screen.getByText("Semanas do Período para Lançamento da Medição Inicial")
    ).toBeInTheDocument();
  });

  it("renderiza label `Semana 1`", async () => {
    expect(screen.getByText("Semana 1")).toBeInTheDocument();
  });

  it("renderiza label `Semana 6`", async () => {
    expect(screen.getByText("Semana 6")).toBeInTheDocument();
  });

  it("renderiza label `SOLICITAÇÕES DE ALIMENTAÇÃO`", async () => {
    expect(screen.getByText("SOLICITAÇÕES DE ALIMENTAÇÃO")).toBeInTheDocument();
  });

  it("renderiza labels `Lanche Emergencial` e `Kit Lanche`", async () => {
    expect(screen.getByText("Lanche Emergencial")).toBeInTheDocument();
    expect(screen.getByText("Kit Lanche")).toBeInTheDocument();
  });
});
