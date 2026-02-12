import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { PeriodoLancamentoMedicaoInicialCEI } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicialCEI";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockSalvaLancamentoSemana1Colaboradores } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/mockSalvarLancamentos";
import { mockLocationStateGrupoColaboradores } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/mockStateRecreio";
import { mockValoresMedicaoCEIColaboradores } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/mockValoresMedicaoCEI";
import { mockDiasLetivosColaboradores } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEI/diasLetivosRecreio";
import { mockMeusDadosEscolaCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEI";
import { getTiposDeAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
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
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getMeusDados } from "src/services/perfil.service";
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
  });
};

describe("Teste <PeriodoLancamentoMedicaoInicialCEI> para o Grupo Colaboradores - CEI", () => {
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
      data: mockValoresMedicaoCEIColaboradores,
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
      data: mockDiasLetivosColaboradores,
      status: 200,
    });
    getFeriadosNoMes.mockResolvedValue({
      data: { results: ["12"] },
      status: 200,
    });
    updateValoresPeriodosLancamentos.mockResolvedValue({
      data: mockSalvaLancamentoSemana1Colaboradores,
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
          <PeriodoLancamentoMedicaoInicialCEI />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("renderiza label `Mês do Lançamento`", async () => {
    await awaitServices();
    preview.debug();
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Recreio nas Férias - OUT 2025` Mês do Lançamento`", () => {
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

  it("renderiza valor `Colaboradores` no input `Período de Lançamento`", () => {
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

  it("renderiza as labels `Semana 1`, `Semana 2` e `Semana 3`", async () => {
    await awaitServices();
    expect(screen.getByText("Semana 1")).toBeInTheDocument();
    expect(screen.getByText("Semana 2")).toBeInTheDocument();
    expect(screen.queryByText("Semana 3")).toBeInTheDocument();
  });

  it("não renderiza as labels  `Semana 4` 2 `Semana 5`", async () => {
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
});
