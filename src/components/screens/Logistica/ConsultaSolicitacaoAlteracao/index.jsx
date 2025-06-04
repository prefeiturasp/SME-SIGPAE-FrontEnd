import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import "./styles.scss";
import Filtros from "./components/Filtros";
import ListagemSolicitacoes from "./components/ListagemSolicitacoes";
import { getListagemSolicitacaoAlteracao } from "../../../../services/logistica.service";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao";

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

  const buscarSolicitacoes = async (page) => {
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
        numero_solicitacao: codigo,
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

  const nextPage = (page) => {
    buscarSolicitacoes(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-gestao-solicitacao-alteracao">
        <div className="card-body gestao-solicitacao-alteracao">
          <Filtros
            setFiltros={setFiltros}
            setSolicitacoes={setSolicitacoes}
            solicitacoes={solicitacoes}
            numeroSolicitacaoInicial={numeroSolicitacaoInicial}
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
