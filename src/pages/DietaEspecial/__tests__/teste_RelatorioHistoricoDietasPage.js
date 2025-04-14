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
import { mockGetTipoGestao } from "mocks/services/dietaEspecial.service/mockGetTipoGestao";
import { mockGetTiposUnidadeEscolar } from "mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockLotesSimples } from "mocks/lote.service/mockLotesSimples";
import { mockGetPeriodoEscolar } from "mocks/services/dietaEspecial.service/mockGetPeriodoEscolar.js";
import { mockGetClassificacaoDieta } from "mocks/services/dietaEspecial.service/mockGetClassificacoesDietas.js";
import { mockGetUnidadeEducacional } from "mocks/services/dietaEspecial.service/mockGetUnidadeEducacional.js";
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

    mock.onGet("/tipos-gestao/").reply(200, mockGetTipoGestao);
    mock
      .onGet("/tipos-unidade-escolar/")
      .reply(200, mockGetTiposUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock.onGet("/periodos-escolares/").reply(200, mockGetPeriodoEscolar);
    mock.onGet("/classificacoes-dieta/").reply(200, mockGetClassificacaoDieta);
    mock
      .onGet("escolas-simplissima-com-eol/escolas-com-cod-eol/")
      .reply(200, mockGetUnidadeEducacional);
    mock
      .onGet("/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/")
      .replyOnce(200, mockGetSolicitacoesRelatorioHistoricoDietas); //esse

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

  it("deve renderizar o componente corretamente", async () => {
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();
  });

  it("renderiza título `Relatório de Histórico de Dietas`", async () => {
    expect(
      screen.getByText(
        "Resultado da pesquisa - TOTAL DE DIETAS AUTORIZADAS EM 12/02/2024: 27"
      )
    ).toBeInTheDocument();
  });

  it("Verifica se o botão para abrir o collaps está funcional", async () => {
    const angleDownIcon = document.querySelectorAll(".fa-angle-down");

    const escolaCei = angleDownIcon[3];
    fireEvent.click(escolaCei);
    expect(
      screen.getByText("Faixas Etárias com Dietas Autorizadas")
    ).toBeInTheDocument();
    expect(screen.getByText("Período INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("07 a 11 meses")).toBeInTheDocument();
    expect(screen.getByText("01 ano a 03 anos e 11 meses")).toBeInTheDocument();

    const escolaCeuCemei = angleDownIcon[7];
    fireEvent.click(escolaCeuCemei);
    expect(
      screen.getByText("Dietas Autorizadas nas Turmas do Infantil")
    ).toBeInTheDocument();
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    const escolaEmef = angleDownIcon[9];
    fireEvent.click(escolaEmef);
    expect(screen.getByText("MANHA")).toBeInTheDocument();
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
      screen.getByText("Faixas Etárias com Dietas Autorizadas")
    ).toBeInTheDocument();
    expect(screen.getByText("Período INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("01 a 03 meses")).toBeInTheDocument();

    expect(
      screen.getByText("Dietas Autorizadas nas Turmas do Infantil")
    ).toBeInTheDocument();
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();
  });

  it("Testa Collapse EMEBS e CEU GESTAO", async () => {
    mock
      .onGet("/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/")
      .replyOnce(200, mockGetHistoricoDietasEMEBSeCEUGESTAO);

    const paginaDois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2"
    );
    fireEvent.click(paginaDois);

    await waitFor(() => {
      expect(
        screen.getAllByText("EMEBS NEUSA BASSETTO, PROFA.").length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(
          "CEU GESTAO MENINOS - ARTUR ALBERTO DE MOTA GONCALVES, PROF. PR."
        ).length
      ).toBeGreaterThan(0);
    });

    const angleDownIcon = document.querySelector(".fa-angle-down");
    fireEvent.click(angleDownIcon);
    expect(
      screen.getByText("Alunos do Infantil (4 a 6 anos)")
    ).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();

    expect(
      screen.getByText("Alunos do Fundamental (acima de 6 anos)")
    ).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();
  });

  it("Verifica mudança de página e Collapse EMEI/EMEF", async () => {
    mock
      .onGet("/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/")
      .replyOnce(200, mockGetSolicitacoesHistoricoDietasEMEF);

    const pagina_dois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2"
    );
    fireEvent.click(pagina_dois);

    await waitFor(() => {
      expect(
        screen.getAllByText("EMEF PERICLES EUGENIO DA SILVA RAMOS").length
      ).toBeGreaterThan(0);
    });

    const angleDownIcon = document.querySelector(".fa-angle-down");
    fireEvent.click(angleDownIcon);
    expect(screen.getByText("TARDE")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();
  });
});
