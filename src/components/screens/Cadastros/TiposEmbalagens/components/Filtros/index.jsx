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
  CADASTRO_TIPO_EMBALAGEM,
} from "src/configs/constants";
import { getListaFiltradaAutoComplete } from "src/helpers/autoComplete";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";

export default ({
  setFiltros,
  nomesEmbalagens,
  abreviacaoEmbalagens,
  setEmbalagens,
  setTotal,
}) => {
  const onSubmit = async (values) => {
    const filtros = { ...values };
    setFiltros({ ...filtros });
  };

  const onClear = () => {
    setEmbalagens(undefined);
    setTotal(undefined);
  };

  return (
    <div className="filtros-embalagens">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <>
            <div className="row">
              <div className="col-6">
                <Field
                  component={AutoCompleteField}
                  dataSource={getListaFiltradaAutoComplete(
                    nomesEmbalagens,
                    values.nome
                  )}
                  label="Filtrar por Nome do Tipo de Embalagem"
                  name="nome"
                  placeholder="Digite o nome do Tipo da Embalagem"
                  className="filtro-inputs-embalagens"
                  toUppercaseActive
                />
              </div>
              <div className="col-3">
                <Field
                  component={AutoCompleteField}
                  dataSource={getListaFiltradaAutoComplete(
                    abreviacaoEmbalagens,
                    values.abreviacao
                  )}
                  label="Filtrar por Abreviação"
                  name="abreviacao"
                  placeholder="Digite a Abreviação"
                  className="filtro-inputs-embalagens"
                  maxlength="3"
                  toUppercaseActive
                  proibeNumeros
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="Filtrar por Data do Cadastro"
                  name="data_cadastro"
                  className="filtro-inputs-embalagens"
                  placeholder="Selecione a Data"
                  minDate={null}
                  writable={false}
                />
              </div>
            </div>
          </>
        )}
      </CollapseFiltros>

      <div className="mt-4 mb-4">
        <NavLink
          to={`/${CONFIGURACOES}/${CADASTROS}/${CADASTRO_TIPO_EMBALAGEM}`}
        >
          <Botao
            texto="Cadastrar Tipo de Embalagem"
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
