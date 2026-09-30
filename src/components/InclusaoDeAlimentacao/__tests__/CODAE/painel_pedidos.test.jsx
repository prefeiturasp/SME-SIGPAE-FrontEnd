import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { FiltroEnum, TIPO_PERFIL } from "src/constants/shared";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { MemoryRouter } from "react-router-dom";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { codaeListarSolicitacoesDeInclusaoDeAlimentacao } from "src/services/inclusaoDeAlimentacao";
import { getLotesSimples } from "src/services/lote.service";
import Container from "../../CODAE/PainelPedidos/Container";

jest.mock("src/services/inclusaoDeAlimentacao");
jest.mock("src/services/lote.service");
jest.mock("src/services/diretoriaRegional.service");

const pedidoPrioritario = {
  uuid: "uuid-prioritario",
  id_externo: "PRIO01",
  prioridade: "PRIORITARIO",
  data_inicial: "30/01/2025",
  escola: {
    uuid: "escola-1",
    nome: "EMEF TESTE",
    codigo_eol: "000001",
  },
  solicitacoes_similares: [],
};

const pedidoLimite = {
  ...pedidoPrioritario,
  uuid: "uuid-limite",
  id_externo: "LIM01",
  prioridade: "LIMITE",
};

const pedidoRegular = {
  ...pedidoPrioritario,
  uuid: "uuid-regular",
  id_externo: "REG01",
  prioridade: "REGULAR",
};

const totais = { PRIORITARIO: 1, LIMITE: 1, REGULAR: 1 };

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiretoriaregionalSimplissima).toHaveBeenCalled();
    expect(getLotesSimples).toHaveBeenCalled();
  });
};

describe("Teste <Container> do Painel Pedidos - CODAE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: mockDiretoriaRegionalSimplissima,
      status: 200,
    });
    getLotesSimples.mockResolvedValue({
      data: mockLotesSimples,
      status: 200,
    });

    codaeListarSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(
      (filtro, params) => {
        if (params.prazo === "PRIORITARIO") {
          return Promise.resolve({
            count: 1,
            results: [pedidoPrioritario],
            escolas_solicitantes: 1,
            totais,
          });
        }
        if (params.prazo === "LIMITE") {
          return Promise.resolve({
            count: 1,
            results: [pedidoLimite],
            escolas_solicitantes: 1,
            totais,
          });
        }
        return Promise.resolve({
          count: 1,
          results: [pedidoRegular],
          escolas_solicitantes: 1,
          totais,
        });
      },
    );

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Container
            filtros={{ lotes: undefined, diretoria_regional: undefined }}
          />
        </MemoryRouter>,
      );
    });
  });

  it("renderiza blocos de solicitações vencendo, limite e regular", async () => {
    await awaitServices();
    await waitFor(() => screen.getByTestId("prioritario"));

    expect(
      screen.getByText(
        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)",
      ),
    ).toBeInTheDocument();
    const divPrioritarios = screen.getByTestId("prioritario");
    expect(divPrioritarios).toHaveTextContent("1 escola solicitante");
    expect(divPrioritarios).toHaveTextContent("PRIO01");
    expect(divPrioritarios).toHaveTextContent("000001");
    expect(divPrioritarios).toHaveTextContent("EMEF TESTE");

    expect(
      screen.getByText("Solicitações no prazo limite"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitações no prazo regular"),
    ).toBeInTheDocument();
  });

  it("busca por dre e por lote", async () => {
    await awaitServices();
    await waitFor(() => screen.getByTestId("select-diretoria-regional"));
    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-diretoria-regional")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    await waitFor(() => screen.getByText("IPIRANGA"));
    await act(async () => {
      fireEvent.click(screen.getByText("IPIRANGA"));
    });

    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-lote")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    await waitFor(() => screen.getByText("BT - 1"));
    await act(async () => {
      fireEvent.click(screen.getByText("BT - 1"));
    });
  });

  it("dispara busca com debounce após digitar termo", async () => {
    await awaitServices();
    await waitFor(() => screen.getByTestId("prioritario"));

    jest.useFakeTimers();
    fireEvent.change(screen.getByTestId("input-pesquisar-prioritario"), {
      target: { value: "EMEF" },
    });
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    await act(async () => {});

    expect(
      codaeListarSolicitacoesDeInclusaoDeAlimentacao,
    ).toHaveBeenLastCalledWith(
      FiltroEnum.SEM_FILTRO,
      expect.objectContaining({ busca: "EMEF", prazo: "PRIORITARIO" }),
    );
    jest.useRealTimers();
  });

  it("dispara busca quando o termo é esvaziado", async () => {
    await awaitServices();
    await waitFor(() => screen.getByTestId("prioritario"));

    jest.useFakeTimers();
    fireEvent.change(screen.getByTestId("input-pesquisar-prioritario"), {
      target: { value: "EMEF" },
    });
    fireEvent.change(screen.getByTestId("input-pesquisar-prioritario"), {
      target: { value: "" },
    });
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    await act(async () => {});

    expect(
      codaeListarSolicitacoesDeInclusaoDeAlimentacao,
    ).toHaveBeenLastCalledWith(
      FiltroEnum.SEM_FILTRO,
      expect.objectContaining({ prazo: "PRIORITARIO", page: 1 }),
    );
    jest.useRealTimers();
  });

  it("filtra opções da DRE e do lote pela busca", async () => {
    await awaitServices();
    await waitFor(() => screen.getByTestId("select-diretoria-regional"));

    fireEvent.change(
      screen
        .getByTestId("select-diretoria-regional")
        .querySelector(".ant-select-selection-search-input"),
      { target: { value: "IPIRANGA" } },
    );
    fireEvent.change(
      screen
        .getByTestId("select-lote")
        .querySelector(".ant-select-selection-search-input"),
      { target: { value: "BT" } },
    );
  });

  it("não dispara busca com termo de tamanho entre 1 e 2", async () => {
    await awaitServices();
    await waitFor(() => screen.getByTestId("prioritario"));

    const chamadasAntes =
      codaeListarSolicitacoesDeInclusaoDeAlimentacao.mock.calls.length;

    jest.useFakeTimers();
    fireEvent.change(screen.getByTestId("input-pesquisar-prioritario"), {
      target: { value: "EM" },
    });
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    await act(async () => {});

    expect(
      codaeListarSolicitacoesDeInclusaoDeAlimentacao.mock.calls.length,
    ).toBe(chamadasAntes);
    jest.useRealTimers();
  });
});

