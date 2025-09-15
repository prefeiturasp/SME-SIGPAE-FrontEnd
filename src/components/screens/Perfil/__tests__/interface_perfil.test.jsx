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
import PerfilPage from "src/pages/Perfil/PerfilPage";
import mock from "src/services/_mock";
import thunk from "redux-thunk";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe("Testes da interface 'Meus Dados: Perfil' - Usuário CODAE", () => {
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
              <PerfilPage />
            </MeusDadosContext.Provider>
          </Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se interface foi renderizada", () => {
    expect(screen.getByText("Meus Dados")).toBeInTheDocument();
    expect(screen.getByText("Alterar senha")).toBeInTheDocument();
    expect(screen.getAllByText("USUARIO TESTE AMCOM")).toHaveLength(2);
  });

  it("Clica no label de alterar senha e confirma exibição de modal", async () => {
    const alterar = screen.getByText("Alterar senha");
    fireEvent.click(alterar);

    await waitFor(() => {
      expect(screen.getAllByText("Nova Senha")).toHaveLength(2);
      expect(
        screen.getByRole("button", { name: "Cancelar" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Confirmar" })
      ).toBeInTheDocument();
    });
  });
});
