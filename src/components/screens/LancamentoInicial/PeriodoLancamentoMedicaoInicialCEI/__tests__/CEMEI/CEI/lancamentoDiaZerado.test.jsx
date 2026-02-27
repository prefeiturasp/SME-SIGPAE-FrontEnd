import "@testing-library/jest-dom";
import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockMeusDadosEscolaCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEI";
import { MemoryRouter } from "react-router-dom";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import * as periodoLancamentoMedicaoService from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getMeusDados } from "src/services/perfil.service";
import { PeriodoLancamentoMedicaoInicialCEI } from "../../../";
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

  const idCategoriaAlimentacao = mockCategoriasMedicaoCEI.find(
    (cat) => cat.nome === "ALIMENTAÇÃO",
  )?.id;

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

  it("deve desabilitar botão de salvar e exibir tooltip ao preencher frequência zero sem observação em dia letivo", async () => {
    await awaitServices();
    for (const faixa of mockFaixasEtariasCEI) {
      const nomeInput = screen.getByTestId(
        `frequencia__faixa_${faixa.uuid}__dia_02__categoria_${idCategoriaAlimentacao}`,
      );
      fireEvent.change(nomeInput, {
        target: { value: "0" },
      });
    }
    const botaoSalvar = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    await waitFor(() => {
      expect(botaoSalvar).toBeDisabled();
      const iconeTooltip = screen.getByTestId("icone-tooltip-info");
      expect(iconeTooltip).toHaveClass("icone-info-invalid");

      const divBotaoObservacao = screen.getByTestId(
        `div-botao-add-obs-02-${idCategoriaAlimentacao}-observacoes`,
      );
      const botaoObservacao = divBotaoObservacao.querySelector("button");
      expect(botaoObservacao).toBeInTheDocument();
      expect(botaoObservacao).toHaveClass("red-button-outline");
      expect(botaoObservacao).toHaveTextContent("Adicionar");
    });
  });

  it("deve habilitar botão de salvar após adicionar observação no dia zerado", async () => {
    await awaitServices();
    for (const faixa of mockFaixasEtariasCEI) {
      const nomeInput = screen.getByTestId(
        `frequencia__faixa_${faixa.uuid}__dia_02__categoria_${idCategoriaAlimentacao}`,
      );
      fireEvent.change(nomeInput, {
        target: { value: "0" },
      });
    }
    const botaoSalvar = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    await waitFor(() => {
      expect(botaoSalvar).toBeDisabled();
    });

    const botaoObservacao = screen
      .getByTestId(`div-botao-add-obs-02-${idCategoriaAlimentacao}-observacoes`)
      .querySelector("button");
    expect(botaoObservacao).toHaveTextContent("Adicionar");
    fireEvent.click(botaoObservacao);

    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();

    expect(screen.getByText("Observação Diária")).toBeInTheDocument();
    expect(screen.getByText("Data do Lançamento")).toBeInTheDocument();
    expect(
      within(modal).getByPlaceholderText("02/04/2025"),
    ).toBeInTheDocument();

    const btnSalvarObservacao = screen.getByTestId("botao-salvar");
    expect(btnSalvarObservacao).toBeDisabled();
    const btnVoltar = screen.getByTestId("botao-voltar");
    expect(btnVoltar).not.toBeDisabled();
    const btnExcluir = screen.queryByTestId("botao-excluir");
    expect(btnExcluir).not.toBeInTheDocument();

    const mensagem = "Minha justificativa para dias zerados.";
    const ckEditor = screen.getByTestId("ckeditor-mock");
    fireEvent.change(ckEditor, { target: { value: mensagem } });

    await waitFor(() => {
      expect(ckEditor.value).toBe(mensagem);
      expect(btnSalvarObservacao).not.toBeDisabled();
    });

    fireEvent.click(btnSalvarObservacao);

    await waitFor(() => {
      expect(modal).not.toBeInTheDocument();
    });

    expect(botaoSalvar).not.toBeDisabled();
    expect(botaoObservacao).toHaveTextContent("Visualizar");
    expect(botaoObservacao).toHaveClass("green-button");
  });

  it("deve reabilitar botão de salvar ao preencher valores positivos após ter preenchido zero", async () => {
    await awaitServices();
    for (const faixa of mockFaixasEtariasCEI) {
      const nomeInput = screen.getByTestId(
        `frequencia__faixa_${faixa.uuid}__dia_02__categoria_${idCategoriaAlimentacao}`,
      );
      fireEvent.change(nomeInput, {
        target: { value: "0" },
      });
    }
    const botaoSalvar = screen
      .getByText("Salvar Lançamentos")
      .closest("button");
    const divBotaoObservacao = screen.getByTestId(
      `div-botao-add-obs-02-${idCategoriaAlimentacao}-observacoes`,
    );
    const botaoObservacao = divBotaoObservacao.querySelector("button");
    await waitFor(() => {
      expect(botaoSalvar).toBeDisabled();
      const iconeTooltip = screen.getByTestId("icone-tooltip-info");
      expect(iconeTooltip).toHaveClass("icone-info-invalid");
      expect(botaoObservacao).toBeInTheDocument();
      expect(botaoObservacao).toHaveClass("red-button-outline");
      expect(botaoObservacao).toHaveTextContent("Adicionar");
    });

    const faixa = mockFaixasEtariasCEI[0];
    const nomeInput = `frequencia__faixa_${faixa.uuid}__dia_02__categoria_${idCategoriaAlimentacao}`;
    const input = screen.getByTestId(nomeInput);
    fireEvent.change(input, { target: { value: "1" } });

    await waitFor(() => {
      expect(botaoSalvar).not.toBeDisabled();
      expect(botaoObservacao).toBeInTheDocument();
      expect(botaoObservacao).toHaveClass("green-button-outline-white");
      expect(botaoObservacao).toHaveTextContent("Adicionar");
    });
  });

  it("deve mostrar observação salva ao reabrir modal", async () => {
    await awaitServices();
    for (const faixa of mockFaixasEtariasCEI) {
      const nomeInput = screen.getByTestId(
        `frequencia__faixa_${faixa.uuid}__dia_02__categoria_${idCategoriaAlimentacao}`,
      );
      fireEvent.change(nomeInput, {
        target: { value: "0" },
      });
    }

    const botaoObservacao = screen
      .getByTestId(`div-botao-add-obs-02-${idCategoriaAlimentacao}-observacoes`)
      .querySelector("button");
    fireEvent.click(botaoObservacao);
    const btnSalvarObservacao = screen.getByTestId("botao-salvar");
    const mensagem = "Minha justificativa para dias zerados.";
    const ckEditor = screen.getByTestId("ckeditor-mock");
    fireEvent.change(ckEditor, { target: { value: mensagem } });
    fireEvent.click(btnSalvarObservacao);

    fireEvent.click(botaoObservacao);
    const modal = await screen.findByRole("dialog");
    const ckEditorTexto = within(modal).getByTestId("ckeditor-mock");
    expect(ckEditorTexto.value).toContain(mensagem);
    fireEvent.click(within(modal).getByTestId("botao-voltar"));
  });
});
