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
import { CentralDeDownloadContext } from "src/context/CentralDeDownloads";
import * as utilities from "src/helpers/utilities";
import * as logisticaService from "src/services/logistica.service";
import EntregasDilog from "../index";

jest.mock("src/services/logistica.service");
jest.mock("src/helpers/utilities");

const mockSolicitacoes = [
  {
    uuid: "sol-1",
    numero_solicitacao: "REQ-001",
    distribuidor_nome: "Distribuidor A",
    data_entrega: "01/01/2025",
    qtd_guias: 5,
    guias_parciais: 1,
    guias_recebidas: 2,
    guias_nao_recebidas: 0,
    guias_reposicao_parcial: 0,
    guias_reposicao_total: 0,
    guias_insucesso: 1,
    guias_pendentes: 1,
  },
  {
    uuid: "sol-2",
    numero_solicitacao: "REQ-002",
    distribuidor_nome: "Distribuidor B",
    data_entrega: "02/01/2025",
    qtd_guias: 3,
    guias_parciais: 0,
    guias_recebidas: 1,
    guias_nao_recebidas: 1,
    guias_reposicao_parcial: 0,
    guias_reposicao_total: 0,
    guias_insucesso: 0,
    guias_pendentes: 1,
  },
];

const rootReducer = combineReducers({ entregasDilog: formReducer });
const store = createStore(rootReducer, {});

const mockCentralDownload = {
  getQtdeDownloadsNaoLidas: jest.fn(),
};

describe("EntregasDilog", () => {
  const mockGetEntregas = logisticaService.getEntregasDilog;
  const mockGerarParametros = utilities.gerarParametrosConsulta;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGerarParametros.mockImplementation((p) => p);
    mockGetEntregas.mockResolvedValue({
      data: { results: mockSolicitacoes, count: 2 },
    });
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const renderComponent = async (props = {}, route = "") => {
    window.history.pushState({}, "Test", route);
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <CentralDeDownloadContext.Provider value={mockCentralDownload}>
              <EntregasDilog {...props} />
            </CentralDeDownloadContext.Provider>
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

  it("deve ler query param numero_requisicao e buscar automaticamente", async () => {
    await renderComponent({}, "?numero_requisicao=REQ-999");

    await waitFor(() => {
      expect(mockGetEntregas).toHaveBeenCalled();
    });

    expect(mockGerarParametros).toHaveBeenCalledWith({
      page: 1,
      numero_requisicao: "REQ-999",
    });
  });

  it("deve exibir solicitações na listagem após consultar", async () => {
    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(screen.getByText("REQ-001")).toBeInTheDocument();
      expect(screen.getByText("REQ-002")).toBeInTheDocument();
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
    mockGetEntregas.mockResolvedValue({
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
    mockGetEntregas.mockResolvedValue({
      data: { results: [], count: 0 },
    });

    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(screen.queryByText("REQ-001")).not.toBeInTheDocument();
    });
  });

  it("deve limpar listagem ao clicar em Limpar Filtros", async () => {
    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(screen.getByText("REQ-001")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Limpar Filtros"));
    });

    await waitFor(() => {
      expect(screen.queryByText("REQ-001")).not.toBeInTheDocument();
    });
  });

  it("deve exibir paginação quando houver resultados", async () => {
    mockGetEntregas.mockResolvedValue({
      data: { results: mockSolicitacoes, count: 25 },
    });

    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(
        document.querySelector(".ant-pagination-item-active"),
      ).toBeInTheDocument();
    });
  });

  it("deve expandir detalhes ao clicar no ícone plus", async () => {
    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(screen.getByText("REQ-001")).toBeInTheDocument();
    });

    const iconePlus = document.querySelectorAll(".fa-plus")[0];
    await act(async () => {
      fireEvent.click(iconePlus);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Detalhes das Guias Conferidas:"),
      ).toBeInTheDocument();
    });
  });

  it("deve recolher detalhes ao clicar no ícone minus", async () => {
    await renderComponent();
    await consultar();

    await waitFor(() => {
      expect(screen.getByText("REQ-001")).toBeInTheDocument();
    });

    const iconePlus = document.querySelectorAll(".fa-plus")[0];
    await act(async () => {
      fireEvent.click(iconePlus);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Detalhes das Guias Conferidas:"),
      ).toBeInTheDocument();
    });

    const iconeMinus = document.querySelector(".fa-minus");
    await act(async () => {
      fireEvent.click(iconeMinus);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Detalhes das Guias Conferidas:"),
      ).not.toBeInTheDocument();
    });
  });
});
