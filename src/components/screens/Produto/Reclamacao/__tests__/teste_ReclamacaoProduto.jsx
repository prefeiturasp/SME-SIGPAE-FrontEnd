import React from "react";
import { act, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { TIPO_PERFIL } from "src/constants/shared";
import ReclamacaoProduto from "../index";
import mock from "src/services/_mock";
import { renderWithProvider } from "utils/test-utils";

import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";

import { mockGetNotificacoes } from "mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "mocks/services/notificacoes.service/mockGetQtdNaoLidas";

import { mockGetProdutosPorParametros } from "mocks/services/produto.service/mockGetProdutosPorParametros";
import { mockGetNomesUnicosEditais } from "mocks/services/produto.service/mockGetNomesUnicosEditais";
import { mockGetNovaReclamacaoNomesProdutos } from "mocks/services/produto.service/mockGetNovaReclamacaoNomesProdutos";
import { mockGetNovaReclamacaoNomesMarcas } from "mocks/services/produto.service/mockGetNovaReclamacaoNomesMarcas";
import { mockGetNovaReclamacaoNomesFabricantes } from "mocks/services/produto.service/mockGetNovaReclamacaoNomesFabricantes";
import { mockGetEscolaTercTotal } from "mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import { mockMeusDadosNutriSupervisao } from "mocks/meusDados/nutri-supervisao";

jest.mock("src/services/notificacoes.service");

describe("Teste <ReclamacaoProduto>", () => {
  beforeEach(async () => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);

    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });

    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    mock
      .onGet(`/fabricantes/lista-nomes-nova-reclamacao/`)
      .reply(200, mockGetNovaReclamacaoNomesFabricantes);
    mock
      .onGet(`/marcas/lista-nomes-nova-reclamacao/`)
      .reply(200, mockGetNovaReclamacaoNomesMarcas);
    mock
      .onGet(`/produtos/lista-nomes-nova-reclamacao/`)
      .reply(200, mockGetNovaReclamacaoNomesProdutos);
    mock
      .onGet(`/produtos-editais/lista-nomes-unicos/`)
      .reply(200, mockGetNomesUnicosEditais);
    mock
      .onGet(`/produtos/filtro-homologados-por-parametros/`)
      .reply(200, mockGetProdutosPorParametros);
    mock
      .onGet(`/usuarios/meus-dados/`)
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet(`/api/escolas-simplissima-com-dre-unpaginated/terc-total/`)
      .reply(200, mockGetEscolaTercTotal);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ReclamacaoProduto />
        </MemoryRouter>,
        {
          reclamacaoProduto: {},
          finalForm: {},
        }
      );
    });
  });

  it("Testa a renderização dos elementos da página e botão 'Limpar Filtros'", async () => {
    await waitFor(() => {
      const inputEdital = screen.getByTestId("edital").querySelector("input");
      expect(inputEdital).toBeInTheDocument();
      expect(inputEdital).toBeDisabled();
      expect(inputEdital).toHaveValue("Edital de Pregão n°70/SME/2022");
    });

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId("produto").querySelector("input"));
    });

    await waitFor(() => screen.getAllByText("ABACATE"));
    await act(async () => {
      fireEvent.click(screen.getAllByText("ABACATE")[1]);
    });

    const botaoLimparFiltros = screen
      .getByText("Limpar Filtros")
      .closest("button");
    fireEvent.click(botaoLimparFiltros);

    const inputProduto = screen.getByTestId("produto").querySelector("input");
    expect(inputProduto).toHaveValue("");
  });

  it("Testa a operação de Consulta e TabelaResultados", async () => {
    await waitFor(() => {
      const inputEdital = screen.getByTestId("edital").querySelector("input");
      expect(inputEdital).toBeInTheDocument();
      expect(inputEdital).toBeDisabled();
      expect(inputEdital).toHaveValue("Edital de Pregão n°70/SME/2022");
    });

    const botaoConsultar = screen.getByText("Consultar").closest("button");
    await act(async () => {
      fireEvent.click(botaoConsultar);
    });
  });
});

describe("Teste <ReclamacaoProduto> - Perfil Nutri Supervisão", () => {
  beforeEach(async () => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.SUPERVISAO_NUTRICAO);

    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });

    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    mock
      .onGet(`/fabricantes/lista-nomes-nova-reclamacao/`)
      .reply(200, mockGetNovaReclamacaoNomesFabricantes);
    mock
      .onGet(`/marcas/lista-nomes-nova-reclamacao/`)
      .reply(200, mockGetNovaReclamacaoNomesMarcas);
    mock
      .onGet(`/produtos/lista-nomes-nova-reclamacao/`)
      .reply(200, mockGetNovaReclamacaoNomesProdutos);
    mock
      .onGet(`/produtos-editais/lista-nomes-unicos/`)
      .reply(200, mockGetNomesUnicosEditais);
    mock
      .onGet(`/produtos/filtro-homologados-por-parametros/`)
      .reply(200, mockGetProdutosPorParametros);
    mock
      .onGet(`/usuarios/meus-dados/`)
      .reply(200, mockMeusDadosNutriSupervisao);
    mock
      .onGet(`/escolas-simplissima-com-dre-unpaginated/terc-total/`)
      .reply(200, mockGetEscolaTercTotal);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ReclamacaoProduto />
        </MemoryRouter>,
        {
          reclamacaoProduto: {},
          finalForm: {},
        }
      );
    });
  });

  it("Testa se o campo 'Edital' renderiza vazio e habilitado para seleção", async () => {
    const inputEdital = screen.getByTestId("edital").querySelector("input");
    expect(inputEdital).toBeInTheDocument();
    expect(inputEdital).not.toBeDisabled();

    const botaoConsultar = screen.getByText("Consultar").closest("button");
    expect(botaoConsultar).toBeDisabled();

    await act(async () => {
      fireEvent.mouseDown(inputEdital);
    });

    await waitFor(() => screen.getAllByText("Edital de Pregão n°70/SME/2022"));
    await act(async () => {
      fireEvent.click(screen.getAllByText("Edital de Pregão n°70/SME/2022")[1]);
    });
  });
});
