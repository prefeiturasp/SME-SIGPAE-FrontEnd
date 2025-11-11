import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEUGESTAO_NOVEMBRO24 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/diasCalendarioCEUGESTAO_NOVEMBRO24";
import { mockInclusoesAutorizadasCEUGESTAO_ProgramasProjetos } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/inclusoesAutorizadasCEUGESTAO_ProgramasProjetos";
import { mockLogQuantidadeDietasAutorizadasCEUGESTAO_TARDE } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/logQuantidadeDietasAutorizadasCEUGESTAO";
import { mockStateCEUGESTAO_ProgramasProjetos } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/mockStateCEUGESTAO_ProgramasProjetos";
import { mockValoresMedicaoCEUGESTAO_TARDE } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/valoresMedicaoCEUGESTAO_TARDE";
import { mockMeusDadosEscolaCEUGESTAO } from "src/mocks/meusDados/escolaCeuGestao";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO } from "src/mocks/services/cadastroTipoAlimentacao.service/CEUGESTAO/mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";
import { mockTipoAlimentacao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/mockTipoAlimentacao";

describe("Teste <PeriodoLancamentoMedicaoInicial> - Programas e Projetos - Usuário CEU GESTAO", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaCEUGESTAO);
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
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, mockInclusoesAutorizadasCEUGESTAO_ProgramasProjetos);
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
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEUGESTAO_NOVEMBRO24);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["02", "15", "20"] });

    mock.onGet("/tipos-alimentacao/").reply(200, mockTipoAlimentacao);

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
            { pathname: "/", state: mockStateCEUGESTAO_ProgramasProjetos },
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

  it("renderiza valor `Programas e Projetos` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "Programas e Projetos");
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
