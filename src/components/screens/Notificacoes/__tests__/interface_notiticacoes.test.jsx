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
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import NotificacoesPage from "src/pages/Notificacoes/NotificacoesPage";
import mock from "src/services/_mock";
import thunk from "redux-thunk";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe("Testes da interface Notificações - Usuário CODAE", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  let store;
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet("/notificacoes/pendencias-nao-resolvidas/")
      .reply(200, mockGetNotificacoes);
    mock.onGet("/notificacoes/gerais/").reply(200, mockGetNotificacoes);

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
      form: {},
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
              <NotificacoesPage />
            </MeusDadosContext.Provider>
          </Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título e breadcrumb - 'Notificações'", () => {
    expect(screen.getAllByText("Notificações")).toHaveLength(3);
  });

  it("Verifica se componentes foram renderizados", async () => {
    expect(screen.getByText("Todas")).toBeInTheDocument();
    expect(screen.getByText("Não Lidas")).toBeInTheDocument();
    expect(screen.getByText("Lidas")).toBeInTheDocument();
    expect(screen.getByText("Tema")).toBeInTheDocument();
    expect(screen.getByText("Tipo")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
  });

  it("Clicar em consultar e verifica se notificações estão renderizadas", async () => {
    const botao = screen.getByText("Consultar").closest("button");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(screen.queryAllByText("Aviso")).toHaveLength(2);
      expect(screen.queryAllByText("Notificação de teste")).toHaveLength(2);
      expect(
        screen.queryAllByText("Descrição da notificação de teste")
      ).toHaveLength(2);
    });
  });
});
