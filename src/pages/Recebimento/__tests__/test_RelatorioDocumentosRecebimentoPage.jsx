import React from "react";
import {
  render,
  act,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import RelatorioDocumentosRecebimentoPage from "src/pages/Recebimento/Relatorios/RelatorioDocumentosRecebimentoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

import { mockGetListaEmpresasCronograma } from "src/mocks/services/terceirizada.service/mockGetListaEmpresasCronograma";
import { mockListaProdutosLogistica } from "src/mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import { mockListaCronomagramasCadastro } from "src/mocks/cronograma.service/mockGetListaCronomagramasCadastro";
import { mockMeusDadosCoordCodaeDilogLogistica } from "src/mocks/meusDados/CODAE/coord-codae-dilog-logistica";
import { mockGetListagemRelatorio } from "src/mocks/services/documentosRecebimento.service/mockGetListagemRelatorioDocsRecebimento";

const mockGetListagemRelatorioFiltrado = {
  count: 1,
  results: [
    {
      uuid: "a1e61f58-acb1-41b2-b3b8-749f475bf5bb",
      numero_cronograma: "156/2024A",
      produto: "CALDO",
      empresa: "JP Alimentos LTDA",
      numero_pregao_chamada_publica: "12345",
      numero_processo_sei: "834783478",
      documentos: [
        {
          uuid: "57816da7-7bb9-49b1-b0e2-b7281330c9e2",
          numero_laudo: "12345",
          nome_laboratorio: "TESTES LABI",
          numero_lote_laudo: "1234567",
          data_final_lote: "20/11/2025",
          unidade_medida: "l",
          quantidade_laudo: "200.00",
          saldo_inicial_laudo: "200.00",
          saldo_atual: 200.0,
          datas_fabricacao_e_prazos: [
            {
              uuid: "2aa96c1a-0dc3-4677-a023-cc41d617ceae",
              data_fabricacao: "30/10/2025",
              data_validade: "31/12/2025",
              data_maxima_recebimento: "29/11/2025",
              prazo_maximo_recebimento: "30",
              justificativa: "",
            },
          ],
          status_documento: "Aprovado",
        },
      ],
    },
  ],
  totalizadores: {
    "Total de Documentos Recebidos": 1,
    "Total de Pendentes de Aprovação": 0,
    "Total de Enviados para Correção": 0,
    "Total de Aprovados": 1,
  },
};

const setupTest = async () => {
  localStorage.setItem("perfil", PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.LOGISTICA);

  mock
    .onGet("/terceirizadas/lista-empresas-cronograma/")
    .reply(200, mockGetListaEmpresasCronograma);

  mock
    .onGet("/cadastro-produtos-edital/lista-completa-logistica/")
    .reply(200, mockListaProdutosLogistica);

  mock
    .onGet("/cronogramas/lista-cronogramas-cadastro/")
    .reply(200, mockListaCronomagramasCadastro);

  mock
    .onGet("documentos-de-recebimento/listagem-relatorio/")
    .reply(200, mockGetListagemRelatorio);

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
            meusDados: mockMeusDadosCoordCodaeDilogLogistica,
            setMeusDados: jest.fn(),
          }}
        >
          <RelatorioDocumentosRecebimentoPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Teste da página de Relatório de Documentos de Recebimento", () => {
  beforeEach(async () => {
    await setupTest();
  });

  it("testa o carregamento da tabela e dos totalizadores", async () => {
    await waitFor(() => {
      expect(screen.getByText("Resultado da Pesquisa")).toBeInTheDocument();
    });

    // Totalizadores
    expect(
      screen.getByText("Total de Documentos Recebidos"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Total de Pendentes de Aprovação"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Total de Enviados para Correção"),
    ).toBeInTheDocument();
    expect(screen.getByText("Total de Aprovados")).toBeInTheDocument();

    // Cabeçalhos
    expect(screen.getByText("Nº do Cronograma")).toBeInTheDocument();
    expect(screen.getByText("Produto")).toBeInTheDocument();
    expect(
      screen.getByText("Nº do Pregão / Chamada Pública"),
    ).toBeInTheDocument();
    expect(screen.getByText("Nº do Processo SEI")).toBeInTheDocument();

    // Linha da tabela
    expect(screen.getByText("003/2026A")).toBeInTheDocument();
    expect(screen.getByText("MAMAO PAPAYA")).toBeInTheDocument();
  });

  it("limpa os filtros ao clicar em 'Limpar Filtros'", async () => {
    await waitFor(() => {
      expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
    });

    const botaoLimpar = screen.getByText("Limpar Filtros");
    fireEvent.click(botaoLimpar);

    await waitFor(() => {
      const inputs = document.querySelectorAll(
        "input[type='text'], input:not([type])",
      );
      inputs.forEach((input) => {
        expect(input.value).toBe("");
      });
    });
  });

  it("filtra a listagem ao clicar em 'Filtrar'", async () => {
    mock
      .onGet("documentos-de-recebimento/listagem-relatorio/")
      .reply(200, mockGetListagemRelatorioFiltrado);

    await waitFor(() => {
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    const botaoFiltrar = screen.getByText("Filtrar");
    await act(async () => {
      fireEvent.click(botaoFiltrar);
    });

    await waitFor(() => {
      expect(screen.getByText("156/2024A")).toBeInTheDocument();
      expect(screen.getByText("CALDO")).toBeInTheDocument();
      expect(screen.queryByText("MAMAO PAPAYA")).not.toBeInTheDocument();
    });
  });

  it("exibe os dados internos do documento ao expandir a primeira linha", async () => {
    await waitFor(() => {
      expect(screen.getByText("003/2026A")).toBeInTheDocument();
    });

    // Expandir a primeira linha
    const icones = screen.getAllByTestId("icone-expandir");
    fireEvent.click(icones[0]);

    await waitFor(() => {
      expect(screen.getByText("Nº do Laudo")).toBeInTheDocument();
      expect(screen.getByText("Nome do Laboratório")).toBeInTheDocument();
      expect(screen.getByText("Nº do Lote do Laudo")).toBeInTheDocument();
      expect(screen.getByText("Quantidade do Laudo")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();

      expect(screen.getByText("9879")).toBeInTheDocument();
      expect(screen.getByText("Enviado para Análise")).toBeInTheDocument();
    });
  });
});
