import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import { TabelaHistorico } from "./components/TabelaHistorico";
import HTTP_STATUS from "http-status-codes";
import "./styles.scss";
import { toastError } from "components/Shareable/Toast/dialogs";

import { getSolicitacoesRelatorioHistoricoDietas } from "services/dietaEspecial.service";

export const RelatorioHistoricoDietas = () => {
  const [dietasEspeciais, setDietasEspeciais] = useState(null);
  const [loadingDietas, setLoadingDietas] = useState(false);
  const [count, setCount] = useState(0);

  const PAGE_SIZE = 10;

  const carregaPrimeiraPagina = async () => {
    setLoadingDietas(true);
    let params = {
      page_size: PAGE_SIZE,
      page: 1,
      data: "12/02/2024",
    };
    const response = await getSolicitacoesRelatorioHistoricoDietas(params);
    if (response.status === HTTP_STATUS.OK) {
      setDietasEspeciais(response.data);
      setCount(response.data.count);
    } else {
      toastError(
        "Erro ao carregar dados das dietas especiais. Tente novamente mais tarde."
      );
    }
    setLoadingDietas(false);
  };

  useEffect(() => {
    carregaPrimeiraPagina();
  }, []);

  return (
    <div className="card mt-3">
      <div className="card-body">
        <Spin spinning={loadingDietas} tip="Carregando histórico...">
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
              />
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
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default RelatorioHistoricoDietas;