describe("Teste <PainelPedidos> com erro nos serviços - CODAE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      status: 500,
    });
    getLotesSimples.mockResolvedValue({
      status: 500,
    });

    codaeListarSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(() => {
      return Promise.resolve({
        count: 1,
        results: [pedidoRegular],
        escolas_solicitantes: 1,
        totais,
      });
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Container
            filtros={{ lotes: undefined, diretoria_regional: undefined }}
          />
        </MemoryRouter>,
      );
    });
  });

  it("renderiza sem listar lotes e diretorias regionais", async () => {
    await waitFor(() => screen.getByTestId("prioritario"));

    expect(
      screen.getByText("Solicitações no prazo regular"),
    ).toBeInTheDocument();
  });
});

describe("Teste <PainelPedidos> com paginação - CODAE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: mockDiretoriaRegionalSimplissima,
      status: 200,
    });
    getLotesSimples.mockResolvedValue({
      data: mockLotesSimples,
      status: 200,
    });

    codaeListarSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(() => {
      return Promise.resolve({
        count: 15,
        results: [pedidoPrioritario],
        escolas_solicitantes: 1,
        totais,
      });
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Container
            filtros={{ lotes: undefined, diretoria_regional: undefined }}
          />
        </MemoryRouter>,
      );
    });
  });

  it("navega entre páginas", async () => {
    await awaitServices();
    await waitFor(() => screen.getByTestId("prioritario"));

    fireEvent.click(document.querySelector(".ant-pagination-next"));

    await waitFor(() => {
      expect(
        codaeListarSolicitacoesDeInclusaoDeAlimentacao,
      ).toHaveBeenLastCalledWith(
        FiltroEnum.SEM_FILTRO,
        expect.objectContaining({ page: 2 }),
      );
    });
  });
});

describe("Teste <PainelPedidos> com resposta vazia - CODAE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: mockDiretoriaRegionalSimplissima,
      status: 200,
    });
    getLotesSimples.mockResolvedValue({
      data: mockLotesSimples,
      status: 200,
    });

    codaeListarSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(() => {
      return Promise.resolve({});
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Container
            filtros={{ lotes: undefined, diretoria_regional: undefined }}
          />
        </MemoryRouter>,
      );
    });
  });

  it("renderiza blocos sem solicitações", async () => {
    await awaitServices();
    await waitFor(() => screen.getByTestId("prioritario"));

    expect(
      screen.getByText(
        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitações no prazo regular"),
    ).toBeInTheDocument();
  });
});

describe("Teste <PainelPedidos> sem filtrosProps - CODAE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: mockDiretoriaRegionalSimplissima,
      status: 200,
    });
    getLotesSimples.mockResolvedValue({
      data: mockLotesSimples,
      status: 200,
    });

    codaeListarSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(() => {
      return Promise.resolve({
        count: 1,
        results: [pedidoRegular],
        escolas_solicitantes: 1,
        totais,
      });
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Container />
        </MemoryRouter>,
      );
    });
  });

  it("renderiza usando os filtros padrão", async () => {
    await awaitServices();
    await waitFor(() => screen.getByTestId("prioritario"));

    expect(
      screen.getByText("Solicitações no prazo regular"),
    ).toBeInTheDocument();
  });
});
