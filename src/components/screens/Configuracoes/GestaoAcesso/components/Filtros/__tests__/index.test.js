import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import Filtros from "../index.jsx";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe("Filtros - GestaoAcesso", () => {
  it('digita "5059151" no ID do Usuário, consulta e limpa filtros', () => {
    const setFiltros = jest.fn();
    const setShowCadastro = jest.fn();
    const store = mockStore({});

    render(
      <Provider store={store}>
        <Filtros
          setFiltros={setFiltros}
          setShowCadastro={setShowCadastro}
          visoes={[]}
          perfis={[]}
          visaoUnica={null}
          desabilitaCadastro={() => false}
          qtdLimiteCadastro={5}
          somenteLeitura={false}
        />
      </Provider>
    );

    const inputID = screen.getByPlaceholderText("Digite o ID do Usuário");
    fireEvent.change(inputID, { target: { value: "5059151" } });

    const botaoFiltrar = screen.getByRole("button", { name: /filtrar/i });
    fireEvent.click(botaoFiltrar);

    expect(setFiltros).toHaveBeenCalledWith(
      expect.objectContaining({
        usuario: "5059151",
      })
    );

    const botaoLimpar = screen.getByRole("button", { name: /limpar/i });
    fireEvent.click(botaoLimpar);

    expect(setFiltros).toHaveBeenCalledWith(expect.objectContaining({}));
  });

  it('digita "SONIA MARIA FERRARO GARCIA" no Nome do Usuário, consulta e limpa filtros', () => {
    const setFiltros = jest.fn();
    const setShowCadastro = jest.fn();
    const store = mockStore({});

    render(
      <Provider store={store}>
        <Filtros
          setFiltros={setFiltros}
          setShowCadastro={setShowCadastro}
          visoes={[]}
          perfis={[]}
          visaoUnica={null}
          desabilitaCadastro={() => false}
          qtdLimiteCadastro={5}
          somenteLeitura={false}
        />
      </Provider>
    );

    const inputNome = screen.getByPlaceholderText("Digite o Nome do Usuário");
    fireEvent.change(inputNome, {
      target: { value: "SONIA MARIA FERRARO GARCIA" },
    });

    const botaoFiltrar = screen.getByRole("button", { name: /filtrar/i });
    fireEvent.click(botaoFiltrar);

    expect(setFiltros).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "SONIA MARIA FERRARO GARCIA",
      })
    );

    const botaoLimpar = screen.getByRole("button", { name: /limpar/i });
    fireEvent.click(botaoLimpar);

    expect(setFiltros).toHaveBeenCalledWith(expect.objectContaining({}));
  });
});
