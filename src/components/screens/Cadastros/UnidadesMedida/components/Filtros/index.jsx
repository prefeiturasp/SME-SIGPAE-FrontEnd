import React from "react";
import { Field } from "react-final-form";
import { InputComData } from "src/components/Shareable/DatePicker";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { NavLink } from "react-router-dom";
import {
  CADASTROS,
  CONFIGURACOES,
  CADASTRO_UNIDADE_MEDIDA,
} from "src/configs/constants";
import { getListaFiltradaAutoComplete } from "src/helpers/autoComplete";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";

export default ({
  setFiltros,
  nomesUnidadesMedida,
  abreviacoesUnidadesMedida,
  setUnidadesMedida,
  setTotal,
}) => {
  const onSubmit = async (values) => {
    const filtros = { ...values };
    setFiltros({ ...filtros });
  };

  const onClear = () => {
    setUnidadesMedida(undefined);
    setTotal(undefined);
  };

  return (
    <div className="filtros-cadastros">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <div className="row">
            <div className="col-6">
              <Field
                component={AutoCompleteField}
                dataSource={getListaFiltradaAutoComplete(
                  nomesUnidadesMedida,
                  values.nome
                )}
                label="Filtrar por Nome da Unidade de Medida"
                name="nome"
                placeholder="Digite o nome da Unidade de Medida"
                className="filtro-inputs"
                toUppercaseActive
              />
            </div>
            <div className="col-3">
              <Field
                component={AutoCompleteField}
                dataSource={getListaFiltradaAutoComplete(
                  abreviacoesUnidadesMedida,
                  values.abreviacao
                )}
                label="Filtrar por Abreviação"
                name="abreviacao"
                placeholder="Digite a Abreviação"
                className="filtro-inputs"
                toLowerCaseActive
              />
            </div>
            <div className="col-3">
              <Field
                component={InputComData}
                label="Filtrar por Data do Cadastro"
                name="data_cadastro"
                className="filtro-inputs"
                placeholder="Selecione a Data"
                minDate={null}
                writable={false}
              />
            </div>
          </div>
        )}
      </CollapseFiltros>
      <div className="mt-4 mb-4">
        <NavLink
          to={`/${CONFIGURACOES}/${CADASTROS}/${CADASTRO_UNIDADE_MEDIDA}`}
        >
          <Botao
            texto="Cadastrar Unidade de Medida"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            onClick={() => {}}
            className="float-start"
          />
        </NavLink>
      </div>
    </div>
  );
};
