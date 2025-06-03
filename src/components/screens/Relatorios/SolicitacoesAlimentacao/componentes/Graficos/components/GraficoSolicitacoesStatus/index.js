import { jsx as _jsx } from "react/jsx-runtime";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { GraficoDoughnut } from "src/components/Shareable/Graficos/GraficoDoughnut";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);
export const GraficoSolicitacoesStatus = ({ ...props }) => {
  const { chartData } = props;
  const doughnutLabelsLine = {
    id: "doughnutLabelsLine",
    afterDraw(chart) {
      const {
        ctx,
        chartArea: { /*top, bottom, left, right,*/ width, height },
      } = chart;
      chart.data.datasets.forEach((dataset, i) => {
        chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
          const { x, y } = datapoint.tooltipPosition();
          const halfwidth = width / 2;
          const halfheight = height / 2;
          const xLine = x >= halfwidth ? x + 27 : x - 27;
          const yLine = y >= halfheight ? y + 27 : y - 27;
          const extraLine = x >= halfwidth ? 10 : -10;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(xLine, yLine);
          ctx.lineTo(xLine + extraLine, yLine);
          ctx.strokeStyle = dataset.borderColor[index];
          ctx.stroke();
          ctx.font = "10px Roboto";
          const textXPosition = x >= halfwidth ? "left" : "right";
          const plusFivePx = x >= halfwidth ? 25 : -25;
          ctx.textAline = textXPosition;
          ctx.textBaseline = "middle";
          ctx.fillStyle = dataset.borderColor[index];
          ctx.fillText(
            `${chart.data.labels[index]}`,
            xLine + extraLine + plusFivePx,
            yLine
          );
          ctx.fillText(
            `${dataset.data[index]}%`,
            xLine + extraLine + plusFivePx,
            yLine + 10
          );
        });
      });
    },
  };
  const doughnutLabel = {
    id: "doughnutLabel",
    beforeDatasetsDraw(chart) {
      const { ctx } = chart;
      ctx.save();
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      ctx.font = "bold 10px Roboto";
      ctx.fillStyle = "#42474a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Total de Solicitações por Status", xCoor, yCoor);
    },
  };
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
  return _jsx(GraficoDoughnut, {
    chartData: chartData,
    plugins: [ChartDataLabels, plugin, doughnutLabel, doughnutLabelsLine],
  });
};
