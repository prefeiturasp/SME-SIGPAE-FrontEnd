import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEMEIOutubro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/Outubro2025/diasCalendario";
import { mockStateProgramasProjetosCEMEIOutubro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/Outubro2025/stateProgramasProjetos";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockInclusoesAutorizadasCEMEIOutubro2025 } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEMEI/Outubro2025/ProgramasProjetos/inclusoesAutorizadas";
import { mockLogQuantidadeDietasAutorizadasCEMEIOutubro2025 } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEMEI/Outubro2025/ProgramasProjetos/logQuantidadeDietasAutorizadas";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import mock from "src/services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - Programas e Projetos - Usuário CEMEI", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, mockInclusoesAutorizadasCEMEIOutubro2025);
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
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogQuantidadeDietasAutorizadasCEMEIOutubro2025);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["12"] });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEMEIOutubro2025);

    const search = `?uuid=76b0a901-2fba-4f46-817d-f0d7834bc0cd`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

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
              state: mockStateProgramasProjetosCEMEIOutubro2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaCEMEI,
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

  it("renderiza valor `Outubro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Outubro / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Programas e Projetos` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "Programas e Projetos");
  });

  const setInput = (id, valor) => {
    const input = screen.getByTestId(id);
    expect(input).toBeInTheDocument();
    fireEvent.change(input, {
      target: { value: valor },
    });
    return input;
  };

  it("ao preencher lanche, valida quantidade de alunos por tipo de alimentação", async () => {
    setInput("frequencia__dia_01__categoria_1", "150");
    expect(screen.getByTestId("frequencia__dia_01__categoria_1")).toHaveValue(
      "150",
    );

    let inputLancheDia01 = setInput("lanche__dia_01__categoria_1", "100");
    expect(inputLancheDia01).not.toHaveClass("invalid-field");
    inputLancheDia01 = setInput("lanche__dia_01__categoria_1", "101");
    expect(inputLancheDia01).toHaveClass("invalid-field");

    let inputRefeicaoDia01 = setInput("refeicao__dia_01__categoria_1", "50");
    expect(inputRefeicaoDia01).not.toHaveClass("invalid-field");
    inputRefeicaoDia01 = setInput("refeicao__dia_01__categoria_1", "51");
    expect(inputRefeicaoDia01).toHaveClass("invalid-field");
  });
});
