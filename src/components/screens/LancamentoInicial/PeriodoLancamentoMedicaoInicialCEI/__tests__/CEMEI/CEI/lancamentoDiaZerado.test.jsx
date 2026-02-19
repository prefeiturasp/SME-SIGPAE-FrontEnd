import "@testing-library/jest-dom";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockMeusDadosEscolaCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEI";
import { MemoryRouter } from "react-router-dom";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import * as periodoLancamentoMedicaoService from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getSolicitacoesInclusoesAutorizadasEscola } from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getMeusDados } from "src/services/perfil.service";
import { PeriodoLancamentoMedicaoInicialCEI } from "../../../";
import preview from "jest-preview";

jest.mock("src/services/perfil.service.jsx");
jest.mock("src/services/medicaoInicial/diaSobremesaDoce.service.jsx");
jest.mock("src/services/medicaoInicial/periodoLancamentoMedicao.service");
jest.mock("src/services/faixaEtaria.service.jsx");

const awaitServices = async () => {
  await waitFor(() => expect(getListaDiasSobremesaDoce).toHaveBeenCalled());
  await waitFor(() =>
    expect(getSolicitacoesInclusoesAutorizadasEscola).toHaveBeenCalled(),
  );
  await waitFor(() =>
    expect(periodoLancamentoMedicaoService.getFeriadosNoMes).toHaveBeenCalled(),
  );
};

function formatarData(dia) {
  const diaFormatado = String(dia).padStart(2, "0");
  return `${diaFormatado}/04/2025`;
}

function criarRegistro(dia, faixaEtaria) {
  const diaFormatado = String(dia).padStart(2, "0");

  return {
    escola: "CEI DIRET JOAQUIM GOUVEIA FRANCO JR., VER.",
    periodo_escolar: "INTEGRAL",
    dia: diaFormatado,
    faixa_etaria: faixaEtaria,
    data: formatarData(dia),
    quantidade: 14,
  };
}

const ehDiaLetivo = (dia) => {
  const data = new Date(2025, 3, dia);
  const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado
  return diaSemana !== 0 && diaSemana !== 6;
};

describe("Funcionalidade de dias zerados", () => {
  const mockLocationState = {
    ehEmeiDaCemei: false,
    escola: "CEI DIRET JOAQUIM GOUVEIA FRANCO JR., VER.",
    justificativa_periodo: null,
    mesAnoSelecionado: new Date("2025-04-01T00:00:00-03:00"),
    periodo: "PARCIAL",
    periodosInclusaoContinua: undefined,
    status_periodo: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    status_solicitacao: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    tiposAlimentacao: [],
  };

  const mockDiasCalendarioCEIComZerados = Array.from(
    { length: 30 },
    (_, index) => {
      const dia = index + 1;

      return {
        escola: "CEI DIRET JOAQUIM GOUVEIA FRANCO JR., VER.",
        dia: String(dia).padStart(2, "0"),
        periodo_escolar: null,
        criado_em: "22/04/2025 17:24:03",
        alterado_em: "06/02/2026 17:14:36",
        data: formatarData(dia),
        dia_letivo: ehDiaLetivo(dia),
      };
    },
  );

  const mockFaixasEtariasCEI = [
    {
      __str__: "01 a 03 meses",
      uuid: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
      inicio: 1,
      fim: 4,
    },
    {
      __str__: "04 a 05 meses",
      uuid: "4e60c819-4c0b-4d46-95c8-2e3b9674b40e",
      inicio: 4,
      fim: 6,
    },
    {
      __str__: "06 meses",
      uuid: "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66",
      inicio: 6,
      fim: 7,
    },
  ];
  const mockLogsMatriculadosCEIComZerados = (() => {
    const resultado = [];
    for (let dia = 1; dia <= 30; dia += 1) {
      for (const faixa of mockFaixasEtariasCEI) {
        resultado.push(criarRegistro(dia, faixa));
      }
    }
    return resultado;
  })();

  beforeEach(() => {
    jest.clearAllMocks();

    getMeusDados.mockResolvedValue({
      data: mockMeusDadosEscolaCEI,
      status: 200,
    });
    getFaixasEtarias.mockResolvedValue({
      data: { results: mockFaixasEtariasCEI },
      status: 200,
    });
    getListaDiasSobremesaDoce.mockResolvedValue({ data: [], status: 200 });
    getSolicitacoesInclusoesAutorizadasEscola.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });
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
    periodoLancamentoMedicaoService.getDiasCalendario.mockResolvedValue({
      data: mockDiasCalendarioCEIComZerados,
      status: 200,
    });
    periodoLancamentoMedicaoService.getLogDietasAutorizadasCEIPeriodo.mockResolvedValue(
      { data: [], status: 200 },
    );
    periodoLancamentoMedicaoService.getLogMatriculadosPorFaixaEtariaDia.mockResolvedValue(
      {
        data: mockLogsMatriculadosCEIComZerados,
        status: 200,
      },
    );

    periodoLancamentoMedicaoService.getValoresPeriodosLancamentos.mockResolvedValue(
      {
        data: [],
        status: 200,
      },
    );
    periodoLancamentoMedicaoService.getDiasParaCorrecao.mockResolvedValue({
      data: [],
      status: 200,
    });

    periodoLancamentoMedicaoService.getFeriadosNoMes.mockResolvedValue({
      data: { results: ["18", "20", "21"] },
      status: 200,
    });

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

  it("Teste renderização", async () => {
    await awaitServices();
    preview.debug();
  });
});
