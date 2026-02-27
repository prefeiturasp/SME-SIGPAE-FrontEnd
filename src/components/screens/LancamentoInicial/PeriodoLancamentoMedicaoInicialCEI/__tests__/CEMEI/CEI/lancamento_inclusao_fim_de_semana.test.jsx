import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockLocationStateCEMEICEIINTEGRALAgosto2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/CEI/INTEGRAL/Agosto2025/locationState";
import { mockAlunosMatriculadosFaixaEtariaDiaCEMEICEIINTEGRALAgosto2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/CEI/INTEGRAL/Agosto2025/logAlunosMatriculadosFaixaEtariaDia";
import { mockLogDietasAutorizadasCEMEICEIINTEGRALAgosto2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/CEI/INTEGRAL/Agosto2025/logDietasAutorizadas";
import { mockDiasCalendarioCEMEIEMEIAgosto2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/EMEI/INTEGRAL/Agosto2025/diasCalendario";
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
          dia: 2,
          faixas_etarias: [
            "2e14cd6e-33e6-4168-b1ce-449f686d1e7d",
            "55f0af28-e1d5-43a0-a3f3-bbc453b784a5",
            "e3030bd1-2e85-4676-87b3-96b4032370d4",
          ],
          eh_parcial_integral: false,
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
      .onGet("/log-alunos-matriculados-faixa-etaria-dia/")
      .reply(
        200,
        mockAlunosMatriculadosFaixaEtariaDiaCEMEICEIINTEGRALAgosto2025,
      );
    mock
      .onGet("/log-quantidade-dietas-autorizadas-cei/")
      .reply(200, mockLogDietasAutorizadasCEMEICEIINTEGRALAgosto2025);
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
              state: mockLocationStateCEMEICEIINTEGRALAgosto2025,
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

  it("renderiza valor `INTEGRAL` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "INTEGRAL");
  });

  it("renderiza input do dia 02/08/2025 como habilitado por ter inclusão autorizada", () => {
    const inputDiaFrequenciaDia2 = screen.getByTestId(
      "frequencia__faixa_55f0af28-e1d5-43a0-a3f3-bbc453b784a5__dia_02__categoria_1",
    );
    expect(inputDiaFrequenciaDia2).toBeEnabled();
  });

  it("renderiza input do dia 03/08/2025 como desabilitado por ter NÃO inclusão autorizada", () => {
    const inputDiaFrequenciaDia2 = screen.getByTestId(
      "frequencia__faixa_55f0af28-e1d5-43a0-a3f3-bbc453b784a5__dia_03__categoria_1",
    );
    expect(inputDiaFrequenciaDia2).toBeDisabled();
  });
});
