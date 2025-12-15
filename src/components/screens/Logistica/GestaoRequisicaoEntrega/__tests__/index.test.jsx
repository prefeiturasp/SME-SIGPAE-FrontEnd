import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { mockGetSolicitacoesDisponibilizadas } from "src/mocks/services/disponibilizacaoDeSolicitacoes.service/mockGetSolicitacoesDisponibilizadas";
import mock from "src/services/_mock";
import GestaoRequisicaoEntrega from "src/components/screens/Logistica/GestaoRequisicaoEntrega";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, placeholder }) => (
    <input
      data-testid={input.name}
      placeholder={placeholder}
      value={input.value}
      onChange={(e) => input.onChange(e.target.value)}
    />
  ),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("Testes da interface de Requisição de Entrega", () => {
  const store = mockStore({});
  beforeEach(async () => {
    mock
      .onGet("/solicitacao-remessa/")
      .reply(200, mockGetSolicitacoesDisponibilizadas);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Provider store={store}>
            <GestaoRequisicaoEntrega />
          </Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    mock.resetHandlers();
  });

  it("verifica se campos do filtro foram renderizados", () => {
    expect(screen.getByText("N° da Requisição de Entrega")).toBeInTheDocument();
    expect(screen.getByText("N° da Guia de Remessa")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  const setInput = (id, valor) => {
    const campo = screen.getByTestId(id);
    fireEvent.change(campo, {
      target: { value: valor },
    });
    return campo;
  };

  const setSelect = (id, valor) => {
    const campo = screen.getByTestId(id);
    const select = campo.querySelector("select");
    fireEvent.change(select, {
      target: { value: valor },
    });
    return select;
  };

  const setData = async (id, valor) => {
    const input = screen.getByTestId(id);
    fireEvent.change(input, { target: { value: valor } });
    await act(() => Promise.resolve());
  };

  it("deve preencher campos, verificar valores, limpar filtros e confirmar", async () => {
    const numero = setInput("numero-requisicao", "123");
    const status = setSelect("select-status", "DILOG_ENVIA");

    await waitFor(() => {
      expect(numero.value).toBe("123");
      expect(status.value).toBe("DILOG_ENVIA");
    });

    fireEvent.click(screen.getByTestId("botao-limpar"));

    await waitFor(() => {
      expect(numero.value).toBe("");
      expect(status.value).toBe("");
    });
  });

  it("deve preencher campos, clicar em filtrar e receber resultados", async () => {
    setInput("numero-requisicao", "432");
    setInput("numero-guia", "333");
    setSelect("select-status", "AGUARDANDO_CANCELAMENTO");
    setData("data_inicial", "01/11/2025");

    await act(() => fireEvent.click(screen.getByTestId("botao-consultar")));

    await waitFor(() => {
      expect(screen.getByText("11011")).toBeInTheDocument();
      expect(screen.getByText("11012")).toBeInTheDocument();
    });
  });
});
