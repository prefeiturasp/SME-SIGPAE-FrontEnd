import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { TIPO_PERFIL } from "src/constants/shared";
import { mockDiretoriaRegionalSimplissima } from "mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockPedidosCODAEInclusaoNormalSolicitacoesSimilares } from "mocks/InclusaoAlimentacao/EMEF/pedidosCODAEInclusaoNormalSolicitacoesSimilares";
import { mockPedidosCODAEInclusaoCEI } from "mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoCEI";
import { mockPedidosCODAEInclusaoContinua } from "mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoContinua";
import { localStorageMock } from "mocks/localStorageMock";
import { mockLotesSimples } from "mocks/lote.service/mockLotesSimples";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import Container from "../../CODAE/PainelPedidos/Container";

describe("Teste <Container> do Painel Pedidos - CODAE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockDiretoriaRegionalSimplissima);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/inclusoes-alimentacao-da-cei/pedidos-codae/sem_filtro/")
      .reply(200, mockPedidosCODAEInclusaoCEI);
    mock
      .onGet("/inclusoes-alimentacao-cemei/pedidos-codae/sem_filtro/")
      .reply(200, { count: 0, next: null, previous: null, results: [] });
    mock
      .onGet("/grupos-inclusao-alimentacao-normal/pedidos-codae/sem_filtro/")
      .reply(200, mockPedidosCODAEInclusaoNormalSolicitacoesSimilares);
    mock
      .onGet("/inclusoes-alimentacao-continua/pedidos-codae/sem_filtro/")
      .reply(200, mockPedidosCODAEInclusaoContinua);

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

  it("renderiza solicitações similares", async () => {
    expect(
      screen.getByText(
        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitações no prazo limite")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitações no prazo regular")
    ).toBeInTheDocument();

    expect(screen.getByText("B4310")).toBeInTheDocument();
    expect(screen.queryAllByText("Dia(s) de inclusão:")).toHaveLength(2);
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("expande collapse solicitações similares", async () => {
    const spanToggleExpandirSolicitacaoSimilar = screen.getByTestId(
      "regular-toggle-expandir-3-0"
    );
    fireEvent.click(spanToggleExpandirSolicitacaoSimilar);
    const icon = spanToggleExpandirSolicitacaoSimilar.querySelector("i");
    expect(icon).toHaveClass("fa-chevron-up");
  });

  it("retrair collapse de fora", async () => {
    const spanToggleExpandirRegular = screen.getByTestId(
      "toggle-expandir-regular"
    );
    fireEvent.click(spanToggleExpandirRegular);
    const icon = spanToggleExpandirRegular.querySelector("i");
    expect(icon).toHaveClass("fa-chevron-down");
  });

  it("pesquisa solicitação por id_externo", async () => {
    const inputPesquisar = screen.getByTestId("input-pesquisar-regular");
    fireEvent.change(inputPesquisar, {
      target: { value: "B4310" },
    });
    await waitFor(() => {
      expect(screen.queryByText("#B4310")).not.toBeInTheDocument();
    });
  });

  it("pesquisa solicitação (vazio)", async () => {
    const inputPesquisar = screen.getByTestId("input-pesquisar-regular");
    fireEvent.change(inputPesquisar, {
      target: { value: "" },
    });
    await waitFor(() => {
      expect(screen.queryAllByText("#B4310")).toHaveLength(2);
    });
  });
});
