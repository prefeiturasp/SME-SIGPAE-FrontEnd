import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import CronogramaEntregaPage from "src/pages/PreRecebimento/CronogramaEntregaPage";
import { mockListaCronogramas } from "../../../../../mocks/cronograma.service/mockGetCronogramas";
import { mockListaNomesDistribuidores } from "../../../../../mocks/logistica.service/mockGetNomesDistribuidores";
import { PERFIL, TIPO_SERVICO } from "../../../../../constants/shared";

const setupMocks = () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  mock.onGet(`/cronogramas/`).reply(200, mockListaCronogramas);
  mock
    .onGet(`/terceirizadas/lista-nomes-distribuidores/`)
    .reply(200, mockListaNomesDistribuidores);
};

const renderPage = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <CronogramaEntregaPage />
      </MemoryRouter>,
    );
  });
};

const esperarCarregamento = async () => {
  await waitFor(() =>
    expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument(),
  );
};

const clicarFiltrar = () => {
  const btnFiltrar = screen.getByText("Filtrar").closest("button");
  expect(btnFiltrar).not.toBeDisabled();
  fireEvent.click(btnFiltrar);
};

const limparLocalStorage = () => {
  localStorage.removeItem("perfil");
  localStorage.removeItem("tipo_servico");
};

describe("Testa página de Consulta de Cronogramas (Perfil Cronograma)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    setupMocks();
  });

  beforeAll(() => {
    localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);
  });

  afterAll(() => {
    limparLocalStorage();
  });

  it("exibe botao Cadastrar Cronograma", async () => {
    await renderPage();
    await esperarCarregamento();

    const btnCadastrar = screen
      .getByText("Cadastrar Cronograma")
      .closest("button");
    expect(btnCadastrar).not.toBeDisabled();
    fireEvent.click(btnCadastrar);
  });

  it("carrega a página com requisições", async () => {
    await renderPage();
    await esperarCarregamento();

    clicarFiltrar();
    await waitFor(() =>
      expect(screen.getByText("Resultados da Pesquisa")).toBeInTheDocument(),
    );
  });

  it("preenche campos e Limpa Filtros", async () => {
    await renderPage();
    await waitFor(() =>
      expect(
        screen.getByText("Filtrar por Nome do Produto"),
      ).toBeInTheDocument(),
    );

    const inputNomeProduto = screen.getByTestId("nome_produto");
    fireEvent.change(inputNomeProduto, { target: { value: "FORMIGA" } });

    expect(inputNomeProduto).toHaveValue("FORMIGA");

    const btnLimpar = screen.getByText("Limpar Filtros").closest("button");
    expect(btnLimpar).not.toBeDisabled();
    fireEvent.click(btnLimpar);

    expect(inputNomeProduto).not.toHaveValue("FORMIGA");
  });

  it("carrega a próxima página de requisições", async () => {
    await renderPage();
    await esperarCarregamento();

    clicarFiltrar();

    await waitFor(() =>
      expect(screen.getByText("Resultados da Pesquisa")).toBeInTheDocument(),
    );

    const nextButton = screen.getByLabelText("right");
    fireEvent.click(nextButton);

    await waitFor(() =>
      expect(screen.getByText("Resultados da Pesquisa")).toBeInTheDocument(),
    );
  });

  it("baixa pdf do cronograma", async () => {
    const createObjectURL = jest.fn();
    window.URL.createObjectURL = createObjectURL;
    await renderPage();
    await esperarCarregamento();

    clicarFiltrar();
    await waitFor(() =>
      expect(screen.getByText("Resultados da Pesquisa")).toBeInTheDocument(),
    );

    const cronogramaPdf = mockListaCronogramas.results[3];
    mock
      .onGet(`/cronogramas/${cronogramaPdf.uuid}/gerar-pdf-cronograma/`)
      .reply(200, new Blob());

    const btnImprimir = screen.getByTestId("imprimir_3");
    fireEvent.click(btnImprimir);

    await waitFor(() => {
      expect(createObjectURL).toHaveBeenCalled();
    });
  });

  it("exibe mensagem pra resultado de busca vazio", async () => {
    await renderPage();
    await esperarCarregamento();

    mock.onGet(`/cronogramas/`).reply(200, { count: 0, results: [] });

    clicarFiltrar();

    await waitFor(() =>
      expect(
        screen.getByText(
          "Não existe informação para os critérios de busca utilizados.",
        ),
      ).toBeInTheDocument(),
    );
  });

  it("deve exibir cronograma FLV Ponto a Ponto em verde na grid", async () => {
    const mockFLV = {
      ...mockListaCronogramas,
      results: [
        {
          ...mockListaCronogramas.results[0],
          uuid: "pp-verde-test",
          ponto_a_ponto: true,
          ficha_tecnica: {
            produto: { nome: "PRODUTO VERDE PP" },
          },
        },
      ],
    };
    mock.onGet(`/cronogramas/`).reply(200, mockFLV);

    await renderPage();
    clicarFiltrar();

    await waitFor(() => {
      const row = screen.getByText(/PRODUTO VERDE PP/i).closest(".body-table");
      expect(row).toHaveClass("flv-ponto-a-ponto");
    });
  });

  it("deve exibir o título 'Editar Rascunho' no ícone de edição de rascunhos", async () => {
    const mockRascunho = {
      ...mockListaCronogramas,
      results: [
        {
          ...mockListaCronogramas.results[0],
          uuid: "rascunho-test",
          status: "Rascunho",
          ponto_a_ponto: true,
        },
      ],
    };
    mock.onGet(`/cronogramas/`).reply(200, mockRascunho);

    await renderPage();
    clicarFiltrar();

    await waitFor(() => {
      const editIcon = screen.getByTitle("Editar Rascunho");
      expect(editIcon).toBeInTheDocument();
    });
  });
});

describe("Testa página de Consulta de Cronogramas (Perfil Fornecedor)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    setupMocks();
  });

  beforeAll(() => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem(
      "tipo_servico",
      TIPO_SERVICO.FORNECEDOR_E_DISTRIBUIDOR,
    );
  });

  afterAll(() => {
    limparLocalStorage();
  });

  it("atualmente carrega a página com requisições automaticamente", async () => {
    await renderPage();
    await esperarCarregamento();

    await waitFor(() =>
      expect(screen.getByText("Resultados da Pesquisa")).toBeInTheDocument(),
    );
  });

  it("verifica exibição de tag PLL nos resultados", async () => {
    await renderPage();

    await waitFor(() =>
      expect(screen.getByText(/LEVE LEITE - PLL/i)).toBeInTheDocument(),
    );
  });
});
