import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import * as utilities from "src/helpers/utilities";
import { mockMeusDadosCEI } from "src/mocks/meusDados/escola/CEI";
import * as logisticaService from "src/services/logistica.service";
import ConferirEntrega from "../index";

jest.mock("src/services/logistica.service");
jest.mock("src/helpers/utilities");

const mockResultados = [
  { uuid: "1", numero_guia: "123" },
  { uuid: "2", numero_guia: "456" },
];

describe("ConferirEntrega", () => {
  const mockGetGuias = logisticaService.getGuiasEscola;
  const mockGerarParametros = utilities.gerarParametrosConsulta;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGerarParametros.mockImplementation((p) => p);

    mockGetGuias.mockResolvedValue({
      data: {
        results: mockResultados,
        count: 2,
      },
    });

    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const rootReducer = combineReducers({
    loteForm: formReducer,
  });
  const store = createStore(rootReducer, {});

  const renderComponent = async (route = "") => {
    window.history.pushState({}, "Test", route);

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <MeusDadosContext.Provider
              value={{
                meusDados: mockMeusDadosCEI,
                setMeusDados: jest.fn(),
              }}
            >
              <ConferirEntrega />
            </MeusDadosContext.Provider>
          </MemoryRouter>
        </Provider>,
      );
    });
  };

  const aplicarFiltros = async () => {
    await act(async () => {
      fireEvent.click(screen.getByText("Consultar"));
    });
  };

  it("deve ler query param numero_guia da URL e aplicar filtro automaticamente", async () => {
    await renderComponent("?numero_guia=999");

    await waitFor(() => {
      expect(mockGetGuias).toHaveBeenCalled();
    });

    expect(mockGerarParametros).toHaveBeenCalledWith({
      page: 1,
      numero_guia: "999",
    });
  });

  it("deve exibir listagem quando houver resultados", async () => {
    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
      expect(screen.getByText("456")).toBeInTheDocument();
    });
  });

  it("deve chamar scrollIntoView quando houver resultados", async () => {
    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  it("deve exibir paginação quando houver resultados", async () => {
    mockGetGuias.mockResolvedValue({
      data: { results: mockResultados, count: 25 },
    });

    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem quando não houver resultados", async () => {
    mockGetGuias.mockResolvedValue({
      data: { results: [], count: 0 },
    });

    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Não existe informação para os critérios de busca utilizados.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("deve chamar updatePage corretamente", async () => {
    await renderComponent();
    await aplicarFiltros();

    await act(async () => {
      fireEvent.click(screen.getByText("Consultar"));
    });

    await waitFor(() => {
      expect(mockGetGuias).toHaveBeenCalled();
    });
  });
});
