import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Container } from "src/components/screens/DashboardCODAE/Container";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { getLotesSimples } from "src/services/lote.service";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

jest.mock("src/services/lote.service");
jest.mock("src/services/diretoriaRegional.service");

jest.mock("src/components/screens/DashboardCODAE", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="dashboard-codae">
      Dashboard CODAE - Filtros: {props.filtroPor?.length || 0} - Visões:{" "}
      {props.visaoPor?.length || 0} - Lotes: {props.lotes?.length || 0} - DREs:{" "}
      {props.diretoriasRegionais?.length || 0}
    </div>
  ),
}));

const mockStore = configureStore([]);

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiretoriaregionalSimplissima).toHaveBeenCalled();
    expect(getLotesSimples).toHaveBeenCalled();
  });
};

describe("Container - Dashboard CODAE", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      filtersAlimentacao: {
        dreAlimentacao: "",
        loteAlimentacao: "",
        tituloAlimentacao: "",
      },
    });

    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: mockDiretoriaRegionalSimplissima,
      status: 200,
    });
    getLotesSimples.mockResolvedValue({
      data: mockLotesSimples,
      status: 200,
    });
  });

  it("renderiza loading inicial", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <MeusDadosContext.Provider value={{ meusDados: null }}>
              <Container />
            </MeusDadosContext.Provider>
          </MemoryRouter>
        </Provider>,
      );
    });
    await awaitServices();
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renderiza dashboard quando dados carregam", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <MeusDadosContext.Provider
              value={{ meusDados: mockMeusDadosCODAEADMIN }}
            >
              <Container />
            </MeusDadosContext.Provider>
          </MemoryRouter>
        </Provider>,
      );
    });

    await awaitServices();
    expect(screen.getByTestId("dashboard-codae")).toBeInTheDocument();
  });

  it("chama serviços na inicialização", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <MeusDadosContext.Provider
              value={{ meusDados: mockMeusDadosCODAEADMIN }}
            >
              <Container />
            </MeusDadosContext.Provider>
          </MemoryRouter>
        </Provider>,
      );
    });

    await waitFor(() => {
      expect(getDiretoriaregionalSimplissima).toHaveBeenCalled();
      expect(getLotesSimples).toHaveBeenCalled();
    });
  });

  it("renderiza erro ao falhar carregamento de DREs", async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      status: 500,
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <MeusDadosContext.Provider
              value={{ meusDados: mockMeusDadosCODAEADMIN }}
            >
              <Container />
            </MeusDadosContext.Provider>
          </MemoryRouter>
        </Provider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar DREs")).toBeInTheDocument();
    });
  });

  it("renderiza erro ao falhar carregamento de lotes", async () => {
    getLotesSimples.mockResolvedValue({
      status: 500,
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <MeusDadosContext.Provider
              value={{ meusDados: mockMeusDadosCODAEADMIN }}
            >
              <Container />
            </MeusDadosContext.Provider>
          </MemoryRouter>
        </Provider>,
      );
    });
    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar lotes")).toBeInTheDocument();
    });
  });
});
