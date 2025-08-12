import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimplesEscolaEMEF } from "src/mocks/lote.service/Escola/EMEF/lotesSimples";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockTerceirizadasListaNomes } from "src/mocks/produto.service/Escola/EMEF/terceirizadasListaNomes";
import {
  mockListaFabricantes,
  mockListaMarcas,
  mockListaProdutos,
} from "src/mocks/Produto/BuscaAvancada/listas";
import { mockProdutosReclamacoesEscolaEMEF } from "src/mocks/services/produto.service/Escola/EMEF/produtosReclamacoes";
import { RelatorioReclamacaoProdutoPage } from "src/pages/Produto/RelatorioReclamacaoProdutoPage";
import mock from "src/services/_mock";

describe("Test Relatório Reclamação Produto - Usuário Terceirizada", () => {
  let container;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock
      .onGet("/produtos-editais/lista-nomes-unicos/")
      .reply(200, { results: ["EDITAL MODELO IMR"], count: 1 });
    mock.onGet("/produtos/lista-nomes-unicos/").reply(200, mockListaProdutos);
    mock.onGet("/marcas/lista-nomes-unicos/").reply(200, mockListaMarcas);
    mock
      .onGet("/fabricantes/lista-nomes-unicos/")
      .reply(200, mockListaFabricantes);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimplesEscolaEMEF);
    mock
      .onGet("/terceirizadas/lista-nomes/")
      .reply(200, mockTerceirizadasListaNomes);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);

    await act(async () => {
      ({ container } = render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosTerceirizada,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioReclamacaoProdutoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      ));
    });
  });

  it("Renderiza título e breadcrumb `Relatório de Reclamação de Produto`", () => {
    expect(
      screen.queryAllByText("Relatório de Reclamação de Produto")
    ).toHaveLength(2);
  });

  it("Filtra e exibe resultados; muda de página; limpa filtros", async () => {
    mock
      .onGet("/produtos/filtro-reclamacoes/")
      .reply(200, mockProdutosReclamacoesEscolaEMEF);

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("166")).toBeInTheDocument();
    });

    const item = container.querySelector(".ant-pagination-item-2");
    expect(item).toBeInTheDocument();
    fireEvent.click(item);

    const botaoLimparFiltros = screen
      .getByText("Limpar Filtros")
      .closest("button");
    fireEvent.click(botaoLimparFiltros);
  });
});
