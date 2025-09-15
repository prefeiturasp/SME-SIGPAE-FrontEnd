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
import ModalAlterarSenha from "../../components/ModalAlterarSenha";
import mock from "src/services/_mock";
import thunk from "redux-thunk";

jest.mock("redux-form", () => ({
  ...jest.requireActual("redux-form"),
  Field: (props) => (
    <input data-testid={`field-${props.name}`} placeholder={props.label} />
  ),
  reduxForm: () => (Component) => (props) => <Component {...props} />,
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe("Testes do componente ModalAlterarSenha - Usuário CODAE", () => {
  const onSubmit = jest.fn();
  const onClose = jest.fn();
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

    store = mockStore({ form: {} });

    await act(async () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <MeusDadosContext.Provider
              value={{
                meusDados: mockMeusDadosCODAEGA,
                setMeusDados: jest.fn(),
              }}
            >
              <ModalAlterarSenha
                showModal={true}
                closeModal={onClose}
                onSubmit={onSubmit}
              />
            </MeusDadosContext.Provider>
          </Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica renderização componente", async () => {
    expect(screen.getByText("Nova Senha")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelar" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirmar" })
    ).toBeInTheDocument();
  });

  it("Clica no botão cancelar e verifica se função foi chamada", async () => {
    const botao = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(botao);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  const setValor = (nome, valor) => {
    const campo = screen.getByTestId(`field-${nome}`);
    fireEvent.change(campo, {
      target: { value: valor },
    });
    return campo;
  };

  it("Preenche campos, envia o formulário e verifica se função foi chamada", async () => {
    const atual = setValor("senha_atual", "SenhaAtual123");
    const nova = setValor("senha", "NovaSenha123");
    const confirmar = setValor("confirmar_senha", "NovaSenha123");

    const botao = screen.getByRole("button", { name: "Confirmar" });
    fireEvent.click(botao);

    await waitFor(() => {
      expect(atual.value).toBe("SenhaAtual123");
      expect(nova.value).toBe("NovaSenha123");
      expect(confirmar.value).toBe("NovaSenha123");
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
