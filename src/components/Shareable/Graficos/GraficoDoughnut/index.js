import { jsx as _jsx } from "react/jsx-runtime";
import { Doughnut } from "react-chartjs-2";
export const GraficoDoughnut = ({ chartData, plugins }) => {
  return _jsx("div", {
    className: "mt-2",
    children: _jsx(Doughnut, {
      data: chartData,
      plugins: plugins,
      options: {
        layout: {
          padding: 20,
        },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: false,
          },
        },
      },
    }),
  });
};
