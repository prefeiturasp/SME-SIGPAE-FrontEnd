import { jsx as _jsx } from "react/jsx-runtime";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { GraficoBarra } from "src/components/Shareable/Graficos/GraficoBarra";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);
export const GraficoSolicitacoesAutorizadasTipoSolicitacao = ({ ...props }) => {
  const { chartData } = props;
  const plugin = {
    id: "increase-legend-spacing",
    beforeInit(chart) {
      const originalFit = chart.legend.fit;
      chart.legend.fit = function fit() {
        originalFit.bind(chart.legend)();
        this.height += 20;
      };
    },
  };
  return _jsx(GraficoBarra, {
    chartData: chartData,
    plugins: [ChartDataLabels, plugin],
  });
};
