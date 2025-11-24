import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import { CronogramaRelatorio, FiltrosRelatorioCronograma } from "./interfaces";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  getListagemRelatorioCronogramas,
  baixarRelatorioCronogramasExcel,
  baixarRelatorioCronogramasPdf,
} from "../../../../../services/cronograma.service";
import { Paginacao } from "src/components/Shareable/Paginacao";
import Listagem from "./components/Listagem";
import "./styles.scss";
import moment from "moment";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";

export default () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [filtros, setFiltros] = useState<FiltrosRelatorioCronograma>();
  const [page, setPage] = useState<number>(1);
  const [totalResultados, setTotalResultados] = useState<number>(0);
  const [consultaRealizada, setConsultaRealizada] = useState<boolean>(false);
  const [ativos, setAtivos] = useState<string[]>([]);
  const [cronogramas, setCronogramas] = useState<Array<CronogramaRelatorio>>(
    [],
  );
  const [totalizadores, setTotalizadores] = useState<Record<string, number>>();
  const [enviandoArquivo, setEnviandoArquivo] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const buscarResultados = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getListagemRelatorioCronogramas(params);
    setAtivos([]);
    setCronogramas(response.data.results);
    setTotalizadores({
      "Total de Cronogramas Criados": response.data.count,
      ...response.data.totalizadores,
    });
    setTotalResultados(response.data.count);
    setConsultaRealizada(true);
    setCarregando(false);
  };

  const nextPage = (page: number) => {
    buscarResultados(page);
    setPage(page);
  };

  useEffect(() => {
    if (filtros) {
      buscarResultados(1);
      setPage(1);
    }
  }, [filtros]);

  const baixarRelatorio = async (formato: "xlsx" | "pdf") => {
    setEnviandoArquivo(true);

    try {
      const params = gerarParametrosConsulta(filtros);
      const response =
        formato === "xlsx"
          ? await baixarRelatorioCronogramasExcel(params)
          : await baixarRelatorioCronogramasPdf(params);

      response?.status === 200 && setExibirModalCentralDownloads(true);
    } catch {
      toastError(`Erro ao exportar ${formato}. Tente novamente mais tarde.`);
    } finally {
      setEnviandoArquivo(false);
    }
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-relatorio-cronograma">
        <div className="card-body relatorio-cronograma">
          <Filtros
            setFiltros={setFiltros}
            setCarregando={setCarregando}
            setCronogramas={setCronogramas}
            setConsultaRealizada={setConsultaRealizada}
          />

          {consultaRealizada && (
            <>
              {totalizadores && (
                <div className="row mt-4">
                  <div className="col-12 titulo-cards">
                    TOTAL DE CRONOGRAMAS DE ENTREGAS - ATÉ{" "}
                    {moment(new Date()).format("DD/MM/YYYY")}
                  </div>
                  {Object.keys(totalizadores).map((totalizador, key) => {
                    return (
                      <div key={key} className="col-4 mt-3">
                        <div className="totalizador ps-3 pe-3">
                          <div className="d-flex justify-content-between">
                            <div className="titulo">{totalizador}</div>
                            <div className="valor">
                              {totalizadores[totalizador]}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {cronogramas.length === 0 ? (
                <div className="text-center mt-4 mb-4">
                  Nenhum resultado encontrado
                </div>
              ) : (
                <>
                  <Listagem
                    objetos={cronogramas}
                    ativos={ativos}
                    setAtivos={setAtivos}
                    setCarregando={setCarregando}
                    filtros={filtros}
                  />
                  <div className="row">
                    <div className="col">
                      <Paginacao
                        current={page}
                        total={totalResultados}
                        onChange={nextPage}
                      />
                    </div>
                  </div>
                  <div className="row mt-4 mb-2">
                    <div className="col p-0">
                      <Botao
                        texto="Baixar em PDF"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        icon={BUTTON_ICON.FILE_PDF}
                        type={BUTTON_TYPE.BUTTON}
                        disabled={enviandoArquivo}
                        onClick={() => baixarRelatorio("pdf")}
                        className="float-end"
                      />
                      <Botao
                        texto="Baixar em Excel"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        icon={BUTTON_ICON.FILE_EXCEL}
                        type={BUTTON_TYPE.BUTTON}
                        disabled={enviandoArquivo}
                        onClick={() => baixarRelatorio("xlsx")}
                        className="float-end me-3"
                      />
                      {exibirModalCentralDownloads && (
                        <ModalSolicitacaoDownload
                          show={exibirModalCentralDownloads}
                          setShow={setExibirModalCentralDownloads}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
