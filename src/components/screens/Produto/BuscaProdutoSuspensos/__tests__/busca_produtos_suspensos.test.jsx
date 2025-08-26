import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockListaMarcas } from "src/mocks/produto.service/mockGetNomesMarcas";
import { mockListaFabricantes } from "src/mocks/produto.service/mockGetNomesFabricantes";
import { mockGetNomesProdutosReclamacao } from "src/mocks/produto.service/mockGetResponderReclamacaoNomesProdutos";
import { mockListaEditais } from "src/mocks/produto.service/mockGetProdutosEditais";
import { mockListaTerceirizadas } from "src/mocks/Produto/BuscaAvancada/listas";
import { mockProdutosSuspensos } from "src/mocks/produto.service/mockGetProdutosSuspensos";
import BuscaProdutoSuspensos from "..";

describe("Verifica comportamentos do formulário de busca de produtos suspensos", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet("/produtos/lista-nomes/")
      .reply(200, mockGetNomesProdutosReclamacao);
    mock.onGet("/marcas/lista-nomes/").reply(200, mockListaMarcas);
    mock.onGet("/fabricantes/lista-nomes/").reply(200, mockListaFabricantes);
    mock
      .onGet("/terceirizadas/lista-nomes/")
      .reply(200, mockListaTerceirizadas);
    mock
      .onGet("/produtos-editais/lista-nomes-unicos/")
      .reply(200, mockListaEditais);
    mock
      .onGet("/produtos/filtro-relatorio-produto-suspenso/")
      .reply(200, mockProdutosSuspensos);

    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <BuscaProdutoSuspensos />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente foi renderizado", () => {
    expect(screen.getByText("Edital")).toBeInTheDocument();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  it("Preenche o formulário e chama a consulta de produtos suspensos e verifica exibição de registros", async () => {
    const botao = screen.getByText("Consultar");
    expect(botao).toBeInTheDocument();

    const campoEdital = screen
      .getByTestId("nome-edital-input")
      .querySelector("input");
    fireEvent.change(campoEdital, {
      target: { value: "23444" },
    });

    const campoData = screen
      .getByTestId("data-suspensao-input")
      .querySelector("input");
    await waitFor(async () => {
      fireEvent.change(campoData, {
        target: { value: "01/01/2024" },
      });
    });

    await waitFor(() => {
      expect(campoEdital.value).toBe("23444");
      expect(campoData.value).toBe("01/01/2024");
    });

    fireEvent.click(botao);

    await waitFor(() => {
      expect(screen.getByText("ALCATRA NOVA")).toBeInTheDocument();
      expect(screen.getByText("MACAÍBA")).toBeInTheDocument();

      expect(
        screen.getByText("Exportar PDF").closest("button")
      ).toBeInTheDocument();
    });
  });
});
