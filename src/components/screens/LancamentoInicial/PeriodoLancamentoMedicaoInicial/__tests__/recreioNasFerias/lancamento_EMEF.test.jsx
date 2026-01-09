import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockLocationStateGrupoRecreioNasFerias } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/mockStateEMEFGrupoRecreio";
import { mockValoresMedicaoEMEF } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/valoresMedicaoEMEF";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockDiasLetivos } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/diasLetivosRecreio";
import { mockSalvaLancamentoSemana1 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/mockSalvaLancamentoEMEF";
import {
  getCategoriasDeMedicao,
  getFeriadosNoMes,
  getValoresPeriodosLancamentos,
  updateValoresPeriodosLancamentos,
  getDiasLetivosRecreio,
  getSolicitacoesInclusoesAutorizadasEscola,
  getDiasParaCorrecao,
  getSolicitacoesSuspensoesAutorizadasEscola,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getLogDietasAutorizadasRecreioNasFerias,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import { mockVinculosTipoAlimentacaoEPeriodoEscolar } from "src/mocks/InclusaoAlimentacao/mockVinculosTipoAlimentacaoEPeriodoescolar";
import {
  getTiposDeAlimentacao,
  getVinculosTipoAlimentacaoPorEscola,
} from "src/services/cadastroTipoAlimentacao.service";
import { getMeusDados } from "src/services/perfil.service";
import PeriodoLancamentoMedicaoInicial from "../..";
import { ToastContainer } from "react-toastify";
import { mockLogQuantidadeDietasAutorizadasRecreio } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/mockDietasEspeciais";

jest.mock("src/services/perfil.service.jsx");
jest.mock("src/services/medicaoInicial/diaSobremesaDoce.service.jsx");
jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/medicaoInicial/periodoLancamentoMedicao.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getListaDiasSobremesaDoce).toHaveBeenCalled();
    expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalled();
    expect(getSolicitacoesInclusoesAutorizadasEscola).toHaveBeenCalled();
    expect(getCategoriasDeMedicao).toHaveBeenCalled();
    expect(getDiasParaCorrecao).toHaveBeenCalled();
    expect(getValoresPeriodosLancamentos).toHaveBeenCalled();
    expect(getSolicitacoesSuspensoesAutorizadasEscola).toHaveBeenCalled();
    expect(
      getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
    ).toHaveBeenCalled();
    expect(getDiasLetivosRecreio).toHaveBeenCalled();
    expect(getFeriadosNoMes).toHaveBeenCalled();
    expect(getLogDietasAutorizadasRecreioNasFerias).toHaveBeenCalled();
  });
};

