import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import {
  CronogramaSemanalRelatorio,
  FiltrosRelatorioCronograma,
} from "./interfaces";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  getListagemRelatorioCronogramasSemanais,
  baixarRelatorioCronogramasSemanaisExcel,
} from "../../../../../services/cronogramaSemanal.service";
import { Paginacao } from "src/components/Shareable/Paginacao";
import Listagem from "./components/Listagem";
import "./styles.scss";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import { getMensagemDeErro } from "src/helpers/statusErrors";

export default () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [filtros, setFiltros] = useState<FiltrosRelatorioCronograma>();
  const [page, setPage] = useState<number>(1);
  const [totalResultados, setTotalResultados] = useState<number>(0);
  const [consultaRealizada, setConsultaRealizada] = useState<boolean>(false);
  const [ativos, setAtivos] = useState<string[]>([]);
  const [cronogramasSemanais, setCronogramasSemanais] = useState<
    Array<CronogramaSemanalRelatorio>
  >([]);
  const [enviandoArquivo, setEnviandoArquivo] = useState<boolean>(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState<boolean>(false);

  const buscarResultados = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    try {
      const response = await getListagemRelatorioCronogramasSemanais(params);
      setAtivos([]);
      setCronogramasSemanais(response.data?.results || []);
      setTotalResultados(response.data?.count || 0);
      setConsultaRealizada(true);
    } catch (error) {
      toastError(getMensagemDeErro(error.response?.status));
    } finally {
      setCarregando(false);
    }
  };

  const nextPage = (page: number) => {
    buscarResultados(page);
    setPage(page);
  };

  const baixarRelatorioExcel = async () => {
    setEnviandoArquivo(true);
    try {
      // Mesmos parâmetros de filtro aplicados na listagem.
      const params = gerarParametrosConsulta(filtros);
      const response = await baixarRelatorioCronogramasSemanaisExcel(params);
      response?.status === 200 && setExibirModalCentralDownloads(true);
    } catch {
      toastError("Erro ao exportar Excel. Tente novamente mais tarde.");
    } finally {
      setEnviandoArquivo(false);
    }
  };

  useEffect(() => {
    if (filtros) {
      buscarResultados(1);
      setPage(1);
    }
  }, [filtros]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-relatorio-cronograma">
        <div className="card-body relatorio-cronograma">
          <Filtros
            setFiltros={setFiltros}
            setCarregando={setCarregando}
            setCronogramas={setCronogramasSemanais}
            setConsultaRealizada={setConsultaRealizada}
          />

          {consultaRealizada && (
            <>
              {cronogramasSemanais.length === 0 ? (
                <div className="text-center mt-4 mb-4">
                  Nenhum resultado encontrado
                </div>
              ) : (
                <>
                  <Listagem
                    objetos={cronogramasSemanais}
                    ativos={ativos}
                    setAtivos={setAtivos}
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
                        texto="Baixar em Excel"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        icon={BUTTON_ICON.FILE_EXCEL}
                        type={BUTTON_TYPE.BUTTON}
                        disabled={enviandoArquivo}
                        onClick={() => baixarRelatorioExcel()}
                        className="float-end me-3"
                      />
                      {exibirModalCentralDownloads && (
                        <ModalSolicitacaoDownload
                          show={exibirModalCentralDownloads}
                          setShow={setExibirModalCentralDownloads}
                          callbackClose={() => {}}
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
