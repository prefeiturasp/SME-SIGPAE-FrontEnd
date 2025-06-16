import { Spin } from "antd";
import React, { useState } from "react";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Paginacao } from "src/components/Shareable/Paginacao";

import { getRelatorioQuantitativoDiagDietaEsp } from "src/services/dietaEspecial.service";
import { imprimeRelatorioQuantitativoDiagDietaEsp } from "src/services/relatorios";

import FormFiltros from "./components/FormFiltros";
import TabelaRelatorio from "./components/TabelaRelatorio";

import "./styles.scss";
import { getCabecalhoPorFiltros } from "src/helpers/dietaEspecial";

export default () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagTotal, setPagTotal] = useState(0);
  const [dadosRelatorio, setDadosRelatorio] = useState();
  const [formValues, setFormValues] = useState();

  const atualizaDados = async (params, page) => {
    setLoading(true);
    const response = await getRelatorioQuantitativoDiagDietaEsp(params, page);
    setLoading(false);
    setPagTotal(response.data.count);
    setDadosRelatorio(response.data.results);
  };

  const submit = async (formValuesSubmit) => {
    atualizaDados(formValuesSubmit);
    setFormValues(formValuesSubmit);
  };

  const onPaginationChange = async (page) => {
    atualizaDados(formValues, page);
    setPage(page);
  };

  const imprimeRelatorio = () => {
    imprimeRelatorioQuantitativoDiagDietaEsp(formValues);
  };

  return (
    <Spin tip="Carregando..." spinning={loading}>
      <div className="card mt-3 relatorio-quantitativo-solic-dieta-esp">
        <div className="card-body">
          <FormFiltros
            onSubmit={submit}
            loading={loading}
            setLoading={setLoading}
          />
          {!loading && dadosRelatorio && dadosRelatorio.length === 0 && (
            <div className="mensagem-sem-registros mt-3">
              Não foi encontrado dieta especial para filtragem realizada
            </div>
          )}
          {!loading && dadosRelatorio && dadosRelatorio.length !== 0 && (
            <>
              <div className="row">
                <div className="col">{getCabecalhoPorFiltros(formValues)}</div>
              </div>
              <TabelaRelatorio
                dadosRelatorio={dadosRelatorio}
                filtros={formValues}
              />
              <Paginacao
                total={pagTotal}
                onChange={onPaginationChange}
                current={page}
                pageSize={10}
              />
              <div className="row row-botao-imprimir">
                <Botao
                  type={BUTTON_TYPE.BUTTON}
                  texto="Imprimir"
                  style={BUTTON_STYLE.BLUE}
                  icon={BUTTON_ICON.PRINT}
                  className="float-end"
                  onClick={imprimeRelatorio}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
