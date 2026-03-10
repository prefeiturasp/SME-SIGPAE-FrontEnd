import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { localStorageMock } from "src/mocks/localStorageMock";
import { PeriodoLancamentoMedicaoInicialCEI } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicialCEI";
import { mockLocationStateGrupoCeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockStateRecreio";
import { getMeusDados } from "src/services/perfil.service";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEMEI";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockDiasLetivosRecreio } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/diasLetivosRecreio";
import { mockValoresMedicaoCeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockValoresMedicao";
import { mockSalvaLancamentoSemana1CeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockSalvarLancamentos";
import preview from "jest-preview";

import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
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
import { getTiposDeAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
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

describe("Teste <PeriodoLancamentoMedicaoInicialCEI> para o Grupo Recreio nas Férias - de 0 a 3 anos e 11 meses - CEMEI", () => {
  beforeEach(async () => {
    getMeusDados.mockResolvedValue({
      data: mockMeusDadosEscolaCEMEI,
      status: 200,
    });
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);

    getListaDiasSobremesaDoce.mockResolvedValue({ data: [], status: 200 });

    getSolicitacoesInclusoesAutorizadasEscola.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesSuspensoesAutorizadasEscola.mockResolvedValue({
      data: { data: { results: [] }, status: 200 },
      status: 200,
    });

    getCategoriasDeMedicao.mockResolvedValue({
      data: mockCategoriasMedicaoCEI,
      status: 200,
    });

    getDiasLetivosRecreio.mockResolvedValue({
      data: mockDiasLetivosRecreio,
      status: 200,
    });
    getLogDietasAutorizadasRecreioNasFeriasCEI.mockResolvedValue({
      data: [],
      status: 200,
    });

    getValoresPeriodosLancamentos.mockResolvedValue({
      data: mockValoresMedicaoCeiDaCEMEI,
      status: 200,
    });

    getDiasParaCorrecao.mockResolvedValue({
      data: [],
      status: 200,
    });

    getFeriadosNoMes.mockResolvedValue({
      data: { results: ["01", "25"] },
      status: 200,
    });

    updateValoresPeriodosLancamentos.mockResolvedValue({
      data: mockSalvaLancamentoSemana1CeiDaCEMEI,
      status: 200,
    });

    getTiposDeAlimentacao.mockResolvedValue({
      data: { data: { results: [] }, status: 200 },
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("eh_cemei", "true");
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/", state: mockLocationStateGrupoCeiDaCEMEI },
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

    it("renderiza valor `Recreio nas Férias - JAN 2026` Mês do Lançamento`", () => {
      const inputElement = screen.getByTestId("input-mes-lancamento");
      expect(inputElement).toHaveAttribute(
        "value",
        mockLocationStateGrupoCeiDaCEMEI.solicitacaoMedicaoInicial
          .recreio_nas_ferias.titulo,
      );
    });

    it("renderiza label `Tipo de Lançamento`", () => {
      expect(screen.getByText("Tipo de Lançamento")).toBeInTheDocument();
    });

    it("renderiza valor `Recreio nas Férias` no input `Tipo de Lançamento`", () => {
      const inputElement = screen.getByTestId("input-periodo-lancamento");
      expect(inputElement).toHaveAttribute(
        "value",
        mockLocationStateGrupoCeiDaCEMEI.periodo,
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
      expect(screen.getByText("Semana 1")).toBeInTheDocument();
      expect(screen.getByText("Semana 2")).toBeInTheDocument();
      expect(screen.getByText("Semana 3")).toBeInTheDocument();
    });

    it("não renderiza as labels  `Semana 4`, `Semana 5`", async () => {
      expect(screen.queryByText("Semana 4")).not.toBeInTheDocument();
      expect(screen.queryByText("Semana 5")).not.toBeInTheDocument();
    });

    it("renderiza label `ALIMENTAÇÃO`", async () => {
      expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    });

    it("renderiza label `Participantes` dentro da seção `ALIMENTAÇÃO`", async () => {
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
  });

  describe("Testa a parte de ALIMENTAÇÃO", () => {
    it("verificar se todas as faixas estão sendo renderizadas", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      for (let faixa of mockFaixasEtarias.results) {
        expect(screen.getByText(faixa.__str__)).toBeInTheDocument();
      }
    });

    it("ao clicar na tab `Semana 1`, exibe, nos dias 29 dezembro a 04 de janeiro, e verifica os lançamentos", async () => {
      await awaitServices();
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const VALORES_ESPERADOS = {
        1: {
          participantes: "50",
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
        2: {
          participantes: "50",
          frequencia: {
            "1b77202d-fd0b-46b7-b4ec-04eb262efece": "50",
            "381aecc2-e1b2-4d26-a156-1834eec7f1dd": "",
            "4e60c819-4c0b-4d46-95c8-2e3b9674b40e": "",
            "78e4f4a6-ae04-42a6-9cc3-8f9813e98e66": "",
            "55f0af28-e1d5-43a0-a3f3-bbc453b784a5": "",
            "e3030bd1-2e85-4676-87b3-96b4032370d4": "",
            "2e14cd6e-33e6-4168-b1ce-449f686d1e7d": "",
          },
        },
        3: {
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
        31: {
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

      const diasBloqueados = [29, 30, 31, 1, 3, 4];

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

        const botaoAdicionarDivElement = screen.getByTestId(
          `div-botao-add-obs-${diaFormatado}-1-observacoes`,
        );
        const botaoAdicionar = botaoAdicionarDivElement.querySelector("button");
        if (diasBloqueados.includes(Number(dia))) {
          expect(botaoAdicionar).not.toBeInTheDocument();
        } else {
          expect(botaoAdicionar).toHaveTextContent("Adicionar");
        }

        mockFaixasEtarias.results.forEach((faixa) => {
          const inputFrequencia = screen.getByTestId(
            `frequencia__faixa_${faixa.uuid}__dia_${diaFormatado}__categoria_1`,
          );
          expect(inputFrequencia).toHaveAttribute(
            "value",
            valoresDia.frequencia[faixa.uuid],
          );

          if (diasBloqueados.includes(Number(dia))) {
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

    it("ao clicar na tab `Semana 2`, exibe, nos dias 05 a 11 de janeiro, e verifica os lançamentos", async () => {
      await awaitServices();
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);
      preview.debug();
      const VALORES_ESPERADOS = {
        5: {
          participantes: "50",
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
        6: {
          participantes: "50",
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
        7: {
          participantes: "50",
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
        8: {
          participantes: "50",
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
        9: {
          participantes: "50",
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
        10: {
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
        11: {
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

      const diasBloqueados = [10, 11];
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

        const botaoAdicionarDivElement = screen.getByTestId(
          `div-botao-add-obs-${diaFormatado}-1-observacoes`,
        );
        const botaoAdicionar = botaoAdicionarDivElement.querySelector("button");
        if (diasBloqueados.includes(Number(dia))) {
          expect(botaoAdicionar).not.toBeInTheDocument();
        } else {
          expect(botaoAdicionar).toHaveTextContent("Adicionar");
        }
        mockFaixasEtarias.results.forEach((faixa) => {
          const inputFrequencia = screen.getByTestId(
            `frequencia__faixa_${faixa.uuid}__dia_${diaFormatado}__categoria_1`,
          );
          expect(inputFrequencia).toHaveAttribute(
            "value",
            valoresDia.frequencia[faixa.uuid],
          );

          if (diasBloqueados.includes(Number(dia))) {
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

    it("ao clicar na tab `Semana 3`, exibe, nos dias 12 a 18 de janeiro, e verifica os lançamentos", async () => {
      await awaitServices();
      const semana3Element = screen.getByText("Semana 3");
      fireEvent.click(semana3Element);
      preview.debug();
      const VALORES_ESPERADOS = {
        12: {
          participantes: "50",
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
        13: {
          participantes: "50",
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
          participantes: "50",
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
        15: {
          participantes: "50",
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
        16: {
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
        17: {
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
        18: {
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

      const diasBloqueados = [16, 17, 18];

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

        const botaoAdicionarDivElement = screen.getByTestId(
          `div-botao-add-obs-${diaFormatado}-1-observacoes`,
        );
        const botaoAdicionar = botaoAdicionarDivElement.querySelector("button");
        if (diasBloqueados.includes(Number(dia))) {
          expect(botaoAdicionar).not.toBeInTheDocument();
        } else {
          expect(botaoAdicionar).toHaveTextContent("Adicionar");
        }

        mockFaixasEtarias.results.forEach((faixa) => {
          const inputFrequencia = screen.getByTestId(
            `frequencia__faixa_${faixa.uuid}__dia_${diaFormatado}__categoria_1`,
          );
          expect(inputFrequencia).toHaveAttribute(
            "value",
            valoresDia.frequencia[faixa.uuid],
          );

          if (diasBloqueados.includes(Number(dia))) {
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
        "frequencia__faixa_4e60c819-4c0b-4d46-95c8-2e3b9674b40e__dia_01__categoria_1",
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
});
