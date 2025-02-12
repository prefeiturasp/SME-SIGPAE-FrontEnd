import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { mockVinculosTipoAlimentacaoEPeriodoEscolar } from "mocks/InclusaoAlimentacao/mockVinculosTipoAlimentacaoEPeriodoescolar";
import { mockCategoriasMedicaoEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicaoEMEF";
import { mockDiasCalendarioEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/diasCalendarioEMEF";
import { mockFeriadosNoMesEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/feriadosNoMesEMEF";
import { mockLogQuantidadeDietasAutorizadas } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/logQuantidadeDietasAutorizadasEMEF";
import { mockMatriculadosNoMesEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/matriculadosNoMesEMEF";
import { mockLocationStateEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/mockStateEMEF";
import { mockPermissoesLancamentosEspeciaisMesAnoPorPeriodoEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/permissoesLancamentosEspeciaisMesAnoPorPeriodoEMEF";
import { mockSuspensoesAutorizadasEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/suspensoesAutorizadasEMEF";
import { mockValoresMedicaoEMEF } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/valoresMedicaoEMEF";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { getVinculosTipoAlimentacaoPorEscola } from "services/cadastroTipoAlimentacao.service";
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
} from "services/medicaoInicial/periodoLancamentoMedicao.service";
import { getPermissoesLancamentosEspeciaisMesAnoPorPeriodo } from "services/medicaoInicial/permissaoLancamentosEspeciais.service";
import * as perfilService from "services/perfil.service";
import PeriodoLancamentoMedicaoInicial from "..";

jest.mock("services/perfil.service.js");
jest.mock("services/medicaoInicial/diaSobremesaDoce.service.js");
jest.mock("services/cadastroTipoAlimentacao.service");
jest.mock("services/medicaoInicial/periodoLancamentoMedicao.service");
jest.mock("services/medicaoInicial/permissaoLancamentosEspeciais.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(perfilService.meusDados).toHaveBeenCalled();
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
    perfilService.meusDados.mockResolvedValue(mockMeusDadosEscolaEMEFPericles);
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
      data: mockCategoriasMedicaoEMEF,
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
      data: mockMatriculadosNoMesEMEF,
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
      data: mockDiasCalendarioEMEF,
      status: 200,
    });
    getFeriadosNoMes.mockResolvedValue({
      data: mockFeriadosNoMesEMEF,
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

  it("teste mock meusDados", async () => {
    jest.useFakeTimers();
    await act(() => {
      jest.advanceTimersByTime(1);
    });

    await waitFor(() => expect(perfilService.meusDados).toHaveBeenCalled());

    expect(perfilService.meusDados).toHaveBeenCalledTimes(1);
    expect(perfilService.meusDados).toHaveReturnedWith(
      Promise.resolve(mockMeusDadosEscolaEMEFPericles)
    );

    const dados = await perfilService.meusDados();
    expect(dados.vinculo_atual).toBeDefined();
    expect(dados.vinculo_atual.instituicao).toBeDefined();
    expect(dados.vinculo_atual.instituicao.nome).toBe(
      "EMEF PERICLES EUGENIO DA SILVA RAMOS"
    );
    jest.useRealTimers();
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
});
