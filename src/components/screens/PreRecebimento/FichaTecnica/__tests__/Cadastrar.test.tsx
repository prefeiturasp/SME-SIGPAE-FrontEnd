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
import { MeusDadosContext } from "src/context/MeusDadosContext";
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
} from "src/services/produto.service";
import {
  cadastrarFichaTecnica,
  cadastraRascunhoFichaTecnica,
  getFichaTecnica,
} from "src/services/fichaTecnica.service";
import { getUnidadesDeMedidaLogistica } from "src/services/cronograma.service";
import { getTerceirizadaUUID } from "src/services/terceirizada.service";
import { CATEGORIA_OPTIONS } from "../constants";
import { debug } from "jest-preview";
import { FichaTecnicaDetalhada } from "interfaces/pre_recebimento.interface";
import { mockFichaTecnica } from "mocks/services/fichaTecnica.service/mockGetFichaTecnica";
import { mockMeusDadosFornecedor } from "mocks/services/perfil.service/mockMeusDados";
import CadastroFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/CadastroFichaTecnicaPage";
import mock from "src/services/_mock";

jest.mock("services/terceirizada.service.js");
jest.mock("services/cronograma.service.js");
jest.mock("services/produto.service.js");
jest.mock("services/fichaTecnica.service.ts");
jest.setTimeout(60000);

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

  jest.mocked(cadastrarFichaTecnica).mockResolvedValue({
    data: {} as FichaTecnicaDetalhada,
    status: 201,
  });

  jest.mocked(cadastraRascunhoFichaTecnica).mockResolvedValue({
    data: {} as FichaTecnicaDetalhada,
    status: 201,
  });

  jest.mocked(getFichaTecnica).mockResolvedValue({
    data: mockFichaTecnica,
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
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosFornecedor,
            setMeusDados: jest.fn(),
          }}
        >
          <CadastroFichaTecnicaPage />
        </MeusDadosContext.Provider>
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
  it("cadastra um rascunho de ficha técnica", async () => {
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

    const btnRascunho = screen.getByText("Salvar Rascunho").closest("button");
    expect(btnRascunho).not.toBeDisabled();
    fireEvent.click(btnRascunho);

    debug();
  });

  it("Assina e Envia uma ficha técnica", async () => {
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
        target: { value: "57" },
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

    let inputFile = screen.getByTestId("arquivo");
    const arquivo = new File(["conteúdo do PDF"], "arquivoTeste.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(inputFile, { target: { files: [arquivo] } });

    const btnAssinar = screen.getByText("Assinar e Enviar").closest("button");
    await waitFor(() => {
      expect(btnAssinar).not.toBeDisabled();
    });
    fireEvent.click(btnAssinar);

    expect(screen.getByText(/Assinar Ficha Técnica/i)).toBeInTheDocument();

    const btnCancelar = screen.getByText("Não").closest("button");
    fireEvent.click(btnCancelar);

    fireEvent.click(btnAssinar);

    const btnEnviar = screen.getByText("Sim, Assinar Ficha").closest("button");
    fireEvent.click(btnEnviar);

    expect(
      screen.getByText(/Confirme sua senha de acesso ao/i)
    ).toBeInTheDocument();

    preencheInput("password", "123456");

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(btnConfirmar);
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

  it("carrega dados pré-existentes de rascunho", async () => {
    mock.onGet(mockFichaTecnica.arquivo).reply(200, new Blob());

    const search = `?uuid=${mockFichaTecnica.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await setup();
    expect(screen.getByText(/Informações Nutricionais/i)).toBeInTheDocument();
    expect(getFichaTecnica).toHaveBeenCalled();
  });
});
