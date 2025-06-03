import { jsx as _jsx } from "react/jsx-runtime";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { getDatasetsGraficos } from "src/services/relatorios.service";
import { GraficoDietasAutorizadasDRELote } from "./components/GraficoDietasAutorizadasDRELote";
import "./style.scss";
export const Graficos = ({ ...props }) => {
  const { valuesForm, values } = props;
  const [datasGraficos, setDatasGraficos] = useState(undefined);
  const getDatasetsGraficosAsync = async (valuesForm) => {
    let params = { ...valuesForm };
    params["relatorio_dietas_autorizadas"] = true;
    if (!params.lote) {
      const lotes = [];
      values.lotes.forEach((lote) => lotes.push(lote.uuid));
      params["lotes"] = lotes;
    }
    const response = await getDatasetsGraficos(params);
    if (response.status === HTTP_STATUS.OK) {
      setDatasGraficos(response.data);
    }
  };
  useEffect(() => {
    getDatasetsGraficosAsync(valuesForm);
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
  return _jsx("div", {
    className: "graficos-relatorio-ga text-center",
    children: _jsx(Spin, {
      tip: "Carregando gr\u00E1ficos...",
      spinning: !datasGraficos,
      children:
        graficoTotalPorDRELote() &&
        _jsx("div", {
          className: "row",
          children: _jsx("div", {
            className: "col-12",
            children: _jsx(GraficoDietasAutorizadasDRELote, {
              chartData: graficoTotalPorDRELote(),
            }),
          }),
        }),
    }),
  });
};
