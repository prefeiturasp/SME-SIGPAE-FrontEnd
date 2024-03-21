import { Spin } from "antd";
import { ChartData } from "components/Shareable/Graficos/interfaces";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { getDatasetsGraficosRelatorioSolicitacoesAlimentacao } from "services/relatorios.service";
import { GraficoSolicitacoesAutorizadasDRELote } from "./components/GraficoSolicitacoesAutorizadasDRELote";
import { ResponseDatasetsGraficosRelatorioSolicitacoesAlimentacaoInterface } from "./interfaces";
import "./style.scss";
import { GraficoSolicitacoesAutorizadasTipoSolicitacao } from "./components/GraficoSolicitacoesAutorizadasTipoSolicitacao";

type ValuesType = {
  status: string;
  unidades_educacionais?: Array<string>;
  lotes?: Array<string>;
  tipos_unidade?: Array<string>;
  tipos_solicitacao?: Array<string>;
  de?: string;
  ate?: string;
  terceirizada?: string;
};

type PropsType = {
  values: ValuesType;
};

export const Graficos = ({ ...props }: PropsType) => {
  const { values } = props;

  const [datasGraficos, setDatasGraficos] =
    useState<Array<ChartData>>(undefined);

  const getDatasetsGraficosRelatorioSolicitacoesAlimentacaoAsync = async (
    values: ValuesType
  ): Promise<void> => {
    const response =
      await getDatasetsGraficosRelatorioSolicitacoesAlimentacao<ResponseDatasetsGraficosRelatorioSolicitacoesAlimentacaoInterface>(
        values
      );
    if (response.status === HTTP_STATUS.OK) {
      setDatasGraficos(response.data);
    }
  };

  useEffect(() => {
    getDatasetsGraficosRelatorioSolicitacoesAlimentacaoAsync(values);
  }, []);

  const graficoTotalPorDRELote = (): boolean | ChartData => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por DRE e Lote")
        )
      )
    );
  };

  const graficoTotalPorTipoAlimentacao = (): boolean | ChartData => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por Tipo")
        )
      )
    );
  };

  return (
    <div className="graficos-relatorio-ga text-center">
      <Spin tip="Carregando gráficos..." spinning={!datasGraficos}>
        {graficoTotalPorDRELote() && (
          <div className="row">
            <div className="col-12">
              <GraficoSolicitacoesAutorizadasDRELote
                chartData={graficoTotalPorDRELote()}
              />
            </div>
          </div>
        )}
        <div className="row">
          {graficoTotalPorTipoAlimentacao() && (
            <div className="col-6">
              <GraficoSolicitacoesAutorizadasTipoSolicitacao
                chartData={graficoTotalPorTipoAlimentacao()}
              />
            </div>
          )}
        </div>
      </Spin>
    </div>
  );
};
