import { Spin } from "antd";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "components/Shareable/ModalSolicitacaoDownload";
import { toastError } from "components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import React, { useContext, useState } from "react";
import {
  exportarExcelAsyncSolicitacoesRelatorioHistoricoDietas,
  exportarPDFAsyncSolicitacoesRelatorioHistoricoDietas,
} from "services/dietaEspecial.service";
import { Filtros } from "./components/Filtros";
import { TabelaHistorico } from "./components/TabelaHistorico";
import { normalizarValues } from "./helper";
import "./styles.scss";
import { MeusDadosContext } from "context/MeusDadosContext";

export const RelatorioHistoricoDietas = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [valuesForm, setValuesForm] = useState(null);
  const [dietasEspeciais, setDietasEspeciais] = useState(null);
  const [loadingDietas, setLoadingDietas] = useState(false);
  const [count, setCount] = useState(0);

  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [exportando, setExportando] = useState(false);

  const [erro, setErro] = useState("");

  const exportarExcel = async () => {
    setExportando(true);
    const response =
      await exportarExcelAsyncSolicitacoesRelatorioHistoricoDietas(
        normalizarValues(valuesForm)
      );
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar excel. Tente novamente mais tarde.");
    }
    setExportando(false);
  };

  const exportarPDF = async () => {
    setExportando(true);
    const response = await exportarPDFAsyncSolicitacoesRelatorioHistoricoDietas(
      normalizarValues(valuesForm)
    );
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar PDF. Tente novamente mais tarde.");
    }
    setExportando(false);
  };

  return (
    <>
      {erro && <div>{erro}</div>}
      {!erro && meusDados && (
        <div className="card mt-3">
          <div className="card-body">
            <Spin spinning={loadingDietas} tip="Carregando histórico...">
              <Filtros
                meusDados={meusDados}
                setDietasEspeciais={setDietasEspeciais}
                setValuesForm={setValuesForm}
                setCount={setCount}
                setLoadingDietas={setLoadingDietas}
                setErro={setErro}
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
                  <div className="row">
                    <div className="col-12 text-end">
                      <Botao
                        texto="Exportar PDF"
                        style={BUTTON_STYLE.GREEN}
                        type={BUTTON_TYPE.BUTTON}
                        icon={BUTTON_ICON.FILE_PDF}
                        onClick={async () => await exportarPDF()}
                        disabled={exportando}
                      />
                      <Botao
                        texto="Exportar XLSX"
                        style={BUTTON_STYLE.GREEN}
                        type={BUTTON_TYPE.BUTTON}
                        icon={BUTTON_ICON.FILE_EXCEL}
                        className="ms-3"
                        onClick={async () => await exportarExcel()}
                        disabled={exportando}
                      />
                    </div>
                  </div>
                </>
              )}
            </Spin>
          </div>
          <ModalSolicitacaoDownload
            show={exibirModalCentralDownloads}
            setShow={setExibirModalCentralDownloads}
          />
        </div>
      )}
    </>
  );
};

export default RelatorioHistoricoDietas;
