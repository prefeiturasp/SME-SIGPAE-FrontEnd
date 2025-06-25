import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { Paginacao } from "../../../Shareable/Paginacao";
import Filtros from "./components/Filtros";
import Listagem from "./components/Listagem";
import { FiltrosFichaTecnica } from "./interfaces";
import { ResponseFichasTecnicas } from "src/interfaces/responses.interface";
import { FichaTecnica } from "src/interfaces/pre_recebimento.interface";
import { gerarParametrosConsulta } from "../../../../helpers/utilities";
import { listarFichastecnicas } from "src/services/fichaTecnica.service";
import "./styles.scss";

export default () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [filtros, setFiltros] = useState<FiltrosFichaTecnica>({});
  const [page, setPage] = useState<number>(1);
  const [totalResultados, setTotalResultados] = useState<number>(0);
  const [consultaRealizada, setConsultaRealizada] = useState<boolean>(false);
  const [fichas, setFichas] = useState<Array<FichaTecnica>>([]);

  const buscarResultados = async (pageNumber: number) => {
    setCarregando(true);

    const params: URLSearchParams = gerarParametrosConsulta({
      page: pageNumber,
      ...filtros,
    });
    const response: ResponseFichasTecnicas = await listarFichastecnicas(params);

    setFichas(response.data.results);
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
      <div className="card mt-3 card-ficha-tecnica">
        <div className="card-body ficha-tecnica">
          <Filtros
            setFiltros={setFiltros}
            setFichas={setFichas}
            setConsultaRealizada={setConsultaRealizada}
          />
          {consultaRealizada &&
            (fichas.length === 0 ? (
              <div className="text-center mt-4 mb-4">
                Nenhum resultado encontrado
              </div>
            ) : (
              <>
                <Listagem objetos={fichas} setCarregando={setCarregando} />
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
