import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEUGESTAO_NOVEMBRO24 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/diasCalendarioCEUGESTAO_NOVEMBRO24";
import { mockLogQuantidadeDietasAutorizadasCEUGESTAO_TARDE } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/logQuantidadeDietasAutorizadasCEUGESTAO";
import { mockLocationStateCEUGESTAO_TARDE } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/mockStateCEUGESTAO_TARDE";
import { mockValoresMedicaoCEUGESTAO_TARDE } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/valoresMedicaoCEUGESTAO_TARDE";
import { mockMeusDadosEscolaCEUGESTAO } from "src/mocks/meusDados/escolaCeuGestao";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO } from "src/mocks/services/cadastroTipoAlimentacao.service/CEUGESTAO/mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO";
import { mockGetEscolaSimplesCEUGESTAO } from "src/mocks/services/escola.service/CEUGESTAO/mockGetEscolaSimplesCEUGESTAO";
import { mockgetEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscola } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEUGESTAO/getEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscolaCEUGESTAO";
import { mockGetPeriodosInclusaoContinuaCEUGESTAO } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEUGESTAO/getPeriodosInclusaoContinuaCEUGESTAO";
import { mockGetSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEUGESTAO/getSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO";
import { mockGetQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CEUGESTAO/getQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO";
import { mockGetSolicitacaoMedicaoInicialCEUGESTAO } from "src/mocks/services/solicitacaoMedicaoInicial.service/CEUGESTAO/getSolicitacaoMedicaoInicialCEUGESTAO";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - TARDE - Usuário CEU GESTAO", () => {
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
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogQuantidadeDietasAutorizadasCEUGESTAO_TARDE);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicaoCEUGESTAO_TARDE);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock.onGet("/matriculados-no-mes/").reply(200, []);
    mock
      .onGet("/escolas-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
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
        "/medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/",
      )
      .reply(200, {
        results: {
          alimentacoes_lancamentos_especiais: [],
          permissoes_por_dia: [],
          data_inicio_permissoes: null,
        },
      });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEUGESTAO_NOVEMBRO24);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["02", "15", "20"] });
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
        "/medicao-inicial/solicitacao-medicao-inicial/546505cb-eef1-4080-a8e8-7538faccf969/ceu-gestao-frequencias-dietas/",
      )
      .reply(200, []);

    const search = `?uuid=546505cb-eef1-4080-a8e8-7538faccf969&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/", state: mockLocationStateCEUGESTAO_TARDE },
          ]}
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
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Mês do Lançamento` e seu valor", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Novembro / 2024` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Novembro / 2024");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `TARDE` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "TARDE");
  });

  it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
    expect(
      screen.getByText("Semanas do Período para Lançamento da Medição Inicial"),
    ).toBeInTheDocument();
  });

  it("renderiza label `Semana 1`", async () => {
    expect(screen.getByText("Semana 1")).toBeInTheDocument();
  });

  it("renderiza label `Semana 5`", async () => {
    expect(screen.getByText("Semana 5")).toBeInTheDocument();
  });

  it("renderiza label `ALIMENTAÇÃO`", async () => {
    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
  });
});
