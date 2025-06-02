import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import React from "react";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import RelatorioCronograma from "../index";
import { mockCronogramasResponse } from "mocks/cronograma.service/mockGetListagemRelatorio";
import { mockCronogramasResponsePag2 } from "mocks/cronograma.service/mockGetListagemRelatorio";
import { mockCronogramasResponseVazio } from "mocks/cronograma.service/mockGetListagemRelatorio";
import { mockMeusDadosCEI } from "mocks/meusDados/escola/CEI";

import { mockTerceirizadasEmpresasCronomagramas } from "mocks/cronograma.service/mockGetListaTerceirizadasEmpresasCronomagramas";
import { mockCadProdEditalCompletaLog } from "mocks/cronograma.service/mockGetListaCadProdEditalCompletaLog";
import { mockListaCronomagramasCadastro } from "mocks/cronograma.service/mockGetListaCronomagramasCadastro";

describe("Relatório Cronograma - Integração", () => {
  beforeEach(() => {
    mock.reset();
    mock
      .onGet("/terceirizadas/lista-empresas-cronograma/")
      .reply(200, mockTerceirizadasEmpresasCronomagramas);
    mock
      .onGet("/cadastro-produtos-edital/lista-completa-logistica/")
      .reply(200, mockCadProdEditalCompletaLog);

    mock
      .onGet("/cronogramas/lista-cronogramas-cadastro/")
      .reply(200, mockListaCronomagramasCadastro);

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCEI);

    mock
      .onGet("/cronogramas/listagem-relatorio/")
      .reply(200, mockCronogramasResponse);
  });

  it("Deve renderizar cronogramas e totalizadores após aplicar filtro", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <RelatorioCronograma />
        </MemoryRouter>
      );
    });

    const botaoFiltrar = screen.getByTestId("botao-filtrar");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Total de Cronogramas Criados")
      ).toBeInTheDocument();
    });
  });

  it("Exibir mensagem após aplicar filtro com retorno vazio", async () => {
    mock
      .onGet("/cronogramas/listagem-relatorio/")
      .reply(200, mockCronogramasResponseVazio);

    await act(async () => {
      render(
        <MemoryRouter>
          <RelatorioCronograma />
        </MemoryRouter>
      );
    });

    const botaoFiltrar = screen.getByTestId("botao-filtrar");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum resultado encontrado")
      ).toBeInTheDocument();
    });
  });

  it("Limpar filtros", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <RelatorioCronograma />
        </MemoryRouter>
      );
    });

    const botaoFiltrar = screen.getByText("Limpar Filtros");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Total de Cronogramas Criados")
      ).toBeInTheDocument();
    });
  });

  it("Deve renderizar cronogramas e totalizadores após aplicar filtro", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <RelatorioCronograma />
        </MemoryRouter>
      );
    });

    const botaoFiltrar = screen.getByTestId("botao-filtrar");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Total de Cronogramas Criados")
      ).toBeInTheDocument();
    });
  });

  it("Paginação deve buscar nova página", async () => {
    mock
      .onGet("/cronogramas/listagem-relatorio/")
      .reply(200, mockCronogramasResponsePag2);

    await act(async () => {
      render(
        <MemoryRouter>
          <RelatorioCronograma />
        </MemoryRouter>
      );
    });

    const botaoFiltrar = screen.getByTestId("botao-filtrar");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });

    const paginaDois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2"
    );
    fireEvent.click(paginaDois);

    await waitFor(() => {
      expect(screen.getAllByText("PITANGA").length).toBeGreaterThan(0);
      expect(screen.getAllByText("180/2024A").length).toBeGreaterThan(0);
    });
  });

  it("Exportar em PDF", async () => {
    mock
      .onGet("/cronogramas/gerar-relatorio-pdf-async/")
      .reply(200, { status: 200 });

    await act(async () => {
      render(
        <MemoryRouter>
          <RelatorioCronograma />
        </MemoryRouter>
      );
    });

    const botaoFiltrar = screen.getByTestId("botao-filtrar");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });

    const botaoDonwloadPdf = screen.getByText("Baixar em PDF");
    await act(async () => {
      fireEvent.click(botaoDonwloadPdf);
    });

    await waitFor(() => {
      expect(
        screen.getAllByText("Geração solicitada com sucesso.").length
      ).toBeGreaterThan(0);
    });
  });

  it("Exportar em Excel", async () => {
    mock
      .onGet("/cronogramas/gerar-relatorio-xlsx-async/")
      .reply(200, { status: 200 });

    await act(async () => {
      render(
        <MemoryRouter>
          <RelatorioCronograma />
        </MemoryRouter>
      );
    });

    const botaoFiltrar = screen.getByTestId("botao-filtrar");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });

    const botaoDonwloadPdf = screen.getByText("Baixar em Excel");
    await act(async () => {
      fireEvent.click(botaoDonwloadPdf);
    });

    await waitFor(() => {
      expect(
        screen.getAllByText("Geração solicitada com sucesso.").length
      ).toBeGreaterThan(0);
    });
  });
});
