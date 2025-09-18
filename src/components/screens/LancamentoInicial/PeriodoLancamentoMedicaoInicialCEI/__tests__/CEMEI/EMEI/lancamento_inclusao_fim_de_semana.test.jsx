import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEMEIEMEIAgosto2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/EMEI/INTEGRAL/Agosto2025/diasCalendario";
import { mockLocationStateCEMEIEMEIINTEGRALAgosto2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/EMEI/INTEGRAL/Agosto2025/locationState";
import { mockLogDietasAutorizadasCEMEIEMEIINTEGRALAgosto2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/EMEI/INTEGRAL/Agosto2025/logDietasAutorizadas";
import { mockMatriculadosNoMesCEMEIEMEIINTEGRALAgosto2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/EMEI/INTEGRAL/Agosto2025/matriculadosNoMes";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import mock from "src/services/_mock";

describe("Testes de inclusão de lançamento em fim de semana", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock.onGet("/escola-solicitacoes/inclusoes-autorizadas/").reply(200, {
      results: [
        {
          dia: "02",
          periodo: "INTEGRAL",
          alimentacoes: "lanche_4h, lanche, refeicao, sobremesa",
          numero_alunos: 3,
          dias_semana: null,
          inclusao_id_externo: "848A8",
        },
      ],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escolas-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/"
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
      .reply(200, mockMatriculadosNoMesCEMEIEMEIINTEGRALAgosto2025);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogDietasAutorizadasCEMEIEMEIINTEGRALAgosto2025);
    mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEMEIEMEIAgosto2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: [] });

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
              state: mockLocationStateCEMEIEMEIINTEGRALAgosto2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <PeriodoLancamentoMedicaoInicialCEIPage />
          <ToastContainer />
        </MemoryRouter>
      );
    });

    const search = `?uuid=$c9826df1-1c14-4748-b290-90d62658d013`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });
  });

  it("renderiza label `Mês do Lançamento`", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Agosto / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Agosto / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Infantil INTEGRAL` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "Infantil INTEGRAL");
  });

  it("renderiza input do dia 02/08/2025 como habilitado por ter inclusão autorizada", () => {
    const inputDiaFrequenciaDia2 = screen.getByTestId(
      "frequencia__dia_02__categoria_1"
    );
    expect(inputDiaFrequenciaDia2).toBeEnabled();
  });

  it("renderiza input do dia 03/08/2025 como desabilitado por ter NÃO inclusão autorizada", () => {
    const inputDiaFrequenciaDia2 = screen.getByTestId(
      "frequencia__dia_03__categoria_1"
    );
    expect(inputDiaFrequenciaDia2).toBeDisabled();
  });
});
