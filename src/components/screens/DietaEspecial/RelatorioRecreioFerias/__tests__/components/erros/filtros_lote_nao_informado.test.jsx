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
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetUnidadeEducacional } from "src/mocks/services/dietaEspecial.service/mockGetUnidadeEducacional";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { alergiasIntolerantes } from "src/components/screens/DietaEspecial/Relatorio/dados";
import { Filtros } from "../../../components/Filtros";

describe("Verifica validação de campo DRE/Lote ao filtrar", () => {
  const carregaDietas = jest.fn();
  beforeEach(async () => {
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
            <Filtros
              meusDados={mockMeusDadosCODAEGA}
              setValuesForm={jest.fn()}
              carregaDietas={carregaDietas}
              setErro={jest.fn()}
              setDietas={jest.fn()}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Clica em filtrar e não deve chamar função de carregamento", async () => {
    const botaoFiltrar = screen.getByText("Filtrar");
    expect(botaoFiltrar).toBeInTheDocument();
    fireEvent.click(botaoFiltrar);
    await waitFor(() => {
      expect(carregaDietas).not.toHaveBeenCalled();
    });
  });
});
