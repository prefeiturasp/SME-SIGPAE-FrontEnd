import React from "react";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BuscaAvancadaProdutoPage from "src/pages/Produto/BuscaAvancadaProdutoPage";
import { renderWithProvider } from "../../../../../utils/test-utils";
import { MemoryRouter } from "react-router-dom";
import {
  mockListaFabricantes,
  mockListaMarcas,
  mockListaProdutos,
  mockListaTerceirizadas,
} from "../../../../../mocks/Produto/BuscaAvancada/listas";
import { mockResultados } from "../../../../../mocks/Produto/BuscaAvancada/results";
import * as produtoService from "../../../../../services/produto.service";

jest.mock("src/services/produto.service.jsx");

const valorBuscaEdital = "101010B";

beforeEach(() => {
  produtoService.getProdutosListagem.mockResolvedValue({
    data: mockResultados,
    status: 200,
  });
  produtoService.getNomesUnicosProdutos.mockResolvedValue({
    data: mockListaProdutos,
    status: 200,
  });
  produtoService.getNomesUnicosMarcas.mockResolvedValue({
    data: mockListaMarcas,
    status: 200,
  });
  produtoService.getNomesUnicosFabricantes.mockResolvedValue({
    data: mockListaFabricantes,
    status: 200,
  });
  produtoService.getNomesTerceirizadas.mockResolvedValue({
    data: mockListaTerceirizadas,
    status: 200,
  });
  produtoService.getNomesUnicosEditais.mockResolvedValue({
    data: [],
    status: 200,
  });
});

const setup = () => {
  const initialState = {
    buscaAvancadaProduto: {},
    finalForm: {},
  };
  renderWithProvider(
    <MemoryRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <BuscaAvancadaProdutoPage />
    </MemoryRouter>,
    initialState
  );
};

test("Relatorio autorizadas temporariamente", async () => {
  setup();

  await waitFor(() =>
    expect(produtoService.getNomesUnicosProdutos).toHaveBeenCalled()
  );

  expect(screen.getByText(/Edital/i)).toBeInTheDocument();

  const divInputEdital = screen.getByTestId("edital");
  const inputEdital = divInputEdital.querySelector("input");

  expect(inputEdital).toBeInTheDocument();

  const botao = screen.getByText("Consultar").closest("button");

  fireEvent.click(botao);

  expect(screen.queryByText("Campo obrigatório")).toBeInTheDocument();

  fireEvent.change(inputEdital, { target: { value: valorBuscaEdital } });
  expect(inputEdital).toHaveValue(valorBuscaEdital);
  fireEvent.click(botao);

  const botaoLimpar = screen.getByText("Limpar Filtros").closest("button");
  fireEvent.click(botaoLimpar);
  expect(inputEdital).toHaveValue("");

  const divInputStatus = screen.getByTestId("status");
  const inputStatus = divInputStatus.querySelector("input");

  expect(inputStatus).toBeInTheDocument();

  fireEvent.click(inputStatus);
});
