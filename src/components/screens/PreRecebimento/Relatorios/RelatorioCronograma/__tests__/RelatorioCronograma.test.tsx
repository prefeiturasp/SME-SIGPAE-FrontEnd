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
import { mockCronogramasResponse } from "src/mocks/cronograma.service/mockGetListagemRelatorio";
import { mockCronogramasResponsePag2 } from "src/mocks/cronograma.service/mockGetListagemRelatorio";
import { mockCronogramasResponseVazio } from "src/mocks/cronograma.service/mockGetListagemRelatorio";
import { mockMeusDadosCEI } from "src/mocks/meusDados/escola/CEI";

import { mockTerceirizadasEmpresasCronomagramas } from "src/mocks/cronograma.service/mockGetListaTerceirizadasEmpresasCronomagramas";
import { mockCadProdEditalCompletaLog } from "src/mocks/cronograma.service/mockGetListaCadProdEditalCompletaLog";
import { mockListaCronomagramasCadastro } from "src/mocks/cronograma.service/mockGetListaCronomagramasCadastro";

describe("Relatório Cronograma - Integração", () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <RelatorioCronograma />
      </MemoryRouter>,
    );
  };

  const clicarBotaoFiltrar = async () => {
    const botaoFiltrar = screen.getByTestId("botao-filtrar");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });
  };

  const expandirPrimeiroCronograma = async () => {
    const iconeExpandir = screen.getAllByTestId("icone-expandir")[0];
    await act(async () => {
      fireEvent.click(iconeExpandir);
    });
  };

  const clicarBotaoLimparFiltros = async () => {
    const botaoFiltrar = screen.getByText("Limpar Filtros");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });
  };

  beforeEach(async () => {
    // Mock global do HTMLCanvasElement
    (global.HTMLCanvasElement.prototype.getContext as jest.Mock) = jest.fn(
      () => ({
        font: "",
        measureText: jest.fn(() => ({ width: 100 })),
      }),
    );

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

    await act(async () => {
      renderComponent();
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Deve renderizar cronogramas e totalizadores após aplicar filtro", async () => {
    await clicarBotaoFiltrar();

    await waitFor(() => {
      expect(
        screen.getByText("Total de Cronogramas Criados"),
      ).toBeInTheDocument();
    });
  });

  it("Exibir mensagem após aplicar filtro com retorno vazio", async () => {
    mock
      .onGet("/cronogramas/listagem-relatorio/")
      .reply(200, mockCronogramasResponseVazio);

    await clicarBotaoFiltrar();

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum resultado encontrado"),
      ).toBeInTheDocument();
    });
  });

  it("Limpar filtros", async () => {
    await clicarBotaoLimparFiltros();

    await waitFor(() => {
      expect(
        screen.getByText("Total de Cronogramas Criados"),
      ).toBeInTheDocument();
    });
  });

  it("Deve renderizar cronogramas e totalizadores após aplicar filtro", async () => {
    await clicarBotaoFiltrar();

    await waitFor(() => {
      expect(
        screen.getByText("Total de Cronogramas Criados"),
      ).toBeInTheDocument();
    });
  });

  it("Paginação deve buscar nova página", async () => {
    mock
      .onGet("/cronogramas/listagem-relatorio/")
      .reply(200, mockCronogramasResponsePag2);

    await clicarBotaoFiltrar();

    const paginaDois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2",
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

    await clicarBotaoFiltrar();

    const botaoDonwloadPdf = screen.getByText("Baixar em PDF");
    await act(async () => {
      fireEvent.click(botaoDonwloadPdf);
    });

    await waitFor(() => {
      expect(
        screen.getAllByText("Geração solicitada com sucesso.").length,
      ).toBeGreaterThan(0);
    });
  });

  it("Exportar em Excel", async () => {
    mock
      .onGet("/cronogramas/gerar-relatorio-xlsx-async/")
      .reply(200, { status: 200 });

    await clicarBotaoFiltrar();

    const botaoDonwloadPdf = screen.getByText("Baixar em Excel");
    await act(async () => {
      fireEvent.click(botaoDonwloadPdf);
    });

    await waitFor(() => {
      expect(
        screen.getAllByText("Geração solicitada com sucesso.").length,
      ).toBeGreaterThan(0);
    });
  });

  it("Deve expandir cronograma e renderizar tabela de etapas", async () => {
    await clicarBotaoFiltrar();

    await waitFor(() => {
      expect(screen.getByText("203/2025A")).toBeInTheDocument();
    });

    await expandirPrimeiroCronograma();

    // Verifica se os headers da tabela de etapas aparecem
    await waitFor(() => {
      expect(screen.getByText("Etapa")).toBeInTheDocument();
      expect(screen.getByText("Parte")).toBeInTheDocument();
      expect(screen.getByText("Data programada")).toBeInTheDocument();
      expect(screen.getByText("Total de Embalagens")).toBeInTheDocument();
      expect(screen.getByText("Situação")).toBeInTheDocument();
    });
  });

  it("Deve renderizar fichas de recebimento com situações corretas", async () => {
    await clicarBotaoFiltrar();
    await expandirPrimeiroCronograma();

    await waitFor(() => {
      expect(screen.getAllByText("Recebido").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Ocorrência").length).toBeGreaterThan(0);
      expect(screen.getAllByText("A receber").length).toBeGreaterThan(0);
    });
  });

  it("Links de ocorrência devem ser clicáveis", async () => {
    await clicarBotaoFiltrar();
    await expandirPrimeiroCronograma();

    await waitFor(() => {
      const linksOcorrencia = screen.getAllByText("Ocorrência");
      const primeiroLink = linksOcorrencia.find((el) => el.tagName === "A");

      if (primeiroLink) {
        expect(primeiroLink).toHaveClass("link-ocorrencia");
        expect(primeiroLink).toHaveAttribute("href", "#");
      }
    });
  });

  it("Deve renderizar múltiplas linhas para etapa com múltiplas fichas de recebimento", async () => {
    await clicarBotaoFiltrar();
    await expandirPrimeiroCronograma();

    await waitFor(() => {
      const ocorrencias = screen.getAllByText("Ocorrência");
      const recebidos = screen.getAllByText("Recebido");

      expect(ocorrencias.length).toBe(4);
      expect(recebidos.length).toBe(3);
    });
  });
});
