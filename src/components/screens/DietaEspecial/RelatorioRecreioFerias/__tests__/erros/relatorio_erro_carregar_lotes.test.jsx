import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { RelatorioRecreioFeriasPage } from "src/pages/DietaEspecial/RelatorioRecreioFeriasPage";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";
import { alergiasIntolerantes } from "src/components/screens/DietaEspecial/Relatorio/dados";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";

describe("Verifica comportamento da interface ao receber retorno de erro do endpoint de dre/lotes", () => {
  beforeEach(async () => {
    mock.onGet("/lotes-simples/").reply(400, []);
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
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica renderização de mensagem de erro", async () => {
    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar lotes.")).toBeInTheDocument();
    });
  });
});
