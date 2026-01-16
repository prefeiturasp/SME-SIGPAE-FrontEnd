import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import {
  gerarParametrosConsulta,
  usuarioEhEmpresaFornecedor,
} from "src/helpers/utilities";
import { getListagemCronogramas } from "../../../../services/cronograma.service";
import ListagemCronogramas from "./components/ListagemCronogramas";

import { getNomesDistribuidores } from "src/services/logistica.service";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [cronogramas, setCronogramas] = useState();
  const [filtros, setFiltros] = useState();
  const [total, setTotal] = useState();
  const [page, setPage] = useState();
  const [ativos, setAtivos] = useState([]);
  const [armazens, setArmazens] = useState([{}]);

  const inicioResultado = useRef();

  const buscarCronogramas = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getListagemCronogramas(params);
    setAtivos([]);
    if (response.data.count) {
      setCronogramas(response.data.results);
      setTotal(response.data.count);
      inicioResultado.current.scrollIntoView();
    } else {
      setTotal(response.data.count);
      setCronogramas();
    }
    setCarregando(false);
  };

  const buscaArmazens = async () => {
    const response = await getNomesDistribuidores();
    setArmazens(
      response.data.results.map((armazem) => ({
        label: armazem.nome_fantasia,
        value: armazem.uuid,
      })),
    );
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
      buscaArmazens();
    }
  }, []);

  const nextPage = (page) => {
    buscarCronogramas(page);
    setPage(page);
  };

  const updatePage = () => {
    buscarCronogramas(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cronograma-entrega">
        <div className="card-body cronograma-entrega">
          <Filtros
            setFiltros={setFiltros}
            setCronogramas={setCronogramas}
            setTotal={setTotal}
            cronogramas={cronogramas}
            page={page}
            inicioResultado={inicioResultado}
            armazens={armazens}
          />

          {cronogramas && (
            <>
              <ListagemCronogramas
                cronogramas={cronogramas}
                ativos={ativos}
                setAtivos={setAtivos}
                updatePage={updatePage}
                setCarregando={setCarregando}
              />
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
