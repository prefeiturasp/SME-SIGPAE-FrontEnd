import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEIDezembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEI/Dezembro2025/diasCalendario";
import { mockLogAlunosMatriculadosFaixaEtariaDiaCEIDezembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEI/Dezembro2025/logAlunosMatriculadosFaixaEtariaDia";
import { mockLogQuantidadeDietasAutorizadasCEIDezembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEI/Dezembro2025/logQuantidadeDietasAutorizadasCEI";
import { mockStateIntegralCEIDezembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEI/Dezembro2025/stateINTEGRAL";
import { mockMeusDadosCEI } from "src/mocks/meusDados/escola/CEI";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import mock from "src/services/_mock";

describe("Teste de validação para frequência de alimentação zero e frequência de dietas maior que zero sem observação", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCEI);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEIDezembro2025);
    mock
      .onGet("/log-alunos-matriculados-faixa-etaria-dia/")
      .reply(200, mockLogAlunosMatriculadosFaixaEtariaDiaCEIDezembro2025);
    mock
      .onGet("/log-quantidade-dietas-autorizadas-cei/")
      .reply(200, mockLogQuantidadeDietasAutorizadasCEIDezembro2025);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["25"] });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEI DIRET MONUMENTO"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    const search = `?uuid=5501aa2a-6c48-4a5f-95d9-82b7599b0c24`;
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
              state: mockStateIntegralCEIDezembro2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosCEI,
              setMeusDados: jest.fn(),
            }}
          >
            <PeriodoLancamentoMedicaoInicialCEIPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza label `Mês do Lançamento`", async () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Dezembro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Dezembro / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `INTEGRAL` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "INTEGRAL");
  });

  it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
    expect(
      screen.getByText("Semanas do Período para Lançamento da Medição Inicial"),
    ).toBeInTheDocument();
  });

  it("Exibe mensagem de erro ao tentar lançar dieta especial com frequência zero na alimentação", async () => {
    /* Frequência da alimentação do dia 01 das faixas etárias é zero */

    const inputFrequenciaAlimentacaoDia1Faixa1 = screen.getByTestId(
      "frequencia__faixa_e3030bd1-2e85-4676-87b3-96b4032370d4__dia_01__categoria_1",
    );
    fireEvent.change(inputFrequenciaAlimentacaoDia1Faixa1, {
      target: { value: "0" },
    });
    expect(inputFrequenciaAlimentacaoDia1Faixa1).toHaveAttribute("value", "0");

    const inputFrequenciaAlimentacaoDia1Faixa2 = screen.getByTestId(
      "frequencia__faixa_2e14cd6e-33e6-4168-b1ce-449f686d1e7d__dia_01__categoria_1",
    );
    fireEvent.change(inputFrequenciaAlimentacaoDia1Faixa2, {
      target: { value: "0" },
    });
    expect(inputFrequenciaAlimentacaoDia1Faixa2).toHaveAttribute("value", "0");

    /* Ao colocar frequência > 0, é exibido um warning, botão de adicionar 
    observação fica destacado e o botão Salvar fica desabilitado */

    const inputFrequenciaDietaTipoADia1 = screen.getByTestId(
      "frequencia__faixa_e3030bd1-2e85-4676-87b3-96b4032370d4__dia_01__categoria_2",
    );
    fireEvent.change(inputFrequenciaDietaTipoADia1, {
      target: { value: "1" },
    });

    expect(inputFrequenciaDietaTipoADia1).toHaveClass("border-warning");

    const botaoAdicionarObservacao = screen
      .getByTestId("div-botao-add-obs-01-2-observacoes")
      .querySelector("button");
    expect(botaoAdicionarObservacao).toHaveClass("red-button-outline");

    const botaoSalvarLancamentos = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    fireEvent.click(botaoSalvarLancamentos);
    expect(botaoSalvarLancamentos).toBeDisabled();

    /* Ao corrigir frequência para zero, warning é removido, botão de adicionar 
    observação não fica mais destacado e o botão Salvar fica habilitado */

    fireEvent.change(inputFrequenciaAlimentacaoDia1Faixa1, {
      target: { value: "1" },
    });
    expect(inputFrequenciaDietaTipoADia1).not.toHaveClass("border-warning");
    expect(botaoAdicionarObservacao).not.toHaveClass("red-button-outline");
    expect(botaoSalvarLancamentos).not.toBeDisabled();
  });
});
