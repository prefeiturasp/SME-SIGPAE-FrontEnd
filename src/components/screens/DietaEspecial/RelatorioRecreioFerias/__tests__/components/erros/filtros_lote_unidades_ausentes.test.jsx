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
import { Filtros } from "../../../components/Filtros";
import { ToastContainer } from "react-toastify";

describe("Verifica comportamento de retorno de unidades do lote não encontradas", () => {
  beforeEach(async () => {
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock.onGet("/classificacoes-dieta/").reply(200, []);
    mock.onGet("/alergias-intolerancias/").reply(200, []);
    mock
      .onPost("/escolas-simplissima-com-eol/escolas-com-cod-eol/")
      .reply(200, {
        mensagem: "Não existem resultados para os filtros selecionados",
      });

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
              carregaDietas={jest.fn()}
              setErro={jest.fn()}
              setDietas={jest.fn()}
            />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Seleciona DRE e recebe mensagem de unidades não encontradas", async () => {
    const campoDre = screen.getByTestId("select-dre-lote");
    const select = campoDre.querySelector("select");
    fireEvent.change(select, {
      target: { value: "775d49c5-9a84-4d5b-93e4-aa9d3a5f4459" },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/não existem unidades para os filtros selecionados/i)
      ).toBeInTheDocument();
    });
  });
});
