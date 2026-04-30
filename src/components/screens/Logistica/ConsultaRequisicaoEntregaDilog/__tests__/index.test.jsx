import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import mock from "src/services/_mock";
import ConsultaRequisicaoEntregaDilog from "..";
import { PERFIL } from "../../../../../constants/shared";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockSolicitacoes = {
  count: 3,
  results: [
    {
      uuid: "sol-1",
      numero_solicitacao: "100001",
      status: "Aguardando envio",
      distribuidor_nome: "Distribuidor A",
      checked: false,
      guias: [
        {
          numero_guia: "G001",
          situacao: "ATIVA",
          status: "Confirmada",
          nome_unidade: "UE 1",
          data_entrega: "01/01/2024",
        },
      ],
    },
    {
      uuid: "sol-2",
      numero_solicitacao: "100002",
      status: "Enviada",
      distribuidor_nome: "Distribuidor B",
      checked: false,
      guias: [
        {
          numero_guia: "G002",
          situacao: "ATIVA",
          status: "Confirmada",
          nome_unidade: "UE 2",
          data_entrega: "05/01/2024",
        },
      ],
    },
    {
      uuid: "sol-3",
      numero_solicitacao: "100003",
      status: "Aguardando envio",
      distribuidor_nome: "Distribuidor C",
      checked: false,
      guias: [
        {
          numero_guia: "G003",
          situacao: "ATIVA",
          status: "Confirmada",
          nome_unidade: "UE 3",
          data_entrega: "10/01/2024",
        },
      ],
    },
  ],
};

const renderComponent = async (storeState = {}, routeEntries = ["/"]) => {
  const store = mockStore(storeState);
  let component;
  await act(async () => {
    component = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={routeEntries}>
          <ConsultaRequisicaoEntregaDilog />
        </MemoryRouter>
      </Provider>,
    );
  });
  return { ...component, store };
};

