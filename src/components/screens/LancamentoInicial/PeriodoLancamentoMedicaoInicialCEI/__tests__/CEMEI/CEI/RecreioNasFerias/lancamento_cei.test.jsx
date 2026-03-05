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

      const faixasRenderizadas = ["1b77202d-fd0b-46b7-b4ec-04eb262efece"];

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

    it("ao clicar na tab `Semana 1`, exibe, nos dias 29 setembro a 05 de outubro, e verifica os lançamentos", async () => {
      await awaitServices();
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const faixasPorCategoria = [
        { uuid_faixa: "1b77202d-fd0b-46b7-b4ec-04eb262efece", cateoria: "2" },
        { uuid_faixa: "381aecc2-e1b2-4d26-a156-1834eec7f1dd", cateoria: "2" },
        { uuid_faixa: "1b77202d-fd0b-46b7-b4ec-04eb262efece", cateoria: "4" },
      ];

      const valoresExperados = {
        1: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "6",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "2",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "2",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "",
          },
        },
        2: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "6",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "2",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "2",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "",
          },
        },
        3: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "6",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "2",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "2",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "",
          },
        },
        4: { dieta: {}, frequencia: {} },
        5: { dieta: {}, frequencia: {} },
        29: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "Mês anterior",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "Mês anterior",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "Mês anterior",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "Mês anterior",
          },
        },
        30: {
          dieta: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "Mês anterior",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "Mês anterior",
          },
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat2": "Mês anterior",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd-cat2": "Mês anterior",
            "1b77202d-fd0b-46b7-b4ec-04eb262efece-cat4": "Mês anterior",
          },
        },
      };

      Object.keys(valoresExperados).forEach((dia) => {
        const valoresDia = valoresExperados[dia];
        const diaFormatado = dia.toString().padStart(2, "0");

        faixasPorCategoria.forEach(({ uuid_faixa, cateoria }) => {
          const chaveBusca = `${uuid_faixa}-cat${cateoria}`;

          const valorDietaEsperado = valoresDia.dieta[chaveBusca] || "";
          const valorFreqEsperado = valoresDia.frequencia[chaveBusca] || "";

          const inputDieta = screen.getByTestId(
            `dietas_autorizadas__faixa_${uuid_faixa}__dia_${diaFormatado}__categoria_${cateoria}`,
          );
          expect(inputDieta).toHaveAttribute("value", valorDietaEsperado);

          const inputFrequencia = screen.getByTestId(
            `frequencia__faixa_${uuid_faixa}__dia_${diaFormatado}__categoria_${cateoria}`,
          );
          expect(inputFrequencia).toHaveAttribute("value", valorFreqEsperado);
        });
      });

      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      await waitFor(() => {
        expect(botao).not.toBeDisabled();
      });
    });

    it("ao clicar na tab `Semana 1`, preencher frequencia maior que dietas autorizadas e exibe erro", async () => {
      await awaitServices();
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const faixasRenderizadas = [
        "1b77202d-fd0b-46b7-b4ec-04eb262efece",
        "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
      ];

      const cenarios = [
        { faixa: faixasRenderizadas[0], categoria: "2" },
        { faixa: faixasRenderizadas[1], categoria: "2" },
        { faixa: faixasRenderizadas[0], categoria: "4" },
      ];

      cenarios.forEach(({ faixa, categoria }) => {
        const testId = `frequencia__faixa_${faixa}__dia_01__categoria_${categoria}`;
        const input = screen.getByTestId(testId);

        fireEvent.change(input, { target: { value: "10" } });
        expect(input).toHaveClass("invalid-field");

        const botao = screen.getByText("Salvar Lançamentos").closest("button");
        expect(botao).toBeInTheDocument();
        expect(botao).toBeDisabled();
      });
    });
  });

  describe("Testa o Salvar Lançamentos", () => {
    it("ao clicar na tab `Semana 1`, preenche dia 01 e salva lançamento", async () => {
      await awaitServices();
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const itensParaPreencher = [
        {
          uuidFaixa: "1b77202d-fd0b-46b7-b4ec-04eb262efece",
          categoria: "1",
          valor: "14",
        },
        {
          uuidFaixa: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
          categoria: "1",
          valor: "14",
        },
        {
          uuidFaixa: "4e60c819-4c0b-4d46-95c8-2e3b9674b40e",
          categoria: "1",
          valor: "14",
        },
        {
          uuidFaixa: "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66",
          categoria: "1",
          valor: "14",
        },
        {
          uuidFaixa: "55f0af28-e1d5-43a0-a3f3-bbc453b784a5",
          categoria: "1",
          valor: "14",
        },
        {
          uuidFaixa: "e3030bd1-2e85-4676-87b3-96b4032370d4",
          categoria: "1",
          valor: "14",
        },
        {
          uuidFaixa: "2e14cd6e-33e6-4168-b1ce-449f686d1e7d",
          categoria: "1",
          valor: "14",
        },
        {
          uuidFaixa: "1b77202d-fd0b-46b7-b4ec-04eb262efece",
          categoria: "2",
          valor: "4",
        },
        {
          uuidFaixa: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
          categoria: "2",
          valor: "1",
        },
        {
          uuidFaixa: "1b77202d-fd0b-46b7-b4ec-04eb262efece",
          categoria: "4",
          valor: "2",
        },
      ];

      itensParaPreencher.forEach(({ uuidFaixa, categoria, valor }) => {
        const input = screen.getByTestId(
          `frequencia__faixa_${uuidFaixa}__dia_01__categoria_${categoria}`,
        );
        fireEvent.change(input, { target: { value: valor } });
      });

      const botao = screen.getByRole("button", { name: /salvar lançamentos/i });
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

      itensParaPreencher.forEach(({ uuidFaixa, categoria, valor }) => {
        const input = screen.getByTestId(
          `frequencia__faixa_${uuidFaixa}__dia_01__categoria_${categoria}`,
        );
        expect(input).toHaveAttribute("value", valor);
      });

      const inputParticipantes = screen.getByTestId(
        "participantes__faixa_null__dia_01__categoria_1",
      );
      expect(inputParticipantes).toHaveAttribute("value", "100");

      const inputDietasAutorizadaA1 = screen.getByTestId(
        `dietas_autorizadas__faixa_1b77202d-fd0b-46b7-b4ec-04eb262efece__dia_01__categoria_2`,
      );
      expect(inputDietasAutorizadaA1).toHaveAttribute("value", "6");

      const inputDietasAutorizadaA2 = screen.getByTestId(
        `dietas_autorizadas__faixa_381aecc2-e1b2-4d26-a156-1834eec7f1dd__dia_01__categoria_2`,
      );
      expect(inputDietasAutorizadaA2).toHaveAttribute("value", "2");

      const inputDietasAutorizadaB = screen.getByTestId(
        `dietas_autorizadas__faixa_1b77202d-fd0b-46b7-b4ec-04eb262efece__dia_01__categoria_4`,
      );
      expect(inputDietasAutorizadaB).toHaveAttribute("value", "2");
    });
  });
});
