import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import loadProduto from "src/reducers/produto.reducer";

import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockGetRascunhosDeProduto } from "src/mocks/services/produto.service/mockGetRascunhosDeProduto";
import {
  mockListaFabricantes,
  mockListaMarcas,
  mockListaProdutos,
} from "src/mocks/Produto/BuscaAvancada/listas";
import { mockGetInformacoesGrupo } from "src/mocks/services/produto.service/mockGetInformacoesGrupo";
import { mockGetProdutosListagem } from "src/mocks/services/produto.service/mockGetProdutosListagemJujuba";
import { mockGetHomologacao } from "src/mocks/services/produto.service/mockGetHomologacao";

import CadastroProdutoPage from "src/pages/Produto/CadastroProdutoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

const renderWithReduxForm = (component, initialState = {}) => {
  const rootReducer = combineReducers({
    form: formReducer,
    cadastroProduto: loadProduto,
  });
  const store = createStore(rootReducer, initialState);

  return render(
    <Provider store={store}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosTerceirizada,
            setMeusDados: jest.fn(),
          }}
        >
          {component}
        </MeusDadosContext.Provider>
      </MemoryRouter>
    </Provider>
  );
};

describe("Testes na tela de Cadastro de Produto", () => {
  beforeEach(async () => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.USUARIO_EMPRESA);

    const search = `?uuid=${mockGetHomologacao.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock
      .onGet("/informacoes-nutricionais/agrupadas/")
      .reply(200, mockGetInformacoesGrupo);
    mock
      .onGet(
        "/painel-gerencial-homologacoes-produtos/filtro-por-status/rascunho/"
      )
      .reply(200, mockGetRascunhosDeProduto);
    mock.onGet("/produtos/lista-nomes-unicos/").reply(200, mockListaProdutos);
    mock.onGet("/marcas/lista-nomes-unicos/").reply(200, mockListaMarcas);
    mock
      .onGet("/fabricantes/lista-nomes-unicos/")
      .reply(200, mockListaFabricantes);
    mock.onGet("/produtos/").reply(200, mockGetProdutosListagem);

    await act(async () => {
      renderWithReduxForm(<CadastroProdutoPage />);
    });
  });

  it("Verifica renderização dos elementos", async () => {
    await waitFor(() => {
      expect(
        screen.getByText("Confira se produto já está cadastrado no sistema")
      ).toBeInTheDocument();
    });

    const span = screen.getByText("Digite o nome do produto");
    const inputNome = within(span.closest(".ant-select-selector")).getByRole(
      "combobox"
    );

    fireEvent.mouseDown(inputNome);

    const jujuba = screen.getByText("JUJUBA");
    fireEvent.click(jujuba);

    await waitFor(() => {
      expect(screen.getByText("GOMETS")).toBeInTheDocument();
    });

    const gometsText = screen.getByText("GOMETS LTDA");
    const angleDownIcon = gometsText.querySelector("i.fa-angle-down");
    fireEvent.click(angleDownIcon);
    const todosLinks = screen.getAllByRole("link");
    const linkEditar = todosLinks.find((link) =>
      link.getAttribute("href").includes("/gestao-produto/editar")
    );

    expect(linkEditar).toBeInTheDocument();

    const angleUpIcon = gometsText.querySelector("i.fa-angle-up");
    fireEvent.click(angleUpIcon);

    const fabricanteSegundaRow = screen.getByText("NUTRI BRASIL SA");
    const angleDownIcon2 =
      fabricanteSegundaRow.querySelector("i.fa-angle-down");
    fireEvent.click(angleDownIcon2);

    const linksEdicao = screen
      .queryAllByRole("link")
      .filter((link) =>
        link.getAttribute("href")?.includes("/gestao-produto/editar")
      );

    expect(linksEdicao).toHaveLength(0);
  });
});
