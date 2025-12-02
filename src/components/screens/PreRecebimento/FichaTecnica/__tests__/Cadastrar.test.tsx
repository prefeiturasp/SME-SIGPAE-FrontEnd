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
import { mockListaUnidadesMedidaLogistica } from "src/mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";
import { mockListaProdutosLogistica } from "src/mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import { mockListaMarcas } from "src/mocks/produto.service/mockGetNomesMarcas";
import { mockListaFabricantes } from "src/mocks/produto.service/mockGetNomesFabricantes";
import { mockListaInformacoesNutricionais } from "src/mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa } from "src/mocks/terceirizada.service/mockGetTerceirizadaUUID";
import { CATEGORIA_OPTIONS } from "../constants";
import { debug } from "jest-preview";
import { mockFichaTecnica } from "src/mocks/services/fichaTecnica.service/mockGetFichaTecnica";
import { mockMeusDadosFornecedor } from "src/mocks/services/perfil.service/mockMeusDados";
import CadastroFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/CadastroFichaTecnicaPage";
import mock from "src/services/_mock";
import { PROGRAMA_OPTIONS } from "../constants";

beforeEach(() => {
  mock
    .onGet(`/cadastro-produtos-edital/lista-completa-logistica/`)
    .reply(200, mockListaProdutosLogistica);

  mock.onGet(`/marcas/lista-nomes/`).reply(200, mockListaMarcas);

  mock.onGet(`/fabricantes/lista-nomes/`).reply(200, mockListaFabricantes);

  mock
    .onGet(`/informacoes-nutricionais/ordenadas/`)
    .reply(200, mockListaInformacoesNutricionais);

  mock
    .onGet(`/unidades-medida-logistica/lista-nomes-abreviacoes/`)
    .reply(200, mockListaUnidadesMedidaLogistica);

  mock
    .onGet(`/terceirizadas/${mockFichaTecnica.empresa.uuid}/`)
    .reply(200, mockEmpresa);

  mock.onPost(`/cadastro-produtos-edital/`).reply(201);

  mock.onPost(`/itens-cadastros/`).reply(201);

  mock.onPost(`/ficha-tecnica/`).reply(201);

  mock.onPost(`/rascunho-ficha-tecnica/`).reply(201);

  mock
    .onGet(`/ficha-tecnica/${mockFichaTecnica.uuid}/`)
    .reply(200, mockFichaTecnica);
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
      </MemoryRouter>,
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

const adicionaEnvasador = () => {
  let btnEnvasador = screen
    .getByText("+ Adicionar Envasador/Distribuidor")
    .closest("button");
  fireEvent.click(btnEnvasador);
};

describe("Carrega página de Cadastro de Ficha técnica", () => {
  it("cadastra um rascunho de ficha técnica", async () => {
    await setup();
    expect(screen.getByText(/Informações Nutricionais/i)).toBeInTheDocument();

    expect(mock.history.get.length).toBeGreaterThanOrEqual(1);
    expect(
      mock.history.get.some((call) =>
        call.url.includes(
          "/cadastro-produtos-edital/lista-completa-logistica/",
        ),
      ),
    ).toBe(true);

    preencheInput("produto", mockListaProdutosLogistica.results[0].uuid);

    let selectCategoria = screen
      .getByTestId("categoria")
      .querySelector("select");
    fireEvent.change(selectCategoria, {
      target: { value: CATEGORIA_OPTIONS[0].uuid },
    });

    let selectPrograma = screen.getByTestId("programa").querySelector("select");
    fireEvent.change(selectPrograma, {
      target: { value: PROGRAMA_OPTIONS[0].uuid },
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

    expect(
      mock.history.get.some((call) =>
        call.url.includes(
          "/cadastro-produtos-edital/lista-completa-logistica/",
        ),
      ),
    ).toBe(true);

    preencheInput("produto", mockListaProdutosLogistica.results[0].uuid);

    let selectCategoria = screen
      .getByTestId("categoria")
      .querySelector("select");
    fireEvent.change(selectCategoria, {
      target: { value: CATEGORIA_OPTIONS[0].uuid },
    });

    let selectPrograma = screen.getByTestId("programa").querySelector("select");
    fireEvent.change(selectPrograma, {
      target: { value: PROGRAMA_OPTIONS[0].uuid },
    });

    let selectMarca = screen.getByTestId("marca").querySelector("select");
    fireEvent.change(selectMarca, {
      target: { value: mockListaMarcas.results[0].uuid },
    });

    preencheInput("pregao_chamada_publica", "123");
    preencheInput("fabricante_0", mockListaFabricantes.results[0].uuid);

    adicionaEnvasador();

    const btnDeletar = screen
      .getByTestId("excluir-envasador")
      .closest("button");
    fireEvent.click(btnDeletar);

    adicionaEnvasador();

    waitFor(() => {
      expect(screen.getByTestId("fabricante_1")).toBeInTheDocument();
    });

    preencheInput("fabricante_1", mockListaFabricantes.results[1].uuid);
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
      screen.getByText(/Quantidade por 100g ou 100 ml/i),
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
      screen.getByText(/Confirme sua senha de acesso ao/i),
    ).toBeInTheDocument();

    preencheInput("password", "123456");

    const btnConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(btnConfirmar);

    await waitFor(() => {
      expect(
        mock.history.post.some((call) => call.url.includes("/ficha-tecnica/")),
      ).toBe(true);
    });
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

    expect(
      mock.history.post.some((call) =>
        call.url.includes("/cadastro-produtos-edital/"),
      ),
    ).toBe(true);
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

    expect(
      mock.history.get.some((call) =>
        call.url.includes(`/ficha-tecnica/${mockFichaTecnica.uuid}/`),
      ),
    ).toBe(true);
  });
});
