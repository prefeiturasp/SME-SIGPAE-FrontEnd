import { mesInteiro, anoCorrente } from "./helper";

export const LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const chartData = (dataset) => {
  return {
    labels: LABELS,
    graficoEvolucao: null,
    datasets: dataset || [],
  };
};

export const DATA_DEFAULT_SOLICITACAO = {
  fill: false,
  lineTension: 0.1,
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: "miter",
  pointBackgroundColor: "#fff",
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBorderWidth: 2,
  pointRadius: 4,
  pointHitRadius: 10,
};

export const OPTIONS = {
  scaleShowGridLines: true,
  scaleGridLineColor: "rgba(0,0,0,.05)",
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legend: {
    display: false,
  },
  tooltips: {
    backgroundColor: "#273142",
    displayColors: false,
    callbacks: {
      title: function (tooltipItem, data) {
        return (
          mesInteiro(data["labels"][tooltipItem[0]["index"]]) +
          " de " +
          anoCorrente()
        );
      },
    },
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        },
        ticks: {
          fontStyle: "bold",
          fontColor: "#000",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        },
        ticks: {
          fontStyle: "bold",
          fontColor: "#000",
        },
      },
    ],
  },
};

export const TIPOS_TURMAS = {
  REGULAR: "REGULAR",
  PROGRAMAS: "PROGRAMAS",
};
