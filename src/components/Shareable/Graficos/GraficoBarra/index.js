import { jsx as _jsx } from "react/jsx-runtime";
import { Bar } from "react-chartjs-2";
export const GraficoBarra = ({ chartData, plugins }) => {
  return _jsx("div", {
    className: "mt-2",
    children: _jsx(Bar, {
      data: chartData,
      plugins: plugins,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              font: {
                size: 14,
                weight: "bold",
              },
              padding: 20,
            },
          },
          datalabels: {
            display: true,
            color: "black",
            font: {
              size: 14,
            },
            formatter: Math.round,
            anchor: "end",
            offset: -20,
            align: "start",
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
        },
      },
    }),
  });
};
