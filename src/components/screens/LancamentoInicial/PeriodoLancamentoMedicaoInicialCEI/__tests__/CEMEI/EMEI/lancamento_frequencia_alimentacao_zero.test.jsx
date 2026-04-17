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
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEMEINovembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEMEI/Novembro2025/diasCalendario";
import { mockLogQuantidadeDietasAutorizadasCEMEINovembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEMEI/Novembro2025/logQuantidadeDietasAutorizadas";
import { mockMatriculadosNoMesCEMEINovembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEMEI/Novembro2025/matriculadosNoMes";
import { mockStateInfantilIntegralCEMEINovembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/CEMEI/Novembro2025/stateInfantilINTEGRAL";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import mock from "src/services/_mock";

describe("Teste de lançamento de frequência de alimentação zero - EMEI da CEMEI", () => {
  const alteracoesAlimentacaoParams = [];

  beforeEach(async () => {
    alteracoesAlimentacaoParams.length = 0;
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock.onGet("/escola-solicitacoes/inclusoes-autorizadas/").reply(200, {
      results: [],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply((config) => {
        alteracoesAlimentacaoParams.push(config.params);

        if (config.params?.eh_lanche_emergencial) {
          return [
            200,
            {
              results: [
                {
                  dia: "12",
                  numero_alunos: 100,
                  inclusao_id_externo: "8C896",
                  motivo: "Lanche Emergencial",
                  periodos_escolares: ["Infantil INTEGRAL"],
                  tipos_alimentacao_de: ["Lanche", "Refeição"],
                },
              ],
            },
          ];
        }

        return [200, { results: [] }];
      });
    mock
      .onGet("/escolas-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEMEINovembro2025);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, {
        results: {
          alimentacoes_lancamentos_especiais: [],
          permissoes_por_dia: [],
          data_inicio_permissoes: null,
        },
      });
    mock
      .onGet("/matriculados-no-mes/")
      .reply(200, mockMatriculadosNoMesCEMEINovembro2025);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogQuantidadeDietasAutorizadasCEMEINovembro2025);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["02", "15", "20"] });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateInfantilIntegralCEMEINovembro2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <PeriodoLancamentoMedicaoInicialCEIPage />
          <ToastContainer />
        </MemoryRouter>,
      );
    });

    const search = `?uuid=64c527a2-d724-4b8e-a3bf-c3815ff078b9`;
    window.history.pushState({}, "", search);
  });

  it("renderiza label `Mês do Lançamento`", async () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Novembro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Novembro / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Infantil INTEGRAL` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "Infantil INTEGRAL");
  });

  it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
    expect(
      screen.getByText("Semanas do Período para Lançamento da Medição Inicial"),
    ).toBeInTheDocument();
  });

  it("consulta as alterações autorizadas com e sem lanche emergencial para Infantil INTEGRAL", async () => {
    expect(alteracoesAlimentacaoParams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eh_lanche_emergencial: false,
          nome_periodo_escolar: "Infantil INTEGRAL",
        }),
        expect.objectContaining({
          eh_lanche_emergencial: true,
          nome_periodo_escolar: "Infantil INTEGRAL",
        }),
      ]),
    );
  });

  it("exibe tooltip verde por tipo autorizado e warning laranja ao preencher apontamento", async () => {
    const semanaTres = screen.getByText("Semana 3");
    fireEvent.click(semanaTres);

    expect(
      screen.getByTestId(
        "tooltip-lanche-emergencial-autorizado_lanche__dia_12__categoria_1",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "tooltip-lanche-emergencial-autorizado_refeicao__dia_12__categoria_1",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(
        "tooltip-lanche-emergencial-autorizado_sobremesa__dia_12__categoria_1",
      ),
    ).not.toBeInTheDocument();

    const inputFrequenciaDia12 = screen.getByTestId(
      "frequencia__dia_12__categoria_1",
    );
    fireEvent.change(inputFrequenciaDia12, {
      target: { value: "10" },
    });

    const inputLancheDia12 = screen.getByTestId("lanche__dia_12__categoria_1");
    fireEvent.change(inputLancheDia12, {
      target: { value: "1" },
    });

    await waitFor(() => {
      expect(inputLancheDia12).toHaveClass("border-warning");
      expect(inputLancheDia12).not.toHaveClass("invalid-field");
    });

    const iconeWarning = screen.getByTestId(
      "tooltip-lanche-emergencial-warning_lanche__dia_12__categoria_1",
    );
    fireEvent.mouseOver(iconeWarning);
    expect(
      await screen.findByText(
        "Há lanche emergencial autorizado. Justifique o apontamento da alimentação",
      ),
    ).toBeInTheDocument();

    const botaoAdicionarObservacao = screen
      .getByTestId("div-botao-add-obs-12-1-observacoes")
      .querySelector("button");
    expect(botaoAdicionarObservacao).toHaveClass("red-button-outline");

    const botaoSalvarLancamentos = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    await waitFor(() => {
      expect(botaoSalvarLancamentos).toBeDisabled();
    });

    fireEvent.change(inputLancheDia12, {
      target: { value: "0" },
    });

    await waitFor(() => {
      expect(inputLancheDia12).not.toHaveClass("border-warning");
      expect(
        screen.queryByTestId(
          "tooltip-lanche-emergencial-warning_lanche__dia_12__categoria_1",
        ),
      ).not.toBeInTheDocument();
    });

    expect(
      screen.queryByTestId(
        "tooltip-lanche-emergencial-autorizado_lanche__dia_12__categoria_1",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(
        "tooltip-lanche-emergencial-autorizado_refeicao__dia_12__categoria_1",
      ),
    ).toBeInTheDocument();
    expect(botaoAdicionarObservacao).not.toHaveClass("red-button-outline");
    expect(botaoSalvarLancamentos).not.toBeDisabled();
  });

  it("Exibe mensagem de erro ao tentar lançar dieta especial com frequência zero na alimentação", async () => {
    const semanaTres = screen.getByText("Semana 3");
    fireEvent.click(semanaTres);

    /* Frequência da alimentação do dia 02 é zero */

    const inputFrequenciaAlimentacaoDia12 = screen.getByTestId(
      "frequencia__dia_12__categoria_1",
    );
    fireEvent.change(inputFrequenciaAlimentacaoDia12, {
      target: { value: "0" },
    });
    expect(inputFrequenciaAlimentacaoDia12).toHaveAttribute("value", "0");

    /* Ao colocar frequência > 0, é exibido um warning, botão de adicionar 
    observação fica destacado e o botão Salvar fica desabilitado */

    const inputFrequenciaDietaTipoADia12 = screen.getByTestId(
      "frequencia__dia_12__categoria_2",
    );
    fireEvent.change(inputFrequenciaDietaTipoADia12, {
      target: { value: "1" },
    });
    expect(inputFrequenciaDietaTipoADia12).toHaveClass("border-warning");

    const botaoAdicionarObservacao = screen
      .getByTestId("div-botao-add-obs-12-2-observacoes")
      .querySelector("button");
    expect(botaoAdicionarObservacao).toHaveClass("red-button-outline");
    const botaoSalvarLancamentos = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    fireEvent.click(botaoSalvarLancamentos);
    expect(botaoSalvarLancamentos).toBeDisabled();

    /* Ao corrigir frequência para zero, warning é removido, botão de adicionar 
    observação não fica mais destacado e o botão Salvar fica habilitado */

    fireEvent.change(inputFrequenciaDietaTipoADia12, {
      target: { value: "0" },
    });
    expect(inputFrequenciaDietaTipoADia12).not.toHaveClass("border-warning");
    expect(botaoAdicionarObservacao).not.toHaveClass("red-button-outline");
    expect(botaoSalvarLancamentos).not.toBeDisabled();
  });
});
