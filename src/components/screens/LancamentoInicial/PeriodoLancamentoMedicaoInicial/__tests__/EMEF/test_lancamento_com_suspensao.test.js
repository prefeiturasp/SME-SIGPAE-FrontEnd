import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { mockTiposAlimentacao } from "mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { mockVinculosTipoAlimentacaoEPeriodoEscolar } from "mocks/InclusaoAlimentacao/mockVinculosTipoAlimentacaoEPeriodoescolar";
import { mockCategoriasMedicao } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockMatriculadosNoMesEMEFJaneiro2025 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Janeiro2025/matriculadosNoMes";
import { mockDiasCalendarioEMEFOutubro2024 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Outubro2024/diasCalendario";
import { mockFeriadosNoMesJaneiro } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/feriadosNoMes/janeiro";
import { mockLogQuantidadeDietasAutorizadas } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/logQuantidadeDietasAutorizadasEMEF";
import { mockLocationStateEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/mockStateEMEF";
import { mockPermissoesLancamentosEspeciaisMesAnoPorPeriodoEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/permissoesLancamentosEspeciaisMesAnoPorPeriodoEMEF";
import { mockSuspensoesAutorizadasEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/suspensoesAutorizadasEMEF";
import { mockValoresMedicaoEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/valoresMedicaoEMEF";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import { MemoryRouter } from "react-router-dom";
import {
  getTiposDeAlimentacao,
  getVinculosTipoAlimentacaoPorEscola,
} from "services/cadastroTipoAlimentacao.service";
import { getListaDiasSobremesaDoce } from "services/medicaoInicial/diaSobremesaDoce.service";
import {
  getCategoriasDeMedicao,
  getDiasCalendario,
  getDiasParaCorrecao,
  getFeriadosNoMes,
  getLogDietasAutorizadasPeriodo,
  getMatriculadosPeriodo,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesInclusoesAutorizadasEscola,
  getSolicitacoesSuspensoesAutorizadasEscola,
  getValoresPeriodosLancamentos,
  updateValoresPeriodosLancamentos,
} from "services/medicaoInicial/periodoLancamentoMedicao.service";
import { getPermissoesLancamentosEspeciaisMesAnoPorPeriodo } from "services/medicaoInicial/permissaoLancamentosEspeciais.service";
import { getMeusDados } from "services/perfil.service";
import PeriodoLancamentoMedicaoInicial from "../..";

jest.mock("services/perfil.service.js");
jest.mock("services/medicaoInicial/diaSobremesaDoce.service.js");
jest.mock("services/cadastroTipoAlimentacao.service");
jest.mock("services/medicaoInicial/periodoLancamentoMedicao.service");
jest.mock("services/medicaoInicial/permissaoLancamentosEspeciais.service");

jest.setTimeout(30000);

const awaitServices = async () => {
  await waitFor(() => {
    expect(getListaDiasSobremesaDoce).toHaveBeenCalled();
    expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalled();
    expect(getSolicitacoesInclusoesAutorizadasEscola).toHaveBeenCalled();
    expect(getCategoriasDeMedicao).toHaveBeenCalled();
    expect(getLogDietasAutorizadasPeriodo).toHaveBeenCalled();
    expect(getValoresPeriodosLancamentos).toHaveBeenCalled();
    expect(getDiasParaCorrecao).toHaveBeenCalled();
    expect(getMatriculadosPeriodo).toHaveBeenCalled();
    expect(getSolicitacoesSuspensoesAutorizadasEscola).toHaveBeenCalled();
    expect(
      getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola
    ).toHaveBeenCalled();
    expect(
      getPermissoesLancamentosEspeciaisMesAnoPorPeriodo
    ).toHaveBeenCalled();
    expect(getDiasCalendario).toHaveBeenCalled();
    expect(getFeriadosNoMes).toHaveBeenCalled();
  });
};

describe("Teste <PeriodoLancamentoMedicaoInicial> com suspensão cancelada parcialmente", () => {
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
      data: mockTiposAlimentacao,
      status: 200,
    });
    getLogDietasAutorizadasPeriodo.mockResolvedValue({
      data: mockLogQuantidadeDietasAutorizadas,
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
    getMatriculadosPeriodo.mockResolvedValue({
      data: mockMatriculadosNoMesEMEFJaneiro2025,
      status: 200,
    });
    getSolicitacoesSuspensoesAutorizadasEscola.mockResolvedValue({
      data: mockSuspensoesAutorizadasEMEF,
      status: 200,
    });
    getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });
    getPermissoesLancamentosEspeciaisMesAnoPorPeriodo.mockResolvedValue({
      data: mockPermissoesLancamentosEspeciaisMesAnoPorPeriodoEMEF,
      status: 200,
    });
    getDiasCalendario.mockResolvedValue({
      data: mockDiasCalendarioEMEFOutubro2024,
      status: 200,
    });
    getFeriadosNoMes.mockResolvedValue({
      data: mockFeriadosNoMesJaneiro,
      status: 200,
    });
    updateValoresPeriodosLancamentos.mockResolvedValue({
      data: mockValoresMedicaoEMEF,
      status: 200,
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/", state: mockLocationStateEMEF }]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <PeriodoLancamentoMedicaoInicial />
        </MemoryRouter>
      );
    });
  });

  it("renderiza label `Mês do Lançamento`", async () => {
    await awaitServices();
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Janeiro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Janeiro / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `MANHA` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "MANHA");
  });

  it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
    expect(
      screen.getByText("Semanas do Período para Lançamento da Medição Inicial")
    ).toBeInTheDocument();
  });

  it("renderiza label `Semana 1`", async () => {
    await awaitServices();
    expect(screen.getByText("Semana 1")).toBeInTheDocument();
  });

  it("renderiza label `Semana 5`", async () => {
    await awaitServices();
    expect(screen.getByText("Semana 5")).toBeInTheDocument();
  });

  it("renderiza label `ALIMENTAÇÃO`", async () => {
    await awaitServices();
    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
  });

  it("renderiza label `Matriculados` dentro da seção `ALIMENTAÇÃO`", async () => {
    await awaitServices();
    const categoriaAlimentacaoUuid = "6a183159-32bb-4a3b-a69b-f0601ee677c1";
    const myElement = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoriaAlimentacaoUuid}`
    );
    const allMatriculados = screen.getAllByText("Matriculados");
    const specificMatriculados = allMatriculados.find((element) =>
      myElement.contains(element)
    );
    expect(specificMatriculados).toBeInTheDocument();
  });

  it("renderiza label `Seg.` dentro da seção `ALIMENTAÇÃO`", async () => {
    await awaitServices();
    const categoriaAlimentacaoUuid = "6a183159-32bb-4a3b-a69b-f0601ee677c1";
    const myElement = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoriaAlimentacaoUuid}`
    );
    const allMatriculados = screen.getAllByText("Seg.");
    const specificMatriculados = allMatriculados.find((element) =>
      myElement.contains(element)
    );
    expect(specificMatriculados).toBeInTheDocument();
  });

  it("ao clicar na tab `Semana 5`, exibe, nos dias 30 e 31, o número de matriculados 306", async () => {
    await awaitServices();
    const semana5Element = screen.getByText("Semana 5");
    fireEvent.click(semana5Element);
    const inputElementMatriculadosDia30 = screen.getByTestId(
      "matriculados__dia_30__categoria_1"
    );
    expect(inputElementMatriculadosDia30).toHaveAttribute("value", "306");
    const inputElementMatriculadosDia31 = screen.getByTestId(
      "matriculados__dia_31__categoria_1"
    );
    expect(inputElementMatriculadosDia31).toHaveAttribute("value", "306");
  });

  it("ao clicar na tab `Semana 5`, preencher matriculados e lanche do dia 30, exibe warning de suspensão", async () => {
    await awaitServices();
    const semana5Element = screen.getByText("Semana 5");
    fireEvent.click(semana5Element);

    const inputElementFrequenciaDia30 = screen.getByTestId(
      "frequencia__dia_30__categoria_1"
    );
    fireEvent.change(inputElementFrequenciaDia30, {
      target: { value: "10" },
    });

    const inputElementLancheDia30 = screen.getByTestId(
      "lanche__dia_30__categoria_1"
    );
    waitFor(() => {
      fireEvent.change(inputElementLancheDia30, {
        target: { value: "10" },
      });
    });

    expect(inputElementLancheDia30).toHaveClass("border-warning");
  });

  it("ao clicar na tab `Semana 5`, preencher matriculados e lanche do dia 31, NÃO exibe warning de suspensão", async () => {
    await awaitServices();
    const semana5Element = screen.getByText("Semana 5");
    fireEvent.click(semana5Element);

    const inputElementFrequenciaDia31 = screen.getByTestId(
      "frequencia__dia_31__categoria_1"
    );
    fireEvent.change(inputElementFrequenciaDia31, {
      target: { value: "10" },
    });

    const inputElementLancheDia31 = screen.getByTestId(
      "lanche__dia_31__categoria_1"
    );
    waitFor(() => {
      fireEvent.change(inputElementLancheDia31, {
        target: { value: "10" },
      });
    });

    expect(inputElementLancheDia31).not.toHaveClass("border-warning");
  });
});
