import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "constants/shared";
import { APIMockVersion } from "mocks/apiVersionMock";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import { mockGetHistoricoDietasEMEBSeCEUGESTAO } from "mocks/services/dietaEspecial.service/mockGetHistoricoDietasEMEBSeCEUGESTAO";
import { mockGetSolicitacoesHistoricoDietasCEMEI } from "mocks/services/dietaEspecial.service/mockGetSolicitacoesHistoricoDietasCEMEI";
import { mockGetSolicitacoesHistoricoDietasEMEF } from "mocks/services/dietaEspecial.service/mockGetSolicitacoesHistoricoDietasEMEF";
import { mockGetSolicitacoesRelatorioHistoricoDietas } from "mocks/services/dietaEspecial.service/mockGetSolicitacoesRelatorioHistoricoDietas";
import RelatorioHistoricoDietasPage from "pages/DietaEspecial/RelatorioHistoricoDietasPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

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
      .replyOnce(200, mockGetSolicitacoesRelatorioHistoricoDietas);

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

  it("Verifica mudança de página e Collapse CEMEI", async () => {
    mock
      .onGet("/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/")
      .replyOnce(200, mockGetSolicitacoesHistoricoDietasCEMEI);

    const paginaDois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2"
    );
    fireEvent.click(paginaDois);

    await waitFor(() => {
      expect(
        screen.getAllByText("CEMEI MARCIA KUMBREVICIUS DE MOURA").length
      ).toBeGreaterThan(0);
    });

    const angleDownIcon = document.querySelector(".fa-angle-down");
    fireEvent.click(angleDownIcon);

    expect(
      screen.getByText("Dietas Autorizadas nas Turmas do Infantil")
    ).toBeInTheDocument();
  });

  it("Testa Collapse EMEBS e CEU GESTAO", async () => {
    mock
      .onGet("/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/")
      .replyOnce(200, mockGetHistoricoDietasEMEBSeCEUGESTAO);

    const paginaTres = document.querySelector(
      ".ant-pagination .ant-pagination-item-3"
    );
    fireEvent.click(paginaTres);

    await waitFor(() => {
      expect(
        screen.getAllByText(
          "CEU GESTAO MENINOS - ARTUR ALBERTO DE MOTA GONCALVES, PROF. PR."
        ).length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText("EMEBS VERA LUCIA APARECIDA RIBEIRO, PROFA.").length
      ).toBeGreaterThan(0);
    });

    const angleDownIcon = document.querySelector(".fa-angle-down");
    fireEvent.click(angleDownIcon);

    expect(
      screen.getByText("Alunos do Infantil (4 a 6 anos)")
    ).toBeInTheDocument();
  });

  it("Verifica mudança de página e Collapse EMEI/EMEF", async () => {
    mock
      .onGet("/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/")
      .replyOnce(200, mockGetSolicitacoesHistoricoDietasEMEF);

    const paginaQuatro = document.querySelector(
      ".ant-pagination .ant-pagination-item-4"
    );
    fireEvent.click(paginaQuatro);

    await waitFor(() => {
      expect(
        screen.getAllByText("EMEF PERICLES EUGENIO DA SILVA RAMOS").length
      ).toBeGreaterThan(0);
    });

    const angleDownIcon = document.querySelector(".fa-angle-down");
    fireEvent.click(angleDownIcon);
  });
});
