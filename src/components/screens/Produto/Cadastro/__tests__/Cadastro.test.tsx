import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { submitProduto } from "../../../../../services/produto.service";
import CadastroProduto from "../index";

jest.mock("../../../../../services/produto.service", () => ({
  submitProduto: jest.fn(() => Promise.resolve({ status: 201 })),
  updateProduto: jest.fn(() => Promise.resolve({ status: 200 })),
  getInformacoesGrupo: jest.fn(() =>
    Promise.resolve({ data: { results: [] } })
  ),
  getRascunhosDeProduto: jest.fn(() =>
    Promise.resolve({ data: { results: [] } })
  ),
  produtoJaExiste: jest.fn(() =>
    Promise.resolve({ status: 200, data: { produto_existe: false } })
  ),
  excluirRascunhoDeProduto: jest.fn(),
  excluirImagemDoProduto: jest.fn(),
  getUnidadesDeMedidaProduto: jest.fn(() =>
    Promise.resolve({ data: { results: [] } })
  ),
  getEmbalagensProduto: jest.fn(() =>
    Promise.resolve({ data: { results: [] } })
  ),
  getNomesUnicosProdutos: jest.fn(() =>
    Promise.resolve({ data: { results: [] } })
  ),
  getNomesUnicosMarcas: jest.fn(() =>
    Promise.resolve({ data: { results: [] } })
  ),
  getNomesUnicosFabricantes: jest.fn(() =>
    Promise.resolve({ data: { results: [] } })
  ),
}));

jest.mock("../../../../Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("../helpers", () => ({
  validaFormularioStep1: jest.fn(() => Promise.resolve([])),
  retornaPayloadDefault: jest.fn(() => ({})),
}));

jest.mock("../../../../../helpers/utilities", () => ({
  getError: jest.fn((data) => JSON.stringify(data)),
  deepCopy: jest.fn((obj) => JSON.parse(JSON.stringify(obj))),
}));

describe("CadastroProduto - Submit", () => {
  const mockStore = configureStore([thunk]);
  let store;

  // Helper para acessar a instância do componente via React Fiber
  const getComponentInstance = (element: any): any => {
    for (const key in element) {
      if (
        key.startsWith("__reactFiber$") ||
        key.startsWith("__reactInternalInstance$")
      ) {
        let node = element[key].return;
        while (node) {
          if (node.stateNode && node.stateNode.setState) {
            return node.stateNode;
          }
          node = node.return;
        }
      }
    }
    throw new Error("Não foi possível acessar a instância do componente");
  };

  beforeEach(() => {
    jest.clearAllMocks();

    store = mockStore({
      cadastroProduto: {
        data: {
          nome: "Produto Teste",
          tipo: "tipo_teste",
          embalagem: "embalagem_teste",
          prazo_validade: "30 dias",
          info_armazenamento: "Local seco",
          outras_informacoes: "Nenhuma",
          numero_registro: "123456",
          componentes: "Componente A, B, C",
          tem_gluten: "0",
          especificacoes: [{}],
        },
      },
      form: {
        cadastroProduto: {
          values: {
            nome: "Produto Teste",
            tipo: "tipo_teste",
            embalagem: "embalagem_teste",
            prazo_validade: "30 dias",
            info_armazenamento: "Local seco",
            outras_informacoes: "Nenhuma",
            numero_registro: "123456",
            componentes: "Componente A",
            tem_gluten: "0",
            especificacoes: [{}],
          },
        },
      },
    });
  });

  it("não deve permitir múltiplos envios ao clicar várias vezes rapidamente no botão 'Enviar' (BUG atual)", async () => {
    const { container } = render(
      <Provider store={store}>
        <CadastroProduto />
      </Provider>
    );

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    const instance = getComponentInstance(container.firstChild);
    instance.setState({
      currentStep: 2,
      renderBuscaProduto: false,
      payload: {
        uuid: null,
        nome: "Produto Teste",
        marca: "marca-uuid",
        fabricante: "fabricante-uuid",
        componentes: "Componente A",
        tem_gluten: false,
        informacoes_nutricionais: [{ informacao_nutricional: "info-uuid" }],
        tipo: "tipo_teste",
        embalagem: "embalagem_teste",
        prazo_validade: "30 dias",
        info_armazenamento: "Local seco",
        outras_informacoes: "Nenhuma",
        numero_registro: "123456",
        especificacoes: [],
        tem_aditivos_alergenicos: false,
      },
    });

    const botaoEnviar = await screen.findByTestId("botao-enviar");

    fireEvent.click(botaoEnviar);
    fireEvent.click(botaoEnviar);
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(submitProduto).toHaveBeenCalledTimes(1);
    });
  });

  it("deve chamar submitProduto apenas uma vez após implementar isSubmitting", async () => {
    const { container } = render(
      <Provider store={store}>
        <CadastroProduto />
      </Provider>
    );

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    const instance = getComponentInstance(container.firstChild);
    instance.setState({
      currentStep: 2,
      renderBuscaProduto: false,
      isSubmitting: false,
      payload: {
        uuid: null,
        nome: "Produto Teste",
        marca: "marca-uuid",
        fabricante: "fabricante-uuid",
        componentes: "Componente A",
        tem_gluten: false,
        informacoes_nutricionais: [{ informacao_nutricional: "info-uuid" }],
        tipo: "tipo_teste",
        embalagem: "embalagem_teste",
        prazo_validade: "30 dias",
        info_armazenamento: "Local seco",
        outras_informacoes: "Nenhuma",
        numero_registro: "123456",
        especificacoes: [],
        tem_aditivos_alergenicos: false,
      },
    });

    const botaoEnviar = await screen.findByTestId("botao-enviar");

    fireEvent.click(botaoEnviar);
    fireEvent.click(botaoEnviar);
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(submitProduto).toHaveBeenCalledTimes(1);
    });
  });
});
