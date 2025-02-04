import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
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
  cadastrarProdutoEdital,
  cadastrarItem,
} from "services/produto.service";
import { getUnidadesDeMedidaLogistica } from "services/cronograma.service";
import { getTerceirizadaUUID } from "services/terceirizada.service";
import { CATEGORIA_OPTIONS } from "../constants";

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

  cadastrarProdutoEdital.mockResolvedValue({
    data: {},
    status: 201,
  });

  cadastrarItem.mockResolvedValue({
    data: {},
    status: 201,
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

const preencheInput = (testId: string, value: string) => {
  let select = screen.getByTestId(testId);
  fireEvent.change(select, {
    target: { value: value },
  });
};

const clickRadio = (testId: string) => {
  let radioBtn = screen.getByTestId(testId);
  expect(radioBtn).not.toBeChecked();
  fireEvent.click(radioBtn);
  expect(radioBtn).toBeChecked();
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

    preencheInput("produto", mockListaProdutosLogistica.results[0].uuid);

    let selectCategoria = screen
      .getByTestId("categoria")
      .querySelector("select");
    fireEvent.change(selectCategoria, {
      target: { value: CATEGORIA_OPTIONS[0].uuid },
    });

    let selectMarca = screen.getByTestId("marca").querySelector("select");
    fireEvent.change(selectMarca, {
      target: { value: mockListaMarcas.results[0].uuid },
    });

    preencheInput("pregao_chamada_publica", "123");
    preencheInput("fabricante", mockListaFabricantes.results[0].uuid);
    preencheInput("prazo_validade", "12 Meses");
    preencheInput("numero_registro", "11111");

    clickRadio("agroecologico-nao");
    clickRadio("organico-nao");
    preencheInput("componentes_produto", "aaaaa");
    clickRadio("alergenicos-nao");
    clickRadio("gluten-nao");
    clickRadio("lactose-nao");

    const btnProximo = screen.getByText("Próximo").closest("button");
    expect(btnProximo).not.toBeDisabled();
    fireEvent.click(btnProximo);

    const btnAnterior = screen.getByText("Anterior").closest("button");
    fireEvent.click(btnAnterior);
    fireEvent.click(btnProximo);

    expect(
      screen.getByText(/Quantidade por 100g ou 100 ml/i)
    ).toBeInTheDocument();

    const inputsStep2 = screen.getAllByRole("textbox");

    inputsStep2.forEach((input) => {
      fireEvent.change(input, {
        target: { value: "10" },
      });
    });

    let selectUnidadeMedida = screen
      .getByTestId("unidade_medida_porcao")
      .querySelector("select");
    fireEvent.change(selectUnidadeMedida, {
      target: { value: mockListaUnidadesMedidaLogistica.results[0].uuid },
    });

    expect(btnProximo).not.toBeDisabled();
    fireEvent.click(btnProximo);

    const inputsStep3 = screen.getAllByRole("textbox");
    inputsStep3.forEach((input) => {
      fireEvent.change(input, {
        target: { value: "Teste" },
      });
    });

    const selectsStep3 = screen.getAllByRole("combobox");
    selectsStep3.forEach((select) => {
      fireEvent.change(select, {
        target: { value: mockListaUnidadesMedidaLogistica.results[0].uuid },
      });
    });

    clickRadio("embalagens_de_acordo_com_anexo");
    clickRadio("rotulo_legivel");

    const btnAssinar = screen.getByText("Assinar e Enviar").closest("button");
    fireEvent.click(btnAssinar);
  });

  it("cadastra um produto pelo Modal", async () => {
    await setup();

    const btnCadastrarProduto = screen
      .getByText("Cadastrar Produto")
      .closest("button");
    expect(btnCadastrarProduto).toBeInTheDocument();

    fireEvent.click(btnCadastrarProduto);

    preencheInput("cadastroItem", "Novo Produto");
    const btnSalvar = screen.getByText("Cadastrar").closest("button");
    fireEvent.click(btnSalvar);

    await waitFor(() => expect(btnSalvar).not.toBeInTheDocument());
    expect(cadastrarProdutoEdital).toHaveBeenCalled();
  });

  it("cadastra uma marca pelo Modal", async () => {
    await setup();

    const btnCadastrarMarca = screen
      .getByText("Cadastrar Marca")
      .closest("button");
    expect(btnCadastrarMarca).toBeInTheDocument();

    fireEvent.click(btnCadastrarMarca);

    preencheInput("cadastroItem", "Nova Marca");
    const btnSalvar = screen.getByText("Cadastrar").closest("button");
    fireEvent.click(btnSalvar);

    await waitFor(() => expect(btnSalvar).not.toBeInTheDocument());
  });

  it("cadastra um Fabricante pelo Modal", async () => {
    await setup();

    const btnCadastrarFabricante = screen
      .getByText("Cadastrar Fabricante")
      .closest("button");
    expect(btnCadastrarFabricante).toBeInTheDocument();

    fireEvent.click(btnCadastrarFabricante);

    preencheInput("cadastroItem", "Novo Fabricante");
    const btnSalvar = screen.getByText("Cadastrar").closest("button");
    fireEvent.click(btnSalvar);

    await waitFor(() => expect(btnSalvar).not.toBeInTheDocument());
  });
});
