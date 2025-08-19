import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import TabelaResultado from "../../components/TabelaResultado";
import { mockProdutosSuspensos } from "../../../../../../mocks/produto.service/mockGetProdutosSuspensos";

describe("Verifica comportamentos componente de tabela de resultado produtos suspensos", () => {
  beforeEach(async () => {
    const { results } = mockProdutosSuspensos;
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
            <TabelaResultado
              filtros={{}}
              produtos={results}
              produtosCount={results.length}
              setProdutos={jest.fn()}
              pageSize={10}
              setPage={jest.fn()}
              page={1}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente foi renderizado com todos campos e registros", () => {
    expect(screen.getByText("Resultado detalhado")).toBeInTheDocument();
    expect(screen.getByText("Produto")).toBeInTheDocument();
    expect(screen.getByText("Marca")).toBeInTheDocument();
    expect(screen.getByText("Edital")).toBeInTheDocument();
    expect(screen.getByText("Tipo")).toBeInTheDocument();
    expect(screen.getByText("Cadastro")).toBeInTheDocument();
    expect(screen.getByText("Suspensão")).toBeInTheDocument();

    expect(screen.getByText("ALCATRA NOVA")).toBeInTheDocument();
    expect(screen.getByText("MACAÍBA")).toBeInTheDocument();

    expect(
      screen.getByText("Exportar PDF").closest("button")
    ).toBeInTheDocument();
  });
});
