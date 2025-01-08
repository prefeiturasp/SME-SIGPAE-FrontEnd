import React from "react";
import { Bar } from "react-chartjs-2";

export const GraficoBarra = ({ chartData, plugins }) => {
  return (
    <div className="mt-2">
      <Bar
        data={chartData}
        plugins={plugins}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
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
        }}
      />
    </div>
  );
};
