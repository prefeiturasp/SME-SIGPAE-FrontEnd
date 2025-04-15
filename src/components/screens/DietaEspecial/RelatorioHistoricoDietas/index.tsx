import { Spin } from "antd";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import { ENVIRONMENT } from "constants/config";
import React, { useState } from "react";
import { Filtros } from "./components/Filtros";
import { TabelaHistorico } from "./components/TabelaHistorico";
import "./styles.scss";

export const RelatorioHistoricoDietas = () => {
  const [valuesForm, setValuesForm] = useState(null);
  const [dietasEspeciais, setDietasEspeciais] = useState(null);
  const [loadingDietas, setLoadingDietas] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div className="card mt-3">
      <div className="card-body">
        <Spin spinning={loadingDietas} tip="Carregando histórico...">
          <Filtros
            onClear={() => {
              setDietasEspeciais(null);
            }}
            setDietasEspeciais={setDietasEspeciais}
            setValuesForm={setValuesForm}
            setCount={setCount}
            setLoadingDietas={setLoadingDietas}
          />
          {dietasEspeciais && (
            <>
              <div className="row">
                <div className="mt-4 pl-0">
                  <p className="mb-2 texto-verde">
                    <b>
                      Resultado da pesquisa - TOTAL DE DIETAS AUTORIZADAS EM{" "}
                      {dietasEspeciais.data}:{"  "}
                      {dietasEspeciais.total_dietas}
                    </b>
                  </p>
                </div>
              </div>

              <TabelaHistorico
                dietasEspeciais={dietasEspeciais}
                setLoadingDietas={setLoadingDietas}
                setDietasEspeciais={setDietasEspeciais}
                count={count}
                setCount={setCount}
                values={valuesForm}
              />
              {ENVIRONMENT !== "production" && (
                <div className="row">
                  <div className="col-12 text-end">
                    <Botao
                      texto="Exportar PDF"
                      style={BUTTON_STYLE.GREEN}
                      icon={BUTTON_ICON.FILE_PDF}
                      onClick={() => {}}
                    />
                    <Botao
                      texto="Exportar XLSX"
                      style={BUTTON_STYLE.GREEN}
                      icon={BUTTON_ICON.FILE_EXCEL}
                      className="ms-3"
                      onClick={() => {}}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default RelatorioHistoricoDietas;
