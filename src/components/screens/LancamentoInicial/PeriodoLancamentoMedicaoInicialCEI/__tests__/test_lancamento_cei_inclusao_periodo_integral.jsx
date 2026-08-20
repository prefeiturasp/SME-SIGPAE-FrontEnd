import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockDiasCalendarioCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockDiasCalendarioCEI";
import { mockFeriadosNoMesCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockFeriadosNoMesCEI";
import { mockInclusoesAutorizadasEscolaCEIPeriodoIntegral } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockInclusoesAutorizadasEscolaCEIPeriodoIntegral";
import { mockLogsDietasAutorizadasCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockLogsDietasAutorizadasCEI";
import { mockLogsMatriculadosCEIPeriodoIntegral } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockLogsMatriculadosCEIPeriodoIntegral";
import { mockMeusDadosEscolaCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEI";
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

describe("Test <PeriodoLancamentoMedicaoInicialCEI> com inclusão INTEGRAL em dia não letivo", () => {
  const mockLocationState = {
    ehEmeiDaCemei: false,
    escola: "CEI DIRET VILA BRASILANDIA",
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
      data: mockMeusDadosEscolaCEI,
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
    getFaixasEtarias.mockResolvedValue({ data: { results: [] }, status: 200 });
    getSolicitacoesInclusoesAutorizadasEscola.mockResolvedValue({
      data: mockInclusoesAutorizadasEscolaCEIPeriodoIntegral,
      status: 200,
    });
    periodoLancamentoMedicaoService.getLogMatriculadosPorFaixaEtariaDia.mockResolvedValue(
      {
        data: mockLogsMatriculadosCEIPeriodoIntegral,
        status: 200,
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

  it("não busca os logs do período INTEGRAL para a inclusão (mantém log do PARCIAL)", async () => {
    await awaitServices();
    const chamadas =
      periodoLancamentoMedicaoService.getLogMatriculadosPorFaixaEtariaDia.mock
        .calls;
    const chamadasComIntegral = chamadas.filter(([params]) =>
      params?.nome_periodo_escolar?.includes("INTEGRAL"),
    );
    expect(chamadasComIntegral.length).toBe(0);
  });

  it("exibe, no dia 9, o log de matriculados do PARCIAL (5 e 2) em vez do INTEGRAL", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);
    const inputMatriculados1AnoA3anos = screen.getByTestId(
      "matriculados__faixa_802ffeb0-3d70-4be9-97fe-20992ee9c0ff__dia_09__categoria_1",
    );
    expect(inputMatriculados1AnoA3anos).toHaveAttribute("value", "2");
    const inputMatriculados4a6anos = screen.getByTestId(
      "matriculados__faixa_0c914b27-c7cd-4682-a439-a4874745b005__dia_09__categoria_1",
    );
    expect(inputMatriculados4a6anos).toHaveAttribute("value", "5");
  });

  it("habilita o dia 9 para lançamento (frequência) mesmo com inclusão INTEGRAL", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);
    const inputFrequencia1AnoA3anos = screen.getByTestId(
      "frequencia__faixa_802ffeb0-3d70-4be9-97fe-20992ee9c0ff__dia_09__categoria_1",
    );
    expect(inputFrequencia1AnoA3anos).not.toBeDisabled();
    const inputFrequencia4a6anos = screen.getByTestId(
      "frequencia__faixa_0c914b27-c7cd-4682-a439-a4874745b005__dia_09__categoria_1",
    );
    expect(inputFrequencia4a6anos).not.toBeDisabled();
  });
});
