import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import DocumentosRecebimentoPage from "src/pages/PreRecebimento/DocumentosRecebimentoPage";
import {
  mockListarDocumentosRecebimento,
  mockListarDocumentosRecebimentoVazio,
} from "src/mocks/services/documentosRecebimento.service/mockListarDocumentosRecebimento";
import { mockListaCronomagramasCadastro } from "src/mocks/cronograma.service/mockGetListaCronomagramasCadastro";
import { mockCadProdEditalCompletaLog } from "src/mocks/cronograma.service/mockGetListaCadProdEditalCompletaLog";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

jest.mock("src/components/Shareable/Toast/dialogs");
jest.mock("src/services/notificacoes.service");

const URL_LISTAGEM = "/documentos-de-recebimento/";
const URL_CRONOGRAMAS = "/cronogramas/lista-cronogramas-cadastro/";
const URL_PRODUTOS = "/cadastro-produtos-edital/lista-completa-logistica/";

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosDilogQualidade,
            setMeusDados: jest.fn(),
          }}
        >
          <DocumentosRecebimentoPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const clicarFiltrar = async () => {
  await act(async () => {
    fireEvent.click(screen.getByTestId("botao-filtrar"));
  });
};

const chamadasListagem = () =>
  mock.history.get.filter((c) => c.url === URL_LISTAGEM);

const ultimosParams = () =>
  chamadasListagem().at(-1)?.params as URLSearchParams;

describe("DocumentosRecebimentoPage", () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();

    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
    localStorage.setItem(
      "meusDados",
      JSON.stringify(mockMeusDadosDilogQualidade),
    );

    (getNotificacoes as jest.Mock).mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });
    (getQtdNaoLidas as jest.Mock).mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    mock.onGet(URL_CRONOGRAMAS).reply(200, mockListaCronomagramasCadastro);
    mock.onGet(URL_PRODUTOS).reply(200, mockCadProdEditalCompletaLog);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Listagem", () => {
    it("carrega e exibe os documentos ao abrir a página", async () => {
      mock.onGet(URL_LISTAGEM).reply(200, mockListarDocumentosRecebimento);

      await setup();

      expect(await screen.findByText("001/2024")).toBeInTheDocument();
      expect(screen.getByText("LAUDO-001")).toBeInTheDocument();
      expect(screen.getByText("PREGAO-001")).toBeInTheDocument();
      expect(screen.getByText("01/01/2024")).toBeInTheDocument();
      expect(screen.getByText("Aprovado")).toBeInTheDocument();

      expect(screen.getByText("002/2024")).toBeInTheDocument();
      expect(screen.getByText("Feijão Carioca")).toBeInTheDocument();
    });

    it("trunca o nome do produto com mais de 30 caracteres", async () => {
      mock.onGet(URL_LISTAGEM).reply(200, mockListarDocumentosRecebimento);

      await setup();

      expect(
        await screen.findByText("Arroz Parboilizado Tipo 1 Long..."),
      ).toBeInTheDocument();
    });

    it("exibe as ações", async () => {
      mock.onGet(URL_LISTAGEM).reply(200, mockListarDocumentosRecebimento);

      await setup();
      await screen.findByText("001/2024");

      expect(screen.getByTitle("Detalhar")).toBeInTheDocument();
      expect(screen.getByTitle("Baixar Laudo")).toBeInTheDocument();
      expect(screen.getByTitle("Corrigir")).toBeInTheDocument();
    });

    it("exibe 'Nenhum resultado encontrado' quando a lista vem vazia", async () => {
      mock.onGet(URL_LISTAGEM).reply(200, mockListarDocumentosRecebimentoVazio);

      await setup();

      expect(
        await screen.findByText("Nenhum resultado encontrado"),
      ).toBeInTheDocument();
    });

    it("exibe toast de erro e não renderiza a listagem quando a requisição falha", async () => {
      mock.onGet(URL_LISTAGEM).reply(500);

      await setup();

      await waitFor(() => expect(toastError).toHaveBeenCalled());
      expect(screen.queryByText("001/2024")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Nenhum resultado encontrado"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Filtros", () => {
    it("apresenta os campos de filtro com labels e placeholders corretos", async () => {
      mock.onGet(URL_LISTAGEM).reply(200, mockListarDocumentosRecebimento);

      await setup();
      await screen.findByText("Filtrar por Nome do Produto");

      expect(
        screen.getByText("Filtrar por Nº do Cronograma"),
      ).toBeInTheDocument();
      expect(screen.getByText("Filtrar por Status")).toBeInTheDocument();
      expect(
        screen.getByText("Filtrar por Data da Criação"),
      ).toBeInTheDocument();

      expect(screen.getByText("Selecione os Status")).toBeInTheDocument();
      expect(screen.getByText("Cadastrar Documentos")).toBeInTheDocument();
    });

    it("disponibiliza as opções de status", async () => {
      mock.onGet(URL_LISTAGEM).reply(200, mockListarDocumentosRecebimento);

      await setup();
      await screen.findByText("Filtrar por Status");

      await act(async () => {
        fireEvent.click(screen.getByText("Selecione os Status"));
      });

      expect(
        await screen.findByText("Enviado para Análise"),
      ).toBeInTheDocument();
      expect(screen.getByText("Solicitada Correção")).toBeInTheDocument();
      expect(screen.getAllByText("Aprovado").length).toBeGreaterThan(0);
    });

    it("aplica o filtro de status enviando o parâmetro na requisição", async () => {
      mock.onGet(URL_LISTAGEM).reply(200, mockListarDocumentosRecebimento);

      await setup();
      await screen.findByText("Filtrar por Status");

      await act(async () => {
        fireEvent.click(screen.getByText("Selecione os Status"));
      });
      await act(async () => {
        fireEvent.click(await screen.findByText("Enviado para Análise"));
      });
      await clicarFiltrar();

      await waitFor(() =>
        expect(ultimosParams().getAll("status")).toContain(
          "ENVIADO_PARA_ANALISE",
        ),
      );
    });

    it("refaz a busca ao limpar os filtros", async () => {
      mock.onGet(URL_LISTAGEM).reply(200, mockListarDocumentosRecebimento);

      await setup();
      await screen.findByText("001/2024");
      const antes = chamadasListagem().length;

      await act(async () => {
        fireEvent.click(screen.getByText("Limpar Filtros"));
      });

      await waitFor(() =>
        expect(chamadasListagem().length).toBeGreaterThan(antes),
      );
    });
  });
});