describe("Teste <PeriodoLancamentoMedicaoInicial> para o Grupo Recreio Nas Férias - EMEF", () => {
  beforeEach(async () => {
    getMeusDados.mockResolvedValue({
      data: mockMeusDadosEscolaEMEFPericles,
      status: 200,
    });
    getListaDiasSobremesaDoce.mockResolvedValue({ data: [], status: 200 });
    getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      data: mockVinculosTipoAlimentacaoEPeriodoEscolar,
      status: 200,
    });
    getSolicitacoesInclusoesAutorizadasEscola.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });
    getCategoriasDeMedicao.mockResolvedValue({
      data: mockCategoriasMedicao,
      status: 200,
    });

    getTiposDeAlimentacao.mockResolvedValue({
      data: { data: { results: [] }, status: 200 },
      status: 200,
    });
    getValoresPeriodosLancamentos.mockResolvedValue({
      data: mockValoresMedicaoEMEF,
      status: 200,
    });
    getDiasParaCorrecao.mockResolvedValue({
      data: [],
      status: 200,
    });
    getSolicitacoesSuspensoesAutorizadasEscola.mockResolvedValue({
      data: { data: { results: [] }, status: 200 },
      status: 200,
    });

    getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getDiasLetivosRecreio.mockResolvedValue({
      data: mockDiasLetivos,
      status: 200,
    });
    getFeriadosNoMes.mockResolvedValue({
      data: { results: ["25"] },
      status: 200,
    });
    updateValoresPeriodosLancamentos.mockResolvedValue({
      data: mockSalvaLancamentoSemana1,
      status: 200,
    });

    getLogDietasAutorizadasRecreioNasFerias.mockResolvedValue({
      data: mockLogQuantidadeDietasAutorizadasRecreio,
      status: 200,
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/", state: mockLocationStateGrupoRecreioNasFerias },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <PeriodoLancamentoMedicaoInicial />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("renderiza label `Mês do Lançamento`", async () => {
    await awaitServices();
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Recreio nas Férias - DEZ 2025` Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute(
      "value",
      mockLocationStateGrupoRecreioNasFerias.solicitacaoMedicaoInicial
        .recreio_nas_ferias.titulo,
    );
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Recreio nas Férias` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute(
      "value",
      mockLocationStateGrupoRecreioNasFerias.grupo,
    );
  });

  it("renderiza quadro de legendas", () => {
    expect(screen.getByText("Legenda das Informações:")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Há erros no lançamento. Corrija para conseguir salvar.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Há divergências no lançamento. Adicione uma observação.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Atenção! Verifique se está correto e prossiga os apontamentos.",
      ),
    ).toBeInTheDocument();
  });

  it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
    expect(
      screen.getByText("Semanas do Período para Lançamento da Medição Inicial"),
    ).toBeInTheDocument();
  });

  it("renderiza as labels `Semana 1` e `Semana 2`", async () => {
    await awaitServices();
    expect(screen.getByText("Semana 1")).toBeInTheDocument();
    expect(screen.getByText("Semana 2")).toBeInTheDocument();
  });

  it("não renderiza as labels  `Semana 3`, `Semana 4`, `Semana 5`", async () => {
    await awaitServices();
    expect(screen.queryByText("Semana 3")).not.toBeInTheDocument();
    expect(screen.queryByText("Semana 4")).not.toBeInTheDocument();
    expect(screen.queryByText("Semana 5")).not.toBeInTheDocument();
  });

  it("renderiza label `ALIMENTAÇÃO`", async () => {
    await awaitServices();
    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
  });

  it("renderiza label `Participantes` dentro da seção `ALIMENTAÇÃO`", async () => {
    await awaitServices();
    const categoriaAlimentacaoUuid = "6a183159-32bb-4a3b-a69b-f0601ee677c1";
    const myElement = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoriaAlimentacaoUuid}`,
    );
    const allParticipantes = screen.getAllByText("Participantes");
    const specificParticipantes = allParticipantes.find((element) =>
      myElement.contains(element),
    );
    expect(specificParticipantes).toBeInTheDocument();
  });

  it("renderiza label `Seg.` dentro da seção `ALIMENTAÇÃO`", async () => {
    await awaitServices();
    const categoriaAlimentacaoUuid = "6a183159-32bb-4a3b-a69b-f0601ee677c1";
    const myElement = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoriaAlimentacaoUuid}`,
    );
    const allParticipantes = screen.getAllByText("Seg.");
    const specificParticipantes = allParticipantes.find((element) =>
      myElement.contains(element),
    );
    expect(specificParticipantes).toBeInTheDocument();
  });

  it("ao clicar na tab `Semana 1`, exibe, nos dias 01 a 07, e verifica oa lançamentos", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);

    const VALORES_ESPERADOS = {
      1: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      2: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      3: {
        participantes: "100",
        frequencia: "100",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      4: {
        participantes: "100",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      5: {
        participantes: "100",
        frequencia: "83",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      6: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      7: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
    };

    for (let dia = 1; dia <= 7; dia++) {
      const valoresDia = VALORES_ESPERADOS[dia];

      const inputParticipantes = screen.getByTestId(
        `participantes__dia_0${dia}__categoria_1`,
      );
      const inputFrequencia = screen.getByTestId(
        `frequencia__dia_0${dia}__categoria_1`,
      );
      const inputLanche4h = screen.getByTestId(
        `lanche_4h__dia_0${dia}__categoria_1`,
      );
      const inputLanche = screen.getByTestId(
        `lanche__dia_0${dia}__categoria_1`,
      );
      const inputRefeicao = screen.getByTestId(
        `refeicao__dia_0${dia}__categoria_1`,
      );
      const inputRepeticaoRefeicao = screen.getByTestId(
        `repeticao_refeicao__dia_0${dia}__categoria_1`,
      );
      const inputSobremesa = screen.getByTestId(
        `sobremesa__dia_0${dia}__categoria_1`,
      );
      const inputRepeticaoSobremesa = screen.getByTestId(
        `repeticao_sobremesa__dia_0${dia}__categoria_1`,
      );

      expect(inputParticipantes).toHaveAttribute(
        "value",
        valoresDia.participantes,
      );
      expect(inputFrequencia).toHaveAttribute("value", valoresDia.frequencia);
      expect(inputLanche4h).toHaveAttribute("value", valoresDia.lanche4h);
      expect(inputLanche).toHaveAttribute("value", valoresDia.lanche);
      expect(inputRefeicao).toHaveAttribute("value", valoresDia.refeicao);
      expect(inputRepeticaoRefeicao).toHaveAttribute(
        "value",
        valoresDia.repeticao_refeicao,
      );
      expect(inputSobremesa).toHaveAttribute("value", valoresDia.sobremesa);
      expect(inputRepeticaoSobremesa).toHaveAttribute(
        "value",
        valoresDia.repeticao_sobremesa,
      );

      expect(inputParticipantes.disabled).toBe(true);
      if ([1, 2, 6, 7].includes(dia)) {
        expect(inputFrequencia.disabled).toBe(true);
        expect(inputLanche4h.disabled).toBe(true);
        expect(inputLanche.disabled).toBe(true);
        expect(inputRefeicao.disabled).toBe(true);
        expect(inputRepeticaoRefeicao.disabled).toBe(true);
        expect(inputSobremesa.disabled).toBe(true);
        expect(inputRepeticaoSobremesa.disabled).toBe(true);
      } else {
        expect(inputFrequencia.disabled).toBe(false);
        expect(inputLanche4h.disabled).toBe(false);
        expect(inputLanche.disabled).toBe(false);
        expect(inputRefeicao.disabled).toBe(false);
        expect(inputRepeticaoRefeicao.disabled).toBe(false);
        expect(inputSobremesa.disabled).toBe(false);
        expect(inputRepeticaoSobremesa.disabled).toBe(false);
      }
    }
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, exibe, nos dias 08 a 14, e verifica oa lançamentos", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 2");
    fireEvent.click(semana1Element);
    const VALORES_ESPERADOS = {
      8: {
        participantes: "100",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      9: {
        participantes: "100",
        frequencia: "92",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      10: {
        participantes: "100",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      11: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      12: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      13: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
      14: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
        sobremesa: "",
        repeticao_sobremesa: "",
      },
    };

    for (let dia = 8; dia <= 14; dia++) {
      const diaFormatado = dia.toString().padStart(2, "0");
      const valoresDia = VALORES_ESPERADOS[dia];

      const inputParticipantes = screen.getByTestId(
        `participantes__dia_${diaFormatado}__categoria_1`,
      );
      const inputFrequencia = screen.getByTestId(
        `frequencia__dia_${diaFormatado}__categoria_1`,
      );
      const inputLanche4h = screen.getByTestId(
        `lanche_4h__dia_${diaFormatado}__categoria_1`,
      );
      const inputLanche = screen.getByTestId(
        `lanche__dia_${diaFormatado}__categoria_1`,
      );
      const inputRefeicao = screen.getByTestId(
        `refeicao__dia_${diaFormatado}__categoria_1`,
      );
      const inputRepeticaoRefeicao = screen.getByTestId(
        `repeticao_refeicao__dia_${diaFormatado}__categoria_1`,
      );
      const inputSobremesa = screen.getByTestId(
        `sobremesa__dia_${diaFormatado}__categoria_1`,
      );
      const inputRepeticaoSobremesa = screen.getByTestId(
        `repeticao_sobremesa__dia_${diaFormatado}__categoria_1`,
      );

      expect(inputParticipantes).toHaveAttribute(
        "value",
        valoresDia.participantes,
      );
      expect(inputFrequencia).toHaveAttribute("value", valoresDia.frequencia);
      expect(inputLanche4h).toHaveAttribute("value", valoresDia.lanche4h);
      expect(inputLanche).toHaveAttribute("value", valoresDia.lanche);
      expect(inputRefeicao).toHaveAttribute("value", valoresDia.refeicao);
      expect(inputRepeticaoRefeicao).toHaveAttribute(
        "value",
        valoresDia.repeticao_refeicao,
      );
      expect(inputSobremesa).toHaveAttribute("value", valoresDia.sobremesa);
      expect(inputRepeticaoSobremesa).toHaveAttribute(
        "value",
        valoresDia.repeticao_sobremesa,
      );

      expect(inputParticipantes.disabled).toBe(true);
      if ([11, 12, 13, 14].includes(dia)) {
        expect(inputFrequencia.disabled).toBe(true);
        expect(inputLanche4h.disabled).toBe(true);
        expect(inputLanche.disabled).toBe(true);
        expect(inputRefeicao.disabled).toBe(true);
        expect(inputRepeticaoRefeicao.disabled).toBe(true);
        expect(inputSobremesa.disabled).toBe(true);
        expect(inputRepeticaoSobremesa.disabled).toBe(true);
      } else {
        expect(inputFrequencia.disabled).toBe(false);
        expect(inputLanche4h.disabled).toBe(false);
        expect(inputLanche.disabled).toBe(false);
        expect(inputRefeicao.disabled).toBe(false);
        expect(inputRepeticaoRefeicao.disabled).toBe(false);
        expect(inputSobremesa.disabled).toBe(false);
        expect(inputRepeticaoSobremesa.disabled).toBe(false);
      }
    }
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher frequencia maior que participantes e exibe erro", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);

    const inputElementFrequenciaDia03 = screen.getByTestId(
      "frequencia__dia_03__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementFrequenciaDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementFrequenciaDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher lanche maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);
    const inputElementLancheDia03 = screen.getByTestId(
      "lanche__dia_03__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementLancheDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementLancheDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher lanche 4h maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);
    const inputElementLanche4hDia03 = screen.getByTestId(
      "lanche_4h__dia_03__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementLanche4hDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementLanche4hDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher refeição maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);
    const inputElementRefeicaoDia03 = screen.getByTestId(
      "refeicao__dia_03__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementRefeicaoDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementRefeicaoDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher sobremesa maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);
    const inputElementSobremesaDia03 = screen.getByTestId(
      "sobremesa__dia_03__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementSobremesaDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementSobremesaDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher repetição de refeição maior que refeição e exibe atenção", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);

    const inputRefeicao = screen.getByTestId("refeicao__dia_05__categoria_1");
    fireEvent.change(inputRefeicao, {
      target: { value: "60" },
    });

    const inputRepeticaoRefeicao = screen.getByTestId(
      "repeticao_refeicao__dia_05__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputRepeticaoRefeicao, {
        target: { value: "170" },
      });
    });

    const tooltip = document.querySelector(
      '[data-test-id="tooltip_repeticao_refeicao__dia_05__categoria_1"]',
    );
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveClass("icone-info-success");

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher repetição de sobremesa maior que sobremesa e exibe atenção", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);

    const inputRefeicao = screen.getByTestId("sobremesa__dia_05__categoria_1");
    fireEvent.change(inputRefeicao, {
      target: { value: "60" },
    });

    const inputRepeticaoRefeicao = screen.getByTestId(
      "repeticao_sobremesa__dia_05__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputRepeticaoRefeicao, {
        target: { value: "170" },
      });
    });

    const tooltip = document.querySelector(
      '[data-test-id="tooltip_repeticao_sobremesa__dia_05__categoria_1"]',
    );
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveClass("icone-info-success");

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preenche dia 04 e salva lançamento", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);

    const valores = {
      frequencia: "95",
      lanche_4h: "85",
      lanche: "85",
      refeicao: "80",
      repeticao_refeicao: "70",
      sobremesa: "85",
      repeticao_sobremesa: "75",
    };

    const campos = [
      { key: "frequencia", testId: "frequencia" },
      { key: "lanche_4h", testId: "lanche_4h" },
      { key: "lanche", testId: "lanche" },
      { key: "refeicao", testId: "refeicao" },
      { key: "repeticao_refeicao", testId: "repeticao_refeicao" },
      { key: "sobremesa", testId: "sobremesa" },
      { key: "repeticao_sobremesa", testId: "repeticao_sobremesa" },
    ];

    campos.forEach(({ key, testId }) => {
      const input = screen.getByTestId(`${testId}__dia_04__categoria_1`);
      fireEvent.change(input, { target: { value: valores[key] } });
    });

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
    fireEvent.click(botao);

    await waitFor(() => {
      expect(
        screen.getByText("Lançamentos salvos com sucesso"),
      ).toBeInTheDocument();
    });

    const valoresEsperados = { participantes: "100", ...valores };
    const camposAtualizados = [
      { key: "participantes", testId: "participantes" },
      ...campos,
    ];

    camposAtualizados.forEach(({ key, testId }) => {
      const input = screen.getByTestId(`${testId}__dia_04__categoria_1`);
      expect(input).toHaveAttribute("value", valoresEsperados[key]);
    });
  });

  it("ao clicar na tab `Semana 2`, preencher frequencia maior que participantes e exibe erro", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);

    const inputElementFrequenciaDia03 = screen.getByTestId(
      "frequencia__dia_08__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementFrequenciaDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementFrequenciaDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preencher lanche maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);
    const inputElementLancheDia03 = screen.getByTestId(
      "lanche__dia_08__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementLancheDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementLancheDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preencher lanche 4h maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);
    const inputElementLanche4hDia03 = screen.getByTestId(
      "lanche_4h__dia_08__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementLanche4hDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementLanche4hDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preencher refeição maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);
    const inputElementRefeicaoDia03 = screen.getByTestId(
      "refeicao__dia_08__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementRefeicaoDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementRefeicaoDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preencher sobremesa maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);
    const inputElementSobremesaDia03 = screen.getByTestId(
      "sobremesa__dia_08__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementSobremesaDia03, {
        target: { value: "110" },
      });
    });
    expect(inputElementSobremesaDia03).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preencher repetição de refeição maior que refeição e exibe atenção", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);

    const inputElementFrequenciaDia8 = screen.getByTestId(
      "frequencia__dia_08__categoria_1",
    );
    fireEvent.change(inputElementFrequenciaDia8, {
      target: { value: "100" },
    });

    const inputRefeicao = screen.getByTestId("refeicao__dia_08__categoria_1");
    fireEvent.change(inputRefeicao, {
      target: { value: "60" },
    });

    const inputRepeticaoRefeicao = screen.getByTestId(
      "repeticao_refeicao__dia_08__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputRepeticaoRefeicao, {
        target: { value: "170" },
      });
    });

    const tooltip = document.querySelector(
      '[data-test-id="tooltip_repeticao_refeicao__dia_08__categoria_1"]',
    );
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveClass("icone-info-success");

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preencher repetição de sobremesa maior que sobremesa e exibe atenção", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);

    const inputElementFrequenciaDia8 = screen.getByTestId(
      "frequencia__dia_08__categoria_1",
    );
    fireEvent.change(inputElementFrequenciaDia8, {
      target: { value: "100" },
    });

    const inputRefeicao = screen.getByTestId("sobremesa__dia_08__categoria_1");
    fireEvent.change(inputRefeicao, {
      target: { value: "60" },
    });

    const inputRepeticaoRefeicao = screen.getByTestId(
      "repeticao_sobremesa__dia_08__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputRepeticaoRefeicao, {
        target: { value: "170" },
      });
    });

    const tooltip = document.querySelector(
      '[data-test-id="tooltip_repeticao_sobremesa__dia_08__categoria_1"]',
    );
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveClass("icone-info-success");

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preenche dia 08 e salva lançamento", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);

    const valores = {
      frequencia: "95",
      lanche_4h: "85",
      lanche: "85",
      refeicao: "80",
      repeticao_refeicao: "70",
      sobremesa: "85",
      repeticao_sobremesa: "75",
    };

    const campos = [
      { key: "frequencia", testId: "frequencia" },
      { key: "lanche_4h", testId: "lanche_4h" },
      { key: "lanche", testId: "lanche" },
      { key: "refeicao", testId: "refeicao" },
      { key: "repeticao_refeicao", testId: "repeticao_refeicao" },
      { key: "sobremesa", testId: "sobremesa" },
      { key: "repeticao_sobremesa", testId: "repeticao_sobremesa" },
    ];

    campos.forEach(({ key, testId }) => {
      const input = screen.getByTestId(`${testId}__dia_08__categoria_1`);
      fireEvent.change(input, { target: { value: valores[key] } });
    });

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
    fireEvent.click(botao);

    await waitFor(() => {
      expect(
        screen.getByText("Lançamentos salvos com sucesso"),
      ).toBeInTheDocument();
    });

    const valoresEsperados = { participantes: "100", ...valores };
    const camposAtualizados = [
      { key: "participantes", testId: "participantes" },
      ...campos,
    ];

    camposAtualizados.forEach(({ key, testId }) => {
      const input = screen.getByTestId(`${testId}__dia_08__categoria_1`);
      expect(input).toHaveAttribute("value", valoresEsperados[key]);
    });
  });
});
