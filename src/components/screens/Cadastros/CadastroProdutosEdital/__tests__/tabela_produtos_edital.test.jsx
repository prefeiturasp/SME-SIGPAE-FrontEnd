import React from "react";
import {
  act,
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import CadastroProdutosEdital from "..";
import { mockGetCadastroProdutosEdital } from "../../../../../mocks/services/produto.service/mockGetCadastroProdutosEdital";
import { mockGetNomesProdutosEdital } from "../../../../../mocks/services/produto.service/mockGetNomesProdutosEdital";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosAdmGestaoProduto } from "src/mocks/meusDados/admGestaoProduto";

describe("Carrega página de Cadastro de Produtos Provenientes do Edital", () => {
  beforeEach(async () => {
    mock
      .onGet("/cadastro-produtos-edital/")
      .reply(200, mockGetCadastroProdutosEdital);
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
            <CadastroProdutosEdital />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se título da tabela foi renderizado", async () => {
    expect(screen.getByText("Produtos Cadastrados")).toBeInTheDocument();
  });

  it("Verifica se colunas da tabela estão presentes", async () => {
    const tabela = screen.getByTestId("tabela-produtos-edital");
    expect(within(tabela).getByText(/nome do produto/i)).toBeInTheDocument();
    expect(within(tabela).getByText(/status/i)).toBeInTheDocument();
    expect(within(tabela).getByText(/ações/i)).toBeInTheDocument();
  });

  it("Faz o filtro nos dados da tabela e verifica se foi correspondido", async () => {
    const campoStatus = screen.getByTestId("nome-item-test");
    const inputElement = campoStatus.querySelector("input");
    fireEvent.focus(inputElement);
    fireEvent.change(inputElement, {
      target: { value: "KELWY" },
    });
    fireEvent.click(screen.getByText("Pesquisar"));
    await waitFor(() => {
      const tabela = screen.getByTestId("tabela-produtos-edital");
      expect(within(tabela).getByText(/ALCATRA DO KELWY/i)).toBeInTheDocument();
    });
  });
});
