import React from "react";
import moment from "moment";
import { Field } from "react-final-form";
import { NavLink } from "react-router-dom";

import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import { InputComData } from "src/components/Shareable/DatePicker";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputText } from "src/components/Shareable/Input/InputText";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";
import { CADASTRO_CRONOGRAMA, PRE_RECEBIMENTO } from "src/configs/constants";

import { montarOptionsStatus } from "./utils";
import "./style.scss";
import {
  usuarioEhCodaeDilog,
  usuarioEhCronograma,
} from "../../../../../../helpers/utilities";

export default ({
  setFiltros,
  setCronogramas,
  setTotal,
  inicioResultado,
  armazens,
}) => {
  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (filtros?.status) filtros.status = filtros.status.flat();
    setFiltros({ ...filtros });
  };

  const onClear = () => {
    setCronogramas(undefined);
    setTotal(undefined);
  };

  return (
    <div className="filtros-cronograma-de-entrega">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <>
            <div className="row">
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Filtrar por Nome do Produto"
                  dataTestId="nome_produto"
                  name="nome_produto"
                  placeholder="Digite o produto"
                  className="input-busca-cronograma"
                />
              </div>
              {usuarioEhEmpresaFornecedor() ? (
                <div className="col-6">
                  <Field
                    component={MultiSelect}
                    label="Armazém"
                    disableSearch
                    name="armazem"
                    multiple
                    nomeDoItemNoPlural="armazéns"
                    placeholder="Selecione o Armazém"
                    options={armazens}
                  />
                </div>
              ) : (
                <div className="col-6">
                  <Field
                    component={InputText}
                    label="Filtrar por Nome da Empresa"
                    name="nome_empresa"
                    placeholder="Digite o nome da empresa"
                    className="input-busca-cronograma"
                  />
                </div>
              )}
            </div>
            <div className="row mt-3">
              {!usuarioEhEmpresaFornecedor() && (
                <div className="col-3">
                  <Field
                    component={InputText}
                    label="Filtrar por N° do Cronograma"
                    name="numero"
                    placeholder="Digite o n° do Cronograma"
                    className="input-busca-cronograma"
                  />
                </div>
              )}
              <div
                className={`col-${usuarioEhEmpresaFornecedor() ? "6" : "3"}`}
              >
                <Field
                  component={MultiSelect}
                  label="Filtrar por Status"
                  disableSearch
                  name="status"
                  multiple
                  nomeDoItemNoPlural="status"
                  options={montarOptionsStatus()}
                />
              </div>

              <div className="col-3">
                <Field
                  component={InputComData}
                  label="Filtrar por Período de Recebimento"
                  name="data_inicial"
                  className="data-field-cronograma"
                  placeholder="De"
                  minDate={null}
                  maxDate={
                    values.data_final
                      ? moment(values.data_final, "DD/MM/YYYY")._d
                      : null
                  }
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="&nbsp;"
                  name="data_final"
                  className="data-field-cronograma"
                  popperPlacement="bottom-end"
                  placeholder="Até"
                  minDate={
                    values.data_inicial
                      ? moment(values.data_inicial, "DD/MM/YYYY")._d
                      : null
                  }
                  maxDate={null}
                />
              </div>
            </div>
          </>
        )}
      </CollapseFiltros>

      <div className="botoes pt-4" ref={inicioResultado}>
        {(usuarioEhCronograma() || usuarioEhCodaeDilog()) && (
          <NavLink to={`/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA}`}>
            <Botao
              texto="Cadastrar Cronograma"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              onClick={() => {}}
            />
          </NavLink>
        )}
      </div>
    </div>
  );
};
