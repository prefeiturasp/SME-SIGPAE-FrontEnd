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

import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockGetMarcasProdutos } from "src/mocks/services/produto.service/mockGetMarcasProdutos";
import { mockGetFabricantesProdutos } from "src/mocks/services/produto.service/mockGetFabricantesProdutos";
import { mockGetInformacoesGrupo } from "src/mocks/services/produto.service/mockGetInformacoesGrupo";
import { mockGetTiposItens } from "src/mocks/services/produto.service/mockGetTiposItens";
import { mockGetNomeDeProdutosEdital } from "src/mocks/services/produto.service/mockGetNomeDeProdutosEdital";
import { mockGetHomologacao } from "src/mocks/services/produto.service/mockGetHomologacao";
import { mockGetUnidadesDeMedidaProduto } from "src/mocks/services/produto.service/mockGetUnidadesDeMedidaProduto";
import { mockGetEmbalagensProduto } from "src/mocks/services/produto.service/mockGetEmbalagensProduto";

import AtualizacaoProdutoFormPage from "src/pages/Produto/AtualizacaoProdutoFormPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

const renderWithReduxForm = (component, initialState = {}) => {
  const rootReducer = combineReducers({ form: formReducer });
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

describe("Acesso somente de Visualização - USUARIO_EMPRESA", () => {
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
    mock.onGet("/marcas/").reply(200, mockGetMarcasProdutos);
    mock
      .onGet(`/homologacoes-produtos/${mockGetHomologacao.uuid}/`)
      .reply(200, mockGetHomologacao);
    mock.onGet("/fabricantes/").reply(200, mockGetFabricantesProdutos);
    mock
      .onGet("/informacoes-nutricionais/agrupadas/")
      .reply(200, mockGetInformacoesGrupo);
    mock
      .onGet("/nome-de-produtos-edital/")
      .reply(200, mockGetNomeDeProdutosEdital);
    mock.onGet("/itens-cadastros/tipos/").reply(200, mockGetTiposItens);
    mock.onGet("/unidades-medida/").reply(200, mockGetUnidadesDeMedidaProduto);
    mock.onGet("/embalagens-produto/").reply(200, mockGetEmbalagensProduto);

    await act(async () => {
      renderWithReduxForm(<AtualizacaoProdutoFormPage />);
    });
  });

  it("valida campos do primeiro step", async () => {
    await waitFor(() => {
      expect(screen.getByText("Próximo").closest("button")).toBeInTheDocument();
    });

    // Campo Nome de Produto
    const selectNomeProduto = screen.getByTestId("select-nome-produto");
    const inputNome = within(selectNomeProduto).getByRole("combobox");
    expect(inputNome).toBeDisabled();

    // Campo Marca
    const selectMarcaProduto = screen.getByTestId("select-marca-produto");
    const inputMarca = within(selectMarcaProduto).getByRole("combobox");
    expect(inputMarca).toBeDisabled();

    // Campo Fabricante
    const selectFabricanteProduto = screen.getByTestId(
      "select-fabricante-produto"
    );
    const inputFabricante = within(selectFabricanteProduto).getByRole(
      "combobox"
    );
    expect(inputFabricante).toBeDisabled();

    // Nome dos componentes do produto
    const textarea = screen.getByDisplayValue(/SUCO DE UVA DA FRIBOI/i); // ou valor completo
    expect(textarea).toBeDisabled();
  });

  it("valida campos do segundo step", async () => {
    await waitFor(() => {
      expect(screen.getByText("Próximo").closest("button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Próximo").closest("button"));

    await waitFor(() => {
      expect(screen.getByText("Informações Nutricionais")).toBeInTheDocument();
    });

    const inputPorcao = screen.getByDisplayValue("200 ML");
    expect(inputPorcao).toBeDisabled();

    const inputUnidadeCaseira = screen.getByDisplayValue("1 COPO");
    expect(inputUnidadeCaseira).toBeDisabled();
  });

  it("valida campos do terceiro step", async () => {
    await waitFor(() => {
      expect(screen.getByText("Próximo").closest("button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Próximo").closest("button"));

    await waitFor(() => {
      expect(screen.getByText("Informações Nutricionais")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Próximo").closest("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Informação do Produto (classificação)")
      ).toBeInTheDocument();
    });

    const inputPrazoValidade = screen.getByPlaceholderText(
      "Digite o prazo da validade"
    );
    expect(inputPrazoValidade).toBeDisabled();

    const botaoAnexar = screen.getByText("Anexar").closest("button");
    expect(botaoAnexar).toBeDisabled();
  });
});
