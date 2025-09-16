import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { RelatorioRecreioFeriasPage } from "src/pages/DietaEspecial/RelatorioRecreioFeriasPage";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { alergiasIntolerantes } from "src/components/screens/DietaEspecial/Relatorio/dados";
import { mockRelatorioRecreioNasFerias } from "src/mocks/services/dietaEspecial.service/relatorioRecreioNasFerias";
import { ToastContainer } from "react-toastify";

describe("Verifica comportamento da interface ao receber retorno de erro na exportação de relatório - PDF", () => {
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
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
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

  it("Clica botão de baixar PDF e recebe erro", async () => {
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
        "/solicitacoes-dieta-especial/relatorio-recreio-nas-ferias/exportar-pdf/"
      )
      .reply(400, {});

    const botao = screen.getByTestId("botao-gerar-pdf");
    expect(botao).toBeInTheDocument();
    await act(async () => fireEvent.click(botao));

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao baixar PDF, tente novamente mais tarde.")
      ).toBeInTheDocument();
    });
  });
});
