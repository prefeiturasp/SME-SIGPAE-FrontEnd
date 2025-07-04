import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { TIPO_PERFIL, TIPO_SOLICITACAO } from "src/constants/shared";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockPedidosCODAEInclusaoCEI } from "src/mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoCEI";
import { mockPedidosCODAEInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoContinua";
import { mockPedidosCODAEInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoNormal";
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
      (_, tipoSolicitacao) => {
        if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
          return Promise.resolve({
            results: mockPedidosCODAEInclusaoNormal.results,
            status: 200,
          });
        } else if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CONTINUA) {
          return Promise.resolve({
            results: mockPedidosCODAEInclusaoContinua.results,
            status: 200,
          });
        } else if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI) {
          return Promise.resolve({
            results: mockPedidosCODAEInclusaoCEI.results,
            status: 200,
          });
        } else if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEMEI) {
          return Promise.resolve({
            results: [],
            status: 200,
          });
        }
        return Promise.resolve({
          data: { results: [] },
          status: 500,
        });
      }
    );

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
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
        </MemoryRouter>
      );
    });
  });

  it("renderiza blocos de solicitações vencendo, limite e regular", async () => {
    await awaitServices();

    expect(
      screen.getByText(
        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
      )
    ).toBeInTheDocument();
    const divPrioritarios = screen.getByTestId("prioritario");
    expect(divPrioritarios).toHaveTextContent("1 escola solicitante");
    expect(divPrioritarios).toHaveTextContent("F85D5");
    expect(divPrioritarios).toHaveTextContent("017981");
    expect(divPrioritarios).toHaveTextContent(
      "EMEF PERICLES EUGENIO DA SILVA RAMOS"
    );
    expect(divPrioritarios).toHaveTextContent("30/01/2025");

    expect(
      screen.getByText("Solicitações no prazo limite")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitações no prazo regular")
    ).toBeInTheDocument();
  });

  it("busca por dre e por lote", async () => {
    await awaitServices();
    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-diretoria-regional")
          .querySelector(".ant-select-selection-search-input")
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
          .querySelector(".ant-select-selection-search-input")
      );
    });

    await waitFor(() => screen.getByText("BT - 1"));
    await act(async () => {
      fireEvent.click(screen.getByText("BT - 1"));
    });
  });
});
