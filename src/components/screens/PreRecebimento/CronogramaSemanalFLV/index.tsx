import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import ListagemCronogramas from "./components/Listagem";
import { Paginacao } from "src/components/Shareable/Paginacao";

import { getListagemCronogramasSemanal } from "src/services/cronogramaSemanal.service";
import {
  gerarParametrosConsulta,
  usuarioEhEmpresaFornecedor,
} from "src/helpers/utilities";
import "./styles.scss";

const CronogramaSemanalFLV: React.FC = () => {
  const [carregando, setCarregando] = useState(false);
  const [cronogramas, setCronogramas] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const inicioResultado = useRef<HTMLDivElement>(null);

  const buscarCronogramas = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getListagemCronogramasSemanal(params);
    if (response.data.count) {
      setCronogramas(response.data.results);
      setTotal(response.data.count);
      inicioResultado.current?.scrollIntoView();
    } else {
      setTotal(0);
      setCronogramas(undefined);
    }
    setCarregando(false);
  };

  useEffect(() => {
    if (filtros) {
      buscarCronogramas(1);
      setPage(1);
    }
  }, [filtros]);

  useEffect(() => {
    if (usuarioEhEmpresaFornecedor()) {
      setFiltros({});
    }
  }, []);

  const nextPage = (page) => {
    buscarCronogramas(page);
    setPage(page);
  };

  return (
    <Spin spinning={carregando}>
      <div className="card mt-3 card-cronograma-semanal-flv">
        <div className="card-body cronograma-semanal-flv">
          <Filtros
            setFiltros={setFiltros}
            setCronogramas={setCronogramas}
            setTotal={setTotal}
            inicioResultado={inicioResultado}
          />
          {cronogramas && (
            <>
              <div className="row mt-4">
                <ListagemCronogramas
                  cronogramas={cronogramas}
                  ativos={[]}
                  setCarregando={setCarregando}
                />
              </div>
              <div className="row">
                <div className="col">
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page}
                    total={total}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={10}
                  />
                </div>
              </div>
            </>
          )}
          {total === 0 && (
            <div className="text-center mt-5">
              Não existe informação para os critérios de busca utilizados.
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default CronogramaSemanalFLV;
