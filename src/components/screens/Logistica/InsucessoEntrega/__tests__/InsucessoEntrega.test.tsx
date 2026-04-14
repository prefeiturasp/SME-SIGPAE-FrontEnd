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
import InsucessoEntrega from "../index";

jest.mock("src/services/logistica.service");
jest.mock("src/helpers/utilities");

const mockGuias = [
  {
    uuid: "guia-1",
    numero_guia: "G-001",
    numero_requisicao: "REQ-001",
    data_entrega: "01/01/2025",
    nome_unidade: "Escola A",
    codigo_unidade: "001",
    status: "PENDENTE",
  },
  {
    uuid: "guia-2",
    numero_guia: "G-002",
    numero_requisicao: "REQ-002",
    data_entrega: "02/01/2025",
    nome_unidade: "Escola B",
    codigo_unidade: "002",
    status: "PENDENTE",
  },
];

const rootReducer = combineReducers({
  buscaRequisicoesDilog: formReducer,
});
const store = createStore(rootReducer, {});

describe("InsucessoEntrega", () => {
  const mockGetGuias = logisticaService.getGuiasRemessaParaInsucesso;
  const mockGerarParametros = utilities.gerarParametrosConsulta;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGerarParametros.mockImplementation((p) => p);
    mockGetGuias.mockResolvedValue({
      data: { results: mockGuias, count: 2 },
    });
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <InsucessoEntrega />
          </MemoryRouter>
        </Provider>,
      );
    });
  };

  const consultar = async () => {
    await act(async () => {
      fireEvent.click(screen.getByText("Consultar"));
    });
  };

  it("deve renderizar o componente corretamente", async () => {
    await renderComponent();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  it("não deve buscar automaticamente sem filtros", async () => {
    await renderComponent();
    expect(mockGetGuias).not.toHaveBeenCalled();
  });

  it("deve buscar guias ao clicar em Consultar", async () => {
    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(mockGetGuias).toHaveBeenCalledTimes(1);
    });
    expect(mockGerarParametros).toHaveBeenCalledWith({ page: 1 });
  });

  it("deve exibir guias na listagem após consultar", async () => {
    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(screen.getByText("G-001")).toBeInTheDocument();
      expect(screen.getByText("G-002")).toBeInTheDocument();
    });
  });

  it("deve chamar scrollIntoView quando houver resultados", async () => {
    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  it("deve exibir mensagem quando não houver resultados", async () => {
    mockGetGuias.mockResolvedValue({
      data: { results: [], count: 0 },
    });

    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Não existe informação para os critérios de busca utilizados.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("não deve exibir listagem quando não houver resultados", async () => {
    mockGetGuias.mockResolvedValue({
      data: { results: [], count: 0 },
    });

    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(screen.queryByText("G-001")).not.toBeInTheDocument();
    });
  });

  it("deve limpar listagem ao clicar em Limpar Filtros", async () => {
    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(screen.getByText("G-001")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Limpar Filtros"));
    });

    await waitFor(() => {
      expect(screen.queryByText("G-001")).not.toBeInTheDocument();
    });
  });

  it("deve exibir paginação quando houver resultados", async () => {
    mockGetGuias.mockResolvedValue({
      data: { results: mockGuias, count: 25 },
    });

    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(
        document.querySelector(".ant-pagination-item-active"),
      ).toBeInTheDocument();
    });
  });

  it("deve mudar de página ao clicar na paginação", async () => {
    mockGetGuias.mockResolvedValue({
      data: { results: mockGuias, count: 25 },
    });

    await renderComponent();
    await consultar();

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
});
