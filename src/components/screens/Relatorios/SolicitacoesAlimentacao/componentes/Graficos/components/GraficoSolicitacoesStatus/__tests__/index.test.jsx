import { render, screen } from "@testing-library/react";
import { CORES } from "src/components/Shareable/Graficos/constants";
import { STATUS_SOLICITACOES } from "src/components/screens/Relatorios/SolicitacoesAlimentacao/constants";
import { GraficoSolicitacoesStatus } from "../index";

jest.mock("src/components/Shareable/Graficos/GraficoDoughnut", () => ({
  GraficoDoughnut: ({ chartData, plugins }) => {
    const pontos = [
      { x: 80, y: 20 },
      { x: 80, y: 80 },
      { x: 20, y: 80 },
      { x: 20, y: 20 },
    ];
    const chart = {
      legend: {
        height: 0,
        fit() {
          this.height = 0;
        },
      },
      chartArea: { width: 100, height: 100 },
      ctx: {
        beginPath() {},
        moveTo() {},
        lineTo() {},
        stroke() {},
        fillText() {},
        save() {},
      },
      data: chartData,
      getDatasetMeta: () => ({
        data: pontos.map((ponto) => ({
          ...ponto,
          tooltipPosition: () => ponto,
        })),
      }),
    };

    plugins.forEach((plugin) => {
      if (plugin.id === "increase-legend-spacing") {
        plugin.beforeInit(chart);
        chart.legend.fit();
      }
      if (plugin.id === "doughnutLabel") {
        plugin.beforeDatasetsDraw(chart);
      }
      if (plugin.id === "doughnutLabelsLine") {
        plugin.afterDraw(chart);
      }
    });

    return <div data-testid="grafico">{chartData.datasets[0].label}</div>;
  },
}));

describe("Verifica gráfico de solicitações por status", () => {
  it("Verifica se o componente foi renderizado", () => {
    render(
      <GraficoSolicitacoesStatus
        chartData={{
          labels: STATUS_SOLICITACOES.map((status) => status.nome),
          datasets: [
            {
              label: "Total de Solicitações por Status",
              data: [40, 25, 20, 15],
              backgroundColor: CORES[0],
              borderColor: [CORES[0], CORES[1], CORES[2], CORES[3]],
            },
          ],
        }}
      />,
    );

    expect(screen.getByTestId("grafico")).toHaveTextContent(
      "Total de Solicitações por Status",
    );
  });
});
