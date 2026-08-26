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
import mock from "src/services/_mock";
import TermoRecebimentoDefinitivo from "../index";
import {
  CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO,
  POS_RECEBIMENTO,
} from "src/configs/constants";
import { PERFIL } from "src/constants/shared";
import {
  mockListaTermosRecebimento,
  mockListaTermosRecebimentoVazia,
} from "src/mocks/services/posRecebimento.service/mockListaTermosRecebimento";

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <TermoRecebimentoDefinitivo />
      </MemoryRouter>,
    );
  });
};

const clicarFiltrar = async () => {
  await act(async () => {
    fireEvent.click(screen.getByTestId("botao-filtrar"));
  });
};

describe("TermoRecebimentoDefinitivo - Listagem e Filtros", () => {
  beforeEach(() => {
    localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);

    mock.reset();
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaTermosRecebimento);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("exibe o botão Cadastrar Termo apontando para a rota de cadastro", async () => {
    await setup();

    const botao = screen.getByText("Cadastrar Termo");
    expect(botao.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO}`,
    );
  });

  it("NÃO realiza busca ao carregar a página (só ao filtrar)", async () => {
    await setup();

    expect(mock.history.get.length).toBe(0);
    expect(screen.queryByText("Resultado da Pesquisa")).not.toBeInTheDocument();
  });

  it("renderiza a listagem com os termos ao clicar em Filtrar", async () => {
    await setup();
    await clicarFiltrar();

    expect(
      await screen.findByText("Resultado da Pesquisa"),
    ).toBeInTheDocument();

    expect(screen.getByText("123/2025")).toBeInTheDocument();
    expect(screen.getByText("Empresa Alfa")).toBeInTheDocument();
    expect(screen.getByText("456/2025")).toBeInTheDocument();
    expect(screen.getByText("Empresa Beta")).toBeInTheDocument();
  });

  it("exibe 'Nenhum resultado encontrado' ao filtrar sem resultados", async () => {
    mock.reset();
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaTermosRecebimentoVazia);

    await setup();
    await clicarFiltrar();

    expect(
      await screen.findByText("Nenhum resultado encontrado"),
    ).toBeInTheDocument();
  });

  it("envia o filtro de empresa na requisição ao clicar em Filtrar", async () => {
    await setup();

    const inputEmpresa = screen.getByTestId("nome_empresa");
    fireEvent.change(inputEmpresa, { target: { value: "Empresa Alfa" } });

    await clicarFiltrar();

    await waitFor(() => {
      const enviouFiltro = mock.history.get.some(
        (call) => call.params?.get?.("nome_empresa") === "Empresa Alfa",
      );
      expect(enviouFiltro).toBe(true);
    });
  });

  it("Não realiza busca ao clicar em Limpar Filtros", async () => {
    await setup();

    await act(async () => {
      fireEvent.click(screen.getByText("Limpar Filtros"));
    });

    expect(mock.history.get.length).toBe(0);
    expect(screen.queryByText("Resultado da Pesquisa")).not.toBeInTheDocument();
  });
});
