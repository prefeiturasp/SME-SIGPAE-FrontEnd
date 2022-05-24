import React, { useEffect, useState, useRef } from "react";
import { Spin, Pagination } from "antd";
import { getGuiasRemessaParaInsucesso } from "../../../../services/logistica.service.js";
import ListagemGuias from "./components/ListagemGuias";
import "./styles.scss";
import { gerarParametrosConsulta } from "helpers/utilities";
import Filtros from "./components/Filtros";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [guias, setGuias] = useState();
  const [filtros, setFiltros] = useState();
  const [ativos, setAtivos] = useState([]);
  const [total, setTotal] = useState();
  const [page, setPage] = useState();

  const inicioResultado = useRef();

  const buscarGuias = async page => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getGuiasRemessaParaInsucesso(params);
    if (response.data.count) {
      setGuias(response.data.results);
      setTotal(response.data.count);
      inicioResultado.current.scrollIntoView();
    } else {
      setTotal(response.data.count);
      setGuias();
    }
    setAtivos([]);
    setCarregando(false);
  };

  useEffect(() => {
    if (filtros) {
      buscarGuias(1);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const nextPage = page => {
    buscarGuias(page);
    setPage(page);
  };

  const updatePage = () => {
    buscarGuias(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-gestao-requisicao-entrega">
        <div className="card-body gestao-requisicao-entrega">
          <Filtros
            setFiltros={setFiltros}
            setGuias={setGuias}
            setTotal={setTotal}
            inicioResultado={inicioResultado}
          />
          {guias && (
            <>
              <br /> <hr /> <br />
              <ListagemGuias
                guias={guias}
                ativos={ativos}
                setAtivos={setAtivos}
                updatePage={updatePage}
              />
              <div className="row">
                <div className="col">
                  <Pagination
                    current={page}
                    total={total}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={10}
                    className="float-left mb-2"
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
