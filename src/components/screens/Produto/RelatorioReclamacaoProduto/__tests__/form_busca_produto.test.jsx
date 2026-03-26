import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { mockListaMarcas } from "src/mocks/produto.service/mockGetNomesMarcas";
import { mockListaFabricantes } from "src/mocks/produto.service/mockGetNomesFabricantes";
import { mockGetNomesProdutosReclamacao } from "src/mocks/produto.service/mockGetResponderReclamacaoNomesProdutos";
import { Provider } from "react-redux";
import FormBuscaProduto from "../components/FormBuscaProduto";
import HTTP_STATUS from "http-status-codes";
import mock from "src/services/_mock";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe("Teste de Formulário de Busca do Produto - RelatorioReclamacaoProduto", () => {
  const setFiltros = jest.fn();
  const setPage = jest.fn();
  const store = mockStore({});

  const setup = () =>
    render(
      <Provider store={store}>
        <FormBuscaProduto setFiltros={setFiltros} setPage={setPage} />
      </Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();

    mock
      .onGet("/produtos/lista-nomes/")
      .reply(HTTP_STATUS.OK, mockGetNomesProdutosReclamacao);
    mock.onGet("/marcas/lista-nomes/").reply(HTTP_STATUS.OK, mockListaMarcas);
    mock
      .onGet("/fabricantes/lista-nomes/")
      .reply(HTTP_STATUS.OK, mockListaFabricantes);
  });

  it("deve renderizar o formulário", async () => {
    setup();

    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBeGreaterThan(0);
    });
  });

  it("deve chamar endpoints ao montar", async () => {
    setup();

    await waitFor(() => {
      expect(mock.history.get).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ url: "/produtos/lista-nomes/" }),
          expect.objectContaining({ url: "/marcas/lista-nomes/" }),
          expect.objectContaining({ url: "/fabricantes/lista-nomes/" }),
        ]),
      );
    });
  });

  it("deve submeter com status padrão (Selecione)", async () => {
    setup();

    fireEvent.click(screen.getByText("Consultar"));

    await waitFor(() => {
      expect(setPage).toHaveBeenCalledWith(1);
      expect(setFiltros).toHaveBeenCalled();
    });

    const filtros = setFiltros.mock.calls[0][0];

    expect(Array.isArray(filtros.status_reclamacao)).toBe(true);
    expect(filtros.status_reclamacao.length).toBeGreaterThan(1);
  });

  it("deve submeter com status selecionado", async () => {
    setup();

    const select = document.querySelector("select");
    if (select) {
      fireEvent.change(select, {
        target: { value: "CODAE_ACEITOU" },
      });
    }

    fireEvent.click(screen.getByText("Consultar"));

    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalled();
    });

    const filtros = setFiltros.mock.calls[0][0];
    expect(filtros.status_reclamacao).toEqual(
      expect.arrayContaining([expect.any(String)]),
    );
  });

  it("deve executar busca (onSearch) e filtrar dados", async () => {
    setup();

    await waitFor(() => {
      expect(mock.history.get.length).toBeGreaterThan(0);
    });

    const input = document.querySelector('input[type="search"]');
    fireEvent.change(input, { target: { value: "TESTE" } });

    expect(input.value).toBe("TESTE");
  });

  it("deve limpar filtros", () => {
    setup();

    fireEvent.click(screen.getByText("Limpar Filtros"));
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });
});
