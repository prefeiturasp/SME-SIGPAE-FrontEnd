import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import { getListagemRelatorioDocsRecebimento } from "src/services/documentosRecebimento.service";
import {
  DocsRecebimentoRelatorio,
  FiltrosRelatorioDocRecebimento,
} from "./interfaces";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao";
import Listagem from "./components/Listagem";
import "./styles.scss";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import moment from "moment";

export default () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [filtros, setFiltros] = useState<FiltrosRelatorioDocRecebimento>();
  const [page, setPage] = useState<number>(1);
  const [totalResultados, setTotalResultados] = useState<number>(0);
  const [consultaRealizada, setConsultaRealizada] = useState<boolean>(false);
  const [ativos, setAtivos] = useState<string[]>([]);
  const [objetosListagem, setObjetosListagem] = useState<
    Array<DocsRecebimentoRelatorio>
  >([]);
  const [totalizadores, setTotalizadores] = useState<Record<string, number>>();

  const buscarResultados = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    try {
      const response = await getListagemRelatorioDocsRecebimento(params);
      setAtivos([]);
      setObjetosListagem(response.data.results);
      setTotalizadores(response.data.totalizadores);
      setTotalResultados(response.data.count);
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

  useEffect(() => {
    if (filtros) {
      buscarResultados(1);
      setPage(1);
    }
  }, [filtros]);

  useEffect(() => {
    buscarResultados(1);
    setPage(1);
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-relatorio-documento">
        <div className="card-body relatorio-documento">
          <Filtros
            setFiltros={setFiltros}
            setCarregando={setCarregando}
            setObjetos={setObjetosListagem}
            setConsultaRealizada={setConsultaRealizada}
          />

          {consultaRealizada && (
            <>
              {totalizadores && (
                <div className="row mt-4">
                  <div className="col-12 titulo-cards">
                    TOTAL DE DOCUMENTOS DE RECEBIMENTO - ATÉ{" "}
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
              {objetosListagem.length === 0 ? (
                <div className="text-center mt-4 mb-4">
                  Nenhum resultado encontrado
                </div>
              ) : (
                <>
                  <Listagem
                    objetos={objetosListagem}
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
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
