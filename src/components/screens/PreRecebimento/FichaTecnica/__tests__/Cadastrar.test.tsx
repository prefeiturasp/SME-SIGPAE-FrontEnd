import React from "react";

import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Cadastrar from "../components/Cadastrar";
import { mockListaUnidadesMedidaLogistica } from "mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";
import { mockListaProdutosLogistica } from "mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import { mockListaMarcas } from "mocks/produto.service/mockGetNomesMarcas";
import { mockListaFabricantes } from "mocks/produto.service/mockGetNomesFabricantes";
import { mockListaInformacoesNutricionais } from "mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa } from "mocks/terceirizada.service/mockGetTerceirizadaUUID";
import {
  getListaCompletaProdutosLogistica,
  getNomesMarcas,
  getNomesFabricantes,
  getInformacoesNutricionaisOrdenadas,
} from "services/produto.service";
import { getUnidadesDeMedidaLogistica } from "services/cronograma.service";
import { getTerceirizadaUUID } from "services/terceirizada.service";

jest.mock("services/terceirizada.service.js");
jest.mock("services/cronograma.service.js");
jest.mock("services/produto.service.js");

beforeEach(() => {
  getListaCompletaProdutosLogistica.mockResolvedValue({
    data: mockListaProdutosLogistica,
    status: 200,
  });

  getNomesMarcas.mockResolvedValue({
    data: mockListaMarcas,
    status: 200,
  });

  getNomesFabricantes.mockResolvedValue({
    data: mockListaFabricantes,
    status: 200,
  });

  getInformacoesNutricionaisOrdenadas.mockResolvedValue({
    data: mockListaInformacoesNutricionais,
    status: 200,
  });

  getUnidadesDeMedidaLogistica.mockResolvedValue({
    data: mockListaUnidadesMedidaLogistica,
    status: 200,
  });

  getTerceirizadaUUID.mockResolvedValue({
    data: mockEmpresa,
    status: 200,
  });
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Cadastrar />
      </MemoryRouter>
    );
  });
};

describe("Carrega página de Cadastro de Ficha técnica", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("carrega no modo Cadastro", async () => {
    await setup();
    expect(screen.getByText(/Informações Nutricionais/i)).toBeInTheDocument();
    expect(getListaCompletaProdutosLogistica).toHaveBeenCalled();

    let inputProduto = document.getElementById("produto");
    fireEvent.change(inputProduto, {
      target: { value: mockListaProdutosLogistica.results[0].uuid },
    });
    expect(inputProduto).toBeInTheDocument();
  });

  it("cadastra um produto pelo Modal+", async () => {
    await setup();

    expect(screen.getByText(/Informações Nutricionais/i)).toBeInTheDocument();
    expect(getListaCompletaProdutosLogistica).toHaveBeenCalled();

    const botaoCadastrarProduto = screen.getByTestId("btnCadastrarProduto");
    expect(botaoCadastrarProduto).toBeInTheDocument();

    // Tentar disparar o click usando act/await no fireEvent
  });
});
