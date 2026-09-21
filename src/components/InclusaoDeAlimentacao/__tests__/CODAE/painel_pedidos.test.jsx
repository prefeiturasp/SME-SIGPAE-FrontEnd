import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { TIPO_PERFIL } from "src/constants/shared";
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
});
