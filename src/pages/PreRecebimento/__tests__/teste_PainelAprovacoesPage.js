import React from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "services/_mock";
import { MemoryRouter } from "react-router-dom";
import PainelAprovacoesPage from "pages/PreRecebimento/PainelAprovacoesPage";
import { MeusDadosContext } from "context/MeusDadosContext";

import { getNotificacoes, getQtdNaoLidas } from "services/notificacoes.service";

import { mockGetNotificacoes } from "mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { mockGetDashboardSolicitacoesAlteracao } from "mocks/services/cronograma.service/mockGetDashboardSolicitacoesAlteracao";
import { mockGetDashboardSolicitacoesAlteracaoComFiltros } from "mocks/services/cronograma.service/mockGetDashboardSolicitacoesAlteracaoComFiltros";
import { mockGetDashboardCronograma } from "mocks/services/cronograma.service/mockGetDashboardCronograma";
import { mockGetDashboardCronogramaComFiltros } from "mocks/services/cronograma.service/mockGetDashboardCronogramaComFiltros";
import { mockMeusDadosDilogAbastecimento } from "mocks/meusDados/dilog-abastecimento";

import { PERFIL, TIPO_PERFIL } from "constants/shared";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/notificacoes.service");

describe("Teste <SolicitacoesAlimentacao> (RelatorioSolicitacoesAlimentacao)", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_ABASTECIMENTO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });

    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    mock
      .onGet(`/cronogramas/dashboard/`)
      .reply(200, mockGetDashboardCronograma);
    mock
      .onGet(`/cronogramas/dashboard-com-filtro/`)
      .reply(200, mockGetDashboardCronogramaComFiltros);
    mock
      .onGet(`/solicitacao-de-alteracao-de-cronograma/dashboard/`)
      .reply(200, mockGetDashboardSolicitacoesAlteracao);
    mock
      .onGet(`/solicitacao-de-alteracao-de-cronograma/dashboard-com-filtro/`)
      .reply(200, mockGetDashboardSolicitacoesAlteracaoComFiltros);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosDilogAbastecimento,
              setMeusDados: jest.fn(),
            }}
          >
            <PainelAprovacoesPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Testa a renderização dos elementos básicos do Painel", async () => {
    expect(screen.getByText("Programação de Cronogramas")).toBeInTheDocument();

    // Verifica se os cards corretos estão sendo carregados
    expect(screen.getByText("Pendentes de Assinatura")).toBeInTheDocument();
    expect(
      screen.getByText("Aguardando Assinatura de DILOG")
    ).toBeInTheDocument();
    expect(screen.getByText("Cronogramas Assinados")).toBeInTheDocument();
    expect(screen.getByText("Solicitações de Alterações")).toBeInTheDocument();
    expect(screen.getByText("Alterações Aprovadas")).toBeInTheDocument();
    expect(screen.getByText("Alterações Reprovadas")).toBeInTheDocument();
    expect(screen.getByText("Alterações CODAE")).toBeInTheDocument();
  });

  it("Testa os filtros da página", async () => {
    const inputFiltro = screen.getByPlaceholderText("Nome do Fornecedor");
    fireEvent.change(inputFiltro, {
      target: { value: "Empresa" },
    });

    const inputFiltro2 = screen.getByPlaceholderText("Nome do Produto");
    fireEvent.change(inputFiltro2, {
      target: { value: "arroz" },
    });

    expect(screen.queryByText("JP Alimentos")).not.toBeInTheDocument();
    expect(screen.queryByText("BANANA")).not.toBeInTheDocument();
  });
});
