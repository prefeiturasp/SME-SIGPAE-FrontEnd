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
import { mockLocationStateGrupoRecreioNasFerias } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/CEUGESTAO/mockStateCEUGESTAOGrupoRecreio";
import { mockValoresMedicaoCEUGESTAO } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/CEUGESTAO/valoresMedicaoCEUGESTAO";
import { mockMeusDadosEscolaCEUGESTAO } from "src/mocks/meusDados/escolaCeuGestao";
import { mockDiasLetivos } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/CEUGESTAO/diasLetivosRecreio";
import { mockSalvaLancamentoSemana1 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/CEUGESTAO/mockSalvaLançamentoCEUGESTAO.jsx";
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
import preview from "jest-preview";

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
  });
};

describe("Teste <PeriodoLancamentoMedicaoInicial> para o Grupo Recreio Nas Férias - CEU GESTÃO", () => {
  beforeEach(async () => {
    getMeusDados.mockResolvedValue({
      data: mockMeusDadosEscolaCEUGESTAO,
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
      data: mockValoresMedicaoCEUGESTAO,
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

  it("renderiza as labels `Semana 1`, `Semana 2` e `Semana 3`", async () => {
    await awaitServices();
    expect(screen.getByText("Semana 1")).toBeInTheDocument();
    expect(screen.getByText("Semana 2")).toBeInTheDocument();
    expect(screen.getByText("Semana 3")).toBeInTheDocument();
  });

  it("não renderiza as labels `Semana 4`, `Semana 5`", async () => {
    await awaitServices();
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

  it("ao clicar na tab `Semana 1`, exibe, nos dias 15 a 21, e verifica oa lançamentos", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);

    const VALORES_ESPERADOS = {
      15: { participantes: "100", frequencia: "100", lanche: "", lanche4h: "" },
      16: { participantes: "100", frequencia: "", lanche: "", lanche4h: "" },
      17: { participantes: "100", frequencia: "55", lanche: "", lanche4h: "" },
      18: { participantes: "100", frequencia: "", lanche: "", lanche4h: "" },
      19: { participantes: "100", frequencia: "", lanche: "", lanche4h: "" },
      20: { participantes: "", frequencia: "", lanche: "", lanche4h: "" },
      21: { participantes: "", frequencia: "", lanche: "", lanche4h: "" },
    };

    for (let dia = 15; dia <= 21; dia++) {
      const valoresDia = VALORES_ESPERADOS[dia];

      const inputParticipantes = screen.getByTestId(
        `participantes__dia_${dia}__categoria_1`,
      );
      const inputFrequencia = screen.getByTestId(
        `frequencia__dia_${dia}__categoria_1`,
      );
      const inputLanche4h = screen.getByTestId(
        `lanche_4h__dia_${dia}__categoria_1`,
      );
      const inputLanche = screen.getByTestId(`lanche__dia_${dia}__categoria_1`);

      expect(inputParticipantes).toHaveAttribute(
        "value",
        valoresDia.participantes,
      );
      expect(inputFrequencia).toHaveAttribute("value", valoresDia.frequencia);
      expect(inputLanche4h).toHaveAttribute("value", valoresDia.lanche4h);
      expect(inputLanche).toHaveAttribute("value", valoresDia.lanche);

      expect(inputParticipantes.disabled).toBe(true);
      if ([20, 21].includes(dia)) {
        expect(inputFrequencia.disabled).toBe(true);
        expect(inputLanche4h.disabled).toBe(true);
        expect(inputLanche.disabled).toBe(true);
      } else {
        expect(inputFrequencia.disabled).toBe(false);
        expect(inputLanche4h.disabled).toBe(false);
        expect(inputLanche.disabled).toBe(false);
      }
    }

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, exibe, nos dias 22 a 28, e verifica oa lançamentos", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);

    const VALORES_ESPERADOS = {
      22: { participantes: "100", frequencia: "", lanche: "", lanche4h: "" },
      23: { participantes: "100", frequencia: "", lanche: "", lanche4h: "" },
      24: { participantes: "100", frequencia: "", lanche: "", lanche4h: "" },
      25: { participantes: "", frequencia: "", lanche: "", lanche4h: "" },
      26: { participantes: "100", frequencia: "", lanche: "", lanche4h: "" },
      27: { participantes: "", frequencia: "", lanche: "", lanche4h: "" },
      28: { participantes: "", frequencia: "", lanche: "", lanche4h: "" },
    };

    for (let dia = 22; dia <= 28; dia++) {
      const valoresDia = VALORES_ESPERADOS[dia];

      const inputParticipantes = screen.getByTestId(
        `participantes__dia_${dia}__categoria_1`,
      );
      const inputFrequencia = screen.getByTestId(
        `frequencia__dia_${dia}__categoria_1`,
      );
      const inputLanche4h = screen.getByTestId(
        `lanche_4h__dia_${dia}__categoria_1`,
      );
      const inputLanche = screen.getByTestId(`lanche__dia_${dia}__categoria_1`);

      expect(inputParticipantes).toHaveAttribute(
        "value",
        valoresDia.participantes,
      );
      expect(inputFrequencia).toHaveAttribute("value", valoresDia.frequencia);
      expect(inputLanche4h).toHaveAttribute("value", valoresDia.lanche4h);
      expect(inputLanche).toHaveAttribute("value", valoresDia.lanche);

      expect(inputParticipantes.disabled).toBe(true);
      if ([25, 27, 28].includes(dia)) {
        expect(inputFrequencia.disabled).toBe(true);
        expect(inputLanche4h.disabled).toBe(true);
        expect(inputLanche.disabled).toBe(true);
      }
    }

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });

  it("ao clicar na tab `Semana 3`, exibe, nos dias 29 a 04/01/2026, e verifica oa lançamentos", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 3");
    fireEvent.click(semana1Element);

    const VALORES_ESPERADOS = {
      29: { participantes: "100", frequencia: "", lanche: "", lanche4h: "" },
      30: { participantes: "100", frequencia: "", lanche: "", lanche4h: "" },
      31: { participantes: "", frequencia: "", lanche: "", lanche4h: "" },
    };

    for (let dia = 29; dia <= 31; dia++) {
      const valoresDia = VALORES_ESPERADOS[dia];

      const inputParticipantes = screen.getByTestId(
        `participantes__dia_${dia}__categoria_1`,
      );
      const inputFrequencia = screen.getByTestId(
        `frequencia__dia_${dia}__categoria_1`,
      );
      const inputLanche4h = screen.getByTestId(
        `lanche_4h__dia_${dia}__categoria_1`,
      );
      const inputLanche = screen.getByTestId(`lanche__dia_${dia}__categoria_1`);

      expect(inputParticipantes).toHaveAttribute(
        "value",
        valoresDia.participantes,
      );
      expect(inputFrequencia).toHaveAttribute("value", valoresDia.frequencia);
      expect(inputLanche4h).toHaveAttribute("value", valoresDia.lanche4h);
      expect(inputLanche).toHaveAttribute("value", valoresDia.lanche);

      expect(inputParticipantes.disabled).toBe(true);
      if ([30].includes(dia)) {
        expect(inputFrequencia.disabled).toBe(true);
        expect(inputLanche4h.disabled).toBe(true);
        expect(inputLanche.disabled).toBe(true);
      }
    }

    for (let dia = 1; dia <= 4; dia++) {
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

      expect(inputParticipantes).toHaveAttribute("value", "Mês posterior");
      expect(inputFrequencia).toHaveAttribute("value", "Mês posterior");
      expect(inputLanche4h).toHaveAttribute("value", "Mês posterior");
      expect(inputLanche).toHaveAttribute("value", "Mês posterior");

      expect(inputParticipantes.disabled).toBe(true);
      expect(inputFrequencia.disabled).toBe(true);
      expect(inputLanche4h.disabled).toBe(true);
      expect(inputLanche.disabled).toBe(true);
    }

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher frequencia maior que participantes e exibe erro", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);

    const inputElementFrequenciaDia16 = screen.getByTestId(
      "frequencia__dia_16__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementFrequenciaDia16, {
        target: { value: "110" },
      });
    });
    expect(inputElementFrequenciaDia16).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher lanche maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);
    const inputElementLancheDia15 = screen.getByTestId(
      "lanche__dia_15__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementLancheDia15, {
        target: { value: "110" },
      });
    });
    expect(inputElementLancheDia15).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preencher lanche 4h maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);
    const inputElementLanche4hDia15 = screen.getByTestId(
      "lanche_4h__dia_15__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementLanche4hDia15, {
        target: { value: "110" },
      });
    });
    expect(inputElementLanche4hDia15).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 1`, preenche dia 15 e salva lançamento", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);
    const inputElementLancheDia15 = screen.getByTestId(
      "lanche__dia_15__categoria_1",
    );
    fireEvent.change(inputElementLancheDia15, {
      target: { value: "90" },
    });

    const inputElementLanche4hDia15 = screen.getByTestId(
      "lanche_4h__dia_15__categoria_1",
    );
    fireEvent.change(inputElementLanche4hDia15, {
      target: { value: "80" },
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
    const inputParticipantes = screen.getByTestId(
      `participantes__dia_15__categoria_1`,
    );
    expect(inputParticipantes).toHaveAttribute("value", "100");

    const inputFrequencia = screen.getByTestId(
      `frequencia__dia_15__categoria_1`,
    );
    expect(inputFrequencia).toHaveAttribute("value", "100");

    const inputLanche4h = screen.getByTestId(`lanche_4h__dia_15__categoria_1`);
    expect(inputLanche4h).toHaveAttribute("value", "80");

    const inputLanche = screen.getByTestId(`lanche__dia_15__categoria_1`);
    expect(inputLanche).toHaveAttribute("value", "90");
  });

  it("ao clicar na tab `Semana 2`, preencher frequencia maior que participantes e exibe erro", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);

    const inputElementFrequenciaDia16 = screen.getByTestId(
      "frequencia__dia_22__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementFrequenciaDia16, {
        target: { value: "110" },
      });
    });
    expect(inputElementFrequenciaDia16).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preencher lanche maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);
    const inputElementLancheDia15 = screen.getByTestId(
      "lanche__dia_22__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementLancheDia15, {
        target: { value: "110" },
      });
    });
    expect(inputElementLancheDia15).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preencher lanche 4h maior que frequencia e exibe erro", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);
    const inputElementLanche4hDia15 = screen.getByTestId(
      "lanche_4h__dia_22__categoria_1",
    );
    waitFor(() => {
      fireEvent.change(inputElementLanche4hDia15, {
        target: { value: "110" },
      });
    });
    expect(inputElementLanche4hDia15).toHaveClass("invalid-field");
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  it("ao clicar na tab `Semana 2`, preenche dia 23 e salva lançamento", async () => {
    await awaitServices();
    const semana2Element = screen.getByText("Semana 2");
    fireEvent.click(semana2Element);

    const inputElementFrequenciaDia23 = screen.getByTestId(
      "frequencia__dia_23__categoria_1",
    );

    fireEvent.change(inputElementFrequenciaDia23, {
      target: { value: "100" },
    });

    const inputElementLancheDia15 = screen.getByTestId(
      "lanche__dia_23__categoria_1",
    );
    fireEvent.change(inputElementLancheDia15, {
      target: { value: "90" },
    });

    const inputElementLanche4hDia15 = screen.getByTestId(
      "lanche_4h__dia_23__categoria_1",
    );
    fireEvent.change(inputElementLanche4hDia15, {
      target: { value: "80" },
    });

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    preview.debug();

    expect(botao).not.toBeDisabled();
    fireEvent.click(botao);

    await waitFor(() => {
      expect(
        screen.getByText("Lançamentos salvos com sucesso"),
      ).toBeInTheDocument();
    });
    const inputParticipantes = screen.getByTestId(
      `participantes__dia_23__categoria_1`,
    );
    expect(inputParticipantes).toHaveAttribute("value", "100");

    const inputFrequencia = screen.getByTestId(
      `frequencia__dia_23__categoria_1`,
    );
    expect(inputFrequencia).toHaveAttribute("value", "100");

    const inputLanche4h = screen.getByTestId(`lanche_4h__dia_23__categoria_1`);
    expect(inputLanche4h).toHaveAttribute("value", "80");

    const inputLanche = screen.getByTestId(`lanche__dia_23__categoria_1`);
    expect(inputLanche).toHaveAttribute("value", "90");
  });
});
