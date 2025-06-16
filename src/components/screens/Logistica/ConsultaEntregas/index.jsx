import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import { getEntregasDilog } from "../../../../services/logistica.service";
import ListagemSolicitacoes from "./components/ListagemSolicitacoes";
import Filtros from "./components/Filtros";
import "./styles.scss";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao/index.jsx";

export default ({ dilog, dre }) => {
  const [carregando, setCarregando] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState();
  const [filtros, setFiltros] = useState();
  const [ativos, setAtivos] = useState([]);
  const [total, setTotal] = useState();
  const [page, setPage] = useState();

  const inicioResultado = useRef();

  const buscarSolicitacoes = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getEntregasDilog(params);
    if (response.data.results.length) {
      setSolicitacoes(response.data.results);
      setTotal(response.data.count);
      inicioResultado.current.scrollIntoView();
    } else {
      setTotal(response.data.count);
      setSolicitacoes();
    }
    setAtivos([]);
    setCarregando(false);
  };

  useEffect(() => {
    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(window.location.search);
      const codigo = urlParams.get("numero_requisicao");
      const filtro = {
        numero_requisicao: codigo,
      };
      setFiltros({ ...filtro });
    }
  }, []);

  useEffect(() => {
    if (filtros) {
      buscarSolicitacoes(1);
      setPage(1);
    }
  }, [filtros]);

  const nextPage = (page) => {
    buscarSolicitacoes(page);
    setPage(page);
  };

  const updatePage = () => {
    buscarSolicitacoes(page);
  };
  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-entregas-dilog">
        <div className="card-body entregas-dilog">
          <Filtros
            setFiltros={setFiltros}
            setSolicitacoes={setSolicitacoes}
            setTotal={setTotal}
            dilog={dilog}
            dre={dre}
            inicioResultado={inicioResultado}
          />
          {solicitacoes && (
            <>
              <br /> <hr /> <br />
              <ListagemSolicitacoes
                solicitacoes={solicitacoes}
                ativos={ativos}
                setAtivos={setAtivos}
                updatePage={updatePage}
                dilog={dilog}
                dre={dre}
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
