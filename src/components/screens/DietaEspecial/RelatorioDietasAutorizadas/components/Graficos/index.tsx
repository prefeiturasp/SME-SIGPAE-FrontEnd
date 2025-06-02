import { Spin } from "antd";
import { ChartData } from "src/components/Shareable/Graficos/interfaces";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { getDatasetsGraficos } from "src/services/relatorios.service";
import { GraficoDietasAutorizadasDRELote } from "./components/GraficoDietasAutorizadasDRELote";
import { ResponseDatasetsGraficos, NomeUuid, NomeId } from "./interfaces";
import "./style.scss";

type ValuesFormType = {
  status_selecionado: string;
  tipo_gestao?: string;
  tipos_unidades_selecionadas?: Array<string>;
  lote?: string;
  unidades_educacionais_selecionadas?: Array<string>;
  classificacoes_selecionadas?: Array<string>;
  alergias_intolerancias_selecionadas?: Array<string>;
  cei_polo?: boolean;
  recreio_nas_ferias?: boolean;
  relatorio_dietas_autorizadas?: boolean;
};

type ValuesType = {
  tipo_gestao?: Array<NomeUuid>;
  tipos_unidades?: Array<NomeUuid>;
  lotes?: Array<NomeUuid>;
  classificacoes?: Array<NomeId>;
  alergias_intolerancias?: Array<NomeId>;
};

type PropsType = {
  valuesForm: ValuesFormType;
  values: ValuesType;
};

export const Graficos = ({ ...props }: PropsType) => {
  const { valuesForm, values } = props;

  const [datasGraficos, setDatasGraficos] =
    useState<Array<ChartData>>(undefined);

  const getDatasetsGraficosAsync = async (
    valuesForm: ValuesFormType
  ): Promise<void> => {
    let params = { ...valuesForm };
    params["relatorio_dietas_autorizadas"] = true;
    if (!params.lote) {
      const lotes = [];
      values.lotes.forEach((lote: NomeUuid) => lotes.push(lote.uuid));
      params["lotes"] = lotes;
    }

    const response = await getDatasetsGraficos<ResponseDatasetsGraficos>(
      params
    );
    if (response.status === HTTP_STATUS.OK) {
      setDatasGraficos(response.data);
    }
  };

  useEffect(() => {
    getDatasetsGraficosAsync(valuesForm);
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

  return (
    <div className="graficos-relatorio-ga text-center">
      <Spin tip="Carregando gráficos..." spinning={!datasGraficos}>
        {graficoTotalPorDRELote() && (
          <div className="row">
            <div className="col-12">
              <GraficoDietasAutorizadasDRELote
                chartData={graficoTotalPorDRELote()}
              />
            </div>
          </div>
        )}
      </Spin>
    </div>
  );
};
