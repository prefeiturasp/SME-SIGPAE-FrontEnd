import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockDiasCalendarioCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockDiasCalendarioCEI";
import { mockFeriadosNoMesCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockFeriadosNoMesCEI";
import { mockMeusDadosEscolaCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEI";
import { listDiasLetivosCalendario } from "src/services/diasLetivos";
import { getListaDiasSuspensaoAtividades } from "src/services/cadastroDiasSuspensaoAtividades.service";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import * as periodoLancamentoMedicaoService from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getSolicitacoesInclusoesAutorizadasEscola } from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getMeusDados } from "src/services/perfil.service";
import { PeriodoLancamentoMedicaoInicialCEI } from "..";

jest.mock("src/services/perfil.service.jsx");
jest.mock("src/services/medicaoInicial/diaSobremesaDoce.service.jsx");
jest.mock("src/services/medicaoInicial/periodoLancamentoMedicao.service");
jest.mock("src/services/faixaEtaria.service.jsx");
jest.mock("src/services/diasLetivos");
jest.mock("src/services/cadastroDiasSuspensaoAtividades.service");

const FAIXA_MENOR_UM_ANO_UUID = "55f0af28-e1d5-43a0-a3f3-bbc453b784a5";
const FAIXA_1_A_3_ANOS_UUID = "802ffeb0-3d70-4be9-97fe-20992ee9c0ff";
const FAIXA_4_A_6_ANOS_UUID = "0c914b27-c7cd-4682-a439-a4874745b005";
const DIA_KIT_LANCHE = "09";

const criarLogMatriculados = (faixa, quantidade) => ({
  escola: "CEI DIRET VILA BRASILANDIA",
  periodo_escolar: "INTEGRAL",
  dia: DIA_KIT_LANCHE,
  faixa_etaria: faixa,
  data: "09/11/2024",
  quantidade,
});

const logsMatriculados = [
  criarLogMatriculados(
    {
      __str__: "07 a 11 meses",
      uuid: FAIXA_MENOR_UM_ANO_UUID,
      inicio: 7,
      fim: 12,
    },
    100,
  ),
  criarLogMatriculados(
    {
      __str__: "01 ano a 03 anos e 11 meses",
      uuid: FAIXA_1_A_3_ANOS_UUID,
      inicio: 12,
      fim: 48,
    },
    100,
  ),
  criarLogMatriculados(
    {
      __str__: "04 anos a 06 anos",
      uuid: FAIXA_4_A_6_ANOS_UUID,
      inicio: 48,
      fim: 73,
    },
    100,
  ),
];

describe("PeriodoLancamentoMedicaoInicialCEI - Kit Lanche Passeio no Integral", () => {
  const mockLocationState = {
    ehEmeiDaCemei: false,
    escola: "CEI DIRET VILA BRASILANDIA",
    justificativa_periodo: null,
    mesAnoSelecionado: new Date("2024-11-01T00:00:00-03:00"),
    periodo: "INTEGRAL",
    periodosInclusaoContinua: undefined,
    status_periodo: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    status_solicitacao: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    tiposAlimentacao: [],
  };

  const renderizar = (state = mockLocationState) =>
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/", state }]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <PeriodoLancamentoMedicaoInicialCEI />
      </MemoryRouter>,
    );

  const aguardarServicos = async () => {
    await waitFor(() =>
      expect(
        periodoLancamentoMedicaoService.getSolicitacoesKitLanchesAutorizadasEscola,
      ).toHaveBeenCalled(),
    );
    await waitFor(() =>
      expect(
        periodoLancamentoMedicaoService.getFeriadosNoMes,
      ).toHaveBeenCalled(),
    );
  };

  const abrirSemanaDoKitLanche = async () => {
    await aguardarServicos();
    fireEvent.click(screen.getByText("Semana 2"));
  };

  const inputFrequencia = (uuid) =>
    screen.getByTestId(
      `frequencia__faixa_${uuid}__dia_${DIA_KIT_LANCHE}__categoria_1`,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    getMeusDados.mockResolvedValue({
      data: mockMeusDadosEscolaCEI,
      status: 200,
    });
    listDiasLetivosCalendario.mockResolvedValue({ data: [], status: 200 });
    getListaDiasSuspensaoAtividades.mockResolvedValue({
      data: [],
      status: 200,
    });
    getListaDiasSobremesaDoce.mockResolvedValue({ data: [], status: 200 });
    getFaixasEtarias.mockResolvedValue({
      data: { results: mockFaixasEtarias.results },
      status: 200,
    });
    getSolicitacoesInclusoesAutorizadasEscola.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });
    periodoLancamentoMedicaoService.getLogMatriculadosPorFaixaEtariaDia.mockResolvedValue(
      { data: logsMatriculados, status: 200 },
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
      { data: [], status: 200 },
    );
    periodoLancamentoMedicaoService.getValoresPeriodosLancamentos.mockResolvedValue(
      { data: [], status: 200 },
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
    periodoLancamentoMedicaoService.getSolicitacoesKitLanchesAutorizadasEscola.mockResolvedValue(
      {
        data: {
          results: [
            {
              dia: DIA_KIT_LANCHE,
              numero_alunos: 40,
              kit_lanche_id_externo: "ABC12",
            },
          ],
        },
        status: 200,
      },
    );
  });

  it("consulta kit lanches com eh_cei no Integral de CEI", async () => {
    renderizar();
    await aguardarServicos();

    expect(
      periodoLancamentoMedicaoService.getSolicitacoesKitLanchesAutorizadasEscola,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        eh_cei: true,
        tipo_solicitacao: "Kit Lanche",
      }),
    );
  });

  it("não envia eh_cei no período Solicitações de Alimentação - Infantil", async () => {
    renderizar({
      ...mockLocationState,
      periodo: "Solicitações de Alimentação",
      ehEmeiDaCemei: false,
    });
    await aguardarServicos();

    expect(
      periodoLancamentoMedicaoService.getSolicitacoesKitLanchesAutorizadasEscola,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        tipo_solicitacao: "Kit Lanche",
      }),
    );
    expect(
      periodoLancamentoMedicaoService.getSolicitacoesKitLanchesAutorizadasEscola,
    ).not.toHaveBeenCalledWith(expect.objectContaining({ eh_cei: true }));
  });

  it("libera a frequência das faixas com 1 ano ou mais e mantém menores de 1 ano bloqueada", async () => {
    renderizar();
    await abrirSemanaDoKitLanche();

    expect(inputFrequencia(FAIXA_1_A_3_ANOS_UUID)).not.toBeDisabled();
    expect(inputFrequencia(FAIXA_4_A_6_ANOS_UUID)).not.toBeDisabled();
    expect(inputFrequencia(FAIXA_MENOR_UM_ANO_UUID)).toBeDisabled();
  });

  it("bloqueia o salvamento quando a soma das faixas supera o kit lanche autorizado", async () => {
    renderizar();
    await abrirSemanaDoKitLanche();

    fireEvent.change(inputFrequencia(FAIXA_1_A_3_ANOS_UUID), {
      target: { value: "30" },
    });
    fireEvent.change(inputFrequencia(FAIXA_4_A_6_ANOS_UUID), {
      target: { value: "20" },
    });

    await waitFor(() => {
      expect(
        screen.getByText("Salvar Lançamentos").closest("button"),
      ).toBeDisabled();
    });
  });
});
