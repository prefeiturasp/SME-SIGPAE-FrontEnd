import React from "react";
import { act, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";
import { ConsultaResponderReclamacaoPage } from "../../../../../pages/Produto";
import { mockGetReclamacaoUnica } from "../../../../../mocks/produto.service/mockGetReclamacoesTerceirizadaPorFiltro";
import {
  PERFIL,
  TIPO_PERFIL,
  TIPO_SERVICO,
} from "../../../../../constants/shared";
import { mockGetNomesProdutosReclamacao } from "../../../../../mocks/produto.service/mockGetResponderReclamacaoNomesProdutos";
import { mockGetNomesMarcasReclamacao } from "../../../../../mocks/produto.service/mockGetResponderReclamacaoNomesMarcas";
import { mockGetNomesFabricantesReclamacao } from "../../../../../mocks/produto.service/mockGetResponderReclamacaoNomesFabricantes";

const setup = async (uuid = null) => {
  if (uuid) {
    const search = `?uuid=${uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });
  }

  await act(async () => {
    renderWithProvider(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ConsultaResponderReclamacaoPage />
      </MemoryRouter>,
      {
        responderReclamacaoProduto: {},
        finalForm: {},
      }
    );
  });
};

describe("Teste <ResponderReclamacao>", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);
    localStorage.setItem("nome_instituicao", "ALIMENTAR");

    mock
      .onGet(`/produtos/filtro-reclamacoes-terceirizada/`)
      .reply(200, mockGetReclamacaoUnica);
    mock
      .onGet(`/produtos/lista-nomes-responder-reclamacao/`)
      .reply(200, mockGetNomesProdutosReclamacao);
    mock
      .onGet(`/marcas/lista-nomes-responder-reclamacao/`)
      .reply(200, mockGetNomesMarcasReclamacao);
    mock
      .onGet(`/fabricantes/lista-nomes-responder-reclamacao/`)
      .reply(200, mockGetNomesFabricantesReclamacao);
  });

  it("Carrega no modo busca", async () => {
    await setup();

    const btnConsultar = screen.getByText("Consultar").closest("button");
    fireEvent.click(btnConsultar);

    await waitFor(() =>
      expect(
        screen.getByText("Veja os resultados para a busca:")
      ).toBeInTheDocument()
    );

    const nextButton = screen.getByLabelText("right");
    fireEvent.click(nextButton);

    const btnLimpar = screen.getByText("Limpar Filtro").closest("button");
    fireEvent.click(btnLimpar);

    await waitFor(() =>
      expect(
        screen.getByText("Veja os resultados para a busca:")
      ).toBeInTheDocument()
    );
  });

  it("Carrega com parametro de uuid como Terceirizada", async () => {
    await setup(mockGetReclamacaoUnica.results[0].uuid);

    await waitFor(() =>
      expect(
        screen.getByText("Veja os resultados para a busca:")
      ).toBeInTheDocument()
    );
    expect(screen.queryByText("Fabricante do Produto")).not.toBeInTheDocument();
    expect(screen.queryByText("Marca do Produto")).not.toBeInTheDocument();
  });

  it("Carrega com parametro de uuid como CODAE", async () => {
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    await setup(mockGetReclamacaoUnica.results[0].uuid);

    await waitFor(() =>
      expect(
        screen.getByText("Veja os resultados para a busca:")
      ).toBeInTheDocument()
    );
    expect(screen.queryByText("Fabricante do Produto")).not.toBeInTheDocument();
    expect(screen.queryByText("Marca do Produto")).not.toBeInTheDocument();
  });
});
