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
import { mockLocationStateGrupoColaboradores } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/mockStateEMEFGrupoRecreio";
import { mockValoresMedicaoColaboradoresEMEF } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/valoresMedicaoEMEF";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockDiasLetivos } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/diasLetivosRecreio";
import { mockSalvaLancamentoColaboradoresSemana1 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/mockSalvaLancamentoEMEF";
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

describe("Teste <PeriodoLancamentoMedicaoInicial> para o Grupo Colaboradores - EMEF", () => {
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
      data: mockValoresMedicaoColaboradoresEMEF,
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
      data: mockSalvaLancamentoColaboradoresSemana1,
      status: 200,
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/", state: mockLocationStateGrupoColaboradores },
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
      mockLocationStateGrupoColaboradores.solicitacaoMedicaoInicial
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
      mockLocationStateGrupoColaboradores.grupo,
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
      },
      2: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      3: {
        participantes: "50",
        frequencia: "45",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      4: {
        participantes: "50",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      5: {
        participantes: "50",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      6: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      7: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
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
      const inputSobremesa = screen.queryByTestId(
        `sobremesa__dia_0${dia}__categoria_1`,
      );
      const inputRepeticaoSobremesa = screen.queryByTestId(
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
      expect(inputSobremesa).not.toBeInTheDocument();
      expect(inputRepeticaoSobremesa).not.toBeInTheDocument();

      expect(inputParticipantes.disabled).toBe(true);
      if ([1, 2, 6, 7].includes(dia)) {
        expect(inputFrequencia.disabled).toBe(true);
        expect(inputLanche4h.disabled).toBe(true);
        expect(inputLanche.disabled).toBe(true);
        expect(inputRefeicao.disabled).toBe(true);
        expect(inputRepeticaoRefeicao.disabled).toBe(true);
      } else {
        expect(inputFrequencia.disabled).toBe(false);
        expect(inputLanche4h.disabled).toBe(false);
        expect(inputLanche.disabled).toBe(false);
        expect(inputRefeicao.disabled).toBe(false);
        expect(inputRepeticaoRefeicao.disabled).toBe(false);
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
    preview.debug();

    const VALORES_ESPERADOS = {
      8: {
        participantes: "50",
        frequencia: "41",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      9: {
        participantes: "50",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      10: {
        participantes: "50",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      11: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      12: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      13: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
      },
      14: {
        participantes: "",
        frequencia: "",
        lanche: "",
        lanche4h: "",
        refeicao: "",
        repeticao_refeicao: "",
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
      const inputSobremesa = screen.queryByTestId(
        `sobremesa__dia_${diaFormatado}__categoria_1`,
      );
      const inputRepeticaoSobremesa = screen.queryByTestId(
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
      expect(inputSobremesa).not.toBeInTheDocument();
      expect(inputRepeticaoSobremesa).not.toBeInTheDocument();

      expect(inputParticipantes.disabled).toBe(true);
      if ([11, 12, 13, 14].includes(dia)) {
        expect(inputFrequencia.disabled).toBe(true);
        expect(inputLanche4h.disabled).toBe(true);
        expect(inputLanche.disabled).toBe(true);
        expect(inputRefeicao.disabled).toBe(true);
        expect(inputRepeticaoRefeicao.disabled).toBe(true);
      } else {
        expect(inputFrequencia.disabled).toBe(false);
        expect(inputLanche4h.disabled).toBe(false);
        expect(inputLanche.disabled).toBe(false);
        expect(inputRefeicao.disabled).toBe(false);
        expect(inputRepeticaoRefeicao.disabled).toBe(false);
      }
    }
    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();
  });
});
