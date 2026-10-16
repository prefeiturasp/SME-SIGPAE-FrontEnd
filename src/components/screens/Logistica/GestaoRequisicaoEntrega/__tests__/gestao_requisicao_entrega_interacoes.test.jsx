import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import GestaoRequisicaoEntrega from "src/components/screens/Logistica/GestaoRequisicaoEntrega";
import { CentralDeDownloadContext } from "src/context/CentralDeDownloads";
import { mockGetSolicitacoesDisponibilizadas } from "src/mocks/services/disponibilizacaoDeSolicitacoes.service/mockGetSolicitacoesDisponibilizadas";
import mock from "src/services/_mock";

const URL_LISTAGEM = "/solicitacao-remessa/";
const URL_CANCELAMENTO = "/solicitacao-remessa/confirmar-cancelamento/";
const URL_PDF_GERAL = "/solicitacao-remessa/gerar-pdf-distribuidor-geral/";
const URL_EXCEL = "/solicitacao-remessa/exporta-excel-visao-analitica/";

const guiaBase = mockGetSolicitacoesDisponibilizadas.results[0].guias[0];

const solicitacaoEnviada = {
  uuid: "uuid-enviada",
  numero_solicitacao: "20001",
  distribuidor_nome: "Distribuidor Enviada",
  status: "Enviada",
  situacao: "ATIVA",
  guias: [{ ...guiaBase, uuid: "guia-1", numero_guia: "G-1" }],
};

const solicitacaoAguardandoCancelamento = {
  uuid: "uuid-aguardando",
  numero_solicitacao: "20002",
  distribuidor_nome: "Distribuidor Aguardando",
  status: "Confirmada",
  situacao: "ATIVA",
  guias: [
    {
      ...guiaBase,
      uuid: "guia-2",
      numero_guia: "G-2",
      status: "Aguardando cancelamento",
    },
    { ...guiaBase, uuid: "guia-3", numero_guia: "G-3", status: "Recebida" },
  ],
};

const respostaListagem = {
  count: 2,
  num_confirmadas: 1,
  results: [solicitacaoEnviada, solicitacaoAguardandoCancelamento],
};

const mockStore = configureStore([thunk]);

