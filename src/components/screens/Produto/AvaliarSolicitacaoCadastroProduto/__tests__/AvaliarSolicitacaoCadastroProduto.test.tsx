import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import AvaliarSolicitacaoCadastroProduto from "src/components/screens/Produto/AvaliarSolicitacaoCadastroProduto";
import {
  usuarioEhCODAEDietaEspecial,
  usuarioEhEmpresaTerceirizada,
} from "src/helpers/utilities";
import { getSolicitacoesCadastroProdutoDieta } from "src/services/produto.service";
import mock from "src/services/_mock";

jest.mock("src/services/produto.service", () => ({
  getSolicitacoesCadastroProdutoDieta: jest.fn(),
  getNomesProdutosSolicitacaoInclusao: jest.fn().mockResolvedValue({
    status: 200,
    data: ["Produto A", "Produto B"],
  }),
}));

jest.mock("src/helpers/utilities", () => ({
  ...jest.requireActual("src/helpers/utilities"),
  usuarioEhCODAEDietaEspecial: jest.fn(),
  usuarioEhEmpresaTerceirizada: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs.jsx", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

const mockSolicitacao = {
  uuid: "sol-uuid-001",
  nome_produto: "Produto Teste",
  marca_produto: "Marca Teste",
  fabricante_produto: "Fabricante Teste",
  info_produto: "<p>Informações do produto</p>",
  criado_em: "01/01/2025 10:00",
  status: "AGUARDANDO_CONFIRMACAO",
  status_title: "Aguardando confirmação",
  data_previsao_cadastro: null,
  justificativa_previsao_cadastro: "",
  aluno: {
    nome: "Aluno Teste",
    codigo_eol: "1234567",
    data_nascimento: "01/01/2015",
  },
  escola: {
    nome: "Escola Teste",
    lote: "Lote 01",
    tipo_gestao: { nome: "Direta" },
    contato: {
      email: "escola@teste.com",
      telefone: "11999999999",
      telefone2: "1133333333",
    },
    diretoria_regional: {
      nome: "DRE Teste",
      codigo_eol: "108100",
    },
  },
};

function renderWithProviders() {
  const rootReducer = combineReducers({
    finalForm: formReducer,
  });
  const testStore = createStore(rootReducer, {});

  return render(
    <Provider store={testStore}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AvaliarSolicitacaoCadastroProduto />
      </MemoryRouter>
    </Provider>,
  );
}

describe("AvaliarSolicitacaoCadastroProduto", () => {
  beforeEach(() => {
    mock.reset();
    usuarioEhCODAEDietaEspecial.mockReturnValue(false);
    usuarioEhEmpresaTerceirizada.mockReturnValue(false);
    getSolicitacoesCadastroProdutoDieta.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("não deve chamar getSolicitacoesCadastroProdutoDieta antes de submeter o formulário", async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Consultar")).toBeInTheDocument();
    });

    expect(getSolicitacoesCadastroProdutoDieta).not.toHaveBeenCalled();
  });

  it("não deve exibir listagem nem paginação antes de submeter o formulário", async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Consultar")).toBeInTheDocument();
    });

    expect(
      screen.queryByText("Veja os resultados para busca"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Não existem dados para filtragem informada."),
    ).not.toBeInTheDocument();
  });

  it("deve exibir mensagem de 'Não existem dados' quando a busca retornar vazio", async () => {
    const user = userEvent.setup();

    getSolicitacoesCadastroProdutoDieta.mockResolvedValue({
      status: 200,
      data: { results: [], count: 0 },
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Consultar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Consultar"));

    await waitFor(() => {
      expect(
        screen.getByText("Não existem dados para filtragem informada."),
      ).toBeInTheDocument();
    });
  });

  it("não deve exibir paginação quando total de resultados é menor que PAGE_SIZE (10)", async () => {
    const user = userEvent.setup();

    getSolicitacoesCadastroProdutoDieta.mockResolvedValue({
      status: 200,
      data: { results: [mockSolicitacao], count: 1 },
    });

    renderWithProviders();

    await waitFor(() =>
      expect(screen.getByText("Consultar")).toBeInTheDocument(),
    );
    await user.click(screen.getByText("Consultar"));

    await waitFor(() => {
      expect(screen.getByText("Produto Teste")).toBeInTheDocument();
    });

    // Paginação do Ant Design só renderiza quando count > pageSize
    expect(
      screen.queryByRole("listitem", { name: /page/i }),
    ).not.toBeInTheDocument();
  });

  describe("Visibilidade de colunas por perfil", () => {
    it("deve exibir coluna 'Data Previsão Cadastro' para usuário CODAE Dieta Especial", async () => {
      const user = userEvent.setup();
      usuarioEhCODAEDietaEspecial.mockReturnValue(true);

      getSolicitacoesCadastroProdutoDieta.mockResolvedValue({
        status: 200,
        data: { results: [mockSolicitacao], count: 1 },
      });

      renderWithProviders();

      await waitFor(() =>
        expect(screen.getByText("Consultar")).toBeInTheDocument(),
      );
      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(screen.getByText("Data Previsão Cadastro")).toBeInTheDocument();
      });
    });

    it("não deve exibir coluna 'Data Previsão Cadastro' para usuário não CODAE", async () => {
      const user = userEvent.setup();
      usuarioEhCODAEDietaEspecial.mockReturnValue(false);

      getSolicitacoesCadastroProdutoDieta.mockResolvedValue({
        status: 200,
        data: { results: [mockSolicitacao], count: 1 },
      });

      renderWithProviders();

      await waitFor(() =>
        expect(screen.getByText("Consultar")).toBeInTheDocument(),
      );
      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(screen.getByText("Produto Teste")).toBeInTheDocument();
      });

      expect(
        screen.queryByText("Data Previsão Cadastro"),
      ).not.toBeInTheDocument();
    });
  });
});
