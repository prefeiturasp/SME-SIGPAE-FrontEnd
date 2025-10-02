import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import WizardFormTerceiraPagina from "src/components/screens/Produto/AtualizacaoProdutoForm/components/WizardFormTerceiraPagina.jsx";
import {
  alteracaoProdutoHomologado,
  updateProduto,
} from "src/services/produto.service";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("src/services/produto.service", () => ({
  alteracaoProdutoHomologado: jest.fn(),
  updateProduto: jest.fn(),
  getUnidadesDeMedidaProduto: jest.fn().mockResolvedValue({
    data: { results: [] },
  }),
  getEmbalagensProduto: jest.fn().mockResolvedValue({
    data: { results: [] },
  }),
  excluirImagemDoProduto: jest.fn(),
}));

describe("WizardFormTerceiraPagina – proteção contra cliques múltiplos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    updateProduto.mockResolvedValue({ status: 200 });
    alteracaoProdutoHomologado.mockResolvedValue({ status: 200 });
  });

  const setup = () => {
    const defaultProps = {
      homologacao: { esta_homologado: false, uuid: "h123", status: "OK" },
      produto: {
        uuid: "p123",
        numero_registro: "",
        tipo: "",
        imagens: [],
        especificacoes: [],
        prazo_validade: "",
        info_armazenamento: "",
        outras_informacoes: "",
        homologacao: { status: "OK" },
      },
      valuesForm: {
        uuid: "p123",
        numero_registro: "",
        tipo: "",
        especificacoes: [],
        prazo_validade: "10 dias",
        info_armazenamento: "Armazenar em local seco",
        outras_informacoes: "",
        anexos: [],
      },
      valoresSegundoForm: { informacoes_nutricionais: {} },
      valoresterceiroForm: {
        numero_registro: "",
        tipo: "",
        especificacoes: [],
        prazo_validade: "",
        info_armazenamento: "",
        outras_informacoes: "",
      },
      terceiroStep: false,
      change: jest.fn(),
      handleSubmit: (cb) => (e) => {
        e.preventDefault();
        cb();
      },
      previousPage: jest.fn(),
      passouTerceiroStep: jest.fn(),
      setFiles: jest.fn(),
      removeFile: jest.fn(),
      showModal: jest.fn(),
      navigate: jest.fn(),
      pristine: false,
      submitting: false,
    };

    const rootReducer = combineReducers({
      form: formReducer,
    });
    const store = createStore(rootReducer, {});
    return render(
      <Provider store={store}>
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <WizardFormTerceiraPagina
            pristine={false}
            submitting={false}
            {...defaultProps}
          />
        </MemoryRouter>
      </Provider>
    );
  };

  test("nao deve permitir multiplas requisiçoes ao clicar varias vezes", async () => {
    setup();
    fireEvent.change(
      screen.getByPlaceholderText(/Digite o prazo da validade/i),
      {
        target: { value: "10 dias" },
      }
    );
    fireEvent.click(screen.getByText("Enviar"));
    expect(await screen.findByText(/Deseja continuar?/i)).toBeInTheDocument();

    const botaoSim = screen.getByText("Sim");

    fireEvent.click(botaoSim);
    fireEvent.click(botaoSim);
    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(updateProduto).toHaveBeenCalledTimes(1);
    });
  });
});
