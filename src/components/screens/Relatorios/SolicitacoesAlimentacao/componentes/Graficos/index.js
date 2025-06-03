import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { getDatasetsGraficos } from "src/services/relatorios.service";
import { GraficoSolicitacoesAutorizadasDRELote } from "./components/GraficoSolicitacoesAutorizadasDRELote";
import "./style.scss";
import { GraficoSolicitacoesAutorizadasTipoSolicitacao } from "./components/GraficoSolicitacoesAutorizadasTipoSolicitacao";
import { GraficoSolicitacoesStatus } from "./components/GraficoSolicitacoesStatus";
import { GraficoSolicitacoesAutorizadasTipoUnidade } from "./components/GraficoSolicitacoesAutorizadasTipoUnidade";
import { GraficoSolicitacoesAutorizadasEmpresaTerceirizada } from "./components/GraficoSolicitacoesAutorizadasEmpresaTerceirizada";
export const Graficos = ({ ...props }) => {
  const { values } = props;
  const [datasGraficos, setDatasGraficos] = useState(undefined);
  const getDatasetsGraficosAsync = async (values) => {
    const response = await getDatasetsGraficos(values);
    if (response.status === HTTP_STATUS.OK) {
      setDatasGraficos(response.data);
    }
  };
  useEffect(() => {
    getDatasetsGraficosAsync(values);
  }, []);
  const graficoTotalPorDRELote = () => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por DRE e Lote")
        )
      )
    );
  };
  const graficoTotalPorTipoAlimentacao = () => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por Tipo")
        )
      )
    );
  };
  const graficoTotalPorStatus = () => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por Status")
        )
      )
    );
  };
  const graficoTotalPorTipoUnidade = () => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por Tipo de Unidade")
        )
      )
    );
  };
  const graficoTotalPorEmpresaTerceirizada = () => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por Empresa Terceirizada")
        )
      )
    );
  };
  return _jsx("div", {
    className: "graficos-relatorio-ga text-center",
    children: _jsxs(Spin, {
      tip: "Carregando gr\u00E1ficos...",
      spinning: !datasGraficos,
      children: [
        graficoTotalPorDRELote() &&
          _jsx("div", {
            className: "row",
            children: _jsx("div", {
              className: "col-12",
              children: _jsx(GraficoSolicitacoesAutorizadasDRELote, {
                chartData: graficoTotalPorDRELote(),
              }),
            }),
          }),
        _jsxs("div", {
          className: "row",
          children: [
            graficoTotalPorTipoAlimentacao() &&
              _jsx("div", {
                className: "col-7",
                children: _jsx(GraficoSolicitacoesAutorizadasTipoSolicitacao, {
                  chartData: graficoTotalPorTipoAlimentacao(),
                }),
              }),
            graficoTotalPorStatus() &&
              _jsx("div", {
                className: "col-5 total-por-status",
                children: _jsx(GraficoSolicitacoesStatus, {
                  chartData: graficoTotalPorStatus(),
                }),
              }),
          ],
        }),
        graficoTotalPorTipoUnidade() &&
          _jsx("div", {
            className: "row",
            children: _jsx("div", {
              className: "col-12",
              children: _jsx(GraficoSolicitacoesAutorizadasTipoUnidade, {
                chartData: graficoTotalPorTipoUnidade(),
              }),
            }),
          }),
        graficoTotalPorEmpresaTerceirizada() &&
          _jsx("div", {
            className: "row",
            children: _jsx("div", {
              className: "col-12",
              children: _jsx(
                GraficoSolicitacoesAutorizadasEmpresaTerceirizada,
                { chartData: graficoTotalPorEmpresaTerceirizada() }
              ),
            }),
          }),
      ],
    }),
  });
};
