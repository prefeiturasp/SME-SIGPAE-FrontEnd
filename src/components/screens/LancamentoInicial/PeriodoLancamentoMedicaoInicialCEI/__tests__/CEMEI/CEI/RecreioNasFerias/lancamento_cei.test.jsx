import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { PeriodoLancamentoMedicaoInicialCEI } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicialCEI";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockSalvaLancamentoSemana1 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/CEI/mockSalvaLancamentoCEI";
import { mockLocationStateGrupoRecreioNasFerias } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/CEI/mockStateCEIGrupoRecreio";
import { mockValoresMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/CEI/mockValoresMedicaoCEI";
import { mockDiasLetivos } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/diasLetivosRecreio";
import { mockDiasCalendarioCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockDiasCalendarioCEI";
import { mockMeusDadosEscolaCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEI";
import { getTiposDeAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import {
  getCategoriasDeMedicao,
  getDiasCalendario,
  getDiasLetivosRecreio,
  getDiasParaCorrecao,
  getFeriadosNoMes,
  getLogDietasAutorizadasCEIPeriodo,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesInclusoesAutorizadasEscola,
  getSolicitacoesSuspensoesAutorizadasEscola,
  getValoresPeriodosLancamentos,
  updateValoresPeriodosLancamentos,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getMeusDados } from "src/services/perfil.service";
import mock from "src/services/_mock";

jest.mock("src/services/perfil.service.jsx");
jest.mock("src/services/medicaoInicial/diaSobremesaDoce.service.jsx");
jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/medicaoInicial/periodoLancamentoMedicao.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getListaDiasSobremesaDoce).toHaveBeenCalled();
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

describe("Teste <PeriodoLancamentoMedicaoInicialCEI> para o Grupo Recreio Nas Férias - EMEF", () => {
  beforeEach(async () => {
    getMeusDados.mockResolvedValue({
      data: mockMeusDadosEscolaCEI,
      status: 200,
    });
    getListaDiasSobremesaDoce.mockResolvedValue({ data: [], status: 200 });
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
      data: mockValoresMedicaoCEI,
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
    getLogDietasAutorizadasCEIPeriodo.mockResolvedValue({
      data: [],
      status: 200,
    });
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    getDiasCalendario.mockResolvedValue({
      data: mockDiasCalendarioCEI,
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
          <PeriodoLancamentoMedicaoInicialCEI />
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
      mockLocationStateGrupoRecreioNasFerias.periodo,
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

  it("não renderiza as labels  `Semana 4`, `Semana 5`", async () => {
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

  it("ao clicar na tab `Semana 1`, exibe, nos dias 08 a 14, e verifica os lançamentos", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);

    const VALORES_ESPERADOS = {
      8: {
        participantes: "100",
        frequencia: {
          "1b77202d-fd0b-46b7-b4ec-04eb262efece": "1",
          "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "6",
          "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "1",
          "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "",
          "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "",
          "e3030bd1-2e85-4676-87b3-96b4032370d4": "",
          "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "",
        },
      },
      9: {
        participantes: "100",
        frequencia: {
          "1b77202d-fd0b-46b7-b4ec-04eb262efece": "2",
          "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "7",
          "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "2",
          "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "55",
          "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "23",
          "e3030bd1-2e85-4676-87b3-96b4032370d4": "",
          "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "",
        },
      },
      10: {
        participantes: "100",
        frequencia: {
          "1b77202d-fd0b-46b7-b4ec-04eb262efece": "3",
          "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "1",
          "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "33",
          "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "2",
          "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "55",
          "e3030bd1-2e85-4676-87b3-96b4032370d4": "2",
          "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "",
        },
      },
      11: {
        participantes: "",
        frequencia: {
          "1b77202d-fd0b-46b7-b4ec-04eb262efece": "4",
          "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "",
          "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "",
          "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "",
          "e3030bd1-2e85-4676-87b3-96b4032370d4": "",
          "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "",
        },
      },
      12: {
        participantes: "",
        frequencia: {
          "1b77202d-fd0b-46b7-b4ec-04eb262efece": "5",
          "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "",
          "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "",
          "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "",
          "e3030bd1-2e85-4676-87b3-96b4032370d4": "",
          "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "",
        },
      },
      13: {
        participantes: "",
        frequencia: {
          "1b77202d-fd0b-46b7-b4ec-04eb262efece": "",
          "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "",
          "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "",
          "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "",
          "e3030bd1-2e85-4676-87b3-96b4032370d4": "",
          "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "",
        },
      },
      14: {
        participantes: "",
        frequencia: {
          "1b77202d-fd0b-46b7-b4ec-04eb262efece": "",
          "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "",
          "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "",
          "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "",
          "e3030bd1-2e85-4676-87b3-96b4032370d4": "",
          "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "",
        },
      },
    };

    await waitFor(() => {
      expect(true).toBe(true);
    });

    for (let dia = 8; dia <= 14; dia++) {
      const valoresDia = VALORES_ESPERADOS[dia];

      const diaFormatado = dia < 10 ? `0${dia}` : dia;

      const inputParticipantes = screen.getByTestId(
        `matriculados__faixa_null__dia_${diaFormatado}__categoria_1`,
      );

      expect(inputParticipantes).toHaveAttribute(
        "value",
        valoresDia.participantes,
      );
      expect(inputParticipantes.disabled).toBe(true);

      mockFaixasEtarias.results.forEach((faixa) => {
        const inputFrequencia = screen.getByTestId(
          `frequencia__faixa_${faixa.uuid}__dia_${diaFormatado}__categoria_1`,
        );

        expect(inputFrequencia).toHaveAttribute(
          "value",
          valoresDia.frequencia[faixa.uuid],
        );

        if ([13, 14].includes(dia)) {
          expect(inputFrequencia.disabled).toBe(true);
        } else {
          expect(inputFrequencia.disabled).toBe(false);
        }
      });
    }

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    await waitFor(() => {
      expect(botao).not.toBeDisabled();
    });
  });

  it("ao clicar na tab `Semana 1`, preencher frequencia maior que participantes e exibe erro", async () => {
    await awaitServices();
    const semana1Element = screen.getByText("Semana 1");
    fireEvent.click(semana1Element);

    const inputElementFrequenciaDia03 = screen.getByTestId(
      "frequencia__faixa_4e60c819-4c0b-4d46-95c8-2e3b9674b40e__dia_08__categoria_1",
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
});
