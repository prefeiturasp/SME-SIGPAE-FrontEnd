import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import FormBuscaProduto from "../../components/FormBuscaProduto";
import { mockListaMarcas } from "src/mocks/produto.service/mockGetNomesMarcas";
import { mockListaFabricantes } from "src/mocks/produto.service/mockGetNomesFabricantes";
import { mockListaTerceirizadas } from "src/mocks/produto.service/mockGetTerceirizadas";
import { mockGetNomesProdutosReclamacao } from "src/mocks/produto.service/mockGetResponderReclamacaoNomesProdutos";
import { mockListaEditais } from "src/mocks/produto.service/mockGetProdutosEditais";

describe("Verifica comportamentos do formulário de busca de produtos suspensos", () => {
  const onSubmit = jest.fn();
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
    localStorage.setItem("perfil", PERFIL.COORDENADOR_GESTAO_PRODUTO);

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
            <FormBuscaProduto
              onSubmit={onSubmit}
              bloquearEdital={false}
              initialStateForm={{}}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente foi renderizado", () => {
    expect(screen.getByText("Edital")).toBeInTheDocument();
    expect(screen.getByText("Nome do Produto")).toBeInTheDocument();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  const setInput = (id, valor) => {
    const campo = screen.getByTestId(id);
    const inputElement = campo.querySelector("input");
    fireEvent.focus(inputElement);
    fireEvent.change(inputElement, {
      target: { value: valor },
    });
  };

  it("Preenche o formulário e chama comportamento do botão 'consultar'", async () => {
    const botao = screen.getByText("Consultar");
    await waitFor(() => {
      expect(botao).toBeInTheDocument();
    });
    await waitFor(() => {
      setInput("nome-edital-input", "teste");
      setInput("nome-produto-input", "teste");
      setInput("nome-marca-input", "teste");
      setInput("nome-fabricante-input", "teste");
      setInput("tipo-input", "teste");
    });
    fireEvent.click(botao);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
