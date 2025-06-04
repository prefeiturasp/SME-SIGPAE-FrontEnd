import { Spin } from "antd";
import { ChartData } from "src/components/Shareable/Graficos/interfaces";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { getDatasetsGraficos } from "src/services/relatorios.service";
import { GraficoSolicitacoesAutorizadasDRELote } from "./components/GraficoSolicitacoesAutorizadasDRELote";
import { ResponseDatasetsGraficos } from "./interfaces";
import "./style.scss";
import { GraficoSolicitacoesAutorizadasTipoSolicitacao } from "./components/GraficoSolicitacoesAutorizadasTipoSolicitacao";
import { GraficoSolicitacoesStatus } from "./components/GraficoSolicitacoesStatus";
import { GraficoSolicitacoesAutorizadasTipoUnidade } from "./components/GraficoSolicitacoesAutorizadasTipoUnidade";
import { GraficoSolicitacoesAutorizadasEmpresaTerceirizada } from "./components/GraficoSolicitacoesAutorizadasEmpresaTerceirizada";

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

  const getDatasetsGraficosAsync = async (
    values: ValuesType
  ): Promise<void> => {
    const response = await getDatasetsGraficos<ResponseDatasetsGraficos>(
      values
    );
    if (response.status === HTTP_STATUS.OK) {
      setDatasGraficos(response.data);
    }
  };

  useEffect(() => {
    getDatasetsGraficosAsync(values);
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

  const graficoTotalPorStatus = (): boolean | ChartData => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por Status")
        )
      )
    );
  };

  const graficoTotalPorTipoUnidade = (): boolean | ChartData => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por Tipo de Unidade")
        )
      )
    );
  };

  const graficoTotalPorEmpresaTerceirizada = (): boolean | ChartData => {
    return (
      datasGraficos &&
      datasGraficos.find((datagrafico) =>
        datagrafico.datasets.find((dataset) =>
          dataset.label.includes("por Empresa Terceirizada")
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
            <div className="col-7">
              <GraficoSolicitacoesAutorizadasTipoSolicitacao
                chartData={graficoTotalPorTipoAlimentacao()}
              />
            </div>
          )}
          {graficoTotalPorStatus() && (
            <div className="col-5 total-por-status">
              <GraficoSolicitacoesStatus chartData={graficoTotalPorStatus()} />
            </div>
          )}
        </div>
        {graficoTotalPorTipoUnidade() && (
          <div className="row">
            <div className="col-12">
              <GraficoSolicitacoesAutorizadasTipoUnidade
                chartData={graficoTotalPorTipoUnidade()}
              />
            </div>
          </div>
        )}
        {graficoTotalPorEmpresaTerceirizada() && (
          <div className="row">
            <div className="col-12">
              <GraficoSolicitacoesAutorizadasEmpresaTerceirizada
                chartData={graficoTotalPorEmpresaTerceirizada()}
              />
            </div>
          </div>
        )}
      </Spin>
    </div>
  );
};
