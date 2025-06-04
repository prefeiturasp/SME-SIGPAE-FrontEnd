import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import ListagemTiposEmbalagens from "./components/ListagemEmbalagens";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  getTiposEmbalagens,
  getListaNomesTiposEmbalagens,
  getListaAbreviacoesTiposEmbalagens,
} from "src/services/qualidade.service";
import { Paginacao } from "src/components/Shareable/Paginacao";
import "./styles.scss";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [embalagens, setEmbalagens] = useState(undefined);
  const [nomesEmbalagens, setNomesEmbalagens] = useState([]);
  const [abreviacaoEmbalagens, setAbreviacaoEmbalagens] = useState([]);
  const [filtros, setFiltros] = useState();
  const [page, setPage] = useState();
  const [total, setTotal] = useState();

  useEffect(() => {
    buscaDadosAutoComplete();
  }, []);

  useEffect(() => {
    if (filtros) {
      buscarEmbalagens(1);
      setPage(1);
    }
  }, [filtros]);

  const buscaDadosAutoComplete = async () => {
    const respNomes = await getListaNomesTiposEmbalagens();
    const respAbreviacoes = await getListaAbreviacoesTiposEmbalagens();
    setNomesEmbalagens(respNomes.data.results);
    setAbreviacaoEmbalagens(respAbreviacoes.data.results);
  };

  const buscarEmbalagens = async (page) => {
    setCarregando(true);

    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getTiposEmbalagens(params);
    if (response.data.count) {
      setEmbalagens(response.data.results);
      setTotal(response.data.count);
    } else {
      setTotal(response.data.count);
      setEmbalagens([]);
    }
    setCarregando(false);
  };

  const nextPage = (page) => {
    buscarEmbalagens(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-tipos-embalagens">
        <div className="card-body tipos-embalagens">
          <Filtros
            setFiltros={setFiltros}
            nomesEmbalagens={nomesEmbalagens}
            abreviacaoEmbalagens={abreviacaoEmbalagens}
            setTotal={setTotal}
            setEmbalagens={setEmbalagens}
          />

          {embalagens && (
            <>
              <hr />
              <ListagemTiposEmbalagens embalagens={embalagens} />
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
              {total === 0 && (
                <div className="text-center mt-5">
                  Nenhum resultado encontrado
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
