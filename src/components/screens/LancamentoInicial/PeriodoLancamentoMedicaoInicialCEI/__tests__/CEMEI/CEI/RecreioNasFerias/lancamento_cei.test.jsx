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
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockSalvaLancamentoSemana1 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/mockSalvarLancamentos";
import { mockValoresMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/mockValoresMedicaoCEI";
import { mockDiasLetivosRecreio } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/diasLetivosRecreio.jsx";
import { mockMeusDadosEscolaCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEI";
import { getTiposDeAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import { mockLocationStateGrupoRecreioNasFerias } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/mockStateRecreio";
import { mockDietasEspsciais } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/mockDietasEspeciais.jsx";
import {
  getCategoriasDeMedicao,
  getDiasLetivosRecreio,
  getDiasParaCorrecao,
  getFeriadosNoMes,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesInclusoesAutorizadasEscola,
  getSolicitacoesSuspensoesAutorizadasEscola,
  getValoresPeriodosLancamentos,
  updateValoresPeriodosLancamentos,
  getLogDietasAutorizadasRecreioNasFeriasCEI,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getMeusDados } from "src/services/perfil.service";
import mock from "src/services/_mock";
import preview from "jest-preview";

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
    expect(getLogDietasAutorizadasRecreioNasFeriasCEI).toHaveBeenCalled;
  });
};

