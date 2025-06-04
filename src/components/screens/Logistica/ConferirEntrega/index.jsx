import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import { getGuiasEscola } from "../../../../services/logistica.service";
import ListagemGuias from "./components/ListagemGuias";
import Filtros from "./components/Filtros";
import "./styles.scss";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao/index.jsx";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [guias, setGuias] = useState();
  const [filtros, setFiltros] = useState();
  const [ativos, setAtivos] = useState([]);
  const [total, setTotal] = useState();
  const [page, setPage] = useState();
  const [initialValues, setInitialValues] = useState();

  const inicioResultado = useRef();

  const buscarGuias = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getGuiasEscola(params);
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
    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(window.location.search);
      const codigo = urlParams.get("numero_guia");
      const filtro = {
        numero_guia: codigo,
      };
      setFiltros({ ...filtro });
      setInitialValues({ ...filtro });
    }
  }, []);

  useEffect(() => {
    if (filtros) {
      buscarGuias(1);
      setPage(1);
    }
  }, [filtros]);

  const nextPage = (page) => {
    buscarGuias(page);
    setPage(page);
  };

  const updatePage = () => {
    buscarGuias(page);
  };
  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-conferir-entrega">
        <div className="card-body conferir-entrega">
          <Filtros
            setFiltros={setFiltros}
            setGuias={setGuias}
            initialValuesProp={initialValues}
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
