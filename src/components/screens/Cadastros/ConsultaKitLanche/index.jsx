import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { getKitsLanche } from "../../../../services/kitLanche/shared.service";
import ListagemKits from "./components/ListagemKits";
import Filtros from "./components/Filtros";
import "./style.scss";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [kits, setKits] = useState();
  const [filtros, setFiltros] = useState();
  const [ativos, setAtivos] = useState([]);
  const [total, setTotal] = useState();
  const [page, setPage] = useState();

  const buscarKits = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getKitsLanche(params);
    if (response.data.count) {
      setKits(response.data.results);
      setTotal(response.data.count);
    } else {
      setTotal(response.data.count);
      setKits();
    }
    setAtivos([]);
    setCarregando(false);
  };

  useEffect(() => {
    if (filtros) {
      buscarKits(1);
      setPage(1);
    }
  }, [filtros]);

  const nextPage = (page) => {
    buscarKits(page);
    setPage(page);
  };

  const updatePage = () => {
    buscarKits(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-consulta-kits">
        <div className="card-body consulta-kits">
          <Filtros setFiltros={setFiltros} setKits={setKits} />
          {kits && (
            <>
              <br /> <hr /> <br />
              <ListagemKits
                kits={kits}
                ativos={ativos}
                setAtivos={setAtivos}
                updatePage={updatePage}
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
