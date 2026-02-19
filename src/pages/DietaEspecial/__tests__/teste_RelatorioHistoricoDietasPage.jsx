import "@testing-library/jest-dom";
import {
  act,
  findByText,
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetHistoricoDietasEMEBSeCEUGESTAO } from "src/mocks/services/dietaEspecial.service/mockGetHistoricoDietasEMEBSeCEUGESTAO";
import { mockGetSolicitacoesHistoricoDietasCEMEI } from "src/mocks/services/dietaEspecial.service/mockGetSolicitacoesHistoricoDietasCEMEI";
import { mockGetSolicitacoesHistoricoDietasEMEF } from "src/mocks/services/dietaEspecial.service/mockGetSolicitacoesHistoricoDietasEMEF";
import { mockGetTipoGestao } from "src/mocks/services/dietaEspecial.service/mockGetTipoGestao";
import { mockGetTiposUnidadeEscolar } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetPeriodoEscolar } from "src/mocks/services/dietaEspecial.service/mockGetPeriodoEscolar";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";
import { mockGetSolicitacoesRelatorioHistoricoDietas } from "src/mocks/services/dietaEspecial.service/mockGetSolicitacoesRelatorioHistoricoDietas";
import RelatorioHistoricoDietasPage from "src/pages/DietaEspecial/RelatorioHistoricoDietasPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Teste - Relatório Histórico de Dietas Especiais", () => {
  const getMocksGetDietasEspeciais = (
    segundaRequisicao = mockGetSolicitacoesRelatorioHistoricoDietas,
  ) => {
    let callCount = 0;

    mock
      .onPost(
        "/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/",
      )
      .reply(() => {
        callCount++;

        switch (callCount) {
          case 1:
            return [200, mockGetSolicitacoesRelatorioHistoricoDietas];
          case 2:
            return [200, segundaRequisicao];
        }
      });
  };

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
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);

    mock.onGet("/tipos-gestao/").reply(200, mockGetTipoGestao);
    mock
      .onGet("/tipos-unidade-escolar/")
      .reply(200, mockGetTiposUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock.onGet("/periodos-escolares/").reply(200, mockGetPeriodoEscolar);
    mock.onGet("/classificacoes-dieta/").reply(200, mockGetClassificacaoDieta);
    mock
      .onPost("/escolas-simplissima-com-eol/escolas-com-cod-eol/")
      .reply(200, mockGetUnidadeEducacional);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioHistoricoDietasPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  const setDRELote = async () => {
    const selectDRELOTE = screen.getByTestId("select-dre-lote");
    const selectElement = selectDRELOTE.querySelector("select");
    const uuidLote = mockLotesSimples.results[0].uuid;
    fireEvent.change(selectElement, {
      target: { value: uuidLote },
    });
  };

  const keyDownEvent = {
    key: "ArrowDown",
  };

  const selectOptionUE = async (container, optionText) => {
    const placeholder = getByText(
      container,
      "Selecione as Unidades Educacionais",
    );
    fireEvent.keyDown(placeholder, keyDownEvent);
    await findByText(container, optionText);
    fireEvent.click(getByText(container, optionText));
  };

  const setFiltrosEClicaEmFiltrar = async () => {
    await setDRELote();
    await selectOptionUE(
      screen.getByTestId("select-unidades-educacionais"),
      "000566 - EMEF TERESA MARGARIDA DA SILVA E ORTA",
    );

    const divInputAlterarDia = screen.getByTestId("div-input-data");
    const inputElement = divInputAlterarDia.querySelector("input");
    fireEvent.change(inputElement, {
      target: { value: "30/01/2025" },
    });

    const botaoFiltrar = screen.getByTestId("botao-filtrar");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });
  };

  it("deve renderizar o componente corretamente", async () => {
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();
  });

  it("renderiza título `Relatório de Histórico de Dietas`", async () => {
    getMocksGetDietasEspeciais();
    await setFiltrosEClicaEmFiltrar();
    await waitFor(() => {
      expect(
        screen.getByText(
          "Resultado da pesquisa - TOTAL DE DIETAS AUTORIZADAS EM 12/02/2024: 27",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Verifica se o botão para abrir o collaps está funcional", async () => {
    getMocksGetDietasEspeciais();
    await setFiltrosEClicaEmFiltrar();
    const angleDownIcon = document.querySelectorAll(".fa-angle-down");

    const escolaCei = angleDownIcon[3];
    fireEvent.click(escolaCei);
    expect(
      screen.getByText("Faixas Etárias com Dietas Autorizadas"),
    ).toBeInTheDocument();
    expect(screen.getByText("Período INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("07 a 11 meses")).toBeInTheDocument();
    expect(screen.getByText("01 ano a 03 anos e 11 meses")).toBeInTheDocument();

    const escolaCeuCemei = angleDownIcon[7];
    fireEvent.click(escolaCeuCemei);
    expect(
      screen.getByText("Dietas Autorizadas nas Turmas do Infantil"),
    ).toBeInTheDocument();
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    const escolaEmef = angleDownIcon[9];
    fireEvent.click(escolaEmef);
    expect(screen.getByText("MANHA")).toBeInTheDocument();
  });

  it("Testa Collapse EMEBS e CEU GESTAO", async () => {
    getMocksGetDietasEspeciais(mockGetHistoricoDietasEMEBSeCEUGESTAO);
    await setFiltrosEClicaEmFiltrar();

    const paginaDois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2",
    );
    fireEvent.click(paginaDois);

    await waitFor(() => {
      expect(
        screen.getAllByText("EMEBS NEUSA BASSETTO, PROFA.").length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(
          "CEU GESTAO MENINOS - ARTUR ALBERTO DE MOTA GONCALVES, PROF. PR.",
        ).length,
      ).toBeGreaterThan(0);
    });

    const angleDownIcon = document.querySelector(".fa-angle-down");
    fireEvent.click(angleDownIcon);
    expect(
      screen.getByText("Alunos do Infantil (4 a 6 anos)"),
    ).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();

    expect(
      screen.getByText("Alunos do Fundamental (acima de 6 anos)"),
    ).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();
  });

  it("Verifica mudança de página e Collapse CEMEI", async () => {
    getMocksGetDietasEspeciais(mockGetSolicitacoesHistoricoDietasCEMEI);
    await setFiltrosEClicaEmFiltrar();

    const paginaDois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2",
    );
    fireEvent.click(paginaDois);

    await waitFor(() => {
      expect(
        screen.getAllByText("CEMEI MARCIA KUMBREVICIUS DE MOURA").length,
      ).toBeGreaterThan(0);
    });

    const angleDownIcon = document.querySelector(".fa-angle-down");
    fireEvent.click(angleDownIcon);
    expect(
      screen.getByText("Faixas Etárias com Dietas Autorizadas"),
    ).toBeInTheDocument();
    expect(screen.getByText("Período INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("01 a 03 meses")).toBeInTheDocument();

    expect(
      screen.getByText("Dietas Autorizadas nas Turmas do Infantil"),
    ).toBeInTheDocument();
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();
  });

  it("Verifica mudança de página e Collapse EMEI/EMEF", async () => {
    getMocksGetDietasEspeciais(mockGetSolicitacoesHistoricoDietasEMEF);
    await setFiltrosEClicaEmFiltrar();

    const pagina_dois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2",
    );
    fireEvent.click(pagina_dois);

    await waitFor(() => {
      expect(
        screen.getAllByText("EMEF PERICLES EUGENIO DA SILVA RAMOS").length,
      ).toBeGreaterThan(0);
    });

    const angleDownIcon = document.querySelector(".fa-angle-down");
    fireEvent.click(angleDownIcon);
    expect(screen.getByText("TARDE")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();
  });
});
