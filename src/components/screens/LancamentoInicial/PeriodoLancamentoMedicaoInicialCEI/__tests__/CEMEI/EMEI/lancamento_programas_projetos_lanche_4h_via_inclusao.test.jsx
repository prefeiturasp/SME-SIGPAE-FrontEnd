import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEMEIOutubro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/Outubro2025/diasCalendario";
import { mockStateProgramasProjetosSemLanche4h } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/Outubro2025/stateProgramasProjetosSemLanche4h";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockInclusoesAutorizadasComLanche4h } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEMEI/Outubro2025/ProgramasProjetos/inclusoesAutorizadasComLanche4h";
import { mockLogQuantidadeDietasAutorizadasCEMEIOutubro2025 } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEMEI/Outubro2025/ProgramasProjetos/logQuantidadeDietasAutorizadas";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import mock from "src/services/_mock";

const LINHAS_BASE_ALIMENTACAO = [
  "numero_de_alunos",
  "frequencia",
  "lanche",
  "refeicao",
  "repeticao_refeicao",
  "sobremesa",
  "repeticao_sobremesa",
];

const LINHAS_DIETA = ["dietas_autorizadas", "frequencia", "lanche"];

describe("Teste <PeriodoLancamentoMedicaoInicialCEI> - Programas e Projetos - Lanche 4h via inclusao", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, mockInclusoesAutorizadasComLanche4h);
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
    mock.onGet(/dias-frequencia-zerada/).reply(404);

    const search = "?uuid=76b0a901-2fba-4f46-817d-f0d7834bc0cd";
    window.history.pushState({}, "", search);

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
              state: mockStateProgramasProjetosSemLanche4h,
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

  describe("tabela de ALIMENTAÇÃO (categoria 1)", () => {
    it("renderiza todas as linhas base", () => {
      for (const linha of LINHAS_BASE_ALIMENTACAO) {
        const testId = `${linha}__dia_01__categoria_1`;
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      }
    });

    it("renderiza Lanche 4h adicionado via inclusão contínua", () => {
      expect(
        screen.getByTestId("lanche_4h__dia_01__categoria_1"),
      ).toBeInTheDocument();
    });

    it("não renderiza tipos CEI (Desjejum, Colação, Almoço, Refeição da tarde)", () => {
      const ceiTypes = ["desjejum", "colacao", "almoco", "refeicao_da_tarde"];
      for (const cei of ceiTypes) {
        const testId = `${cei}__dia_01__categoria_1`;
        expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
      }
    });

    it("valida que Lanche 4h respeita o limite de alunos", () => {
      const inputFrequencia = screen.getByTestId(
        "frequencia__dia_01__categoria_1",
      );
      fireEvent.change(inputFrequencia, { target: { value: "150" } });

      const inputLanche4h = screen.getByTestId(
        "lanche_4h__dia_01__categoria_1",
      );
      expect(inputLanche4h).toBeInTheDocument();

      fireEvent.change(inputLanche4h, { target: { value: "10" } });
      expect(inputLanche4h).not.toHaveClass("invalid-field");

      fireEvent.change(inputLanche4h, { target: { value: "160" } });
      expect(inputLanche4h).toHaveClass("invalid-field");
    });
  });

  describe("tabela de DIETA ESPECIAL - TIPO A (categoria 2)", () => {
    it("renderiza Lanche 4h como coluna na tabela de dietas", () => {
      expect(
        screen.getByTestId("lanche_4h__dia_01__categoria_2"),
      ).toBeInTheDocument();
    });

    it("renderiza linhas base da dieta", () => {
      for (const linha of LINHAS_DIETA) {
        const testId = `${linha}__dia_01__categoria_2`;
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      }
    });
  });

  describe("tabela de DIETA ESPECIAL - TIPO B (categoria 4)", () => {
    it("renderiza Lanche 4h como coluna na tabela de dietas tipo B", () => {
      expect(
        screen.getByTestId("lanche_4h__dia_01__categoria_4"),
      ).toBeInTheDocument();
    });

    it("renderiza linhas base da dieta tipo B", () => {
      for (const linha of LINHAS_DIETA) {
        const testId = `${linha}__dia_01__categoria_4`;
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      }
    });
  });

  describe("tabela de DIETA ENTERAL (categoria 3)", () => {
    it("renderiza Lanche 4h como coluna na tabela de dieta enteral", () => {
      expect(
        screen.getByTestId("lanche_4h__dia_01__categoria_3"),
      ).toBeInTheDocument();
    });

    it("renderiza linhas base da dieta enteral", () => {
      for (const linha of LINHAS_DIETA) {
        const testId = `${linha}__dia_01__categoria_3`;
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      }
    });
  });
});
