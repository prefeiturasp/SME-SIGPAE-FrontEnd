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
import * as toastDialogs from "src/components/Shareable/Toast/dialogs";
import * as utilities from "src/helpers/utilities";
import * as logisticaService from "src/services/logistica.service";
import GestaoInconsistencias from "../index";

jest.mock("src/services/logistica.service");
jest.mock("src/helpers/utilities");
jest.mock("src/components/Shareable/Toast/dialogs");

const mockResultados = [
  {
    uuid: "1",
    numero_guia: "123",
    codigo_unidade: "001",
    nome_unidade: "Escola A",
  },
  {
    uuid: "2",
    numero_guia: "456",
    codigo_unidade: "002",
    nome_unidade: "Escola B",
  },
];

describe("GestaoInconsistencias", () => {
  const mockGetGuias = logisticaService.getGuiasInconsistencias;
  const mockVincularGuias = logisticaService.vinculaGuiasComEscolas;
  const mockGerarParametros = utilities.gerarParametrosConsulta;
  const mockToastSuccess = toastDialogs.toastSuccess;
  const mockToastError = toastDialogs.toastError;

  const rootReducer = combineReducers({
    buscaGuiaInconsistencias: formReducer,
  });
  const store = createStore(rootReducer, {});

  beforeEach(() => {
    jest.clearAllMocks();

    mockGerarParametros.mockImplementation((p) => p);
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    mockGetGuias.mockResolvedValue({
      data: { results: mockResultados, count: 2 },
    });
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <GestaoInconsistencias />
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

  it("deve renderizar o componente corretamente", async () => {
    await renderComponent();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  it("deve buscar guias ao montar o componente pois filtros inicia como {}", async () => {
    await renderComponent();

    await waitFor(() => {
      expect(mockGetGuias).toHaveBeenCalledTimes(1);
    });
  });

  it("deve buscar guias ao clicar em Consultar", async () => {
    await renderComponent();
    await aplicarFiltros();

    await waitFor(() => {
      expect(mockGetGuias).toHaveBeenCalledTimes(2);
    });
  });

  it("deve exibir listagem quando houver resultados", async () => {
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
      expect(screen.getByText("456")).toBeInTheDocument();
      expect(screen.getByText("Escola A")).toBeInTheDocument();
      expect(screen.getByText("Escola B")).toBeInTheDocument();
    });
  });

  it("deve chamar scrollIntoView quando houver resultados", async () => {
    await renderComponent();

    await waitFor(() => {
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  it("deve exibir paginação quando houver resultados", async () => {
    mockGetGuias.mockResolvedValue({
      data: { results: mockResultados, count: 25 },
    });

    await renderComponent();

    await waitFor(() => {
      expect(
        document.querySelector(".ant-pagination-item-active"),
      ).toBeInTheDocument();
    });
  });

  it("deve mudar de página ao clicar na paginação", async () => {
    mockGetGuias.mockResolvedValue({
      data: { results: mockResultados, count: 25 },
    });

    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("2"));
    });

    await waitFor(() => {
      expect(mockGetGuias).toHaveBeenCalledTimes(2);
    });

    expect(mockGerarParametros).toHaveBeenLastCalledWith({ page: 2 });
  });

  it("deve exibir mensagem quando não houver resultados", async () => {
    mockGetGuias.mockResolvedValue({
      data: { results: [], count: 0 },
    });

    await renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Não existe informação para os critérios de busca utilizados.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("deve limpar resultados ao clicar em Limpar Filtros", async () => {
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Limpar Filtros"));
    });

    await waitFor(() => {
      expect(screen.queryByText("123")).not.toBeInTheDocument();
    });
  });

  it("deve vincular guias com sucesso ao clicar em Vincular", async () => {
    mockVincularGuias.mockResolvedValue({
      status: 200,
      data: { message: "Guias vinculadas com sucesso!" },
    });

    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Vincular")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Vincular"));
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Guias vinculadas com sucesso!",
      );
    });
  });

  it("deve exibir erro quando vincular guias retornar status diferente de 200", async () => {
    mockVincularGuias.mockResolvedValue({
      status: 500,
      data: {},
    });

    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Vincular")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Vincular"));
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Houve um erro ao vincular as guias.",
      );
    });
  });
});
