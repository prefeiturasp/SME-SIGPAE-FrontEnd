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
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockRelatorioRecreioNasFerias } from "src/mocks/services/dietaEspecial.service/relatorioRecreioNasFerias";
import { RelatorioRecreioFeriasPage } from "src/pages/DietaEspecial/RelatorioRecreioFeriasPage";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";
import { alergiasIntolerantes } from "src/components/screens/DietaEspecial/Relatorio/dados";
import mock from "src/services/_mock";

describe("Teste Relatório Recreio Férias - Usuário CODAE", () => {
  const _DRE = "775d49c5-9a84-4d5b-93e4-aa9d3a5f4459";
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
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
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
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

  const setDre = (valor) => {
    const campoDre = screen.getByTestId("select-dre-lote");
    const select = campoDre.querySelector("select");
    fireEvent.change(select, {
      target: { value: valor },
    });
  };

  const filtrar = () => {
    const botaoFiltrar = screen.getByText("Filtrar");
    expect(botaoFiltrar).toBeInTheDocument();
    fireEvent.click(botaoFiltrar);
  };

  it("Seleciona DRE, chama o filtro e verifica exibição de tabela", async () => {
    await act(async () => {
      setDre(_DRE);
    });

    await act(async () => {
      filtrar();
    });

    await waitFor(() => {
      expect(screen.getByText("0000001 - FULANO 01")).toBeInTheDocument();
      expect(screen.getByText("0000010 - FULANO 10")).toBeInTheDocument();
    });
  });

  it("Clica no collapse e gera protocolo", async () => {
    await act(async () => {
      setDre(_DRE);
    });

    await act(async () => {
      filtrar();
    });

    const elementICollapsed0 = screen.getByTestId("i-collapsed-0");
    fireEvent.click(elementICollapsed0);
    await waitFor(() => {
      expect(screen.getByText("ALERGIA A OVO")).toBeInTheDocument();
    });

    mock
      .onGet(
        `/solicitacoes-dieta-especial/${mockRelatorioRecreioNasFerias.results[0].uuid}/protocolo/`
      )
      .reply(200, new Blob(["conteúdo do PDF"], { type: "application/pdf" }));

    await act(async () => {
      const botaoGerarProtocolo = screen.getByTestId("botao-gerar-protocolo-0");
      fireEvent.click(botaoGerarProtocolo);
    });
  });

  it("Clica botão de baixar PDF e recebe confirmação", async () => {
    await act(async () => {
      setDre(_DRE);
    });

    await act(async () => {
      filtrar();
    });

    mock
      .onGet(
        "/solicitacoes-dieta-especial/relatorio-recreio-nas-ferias/exportar-pdf/"
      )
      .reply(200, {
        detail: "Solicitação de geração de arquivo recebida com sucesso.",
      });

    const botao = screen.getByTestId("botao-gerar-pdf");
    expect(botao).toBeInTheDocument();
    await act(async () => fireEvent.click(botao));

    await waitFor(() => {
      expect(
        screen.getByText("Geração solicitada com sucesso.")
      ).toBeInTheDocument();
    });
  });
});
