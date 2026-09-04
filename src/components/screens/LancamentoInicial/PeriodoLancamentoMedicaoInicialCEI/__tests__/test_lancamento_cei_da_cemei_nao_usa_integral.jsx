import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockDiasCalendarioCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockDiasCalendarioCEI";
import { mockFeriadosNoMesCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockFeriadosNoMesCEI";
import { mockFaixasEtariasCEIInclusao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockFaixasEtariasCEIInclusao";
import { mockInclusoesAutorizadasEscolaCEIDia2 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockInclusoesAutorizadasEscolaCEIDia2";
import { mockLogsDietasAutorizadasCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockLogsDietasAutorizadasCEI";
import { mockLogsMatriculadosCEICEMEIDia2 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockLogsMatriculadosCEICEMEIDia2";
import { mockLogsMatriculadosCEIInclusaoDia2 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockLogsMatriculadosCEIInclusaoDia2";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEMEI";
import { mockUpdateValoresPeriodosLancamentosCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockUpdateValoresPeriodoLancamentoCEI";
import { mockValoresMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockValoresMedicaoCEI";
import { listDiasLetivosCalendario } from "src/services/diasLetivos";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import * as periodoLancamentoMedicaoService from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getSolicitacoesInclusoesAutorizadasEscola } from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getMeusDados } from "src/services/perfil.service";
import { PeriodoLancamentoMedicaoInicialCEI } from "..";
import { getListaDiasSuspensaoAtividades } from "src/services/cadastroDiasSuspensaoAtividades.service";

jest.mock("src/services/perfil.service.jsx");
jest.mock("src/services/medicaoInicial/diaSobremesaDoce.service.jsx");
jest.mock("src/services/medicaoInicial/periodoLancamentoMedicao.service");
jest.mock("src/services/faixaEtaria.service.jsx");
jest.mock("src/services/diasLetivos");
jest.mock("src/services/cadastroDiasSuspensaoAtividades.service");

const awaitServices = async () => {
  await waitFor(() => expect(getListaDiasSobremesaDoce).toHaveBeenCalled());
  await waitFor(() =>
    expect(getSolicitacoesInclusoesAutorizadasEscola).toHaveBeenCalled(),
  );
  await waitFor(() =>
    expect(periodoLancamentoMedicaoService.getFeriadosNoMes).toHaveBeenCalled(),
  );
};

describe("Test <PeriodoLancamentoMedicaoInicialCEI> CEI da CEMEI não utiliza logs do INTEGRAL", () => {
  const mockLocationState = {
    ehEmeiDaCemei: false,
    escola: "CEMEI SUZANA CAMPOS TAUIL",
    justificativa_periodo: null,
    mesAnoSelecionado: new Date("2024-11-01T00:00:00-03:00"),
    periodo: "PARCIAL",
    periodosInclusaoContinua: undefined,
    status_periodo: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    status_solicitacao: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    tiposAlimentacao: [],
  };

  beforeEach(() => {
    getMeusDados.mockResolvedValue({
      data: mockMeusDadosEscolaCEMEI,
      status: 200,
    });
    listDiasLetivosCalendario.mockResolvedValue({
      data: [],
      status: 200,
    });
    getListaDiasSuspensaoAtividades.mockResolvedValue({
      data: [],
      status: 200,
    });
    getListaDiasSobremesaDoce.mockResolvedValue({ data: [], status: 200 });
    getFaixasEtarias.mockResolvedValue({
      data: { results: mockFaixasEtariasCEIInclusao },
      status: 200,
    });
    getSolicitacoesInclusoesAutorizadasEscola.mockResolvedValue({
      data: mockInclusoesAutorizadasEscolaCEIDia2,
      status: 200,
    });
    periodoLancamentoMedicaoService.getLogMatriculadosPorFaixaEtariaDia.mockImplementation(
      (params) => {
        if (params?.nome_periodo_escolar?.includes("INTEGRAL")) {
          return Promise.resolve({
            data: mockLogsMatriculadosCEIInclusaoDia2,
            status: 200,
          });
        }
        return Promise.resolve({
          data: mockLogsMatriculadosCEICEMEIDia2,
          status: 200,
        });
      },
    );
    periodoLancamentoMedicaoService.getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola.mockResolvedValue(
      { results: [] },
    );
    periodoLancamentoMedicaoService.getSolicitacoesSuspensoesAutorizadasEscola.mockResolvedValue(
      { results: [] },
    );
    periodoLancamentoMedicaoService.getCategoriasDeMedicao.mockResolvedValue({
      data: mockCategoriasMedicaoCEI,
      status: 200,
    });
    periodoLancamentoMedicaoService.getLogDietasAutorizadasCEIPeriodo.mockResolvedValue(
      { data: mockLogsDietasAutorizadasCEI, status: 200 },
    );
    periodoLancamentoMedicaoService.getValoresPeriodosLancamentos.mockResolvedValue(
      { data: mockValoresMedicaoCEI, status: 200 },
    );
    periodoLancamentoMedicaoService.getDiasParaCorrecao.mockResolvedValue({
      data: [],
      status: 200,
    });
    periodoLancamentoMedicaoService.getDiasCalendario.mockResolvedValue({
      data: mockDiasCalendarioCEI,
      status: 200,
    });
    periodoLancamentoMedicaoService.getFeriadosNoMes.mockResolvedValue({
      data: mockFeriadosNoMesCEI,
      status: 200,
    });
    periodoLancamentoMedicaoService.updateValoresPeriodosLancamentos.mockResolvedValue(
      {
        data: mockUpdateValoresPeriodosLancamentosCEI,
        status: 200,
      },
    );

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/", state: mockLocationState }]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <PeriodoLancamentoMedicaoInicialCEI />
      </MemoryRouter>,
    );
  });

  it("não busca os logs do INTEGRAL para a inclusão do CEI da CEMEI", async () => {
    await awaitServices();
    const chamadas =
      periodoLancamentoMedicaoService.getLogMatriculadosPorFaixaEtariaDia.mock
        .calls;
    const chamadasComIntegral = chamadas.filter(([params]) =>
      params?.nome_periodo_escolar?.includes("INTEGRAL"),
    );
    expect(chamadas.length).toBe(1);
    expect(chamadasComIntegral.length).toBe(0);
  });

  it("exibe, no dia 2, o log de matriculados do PARCIAL em vez de usar o do INTEGRAL", async () => {
    await awaitServices();
    const inputMatriculados1AnoA3anos = screen.getByTestId(
      "matriculados__faixa_802ffeb0-3d70-4be9-97fe-20992ee9c0ff__dia_02__categoria_1",
    );
    const valor1AnoA3anos = inputMatriculados1AnoA3anos.getAttribute("value");
    expect(valor1AnoA3anos).toBe("3");
  });

  it("não exibe faixa etária sem log no PARCIAL (presente apenas na inclusão)", async () => {
    await awaitServices();
    expect(
      screen.queryByTestId(
        "matriculados__faixa_0c914b27-c7cd-4682-a439-a4874745b005__dia_02__categoria_1",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(
        "frequencia__faixa_0c914b27-c7cd-4682-a439-a4874745b005__dia_02__categoria_1",
      ),
    ).not.toBeInTheDocument();
  });

  it("habilita o dia 2 para lançamento (frequência) no CEI da CEMEI", async () => {
    await awaitServices();
    const inputFrequencia1AnoA3anos = screen.getByTestId(
      "frequencia__faixa_802ffeb0-3d70-4be9-97fe-20992ee9c0ff__dia_02__categoria_1",
    );
    expect(inputFrequencia1AnoA3anos).not.toBeDisabled();
  });
});
