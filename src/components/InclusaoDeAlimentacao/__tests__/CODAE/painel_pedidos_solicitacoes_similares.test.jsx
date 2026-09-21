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
import { mockPedidosCODAEInclusaoNormalSolicitacoesSimilares } from "src/mocks/InclusaoAlimentacao/EMEF/pedidosCODAEInclusaoNormalSolicitacoesSimilares";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { codaeListarSolicitacoesDeInclusaoDeAlimentacao } from "src/services/inclusaoDeAlimentacao";
import Container from "../../CODAE/PainelPedidos/Container";

jest.mock("src/services/inclusaoDeAlimentacao");

const totaisVazios = { PRIORITARIO: 0, LIMITE: 0, REGULAR: 0 };

describe("Teste <Container> do Painel Pedidos - CODAE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockDiretoriaRegionalSimplissima);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);

    codaeListarSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(
      (filtro, params) => {
        if (params.prazo === "REGULAR") {
          return Promise.resolve({
            count: 2,
            results:
              mockPedidosCODAEInclusaoNormalSolicitacoesSimilares.results,
            escolas_solicitantes: 1,
            totais: { PRIORITARIO: 0, LIMITE: 0, REGULAR: 2 },
          });
        }
        return Promise.resolve({
          count: 0,
          results: [],
          escolas_solicitantes: 0,
          totais: totaisVazios,
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

  it("renderiza solicitações similares", async () => {
    await waitFor(() => screen.getByTestId("regular"));

    expect(
      screen.getByText(
        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitações no prazo limite"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitações no prazo regular"),
    ).toBeInTheDocument();

    expect(screen.getByText("B4310")).toBeInTheDocument();
    expect(screen.queryAllByText("Dia(s) de inclusão:")).toHaveLength(2);
  });

  it("expande collapse solicitações similares", async () => {
    await waitFor(() => screen.getByTestId("regular"));

    const spanToggleExpandirSolicitacaoSimilar = screen.getByTestId(
      "regular-toggle-expandir-0-0",
    );
    fireEvent.click(spanToggleExpandirSolicitacaoSimilar);
    const icon = spanToggleExpandirSolicitacaoSimilar.querySelector("i");
    expect(icon).toHaveClass("fa-chevron-up");
  });

  it("retrair collapse de fora", async () => {
    await waitFor(() => screen.getByTestId("regular"));

    const spanToggleExpandirRegular = screen.getByTestId(
      "toggle-expandir-regular",
    );
    fireEvent.click(spanToggleExpandirRegular);
    const icon = spanToggleExpandirRegular.querySelector("i");
    expect(icon).toHaveClass("fa-chevron-down");
  });
});
