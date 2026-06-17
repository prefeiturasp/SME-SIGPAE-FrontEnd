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
import {
  mockLocationStateGrupoRecreioNasFerias,
  mockLocationStateGrupoColaboradores,
} from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/mockStateEMEFGrupoRecreio";
import {
  mockValoresMedicaoEMEF,
  mockValoresMedicaoColaboradoresEMEF,
} from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/valoresMedicaoEMEF";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockDiasLetivos } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/diasLetivosRecreio";
import { mockSalvaLancamentoSemana1 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/mockSalvaLancamentoEMEF";
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
  getLogDietasAutorizadasRecreioNasFerias,
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
import { mockLogQuantidadeDietasAutorizadasRecreio } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/RecreioNasFerias/EMEF/mockDietasEspeciais";
import { ORDEM_ALIMENTACAO_RECREIO } from "src/components/screens/LancamentoInicial/constants";

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
    expect(getLogDietasAutorizadasRecreioNasFerias).toHaveBeenCalled();
  });
};

const mockOrdenadoRecreio = {
  ...mockLocationStateGrupoRecreioNasFerias,
  tipos_alimentacao: [
    ...mockLocationStateGrupoRecreioNasFerias.tipos_alimentacao,
  ].sort(
    (a, b) =>
      (ORDEM_ALIMENTACAO_RECREIO[a.nome] ?? 999) -
      (ORDEM_ALIMENTACAO_RECREIO[b.nome] ?? 999),
  ),
};

const mockOrdenadoColaboradores = {
  ...mockLocationStateGrupoColaboradores,
  tipos_alimentacao: [
    ...mockLocationStateGrupoColaboradores.tipos_alimentacao,
  ].sort(
    (a, b) =>
      (ORDEM_ALIMENTACAO_RECREIO[a.nome] ?? 999) -
      (ORDEM_ALIMENTACAO_RECREIO[b.nome] ?? 999),
  ),
};

describe("Ordenação alimentações para o Grupo Recreio Nas Férias - EMEF", () => {
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
      data: mockValoresMedicaoEMEF,
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

    getLogDietasAutorizadasRecreioNasFerias.mockResolvedValue({
      data: mockLogQuantidadeDietasAutorizadasRecreio,
      status: 200,
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/", state: mockOrdenadoRecreio }]}
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

  it("deve exibir as alimentações na ordem definida para Recreio nas Férias", async () => {
    await awaitServices();

    fireEvent.click(screen.getByText("Semana 1"));

    const categoria = mockCategoriasMedicao.find(
      (c) => c.nome === "ALIMENTAÇÃO",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha b"),
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

    const categoria = mockCategoriasMedicao.find(
      (c) => c.nome === "DIETA ESPECIAL - TIPO A",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha b"),
    ).map((element) => element.textContent?.trim());

    expect(nomes.indexOf("Lanche")).toBeLessThan(nomes.indexOf("Lanche 4h"));
  });

  it("deve exibir as alimentações da DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS na ordem definida para Recreio nas Férias", async () => {
    await awaitServices();

    fireEvent.click(screen.getByText("Semana 1"));

    const categoria = mockCategoriasMedicao.find(
      (c) =>
        c.nome ===
        "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha b"),
    ).map((element) => element.textContent?.trim());

    expect(nomes.indexOf("Lanche")).toBeLessThan(nomes.indexOf("Refeição"));

    expect(nomes.indexOf("Refeição")).toBeLessThan(nomes.indexOf("Lanche 4h"));
  });

  it("deve exibir as alimentações da DIETA ESPECIAL - TIPO B na ordem definida para Recreio nas Férias", async () => {
    await awaitServices();

    fireEvent.click(screen.getByText("Semana 1"));

    const categoria = mockCategoriasMedicao.find(
      (c) => c.nome === "DIETA ESPECIAL - TIPO B",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha b"),
    ).map((element) => element.textContent?.trim());

    expect(nomes.indexOf("Lanche")).toBeLessThan(nomes.indexOf("Lanche 4h"));
  });
});

describe("Ordenação alimentações para o Grupo Colaboradores - EMEF", () => {
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

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/", state: mockOrdenadoColaboradores }]}
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

  it("deve exibir as alimentações na ordem definida para Recreio nas Férias", async () => {
    await awaitServices();

    fireEvent.click(screen.getByText("Semana 1"));
    const categoria = mockCategoriasMedicao.find(
      (c) => c.nome === "ALIMENTAÇÃO",
    );

    const blocoAlimentacao = screen.getByTestId(
      `div-lancamentos-por-categoria-${categoria.uuid}`,
    );

    const nomes = Array.from(
      blocoAlimentacao.querySelectorAll(".nome-linha b"),
    ).map((element) => element.textContent?.trim());

    expect(nomes.indexOf("Lanche")).toBeLessThan(
      nomes.indexOf("Refeição 1ª Oferta"),
    );

    expect(nomes.indexOf("Refeição 1ª Oferta")).toBeLessThan(
      nomes.indexOf("Repetição Refeição"),
    );

    expect(nomes.indexOf("Repetição Refeição")).toBeLessThan(
      nomes.indexOf("Lanche 4h"),
    );
  });
});
