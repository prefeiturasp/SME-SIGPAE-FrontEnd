import { render, screen } from "@testing-library/react";
import { mockSolicitacoesGraficos } from "src/mocks/services/relatorios.service/mockGetSolicitacoesGraficos";
import { GraficoSolicitacoesAutorizadasDRELote } from "../GraficoSolicitacoesAutorizadasDRELote";
import { GraficoSolicitacoesAutorizadasEmpresaTerceirizada } from "../GraficoSolicitacoesAutorizadasEmpresaTerceirizada";
import { GraficoSolicitacoesAutorizadasTipoSolicitacao } from "../GraficoSolicitacoesAutorizadasTipoSolicitacao";
import { GraficoSolicitacoesAutorizadasTipoUnidade } from "../GraficoSolicitacoesAutorizadasTipoUnidade";

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

const base = mockSolicitacoesGraficos[0];

describe("Verifica gráficos de solicitações de alimentação", () => {
  it.each([
    [
      "por DRE e lote",
      GraficoSolicitacoesAutorizadasDRELote,
      "Total de Solicitações Autorizadas por DRE e Lote",
    ],
    [
      "por tipo de solicitação",
      GraficoSolicitacoesAutorizadasTipoSolicitacao,
      "Total de Solicitações Autorizadas por Tipo",
    ],
    [
      "por tipo de unidade",
      GraficoSolicitacoesAutorizadasTipoUnidade,
      "Total de Solicitações Autorizadas por Tipo de Unidade",
    ],
    [
      "por empresa terceirizada",
      GraficoSolicitacoesAutorizadasEmpresaTerceirizada,
      "Total de Solicitações Autorizadas por Empresa Terceirizada",
    ],
  ])(
    "Verifica se o gráfico %s foi renderizado",
    (_descricao, Grafico, rotulo) => {
      render(
        <Grafico
          chartData={{
            labels: base.labels,
            datasets: [
              {
                ...base.datasets[0],
                label: rotulo,
              },
            ],
          }}
        />,
      );

      expect(screen.getByTestId("grafico")).toHaveTextContent(rotulo);
    },
  );
});