describe("Teste <PeriodoLancamentoMedicaoInicialCEI> para o Grupo Recreio Nas Férias - CEI", () => {
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
      data: mockCategoriasMedicaoCEI,
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
      data: mockDiasLetivosRecreio,
      status: 200,
    });
    getFeriadosNoMes.mockResolvedValue({
      data: { results: ["12"] },
      status: 200,
    });
    updateValoresPeriodosLancamentos.mockResolvedValue({
      data: mockSalvaLancamentoSemana1,
      status: 200,
    });
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    getLogDietasAutorizadasRecreioNasFeriasCEI.mockResolvedValue({
      data: mockDietasEspsciais,
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

  describe("Testa conteúdo básico da tela", () => {
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
        screen.getByText(
          "Semanas do Período para Lançamento da Medição Inicial",
        ),
      ).toBeInTheDocument();
    });

    it("renderiza as labels `Semana 1` e `Semana 2` e `Semana 3`", async () => {
      await awaitServices();
      expect(screen.getByText("Semana 1")).toBeInTheDocument();
      expect(screen.getByText("Semana 2")).toBeInTheDocument();
    });

    it("não renderiza as labels  `Semana 4`, `Semana 5`", async () => {
      await awaitServices();
      expect(screen.queryByText("Semana 5")).not.toBeInTheDocument();
    });

    it("renderiza label `ALIMENTAÇÃO`", async () => {
      await awaitServices();
      expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    });

    it("renderiza label `Participantes` dentro da seção `ALIMENTAÇÃO`", async () => {
      await awaitServices();
      const categoriaAlimentacaoUuid = "0e1f14ce-685a-4d4c-b0a7-96efe52b754f";
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
      const categoriaAlimentacaoUuid = "0e1f14ce-685a-4d4c-b0a7-96efe52b754f";
      const myElement = screen.getByTestId(
        `div-lancamentos-por-categoria-${categoriaAlimentacaoUuid}`,
      );
      const allParticipantes = screen.getAllByText("Seg.");
      const specificParticipantes = allParticipantes.find((element) =>
        myElement.contains(element),
      );
      expect(specificParticipantes).toBeInTheDocument();
    });

    it("renderiza label `DIETA ESPECIAL - TIPO A`", async () => {
      await awaitServices();
      expect(screen.getByText("DIETA ESPECIAL - TIPO A")).toBeInTheDocument();
    });

    it("renderiza label `Dietas Autorizadas` dentro da seção `DIETA ESPECIAL - TIPO A`", async () => {
      await awaitServices();
      const categoriaDietaAUuid = "39cd2574-6d28-49bb-b628-ae538dc97791";
      const myElement = screen.getByTestId(
        `div-lancamentos-por-categoria-${categoriaDietaAUuid}`,
      );
      const dietasAutorizadas = screen.getAllByText("Dietas Autorizadas");
      const specificParticipantes = dietasAutorizadas.find((element) =>
        myElement.contains(element),
      );
      expect(specificParticipantes).toBeInTheDocument();
    });

    it("renderiza label `Seg.` dentro da seção `DIETA ESPECIAL - TIPO A`", async () => {
      await awaitServices();
      const categoriaDietaAUuid = "39cd2574-6d28-49bb-b628-ae538dc97791";
      const myElement = screen.getByTestId(
        `div-lancamentos-por-categoria-${categoriaDietaAUuid}`,
      );
      const dietasAutorizadas = screen.getAllByText("Seg.");
      const specificParticipantes = dietasAutorizadas.find((element) =>
        myElement.contains(element),
      );
      expect(specificParticipantes).toBeInTheDocument();
    });

    it("renderiza label `Dietas Autorizadas` dentro da seção `DIETA ESPECIAL - TIPO B`", async () => {
      await awaitServices();
      const categoriaDietaAUuid = "6ad79709-3611-4af3-a567-65fcf34b3d06";
      const myElement = screen.getByTestId(
        `div-lancamentos-por-categoria-${categoriaDietaAUuid}`,
      );
      const dietasAutorizadas = screen.getAllByText("Dietas Autorizadas");
      const specificParticipantes = dietasAutorizadas.find((element) =>
        myElement.contains(element),
      );
      expect(specificParticipantes).toBeInTheDocument();
    });

    it("renderiza label `Seg.` dentro da seção `DIETA ESPECIAL - TIPO B`", async () => {
      await awaitServices();
      const categoriaDietaAUuid = "6ad79709-3611-4af3-a567-65fcf34b3d06";
      const myElement = screen.getByTestId(
        `div-lancamentos-por-categoria-${categoriaDietaAUuid}`,
      );
      const dietasAutorizadas = screen.getAllByText("Seg.");
      const specificParticipantes = dietasAutorizadas.find((element) =>
        myElement.contains(element),
      );
      expect(specificParticipantes).toBeInTheDocument();
    });
  });

  describe("Testa a parte de ALIMENTAÇÃO", () => {
    it("ao clicar na tab `Semana 1`, exibe, nos dias 29 setembro a 05 de outubro, e verifica os lançamentos", async () => {
      await awaitServices();
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const VALORES_ESPERADOS = {
        1: {
          participantes: "100",
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "14",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "14",
            "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "14",
            "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "",
            "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "14",
            "e3030bd1-2e85-4676-87b3-96b4032370d4": "",
            "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "14",
          },
        },
        2: {
          participantes: "100",
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
        3: {
          participantes: "100",
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
        4: {
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
        5: {
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
        29: {
          participantes: "Mês anterior",
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "Mês anterior",
            "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "Mês anterior",
            "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "Mês anterior",
            "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "Mês anterior",
            "e3030bd1-2e85-4676-87b3-96b4032370d4": "Mês anterior",
            "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "Mês anterior",
          },
        },
        30: {
          participantes: "Mês anterior",
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "Mês anterior",
            "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "Mês anterior",
            "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "Mês anterior",
            "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "Mês anterior",
            "e3030bd1-2e85-4676-87b3-96b4032370d4": "Mês anterior",
            "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "Mês anterior",
          },
        },
      };

      await waitFor(() => {
        expect(true).toBe(true);
      });

      Object.keys(VALORES_ESPERADOS).forEach((dia) => {
        const valoresDia = VALORES_ESPERADOS[dia];
        const diaFormatado = dia.toString().padStart(2, "0");
        const inputParticipantes = screen.getByTestId(
          `participantes__faixa_null__dia_${diaFormatado}__categoria_1`,
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

          if ([29, 30, 4, 5].includes(Number(dia))) {
            expect(inputFrequencia.disabled).toBe(true);
          } else {
            expect(inputFrequencia.disabled).toBe(false);
          }
        });
      });
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
        "frequencia__faixa_4e60c819-4c0b-4d46-95c8-2e3b9674b40e__dia_02__categoria_1",
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

    it("ao clicar na tab `Semana 1`, preenche dia 01 e salva lançamento", async () => {
      await awaitServices();
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const valores = {
        "frequencia__faixa_1b77202d-fd0b-46b7-b4ec-04eb262efece": "14",
        "frequencia__faixa_381aecc2-e1b2-4d26-a156-1834eec7f1dd": "14",
        "frequencia__faixa_4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "14",
        "frequencia__faixa_78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "14",
        "frequencia__faixa_55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "14",
        "frequencia__faixa_e3030bd1-2e85-4676-87b3-96b4032370d4": "14",
        "frequencia__faixa_2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "14",
      };

      const campos = [
        "frequencia__faixa_1b77202d-fd0b-46b7-b4ec-04eb262efece",
        "frequencia__faixa_381aecc2-e1b2-4d26-a156-1834eec7f1dd",
        "frequencia__faixa_4e60c819-4c0b-4d46-95c8-2e3b9674b40e",
        "frequencia__faixa_78e4f4a6-ae04-42a6-9cc3-8f9813e98e66",
        "frequencia__faixa_55f0af28-e1d5-43a0-a3f3-bbc453b784a5",
        "frequencia__faixa_e3030bd1-2e85-4676-87b3-96b4032370d4",
        "frequencia__faixa_2e14cd6e-33e6-4168-b1ce-449f686d1e7d",
      ];

      campos.forEach((frequenciaFaixaEtaria) => {
        const input = screen.getByTestId(
          `${frequenciaFaixaEtaria}__dia_01__categoria_1`,
        );
        fireEvent.change(input, {
          target: { value: valores[frequenciaFaixaEtaria] },
        });
      });

      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      await waitFor(() => {
        expect(botao).not.toBeDisabled();
        fireEvent.click(botao);
      });

      await waitFor(() => {
        expect(
          screen.getByText("Lançamentos salvos com sucesso"),
        ).toBeInTheDocument();
      });

      const valoresEsperados = { participantes__faixa_null: "100", ...valores };
      const camposAtualizados = ["participantes__faixa_null", ...campos];

      camposAtualizados.forEach((testId) => {
        const input = screen.getByTestId(`${testId}__dia_01__categoria_1`);
        expect(input).toHaveAttribute("value", valoresEsperados[testId]);
      });
    });
  });

  describe("Testa a parte de DIETAS ESPECIAIS", () => {
    const dias = [1, 2, 3, 4, 5, 29, 30].map((d) => String(d).padStart(2, "0"));
    const diasDesabilitados = [29, 30, 4, 5].map((d) =>
      String(d).padStart(2, "0"),
    );

    it("ao clicar na tab `Semana 1`, verifica as faixas existentes nas dietas especiais Tipo A", async () => {
      await awaitServices();
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const faixasRenderizadas = [
        "1b77202d-fd0b-46b7-b4ec-04eb262efece",
        "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
      ];

      mockFaixasEtarias.results.forEach((faixa) => {
        dias.forEach((dia) => {
          const inputDietasAutorizadas = screen.queryByTestId(
            `dietas_autorizadas__faixa_${faixa.uuid}__dia_${dia}__categoria_2`,
          );
          const inputFrequencia = screen.queryByTestId(
            `frequencia__faixa_${faixa.uuid}__dia_${dia}__categoria_2`,
          );

          const deveExistir = faixasRenderizadas.includes(faixa.uuid);
          if (deveExistir) {
            expect(inputDietasAutorizadas).toBeInTheDocument();
            expect(inputDietasAutorizadas).toBeDisabled();
            expect(inputFrequencia).toBeInTheDocument();

            if (diasDesabilitados.includes(dia)) {
              expect(inputFrequencia.disabled).toBe(true);
            } else {
              expect(inputFrequencia.disabled).toBe(false);
            }
          } else {
            expect(inputDietasAutorizadas).not.toBeInTheDocument();
            expect(inputFrequencia).not.toBeInTheDocument();
          }
        });
      });
    });

    it("ao clicar na tab `Semana 1`, verifica as faixas existentes nas dietas especiais Tipo B", async () => {
      await awaitServices();
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const faixasRenderizadas = [
        "1b77202d-fd0b-46b7-b4ec-04eb262efece",
        "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
      ];

      mockFaixasEtarias.results.forEach((faixa) => {
        dias.forEach((dia) => {
          const inputDietasAutorizadas = screen.queryByTestId(
            `dietas_autorizadas__faixa_${faixa.uuid}__dia_${dia}__categoria_4`,
          );
          const inputFrequencia = screen.queryByTestId(
            `frequencia__faixa_${faixa.uuid}__dia_${dia}__categoria_4`,
          );

          const deveExistir = faixasRenderizadas.includes(faixa.uuid);
          if (deveExistir) {
            expect(inputDietasAutorizadas).toBeInTheDocument();
            expect(inputDietasAutorizadas).toBeDisabled();
            expect(inputFrequencia).toBeInTheDocument();

            if (
              diasDesabilitados.includes(dia) ||
              faixa.uuid === "381aecc2-e1b2-4d26-a156-1834eec7f1dd"
            ) {
              expect(inputFrequencia.disabled).toBe(true);
            } else {
              expect(inputFrequencia.disabled).toBe(false);
            }
          } else {
            expect(inputDietasAutorizadas).not.toBeInTheDocument();
            expect(inputFrequencia).not.toBeInTheDocument();
          }
        });
      });
    });

    it.only("ao clicar na tab `Semana 1`, exibe, nos dias 29 setembro a 05 de outubro, e verifica os lançamentos", async () => {
      await awaitServices();
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const VALORES_ESPERADOS = {
        1: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "6",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "2",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          },
        },
        2: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "6",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "2",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          },
        },
        3: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "6",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "2",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          },
        },
        4: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          },
        },
        5: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
          },
        },
        29: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "Mês anterior",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "Mês anterior",
          },
        },
        30: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "Mês anterior",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "Mês anterior",
          },
        },
      };

      const faixasRenderizadas = [
        "1b77202d-fd0b-46b7-b4ec-04eb262efece",
        "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
      ];

      await waitFor(() => {
        expect(true).toBe(true);
      });

      Object.keys(VALORES_ESPERADOS).forEach((dia) => {
        const valoresDia = VALORES_ESPERADOS[dia];
        const diaFormatado = dia.toString().padStart(2, "0");

        faixasRenderizadas.forEach((faixa) => {
          const inputDieta = screen.getByTestId(
            `dietas_autorizadas__faixa_${faixa}__dia_${diaFormatado}__categoria_2`,
          );
          expect(inputDieta).toHaveAttribute("value", valoresDia.dieta[faixa]);

          const inputFrequencia = screen.getByTestId(
            `frequencia__faixa_${faixa}__dia_${diaFormatado}__categoria_2`,
          );
          expect(inputFrequencia).toHaveAttribute(
            "value",
            valoresDia.frequencia[faixa],
          );
        });
      });
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      await waitFor(() => {
        expect(botao).not.toBeDisabled();
      });

      preview.debug();
    });
  });
});
