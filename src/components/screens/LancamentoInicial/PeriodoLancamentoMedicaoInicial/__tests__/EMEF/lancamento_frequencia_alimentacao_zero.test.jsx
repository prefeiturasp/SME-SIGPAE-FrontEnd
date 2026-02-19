import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/diasCalendario";
import { mockLogQuantidadeDietasAutorizadasEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/logQuantidadeDietasAutorizadas";
import { mockMatriculadosNoMesEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/matriculadosNoMes";
import { mockPermissaoLancamentosEspeciaisEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/permissaoLancamentosEspeciais";
import { mockStateMANHAEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/stateMANHA";
import { mockValoresMedicaoEMEFJaneiro2026 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2026/valoresMedicao";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Lancamento de Dieta Especial com Frequência Zero na Alimentação - EMEF", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogQuantidadeDietasAutorizadasEMEFJaneiro2026);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicaoEMEFJaneiro2026);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioEMEFJaneiro2026);
    mock
      .onGet("/matriculados-no-mes/")
      .reply(200, mockMatriculadosNoMesEMEFJaneiro2026);
    mock
      .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/",
      )
      .reply(200, mockPermissaoLancamentosEspeciaisEMEFJaneiro2026);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["01", "25"] });

    const search = `?uuid=a2eed560-2255-4067-a803-4ad6b9f1d26a&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
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
              state: mockStateMANHAEMEFJaneiro2026,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza label `Mês do Lançamento`", async () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Janeiro / 2026` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Janeiro / 2026");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `MANHA` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "MANHA");
  });

  it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
    expect(
      screen.getByText("Semanas do Período para Lançamento da Medição Inicial"),
    ).toBeInTheDocument();
  });

  it("Exibe mensagem de erro ao tentar lançar dieta especial com frequência zero na alimentação", async () => {
    /* Frequência da alimentação do dia 02 é zero */
    const inputFrequenciaAlimentacaoDia2 = screen.getByTestId(
      "frequencia__dia_02__categoria_1",
    );
    expect(inputFrequenciaAlimentacaoDia2).toHaveAttribute("value", "0");

    /* Ao colocar frequência > 0, é exibido um warning, botão de adicionar 
    observação fica destacado e o botão Salvar fica desabilitado */
    const inputFrequenciaDietaTipoAEnteralDia2 = screen.getByTestId(
      "frequencia__dia_02__categoria_3",
    );
    fireEvent.change(inputFrequenciaDietaTipoAEnteralDia2, {
      target: { value: "1" },
    });
    expect(inputFrequenciaDietaTipoAEnteralDia2).toHaveClass("border-warning");

    const botaoAdicionarObservacao = screen.getByTestId(
      "botao-observacao__dia_02__categoria_3",
    );
    expect(botaoAdicionarObservacao).toHaveClass("red-button-outline");

    const botaoSalvarLancamentos = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    fireEvent.click(botaoSalvarLancamentos);
    expect(botaoSalvarLancamentos).toBeDisabled();

    /* Ao corrigir frequência para zero, warning é removido, botão de adicionar 
    observação não fica mais destacado e o botão Salvar fica habilitado */

    fireEvent.change(inputFrequenciaDietaTipoAEnteralDia2, {
      target: { value: "0" },
    });
    expect(inputFrequenciaDietaTipoAEnteralDia2).not.toHaveClass(
      "border-warning",
    );
    expect(botaoAdicionarObservacao).not.toHaveClass("red-button-outline");
    expect(botaoSalvarLancamentos).not.toBeDisabled();
  });
});
