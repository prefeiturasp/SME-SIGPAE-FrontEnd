import React, { useEffect, useRef, useState } from "react";
import { Spin } from "antd";

import { Paginacao } from "../../../Shareable/Paginacao";
import Filtros from "./components/Filtros";
import Listagem from "./components/Listagem";
import { gerarParametrosConsulta } from "../../../../helpers/utilities";

import {
  FiltrosTermoRecebimento,
  TermoRecebimentoListagem,
} from "./interfaces";
import { listarTermosRecebimentoDefinitivo } from "src/services/posRecebimento.service";

export default () => {
  const [filtros, setFiltros] = useState<FiltrosTermoRecebimento>({});
  const [termos, setTermos] = useState<Array<TermoRecebimentoListagem>>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [totalResultados, setTotalResultados] = useState<number>(0);
  const [consultaRealizada, setConsultaRealizada] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const primeiraRenderizacao = useRef(true);

  const buscarResultados = async (pageNumber: number) => {
    setCarregando(true);

    const params: URLSearchParams = gerarParametrosConsulta({
      page: pageNumber,
      ...filtros,
    });
    const response = await listarTermosRecebimentoDefinitivo(params);

    if (response) {
      setTermos(response.data.results);
      setTotalResultados(response.data.count);
      setConsultaRealizada(true);
    }

    setCarregando(false);
  };

  const nextPage = (page: number) => {
    buscarResultados(page);
    setPage(page);
  };

  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    buscarResultados(1);
    setPage(1);
  }, [filtros]);

  return (
    <Spin spinning={carregando}>
      <div className="card mt-3 card-termo-recebimento-definitivo">
        <div className="card-body">
          <Filtros setFiltros={setFiltros} />
          {consultaRealizada &&
            (termos.length === 0 ? (
              <div className="text-center mt-4 mb-4">
                Nenhum resultado encontrado
              </div>
            ) : (
              <>
                <Listagem objetos={termos} />
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
