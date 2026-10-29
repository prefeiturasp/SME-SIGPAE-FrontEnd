import { render, screen } from "@testing-library/react";
import { mockSolicitacoesGraficos } from "src/mocks/services/relatorios.service/mockGetSolicitacoesGraficos";
import { GraficoDietasAutorizadasDRELote } from "../index";

jest.mock("src/components/Shareable/Graficos/GraficoBarra", () => ({
  GraficoBarra: ({ chartData, plugins }) => {
    const legenda = {
      height: 0,
      fit() {
        this.height = 0;
      },
    };

    plugins.forEach((plugin) => {
      if (plugin.id === "increase-legend-spacing") {
        plugin.beforeInit({ legend: legenda });
        legenda.fit();
      }
    });

    return <div data-testid="grafico">{chartData.datasets[0].label}</div>;
  },
}));

describe("Verifica gráfico de dietas autorizadas por DRE e lote", () => {
  it("Verifica se o componente foi renderizado", () => {
    render(
      <GraficoDietasAutorizadasDRELote
        chartData={mockSolicitacoesGraficos[0]}
      />,
    );

    expect(screen.getByTestId("grafico")).toHaveTextContent(
      "Total de Dietas Especiais Autorizadas por DRE e Lote",
    );
  });
});
