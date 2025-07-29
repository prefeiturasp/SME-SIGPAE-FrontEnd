import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import Container from "../../Container";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import { Provider } from "react-redux";
import { mockTiposGestao } from "src/mocks/lote.service/mockTiposGestao";
import { mockDiretoriasRegionaisSimplissima } from "src/mocks/lote.service/mockDiretoriasRegionaisSimplissima";
import { mockSubPrefeituras } from "src/mocks/lote.service/mockSubPrefeituras";
import { mockLotesCadastrados } from "src/mocks/lote.service/mockLotesCadastrados";
import { ToastContainer } from "react-toastify";
import HTTP_STATUS from "http-status-codes";

describe("Verifica comportamento do campo dos multi selects no formulário de dados do cadastro de lote", () => {
  const cadastroLote = mockLotesCadastrados.results[0];
  let fetchSpy;
  beforeEach(async () => {
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockDiretoriasRegionaisSimplissima);
    mock.onGet("/tipos-gestao/").reply(200, mockTiposGestao);
    mock.onGet("/subprefeituras/").reply(200, mockSubPrefeituras);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);

    fetchSpy = jest.spyOn(window, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => mockLotesCadastrados,
        ok: false,
        status: HTTP_STATUS.NOT_FOUND,
      })
    );

    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    const rootReducer = combineReducers({
      loteForm: formReducer,
    });
    const store = createStore(rootReducer, {});

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
            initialEntries={[{ state: { uuid: cadastroLote.id } }]}
          >
            <MeusDadosContext.Provider
              value={{
                meusDados: mockMeusDadosCODAEGA,
                setMeusDados: jest.fn(),
              }}
            >
              <ToastContainer />
              <Container
                location={{
                  state: {
                    uuid: cadastroLote.uuid,
                  },
                }}
                state={{
                  loading: false,
                  loteCarregado: false,
                }}
              />
            </MeusDadosContext.Provider>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("Ao editar o cadastro de lote não retorna os dados.", async () => {
    await waitFor(() => {
      expect(screen.getByText(/lote não encontrado/i)).toBeInTheDocument();
    });
  });
});
