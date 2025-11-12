import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEMEIEMEISetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/EMEI/INTEGRAL/Setembro2025/diasCalendario";
import { mockLocationStateCEMEIEMEIINTEGRALSetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/EMEI/INTEGRAL/Setembro2025/locationState";
import { mockLogDietasAutorizadasCEMEIEMEIINTEGRALSetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/EMEI/INTEGRAL/Setembro2025/logDietasAutorizadas";
import { mockMatriculadosNoMesCEMEIEMEIINTEGRALSetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/EMEI/INTEGRAL/Setembro2025/matriculadosNoMes";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import mock from "src/services/_mock";

describe("Lançamento de Medição Inicial - EMEI da CEMEI - Testes de Alteração RPL", () => {
  beforeEach(async () => {
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
      .reply(200, {
        results: [
          {
            dia: "02",
            periodo: "Infantil INTEGRAL",
            numero_alunos: 1,
            inclusao_id_externo: "C6D40",
            motivo: "RPL - Refeição por Lanche",
          },
        ],
      });
    mock
      .onGet("/escolas-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
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
      .reply(200, mockMatriculadosNoMesCEMEIEMEIINTEGRALSetembro2025);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogDietasAutorizadasCEMEIEMEIINTEGRALSetembro2025);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEMEIEMEISetembro2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["12"] });

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
              state: mockLocationStateCEMEIEMEIINTEGRALSetembro2025,
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

    const search = `?uuid=33306018-2917-4ea2-8a17-98ffa1447848`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });
  });

  it("renderiza label `Mês do Lançamento`", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Outubro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Outubro / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Infantil INTEGRAL` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "Infantil INTEGRAL");
  });

  it("Preenche campos e exibe erros de RPL", () => {
    const inputDiaFrequenciaDia2Alimentacao = screen.getByTestId(
      "frequencia__dia_02__categoria_1",
    );
    fireEvent.change(inputDiaFrequenciaDia2Alimentacao, {
      target: { value: "100" },
    });

    const inputDiaLancheDia2Alimentacao = screen.getByTestId(
      "lanche__dia_02__categoria_1",
    );

    // Não pode preencher Lanche maior que 2x a frequência
    fireEvent.change(inputDiaLancheDia2Alimentacao, {
      target: { value: "201" },
    });
    expect(inputDiaLancheDia2Alimentacao).toHaveClass("invalid-field");

    // Pode preencher Lanche até 2x a frequência
    fireEvent.change(inputDiaLancheDia2Alimentacao, {
      target: { value: "188" },
    });
    expect(inputDiaLancheDia2Alimentacao).not.toHaveClass("invalid-field");

    const inputDiaFrequenciaDia2DietaTipoA = screen.getByTestId(
      "frequencia__dia_02__categoria_2",
    );
    fireEvent.change(inputDiaFrequenciaDia2DietaTipoA, {
      target: { value: "2" },
    });

    const inputDiaLancheDia2DietaTipoA = screen.getByTestId(
      "lanche__dia_02__categoria_2",
    );

    // Pode preencher Lanche da dieta até 2x a frequência
    fireEvent.change(inputDiaLancheDia2DietaTipoA, {
      target: { value: "5" },
    });
    expect(inputDiaLancheDia2DietaTipoA).toHaveClass("invalid-field");

    fireEvent.change(inputDiaLancheDia2DietaTipoA, {
      target: { value: "4" },
    });
    expect(inputDiaLancheDia2DietaTipoA).not.toHaveClass("invalid-field");

    const inputDiaFrequenciaDia2DietaTipoAEnteral = screen.getByTestId(
      "frequencia__dia_02__categoria_3",
    );
    fireEvent.change(inputDiaFrequenciaDia2DietaTipoAEnteral, {
      target: { value: "4" },
    });

    const inputDiaLancheDia2DietaTipoAEnteral = screen.getByTestId(
      "lanche__dia_02__categoria_3",
    );

    // Pode preencher Lanche da dieta até 2x a frequência
    fireEvent.change(inputDiaLancheDia2DietaTipoAEnteral, {
      target: { value: "9" },
    });
    expect(inputDiaLancheDia2DietaTipoAEnteral).toHaveClass("invalid-field");

    fireEvent.change(inputDiaLancheDia2DietaTipoAEnteral, {
      target: { value: "8" },
    });
    expect(inputDiaLancheDia2DietaTipoAEnteral).not.toHaveClass(
      "invalid-field",
    );

    const inputDiaRefeicaoDia2DietaTipoAEnteral = screen.getByTestId(
      "refeicao__dia_02__categoria_3",
    );

    // Se preencher refeição com RPL, não pode dobrar Lanche
    fireEvent.change(inputDiaRefeicaoDia2DietaTipoAEnteral, {
      target: { value: "1" },
    });
    expect(inputDiaLancheDia2DietaTipoAEnteral).toHaveClass("invalid-field");
    expect(inputDiaRefeicaoDia2DietaTipoAEnteral).toHaveClass("border-warning");

    fireEvent.change(inputDiaRefeicaoDia2DietaTipoAEnteral, {
      target: { value: "0" },
    });

    // Caso a soma dos lanches for maior que 2x a frequência da Alimentação, exibe erro
    fireEvent.change(inputDiaLancheDia2Alimentacao, {
      target: { value: "189" },
    });
    expect(inputDiaLancheDia2DietaTipoA).toHaveClass("invalid-field");
    expect(inputDiaLancheDia2DietaTipoAEnteral).toHaveClass("invalid-field");
  });
});
