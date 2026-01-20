import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CadastroProduto from "src/components/screens/Cadastros/CadastroProdutosLogistica";
import {
  cadastrarProdutoEdital,
  atualizarProdutoEdital,
} from "src/services/produto.service";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";

jest.mock("src/services/produto.service");
jest.mock("src/components/Shareable/Toast/dialogs");

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const renderComponent = (state = null) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/cadastro", state }]}>
      <Routes>
        <Route path="/cadastro" element={<CadastroProduto />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("Teste do componente CadastroProduto", () => {
  const uuid_produto = "6074cd66-4c0c-4346-ab91-dbc9267c00a6";
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve cadastrar um novo produto com sucesso", async () => {
    cadastrarProdutoEdital.mockResolvedValueOnce({});
    renderComponent();

    const inputNome = screen.getByPlaceholderText(/Digite o nome do Produto/i);
    fireEvent.change(inputNome, { target: { value: "PRODUTO TESTE" } });

    const botaoSalvar = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(cadastrarProdutoEdital).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "PRODUTO TESTE",
          tipo_produto: "LOGISTICA",
        }),
      );
      expect(toastSuccess).toHaveBeenCalledWith(
        "Produto cadastrado com sucesso!",
      );
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        "/configuracoes/cadastros/produtos",
      );
    });
  });

  it("deve carregar dados e atualizar um produto existente quando vier via location state", async () => {
    const produtoExistente = {
      uuid: uuid_produto,
      nome: "PRODUTO ANTIGO",
      status: "ATIVO",
      criado_em: "01/01/2024",
    };

    atualizarProdutoEdital.mockResolvedValueOnce({});
    renderComponent({ produto: produtoExistente });

    const inputNome = screen.getByPlaceholderText(/Digite o nome do Produto/i);

    expect(inputNome.value).toBe("PRODUTO ANTIGO");

    fireEvent.change(inputNome, { target: { value: "PRODUTO ATUALIZADO" } });

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(atualizarProdutoEdital).toHaveBeenCalledWith(
        expect.objectContaining({ nome: "PRODUTO ATUALIZADO" }),
        uuid_produto,
      );
      expect(toastSuccess).toHaveBeenCalledWith(
        "Produto atualizado com sucesso!",
      );
    });
  });

  it("deve voltar para a listagem ao clicar em cancelar", () => {
    renderComponent();

    const botaoCancelar = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(botaoCancelar);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      "/configuracoes/cadastros/produtos",
    );
  });

  it("deve mostrar o loading durante a submissão", async () => {
    let resolveRequest;
    const pendingPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });
    cadastrarProdutoEdital.mockReturnValueOnce(pendingPromise);

    renderComponent();
    const inputNome = screen.getByPlaceholderText(/Digite o nome do Produto/i);
    fireEvent.change(inputNome, { target: { value: "PRODUTO TESTE" } });
    const botaoSalvar = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(botaoSalvar);
    const loadingElement = await screen.findByText(/carregando/i);
    expect(loadingElement).toBeInTheDocument();
    expect(botaoSalvar).toBeDisabled();
    resolveRequest();
  });

  it("deve cobrir o catch de erro na ATUALIZAÇÃO de produto", async () => {
    const produtoExistente = { uuid: uuid_produto, nome: "Produto Antigo" };
    const erroMsg = "Erro ao atualizar produto";

    atualizarProdutoEdital.mockRejectedValueOnce({
      response: { data: [erroMsg] },
    });

    renderComponent({ produto: produtoExistente });
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(atualizarProdutoEdital).toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith(erroMsg);
    });
  });

  it("deve cobrir o catch de erro no CADASTRO de novo produto", async () => {
    const erroMsg = "Erro ao cadastrar novo produto";

    cadastrarProdutoEdital.mockRejectedValueOnce({
      response: { data: [erroMsg] },
    });
    renderComponent();
    const inputNome = screen.getByPlaceholderText(/Digite o nome do Produto/i);
    fireEvent.change(inputNome, { target: { value: "Novo Produto" } });
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));
    await waitFor(() => {
      expect(cadastrarProdutoEdital).toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith(erroMsg);
    });
  });
});
