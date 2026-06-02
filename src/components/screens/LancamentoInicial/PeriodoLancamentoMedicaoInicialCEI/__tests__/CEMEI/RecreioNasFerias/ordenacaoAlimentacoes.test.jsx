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
import {
  mockLocationStateGrupoEmeiDaCEMEI,
  mockLocationStateGrupoColaboradoresCEMEI,
} from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockStateRecreio";
import { getMeusDados } from "src/services/perfil.service";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEMEI";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockDiasLetivosRecreio } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/diasLetivosRecreio";
import {
  mockValoresMedicaoEmeiDaCEMEI,
  mockValoresMedicaoCEMEIColaboradores,
} from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockValoresMedicao";
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
import { ORDEM_ALIMENTACAO_RECREIO } from "src/components/screens/LancamentoInicial/constants";

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

const mockOrdenadoRecreio = {
  ...mockLocationStateGrupoEmeiDaCEMEI,
  tiposAlimentacao: [
    ...mockLocationStateGrupoEmeiDaCEMEI.tiposAlimentacao,
  ].sort(
    (a, b) =>
      (ORDEM_ALIMENTACAO_RECREIO[a.nome] ?? 999) -
      (ORDEM_ALIMENTACAO_RECREIO[b.nome] ?? 999),
  ),
};

const mockOrdenadoColaboradores = {
  ...mockLocationStateGrupoColaboradoresCEMEI,
  tiposAlimentacao: [
    ...mockLocationStateGrupoColaboradoresCEMEI.tiposAlimentacao,
  ].sort(
    (a, b) =>
      (ORDEM_ALIMENTACAO_RECREIO[a.nome] ?? 999) -
      (ORDEM_ALIMENTACAO_RECREIO[b.nome] ?? 999),
  ),
};

describe("Ordenação alimentações para o para o Grupo Recreio nas Férias - de 4 a 14 anos - CEMEI", () => {
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
          initialEntries={[{ pathname: "/", state: mockOrdenadoRecreio }]}
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

  it("deve exibir as alimentações na ordem definida para Recreio nas Férias", async () => {
    await awaitServices();

    fireEvent.click(screen.getByText("Semana 1"));

    const categoria = mockCategoriasMedicaoCEI.find(
      (c) => c.nome === "ALIMENTAÇÃO",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha-cei"),
    ).map((element) => element.textContent?.trim());

    expect(nomes.indexOf("Lanche")).toBeLessThan(
      nomes.indexOf("Refeição 1ª Oferta"),
    );

    expect(nomes.indexOf("Refeição 1ª Oferta")).toBeLessThan(
      nomes.indexOf("Repetição Refeição"),
    );

    expect(nomes.indexOf("Repetição Refeição")).toBeLessThan(
      nomes.indexOf("Sobremesa 1º Oferta"),
    );

    expect(nomes.indexOf("Sobremesa 1º Oferta")).toBeLessThan(
      nomes.indexOf("Repetição Sobremesa"),
    );

    expect(nomes.indexOf("Repetição Sobremesa")).toBeLessThan(
      nomes.indexOf("Lanche 4h"),
    );
  });
  it("deve exibir as alimentações da DIETA ESPECIAL - TIPO A na ordem definida para Recreio nas Férias", async () => {
    await awaitServices();

    fireEvent.click(screen.getByText("Semana 1"));

    const categoria = mockCategoriasMedicaoCEI.find(
      (c) => c.nome === "DIETA ESPECIAL - TIPO A",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha-cei"),
    ).map((element) => element.textContent?.trim());

    expect(nomes.indexOf("Lanche")).toBeLessThan(nomes.indexOf("Lanche 4h"));
  });

  it("deve exibir as alimentações da DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS na ordem definida para Recreio nas Férias", async () => {
    await awaitServices();

    fireEvent.click(screen.getByText("Semana 1"));

    const categoria = mockCategoriasMedicaoCEI.find(
      (c) =>
        c.nome ===
        "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha-cei"),
    ).map((element) => element.textContent?.trim());

    expect(nomes.indexOf("Lanche")).toBeLessThan(nomes.indexOf("Refeição"));

    expect(nomes.indexOf("Refeição")).toBeLessThan(nomes.indexOf("Lanche 4h"));
  });

  it("deve exibir as alimentações da DIETA ESPECIAL - TIPO B na ordem definida para Recreio nas Férias", async () => {
    await awaitServices();

    fireEvent.click(screen.getByText("Semana 1"));

    const categoria = mockCategoriasMedicaoCEI.find(
      (c) => c.nome === "DIETA ESPECIAL - TIPO B",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha-cei"),
    ).map((element) => element.textContent?.trim());

    expect(nomes.indexOf("Lanche")).toBeLessThan(nomes.indexOf("Lanche 4h"));
  });
});

describe("Ordenação alimentações para o Grupo Colaboradores - CEMEI", () => {
  beforeEach(async () => {
    getMeusDados.mockResolvedValue({
      data: mockMeusDadosEscolaCEMEI,
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
      data: mockValoresMedicaoCEMEIColaboradores,
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
      data: { results: ["01", "25"] },
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("eh_cemei", "true");
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/", state: mockOrdenadoColaboradores }]}
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
  it("deve exibir as alimentações na ordem definida para Recreio nas Férias", async () => {
    await awaitServices();

    fireEvent.click(screen.getByText("Semana 1"));
    const categoria = mockCategoriasMedicaoCEI.find(
      (c) => c.nome === "ALIMENTAÇÃO",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha-cei"),
    ).map((element) => element.textContent?.trim());

    expect(nomes.indexOf("Lanche")).toBeLessThan(
      nomes.indexOf("Refeição 1ª Oferta"),
    );

    expect(nomes.indexOf("Refeição 1ª Oferta")).toBeLessThan(
      nomes.indexOf("Repetição Refeição"),
    );

    expect(nomes.indexOf("Repetição Refeição")).toBeLessThan(
      nomes.indexOf("Sobremesa 1º Oferta"),
    );

    expect(nomes.indexOf("Sobremesa 1º Oferta")).toBeLessThan(
      nomes.indexOf("Repetição Sobremesa"),
    );

    expect(nomes.indexOf("Repetição Sobremesa")).toBeLessThan(
      nomes.indexOf("Lanche 4h"),
    );
  });
});
