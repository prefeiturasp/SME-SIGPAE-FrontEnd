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
import * as utilities from "src/helpers/utilities";
import * as logisticaService from "src/services/logistica.service";
import useSomenteLeitura from "../../../../../hooks/useSomenteLeitura";
import ComponentePrincipal from "../index";

jest.mock("src/services/logistica.service");
jest.mock("src/helpers/utilities");
jest.mock("../../../../../hooks/useSomenteLeitura");

const rootReducer = combineReducers({ guiasOcorrencias: formReducer });
const store = createStore(rootReducer, {});

const mockNotificacoes = [
  { uuid: "1", numero: "123", distribuidor: "Dist A", status: "RASCUNHO" },
];

describe("Notificacoes Ocorrencia", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (utilities.gerarParametrosConsulta as jest.Mock).mockImplementation(
      (p) => p,
    );
    (logisticaService.getNomesDistribuidores as jest.Mock).mockResolvedValue({
      data: { results: [{ nome_fantasia: "Dist A", uuid: "uuid-a" }] },
    });
    (useSomenteLeitura as jest.Mock).mockReturnValue(false);
  });

  const renderComponent = async (props = {}) => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <ComponentePrincipal {...props} />
          </MemoryRouter>
        </Provider>,
      );
    });
  };

  it("deve cobrir fluxo completo de busca, sucesso, paginação e limpeza", async () => {
    (logisticaService.getNotificacoesOcorrencia as jest.Mock).mockResolvedValue(
      {
        data: { results: mockNotificacoes, count: 25 },
      },
    );

    await renderComponent();

    await act(async () => {
      fireEvent.click(screen.getByText("Filtrar"));
    });

    await waitFor(() => {
      expect(logisticaService.getNotificacoesOcorrencia).toHaveBeenCalledWith({
        page: 1,
      });
    });

    expect(screen.getByText("2")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText("2"));
    });

    await waitFor(() => {
      expect(logisticaService.getNotificacoesOcorrencia).toHaveBeenCalledWith({
        page: 2,
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Limpar Filtros"));
    });
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("deve tratar cenário de nenhum resultado encontrado", async () => {
    (logisticaService.getNotificacoesOcorrencia as jest.Mock).mockResolvedValue(
      {
        data: { results: [], count: 0 },
      },
    );

    await renderComponent();
    await act(async () => {
      fireEvent.click(screen.getByText("Filtrar"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum resultado encontrado"),
      ).toBeInTheDocument();
    });
  });

  it("deve mostrar botão Nova Notificação quando não for fiscal e nem somente leitura", async () => {
    (useSomenteLeitura as jest.Mock).mockReturnValue(false);
    await renderComponent({ fiscal: false });
    expect(screen.getByText("Nova Notificação")).toBeInTheDocument();
  });

  it("deve ocultar botão Nova Notificação quando somente leitura for true", async () => {
    (useSomenteLeitura as jest.Mock).mockReturnValue(true);
    await renderComponent({ fiscal: false });
    expect(screen.queryByText("Nova Notificação")).not.toBeInTheDocument();
  });

  it("deve ocultar botão Nova Notificação quando fiscal for true", async () => {
    (useSomenteLeitura as jest.Mock).mockReturnValue(false);
    await renderComponent({ fiscal: true });
    expect(screen.queryByText("Nova Notificação")).not.toBeInTheDocument();
  });
});
