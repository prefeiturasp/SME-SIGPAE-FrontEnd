import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimplesDRE } from "src/mocks/lote.service/DRE/lotesSimples";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockTerceirizadasListaNomesDRE } from "src/mocks/produto.service/DRE/terceirizadasListaNomes";
import {
  mockListaFabricantes,
  mockListaMarcas,
  mockListaProdutos,
} from "src/mocks/Produto/BuscaAvancada/listas";
import { mockProdutosReclamacoesEscolaEMEF } from "src/mocks/services/produto.service/Escola/EMEF/produtosReclamacoes";
import { RelatorioReclamacaoProdutoPage } from "src/pages/Produto/RelatorioReclamacaoProdutoPage";
import mock from "src/services/_mock";

describe("Test Relatório Reclamação Produto - Usuário DRE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/produtos-editais/lista-nomes-unicos/").reply(200, {
      results: [
        "edital teste hom review",
        "EDITAL MODELO IMR",
        "101010B",
        "404040",
        "30/SME/CODAE/2023",
      ],
      count: 5,
    });
    mock.onGet("/produtos/lista-nomes-unicos/").reply(200, mockListaProdutos);
    mock.onGet("/marcas/lista-nomes-unicos/").reply(200, mockListaMarcas);
    mock
      .onGet("/fabricantes/lista-nomes-unicos/")
      .reply(200, mockListaFabricantes);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimplesDRE);
    mock
      .onGet("/terceirizadas/lista-nomes/")
      .reply(200, mockTerceirizadasListaNomesDRE);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

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
              meusDados: mockMeusDadosCogestor,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioReclamacaoProdutoPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título e breadcrumb `Relatório de Reclamação de Produto`", () => {
    expect(
      screen.queryAllByText("Relatório de Reclamação de Produto")
    ).toHaveLength(2);
  });

  it("Filtra e exibe resultados; limpa filtros", async () => {
    const usuario = userEvent.setup();

    mock
      .onGet("/produtos/filtro-reclamacoes/")
      .reply(200, mockProdutosReclamacoesEscolaEMEF);

    const selectEditais = screen.getByTestId("select-editais");
    const selectControlEditais = within(selectEditais).getByRole("combobox");
    fireEvent.mouseDown(selectControlEditais);
    const option101010B = screen.getByText("101010B");
    fireEvent.click(option101010B);

    const divInputProduto = screen.getByTestId("div-input-nome-produto");
    const campoInputProduto = within(divInputProduto).getByRole("combobox");
    expect(campoInputProduto).toHaveValue("");
    await usuario.type(campoInputProduto, "PITAIA");
    expect(campoInputProduto).toHaveValue("PITAIA");

    const divInputMarca = screen.getByTestId("div-input-nome-marca");
    const campoInputMarca = within(divInputMarca).getByRole("combobox");
    expect(campoInputMarca).toHaveValue("");
    await usuario.type(campoInputMarca, "TANG");
    expect(campoInputMarca).toHaveValue("TANG");

    const divInputFabricante = screen.getByTestId("div-input-nome-fabricante");
    const campoInputFabricante =
      within(divInputFabricante).getByRole("combobox");
    expect(campoInputFabricante).toHaveValue("");
    await usuario.type(campoInputFabricante, "PANCO LTDA");
    expect(campoInputFabricante).toHaveValue("PANCO LTDA");

    const selectStatusReclamacao = screen.getByTestId("select-status");
    const selectControlStatusReclamacao = within(
      selectStatusReclamacao
    ).getByRole("combobox");
    fireEvent.mouseDown(selectControlStatusReclamacao);
    const optionAGUARDANDO_AVALIACAO = screen.getByText(
      "Aguardando avaliação da CODAE"
    );
    fireEvent.click(optionAGUARDANDO_AVALIACAO);

    const selectLote = screen.getByTestId("select-lotes");
    const selectControlLote = within(selectLote).getByRole("combobox");
    fireEvent.mouseDown(selectControlLote);
    const optionLote = screen.getByText("Teste - IP");
    fireEvent.click(optionLote);

    const selectEmpresa = screen.getByTestId("select-empresas");
    const selectControlEmpresa = within(selectEmpresa).getByRole("combobox");
    fireEvent.mouseDown(selectControlEmpresa);
    const optionEmpresa = screen.getByText("ALIMENTAR");
    fireEvent.click(optionEmpresa);

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("166")).toBeInTheDocument();
    });

    const botaoLimparFiltros = screen
      .getByText("Limpar Filtros")
      .closest("button");
    fireEvent.click(botaoLimparFiltros);

    expect(campoInputProduto).toHaveValue("");
    expect(campoInputMarca).toHaveValue("");
    expect(campoInputFabricante).toHaveValue("");
  });

  it("download pdf", async () => {
    mock
      .onGet("/produtos/filtro-reclamacoes/")
      .reply(200, mockProdutosReclamacoesEscolaEMEF);

    const selectEditais = screen.getByTestId("select-editais");
    const selectControlEditais = within(selectEditais).getByRole("combobox");
    fireEvent.mouseDown(selectControlEditais);
    const option101010B = screen.getByText("101010B");
    fireEvent.click(option101010B);

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("166")).toBeInTheDocument();
    });

    mock
      .onGet(`/produtos/relatorio-reclamacao/`)
      .reply(200, new Blob(["conteúdo do PDF"], { type: "application/pdf" }));

    const botaoBaixarPDF = screen.getByText("Baixar PDF").closest("button");
    fireEvent.click(botaoBaixarPDF);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Houve um erro ao imprimir o relatório. Tente novamente mais tarde."
        )
      ).not.toBeInTheDocument();
    });
  });

  it("erro download pdf", async () => {
    mock
      .onGet("/produtos/filtro-reclamacoes/")
      .reply(200, mockProdutosReclamacoesEscolaEMEF);

    const selectEditais = screen.getByTestId("select-editais");
    const selectControlEditais = within(selectEditais).getByRole("combobox");
    fireEvent.mouseDown(selectControlEditais);
    const option101010B = screen.getByText("101010B");
    fireEvent.click(option101010B);

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("166")).toBeInTheDocument();
    });

    mock
      .onGet(`/produtos/relatorio-reclamacao/`)
      .reply(400, { detail: "Erro ao baixar PDF" });

    const botaoBaixarPDF = screen.getByText("Baixar PDF").closest("button");
    fireEvent.click(botaoBaixarPDF);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Houve um erro ao imprimir o relatório. Tente novamente mais tarde."
        )
      ).toBeInTheDocument();
    });
  });

  it("Renderiza `Não foram encontrados resultados para estes filtros.`", async () => {
    mock
      .onGet("/produtos/filtro-reclamacoes/")
      .reply(200, { count: 0, results: [] });

    const selectEditais = screen.getByTestId("select-editais");
    const selectControlEditais = within(selectEditais).getByRole("combobox");
    fireEvent.mouseDown(selectControlEditais);
    const option101010B = screen.getByText("101010B");
    fireEvent.click(option101010B);

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(
        screen.getByText("Não foram encontrados resultados para estes filtros.")
      ).toBeInTheDocument();
    });
  });
});
