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

  const PAGE_SIZE = 2;

  const carregaPrimeiraPagina = async () => {
    setLoadingDietas(true);
    let params = {
      page_size: PAGE_SIZE,
      page: 1,
      data: "24/08/2023",
      unidades_educacionais_selecionadas: [
        "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
        "e675739f-534c-4bdf-8bbd-3fb037e98d73",
        "dfba8f77-712b-4197-9dc3-9248f7237bed",
        "01954441-c64e-4c53-987a-ad1b97450eae",
        "49e6bf7f-36ad-418b-a5ec-2b03442aba22",
        "e02c0499-62e1-4115-a4eb-3c4fb108ac84",
        "61c4812e-82ae-4387-aa33-e1f0f42d6163",
      ],
    };
    const response = await getSolicitacoesRelatorioHistoricoDietas(params);
    if (response.status === HTTP_STATUS.OK) {
      setDietasEspeciais(response.data.results[0]);
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
