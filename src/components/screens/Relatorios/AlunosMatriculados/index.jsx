import React, { Fragment, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import {
  getFiltros,
  filtrarAlunosMatriculados
} from "services/alunosMatriculados.service";
import { formataOpcoes } from "./helpers";
import { Filtros } from "./componentes/Filtros";
import { TabelaResultado } from "./componentes/TabelaResultado";
import { Spin } from "antd";
import { toastError } from "components/Shareable/Toast/dialogs";
import { deepCopy } from "helpers/utilities";
import { Paginacao } from "components/Shareable/Paginacao";
import { getFaixasEtarias } from "services/faixaEtaria.service";
import { formataOpcoesDropdown } from "./helpers";
import "./style.scss";

export const AlunosMatriculados = () => {
  const [carregando, setCarregando] = useState(true);
  const [filtrando, setFiltrando] = useState(false);
  const [listaOpcoes, setListaOpcoes] = useState(undefined);
  const [dres, setDres] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [tiposUnidades, setTiposUnidades] = useState([]);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState([]);
  const [total, setTotal] = useState(undefined);
  const [page, setPage] = useState(10);
  const [resultado, setResultado] = useState(undefined);
  const [filtros, setFiltros] = useState(undefined);
  const [faixasEtarias, setFaixasEtarias] = useState(undefined);
  const [showPeridosFaixas, setShowPeriodosFaixas] = useState([]);

  const getOpcoesFiltros = async () => {
    const response = await getFiltros();
    if (response.status === HTTP_STATUS.OK) {
      setListaOpcoes(response.data);
      setLotes(formataOpcoes(response.data.lotes));
      setDres(formataOpcoes(response.data.diretorias_regionais));
      setTiposUnidades(formataOpcoes(response.data.tipos_unidade_escolar));
      setUnidadesEducacionais(formataOpcoes(response.data.escolas));
    } else {
      toastError("Erro ao carregar filtros.");
    }
    setCarregando(false);
  };

  const getTodasFaixasEtarias = async () => {
    const response = await getFaixasEtarias();
    if (response.status === HTTP_STATUS.OK) {
      setFaixasEtarias(response.data.results);
    } else {
      toastError("Erro ao carregar faixas etárias.");
    }
  };

  const onPageChanged = async (page, values) => {
    setFiltrando(true);
    let _values = deepCopy(values);
    _values["limit"] = 10;
    _values["offset"] = (page - 1) * _values["limit"];
    setPage(page);

    const response = await filtrarAlunosMatriculados(_values);
    if (response.status === HTTP_STATUS.OK) {
      setResultado(response.data.results);
      setShowPeriodosFaixas(formataOpcoesDropdown(response.data.results));
    } else {
      toastError(
        "Houve um erro ao trocar de página, tente novamente mais tarde"
      );
    }
    setFiltrando(false);
  };

  useEffect(() => {
    getOpcoesFiltros();
    getTodasFaixasEtarias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card relatorio-solicitacoes-alimentacao mt-3">
      <div className="card-body">
        <Spin tip="Carregando..." spinning={carregando}>
          <Filtros
            dres={dres}
            lotes={lotes}
            tiposUnidades={tiposUnidades}
            unidadesEducacionais={unidadesEducacionais}
            listaOpcoes={listaOpcoes}
            setFiltrando={value => setFiltrando(value)}
            setPage={value => setPage(value)}
            setFiltros={value => setFiltros(value)}
            setResultado={value => setResultado(value)}
            setTotal={value => setTotal(value)}
            setShowPeriodosFaixas={lista => setShowPeriodosFaixas(lista)}
          />
        </Spin>
        <Spin tip="Filtrando..." spinning={filtrando}>
          {total > 0 && resultado && resultado.length > 0 && (
            <Fragment>
              <TabelaResultado
                resultado={resultado}
                faixasEtarias={faixasEtarias}
                showPeridosFaixas={showPeridosFaixas}
                setShowPeriodosFaixas={lista => setShowPeriodosFaixas(lista)}
              />
              <Paginacao
                onChange={page => onPageChanged(page, filtros)}
                total={total}
                pageSize={10}
                current={page}
              />
            </Fragment>
          )}
        </Spin>
        {!filtrando && resultado && resultado.length === 0 && (
          <div className="sem-resultado-alunos-matriculados">
            Não há alunos matriculados para os filtros selecionados.
          </div>
        )}
      </div>
    </div>
  );
};
