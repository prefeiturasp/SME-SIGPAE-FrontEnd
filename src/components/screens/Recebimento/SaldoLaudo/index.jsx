import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import Filtros from "./components/Filtros";
import Listagem from "./components/Listagem";
import { Paginacao } from "src/components/Shareable/Paginacao";

import { gerarParametrosConsulta } from "src/helpers/utilities";

import { getListagemAjustesSaldo } from "src/services/ajusteSaldo.service";

export default () => {
  const [carregando, setCarregando] = useState(true);
  const [ajustes, setAjustes] = useState([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [filtros, setFiltros] = useState({});
  const [page, setPage] = useState(1);

  const preencheAjustes = async (pageNumber) => {
    setCarregando(true);

    let _params = {
      page: pageNumber,
      ...filtros,
    };

    try {
      const params = gerarParametrosConsulta(_params);
      const response = await getListagemAjustesSaldo(params);
      if (response) {
        setAjustes(response.data.results);
        setTotalResultados(response.data.count);
      }
    } finally {
      setCarregando(false);
    }
  };

  const proximaPagina = (page) => {
    preencheAjustes(page);
    setPage(page);
  };

  useEffect(() => {
    preencheAjustes(1);
    setPage(1);
  }, [filtros]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-saldo-laudo">
        <div className="card-body">
          <Filtros setFiltros={setFiltros} setAjustes={setAjustes} />
          <Listagem objetos={ajustes} />
          <div className="row">
            <div className="col">
              <Paginacao
                current={page}
                total={totalResultados}
                onChange={proximaPagina}
              />
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
