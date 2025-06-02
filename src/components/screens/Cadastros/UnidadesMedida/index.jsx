import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import ListagemUnidadesMedida from "./components/ListagemUnidadesMedida";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  getUnidadesMedida,
  getNomesEAbreviacoesUnidadesMedida,
} from "src/services/qualidade.service";
import { Paginacao } from "src/components/Shareable/Paginacao";
import "./styles.scss";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState(undefined);
  const [nomesUnidadesMedida, setNomesUnidadesMedida] = useState([]);
  const [abreviacoesUnidadesMedida, setAbreviacoesUnidadesMedida] = useState(
    []
  );
  const [filtros, setFiltros] = useState();
  const [page, setPage] = useState();
  const [total, setTotal] = useState();

  useEffect(() => {
    buscaDadosAutoComplete();
  }, []);

  useEffect(() => {
    if (filtros) {
      buscarResultados(1);
      setPage(1);
    }
  }, [filtros]);

  const buscaDadosAutoComplete = async () => {
    const nomesEAbreviacoes = await getNomesEAbreviacoesUnidadesMedida();
    const nomes = nomesEAbreviacoes.data.results.map((e) => e.nome);
    const abreviacoes = nomesEAbreviacoes.data.results.map((e) => e.abreviacao);
    setNomesUnidadesMedida(nomes);
    setAbreviacoesUnidadesMedida(abreviacoes);
  };

  const buscarResultados = async (pageNumber) => {
    setCarregando(true);

    const params = gerarParametrosConsulta({ page: pageNumber, ...filtros });
    const response = await getUnidadesMedida(params);

    response.data.count
      ? setUnidadesMedida(response.data.results)
      : setUnidadesMedida([]);

    setTotal(response.data.count);

    setCarregando(false);
  };

  const nextPage = (page) => {
    buscarResultados(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-unidades-medida">
        <div className="card-body unidades-medida">
          <Filtros
            setFiltros={setFiltros}
            nomesUnidadesMedida={nomesUnidadesMedida}
            abreviacoesUnidadesMedida={abreviacoesUnidadesMedida}
            setTotal={setTotal}
            setUnidadesMedida={setUnidadesMedida}
          />

          {unidadesMedida && (
            <>
              <hr />
              <ListagemUnidadesMedida unidadesMedida={unidadesMedida} />
              <div className="row">
                <div className="col">
                  <Paginacao current={page} total={total} onChange={nextPage} />
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
