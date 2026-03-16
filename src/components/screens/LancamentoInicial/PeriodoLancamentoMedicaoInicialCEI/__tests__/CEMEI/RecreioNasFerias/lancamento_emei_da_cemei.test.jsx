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
import { localStorageMock } from "src/mocks/localStorageMock";
import { PeriodoLancamentoMedicaoInicialCEI } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicialCEI";
import { mockLocationStateGrupoEmeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockStateRecreio";
import { getMeusDados } from "src/services/perfil.service";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEMEI";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockDiasLetivosRecreio } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/diasLetivosRecreio";
import { mockValoresMedicaoEmeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockValoresMedicao";
import { mockSalvaLancamentoSemana1EmeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockSalvarLancamentos";
import { mockDietasEspeciaisEmeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockDietasEspeciais";

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
  getLogDietasAutorizadasRecreioNasFerias,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getTiposDeAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import { getPermissoesLancamentosEspeciaisMesAnoPorPeriodo } from "src/services/medicaoInicial/permissaoLancamentosEspeciais.service";
import mock from "src/services/_mock";

jest.mock("src/services/perfil.service.jsx");
jest.mock("src/services/medicaoInicial/diaSobremesaDoce.service.jsx");
jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/medicaoInicial/periodoLancamentoMedicao.service");
jest.mock("src/services/medicaoInicial/permissaoLancamentosEspeciais.service");

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
    expect(getLogDietasAutorizadasRecreioNasFerias).toHaveBeenCalled;
  });
};

describe("Teste <PeriodoLancamentoMedicaoInicialCEI> para o Grupo Recreio nas Férias - de 4 a 14 anos - CEMEI", () => {
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
    getLogDietasAutorizadasRecreioNasFerias.mockResolvedValue({
      data: mockDietasEspeciaisEmeiDaCEMEI,
      status: 200,
    });

    getValoresPeriodosLancamentos.mockResolvedValue({
      data: mockValoresMedicaoEmeiDaCEMEI,
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
      data: mockSalvaLancamentoSemana1EmeiDaCEMEI,
      status: 200,
    });

    getTiposDeAlimentacao.mockResolvedValue({
      data: { data: { results: [] }, status: 200 },
      status: 200,
    });

    getPermissoesLancamentosEspeciaisMesAnoPorPeriodo.mockResolvedValue({
      data: {
        results: {
          alimentacoes_lancamentos_especiais: [],
          permissoes_por_dia: [],
          data_inicio_permissoes: null,
        },
      },
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("eh_cemei", "true");
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/", state: mockLocationStateGrupoEmeiDaCEMEI },
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
        mockLocationStateGrupoEmeiDaCEMEI.solicitacaoMedicaoInicial
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
        mockLocationStateGrupoEmeiDaCEMEI.periodo,
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

    it("renderiza label `DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS`", async () => {
      await awaitServices();
      expect(
        screen.getByText(
          "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS",
        ),
      ).toBeInTheDocument();
    });

    it("renderiza label `Dietas Autorizadas` dentro da seção `DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS`", async () => {
      await awaitServices();
      const categoriaDietaAUuid = "1d9dd86f-d008-4b54-b8c5-db4c8434bb51";
      const myElement = screen.getByTestId(
        `div-lancamentos-por-categoria-${categoriaDietaAUuid}`,
      );
      const dietasAutorizadas = screen.getAllByText("Dietas Autorizadas");
      const specificParticipantes = dietasAutorizadas.find((element) =>
        myElement.contains(element),
      );
      expect(specificParticipantes).toBeInTheDocument();
    });

    it("renderiza label `Seg.` dentro da seção `DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS`", async () => {
      await awaitServices();
      const categoriaDietaAUuid = "1d9dd86f-d008-4b54-b8c5-db4c8434bb51";
      const myElement = screen.getByTestId(
        `div-lancamentos-por-categoria-${categoriaDietaAUuid}`,
      );
      const dietasAutorizadas = screen.getAllByText("Seg.");
      const specificParticipantes = dietasAutorizadas.find((element) =>
        myElement.contains(element),
      );
      expect(specificParticipantes).toBeInTheDocument();
    });

    it("renderiza label `DIETA ESPECIAL - TIPO B`", async () => {
      await awaitServices();
      expect(screen.getByText("DIETA ESPECIAL - TIPO B")).toBeInTheDocument();
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
    it("ao clicar na tab `Semana 1`, exibe, nos dias 29 dezembro a 04 de janeiro, e verifica os lançamentos", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const VALORES_ESPERADOS = {
        1: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        2: {
          participantes: "150",
          frequencia: "150",
          lanche: "20",
          lanche4h: "80",
          refeicao: "10",
          repeticao_refeicao: "10",
          sobremesa: "30",
          repeticao_sobremesa: "30",
        },
        3: {
          participantes: "",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        4: {
          participantes: "",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        29: {
          participantes: "Mês anterior",
          frequencia: "Mês anterior",
          lanche: "Mês anterior",
          lanche4h: "Mês anterior",
          refeicao: "Mês anterior",
          repeticao_refeicao: "Mês anterior",
          sobremesa: "Mês anterior",
          repeticao_sobremesa: "Mês anterior",
        },
        30: {
          participantes: "Mês anterior",
          frequencia: "Mês anterior",
          lanche: "Mês anterior",
          lanche4h: "Mês anterior",
          refeicao: "Mês anterior",
          repeticao_refeicao: "Mês anterior",
          sobremesa: "Mês anterior",
          repeticao_sobremesa: "Mês anterior",
        },
        31: {
          participantes: "Mês anterior",
          frequencia: "Mês anterior",
          lanche: "Mês anterior",
          lanche4h: "Mês anterior",
          refeicao: "Mês anterior",
          repeticao_refeicao: "Mês anterior",
          sobremesa: "Mês anterior",
          repeticao_sobremesa: "Mês anterior",
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
        const botaoAdicionarDivElement = screen.getByTestId(
          `div-botao-add-obs-${diaFormatado}-1-observacoes`,
        );

        expect(inputParticipantes).toHaveAttribute(
          "value",
          valoresDia.participantes,
        );
        expect(inputFrequencia).toHaveAttribute("value", valoresDia.frequencia);
        expect(inputParticipantes.disabled).toBe(true);

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

        const botaoAdicionar = botaoAdicionarDivElement.querySelector("button");
        if (diasBloqueados.includes(Number(dia))) {
          expect(inputFrequencia.disabled).toBe(true);
          expect(inputLanche4h.disabled).toBe(true);
          expect(inputLanche.disabled).toBe(true);
          expect(inputRefeicao.disabled).toBe(true);
          expect(inputRepeticaoRefeicao.disabled).toBe(true);
          expect(inputSobremesa.disabled).toBe(true);
          expect(inputRepeticaoSobremesa.disabled).toBe(true);
          expect(botaoAdicionar).not.toBeInTheDocument();
        } else {
          expect(inputFrequencia.disabled).toBe(false);
          expect(inputLanche4h.disabled).toBe(false);
          expect(inputLanche.disabled).toBe(false);
          expect(inputRefeicao.disabled).toBe(false);
          expect(inputRepeticaoRefeicao.disabled).toBe(false);
          expect(inputSobremesa.disabled).toBe(false);
          expect(inputRepeticaoSobremesa.disabled).toBe(false);
          expect(botaoAdicionar).toHaveTextContent("Adicionar");
        }
      });
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      await waitFor(() => {
        expect(botao).not.toBeDisabled();
      });
    });

    it("ao clicar na tab `Semana 2`, exibe, nos dias 05 a 11 de janeiro, e verifica os lançamentos", async () => {
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);
      const VALORES_ESPERADOS = {
        5: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        6: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        7: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        8: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        9: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        10: {
          participantes: "",
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
      };

      await waitFor(() => {
        expect(true).toBe(true);
      });

      const diasBloqueados = [10, 11];

      Object.keys(VALORES_ESPERADOS).forEach((dia) => {
        const valoresDia = VALORES_ESPERADOS[dia];
        const diaFormatado = dia.toString().padStart(2, "0");

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
        const botaoAdicionarDivElement = screen.getByTestId(
          `div-botao-add-obs-${diaFormatado}-1-observacoes`,
        );

        expect(inputParticipantes).toHaveAttribute(
          "value",
          valoresDia.participantes,
        );
        expect(inputFrequencia).toHaveAttribute("value", valoresDia.frequencia);
        expect(inputParticipantes.disabled).toBe(true);

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

        const botaoAdicionar = botaoAdicionarDivElement.querySelector("button");
        if (diasBloqueados.includes(Number(dia))) {
          expect(inputFrequencia.disabled).toBe(true);
          expect(inputLanche4h.disabled).toBe(true);
          expect(inputLanche.disabled).toBe(true);
          expect(inputRefeicao.disabled).toBe(true);
          expect(inputRepeticaoRefeicao.disabled).toBe(true);
          expect(inputSobremesa.disabled).toBe(true);
          expect(inputRepeticaoSobremesa.disabled).toBe(true);
          expect(botaoAdicionar).not.toBeInTheDocument();
        } else {
          expect(inputFrequencia.disabled).toBe(false);
          expect(inputLanche4h.disabled).toBe(false);
          expect(inputLanche.disabled).toBe(false);
          expect(inputRefeicao.disabled).toBe(false);
          expect(inputRepeticaoRefeicao.disabled).toBe(false);
          expect(inputSobremesa.disabled).toBe(false);
          expect(inputRepeticaoSobremesa.disabled).toBe(false);
          expect(botaoAdicionar).toHaveTextContent("Adicionar");
        }
      });
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      await waitFor(() => {
        expect(botao).not.toBeDisabled();
      });
    });

    it("ao clicar na tab `Semana 3`, exibe, nos dias 12 a 18 de janeiro, e verifica os lançamentos", async () => {
      const semana3Element = screen.getByText("Semana 3");
      fireEvent.click(semana3Element);
      const VALORES_ESPERADOS = {
        12: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        13: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        14: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        15: {
          participantes: "150",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        16: {
          participantes: "",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        17: {
          participantes: "",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        18: {
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

      await waitFor(() => {
        expect(true).toBe(true);
      });

      const diasBloqueados = [16, 17, 18];

      Object.keys(VALORES_ESPERADOS).forEach((dia) => {
        const valoresDia = VALORES_ESPERADOS[dia];
        const diaFormatado = dia.toString().padStart(2, "0");

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
        const botaoAdicionarDivElement = screen.getByTestId(
          `div-botao-add-obs-${diaFormatado}-1-observacoes`,
        );

        expect(inputParticipantes).toHaveAttribute(
          "value",
          valoresDia.participantes,
        );
        expect(inputFrequencia).toHaveAttribute("value", valoresDia.frequencia);
        expect(inputParticipantes.disabled).toBe(true);

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

        const botaoAdicionar = botaoAdicionarDivElement.querySelector("button");
        if (diasBloqueados.includes(Number(dia))) {
          expect(inputFrequencia.disabled).toBe(true);
          expect(inputLanche4h.disabled).toBe(true);
          expect(inputLanche.disabled).toBe(true);
          expect(inputRefeicao.disabled).toBe(true);
          expect(inputRepeticaoRefeicao.disabled).toBe(true);
          expect(inputSobremesa.disabled).toBe(true);
          expect(inputRepeticaoSobremesa.disabled).toBe(true);
          expect(botaoAdicionar).not.toBeInTheDocument();
        } else {
          expect(inputFrequencia.disabled).toBe(false);
          expect(inputLanche4h.disabled).toBe(false);
          expect(inputLanche.disabled).toBe(false);
          expect(inputRefeicao.disabled).toBe(false);
          expect(inputRepeticaoRefeicao.disabled).toBe(false);
          expect(inputSobremesa.disabled).toBe(false);
          expect(inputRepeticaoSobremesa.disabled).toBe(false);
          expect(botaoAdicionar).toHaveTextContent("Adicionar");
        }
      });
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      await waitFor(() => {
        expect(botao).not.toBeDisabled();
      });
    });

    it("ao clicar na tab `Semana 1`, preencher frequencia maior que participantes e exibe erro", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const inputElementFrequenciaDia03 = screen.getByTestId(
        "frequencia__dia_02__categoria_1",
      );
      waitFor(() => {
        fireEvent.change(inputElementFrequenciaDia03, {
          target: { value: "200" },
        });
      });
      expect(inputElementFrequenciaDia03).toHaveClass("invalid-field");
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).toBeDisabled();
    });

    it("ao clicar na tab `Semana 1`, preencher lanche maior que frequencia e exibe erro", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const inputElementLancheDia03 = screen.getByTestId(
        "lanche__dia_02__categoria_1",
      );
      waitFor(() => {
        fireEvent.change(inputElementLancheDia03, {
          target: { value: "200" },
        });
      });
      expect(inputElementLancheDia03).toHaveClass("invalid-field");
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).toBeDisabled();
    });

    it("ao clicar na tab `Semana 1`, preencher lanche 4h maior que frequencia e exibe erro", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const inputElementLanche4hDia03 = screen.getByTestId(
        "lanche_4h__dia_02__categoria_1",
      );
      waitFor(() => {
        fireEvent.change(inputElementLanche4hDia03, {
          target: { value: "200" },
        });
      });
      expect(inputElementLanche4hDia03).toHaveClass("invalid-field");
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).toBeDisabled();
    });

    it("ao clicar na tab `Semana 1`, preencher refeição maior que frequencia e exibe erro", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const inputElementRefeicaoDia03 = screen.getByTestId(
        "refeicao__dia_02__categoria_1",
      );
      waitFor(() => {
        fireEvent.change(inputElementRefeicaoDia03, {
          target: { value: "200" },
        });
      });
      expect(inputElementRefeicaoDia03).toHaveClass("invalid-field");
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).toBeDisabled();
    });

    it("ao clicar na tab `Semana 1`, preencher sobremesa maior que frequencia e exibe erro", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const inputElementSobremesaDia03 = screen.getByTestId(
        "sobremesa__dia_02__categoria_1",
      );
      waitFor(() => {
        fireEvent.change(inputElementSobremesaDia03, {
          target: { value: "200" },
        });
      });
      expect(inputElementSobremesaDia03).toHaveClass("invalid-field");
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).toBeDisabled();
    });

    it("ao clicar na tab `Semana 1`, preencher repetição de refeição maior que refeição e exibe atenção", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const inputRefeicao = screen.getByTestId("refeicao__dia_02__categoria_1");
      fireEvent.change(inputRefeicao, {
        target: { value: "60" },
      });

      const inputRepeticaoRefeicao = screen.getByTestId(
        "repeticao_refeicao__dia_02__categoria_1",
      );
      waitFor(() => {
        fireEvent.change(inputRepeticaoRefeicao, {
          target: { value: "170" },
        });
      });

      const tooltip = document.querySelector(
        '[data-test-id="tooltip_repeticao_refeicao__dia_02__categoria_1"]',
      );
      expect(tooltip).not.toBeNull();
      expect(tooltip).toHaveClass("icone-info-success");

      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).not.toBeDisabled();
    });

    it("ao clicar na tab `Semana 1`, preencher repetição de sobremesa maior que sobremesa e exibe atenção", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const inputRefeicao = screen.getByTestId(
        "sobremesa__dia_02__categoria_1",
      );
      fireEvent.change(inputRefeicao, {
        target: { value: "60" },
      });

      const inputRepeticaoRefeicao = screen.getByTestId(
        "repeticao_sobremesa__dia_02__categoria_1",
      );
      waitFor(() => {
        fireEvent.change(inputRepeticaoRefeicao, {
          target: { value: "170" },
        });
      });

      const tooltip = document.querySelector(
        '[data-test-id="tooltip_repeticao_sobremesa__dia_02__categoria_1"]',
      );
      expect(tooltip).not.toBeNull();
      expect(tooltip).toHaveClass("icone-info-success");

      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).not.toBeDisabled();
    });
  });

  describe("Testa a parte de DIETAS ESPECIAIS", () => {
    it("ao clicar na tab `Semana 1`, exibe, nos dias 29 dezembro a 04 de janeiro, e verifica os lançamentos", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const VALORES_ESPERADOS = {
        1: {
          dietas: "",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        2: {
          dietas: "2",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        3: {
          dietas: "",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        4: {
          dietas: "",
          frequencia: "",
          lanche: "",
          lanche4h: "",
          refeicao: "",
          repeticao_refeicao: "",
          sobremesa: "",
          repeticao_sobremesa: "",
        },
        29: {
          dietas: "Mês anterior",
          frequencia: "Mês anterior",
          lanche: "Mês anterior",
          lanche4h: "Mês anterior",
          refeicao: "Mês anterior",
          repeticao_refeicao: "Mês anterior",
          sobremesa: "Mês anterior",
          repeticao_sobremesa: "Mês anterior",
        },
        30: {
          dietas: "Mês anterior",
          frequencia: "Mês anterior",
          lanche: "Mês anterior",
          lanche4h: "Mês anterior",
          refeicao: "Mês anterior",
          repeticao_refeicao: "Mês anterior",
          sobremesa: "Mês anterior",
          repeticao_sobremesa: "Mês anterior",
        },
        31: {
          dietas: "Mês anterior",
          frequencia: "Mês anterior",
          lanche: "Mês anterior",
          lanche4h: "Mês anterior",
          refeicao: "Mês anterior",
          repeticao_refeicao: "Mês anterior",
          sobremesa: "Mês anterior",
          repeticao_sobremesa: "Mês anterior",
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
          `dietas_autorizadas__dia_${diaFormatado}__categoria_2`,
        );
        const inputFrequencia = screen.getByTestId(
          `frequencia__dia_${diaFormatado}__categoria_2`,
        );
        const inputLanche4h = screen.getByTestId(
          `lanche_4h__dia_${diaFormatado}__categoria_2`,
        );
        const inputLanche = screen.getByTestId(
          `lanche__dia_${diaFormatado}__categoria_2`,
        );
        const botaoAdicionarDivElement = screen.getByTestId(
          `div-botao-add-obs-${diaFormatado}-1-observacoes`,
        );

        expect(inputParticipantes).toHaveAttribute(
          "value",
          valoresDia.participantes,
        );
        expect(inputFrequencia).toHaveAttribute("value", valoresDia.frequencia);
        expect(inputParticipantes.disabled).toBe(true);

        expect(inputLanche4h).toHaveAttribute("value", valoresDia.lanche4h);
        expect(inputLanche).toHaveAttribute("value", valoresDia.lanche);

        const botaoAdicionar = botaoAdicionarDivElement.querySelector("button");
        if (diasBloqueados.includes(Number(dia))) {
          expect(inputFrequencia.disabled).toBe(true);
          expect(inputLanche4h.disabled).toBe(true);
          expect(inputLanche.disabled).toBe(true);
          expect(botaoAdicionar).not.toBeInTheDocument();
        } else {
          expect(inputFrequencia.disabled).toBe(false);
          expect(inputLanche4h.disabled).toBe(false);
          expect(inputLanche.disabled).toBe(false);
          expect(botaoAdicionar).toHaveTextContent("Adicionar");
        }
      });
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      await waitFor(() => {
        expect(botao).not.toBeDisabled();
      });
    });

    it("ao clicar na tab `Semana 1`, preencher frequencia maior que participantes e exibe erro", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const inputElementFrequenciaDia03 = screen.getByTestId(
        "frequencia__dia_02__categoria_2",
      );
      waitFor(() => {
        fireEvent.change(inputElementFrequenciaDia03, {
          target: { value: "200" },
        });
      });
      expect(inputElementFrequenciaDia03).toHaveClass("invalid-field");
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).toBeDisabled();
    });

    it("ao clicar na tab `Semana 1`, preencher lanche maior que frequencia e exibe erro", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const inputElementFrequenciaDia03 = screen.getByTestId(
        "frequencia__dia_02__categoria_2",
      );
      fireEvent.change(inputElementFrequenciaDia03, {
        target: { value: "2" },
      });
      const inputElementLancheDia03 = screen.getByTestId(
        "lanche__dia_02__categoria_2",
      );
      waitFor(() => {
        fireEvent.change(inputElementLancheDia03, {
          target: { value: "5" },
        });
      });
      expect(inputElementLancheDia03).toHaveClass("invalid-field");
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).toBeDisabled();
    });

    it("ao clicar na tab `Semana 1`, preencher lanche 4h maior que frequencia e exibe erro", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);
      const inputElementFrequenciaDia03 = screen.getByTestId(
        "frequencia__dia_02__categoria_2",
      );
      fireEvent.change(inputElementFrequenciaDia03, {
        target: { value: "2" },
      });

      const inputElementLanche4hDia03 = screen.getByTestId(
        "lanche_4h__dia_02__categoria_2",
      );
      waitFor(() => {
        fireEvent.change(inputElementLanche4hDia03, {
          target: { value: "5" },
        });
      });
      expect(inputElementLanche4hDia03).toHaveClass("invalid-field");
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeInTheDocument();
      expect(botao).toBeDisabled();
    });
  });

  describe("Testa o Salvar Lançamentos", () => {
    it("ao clicar na tab `Semana 1`, preenche dia 02 e salva lançamento", async () => {
      const semana1Element = screen.getByText("Semana 1");
      fireEvent.click(semana1Element);

      const valoresAlimentacao = {
        frequencia: "150",
        lanche_4h: "80",
        lanche: "100",
        refeicao: "120",
        repeticao_refeicao: "114",
        sobremesa: "148",
        repeticao_sobremesa: "134",
      };

      const camposAlimentacao = [
        { key: "frequencia", testId: "frequencia" },
        { key: "lanche_4h", testId: "lanche_4h" },
        { key: "lanche", testId: "lanche" },
        { key: "refeicao", testId: "refeicao" },
        { key: "repeticao_refeicao", testId: "repeticao_refeicao" },
        { key: "sobremesa", testId: "sobremesa" },
        { key: "repeticao_sobremesa", testId: "repeticao_sobremesa" },
      ];

      camposAlimentacao.forEach(({ key, testId }) => {
        const input = screen.getByTestId(`${testId}__dia_02__categoria_1`);
        fireEvent.change(input, { target: { value: valoresAlimentacao[key] } });
      });

      const valoresDieta = {
        frequencia: "2",
        lanche_4h: "2",
        lanche: "0",
      };

      const camposDieta = [
        { key: "frequencia", testId: "frequencia" },
        { key: "lanche_4h", testId: "lanche_4h" },
        { key: "lanche", testId: "lanche" },
      ];

      camposDieta.forEach(({ key, testId }) => {
        const input = screen.getByTestId(`${testId}__dia_02__categoria_2`);
        fireEvent.change(input, { target: { value: valoresDieta[key] } });
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

      const valoresEsperadosAlimentacao = {
        participantes: "150",
        ...valoresAlimentacao,
      };
      const camposAtualizadosAlimentacao = [
        { key: "participantes", testId: "participantes" },
        ...camposAlimentacao,
      ];
      camposAtualizadosAlimentacao.forEach(({ key, testId }) => {
        const input = screen.getByTestId(`${testId}__dia_02__categoria_1`);
        expect(input).toHaveAttribute(
          "value",
          valoresEsperadosAlimentacao[key],
        );
      });

      const valoresEsperadosDieta = {
        dietas_autorizadas: "2",
        ...valoresDieta,
      };
      const camposAtualizadosDieta = [
        { key: "dietas_autorizadas", testId: "dietas_autorizadas" },
        ...camposDieta,
      ];

      camposAtualizadosDieta.forEach(({ key, testId }) => {
        const input = screen.getByTestId(`${testId}__dia_02__categoria_2`);
        expect(input).toHaveAttribute("value", valoresEsperadosDieta[key]);
      });
    });
  });
});
