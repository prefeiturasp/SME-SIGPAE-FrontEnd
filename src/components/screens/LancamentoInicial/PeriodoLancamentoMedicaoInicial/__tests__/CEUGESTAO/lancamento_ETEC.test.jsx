import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioFevereiro2025CEUGESTAO } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/diasCalendario_Fevereiro2025";
import { mockInclusoesETECAutorizadasCEUGESTAO } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/inclusoesETECAutorizadas";
import { mockLogQuantidadeDietasAutorizadasCEUGESTAO_TARDE } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/logQuantidadeDietasAutorizadasCEUGESTAO";
import { mockStateETECCEUGESTAO } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/mockStateETEC";
import { mockValoresMedicaoCEUGESTAO_ETEC } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/valoresMedicaoCEUGESTAO_ETEC";
import { mockMeusDadosEscolaCEUGESTAO } from "src/mocks/meusDados/escolaCeuGestao";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO } from "src/mocks/services/cadastroTipoAlimentacao.service/CEUGESTAO/mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - ETEC - Usuário CEU GESTAO", () => {
  const renderPage = async ({
    diasCalendario = mockDiasCalendarioFevereiro2025CEUGESTAO,
    feriadosNoMes = { results: [] },
  } = {}) => {
    mock.reset();
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaCEUGESTAO);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock.onGet("/notificacoes/quantidade-nao-lidos/").reply(200, {
      quantidade_nao_lidos: 0,
    });
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
      .reply(200, { results: [] });
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogQuantidadeDietasAutorizadasCEUGESTAO_TARDE);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicaoCEUGESTAO_ETEC);
    mock
      .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
      .reply(200, mockInclusoesETECAutorizadasCEUGESTAO);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock.onGet("/dias-calendario/").reply(200, diasCalendario);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, feriadosNoMes);

    const search = `?uuid=1eb60064-a0e1-4778-a1ee-a64752ef6f1b&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=true&ehPeriodoEspecifico=false`;
    window.history.pushState({}, "", search);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/", state: mockStateETECCEUGESTAO }]}
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
  };

  beforeEach(async () => {
    await renderPage();
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Mês do Lançamento` e seu valor", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Fevereiro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Fevereiro / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `ETEC` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "ETEC");
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

  it("mantém a regra de ETEC baseada em inclusão autorizada, feriado, fim de semana e ausência de inclusão", async () => {
    cleanup();

    const diasCalendarioCustomizados =
      mockDiasCalendarioFevereiro2025CEUGESTAO.map((diaCalendario) => {
        if (diaCalendario.dia === "10") {
          return { ...diaCalendario, dia_letivo: false };
        }

        return diaCalendario;
      });

    await renderPage({
      diasCalendario: diasCalendarioCustomizados,
      feriadosNoMes: { results: ["11"] },
    });

    fireEvent.click(screen.getByText("Semana 3"));

    const inputFrequenciaDia10 = await screen.findByTestId(
      "frequencia__dia_10__categoria_1",
    );
    const inputFrequenciaDia11 = screen.getByTestId(
      "frequencia__dia_11__categoria_1",
    );
    const inputFrequenciaDia15 = screen.getByTestId(
      "frequencia__dia_15__categoria_1",
    );

    expect(inputFrequenciaDia10).not.toBeDisabled();
    expect(inputFrequenciaDia11).toBeDisabled();
    expect(inputFrequenciaDia15).toBeDisabled();

    fireEvent.click(screen.getByText("Semana 4"));

    const inputFrequenciaDia21 = await screen.findByTestId(
      "frequencia__dia_21__categoria_1",
    );

    expect(inputFrequenciaDia21).toBeDisabled();
  });
});
