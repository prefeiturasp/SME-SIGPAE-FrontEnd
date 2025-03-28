import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { debug } from "jest-preview";
import { localStorageMock } from "mocks/localStorageMock";
import { APIMockVersion } from "mocks/apiVersionMock";
import { PERFIL, TIPO_PERFIL } from "constants/shared";
import RelatorioHistoricoDietasPage from "pages/DietaEspecial/RelatorioHistoricoDietasPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";
import { mockGetSolicitacoesRelatorioHistoricoDietas } from "mocks/services/dietaEspecial.service/mockGetSolicitacoesRelatorioHistoricoDietas";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";

describe("Teste - Relatório Histórico de Dietas Especiais", () => {
  beforeEach(async () => {
    mock.onGet("/api-version/").reply(200, APIMockVersion);
    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock.onGet("/notificacoes/quantidade-nao-lidos/").reply(200, {
      quantidade_nao_lidos: 0,
    });
    mock.onGet("/downloads/quantidade-nao-vistos/").reply(200, {
      quantidade_nao_vistos: 136,
    });
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);

    mock
      .onGet("/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/")
      .reply(200, mockGetSolicitacoesRelatorioHistoricoDietas);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatorioHistoricoDietasPage />
        </MemoryRouter>
      );
    });
  });

  it("renderiza título `Relatório de Histórico de Dietas`", async () => {
    debug();
    expect(
      screen.getByText(
        "Resultado da pesquisa - TOTAL DE DIETAS AUTORIZADAS EM 24/08/2023: 198"
      )
    ).toBeInTheDocument();
  });

  it("Verifica se o botão para abrir o collaps está funcional", async () => {
    const angleDownIcon = document.querySelector(".fa-angle-down");

    fireEvent.click(angleDownIcon);

    expect(
      screen.getByText("Faixas Etárias com Dietas Autorizadas")
    ).toBeInTheDocument();
    expect(screen.getByText("Período INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("Período PARCIAL")).toBeInTheDocument();
  });
});