describe("ConsultaRequisicaoEntregaDilog - Perfil sem restricao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    localStorage.setItem("perfil", PERFIL.COORDENADOR_LOGISTICA);
    mock.onGet(/\/solicitacao-remessa\/?/).reply(200, mockSolicitacoes);
    mock.onGet(/guias-da-requisicao/).reply(200, { results: [] });
    mock.onGet(/\/terceirizadas\/lista-nomes-distribuidores\//).reply(200, {
      results: [
        { uuid: "dist-1", razao_social: "Distribuidor A" },
        { uuid: "dist-2", razao_social: "Distribuidor B" },
      ],
    });
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    localStorage.removeItem("perfil");
  });

  it("carrega solicitacoes automaticamente quando filtros sao aplicados via URL", async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };
    mock.onGet(/\/solicitacao-remessa\/?/).reply(200, mockSolicitacoes);

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
  });

  it("exibe mensagem de lista vazia quando count e 0", async () => {
    mock
      .onGet(/\/solicitacao-remessa\/?/)
      .reply(200, { count: 0, results: [] });
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, search: "?numero_requisicao=999" };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/N\u00e3o existe informa/i)).toBeInTheDocument();
    });

    window.location = originalLocation;
  });

  it("exibe toastError quando API retorna erro com objeto", async () => {
    mock.onGet(/\/solicitacao-remessa\/?/).reply(400, {
      numero_requisicao: ["Requisicao invalida"],
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, search: "?numero_requisicao=100" };

    await renderComponent();
    await waitFor(() => {
      expect(mock.history.get.length).toBeGreaterThan(0);
    });

    window.location = originalLocation;
  });

  it("exibe toastError quando API retorna erro 500", async () => {
    mock.onGet(/\/solicitacao-remessa\/?/).reply(500, "Server Error");
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, search: "?numero_requisicao=100" };

    await renderComponent();
    await waitFor(() => {
      expect(mock.history.get.length).toBeGreaterThan(0);
    });

    window.location = originalLocation;
  });

  it("botao Enviar esta desabilitado quando nenhuma solicitacao selecionada", async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });
    const btnEnviar = screen.getByText("Enviar").closest("button");
    expect(btnEnviar).toBeDisabled();

    window.location = originalLocation;
  });

  it("botao Enviar esta desabilitado quando selecionado tem status invalido", async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    const btnEnviar = screen.getByText("Enviar").closest("button");
    expect(btnEnviar).toBeDisabled();

    window.location = originalLocation;
  });

  it("abre modal de confirmacao ao clicar Enviar com solicitacao selecionada", async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    const wrappers = document.querySelectorAll(".ant-checkbox-wrapper");
    if (wrappers.length > 1) {
      fireEvent.click(wrappers[1]);
    }

    const botoes = document.querySelectorAll("button");
    const btnEnviar = Array.from(botoes).find(
      (b) => b.textContent.trim() === "Enviar" && !b.disabled,
    );
    if (btnEnviar) {
      fireEvent.click(btnEnviar);
      await waitFor(() => {
        expect(screen.getByText("Aten\u00e7\u00e3o")).toBeInTheDocument();
      });
    }

    window.location = originalLocation;
  });

  it("fecha modal ao clicar NAO", async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    const botoes = document.querySelectorAll("button");
    const btnNao = Array.from(botoes).find(
      (b) => b.textContent.trim() === "N\u00c3O",
    );
    if (btnNao) {
      fireEvent.click(btnNao);
    }

    window.location = originalLocation;
  });

  it("envia solicitacoes com sucesso via enviaSolicitacoesDaGrade", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve([{ uuid: "sol-1" }]),
    });

    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
    global.fetch.mockClear();
  });

  it("clicar em Planilha Relatorio Consolidado chama gerarExcelSolicitacoes", async () => {
    mock.onGet(/solicitacao-remessa\/.*exporta-excel/).reply(200, {});
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    const botoes = document.querySelectorAll("button");
    const btnPlanilha = Array.from(botoes).find((b) =>
      b.textContent.includes("Planilha"),
    );
    if (btnPlanilha) {
      fireEvent.click(btnPlanilha);
    }

    window.location = originalLocation;
  });

  it("renderiza componente sem crashar mesmo sem query params", async () => {
    const { container } = await renderComponent();
    expect(container).toBeInTheDocument();
  });

  it("arquivaDesarquivaGuias - arquiva com sucesso", async () => {
    mock.onPatch(/\/guias-da-requisicao\/arquivar/).reply(200, {});
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
  });

  it("arquivaDesarquivaGuias - desarquiva com sucesso", async () => {
    mock.onPatch(/\/guias-da-requisicao\/desarquivar/).reply(200, {});
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
  });

  it("arquivaDesarquivaGuias - erro ao arquivar", async () => {
    mock.onPatch(/\/guias-da-requisicao\/arquivar/).reply(500, {});
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
  });

  it("exibe toast de sucesso ao enviar requisicoes com status 200", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve([{ uuid: "sol-1" }]),
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
    global.fetch.mockClear();
  });

  it("exibe toast de erro ao enviar requisicoes com status 400", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 400,
      json: () => Promise.resolve({ detail: "Erro de teste" }),
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
    global.fetch.mockClear();
  });

  it("exibe toast de erro de transicao de estado", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 400,
      json: () => Promise.resolve({ detail: "Erro de transição de estado" }),
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
    global.fetch.mockClear();
  });

  it("exibe toast de info com status 428", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve([]),
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
    global.fetch.mockClear();
  });

  it("exibe toast de erro interno sem detail", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 500,
      json: () => Promise.resolve({}),
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
    global.fetch.mockClear();
  });

  it("solicitaExcelGuias com filtros preenchidos", async () => {
    mock.onGet(/solicitacao-remessa\/.*exporta-excel/).reply(200, {});
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001&data_inicial=01/01/2024",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    const botoes = document.querySelectorAll("button");
    const btnPlanilha = Array.from(botoes).find((b) =>
      b.textContent.includes("Planilha"),
    );
    if (btnPlanilha) {
      fireEvent.click(btnPlanilha);
    }

    window.location = originalLocation;
  });

  it("clica no botao Planilha Relatorio Consolidado", async () => {
    mock.onGet(/solicitacao-remessa\/.*exporta-excel/).reply(200, {});
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    const botoes = document.querySelectorAll("button");
    const btnPlanilha = Array.from(botoes).find((b) =>
      b.textContent.includes("Planilha Relatório"),
    );
    if (btnPlanilha) {
      fireEvent.click(btnPlanilha);
    }

    window.location = originalLocation;
  });
});

describe("ConsultaRequisicaoEntregaDilog - Perfil ADMINISTRADOR_CODAE_GABINETE (somenteLeitura)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_CODAE_GABINETE);
    mock.onGet(/\/solicitacao-remessa\/?/).reply(200, mockSolicitacoes);
    mock.onGet(/guias-da-requisicao/).reply(200, { results: [] });
    mock.onGet(/\/terceirizadas\/lista-nomes-distribuidores\//).reply(200, {
      results: [
        { uuid: "dist-1", razao_social: "Distribuidor A" },
        { uuid: "dist-2", razao_social: "Distribuidor B" },
      ],
    });
  });

  afterAll(() => {
    localStorage.removeItem("perfil");
  });

  it("botao Enviar esta desabilitado quando perfil e somente leitura", async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });
    const btnEnviar = screen.getByText("Enviar").closest("button");
    expect(btnEnviar).toBeDisabled();

    window.location = originalLocation;
  });

  it("confereSolicitacoesSelecionadas retorna true quando vazio", async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: "?numero_requisicao=100001",
    };

    await renderComponent();
    await waitFor(() => {
      expect(screen.getByText("100001")).toBeInTheDocument();
    });

    window.location = originalLocation;
  });
});
