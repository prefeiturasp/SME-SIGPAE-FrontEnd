import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { gerarParametrosConsulta } from "../../../../helpers/utilities";
import { listarDocumentosRecebimento } from "../../../../services/documentosRecebimento.service";
import Filtros from "./components/Filtros";
import Listagem from "./components/Listagem";
import { Paginacao } from "../../../Shareable/Paginacao";
import {
  DocumentosRecebimento,
  FiltrosDocumentosRecebimento,
} from "./interfaces";
import { ResponseDocumentosRecebimento } from "interfaces/responses.interface";

export default () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [filtros, setFiltros] = useState<FiltrosDocumentosRecebimento>({});
  const [page, setPage] = useState<number>(1);
  const [totalResultados, setTotalResultados] = useState<number>(0);
  const [consultaRealizada, setConsultaRealizada] = useState<boolean>(false);

  const [documentos, setDocumentos] = useState<Array<DocumentosRecebimento>>(
    []
  );

  const buscarResultados = async (pageNumber: number) => {
    setCarregando(true);

    const params: URLSearchParams = gerarParametrosConsulta({
      page: pageNumber,
      ...filtros,
    });
    const response: ResponseDocumentosRecebimento =
      await listarDocumentosRecebimento(params);

    setDocumentos(response.data.results);
    setTotalResultados(response.data.count);
    setConsultaRealizada(true);

    setCarregando(false);
  };

  const nextPage = (page: number) => {
    buscarResultados(page);
    setPage(page);
  };

  useEffect(() => {
    buscarResultados(1);
    setPage(1);
  }, [filtros]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-layout-embalagem">
        <div className="card-body layout-embalagem">
          <Filtros
            setFiltros={setFiltros}
            setDocumentos={setDocumentos}
            setConsultaRealizada={setConsultaRealizada}
          />
          {consultaRealizada &&
            (documentos.length === 0 ? (
              <div className="text-center mt-4 mb-4">
                Nenhum resultado encontrado
              </div>
            ) : (
              <>
                <Listagem objetos={documentos} />
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
            ))}
        </div>
      </div>
    </Spin>
  );
};
