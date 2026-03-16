import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioEMEBSFevereiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/Fevereiro2026/diasCalendario";
import { mockStateSolicitacoesAlimentacaoEMEBSFevereiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/Fevereiro2026/stateSolicitacoesAlimentacao";
import { mockMeusDadosEscolaEMEBS } from "src/mocks/meusDados/escola/EMEBS";
import { mockGetVinculosTipoAlimentacaoPorEscolaEMEBS } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEBS/vinculosTipoAlimentacaoPeriodoEscolar";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - Solicitações de Alimentação - Usuário EMEBS - Lanche Emergencial Diário", () => {
  const escolaUuid = mockMeusDadosEscolaEMEBS.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaEMEBS);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaEMEBS);
    mock.onGet("/medicao-inicial/lanches-emergenciais-diarios/").reply(200, [
      {
        escola_nome: "EMEBS HELEN KELLER",
        escola_uuid: "ed10a4fb-9274-42ba-adc5-08b9f28746bb",
        data_inicial: "10/03/2025",
        data_final: null,
      },
    ]);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock.onGet("/escola-solicitacoes/kit-lanches-autorizadas/").reply(200, {
      results: [],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, {
        results: [],
      });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioEMEBSFevereiro2026);
    mock.onGet("/medicao-inicial/medicao/feriados-no-mes/").reply(200, {
      results: ["17"],
    });

    const search = `?uuid=f011efa2-0c90-42db-92b4-c8c2fde1bd46&ehGrupoSolicitacoesDeAlimentacao=true&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    window.history.pushState({}, "", search);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateSolicitacoesAlimentacaoEMEBSFevereiro2026,
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

  it("renderiza valor `Fevereiro / 2026` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Fevereiro / 2026");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Solicitações de Alimentação` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute(
      "value",
      "Solicitações de Alimentação",
    );
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

  it("renderiza label `SOLICITAÇÕES DE ALIMENTAÇÃO`", async () => {
    expect(screen.getByText("SOLICITAÇÕES DE ALIMENTAÇÃO")).toBeInTheDocument();
  });

  it("renderiza labels `Lanche Emergencial` e `Kit Lanche`", async () => {
    expect(screen.getByText("Lanche Emergencial")).toBeInTheDocument();
    expect(screen.getByText("Kit Lanche")).toBeInTheDocument();
  });

  it("Clica na semana 2 e campos estão desabilitados para lançamento de lanche emergencial", () => {
    const semanaDois = screen.getByText("Semana 2");
    fireEvent.click(semanaDois);

    for (const dia of ["2", "3", "4", "5", "6", "7", "8"]) {
      const inputLancheEmergencialPorDia = screen.getByTestId(
        `lanche_emergencial__dia_0${dia}__categoria_5`,
      );
      expect(inputLancheEmergencialPorDia).toBeDisabled();
    }
  });

  it("Clica na semana 3 e alguns campos estão habilitados para lançamento de lanche emergencial", () => {
    const semanaTres = screen.getByText("Semana 3");
    fireEvent.click(semanaTres);

    for (const dia of ["10", "11", "12", "13"]) {
      const inputLancheEmergencialPorDia = screen.getByTestId(
        `lanche_emergencial__dia_${dia}__categoria_5`,
      );
      expect(inputLancheEmergencialPorDia).toBeEnabled();
    }

    for (const dia of ["14", "15"]) {
      const inputLancheEmergencialPorDia = screen.getByTestId(
        `lanche_emergencial__dia_${dia}__categoria_5`,
      );
      expect(inputLancheEmergencialPorDia).toBeDisabled();
    }
  });
});
