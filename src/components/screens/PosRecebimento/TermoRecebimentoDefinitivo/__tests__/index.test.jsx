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

describe("TermoRecebimentoDefinitivo - Listagem e Filtros", () => {
  beforeEach(() => {
    mock.reset();
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaTermosRecebimento);
  });

  it("exibe o botão Cadastrar Termo apontando para a rota de cadastro", async () => {
    await setup();

    const botao = screen.getByText("Cadastrar Termo");
    expect(botao.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO}`,
    );
  });

  it("renderiza a listagem com os termos retornados pela API", async () => {
    await setup();

    expect(
      await screen.findByText("Resultado da Pesquisa"),
    ).toBeInTheDocument();

    // Cabeçalhos da tabela.
    expect(screen.getByText("Nº do Contrato")).toBeInTheDocument();
    expect(screen.getByText("Empresa Contratada")).toBeInTheDocument();

    // Dados dos termos (contrato + empresa são únicos, não colidem com os
    // labels do filtro de status).
    expect(screen.getByText("123/2025")).toBeInTheDocument();
    expect(screen.getByText("Empresa Alfa")).toBeInTheDocument();
    expect(screen.getByText("456/2025")).toBeInTheDocument();
    expect(screen.getByText("Empresa Beta")).toBeInTheDocument();
  });

  it("exibe 'Nenhum resultado encontrado' quando a API retorna lista vazia", async () => {
    mock.reset();
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaTermosRecebimentoVazia);

    await setup();

    expect(
      await screen.findByText("Nenhum resultado encontrado"),
    ).toBeInTheDocument();
  });

  it("envia o filtro de empresa na requisição ao clicar em Filtrar", async () => {
    await setup();

    const inputEmpresa = screen.getByTestId("nome_empresa");
    fireEvent.change(inputEmpresa, { target: { value: "Empresa Alfa" } });

    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-filtrar"));
    });

    await waitFor(() => {
      const enviouFiltro = mock.history.get.some(
        (call) => call.params?.get?.("nome_empresa") === "Empresa Alfa",
      );
      expect(enviouFiltro).toBe(true);
    });
  });

  it("refaz a busca ao clicar em Limpar Filtros", async () => {
    await setup();

    await waitFor(() => expect(mock.history.get.length).toBeGreaterThan(0));
    const chamadasAntes = mock.history.get.length;

    await act(async () => {
      fireEvent.click(screen.getByText("Limpar Filtros"));
    });

    await waitFor(() => {
      expect(mock.history.get.length).toBeGreaterThan(chamadasAntes);
    });
  });
});
