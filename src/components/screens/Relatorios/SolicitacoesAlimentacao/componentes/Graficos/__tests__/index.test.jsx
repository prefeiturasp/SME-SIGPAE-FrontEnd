import { act, render, screen, waitFor } from "@testing-library/react";
import { CORES } from "src/components/Shareable/Graficos/constants";
import { STATUS_SOLICITACOES } from "src/components/screens/Relatorios/SolicitacoesAlimentacao/constants";
import { mockFiltrosSuspensao } from "src/mocks/Relatorios/SolicitacoesAlimentacao/mockFiltrosSuspensao";
import { mockSolicitacoesGraficos } from "src/mocks/services/relatorios.service/mockGetSolicitacoesGraficos";
import mock from "src/services/_mock";
import { Graficos } from "../index";

jest.mock("../components/GraficoSolicitacoesAutorizadasDRELote", () => ({
  GraficoSolicitacoesAutorizadasDRELote: ({ chartData }) => (
    <div data-testid="grafico-dre-lote">{chartData.datasets[0].label}</div>
  ),
}));

jest.mock(
  "../components/GraficoSolicitacoesAutorizadasTipoSolicitacao",
  () => ({
    GraficoSolicitacoesAutorizadasTipoSolicitacao: ({ chartData }) => (
      <div data-testid="grafico-tipo">{chartData.datasets[0].label}</div>
    ),
  }),
);

jest.mock("../components/GraficoSolicitacoesStatus", () => ({
  GraficoSolicitacoesStatus: ({ chartData }) => (
    <div data-testid="grafico-status">{chartData.datasets[0].label}</div>
  ),
}));

jest.mock("../components/GraficoSolicitacoesAutorizadasTipoUnidade", () => ({
  GraficoSolicitacoesAutorizadasTipoUnidade: ({ chartData }) => (
    <div data-testid="grafico-tipo-unidade">{chartData.datasets[0].label}</div>
  ),
}));

jest.mock(
  "../components/GraficoSolicitacoesAutorizadasEmpresaTerceirizada",
  () => ({
    GraficoSolicitacoesAutorizadasEmpresaTerceirizada: ({ chartData }) => (
      <div data-testid="grafico-empresa">{chartData.datasets[0].label}</div>
    ),
  }),
);

const base = mockSolicitacoesGraficos[0];

const dadosGraficos = [
  {
    labels: ["Sem classificação"],
    datasets: [
      {
        label: "Total sem classificação",
        data: [1],
        backgroundColor: "#000000",
      },
    ],
  },
  {
    labels: base.labels,
    datasets: [
      {
        ...base.datasets[0],
        label: "Total de Solicitações Autorizadas por DRE e Lote",
      },
    ],
  },
  {
    labels: base.labels,
    datasets: [
      {
        ...base.datasets[0],
        label: "Total de Solicitações Autorizadas por Tipo",
      },
    ],
  },
  {
    labels: base.labels,
    datasets: [
      {
        ...base.datasets[0],
        label: "Total de Solicitações Autorizadas por Tipo de Unidade",
      },
    ],
  },
  {
    labels: STATUS_SOLICITACOES.map((status) => status.nome),
    datasets: [
      {
        label: "Total de Solicitações por Status",
        data: [40, 25, 20, 15],
        backgroundColor: CORES[0],
        borderColor: [CORES[0], CORES[1], CORES[2], CORES[3]],
      },
    ],
  },
  {
    labels: base.labels,
    datasets: [
      {
        ...base.datasets[0],
        label: "Total de Solicitações Autorizadas por Empresa Terceirizada",
      },
    ],
  },
];

describe("Verifica componente de gráficos de solicitações de alimentação", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("Verifica se os gráficos foram renderizados", async () => {
    mock
      .onPost("/solicitacoes-genericas/filtrar-solicitacoes-graficos/")
      .reply(200, dadosGraficos);

    await act(async () => {
      render(<Graficos values={mockFiltrosSuspensao} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("grafico-dre-lote")).toHaveTextContent(
        "Total de Solicitações Autorizadas por DRE e Lote",
      );
      expect(screen.getByTestId("grafico-tipo")).toHaveTextContent(
        "Total de Solicitações Autorizadas por Tipo",
      );
      expect(screen.getByTestId("grafico-status")).toHaveTextContent(
        "Total de Solicitações por Status",
      );
      expect(screen.getByTestId("grafico-tipo-unidade")).toHaveTextContent(
        "Total de Solicitações Autorizadas por Tipo de Unidade",
      );
      expect(screen.getByTestId("grafico-empresa")).toHaveTextContent(
        "Total de Solicitações Autorizadas por Empresa Terceirizada",
      );
    });
  });

  it("Verifica o carregamento quando a consulta falha", async () => {
    mock
      .onPost("/solicitacoes-genericas/filtrar-solicitacoes-graficos/")
      .reply(404, { detail: "não encontrado" });

    await act(async () => {
      render(<Graficos values={mockFiltrosSuspensao} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Carregando gráficos...")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("grafico-dre-lote")).not.toBeInTheDocument();
    expect(screen.queryByTestId("grafico-tipo")).not.toBeInTheDocument();
    expect(screen.queryByTestId("grafico-status")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("grafico-tipo-unidade"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("grafico-empresa")).not.toBeInTheDocument();
  });

  it("Verifica a renderização quando a consulta não traz os totais", async () => {
    mock
      .onPost("/solicitacoes-genericas/filtrar-solicitacoes-graficos/")
      .reply(200, [dadosGraficos[0]]);

    await act(async () => {
      render(<Graficos values={mockFiltrosSuspensao} />);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Carregando gráficos..."),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId("grafico-dre-lote")).not.toBeInTheDocument();
    expect(screen.queryByTestId("grafico-status")).not.toBeInTheDocument();
  });
});