describe("Interações da tela Gestão de Requisição de Entrega", () => {
  const store = mockStore({});
  const getQtdeDownloadsNaoLidas = jest.fn();

  const renderTela = async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Provider store={store}>
            <CentralDeDownloadContext.Provider
              value={{ getQtdeDownloadsNaoLidas }}
            >
              <ToastContainer />
              <GestaoRequisicaoEntrega />
            </CentralDeDownloadContext.Provider>
          </Provider>
        </MemoryRouter>,
      );
    });
  };

  const consultar = async () => {
    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-consultar"));
    });
  };

  const consultarComResultados = async (resposta = respostaListagem) => {
    mock.onGet(URL_LISTAGEM).reply(200, resposta);
    await renderTela();
    await consultar();
    await screen.findByText("Requisições Disponibilizadas");
  };

  const requisicoesListagem = () =>
    mock.history.get.filter((req) => req.url === URL_LISTAGEM);

  const clicar = async (elemento) => {
    await act(async () => {
      fireEvent.click(elemento);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    cleanup();
    window.history.pushState({}, "", "/");
  });

  describe("Consulta de requisições", () => {
    it("lista as requisições e rola até o início do resultado", async () => {
      await consultarComResultados();

      expect(screen.getByText("20001")).toBeInTheDocument();
      expect(screen.getByText("20002")).toBeInTheDocument();
      expect(screen.getByText("1 guia")).toBeInTheDocument();
      expect(screen.getByText("2 guias")).toBeInTheDocument();
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(
        1,
      );
      expect(requisicoesListagem()).toHaveLength(1);
      expect(requisicoesListagem()[0].params.get("page")).toBe("1");
    });

    it("exibe mensagem quando a consulta não retorna resultados", async () => {
      mock.onGet(URL_LISTAGEM).reply(200, { count: 0, results: [] });
      await renderTela();
      await consultar();

      expect(
        await screen.findByText(
          "Não existe informação para os critérios de busca utilizados.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Requisições Disponibilizadas"),
      ).not.toBeInTheDocument();
    });

    it("busca automaticamente quando há numero_requisicao na URL", async () => {
      window.history.pushState({}, "", "/?numero_requisicao=20001");
      mock.onGet(URL_LISTAGEM).reply(200, respostaListagem);
      await renderTela();

      expect(
        await screen.findByText("Requisições Disponibilizadas"),
      ).toBeInTheDocument();
      expect(requisicoesListagem()).toHaveLength(1);
      expect(requisicoesListagem()[0].params.get("numero_requisicao")).toBe(
        "20001",
      );
      expect(screen.getByTestId("numero-requisicao")).toHaveValue("20001");
    });

    it("não busca automaticamente quando não há parâmetros na URL", async () => {
      await renderTela();

      expect(requisicoesListagem()).toHaveLength(0);
    });

    it("busca a página selecionada na paginação", async () => {
      await consultarComResultados({ ...respostaListagem, count: 25 });

      await clicar(screen.getByText("2"));

      await waitFor(() => expect(requisicoesListagem()).toHaveLength(2));
      expect(requisicoesListagem()[1].params.get("page")).toBe("2");
    });

    it("limpa a listagem ao clicar em Limpar Filtros", async () => {
      await consultarComResultados();

      await clicar(screen.getByTestId("botao-limpar"));

      expect(
        screen.queryByText("Requisições Disponibilizadas"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Erros na consulta", () => {
    it("exibe a primeira mensagem quando o erro retorna uma lista", async () => {
      mock
        .onGet(URL_LISTAGEM)
        .reply(400, { numero_requisicao: ["Número inválido", "Outro erro"] });
      await renderTela();
      await consultar();

      expect(await screen.findByText("Número inválido")).toBeInTheDocument();
      expect(screen.queryByText("Outro erro")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Requisições Disponibilizadas"),
      ).not.toBeInTheDocument();
    });

    it("exibe a mensagem quando o erro retorna um texto dentro do objeto", async () => {
      mock.onGet(URL_LISTAGEM).reply(400, { detail: "Mensagem do servidor" });
      await renderTela();
      await consultar();

      expect(
        await screen.findByText("Mensagem do servidor"),
      ).toBeInTheDocument();
    });

    it("exibe erro genérico quando a resposta de erro não é um objeto", async () => {
      mock.onGet(URL_LISTAGEM).reply(500, "Internal Server Error");
      await renderTela();
      await consultar();

      expect(
        await screen.findByText("Erro do Servidor Interno"),
      ).toBeInTheDocument();
    });

    it("não exibe toast quando o erro não possui resposta", async () => {
      mock.onGet(URL_LISTAGEM).networkError();
      await renderTela();
      await consultar();

      expect(requisicoesListagem()).toHaveLength(1);
      expect(
        screen.queryByText("Erro do Servidor Interno"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Requisições Disponibilizadas"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Cancelamento de guias", () => {
    const abrirModalCancelamento = async () => {
      await clicar(screen.getByLabelText("Guias da requisição 20002"));
      await clicar(screen.getByText("Confirmar Cancelamento"));
    };

    it("cancela as guias aguardando cancelamento e atualiza a tabela", async () => {
      mock.onPost(URL_CANCELAMENTO).reply(200, {});
      await consultarComResultados();
      await abrirModalCancelamento();

      await clicar(screen.getByText("SIM"));

      expect(
        await screen.findByText("Guia(s) de Remessa cancelada(s) com sucesso"),
      ).toBeInTheDocument();
      expect(JSON.parse(mock.history.post[0].data)).toEqual({
        guias: ["G-2"],
        numero_requisicao: "20002",
      });
      await waitFor(() => expect(requisicoesListagem()).toHaveLength(2));
      expect(requisicoesListagem()[1].params.get("page")).toBe("1");
      await waitFor(() =>
        expect(screen.queryByText("SIM")).not.toBeInTheDocument(),
      );
    });

    it("exibe mensagem de erro quando a resposta não é 200", async () => {
      mock.onPost(URL_CANCELAMENTO).reply(201, {});
      await consultarComResultados();
      await abrirModalCancelamento();

      await clicar(screen.getByText("SIM"));

      expect(
        await screen.findByText("Erro ao arquivar a guia"),
      ).toBeInTheDocument();
      expect(requisicoesListagem()).toHaveLength(1);
      expect(screen.getByText("SIM")).toBeInTheDocument();
    });
  });

  describe("Confirmação de requisição", () => {
    it("atualiza a página atual após confirmar a requisição", async () => {
      mock
        .onPatch(
          `/solicitacao-remessa/${solicitacaoEnviada.uuid}/distribuidor-confirma/`,
        )
        .reply(200, {});
      await consultarComResultados();

      await clicar(screen.getAllByText("Confirmar")[0]);
      await clicar(screen.getByText("Sim"));

      expect(
        await screen.findByText("A Confirmação foi realizada com sucesso!"),
      ).toBeInTheDocument();
      await waitFor(() => expect(requisicoesListagem()).toHaveLength(2));
      expect(requisicoesListagem()[1].params.get("page")).toBe("1");
    });
  });

  describe("Downloads", () => {
    it("solicita o PDF de uma requisição e abre o modal de download", async () => {
      mock
        .onGet(
          `/solicitacao-remessa/${solicitacaoEnviada.uuid}/gerar-pdf-distribuidor/`,
        )
        .reply(200, {});
      await consultarComResultados();

      await clicar(screen.getAllByText("PDF")[0]);

      expect(
        await screen.findByText("Geração solicitada com sucesso."),
      ).toBeInTheDocument();
      expect(getQtdeDownloadsNaoLidas).toHaveBeenCalledTimes(1);
    });

    it("solicita o PDF das requisições confirmadas e abre o modal de download", async () => {
      mock.onGet(URL_PDF_GERAL).reply(200, new Blob(["pdf"]));
      await consultarComResultados();

      await clicar(screen.getByText("Exportar Requisições Confirmadas"));

      expect(
        await screen.findByText("Geração solicitada com sucesso."),
      ).toBeInTheDocument();
      expect(getQtdeDownloadsNaoLidas).toHaveBeenCalledTimes(1);
      const requisicao = mock.history.get.find(
        (req) => req.url === URL_PDF_GERAL,
      );
      expect(requisicao.params.get("page")).toBeNull();
      expect(requisicao.params.getAll("status")).toEqual(
        expect.arrayContaining(["DILOG_ENVIA", "CANCELADA"]),
      );
    });

    it("desabilita a exportação de confirmadas quando não há requisições confirmadas", async () => {
      await consultarComResultados({ ...respostaListagem, num_confirmadas: 0 });

      expect(
        screen.getByText("Exportar Requisições Confirmadas").closest("button"),
      ).toBeDisabled();
    });

    it("habilita a exportação de confirmadas quando há requisições confirmadas", async () => {
      await consultarComResultados();

      expect(
        screen.getByText("Exportar Requisições Confirmadas").closest("button"),
      ).not.toBeDisabled();
    });

    it("solicita a planilha consolidada e abre o modal de download", async () => {
      mock.onGet(URL_EXCEL).reply(200, {});
      await consultarComResultados();

      await clicar(screen.getByText("Planilha Relatório Consolidado"));

      expect(
        await screen.findByText("Geração solicitada com sucesso."),
      ).toBeInTheDocument();
      expect(getQtdeDownloadsNaoLidas).toHaveBeenCalledTimes(1);
    });

    it("fecha o modal de download ao clicar em Fechar", async () => {
      mock.onGet(URL_EXCEL).reply(200, {});
      await consultarComResultados();
      await clicar(screen.getByText("Planilha Relatório Consolidado"));
      await screen.findByText("Geração solicitada com sucesso.");

      await clicar(screen.getByText("Fechar"));

      await waitFor(() =>
        expect(
          screen.queryByText("Geração solicitada com sucesso."),
        ).not.toBeInTheDocument(),
      );
    });
  });
});
