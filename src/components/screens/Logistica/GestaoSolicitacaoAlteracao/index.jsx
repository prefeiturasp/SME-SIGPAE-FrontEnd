import React, { useEffect, useState, useRef } from "react";
import { Spin, Pagination } from "antd";
import { getListagemSolicitacaoAlteracao } from "../../../../services/logistica.service.js";
import "./styles.scss";
import Filtros from "./components/Filtros";
import { gerarParametrosConsulta } from "helpers/utilities";
import ListagemSolicitacoes from "./components/ListagemSolicitacoes";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState();
  const [filtros, setFiltros] = useState();
  const [total, setTotal] = useState();
  const [page, setPage] = useState();
  const [ativos, setAtivos] = useState([]);
  const [buscaPorParametro, setBuscaPorParametro] = useState(false);
  const [numeroSolicitacaoInicial, setNumeroSolicitacaoInicial] = useState("");
  const queryString = window.location.search;

  const inicioResultado = useRef();

  const buscarSolicitacoes = async page => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getListagemSolicitacaoAlteracao(params);
    setAtivos([]);
    if (response.data.count) {
      setSolicitacoes(response.data.results);
      setTotal(response.data.count);
      inicioResultado.current.scrollIntoView();
    } else {
      setTotal(response.data.count);
      setSolicitacoes();
    }
    setCarregando(false);
    if (response.data.count === 1 && buscaPorParametro) {
      setBuscaPorParametro(false);
      setAtivos([response.data.results[0].uuid]);
    }
  };

  useEffect(() => {
    if (queryString) {
      const urlParams = new URLSearchParams(window.location.search);
      const codigo = urlParams.get("numero_solicitacao");
      const filtro = {
        numero_solicitacao: codigo
      };
      setBuscaPorParametro(true);
      setNumeroSolicitacaoInicial(codigo);
      setFiltros({ ...filtro });
    }
  }, []);

  useEffect(() => {
    if (filtros) {
      buscarSolicitacoes(1);
      setPage(1);
    }
  }, [filtros]);

  const nextPage = page => {
    buscarSolicitacoes(page);
    setPage(page);
  };

  const updatePage = () => {
    buscarSolicitacoes(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-gestao-solicitacao-alteracao">
        <div className="card-body gestao-solicitacao-alteracao">
          <Filtros
            setFiltros={setFiltros}
            setSolicitacoes={setSolicitacoes}
            setTotal={setTotal}
            solicitacoes={solicitacoes}
            numeroSolicitacaoInicial={numeroSolicitacaoInicial}
            page={page}
            inicioResultado={inicioResultado}
          />
          {solicitacoes && (
            <>
              <br />
              <hr />
              <br />
              <ListagemSolicitacoes
                solicitacoes={solicitacoes}
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
