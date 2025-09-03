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
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockRelatorioRecreioNasFerias } from "src/mocks/services/dietaEspecial.service/relatorioRecreioNasFerias";
import { RelatorioRecreioFeriasPage } from "src/pages/DietaEspecial/RelatorioRecreioFeriasPage";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";
import { alergiasIntolerantes } from "src/components/screens/DietaEspecial/Relatorio/dados";
import mock from "src/services/_mock";

describe("Teste Relatório Recreio Férias - Usuário Escola CEMEI", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onGet("/solicitacoes-dieta-especial/relatorio-recreio-nas-ferias/")
      .reply(200, mockRelatorioRecreioNasFerias);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock.onGet("/classificacoes-dieta/").reply(200, mockGetClassificacaoDieta);
    mock.onGet("/alergias-intolerancias/").reply(200, alergiasIntolerantes());
    mock
      .onPost("/escolas-simplissima-com-eol/escolas-com-cod-eol/")
      .reply(200, mockGetUnidadeEducacional);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

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
              meusDados: mockMeusDadosEscolaCEMEI,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioRecreioFeriasPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título e breadcrumb `Relatório de Dietas para Recreio nas Férias`", () => {
    expect(
      screen.queryAllByText("Relatório de Dietas para Recreio nas Férias")
    ).toHaveLength(2);
  });

  it("Renderiza componente de filtros", () => {
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();
    expect(screen.getByText("DRE / Lote")).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  it("Clica botão de baixar Excel e recebe confirmação", async () => {
    await act(async () => {
      const campoDre = screen.getByTestId("select-dre-lote");
      const select = campoDre.querySelector("select");
      fireEvent.change(select, {
        target: { value: "775d49c5-9a84-4d5b-93e4-aa9d3a5f4459" },
      });
    });

    await act(async () => {
      const botaoFiltrar = screen.getByText("Filtrar");
      expect(botaoFiltrar).toBeInTheDocument();
      fireEvent.click(botaoFiltrar);
    });

    mock
      .onGet(
        "/solicitacoes-dieta-especial/relatorio-recreio-nas-ferias/exportar-excel/"
      )
      .reply(200, {
        detail: "Solicitação de geração de arquivo recebida com sucesso.",
      });

    const botao = screen.getByTestId("botao-gerar-excel");
    expect(botao).toBeInTheDocument();
    await act(async () => fireEvent.click(botao));

    await waitFor(() => {
      expect(
        screen.getByText("Geração solicitada com sucesso.")
      ).toBeInTheDocument();
    });
  });
});
