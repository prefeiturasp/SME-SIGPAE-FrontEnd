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
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetTiposUnidadeEscolar } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { mockGetPeriodoEscolar } from "src/mocks/services/dietaEspecial.service/mockGetPeriodoEscolar";
import { mockGetSolicitacoesRelatorioHistoricoDietas } from "src/mocks/services/dietaEspecial.service/mockGetSolicitacoesRelatorioHistoricoDietas";
import { mockGetTipoGestao } from "src/mocks/services/dietaEspecial.service/mockGetTipoGestao";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";
import RelatorioHistoricoDietasPage from "src/pages/DietaEspecial/RelatorioHistoricoDietasPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Teste - Relatório Histórico de Dietas Especiais - Exportar PDF", () => {
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
    mock
      .onPost(
        "/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/exportar-pdf/",
      )
      .reply(200, {
        detail: "Solicitação de geração de arquivo recebida com sucesso.",
      });

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

  it("renderiza título `Relatório de Histórico de Dietas` e exporta pdf", async () => {
    getMocksGetDietasEspeciais();
    await setFiltrosEClicaEmFiltrar();
    await waitFor(() => {
      expect(
        screen.getByText(
          "Resultado da pesquisa - TOTAL DE DIETAS AUTORIZADAS EM 12/02/2024: 27",
        ),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Exportar PDF"));
    const botaoExportarPDF = screen.getByText("Exportar PDF").closest("button");
    await act(async () => {
      fireEvent.click(botaoExportarPDF);
    });

    expect(
      screen.getByText("Geração solicitada com sucesso."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Como este arquivo poderá ser muito grande, acompanhe o seu processamento na Central de Downloads.",
      ),
    ).toBeInTheDocument();
  });
});
