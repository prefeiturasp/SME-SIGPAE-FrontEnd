import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import Filtros from "../../components/Filtros";
import mock from "src/services/_mock";
import thunk from "redux-thunk";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe("Testes do componente de filtros - Notificações", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const setFiltros = jest.fn();
  let store;
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    store = mockStore({
      form: { tema: "", tipo: null, data_inicial: null, data_final: null },
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Provider store={store}>
            <MeusDadosContext.Provider
              value={{
                meusDados: mockMeusDadosCODAEGA,
                setMeusDados: jest.fn(),
              }}
            >
              <Filtros filtros={{}} setFiltros={setFiltros} />
            </MeusDadosContext.Provider>
          </Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se componente foi renderizado", () => {
    expect(screen.getByText("Todas")).toBeInTheDocument();
    expect(screen.getByText("Não Lidas")).toBeInTheDocument();
    expect(screen.getByText("Lidas")).toBeInTheDocument();
    expect(screen.getByText("Tema")).toBeInTheDocument();
    expect(screen.getByText("Tipo")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
  });

  const setTema = () => {
    const input = screen.getByTestId("input-tema");
    fireEvent.change(input, {
      target: { value: "Escola" },
    });
    return input;
  };

  it("Preenche campo de tema, limpa filtros e verifica ação", async () => {
    const tema = setTema();
    const botao = screen.getByText("Limpar Filtros").closest("button");
    fireEvent.click(botao);
    await waitFor(() => expect(tema.value).not.toBe("Escola"));
  });

  const setData = (id, valor) => {
    const wrapper = screen.getByTestId(id);
    const inputData = wrapper.querySelector("input");
    fireEvent.change(inputData, { target: { value: valor } });
  };

  it("Preenche campos e verifica valores registrados", async () => {
    setTema();
    setData("data-inicial", "01/10/2025");
    setData("data-final", "31/10/2025");

    const botao = screen.getByText("Consultar").closest("button");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          categoria: "Escola",
          data_inicial: "01/10/2025",
          data_final: "31/10/2025",
        })
      );
    });
  });
});
