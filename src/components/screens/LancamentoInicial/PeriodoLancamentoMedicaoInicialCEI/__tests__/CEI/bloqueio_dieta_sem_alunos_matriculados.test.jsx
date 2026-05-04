import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockMeusDadosEscolaCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEI";
import { MemoryRouter } from "react-router-dom";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import * as periodoLancamentoMedicaoService from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getMeusDados } from "src/services/perfil.service";
import { PeriodoLancamentoMedicaoInicialCEI } from "../..";
import { mockSalvarObservacao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockSalvarObservacaoDiasZerados.jsx";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, onChange }) => (
    <textarea
      data-testid="ckeditor-mock"
      {...input}
      onChange={(e) => {
        input.onChange(e.target.value);
        onChange && onChange(e.target.value, { getData: () => e.target.value });
      }}
    />
  ),
}));

jest.mock("src/services/perfil.service.jsx");
jest.mock("src/services/medicaoInicial/diaSobremesaDoce.service.jsx");
jest.mock("src/services/medicaoInicial/periodoLancamentoMedicao.service");
jest.mock("src/services/faixaEtaria.service.jsx");

const awaitServices = async () => {
  await waitFor(() => expect(getListaDiasSobremesaDoce).toHaveBeenCalled());
  await waitFor(() =>
    expect(
      periodoLancamentoMedicaoService.getSolicitacoesInclusoesAutorizadasEscola,
    ).toHaveBeenCalled(),
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

describe("Bloqueio de dietas sem log de matriculados - CEI", () => {
  const mockLocationState = {
    ehEmeiDaCemei: false,
    escola: "CEI DIRET JOAQUIM GOUVEIA FRANCO JR., VER.",
    justificativa_periodo: null,
    mesAnoSelecionado: new Date("2025-04-01T00:00:00-03:00"),
    periodo: "INTEGRAL",
    periodosInclusaoContinua: undefined,
    status_periodo: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    status_solicitacao: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    tiposAlimentacao: [],
  };

  const mockDiasCalendarioCEI = Array.from({ length: 30 }, (_, index) => {
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
  });

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

  const mockLogsMatriculadosCEI = (() => {
    const resultado = [];
    for (let dia = 1; dia <= 30; dia += 1) {
      for (const faixa of mockFaixasEtariasCEI) {
        if (![11, 12, 13].includes(dia)) {
          resultado.push(criarRegistro(dia, faixa));
        }
      }
    }
    return resultado;
  })();

  const criarDietas = (dias, base) => {
    return dias.map((dia) => {
      const diaStr = String(dia).padStart(2, "0");

      return {
        ...base,
        dia: diaStr,
        data: `${diaStr}/04/2025`,
      };
    });
  };

  const baseDieta = {
    escola: "CEI DIRET JOAQUIM GOUVEIA FRANCO JR., VER",
    classificacao: "Tipo B",
    periodo_escolar: "INTEGRAL",
    faixa_etaria: {
      __str__: "01 a 03 meses",
      uuid: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
      inicio: 1,
      fim: 4,
    },
    criado_em: "08/12/2025 11:04:28",
    quantidade: 4,
  };

  const dietaespecial = criarDietas([7, 8, 9, 10, 11], baseDieta);

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
    periodoLancamentoMedicaoService.getSolicitacoesInclusoesAutorizadasEscola.mockResolvedValue(
      {
        data: { results: [] },
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
    periodoLancamentoMedicaoService.getDiasCalendario.mockResolvedValue({
      data: mockDiasCalendarioCEI,
      status: 200,
    });
    periodoLancamentoMedicaoService.getLogDietasAutorizadasCEIPeriodo.mockResolvedValue(
      { data: dietaespecial, status: 200 },
    );
    periodoLancamentoMedicaoService.getLogMatriculadosPorFaixaEtariaDia.mockResolvedValue(
      {
        data: mockLogsMatriculadosCEI,
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

    periodoLancamentoMedicaoService.setPeriodoLancamento.mockResolvedValue({
      data: mockSalvarObservacao,
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

  describe("Testa conteúdo básico da tela", () => {
    it("renderiza label `Mês do Lançamento`", async () => {
      expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
    });

    it("renderiza valor `Abril / 2025` no input `Mês do Lançamento`", () => {
      const inputElement = screen.getByTestId("input-mes-lancamento");
      expect(inputElement).toHaveAttribute("value", "Abril / 2025");
    });

    it("renderiza label `Período de Lançamento`", () => {
      expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
    });

    it("renderiza valor `INTEGRAL` no input `Período de Lançamento`", () => {
      const inputElement = screen.getByTestId("input-periodo-lancamento");
      expect(inputElement).toHaveAttribute("value", "INTEGRAL");
    });

    it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
      expect(
        screen.getByText(
          "Semanas do Período para Lançamento da Medição Inicial",
        ),
      ).toBeInTheDocument();
    });

    it("renderiza as labels `Semana 1`, `Semana 2`, `Semana 3`, `Semana 4` e `Semana 5`", async () => {
      await awaitServices();
      expect(screen.getByText("Semana 1")).toBeInTheDocument();
      expect(screen.getByText("Semana 2")).toBeInTheDocument();
      expect(screen.getByText("Semana 3")).toBeInTheDocument();
      expect(screen.getByText("Semana 4")).toBeInTheDocument();
      expect(screen.getByText("Semana 5")).toBeInTheDocument();
    });

    it("renderiza label `ALIMENTAÇÃO`", async () => {
      await awaitServices();
      expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    });

    it("renderiza label `DIETA ESPECIAL - TIPO B`", async () => {
      await awaitServices();
      expect(screen.getByText("DIETA ESPECIAL - TIPO B")).toBeInTheDocument();
    });
  });

  describe("Testa boqueio de dietas", () => {
    const faixaDieta = "381aecc2-e1b2-4d26-a156-1834eec7f1dd";

    const obterCampo = (campo, dia, faixa, categoria) =>
      screen.findByTestId(
        `${campo}__faixa_${faixa}__dia_${String(dia).padStart(2, "0")}__categoria_${categoria}`,
      );

    const assertCampos = async (
      campos,
      dia,
      faixa,
      categoria,
      habilitado = true,
    ) => {
      for (const campo of campos) {
        const input = await obterCampo(campo, dia, faixa, categoria);
        habilitado
          ? expect(input).not.toBeDisabled()
          : expect(input).toBeDisabled();
      }
    };

    it("deve habilitar campos dos dias 7 a 10 exceto matriculados e dietas_autorizadas", async () => {
      await awaitServices();
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);
      for (let dia = 7; dia <= 10; dia++) {
        for (let faixa of mockFaixasEtariasCEI) {
          await assertCampos(["matriculados"], dia, faixa.uuid, 1, false);
          await assertCampos(["frequencia"], dia, faixa.uuid, 1, true);
        }

        await assertCampos(["dietas_autorizadas"], dia, faixaDieta, 4, false);
        await assertCampos(["frequencia"], dia, faixaDieta, 4, true);
      }
    });

    it("deve desabilitar todos os campos do dia 11 e validar valores de matriculados e dietas", async () => {
      await awaitServices();
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);

      const dia = 11;
      const diaStr = String(dia).padStart(2, "0");

      for (let faixa of mockFaixasEtariasCEI) {
        await assertCampos(["matriculados"], dia, faixa.uuid, 1, false);
        const matriculados = await screen.findByTestId(
          `matriculados__faixa_${faixa.uuid}__dia_${diaStr}__categoria_1`,
        );
        expect(matriculados).toHaveValue("");

        await assertCampos(["frequencia"], dia, faixa.uuid, 1, false);
      }

      await assertCampos(["dietas_autorizadas"], dia, faixaDieta, 4, false);
      const dieta = await screen.findByTestId(
        `dietas_autorizadas__faixa_${faixaDieta}__dia_${diaStr}__categoria_4`,
      );
      expect(dieta).toHaveValue("4");

      await assertCampos(["frequencia"], dia, faixaDieta, 4, false);
    });
  });
});
