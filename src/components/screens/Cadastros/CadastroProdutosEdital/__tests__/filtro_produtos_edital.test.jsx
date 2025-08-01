import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosAdmGestaoProduto } from "src/mocks/meusDados/admGestaoProduto";
import { mockGetNomesProdutosEdital } from "src/mocks/services/produto.service/mockGetNomesProdutosEdital";
import Filtros from "../componentes/Filtros";
import mock from "src/services/_mock";

describe("Comportamentos de formulário de filtros do Cadastro de Produtos Provenientes do Edital", () => {
  beforeEach(async () => {
    mock
      .onGet("/cadastro-produtos-edital/lista-nomes/")
      .reply(200, mockGetNomesProdutosEdital);
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
              meusDados: mockMeusDadosAdmGestaoProduto,
              setMeusDados: jest.fn(),
            }}
          >
            <Filtros
              setResultado={jest.fn()}
              nomes={mockGetNomesProdutosEdital.results}
              status={[
                {
                  status: "Ativo",
                },
                {
                  status: "Inativo",
                },
              ]}
              setCarregando={jest.fn()}
              setTotal={jest.fn()}
              setFiltros={jest.fn()}
              setPage={jest.fn()}
              changePage={jest.fn()}
              fetchData={jest.fn()}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se os labels da interface foram renderizados", async () => {
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("Verifica a funcionalidade do campo auto complete", async () => {
    const campoStatus = screen.getByTestId("nome-item-test");
    const inputElement = campoStatus.querySelector("input");
    fireEvent.focus(inputElement);
    fireEvent.change(inputElement, {
      target: { value: "alcatra" },
    });
    await waitFor(() => {
      expect(inputElement.value).toBe("alcatra");
      expect(screen.getByText(/ALCATRA NOVA/i)).toBeInTheDocument();
    });
  });

  it("Verifica opção e seleciona ativo campo status", () => {
    const campoStatus = screen.getByTestId("filtro-status-select");
    const selectElement = campoStatus.querySelector("select");
    fireEvent.change(selectElement, {
      target: { value: "Ativo" },
    });
    expect(selectElement.value).toBe("Ativo");
  });

  it("Verifica e clica no botão de pesquisa", () => {
    const botaoPesquisar = screen.getByText("Pesquisar");
    expect(botaoPesquisar).toBeInTheDocument();
    fireEvent.click(botaoPesquisar);
  });
});
