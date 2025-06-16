import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import ListagemLaboratorios from "./components/ListagemLaboratorios";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  getLaboratorios,
  getListaLaboratorios,
} from "src/services/laboratorio.service";
import { Paginacao } from "src/components/Shareable/Paginacao";
import "./styles.scss";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(undefined);
  const [nomesLaboratorios, setNomesLaboratorios] = useState([]);
  const [cnpjsLaboratorios, setCnpjsLaboratorios] = useState([]);
  const [filtros, setFiltros] = useState();
  const [page, setPage] = useState();
  const [total, setTotal] = useState();

  useEffect(() => {
    buscaDadosAutoComplete();
  }, []);

  useEffect(() => {
    if (filtros) {
      buscaResultado(1);
      setPage(1);
    }
  }, [filtros]);

  const buscaDadosAutoComplete = async () => {
    const response = await getListaLaboratorios();
    const nomes = response.data.results.map((e) => e.nome);
    const cnpjs = response.data.results.map((e) => e.cnpj);
    setNomesLaboratorios(nomes);
    setCnpjsLaboratorios(cnpjs);
  };

  const buscaResultado = async (page) => {
    setCarregando(true);

    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getLaboratorios(params);
    if (response.data.count) {
      setResultado(response.data.results);
      setTotal(response.data.count);
    } else {
      setTotal(response.data.count);
      setResultado([]);
    }
    setCarregando(false);
  };

  const nextPage = (page) => {
    buscaResultado(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-laboratorios">
        <div className="card-body laboratorios">
          <Filtros
            setFiltros={setFiltros}
            nomesLaboratorios={nomesLaboratorios}
            cnpjsLaboratorios={cnpjsLaboratorios}
            setTotal={setTotal}
            setResultado={setResultado}
          />
          {resultado && (
            <>
              <hr />
              <ListagemLaboratorios laboratorios={resultado} />
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
